// Intro im Spiel: Stefan fährt Hannes und Jonas raus und setzt sie an zwei Ufern aus.
// Kamerafahrten über gemalte Bilder, Erzähler, Originaltöne aus Folge 1, Regen, Motor und Musik aus dem Browser.
// Aufruf: AusgesetztIntro.play({ muted: () => bool, done: () => {} })
window.AusgesetztIntro = (function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.getElementById("intro");
  root.innerHTML = `
    <style>
      .intro .shot { position: absolute; inset: 0; opacity: 0; overflow: hidden; }
      .intro .shot img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform-origin: 50% 50%; will-change: transform; }
      .intro .shot svg { position: absolute; inset: 0; width: 100%; height: 100%; }
      .intro .bar { position: absolute; left: 0; right: 0; height: 7%; background: #000; z-index: 5; }
      .intro canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 4; }
      .intro .ititle { position: absolute; inset: 0; display: grid; place-items: center; z-index: 6; opacity: 0; pointer-events: none; text-align: center; }
      .intro .ititle h1 { margin: 0; font-family: var(--display); font-weight: 700; font-size: clamp(36px, 9vw, 112px); letter-spacing: 0.14em; color: #f4ecd8; text-shadow: 0 4px 24px rgba(0, 0, 0, 0.7); }
      .intro .iday { background: #000; }
      .intro .iday h1 { font-size: clamp(28px, 6vw, 72px); color: var(--accent); }
      .intro .iday p { margin: 8px 0 0; font-family: var(--display); letter-spacing: 0.2em; color: var(--muted); font-size: clamp(11px, 1.6vw, 16px); }
      .intro .isub { position: absolute; left: 50%; bottom: 9.5%; transform: translateX(-50%); z-index: 7; width: 86%; text-align: center; font-weight: 700; font-size: clamp(14px, 2.2vw, 24px); line-height: 1.3; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 2px 6px #000; pointer-events: none; }
      .intro .isub.hannes { color: var(--hannes); } .intro .isub.jonas { color: var(--jonas); }
      .intro .isub.erz { color: var(--erz); font-family: var(--narr); font-style: italic; font-weight: 500; font-size: clamp(13px, 2vw, 22px); width: 78%; }
      .intro .iportrait { position: absolute; z-index: 7; right: 4%; top: 11%; width: 14%; aspect-ratio: 1; border-radius: 50%; overflow: hidden; border: 3px solid #f0b27a; background: #e9e4d8; opacity: 0; }
      .intro .iportrait img { position: absolute; width: 300%; left: -100%; top: -6%; }
      .intro .iskip { position: absolute; right: 2%; top: 9%; z-index: 8; font: inherit; font-weight: 700; padding: 6px 14px; border-radius: 999px; border: 1px solid var(--accent); background: rgba(0, 0, 0, 0.55); color: var(--fg); cursor: pointer; }
    </style>
    <div class="shot" data-s="0"><img src="intro/01-see.jpg" alt=""></div>
    <div class="shot" data-s="1"><img src="intro/02-strasse.jpg" alt=""></div>
    <div class="shot" data-s="2"><img src="intro/03-auto.jpg" alt=""></div>
    <div class="shot" data-s="3"><svg viewBox="0 0 1280 720" aria-label="Karte mit den beiden Aussetzpunkten und dem Treffpunkt">
      <defs><radialGradient id="iVig" cx="50%" cy="50%" r="70%"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient>
      <pattern id="iTrees" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M11,3 L16,15 L6,15 Z" fill="#2a5a2a" opacity="0.7"/></pattern></defs>
      <rect width="1280" height="720" fill="#3f6e36"/><rect width="1280" height="720" fill="url(#iTrees)"/>
      <path d="M210,40 C170,140 150,260 190,360 C230,470 170,560 200,700 L80,700 C40,560 70,420 60,300 C50,180 110,90 140,40 Z" fill="#2a74a8" stroke="#16486c" stroke-width="3"/>
      <path d="M330,120 C360,100 400,110 400,140 C398,170 350,175 330,150 Z" fill="#2a74a8" stroke="#16486c" stroke-width="2"/>
      <path d="M420,560 C470,540 540,560 560,590 C540,620 460,620 420,600 Z" fill="#2a74a8" stroke="#16486c" stroke-width="2"/>
      <path d="M640,520 C700,490 790,500 820,530 C800,580 720,600 660,570 Z" fill="#2a74a8" stroke="#16486c" stroke-width="3"/>
      <path d="M860,470 C930,430 1060,440 1100,480 C1120,530 1020,560 940,540 C890,530 860,510 860,470 Z" fill="#2a74a8" stroke="#16486c" stroke-width="3"/>
      <path d="M980,60 C1000,140 1010,240 1060,330 C1100,400 1180,430 1280,420" stroke="#e6d39a" stroke-width="5" fill="none" opacity="0.75"/>
      <path d="M600,700 C620,640 700,600 780,560 C840,530 900,520 980,500 C1060,480 1150,500 1280,480" stroke="#e6d39a" stroke-width="5" fill="none" opacity="0.75"/>
      <path data-route="j" d="M470,190 C520,230 560,300 520,380 C490,450 560,520 640,560" stroke="#8cc4f4" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path data-route="h" d="M890,430 C850,470 820,500 790,520" stroke="#ff7a5c" stroke-width="7" fill="none" stroke-linecap="round"/>
      <g data-pin="j" opacity="0"><circle cx="470" cy="190" r="13" fill="#4a90d9" stroke="#fff" stroke-width="3"/><text x="492" y="180" font-family="Spectral SC, Georgia, serif" font-size="30" fill="#fff" stroke="#000" stroke-width="5" paint-order="stroke">Aussetzung Jonas</text></g>
      <g data-pin="h" opacity="0"><circle cx="890" cy="430" r="13" fill="#d9534f" stroke="#fff" stroke-width="3"/><text x="912" y="420" font-family="Spectral SC, Georgia, serif" font-size="30" fill="#fff" stroke="#000" stroke-width="5" paint-order="stroke">Aussetzung Hannes</text></g>
      <g data-pin="t" opacity="0"><path d="M720,546 l14,-30 h-28 Z" fill="#e8b044" stroke="#fff" stroke-width="3"/><circle cx="720" cy="508" r="15" fill="#e8b044" stroke="#fff" stroke-width="3"/><text x="720" y="470" text-anchor="middle" font-family="Spectral SC, Georgia, serif" font-size="34" font-weight="700" fill="#f4ecd8" stroke="#000" stroke-width="6" paint-order="stroke">Seepferdchensee</text><text x="720" y="430" text-anchor="middle" font-family="Alegreya Sans, sans-serif" font-size="26" fill="#f4ecd8" stroke="#000" stroke-width="5" paint-order="stroke">Treffpunkt</text></g>
      <rect width="1280" height="720" fill="url(#iVig)"/></svg></div>
    <div class="shot" data-s="4"><img src="intro/04-jonas.jpg" alt=""></div>
    <div class="shot" data-s="5"><img src="intro/05-hannes.jpg" alt=""></div>
    <canvas width="960" height="540"></canvas>
    <div class="bar" style="top:0"></div><div class="bar" style="bottom:0"></div>
    <div class="ititle" data-t="title"><h1>Ausgesetzt</h1></div>
    <div class="ititle iday" data-t="day"><div><h1>Tag 1</h1><p>Willkommen in Schweden</p></div></div>
    <div class="iportrait"><img src="intro/stefan.jpg" alt="Stefan"></div>
    <div class="isub"></div>
    <button type="button" class="iskip">Überspringen</button>`;
  const q = (s) => root.querySelector(s);
  const SHOTS = [
    { t0: 0, t1: 14500, from: { s: 1.04, x: 2, y: 0 }, to: { s: 1.2, x: -3, y: 1 } },
    { t0: 13700, t1: 27000, from: { s: 1.0, x: 0, y: 0 }, to: { s: 1.45, x: 6, y: -12 }, rain: 0.45, motor: 0.5 },
    { t0: 26200, t1: 40000, from: { s: 1.14, x: 0, y: 2 }, to: { s: 1.02, x: 0, y: 0 }, motor: 1 },
    { t0: 39200, t1: 50500, from: { s: 1.0, x: 0, y: 0 }, to: { s: 1.08, x: -2, y: -2 } },
    { t0: 49700, t1: 68000, from: { s: 1.0, x: 0, y: 0 }, to: { s: 1.25, x: 8, y: -5 }, rain: 1 },
    { t0: 67200, t1: 82600, from: { s: 1.25, x: 4, y: -6 }, to: { s: 1.0, x: 0, y: 0 }, rain: 0.8 }
  ].map((s, i) => ({ ...s, el: q(`[data-s="${i}"]`), img: q(`[data-s="${i}"] > *`) }));
  const FADE = 800, MAP0 = 39200, DAY0 = 81800, END = 88500;
  const LINES = [
    { t0: 1000, dur: 11000, who: "erz", src: "intro/stimmen/damien-black/erzaehler-1.mp3", text: "Es gibt Orte im hohen Norden, an denen die Zeit stillsteht. Wo der Nebel über den Seen schläft und die Wälder älter sind als jede Erinnerung." },
    { t0: 15000, dur: 11000, who: "erz", src: "intro/stimmen/damien-black/erzaehler-2.mp3", text: "Und es gibt Männer, die glauben, sie könnten diesen Wäldern trotzen, mit nichts als einem Messer, einem Feuerstahl und einem wasserdichten Packsack." },
    { t0: 27200, dur: 11500, who: "erz", src: "intro/stimmen/damien-black/erzaehler-3.mp3", text: "Zwei von ihnen saßen an jenem Morgen auf der Rückbank, Hannes und Jonas. Am Steuer saß Stefan, der Einzige, der wusste, wohin die Reise ging." },
    { t0: 40500, dur: 9000, who: "erz", src: "intro/stimmen/damien-black/erzaehler-4.mp3", text: "Er würde sie trennen. Jeden an einem anderen Ufer. Und erst am Seepferdchensee sollten sich ihre Wege wieder kreuzen." },
    { t0: 51200, dur: 7370, who: "jonas", src: "intro/ton/jonas-seepferdchen.mp3", text: "Ich zieh jetzt los. Hier, erster See. Dann sehen wir uns in fünf Tagen beim Seepferdchen." },
    { t0: 59000, dur: 1350, who: "jonas", src: "intro/ton/jonas-bis-dann.mp3", text: "Bis dann!" },
    { t0: 61000, dur: 6800, who: "jonas", src: "intro/ton/jonas-waldzerstoerung.mp3", text: "Und so geht er dahin. Die Schneise der Waldzerstörung." },
    { t0: 68600, dur: 1700, who: "hannes", src: "intro/ton/hannes-bis-bald.mp3", text: "Bis bald!" },
    { t0: 71200, dur: 4700, who: "hannes", src: "intro/ton/hannes-wildnis.mp3", text: "Jetzt bin nur noch ich und die Wildnis." },
    { t0: 76800, dur: 2950, who: "hannes", src: "intro/ton/hannes-zecken.mp3", text: "Und die Zecken natürlich auch." },
    { t0: 83200, dur: 5000, who: "erz", src: "intro/stimmen/damien-black/erzaehler-5.mp3", text: "Sieben Tage, zwei Männer und ein endloser Wald. Das Abenteuer beginnt." }
  ];
  const fadeIn = (t, a, b, f = FADE) => Math.max(0, Math.min(1, (t - a) / f, (b - t) / f));
  const ease = (p) => p * p * (3 - 2 * p);
  const lerp = (a, b, p) => a + (b - a) * p;
  let t = 0, last = 0, running = false, opts = null, ac = null, mix = null, rainGain, motorGain, musicGain, chordTimer = null, rainLevel = 0, motorLevel = 0, prevT = 0;

  // ---------- Ton: Regen, Motor, tiefe Streicherfläche, Pauke ----------
  function noise(seconds, brown) {
    const b = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate), d = b.getChannelData(0);
    let v = 0;
    for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; if (brown) { v = (v + 0.02 * w) / 1.02; d[i] = v * 3.5; } else d[i] = w; }
    return b;
  }
  function initAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    mix = ac.createGain(); mix.gain.value = opts.muted() ? 0 : 1; mix.connect(ac.destination);
    const loop = (buf, f, g) => { const s = ac.createBufferSource(); s.buffer = buf; s.loop = true; s.connect(f).connect(g).connect(mix); s.start(); };
    const filt = (type, f) => { const b = ac.createBiquadFilter(); b.type = type; b.frequency.value = f; return b; };
    rainGain = ac.createGain(); rainGain.gain.value = 0; loop(noise(3, false), filt("bandpass", 2400), rainGain);
    motorGain = ac.createGain(); motorGain.gain.value = 0; loop(noise(3, true), filt("lowpass", 180), motorGain);
    musicGain = ac.createGain(); musicGain.gain.value = 0;
    const lp = filt("lowpass", 520); lp.connect(musicGain).connect(mix);
    for (const f of [36.71, 73.42]) { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.value = f < 50 ? 0.22 : 0.1; o.connect(g).connect(musicGain); o.start(); }
    const chords = [[73.42, 110, 146.83, 174.61], [58.27, 116.54, 146.83, 174.61], [87.31, 130.81, 174.61, 220], [65.41, 130.81, 164.81, 196]];
    const voices = chords[0].map((f) => {
      const g = ac.createGain(); g.gain.value = 0.045; g.connect(lp);
      return [0, 7, -6].map((d, j) => { const o = ac.createOscillator(); o.type = j ? "sawtooth" : "triangle"; o.detune.value = d; o.frequency.value = f; o.connect(g); o.start(); return o; });
    });
    let ci = 0;
    const step = () => { const c = chords[ci++ % chords.length]; voices.forEach((osc, i) => osc.forEach((o) => o.frequency.setTargetAtTime(c[i], ac.currentTime, 1.4))); };
    step(); chordTimer = setInterval(step, 8000);
  }
  function hit(vol) {
    if (!ac) return;
    const now = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(92, now); o.frequency.exponentialRampToValueAtTime(48, now + 0.6);
    g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(vol, now + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
    o.connect(g).connect(mix); o.start(now); o.stop(now + 2.3);
  }
  const HITS = [{ t: 11000, v: 0.7 }, { t: MAP0, v: 0.35 }, { t: DAY0, v: 0.8 }, { t: DAY0 + 1400, v: 0.5 }];
  const level = (g, v) => { if (g) g.gain.setTargetAtTime(v, ac.currentTime, 0.25); };
  function syncAudio() {
    const muted = opts.muted();
    for (const l of LINES) {
      const inside = running && t >= l.t0 && t < l.t0 + l.dur;
      if (inside && l.audio.paused && !muted) { try { l.audio.currentTime = Math.max(0, (t - l.t0) / 1000); } catch (e) {} l.audio.play().catch(() => {}); }
      else if ((!inside || muted) && !l.audio.paused) l.audio.pause();
    }
    if (!ac) return;
    mix.gain.value = muted ? 0 : 1;
    const speaking = LINES.some((l) => t >= l.t0 && t < l.t0 + l.dur);
    if (running) for (const h of HITS) if (prevT < h.t && t >= h.t) hit(h.v);
    prevT = t;
    // Musik deutlich unter den Stimmen
    level(musicGain, running ? (t < 50500 ? 1 : t > DAY0 - 300 ? 1.2 : 0.55) * (speaking ? 0.3 : 1) * 0.22 : 0);
    level(rainGain, running ? rainLevel * 0.09 : 0);
    level(motorGain, running ? motorLevel * 0.35 : 0);
  }

  // ---------- Bild ----------
  const sub = q(".isub"), cv = q("canvas"), ctx = cv.getContext("2d");
  let drops = Array.from({ length: reduce ? 0 : 220 }, () => ({ x: Math.random() * 960, y: Math.random() * 540, v: 600 + Math.random() * 400, l: 10 + Math.random() * 12 }));
  function route(path, p) { const len = path.getTotalLength(); p = Math.max(0, Math.min(1, p)); path.style.opacity = p > 0 ? 1 : 0; path.setAttribute("stroke-dasharray", `${len * p} ${len}`); }
  function render(dt) {
    let rain = 0, motor = 0;
    for (const s of SHOTS) {
      const o = fadeIn(t, s.t0, s.t1);
      s.el.style.opacity = o;
      if (o > 0) {
        const p = reduce ? 0 : ease(Math.max(0, Math.min(1, (t - s.t0) / (s.t1 - s.t0))));
        s.img.style.transform = `translate(${lerp(s.from.x, s.to.x, p)}%, ${lerp(s.from.y, s.to.y, p)}%) scale(${lerp(s.from.s, s.to.s, p)})`;
        if (s.rain) rain = Math.max(rain, s.rain * o);
        if (s.motor) motor = Math.max(motor, s.motor * o);
      }
    }
    const k = t - MAP0;
    q('[data-pin="j"]').setAttribute("opacity", Math.max(0, Math.min(1, (k - 1200) / 500)));
    q('[data-pin="h"]').setAttribute("opacity", Math.max(0, Math.min(1, (k - 3200) / 500)));
    q('[data-pin="t"]').setAttribute("opacity", Math.max(0, Math.min(1, (k - 5600) / 500)));
    route(q('[data-route="j"]'), (k - 1600) / 2600);
    route(q('[data-route="h"]'), (k - 3600) / 1600);
    q(".iportrait").style.opacity = fadeIn(t, 33500, 39000, 500);
    q('[data-t="title"]').style.opacity = fadeIn(t, 11000, 16500, 1200);
    q('[data-t="day"]').style.opacity = fadeIn(t, DAY0, END + 2000, 1000);
    const line = LINES.find((l) => t >= l.t0 && t < l.t0 + l.dur);
    if (line) { if (sub.dataset.k !== String(line.t0)) { sub.dataset.k = line.t0; sub.className = "isub " + line.who; sub.textContent = line.text; } }
    else if (sub.dataset.k) { sub.dataset.k = ""; sub.textContent = ""; }
    rainLevel = rain; motorLevel = motor;
    ctx.clearRect(0, 0, 960, 540);
    if (rain > 0.01) {
      ctx.strokeStyle = `rgba(220, 232, 240, ${0.4 * rain})`; ctx.lineWidth = 1; ctx.beginPath();
      for (const d of drops) { d.y += d.v * dt; d.x -= d.v * dt * 0.1; if (d.y > 540) { d.y = -d.l; d.x = Math.random() * 1000; } ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.l * 0.1, d.y + d.l); }
      ctx.stroke();
    }
  }
  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    t += now - last; last = now;
    if (t >= END) return finish();
    render(dt); syncAudio();
    requestAnimationFrame(frame);
  }
  function finish() {
    running = false; syncAudio();
    clearInterval(chordTimer);
    if (ac) { ac.close().catch(() => {}); ac = null; }
    root.hidden = true;
    if (opts && opts.done) opts.done();
  }
  q(".iskip").addEventListener("click", (e) => { e.stopPropagation(); if (t < DAY0) { t = DAY0 + 100; prevT = t; for (const l of LINES) l.audio.pause(); } else finish(); });

  return {
    play(o) {
      opts = o;
      for (const l of LINES) if (!l.audio) { l.audio = new Audio(l.src); l.audio.preload = "auto"; }
      t = 0; prevT = 0; root.hidden = false; running = true;
      initAudio();
      last = performance.now();
      q(".iskip").focus({ preventScroll: true });
      requestAnimationFrame(frame);
    }
  };
})();
