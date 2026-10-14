/*
 * kuis.js: kuis pilihan ganda dari SOLAR_DATA.quiz.
 * Tiga layar: pengaturan (topik dan jumlah soal), soal satu per satu, lalu hasil dan pembahasan.
 * Skor terbaik tiap topik disimpan lewat App.store.
 */
(function () {
  'use strict';

  if (!window.App || !App.data) return;

  var TOPICS = [
    { key: 'semua', label: 'Semua topik' },
    { key: 'planet', label: 'Planet' },
    { key: 'matahari-bulan', label: 'Matahari & Bulan' },
    { key: 'gerak-orbit', label: 'Gerak & orbit' },
    { key: 'benda-kecil', label: 'Benda kecil' },
    { key: 'sejarah', label: 'Sejarah' }
  ];

  // Halaman untuk mempelajari lagi materi sebuah topik: [alamat, nama].
  var RELATED = {
    semua: [['glosarium.html', 'Glosarium']],
    planet: [['ensiklopedia.html', 'Ensiklopedia']],
    'matahari-bulan': [['ensiklopedia.html#sun', 'Ensiklopedia'], ['bulan.html', 'Fase Bulan']],
    'gerak-orbit': [['kepler.html', 'Hukum Kepler']],
    'benda-kecil': [['glosarium.html', 'Glosarium']],
    sejarah: [['sejarah.html', 'Sejarah']]
  };

  var STORE_KEY = 'kuis-terbaik';

  function byId(id) { return document.getElementById(id); }

  var quiz = App.data.quiz || [];
  var root = byId('quiz');
  var screens = { start: byId('screen-start'), play: byId('screen-play'), result: byId('screen-result') };
  var els = {
    form: byId('setup-form'),
    topicList: byId('topic-list'),
    lengthChoice: byId('length-choice'),
    summary: byId('setup-summary'),
    progress: byId('q-progress'),
    meta: byId('q-meta'),
    question: byId('q-text'),
    options: byId('q-options'),
    feedback: byId('q-feedback'),
    verdict: byId('q-verdict'),
    correct: byId('q-correct'),
    explanation: byId('q-explanation'),
    next: byId('q-next'),
    rTitle: byId('r-title'),
    rScore: byId('r-score'),
    rOf: byId('r-of'),
    rMessage: byId('r-message'),
    rBest: byId('r-best'),
    again: byId('r-again'),
    review: byId('r-review')
  };

  var state = { topic: 'semua', length: 10, round: [], index: 0, score: 0, phase: 'start' };
  var changedAt = 0; // saat terakhir layar atau soal berganti
  // Soal yang sudah keluar per topik, agar "Ulangi dengan soal lain" memakai soal yang belum muncul.
  var seen = {};

  function topicLabel(key) {
    for (var k = 0; k < TOPICS.length; k++) if (TOPICS[k].key === key) return TOPICS[k].label;
    return key;
  }

  function valid(q) {
    return q && q.question && Array.isArray(q.options) && q.options.length >= 2 &&
      q.answer >= 0 && q.answer < q.options.length;
  }

  // Indeks soal milik sebuah topik. Soal dengan teks yang sama hanya dihitung sekali.
  function pool(topic) {
    var out = [], texts = {};
    quiz.forEach(function (q, i) {
      if (!valid(q) || texts[q.question]) return;
      if (topic === 'semua' || q.topic === topic) {
        texts[q.question] = true;
        out.push(i);
      }
    });
    return out;
  }

  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = list[i]; list[i] = list[j]; list[j] = t;
    }
    return list;
  }

  function hasFresh(topic) {
    var used = seen[topic] || {};
    return pool(topic).some(function (i) { return !used[i]; });
  }

  /* ---------- Skor terbaik ---------- */

  function readBest() {
    var raw = App.store.get(STORE_KEY, {});
    var out = {};
    if (raw && typeof raw === 'object') {
      Object.keys(raw).forEach(function (k) {
        var b = raw[k];
        if (b && isFinite(b.score) && isFinite(b.total) && b.total > 0 && b.score >= 0 && b.score <= b.total) {
          out[k] = { score: b.score, total: b.total };
        }
      });
    }
    return out;
  }

  // Persentase lebih tinggi menang; persentase sama dengan soal lebih banyak juga menang.
  function isBetter(score, total, prev) {
    var a = score / total, b = prev.score / prev.total;
    return a > b || (a === b && total > prev.total);
  }

  /* ---------- Layar ---------- */

  function show(name) {
    Object.keys(screens).forEach(function (k) { screens[k].hidden = k !== name; });
    changedAt = Date.now();
  }

  // Bila awal layar baru tertutup kepala halaman atau jauh di bawah, gulir sampai tepat di bawah kepala
  // (scrollIntoView memakai scroll-padding-top dari style.css).
  function reveal(el, always) {
    var top = el.getBoundingClientRect().top;
    var pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    if (always || top < pad || top > window.innerHeight * 0.6) el.scrollIntoView({ block: 'start' });
  }

  function renderTopics() {
    var best = readBest();
    els.topicList.innerHTML = TOPICS.map(function (t) {
      var n = pool(t.key).length;
      if (!n) return '';
      var b = best[t.key];
      return '<label class="topic">' +
        '<input type="radio" name="topic" value="' + t.key + '"' + (t.key === state.topic ? ' checked' : '') + '>' +
        '<span class="topic__name">' + App.esc(t.label) + '</span>' +
        '<span class="topic__meta num">' + n + ' soal · ' +
        (b ? 'terbaik ' + b.score + ' dari ' + b.total : 'belum ada skor') + '</span>' +
        '</label>';
    }).join('');
  }

  function renderSummary() {
    var n = pool(state.topic).length, len = state.length;
    var scope = state.topic === 'semua' ? 'semua topik' : 'topik ' + topicLabel(state.topic);
    var text;
    if (n > len) {
      text = len + ' soal dipilih acak dari ' + n + ' soal ' + scope + '.';
    } else if (n === len) {
      text = 'Kuis memakai semua ' + n + ' soal ' + scope + ' dengan urutan acak.';
    } else {
      text = scope.charAt(0).toUpperCase() + scope.slice(1) + ' hanya punya ' + n +
        ' soal, jadi kuis memakai semuanya, bukan ' + len + ' soal.';
    }
    els.summary.textContent = text;
  }

  function toStart() {
    state.phase = 'start';
    renderTopics();
    renderSummary();
    show('start');
    reveal(root);
    var checked = els.topicList.querySelector('input:checked');
    if (checked) checked.focus({ preventScroll: true });
  }

  function startRound() {
    var all = pool(state.topic);
    var used = seen[state.topic] || {};
    var fresh = shuffle(all.filter(function (i) { return !used[i]; }));
    var old = shuffle(all.filter(function (i) { return used[i]; }));
    var picked = fresh.concat(old).slice(0, state.length);
    picked.forEach(function (i) { used[i] = true; });
    // Semua soal topik ini sudah pernah keluar: mulai hitungan baru dari putaran ini.
    if (Object.keys(used).length >= all.length) {
      used = {};
      picked.forEach(function (i) { used[i] = true; });
    }
    seen[state.topic] = used;

    state.round = picked.map(function (qi) {
      var order = shuffle(quiz[qi].options.map(function (_, k) { return k; }));
      return { qi: qi, order: order, choice: null };
    });
    state.index = 0;
    state.score = 0;
    show('play');
    renderQuestion();
    // Awal putaran: soal pertama selalu dimulai tepat di bawah kepala halaman.
    reveal(screens.play, true);
  }

  function renderQuestion() {
    var item = state.round[state.index];
    var q = quiz[item.qi];
    els.progress.textContent = 'Soal ' + (state.index + 1) + ' dari ' + state.round.length;
    els.meta.textContent = topicLabel(q.topic) + (q.difficulty ? ' · tingkat ' + q.difficulty : '');
    els.question.textContent = q.question;
    els.options.innerHTML = item.order.map(function (orig, pos) {
      return '<li><button type="button" class="quiz-option" data-pos="' + pos + '">' +
        '<span class="quiz-option__key" aria-hidden="true">' + (pos + 1) + '</span>' +
        '<span class="quiz-option__text">' + App.esc(q.options[orig]) + '</span>' +
        '<span class="quiz-option__tag"></span>' +
        '</button></li>';
    }).join('');
    els.feedback.hidden = true;
    state.phase = 'question';
    changedAt = Date.now();
    reveal(screens.play);
    els.question.focus({ preventScroll: true });
  }

  function answer(pos) {
    if (state.phase !== 'question') return;
    var item = state.round[state.index];
    var q = quiz[item.qi];
    if (!(pos >= 0 && pos < item.order.length)) return;
    item.choice = item.order[pos];
    var right = item.choice === q.answer;
    if (right) state.score++;
    state.phase = 'answered';

    var buttons = els.options.querySelectorAll('.quiz-option');
    Array.prototype.forEach.call(buttons, function (btn, p) {
      var tag = btn.querySelector('.quiz-option__tag');
      btn.disabled = true;
      if (item.order[p] === q.answer) {
        btn.classList.add('is-correct');
        tag.textContent = 'Jawaban benar';
      } else if (p === pos) {
        btn.classList.add('is-wrong');
        tag.textContent = 'Jawabanmu';
      }
    });

    els.feedback.className = 'quiz-feedback ' + (right ? 'is-good' : 'is-bad');
    els.verdict.textContent = right ? 'Benar' : 'Salah';
    els.correct.textContent = right ? '' : 'Jawaban yang benar: ' + q.options[q.answer];
    els.correct.hidden = right;
    els.explanation.textContent = q.explanation || '';
    els.next.textContent = state.index + 1 < state.round.length ? 'Soal berikutnya' : 'Lihat hasil';
    els.feedback.hidden = false;
    els.feedback.focus();
  }

  function next() {
    if (state.phase !== 'answered') return;
    state.index++;
    if (state.index < state.round.length) renderQuestion();
    else renderResult();
  }

  function bandMessage(score, total, wrongCount) {
    var r = score / total, text;
    if (score === total) text = 'Semua jawabanmu benar.';
    else if (r >= 0.8) text = 'Hampir semua jawabanmu benar.';
    else if (r >= 0.5) text = 'Separuh atau lebih jawabanmu benar.';
    else if (score > 0) text = 'Kurang dari separuh jawabanmu benar.';
    else text = 'Belum ada jawaban yang benar kali ini.';
    var html = App.esc(text);
    if (wrongCount) {
      var links = (RELATED[state.topic] || []).map(function (r) {
        return '<a href="' + r[0] + '">' + App.esc(r[1]) + '</a>';
      });
      html += ' Pembahasan soal yang salah ada di bawah' + (links.length
        ? ', dan materinya bisa kamu pelajari lagi di halaman ' + links.join(' dan ') + '.'
        : '.');
    }
    return html;
  }

  function renderResult() {
    state.phase = 'result';
    var total = state.round.length, score = state.score;
    var wrong = [];
    state.round.forEach(function (it, n) {
      if (it.choice !== quiz[it.qi].answer) wrong.push({ item: it, number: n + 1 });
    });

    els.rTitle.textContent = 'Hasil kuis: ' + topicLabel(state.topic);
    els.rScore.textContent = score;
    els.rOf.textContent = 'dari ' + total + ' soal benar (' + Math.round(score / total * 100) + '%)';
    els.rMessage.innerHTML = bandMessage(score, total, wrong.length);

    var best = readBest(), prev = best[state.topic];
    if (!prev || isBetter(score, total, prev)) {
      best[state.topic] = { score: score, total: total };
      App.store.set(STORE_KEY, best);
      els.rBest.textContent = prev
        ? 'Skor terbaik baru untuk topik ini. Sebelumnya ' + prev.score + ' dari ' + prev.total + '.'
        : 'Ini skor pertamamu untuk topik ini, jadi tercatat sebagai skor terbaik.';
    } else {
      els.rBest.textContent = 'Skor terbaikmu untuk topik ini: ' + prev.score + ' dari ' + prev.total + '.';
    }

    els.again.textContent = hasFresh(state.topic) ? 'Ulangi dengan soal lain' : 'Ulangi dengan urutan baru';

    els.review.innerHTML = wrong.length ? '<h3>Pembahasan jawaban yang salah</h3><ol class="review-list">' +
      wrong.map(function (w) {
        var q = quiz[w.item.qi];
        return '<li>' +
          '<p class="review-num muted small">Soal ' + w.number + '</p>' +
          '<p class="review-q">' + App.esc(q.question) + '</p>' +
          '<dl class="review-answers">' +
          '<div><dt>Jawabanmu</dt><dd>' + App.esc(q.options[w.item.choice]) + '</dd></div>' +
          '<div><dt>Jawaban benar</dt><dd>' + App.esc(q.options[q.answer]) + '</dd></div>' +
          '</dl>' +
          '<p>' + App.esc(q.explanation || '') + '</p>' +
          '</li>';
      }).join('') + '</ol>' : '';

    show('result');
    reveal(screens.result);
    els.rTitle.focus({ preventScroll: true });
  }

  /* ---------- Kejadian ---------- */

  els.topicList.addEventListener('change', function (e) {
    if (e.target.name !== 'topic') return;
    state.topic = e.target.value;
    renderSummary();
  });

  els.lengthChoice.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-length]');
    if (!btn) return;
    state.length = Number(btn.getAttribute('data-length'));
    Array.prototype.forEach.call(els.lengthChoice.querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', String(b === btn));
    });
    renderSummary();
  });

  els.form.addEventListener('submit', function (e) {
    e.preventDefault();
    startRound();
  });

  root.addEventListener('click', function (e) {
    var opt = e.target.closest('.quiz-option');
    if (opt) {
      answer(Number(opt.getAttribute('data-pos')));
      return;
    }
    if (e.target.closest('[data-action="topics"]')) toStart();
  });

  els.next.addEventListener('click', next);
  els.again.addEventListener('click', startRound);

  // Setelah layar berganti, jawaban soal baru atau tautan kaki halaman bisa bergeser ke bawah kursor.
  // Klik kedua dari klik atau ketukan ganda lalu diabaikan; klik dari papan ketik (detail 0) tidak.
  document.addEventListener('click', function (e) {
    if (e.detail && Date.now() - changedAt < 400) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Angka 1-4 menjawab; Enter lanjut setelah menjawab (tombol dan tautan tetap memakai Enter bawaannya).
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    var t = e.target;
    if (t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (state.phase === 'question' && /^[1-9]$/.test(e.key)) {
      var pos = Number(e.key) - 1;
      if (pos < state.round[state.index].order.length) {
        e.preventDefault();
        answer(pos);
      }
    } else if (state.phase === 'answered' && e.key === 'Enter') {
      if (t.closest && t.closest('button, a, summary')) return;
      e.preventDefault();
      next();
    }
  });

  /* ---------- Awal ---------- */

  root.hidden = false;
  if (!pool('semua').length) {
    root.innerHTML = '<p class="notice">Soal kuis belum tersedia di data situs ini. Sementara itu, kamu bisa membaca <a href="glosarium.html">Glosarium</a>.</p>';
    return;
  }
  if (!pool(state.topic).length) {
    for (var k = 0; k < TOPICS.length; k++) {
      if (pool(TOPICS[k].key).length) { state.topic = TOPICS[k].key; break; }
    }
  }
  renderTopics();
  renderSummary();
})();
