// Ausgesetzt – Engine für alle sieben Tage.
// Jeder Tag liegt als eigene Datei in tage/ und meldet sich mit Ausgesetzt.day(n, {...}) an.
// Die Engine baut daraus Räume, Figuren, Inventar, Ziele und spielt die Rätsel-Logik des Tages ab.
window.Ausgesetzt = (function () {
  const $ = (id) => document.getElementById(id);
  const scene = $("scene"), stage = $("stage");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";

  // ---------- Register: Tage tragen hier ihre Gegenstände, Töne und Texte ein ----------
  const DAYS = {}, ITEMS = {}, ICON = {}, CLIPS = {}, NARR = {}, JOURNAL = {}, EGGS = {}, MINIGAMES = {};
  const CHARS = {
    hannes: { name: "Hannes", strip: "tag1/hannes-walk.png", fw: 584, posen: "tag1/hannes-posen.png" },
    jonas: { name: "Jonas", strip: "tag1/jonas-walk.png", fw: 523, posen: "tag1/jonas-posen.png" }
  };
  const FRAMES = 6, IDLE = 2, STRIDE = 70;
  // Posen-Streifen (tools/posen.py): je Bild PW x PH, Reihenfolge wie in POSEN
  const POSEN = ["sitzen", "klettern", "knien", "liegen", "handy", "angeln", "hacken", "trinken", "jubeln", "karte"], PW = 620, PH = 600;
  const WEATHER = { regen: "Regen", niesel: "Niesel", grau: "Bewölkt", sonne: "Sonne", hitze: "Hitze", gewitter: "Gewitter", nacht: "Nacht" };

  function day(n, def) {
    if (window.GEMEINSAM && !day.shared) { day.shared = true; Object.assign(ITEMS, GEMEINSAM.items); Object.assign(ICON, GEMEINSAM.icons); }
    DAYS[n] = def;
    def._together0 = !!def.together;
    Object.assign(ITEMS, def.items || {});
    Object.assign(ICON, def.icons || {});
    for (const k in def.clips || {}) CLIPS[k] = Object.assign({ day: n }, def.clips[k]);
    Object.assign(NARR, def.narr || {});
    Object.assign(JOURNAL, def.journal || {});
    for (const k in def.eggs || {}) EGGS[k] = { label: def.eggs[k], day: n };
  }

  // ---------- Speicherstand (nur in diesem Browser) ----------
  const KEY = "ausgesetzt-spielstand-v1";
  const SAVE = Object.assign({ unlocked: 1, eggs: [], clips: [], journal: [], persist: [], realtime: false, muted: false }, (() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  })());
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(SAVE)); } catch (e) {} };
  // TESTPHASE: alle Tage frei, damit man direkt in jeden Tag springen kann. Für die fertige Version diese Zeile entfernen.
  const ALLE_FREI = true;
  if (ALLE_FREI) SAVE.unlocked = 7;
  const addTo = (list, v) => { if (SAVE[list].includes(v)) return false; SAVE[list].push(v); save(); return true; };

  // ---------- Zustand ----------
  let D = null, S = null, active = "hannes", selected = null, token = 0, invOpen = false, started = false;
  const hero = () => S.chars[active];
  const room = () => D.rooms[hero().room];
  const owner = () => (D.together ? "team" : active);
  const others = () => Object.keys(S.chars).filter((id) => id !== active);

  // ---------- Ton ----------
  const audio = {};
  // Töne liegen als MP3 neben den WAV-Quelldateien (kleiner, läuft überall)
  function sound(file) { file = file.replace(/\.wav$/, ".mp3"); if (!audio[file]) { const a = new Audio(file); a.preload = "auto"; audio[file] = a; } return audio[file]; }
  // Umgebungston: alles im Browser erzeugt, in Schichten (Wind, Wellen, Regen, Vögel, Grillen, Mücken, Feuer).
  // Welche Schicht wie laut ist, hängt von Raum, Uhrzeit und Wetter ab (updateAmbience).
  let ac = null, ambGain = null, amb = null;
  // Umgebung leise im Hintergrund, beim Sprechen fast weg; Stimmen laufen über einen eigenen Verstärker (voiceBus)
  const AMB = 0.5, AMB_DUCK = 0.12;
  let voiceBus = null;
  // Originaltöne aus den Videos sind leise und schwanken: anheben und mit einem Kompressor glätten
  function routeVoice(a) {
    if (!ac || !voiceBus) return;
    if (ac.state !== "running" && started) ac.resume().catch(() => {});
    if (a._routed) return;
    try { ac.createMediaElementSource(a).connect(voiceBus); a._routed = true; } catch (e) {}
  }
  function initAmbience() {
    if (ac) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    ambGain = ac.createGain(); ambGain.gain.value = SAVE.muted ? 0 : AMB; ambGain.connect(ac.destination);
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -26; comp.knee.value = 8; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.25;
    voiceBus = ac.createGain(); voiceBus.gain.value = 1.9;
    voiceBus.connect(comp).connect(ac.destination);
    const noise = (brown) => {
      const b = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate), d = b.getChannelData(0);
      let v = 0;
      for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; if (brown) { v = (v + 0.02 * w) / 1.02; d[i] = v * 3.5; } else d[i] = w; }
      return b;
    };
    const white = noise(false), brown = noise(true);
    const src = (buf) => { const s = ac.createBufferSource(); s.buffer = buf; s.loop = true; s.loopStart = Math.random(); s.start(0, Math.random() * 3); return s; };
    const filt = (type, f, q) => { const b = ac.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q) b.Q.value = q; return b; };
    // Lautstärke, die langsam schwankt (Wellen, Grillen-Takt)
    const swell = (rate, depth, base) => { const g = ac.createGain(); g.gain.value = base; const o = ac.createOscillator(), d = ac.createGain(); o.frequency.value = rate; d.gain.value = depth; o.connect(d).connect(g.gain); o.start(); return g; };
    const layer = (...chain) => { const g = ac.createGain(); g.gain.value = 0; chain.reduce((a, b) => a.connect(b)).connect(g).connect(ambGain); return g; };
    const tone = (type, f) => { const o = ac.createOscillator(); o.type = type; o.frequency.value = f; o.start(); return o; };
    amb = {
      wind: layer(src(brown), filt("lowpass", 500), swell(0.07, 0.35, 0.75)),
      water: layer(src(brown), filt("bandpass", 420, 0.7), swell(0.12, 0.55, 0.6)),
      rain: layer(src(white), filt("highpass", 1400), filt("lowpass", 7000)),
      crickets: layer(tone("sine", 4300), swell(26, 0.5, 0.5), swell(0.6, 0.5, 0.5)),
      crickets2: layer(tone("sine", 4750), swell(31, 0.5, 0.5), swell(0.45, 0.5, 0.5)),
      mosquito: (() => { const o = tone("sawtooth", 560), v = tone("sine", 5), vd = ac.createGain(); vd.gain.value = 18; v.connect(vd).connect(o.frequency); return layer(o, filt("bandpass", 620, 4), swell(0.25, 0.45, 0.55)); })(),
      birds: (() => { const g = ac.createGain(); g.gain.value = 0; g.connect(ambGain); return g; })(),
      fire: (() => { const g = ac.createGain(); g.gain.value = 0; g.connect(ambGain); return g; })()
    };
    // Vögel: kurze Rufe aus zufälliger Richtung
    const chirp = () => {
      if (amb.birds.gain.value > 0.001 && started) {
        const now = ac.currentTime, notes = 2 + Math.floor(Math.random() * 4), base = 2600 + Math.random() * 2400, len = 0.06 + Math.random() * 0.09;
        const pan = ac.createStereoPanner ? ac.createStereoPanner() : ac.createGain();
        if (pan.pan) pan.pan.value = Math.random() * 1.6 - 0.8;
        pan.connect(amb.birds);
        for (let i = 0; i < notes; i++) {
          const o = ac.createOscillator(), g = ac.createGain(), t0 = now + i * (len + 0.05);
          o.type = "sine";
          o.frequency.setValueAtTime(base * (1 + (i % 2) * 0.12), t0);
          o.frequency.exponentialRampToValueAtTime(base * (Math.random() < 0.5 ? 0.75 : 1.3), t0 + len);
          g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(1, t0 + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
          o.connect(g).connect(pan); o.start(t0); o.stop(t0 + len + 0.02);
        }
      }
      setTimeout(chirp, 1500 + Math.random() * 5000);
    };
    chirp();
    // Feuer: einzelnes Knacken
    const crackle = () => {
      if (amb.fire.gain.value > 0.001) {
        const n = ac.createBufferSource(), cb = ac.createBuffer(1, 600, ac.sampleRate), cd = cb.getChannelData(0);
        for (let i = 0; i < cd.length; i++) cd[i] = (Math.random() * 2 - 1) * Math.exp(-i / 90);
        n.buffer = cb;
        const g = ac.createGain(); g.gain.value = 0.4 + Math.random() * 0.6;
        n.connect(filt("highpass", 1500)).connect(g).connect(amb.fire); n.start();
      }
      setTimeout(crackle, 60 + Math.random() * 380);
    };
    crackle();
    updateAmbience();
  }
  // Raum-Typ aus dem Raumnamen: Wasser in der Nähe, Sumpf, Wald
  function roomWater(id) { return /see|ufer|steg|strand/.test(id) ? 1 : /treff|lager|neu|bruecke|sumpf/.test(id) ? 0.5 : 0; }
  // Bildstimmung: Sonnenstrahlen, Nebel und das Licht auf den Figuren folgen Wetter und Uhrzeit
  function updateLook() {
    if (!S) return;
    const w = weather(), c = hero().clock % 1440, night = c >= 21 * 60 || c < 4.5 * 60, evening = c >= 18.5 * 60 && !night;
    $("atmo").setAttribute("class", `w-${w}${night ? " night" : ""}${c < 9 * 60 && !night ? " morgen" : ""}`);
    const look = night ? "" : w === "regen" || w === "niesel" || w === "gewitter" ? "lookRegen" : w === "hitze" ? "lookHitze" : evening ? "lookAbend" : w === "grau" ? "lookGrau" : "";
    if (look) $("actors").setAttribute("filter", `url(#${look})`); else $("actors").removeAttribute("filter");
    // Regen: ab und zu zittern. Kalter Morgen: Atemwölkchen. Hitze: Schweißtropfen.
    const nass = w === "regen" || w === "niesel" || w === "gewitter";
    const fx = w === "hitze" && !night ? "schweiss" : (c < 9 * 60 || c >= 20 * 60) && w !== "hitze" ? "atem" : "";
    if (fx !== S.fx || nass !== S.nass) { S.fx = fx; S.nass = nass; for (const id in S.chars) S.chars[id].shiver = nass; placeAll(); }
  }
  function updateAmbience() {
    updateLook();
    if (!amb || !S) return;
    const h = hero(), r = room(), w = weather(), c = h.clock % 1440;
    const set = (g, v) => g.gain.setTargetAtTime(v, ac.currentTime, 0.8);
    const night = c >= 20.5 * 60 || c < 4.5 * 60, rainy = { regen: 1, gewitter: 1, niesel: 0.45 }[w] || 0;
    set(amb.wind, 0.1 * (w === "gewitter" ? 1.6 : w === "hitze" ? 0.4 : 1));
    set(amb.water, 0.12 * (r.amb && r.amb.water != null ? r.amb.water : roomWater(h.room)));
    set(amb.rain, 0.09 * rainy);
    set(amb.birds, !night && rainy < 1 ? 0.035 * (1 - rainy) : 0);
    set(amb.crickets, night && !rainy ? 0.01 : 0); set(amb.crickets2, night && !rainy ? 0.008 : 0);
    set(amb.mosquito, (/sumpf/.test(h.room) || (S.day <= 3 && /jonas-wald/.test(h.room) && c > 17 * 60)) ? 0.007 : 0);
    set(amb.fire, S.fires.has(h.room) ? 0.18 : 0);
  }
  function thunder() {
    if (!ac || SAVE.muted) return;
    const n = ac.createBufferSource(), b = ac.createBuffer(1, ac.sampleRate * 3, ac.sampleRate), d = b.getChannelData(0);
    let v = 0;
    for (let i = 0; i < d.length; i++) { v = (v + 0.06 * (Math.random() * 2 - 1)) / 1.03; d[i] = v * 6 * Math.exp(-i / (ac.sampleRate * 0.9)); }
    n.buffer = b;
    const f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 180;
    const g = ac.createGain(); g.gain.value = 0.9;
    n.connect(f).connect(g).connect(ac.destination); n.start();
  }

  // ---------- Geräusche zu den Animationen ----------
  // Alles im Browser erzeugt: Platschen, Hacken, Rascheln, Gluckern, Schnarchen, Papier, Kratzen am Fels
  let sfxBus = null;
  // Pegel je Geräusch, damit alle etwa gleich deutlich über der Umgebung liegen und unter den Stimmen bleiben
  const PEGEL = { platsch: 3.2, raus: 2.6, hacken: 0.7, rascheln: 1, kratzen: 3, papier: 1.1, gluckern: 1.7, schnarchen: 2.8 };
  const audioCtx = () => ac;
  // probe: { ac, ziel } rendert unhörbar in einen anderen Kontext (nur für automatische Tests)
  function sfx(name, vol, probe) {
    const ac = probe ? probe.ac : audioCtx();
    if (!probe && (!ac || SAVE.muted || !started)) return;
    if (!probe && ac.state !== "running") ac.resume().catch(() => {});
    if (!probe && !sfxBus) { sfxBus = ac.createGain(); sfxBus.gain.value = 0.6; sfxBus.connect(ac.destination); }
    const now = ac.currentTime, sr = ac.sampleRate, out = ac.createGain();
    out.gain.value = (vol == null ? 1 : vol) * (PEGEL[name] || 1); out.connect(probe ? probe.ziel : sfxBus);
    const rausch = (sek, form) => { const b = ac.createBuffer(1, Math.max(1, Math.floor(sr * sek)), sr), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * form(i / d.length, i / sr); const n = ac.createBufferSource(); n.buffer = b; return n; };
    const filter = (typ, f, q) => { const b = ac.createBiquadFilter(); b.type = typ; b.frequency.value = f; if (q) b.Q.value = q; return b; };
    const ton = (t0, f0, f1, len, laut, typ) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = typ || "sine"; o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(f1, t0 + len);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(laut, t0 + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
      o.connect(g).connect(out); o.start(t0); o.stop(t0 + len + 0.02);
    };
    const tropfen = (t0, n, spanne, laut) => { for (let i = 0; i < n; i++) { const f = 900 + Math.random() * 1400; ton(t0 + Math.random() * spanne, f, f * 1.8, 0.05 + Math.random() * 0.05, laut); } };
    if (name === "platsch") {
      // Ins Wasser: dumpfer Schwall, der höher wird, dann Tropfen
      const n = rausch(0.9, (k) => Math.pow(1 - k, 2.2)), f = filter("bandpass", 500, 0.8);
      f.frequency.setValueAtTime(350, now); f.frequency.exponentialRampToValueAtTime(1600, now + 0.5);
      const g = ac.createGain(); g.gain.value = 0.9; n.connect(f).connect(g).connect(out); n.start(now);
      tropfen(now + 0.25, 7, 0.9, 0.12);
    } else if (name === "raus") {
      const n = rausch(0.6, (k) => Math.sin(Math.PI * k) * 0.6), f = filter("bandpass", 900, 0.9);
      n.connect(f).connect(out); n.start(now);
      tropfen(now + 0.1, 10, 1.4, 0.09);
    } else if (name === "hacken") {
      // Klinge ins Holz: kurzes Klacken und ein tiefer Schlag
      const n = rausch(0.04, (k) => 1 - k), f = filter("highpass", 1800);
      const g = ac.createGain(); g.gain.value = 0.7; n.connect(f).connect(g).connect(out); n.start(now);
      ton(now, 170, 70, 0.16, 0.8, "triangle");
    } else if (name === "rascheln") {
      // Stoff und Laub beim Kriechen: Rauschen in kleinen Stößen
      const n = rausch(0.9, (k, t) => (0.5 + 0.5 * Math.sin(t * 38 + Math.sin(t * 9) * 3)) * Math.sin(Math.PI * k));
      n.connect(filter("bandpass", 2600, 0.7)).connect(out); n.start(now);
    } else if (name === "kratzen") {
      const n = rausch(0.35, (k) => Math.sin(Math.PI * k) * (0.6 + 0.4 * Math.random()));
      const g = ac.createGain(); g.gain.value = 0.5; n.connect(filter("bandpass", 1300, 1.2)).connect(g).connect(out); n.start(now);
    } else if (name === "papier") {
      const n = rausch(0.7, (k, t) => (Math.random() < 0.35 ? 1 : 0.15) * Math.sin(Math.PI * k));
      const g = ac.createGain(); g.gain.value = 0.5; n.connect(filter("highpass", 2400)).connect(g).connect(out); n.start(now);
    } else if (name === "gluckern") {
      // Schlucke aus der Flasche
      for (let i = 0; i < 4; i++) { const t0 = now + 0.15 + i * 0.38; ton(t0, 240, 520, 0.11, 0.5); ton(t0 + 0.05, 380, 760, 0.07, 0.25); }
    } else if (name === "schnarchen") {
      // Einatmen mit Schnarren, kurz still, Ausatmen
      const ein = rausch(1.3, (k) => Math.sin(Math.PI * k) * (0.6 + 0.4 * Math.sin(k * 1300)));
      const ge = ac.createGain(); ge.gain.value = 0.9; ein.connect(filter("lowpass", 380)).connect(ge).connect(out); ein.start(now);
      const aus = rausch(1.1, (k) => Math.sin(Math.PI * k) * 0.5);
      const ga = ac.createGain(); ga.gain.value = 0.5; aus.connect(filter("bandpass", 900, 0.6)).connect(ga).connect(out); aus.start(now + 1.5);
    }
  }
  // Hacken: Schläge im Takt der Hack-Bewegung, solange die Figur hackt
  function hackTakt(id) {
    const h = S && S.chars[id];
    if (!h || h.pose !== "hacken" || h.room !== hero().room) return;
    sfx("hacken", 0.9);
    setTimeout(() => hackTakt(id), 600);
  }

  // ---------- Szene aufbauen ----------
  function buildRooms() {
    const g = $("rooms");
    g.innerHTML = "";
    for (const [id, r] of Object.entries(D.rooms)) {
      const hots = Object.entries(r.hot).filter(([, h]) => h.poly)
        .map(([k, h]) => `<path class="hot" data-hot="${k}" d="${h.poly}"${h.hidden ? ' display="none"' : ""}/>`).join("");
      g.insertAdjacentHTML("beforeend",
        `<g id="room-${id}" display="none"><image href="${r.bg}" x="0" y="0" width="1920" height="1080" preserveAspectRatio="none"${r.bgFilter ? ` filter="${r.bgFilter}"` : ""}/>${r.overlays || ""}<g fill="#000" fill-opacity="0">${hots}</g></g>`);
    }
  }
  function buildActors() {
    const g = $("actors");
    g.innerHTML = "";
    for (const id in S.chars) {
      const c = CHARS[id], a = document.createElementNS(NS, "g");
      a.id = "actor-" + id;
      a.innerHTML = `<ellipse cx="0" cy="2" rx="95" ry="20" fill="url(#shadowGrad)"/>
        <rect class="hot" data-hot="char:${id}" x="-90" y="-470" width="180" height="470" fill="#000" fill-opacity="0"/>
        <clipPath id="wasser-${id}"><rect class="wl" x="-600" y="-900" width="1200" height="900"/></clipPath>
        <g class="body" clip-path="url(#wasser-${id})"><g class="shiver">
        <g class="spriteWrap" pointer-events="none"><svg class="sprite" x="${-c.fw / 2}" y="-480" width="${c.fw}" height="480" viewBox="0 0 ${c.fw} 480" overflow="hidden">
        <image href="${c.strip}" x="0" y="0" width="${c.fw * FRAMES}" height="480"/></svg></g>
        <g class="poseWrap" pointer-events="none" display="none"><g class="poseAnim"><svg class="pose" x="${-PW / 2}" y="${-PH}" width="${PW}" height="${PH}" viewBox="0 0 ${PW} ${PH}" overflow="hidden">
        <image href="${c.posen}" x="0" y="0" width="${PW * POSEN.length}" height="${PH}"/></svg></g></g></g></g>
        <ellipse class="ripple" cx="0" cy="0" rx="95" ry="12" fill="none" stroke="#e8f2f6" stroke-opacity="0.6" stroke-width="4" display="none"/>
        <g class="fx" pointer-events="none"></g>
        <g class="zzz" pointer-events="none" display="none"><text x="0" y="0">z</text><text x="0" y="0">z</text><text x="0" y="0">Z</text></g>`;
      g.appendChild(a);
    }
  }
  function scaleAt(y, r) { r = r || room(); return r.s0 + Math.max(0, Math.min(1, (y - r.y0) / (1060 - r.y0))) * (r.s1 - r.s0); }
  function place(id) {
    const h = S.chars[id], a = $("actor-" + id);
    if (!a) return;
    const visible = h.room === hero().room && !h.hiddenActor && !h.away;
    a.setAttribute("display", visible ? "inline" : "none");
    if (!visible) return;
    const r = D.rooms[h.room], s = scaleAt(h.y, r), fw = CHARS[id].fw;
    const frame = h.target && !reduce ? Math.floor(h.phase) % FRAMES : IDLE;
    // lift: sichtbar höher (auf einem Felsen), ohne dass sich Größe oder Reihenfolge ändern
    // sink: im Wasser bis zu den Schultern versinken (der Körper wird an der Wasserlinie abgeschnitten)
    const sink = h.sink || 0;
    a.setAttribute("transform", `translate(${h.x.toFixed(1)},${(h.y - (h.lift || 0) + sink * s).toFixed(1)}) scale(${s.toFixed(3)})`);
    a.querySelector(".wl").setAttribute("height", (900 - sink).toFixed(1));
    const rp = a.querySelector(".ripple"); rp.setAttribute("display", sink > 4 ? "inline" : "none"); rp.setAttribute("cy", (-sink).toFixed(1));
    a.setAttribute("class", "actor" + (h.pose ? " p-" + h.pose : "") + (h.shiver ? " shivering" : ""));
    const pi = POSEN.indexOf(h.pose), sw = a.querySelector(".spriteWrap"), pw = a.querySelector(".poseWrap");
    sw.setAttribute("display", pi < 0 ? "inline" : "none");
    pw.setAttribute("display", pi < 0 ? "none" : "inline");
    a.querySelector("ellipse").setAttribute("display", h.lift || sink || h.pose === "liegen" ? "none" : "inline");
    const fxg = a.querySelector(".fx"), fxArt = !h.pose || h.pose === "handy" || h.pose === "angeln" || h.pose === "karte" ? S.fx || "" : "";
    if (fxg.dataset.art !== fxArt) {
      fxg.dataset.art = fxArt;
      fxg.innerHTML = fxArt === "atem" ? '<g class="atem"><circle r="18"/><circle r="13" cx="10" cy="6"/></g>'
        : fxArt === "schweiss" ? '<g class="schweiss"><path d="M0,0 q-13,22 0,30 q13,-8 0,-30z"/><path d="M-34,10 q-11,18 0,25 q11,-7 0,-25z"/></g>' : "";
    }
    fxg.setAttribute("transform", `translate(${h.dir * (fxArt === "atem" ? 52 : 18)} ${fxArt === "atem" ? -400 : -430}) scale(${h.dir},1)`);
    const z = a.querySelector(".zzz");
    z.setAttribute("display", h.pose === "liegen" && h.done ? "inline" : "none");
    z.setAttribute("transform", `translate(${h.dir * 200} -110)`);
    if (pi < 0) {
      sw.setAttribute("transform", `scale(${h.dir},1)`);
      a.querySelector(".sprite").setAttribute("viewBox", `${frame * fw} 0 ${fw} 480`);
    } else {
      pw.setAttribute("transform", `translate(0 ${(h.bob || 0).toFixed(1)}) scale(${h.dir},1)`);
      a.querySelector(".pose").setAttribute("viewBox", `${pi * PW} 0 ${PW} ${PH}`);
    }
  }
  function placeAll() {
    for (const id in S.chars) place(id);
    // Wer weiter vorne steht, wird später gezeichnet
    const g = $("actors"), order = Object.keys(S.chars).sort((a, b) => S.chars[a].y - S.chars[b].y);
    order.forEach((id) => { const a = $("actor-" + id); if (a && g.lastChild !== a) g.appendChild(a); });
  }
  function showRoom() {
    for (const r in D.rooms) $("room-" + r).setAttribute("display", r === hero().room ? "inline" : "none");
    $("where").textContent = `Tag ${S.day} · ${room().where}`;
    buildDots(); placeAll(); renderFront(); updateAmbience();
  }

  // ---------- Leuchtpunkte ----------
  let dots = [], pointer = [-9999, -9999], revealAll = false, spaceHeld = false;
  function buildDots() {
    const g = $("dots");
    g.innerHTML = ""; dots = [];
    for (const el of document.querySelectorAll(`#room-${hero().room} .hot`)) {
      if (el.getAttribute("display") === "none") continue;
      let b; try { b = el.getBBox(); } catch (e) { continue; }
      if (!b.width) continue;
      const cfg = room().hot[el.dataset.hot] || {};
      const [x, y] = cfg.dot || [b.x + b.width / 2, b.y + b.height / 2];
      const d = document.createElementNS(NS, "g");
      d.setAttribute("transform", `translate(${x} ${y})`);
      d.setAttribute("opacity", 0);
      const mark = cfg.exit
        ? `<path d="M-7,-13 L7,0 L-7,13" transform="scale(${cfg.exit.dir},1)" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        : `<circle r="5" fill="#fff"/>`;
      d.innerHTML = `<circle r="26" fill="url(#dotGlow)" class="pulse"/>${mark}<circle r="40" fill="#000" fill-opacity="0" class="hot" data-hot="${el.dataset.hot}" pointer-events="all"/>`;
      g.appendChild(d);
      dots.push({ el: d, x, y });
    }
    updateDots(pointer[0], pointer[1]);
  }
  function updateDots(px, py) {
    pointer = [px, py];
    for (const d of dots) {
      const o = revealAll || spaceHeld ? 1 : Math.max(0, Math.min(1, 1.35 - Math.hypot(d.x - px, d.y - py) / 320));
      d.el.setAttribute("opacity", o.toFixed(2));
    }
  }
  function setReveal(on) { revealAll = on; $("reveal").setAttribute("aria-pressed", on); updateDots(pointer[0], pointer[1]); }

  // ---------- Inventar ----------
  const itemName = (it) => (ITEMS[it] ? ITEMS[it].name : it);
  const itemDesc = (it) => { const d = ITEMS[it] && ITEMS[it].desc; return typeof d === "function" ? d(E) : d || itemName(it); };
  function setInv(open) { invOpen = open; $("inv").hidden = !open; $("bag").setAttribute("aria-expanded", open); }
  function renderInv() {
    const inv = $("inv");
    inv.innerHTML = "";
    for (const it of hero().inv) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", itemName(it));
      b.setAttribute("aria-pressed", it === selected);
      const badge = ITEMS[it] && ITEMS[it].badge ? `<span class="n">${ITEMS[it].badge(E)}</span>` : "";
      b.innerHTML = `<svg viewBox="0 0 40 40">${ICON[it] || '<circle cx="20" cy="20" r="10" fill="#888"/>'}</svg><span class="nm">${itemName(it)}</span>${badge}`;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        if (selected === it) { select(null); setInv(false); lookItem(it); }
        else if (selected) { const a = selected; select(null); setInv(false); combine(a, it); }
        else { select(it); setInv(false); }
      });
      b.addEventListener("pointerenter", () => {
        const hl = $("hotlabel");
        hl.textContent = selected && selected !== it ? `${itemName(selected)} + ${itemName(it)}` : itemName(it);
        hl.classList.add("on");
      });
      b.addEventListener("pointerleave", () => $("hotlabel").classList.remove("on"));
      inv.appendChild(b);
    }
  }
  function select(it) {
    selected = it;
    $("cursorlabel").hidden = !it;
    if (it) $("cursorlabel").textContent = itemName(it) + " + …";
    // Gewählter Gegenstand bleibt sichtbar (am Handy gibt es keinen Mauszeiger mit Beschriftung)
    $("selchip").hidden = !it;
    if (it) { $("selIcon").innerHTML = ICON[it] || ""; $("selName").textContent = itemName(it); }
    renderInv();
  }
  function gained(it) {
    const bag = $("bag");
    bag.classList.remove("pop"); void bag.offsetWidth; bag.classList.add("pop");
    const g = document.createElement("div");
    g.className = "gain"; g.textContent = "+ " + itemName(it);
    $("gainBox").replaceChildren(g);
  }
  async function lookItem(it) { const t = ++token; await lines([ITEMS[it] && ITEMS[it].clip ? ITEMS[it].clip : itemDesc(it)], t); }

  // ---------- Hinweise oben ----------
  const toasts = [];
  let toastTimer = null;
  function toast(text, kind) { toasts.push([text, kind || ""]); if (toasts.length === 1) nextToast(); }
  function nextToast() {
    const tt = $("toast");
    if (!toasts.length) { tt.hidden = true; return; }
    const [text, kind] = toasts[0];
    tt.textContent = text; tt.className = "toast " + kind; tt.hidden = false;
    toastTimer = setTimeout(() => { toasts.shift(); nextToast(); }, 3000);
  }

  // ---------- Ziele ----------
  function renderGoals() {
    const box = $("goals"), list = D.goals[owner()] || [];
    const done = S.goals[owner()];
    box.innerHTML = `<b>${D.together ? "Hannes & Jonas" : CHARS[active].name}</b>` +
      list.map(([k, label]) => `<div class="goal${done[k] ? " done" : ""}" id="goal-${k}"><i></i>${label}</div>`).join("");
    // Dieselben Ziele in der Szene (Handy)
    const n = list.filter(([k]) => done[k]).length;
    $("gminiCount").textContent = list.length ? `Ziele ${n}/${list.length}` : "Ziele";
    $("gminiBtn").classList.toggle("alle", list.length > 0 && n === list.length);
    $("gpanelWho").textContent = D.together ? "Hannes & Jonas" : CHARS[active].name;
    $("gpanelList").innerHTML = list.map(([k, label]) => `<li class="${done[k] ? "done" : ""}"><i></i>${label}</li>`).join("");
  }
  function setGoalPanel(open) { $("gpanel").hidden = !open; $("gminiBtn").setAttribute("aria-expanded", open); }
  $("gminiBtn").addEventListener("click", (e) => { e.stopPropagation(); setGoalPanel($("gpanel").hidden); });
  function goal(k) {
    const g = S.goals[owner()];
    if (g[k]) return;
    g[k] = true;
    renderGoals();
    const el = $("goal-" + k);
    if (el) el.classList.add("flash");
    const mini = $("gminiBtn"); mini.classList.remove("flash"); void mini.offsetWidth; mini.classList.add("flash");
    const label = (D.goals[owner()].find((x) => x[0] === k) || [k, k])[1];
    toast(`Ziel erreicht: ${label}`, "goal");
    S.jubel = true;
    if (D.together && started) S.cheer = true;
  }

  // ---------- Der Partner lebt mit ----------
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const tagOf = (id) => (id === "jonas" ? "J: " : "H: ");
  const CHEER = {
    jonas: ["Geil!", "Läuft bei uns.", "Teamwork, Baby.", "Zack. Erledigt.", "Approved by Jonas."],
    hannes: ["Sehr gut.", "Haken dran.", "Wir sind ein gutes Team.", "Läuft.", "Survival, Leute."]
  };
  // Sprüche, wenn eine Weile nichts passiert: zu zweit redet der Partner, allein redet man mit sich selbst
  const BANTER = {
    together: {
      hannes: ["Ich könnte jetzt eine Pizza Diavolo vertragen.", "Hörst du das? … Ach, nur ein Vogel.", "Weißt du, was ich vermisse? Eine Dusche.", "Ich hab das Gefühl, mein Drybag wird jeden Tag schwerer.", "Was machen wir als Nächstes?"],
      jonas: ["Marlene würde lachen, wenn sie uns jetzt sehen könnte.", "Ich hab Bock auf Lakritzeis.", "Hannes Beutlin, der kleine Hobbit.", "Mein Kukri und ich, wir sind jetzt ein Team.", "Was steht noch an?"]
    },
    alone: {
      hannes: ["Ich fang langsam an, mit Bäumen zu reden. Hallo, Baumi.", "Wie es Jonas wohl geht?", "Von mir kriegt ihr heute nichts außer Tarpgeschichten.", "Hunger ist nicht das Problem. Die Langeweile schon."],
      jonas: ["Ob Hannes schon einen Fisch hat?", "Wolf, bitte bleib weg.", "Ich bin hier der Bürgermeister vom Fichtenwald.", "Die Mücken sind die abgefucktesten Jagdtiere."]
    },
    hitze: ["Die Sonne brennt. Wo ist Schatten?", "Ich schwitze an Stellen, von denen ich nicht wusste, dass sie schwitzen können."],
    regen: ["Nass. Natürlich.", "Es regnet. Schon wieder."],
    gewitter: ["Das Donnern kommt näher.", "Bloß nicht unter den höchsten Baum."]
  };
  let lastInput = performance.now();
  for (const ev of ["pointerdown", "keydown"]) document.addEventListener(ev, () => { lastInput = performance.now(); }, true);
  function idleTalk(now) {
    if (now - lastInput < (D.together ? 30000 : 40000) || subDone || paused()) return;
    if (Object.values(S.chars).some((c) => c.target)) return;
    lastInput = now;
    const w = weather(), extra = BANTER[w === "niesel" ? "regen" : w];
    if (D.together) {
      const o = others().find((id) => !S.chars[id].away && S.chars[id].room === hero().room);
      if (!o) return;
      face(hero().x, o);
      say(tagOf(o) + (extra && Math.random() < 0.4 ? pick(extra) : pick((D.idle && D.idle[o]) || BANTER.together[o])), token);
    } else say(extra && Math.random() < 0.4 ? pick(extra) : pick((D.idle && D.idle[active]) || BANTER.alone[active]), token);
  }
  // Zu zweit geht der Partner mit zur Stelle und schaut hin
  function partnerFollow(stand, faceX) {
    for (const id of others()) {
      const o = S.chars[id];
      if (o.room !== hero().room || o.away || o.hiddenActor) continue;
      const side = o.x < stand[0] ? -1 : 1;
      const [x, y] = clampWalk(stand[0] + side * 180, stand[1] + 15);
      walkTo(x, y, id).then((ok) => { if (ok && faceX != null && S) face(faceX, id); });
    }
  }
  function flinch() {
    if (!S || !started || subDone || paused()) return;
    const o = D.together ? others().find((id) => !S.chars[id].away) : null;
    say((o ? tagOf(o) : "") + pick(["Uff. Das war nah.", "Alter! Hast du das gehört?", "Eins, zwei, drei … zu nah."]), token);
  }
  const hasGoal = (k) => !!S.goals[owner()][k];
  const allGoals = () => (D.goals[owner()] || []).every(([k]) => S.goals[owner()][k]);

  // ---------- Überleben ----------
  const clamp = (v) => Math.max(0, Math.min(100, v));
  function renderHud() {
    const h = hero();
    for (const k of ["health", "thirst", "hunger", "fourth"]) {
      const el = $("b-" + k);
      el.style.width = h[k].toFixed(1) + "%";
      el.classList.toggle("low", h[k] < 20);
    }
    $("b-fourth").classList.toggle("stamina", D.fourth === "stamina");
    $("fourthRow").title = D.fourth === "stamina" ? "Ausdauer" : "Stimmung";
    const c = Math.floor(h.clock);
    $("clock").textContent = `${String(Math.floor(c / 60) % 24).padStart(2, "0")}:${String(c % 60).padStart(2, "0")}`;
    $("weatherName").textContent = WEATHER[weather()] || "";
    const tintFrom = 20.5 * 60, tintTo = 23.5 * 60;
    const night = S.tint != null ? S.tint : Math.max(0, Math.min(0.55, ((c - tintFrom) / (tintTo - tintFrom)) * 0.55));
    $("tint").setAttribute("opacity", night.toFixed(2));
    syncLights(night);
    updateAmbience();
  }
  // Nachts liegt der Farbschleier über allem. Brennende Feuer werden darüber noch einmal hell gezeichnet.
  let lightsKey = "";
  function syncLights(night) {
    const g = $("lights"), r = $("room-" + hero().room);
    const fires = night > 0.02 && r ? [...r.querySelectorAll('use[href="#flames"]')].map((u) => u.parentNode).filter((p) => p.getAttribute("opacity") !== "0") : [];
    g.setAttribute("opacity", Math.min(1, night / 0.45).toFixed(2));
    const key = hero().room + fires.map((f) => f.id).join();
    if (key === lightsKey) return;
    lightsKey = key;
    g.innerHTML = fires.map((f) => f.innerHTML).join("");
  }
  function weather() { return D.weather ? D.weather(hero().clock, E) : "grau"; }
  function hurt(n, who) {
    const h = who ? S.chars[who] : hero();
    h.health = clamp(h.health - n);
    $("hit").classList.add("on");
    setTimeout(() => $("hit").classList.remove("on"), 60);
    renderHud();
    if (h.health <= 0) gameOver(who || active);
  }
  // Zeit vergeht durch Handlungen; im Echtzeit-Modus zusätzlich jede Sekunde eine Spielminute
  function spend(min) {
    if (!S || !min) return;
    const ids = D.together ? Object.keys(S.chars) : [active];
    const w = weather();
    for (const id of ids) {
      const h = S.chars[id];
      if (h.done) continue;
      h.clock += min;
      // Auf den Marschtagen ist Hunger kaum ein Thema (eure Erkenntnis aus Folge 7), Hitze macht aber Durst
      h.thirst = clamp(h.thirst - min * 0.18 * (w === "hitze" ? 1.4 : 1));
      h.hunger = clamp(h.hunger - min * (D.fourth === "stamina" ? 0.06 : 0.1));
      if (D.fourth === "mood") h.fourth = clamp(h.fourth - min * 0.055 * (w === "regen" || w === "niesel" ? 1.5 : 1));
      else h.fourth = clamp(h.fourth + min * 0.05);
      if (h.thirst <= 0 || h.hunger <= 0 || h.fourth <= 0) h.health = clamp(h.health - min * 0.2);
      else if (h.thirst > 50 && h.hunger > 50) h.health = clamp(h.health + min * 0.08);
      if (h.health <= 0) { gameOver(id); return; }
    }
    renderHud();
    // Ereignisse erst, wenn gerade nichts läuft (sonst unterbrechen sie eine Handlung mittendrin)
    if (SAVE.realtime && !subDone) timedEvents();
  }
  function once(key, cond, fn) { const h = hero(); if (!h.warned[key] && cond) { h.warned[key] = true; fn(); } }
  function timedEvents() {
    if (subDone || paused()) return;
    const h = hero(), H = active === "hannes";
    once("durst", h.thirst < 25, () => say(H ? "Ich hab echt Durst. Mein Hals kratzt eh schon." : "Mund ganz trocken. Ich brauche Wasser.", token));
    once("hunger", h.hunger < 25, () => say(H ? "Mein Magen knurrt. Irgendwas muss ich essen." : "Ich hab Kohldampf. Wo krieg ich was zu essen her?", token));
    once("vierte", h.fourth < 20, () => say(D.fourth === "stamina" ? "Ich bin komplett im Eimer. Ich brauche eine Pause und was zu essen." : "Mir fällt die Decke auf den Kopf. Ich brauche irgendwas zu tun.", token));
    // Zu zweit meldet sich auch der Partner, wenn er Durst oder Hunger hat
    if (D.together) for (const id of others()) {
      const o = S.chars[id], tag = id === "jonas" ? "J: " : "H: ";
      if (!o.warned.durstP && o.thirst < 25) { o.warned.durstP = true; say(tag + "Ich hab tierisch Durst. Hast du Wasser für mich?", token); }
      else if (!o.warned.hungerP && o.hunger < 25) { o.warned.hungerP = true; say(tag + "Ich brauch was zu essen. Beeren, irgendwas.", token); }
    }
    if (D.timed) D.timed(E);
  }
  const paused = () => !started || !$("choice").hidden || !$("half").hidden || !$("dayEnd").hidden || !$("over").hidden || !$("mg").hidden || !$("book").hidden || !$("dayIntro").hidden || !$("vplayer").hidden || narrating || hero().done;
  function gameOver(id) {
    if (!$("over").hidden) return;
    stopTalk(true); token++;
    $("overText").textContent = `${CHARS[id].name} kann nicht mehr und schickt Stefan den Notruf statt des OKs. Achte auf Wasser, Essen, ${D.fourth === "stamina" ? "Pausen" : "deine Stimmung"} und darauf, wem du im Wald zu nahe kommst.`;
    $("over").hidden = false;
  }

  // ---------- Laufen ----------
  const inside = (poly, x, y) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  function clampWalk(x, y) {
    const C = room();
    if (inside(C.walk, x, y)) return [x, y];
    let lo = 0, hi = 1;
    for (let k = 0; k < 18; k++) {
      const m = (lo + hi) / 2;
      inside(C.walk, C.center[0] + (x - C.center[0]) * m, C.center[1] + (y - C.center[1]) * m) ? (lo = m) : (hi = m);
    }
    return [C.center[0] + (x - C.center[0]) * lo, C.center[1] + (y - C.center[1]) * lo];
  }
  function walkTo(x, y, who) {
    const h = who ? S.chars[who] : hero();
    if (h.resolve) h.resolve(false);
    const [cx, cy] = h === hero() ? clampWalk(x, y) : [x, y];
    h.pose = null; h.lift = 0; h.bob = 0; h.sink = 0;
    // Nur für automatische Tests: ohne Laufen direkt ans Ziel
    if (window.__testFast) { h.x = cx; h.y = cy; h.target = null; placeAll(); return Promise.resolve(true); }
    return new Promise((res) => { h.target = { x: cx, y: cy }; h.resolve = res; });
  }
  function stopWalk() {
    if (!S) return;
    for (const id in S.chars) {
      const h = S.chars[id], r = h.resolve;
      h.target = null; h.resolve = null; h.phase = 0;
      if (r) r(false);
    }
    placeAll();
  }
  const face = (x, who) => { const h = who ? S.chars[who] : hero(); h.dir = x >= h.x ? 1 : -1; place(who || active); };
  let last = performance.now(), rtAcc = 0;
  function tick(now) {
    const dt = Math.min(window.__testFast ? 1 : 0.05, (now - last) / 1000); last = now;
    if (S) {
      let moved = false;
      for (const id in S.chars) {
        const h = S.chars[id];
        if (!h.target) continue;
        const r = D.rooms[h.room], dx = h.target.x - h.x, dy = h.target.y - h.y, dist = Math.hypot(dx, dy);
        const step = 520 * scaleAt(h.y, r) * dt;
        if (Math.abs(dx) > 3) h.dir = dx > 0 ? 1 : -1;
        if (dist <= step) {
          h.x = h.target.x; h.y = h.target.y; h.target = null; h.phase = 0;
          const res = h.resolve; h.resolve = null; if (res) res(true);
        } else {
          h.x += (dx / dist) * step; h.y += (dy / dist) * step; h.phase += step / (STRIDE * scaleAt(h.y, r));
          if (D.fourth === "stamina" && id === active) h.fourth = clamp(h.fourth - step * 0.002 * (D.staminaFactor ? D.staminaFactor(E, id) : 1));
        }
        moved = true;
      }
      if (moved) placeAll();
      // Gelaufene Strecke für den Abspann (in Spielpixeln; ein Schritt sind etwa 70)
      if (moved && started) S.stats.weg += 520 * scaleAt(hero().y) * dt;
      if (started) idleTalk(now);
      if (SAVE.realtime && !paused()) { rtAcc += dt; if (rtAcc >= 1) { rtAcc -= 1; spend(1); } }
      drawFx(dt);
    }
    requestAnimationFrame(tick);
  }

  // ---------- Wetter-Effekte ----------
  const fx = $("fx"), fctx = fx.getContext("2d");
  let drops = [], flash = 0, nextBolt = 6;
  function drawFx(dt) {
    const w = started && S ? weather() : null;
    fctx.clearRect(0, 0, fx.width, fx.height);
    if (!w || reduce) return;
    const rain = w === "regen" ? 160 : w === "niesel" ? 60 : w === "gewitter" ? 200 : 0;
    while (drops.length < rain) drops.push({ x: Math.random() * fx.width, y: Math.random() * fx.height, v: 500 + Math.random() * 300 });
    if (drops.length > rain) drops.length = rain;
    fctx.strokeStyle = "rgba(200,215,230,0.45)"; fctx.lineWidth = 1;
    fctx.beginPath();
    for (const d of drops) {
      d.y += d.v * dt; d.x -= d.v * dt * 0.15;
      if (d.y > fx.height) { d.y = -10; d.x = Math.random() * fx.width * 1.1; }
      fctx.moveTo(d.x, d.y); fctx.lineTo(d.x + 3, d.y - 14);
    }
    fctx.stroke();
    if (w === "hitze") { fctx.fillStyle = "rgba(255,190,90,0.07)"; fctx.fillRect(0, 0, fx.width, fx.height); }
    if (w === "gewitter") {
      nextBolt -= dt;
      if (nextBolt <= 0) { flash = 1; nextBolt = 7 + Math.random() * 9; setTimeout(() => { thunder(); flinch(); }, 900 + Math.random() * 2000); }
      if (flash > 0) { fctx.fillStyle = `rgba(235,240,255,${(flash * 0.6).toFixed(2)})`; fctx.fillRect(0, 0, fx.width, fx.height); flash = Math.max(0, flash - dt * 3); }
    }
  }

  // ---------- Sprechen ----------
  let subDone = null, subTimer = null, playing = null, narrating = false;
  // Während gesprochen wird, tritt das Waldrauschen leiser
  function duck() { if (ambGain && ac && !SAVE.muted) ambGain.gain.setTargetAtTime(AMB_DUCK, ac.currentTime, 0.15); }
  function unduck() { if (ambGain && ac && !SAVE.muted) ambGain.gain.setTargetAtTime(AMB, ac.currentTime, 0.4); }
  // Wegklicken beendet nur den Untertitel: Der Ton läuft zu Ende (lingering), bis ein neuer Satz mit Ton kommt.
  // hard = sofort still (Menü, neuer Tag, Notruf, Tagebuch, Abspann).
  let lingering = null;
  function stopLinger() { if (lingering) { lingering.pause(); lingering = null; } }
  function stopTalk(hard) {
    clearTimeout(subTimer);
    if (playing) {
      const a = playing; playing = null;
      if (hard || a.paused || a.ended) a.pause();
      else { if (lingering !== a) stopLinger(); lingering = a; a.onended = () => { if (lingering === a) { lingering = null; unduck(); } }; }
    }
    if (hard) stopLinger();
    if (!lingering) unduck();
    $("subs").innerHTML = ""; $("narr").hidden = true; narrating = false;
    if (subDone) { const d = subDone; subDone = null; d(); }
  }
  // Eine Zeile ist: Clip-Name, {narr:"key"}, "H: Text" / "J: Text" / "S: Text" (Stefan) oder einfacher Text der aktiven Figur
  function parse(line) {
    if (line && typeof line === "object") {
      if (line.narr) return { narr: true, text: NARR[line.narr].text, file: NARR[line.narr].file };
      return { who: line.who || active, text: line.text };
    }
    if (CLIPS[line]) { const c = CLIPS[line]; addTo("clips", line); return { who: c.who || active, text: c.text, file: c.file }; }
    const m = /^([HJSN]): (.*)$/s.exec(line);
    if (m) return m[1] === "N" ? { narr: true, text: m[2] } : { who: { H: "hannes", J: "jonas", S: "other" }[m[1]], text: m[2] };
    return { who: active, text: line };
  }
  function say(line, t) {
    return new Promise((res) => {
      if (t !== token || line == null) return res();
      stopTalk();
      const p = parse(line);
      if (p.narr) { $("narr").textContent = p.text; $("narr").hidden = false; narrating = true; }
      else {
        const sp = p.who !== "other" && S.chars[p.who] && S.chars[p.who].room === hero().room ? S.chars[p.who] : hero();
        const d = document.createElement("div");
        d.className = "sub " + (p.who === "other" ? "other" : p.who);
        d.textContent = (p.who === "other" ? "Stefan: " : "") + p.text;
        const head = sp.y - 480 * scaleAt(sp.y, D.rooms[sp.room]) - 30;
        d.style.top = Math.max(14, (head / 1080) * 100) + "%";
        $("subs").appendChild(d);
        const W = stage.clientWidth, w = d.offsetWidth;
        d.style.left = Math.max(w / 2 + 10, Math.min(W - w / 2 - 10, (sp.x / 1920) * W)) + "px";
      }
      subDone = res;
      const fallback = () => { if (subDone !== res) return; clearTimeout(subTimer); subTimer = setTimeout(stopTalk, 1400 + p.text.length * 55); };
      if (p.file && !SAVE.muted) {
        const a = sound(p.file);
        routeVoice(a);
        stopLinger(); // Der neue Satz löst den alten Ton ab
        playing = a;
        try { a.currentTime = 0; } catch (e) {}
        // Die Zeile endet erst, wenn der Ton wirklich zu Ende ist (kurze Nachlaufzeit, damit nichts abgehackt wirkt)
        a.onended = () => { if (playing === a) { subTimer = setTimeout(() => { if (playing === a) { playing = null; stopTalk(); } }, 250); } };
        a.play().then(duck).catch(fallback);
        // Notbremse nur, falls der Ton hängt: Dauer der Datei plus Puffer
        const guard = () => { clearTimeout(subTimer); subTimer = setTimeout(stopTalk, ((isFinite(a.duration) ? a.duration : 60) + 3) * 1000); };
        if (a.readyState >= 1) guard(); else { subTimer = setTimeout(stopTalk, 90000); a.addEventListener("loadedmetadata", () => { if (playing === a) guard(); }, { once: true }); }
      } else fallback();
    });
  }
  // Kurze Atempause zwischen zwei Zeilen, damit Original und Untertitel nicht aneinanderkleben
  const pauseBetween = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
  async function lines(list, t) {
    let first = true;
    for (const l of list || []) {
      if (t !== token) return;
      if (!first) await pauseBetween(180);
      // Bei offenem Tagebuch wartet das Gespräch, statt dahinter weiterzulaufen
      while (!$("book").hidden && t === token) await pauseBetween(200);
      if (t !== token) return;
      first = false;
      await say(l, t);
    }
  }

  // ---------- Begegnungen und Minispiele ----------
  // Nach "Menü" oder "Tag neu starten" laufen alte Abläufe nicht weiter in den neuen Tag hinein
  const stale = () => !S || !started;
  function encounter(enc) {
    if (stale()) return new Promise(() => {});
    return new Promise((res) => {
      token++;
      stopTalk(); closeVerbs(); setInv(false); stopWalk();
      $("chTitle").textContent = enc.title;
      $("chText").textContent = enc.text;
      const box = $("chOpts");
      box.innerHTML = "";
      enc.opts.forEach((o) => {
        const b = document.createElement("button");
        b.type = "button"; b.textContent = o.label;
        b.addEventListener("click", async (e) => {
          e.stopPropagation();
          $("choice").hidden = true;
          const t2 = ++token;
          const out = await o.go(E);
          await lines(out, t2);
          res(o.value);
        });
        box.appendChild(b);
      });
      $("choice").hidden = false;
      box.firstChild.focus({ preventScroll: true });
    });
  }
  function minigame(name, opts) {
    if (stale()) return new Promise(() => {});
    return new Promise((res) => {
      token++;
      stopTalk(); closeVerbs(); setInv(false); stopWalk();
      // Passende Haltung (Angel, Karte, am Feuer knien) bleibt bis nach dem Text stehen
      const mp = MG_POSE[name];
      if (mp) for (const id of name === "karte" ? anwesend() : [active]) if (!S.chars[id].pose) tempPose(id, mp);
      const mg = $("mg"), body = $("mgBody"), foot = $("mgFoot");
      body.innerHTML = ""; foot.innerHTML = "";
      $("mgTitle").textContent = ""; $("mgText").textContent = "";
      mg.hidden = false;
      let finished = false;
      const api = {
        body, foot,
        title: (t) => { $("mgTitle").textContent = t; },
        text: (t) => { $("mgText").textContent = t; },
        msg(t, color) { let m = body.querySelector(".msg"); if (!m) { m = document.createElement("div"); m.className = "msg"; body.appendChild(m); } m.textContent = t; m.style.color = color || "var(--fg)"; },
        button(label, fn) { const b = document.createElement("button"); b.type = "button"; b.textContent = label; b.addEventListener("click", (e) => { e.stopPropagation(); fn(); }); foot.appendChild(b); return b; },
        done(result) { if (finished) return; finished = true; if (S) S.stats.minispiele++; mg.hidden = true; body.innerHTML = ""; foot.innerHTML = ""; res(result); },
        reduce, E
      };
      window.__mgDone = api.done; // nur für automatische Tests
      MINIGAMES[name](api, opts || {});
    });
  }

  // ---------- Videos aus den Folgen ----------
  // E.video({ src, label, subs: [[von, bis, text], ...], who }) spielt einen Clip im GoPro-Rahmen.
  // Tippen oder „Weiter“ beendet ihn; stumm geschaltet läuft das Bild mit Untertiteln ohne Ton.
  function video(opt) {
    if (stale()) return new Promise(() => {});
    return new Promise((res) => {
      token++;
      stopTalk(true); closeVerbs(); setInv(false); stopWalk();
      const box = $("vplayer"), v = $("vvideo"), sub = $("vsub");
      sub.style.color = opt.who === "hannes" ? "var(--hannes)" : "var(--jonas)";
      $("vlabel").textContent = opt.label || "";
      let fertig = false;
      const ende = () => {
        if (fertig) return; fertig = true;
        v.pause(); v.ontimeupdate = v.onended = v.onerror = null;
        box.hidden = true; box.onclick = null; sub.textContent = ""; unduck(); res();
      };
      v.src = opt.src; v.muted = SAVE.muted; v.currentTime = 0;
      if (!SAVE.muted) routeVoice(v);
      v.ontimeupdate = () => { const t = v.currentTime, z = (opt.subs || []).find(([a, b]) => t >= a && t <= b + 0.6); sub.textContent = z ? z[2] : ""; };
      v.onended = () => setTimeout(ende, 400);
      v.onerror = ende;
      box.onclick = (e) => { e.stopPropagation(); ende(); };
      box.hidden = false;
      duck();
      v.play().catch(() => { v.muted = true; v.play().catch(ende); });
    });
  }

  // ---------- Kombinieren, Figur, Partner ----------
  async function combine(a, b) {
    const t = ++token;
    let out = D.combine ? await D.combine(a, b, E) : undefined;
    if (out === undefined) out = ["Das passt nicht zusammen."];
    spend(3); renderInv(); renderGoals();
    await lines(out, t);
  }
  function selfDefault(verb, item) {
    const h = hero(), H = active === "hannes";
    if (verb.look) {
      if (h.thirst < 30) return ["Ich hab richtig Durst."];
      if (h.hunger < 30) return ["Ich könnte was essen."];
      if (h.fourth < 30) return [D.fourth === "stamina" ? "Meine Beine sind Pudding." : "Langsam drehe ich durch."];
      if (h.health < 50) return ["Mir geht's nicht so gut."];
      return [D.selfLook ? D.selfLook(E) : H ? "Nass, aber gut gelaunt." : "Geht schon. Irgendwie."];
    }
    if (verb.use) return ["Ich bin's. Was soll ich mit mir machen?"];
    const I = ITEMS[item] || {};
    if (I.eat || I.drink || I.heal || I.mood) {
      h.hunger = clamp(h.hunger + (I.eat || 0));
      h.thirst = clamp(h.thirst + (I.drink || 0));
      h.health = clamp(h.health + (I.heal || 0));
      h.fourth = clamp(h.fourth + (I.mood || 0));
      if (I.becomes) swap(item, I.becomes); else drop(item);
      spend(4);
      return [I.say || "Lecker."];
    }
    if (I.selfSay) return [I.selfSay];
    return ["Damit kann ich an mir nichts anfangen."];
  }
  async function partnerAction(id, verb, item) {
    const o = S.chars[id], n = CHARS[id].name;
    let out = D.partner ? await D.partner(id, verb, item, E) : undefined;
    if (out !== undefined) return out;
    if (verb.look) return [`${n}. Sieht genauso fertig aus wie ich.`];
    if (verb.use) { const talk = D.talk ? D.talk(id, E) : null; return talk || [`Na, ${n}?`, (id === "jonas" ? "J: " : "H: ") + "Läuft."]; }
    // Essen und Trinken: Der Partner nimmt es direkt, eine leere Flasche kommt zurück
    const I = ITEMS[item] || {}, tag = id === "jonas" ? "J: " : "H: ";
    if ((I.drink || I.eat) && (o.thirst < 75 || o.hunger < 75)) {
      o.thirst = clamp(o.thirst + (I.drink || 0)); o.hunger = clamp(o.hunger + (I.eat || 0));
      o.health = clamp(o.health + (I.heal || 0)); o.fourth = clamp(o.fourth + (I.mood || 0));
      if (I.becomes) swap(item, I.becomes); else drop(item);
      return [`Hier, ${n}.`, tag + (I.drink ? "Danke. Ah, das tut gut." : "Danke! Genau das hab ich gebraucht.")];
    }
    // Sonstiger Gegenstand: geben
    drop(item); o.inv.push(item);
    return [`Hier, ${n}. Nimm du das.`, tag + "Danke."];
  }

  // ---------- Klicks ----------
  function toScene(e) { const p = scene.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(scene.getScreenCTM().inverse()); }
  let pending = null;
  // Touch: lange auf die Szene drücken zeigt alle klickbaren Stellen (wie die Leertaste)
  let pressTimer = null, pressShown = false;
  scene.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "touch" || !started) return;
    const sp = toScene(e); pointer = [sp.x, sp.y];
    clearTimeout(pressTimer);
    pressTimer = setTimeout(() => { pressShown = true; spaceHeld = true; updateDots(pointer[0], pointer[1]); }, 450);
  });
  const pressEnd = () => { clearTimeout(pressTimer); if (pressShown) { spaceHeld = false; setTimeout(() => { pressShown = false; updateDots(pointer[0], pointer[1]); }, 0); } };
  scene.addEventListener("pointerup", pressEnd);
  scene.addEventListener("pointercancel", pressEnd);
  scene.addEventListener("contextmenu", (e) => { if (pressShown || e.pointerType === "touch") e.preventDefault(); });
  scene.addEventListener("click", (e) => {
    if (!started) return;
    if (pressShown) return; // Das war ein langes Drücken, kein Klick
    if (!$("gpanel").hidden) { setGoalPanel(false); return; } // Antippen der Szene schließt die Zielliste
    if (subDone) { stopTalk(); return; }
    if (paused()) { if (hero().done && !S.inNight && $("half").hidden && $("dayEnd").hidden && $("choice").hidden) say(active === "hannes" ? "Zzz … Ich schlaf schon." : "Lass mich, ich lieg schon im Schlafsack.", ++token); return; }
    if (!$("verbs").hidden) { closeVerbs(); return; }
    if (invOpen) { setInv(false); return; }
    const hot = e.target.closest(".hot");
    if (hot) {
      const key = hot.dataset.hot;
      const spot = room().hot[key];
      if (spot && spot.exit) { select(null); run(key, { use: true }); return; }
      if (selected) { run(key, { item: selected }); return; }
      openVerbs(key, e);
      return;
    }
    token++;
    const p = toScene(e);
    walkTo(p.x, p.y);
  });
  scene.addEventListener("pointermove", (e) => {
    const sp = toScene(e);
    updateDots(sp.x, sp.y);
    const r = stage.getBoundingClientRect(), cl = $("cursorlabel");
    cl.style.left = e.clientX - r.left + "px"; cl.style.top = e.clientY - r.top + "px";
    if (!S) return;
    const hot = e.target.closest(".hot"), hl = $("hotlabel");
    const name = hot ? hotName(hot.dataset.hot) : "";
    if (name) { hl.textContent = name; hl.classList.add("on"); if (selected) cl.textContent = `${itemName(selected)} + ${name}`; }
    else { hl.classList.remove("on"); if (selected) cl.textContent = itemName(selected) + " + …"; }
  });
  scene.addEventListener("pointerleave", () => { $("hotlabel").classList.remove("on"); updateDots(-9999, -9999); });
  function hotName(key) {
    if (key.startsWith("char:")) return CHARS[key.slice(5)].name;
    const h = room().hot[key];
    if (!h) return "";
    return typeof h.name === "function" ? h.name(E) : h.name;
  }
  function openVerbs(key, e) {
    const r = stage.getBoundingClientRect(), v = $("verbs");
    pending = key;
    v.style.left = Math.max(70, Math.min(r.width - 70, e.clientX - r.left)) + "px";
    v.style.top = Math.max(70, Math.min(r.height - 40, e.clientY - r.top)) + "px";
    $("vname").textContent = hotName(key);
    v.hidden = false;
    $("v-look").focus({ preventScroll: true });
  }
  function closeVerbs() { $("verbs").hidden = true; pending = null; }
  $("v-look").addEventListener("click", (e) => { e.stopPropagation(); const k = pending; closeVerbs(); if (k) run(k, { look: true }); });
  $("v-use").addEventListener("click", (e) => { e.stopPropagation(); const k = pending; closeVerbs(); if (k) run(k, { use: true }); });
  stage.addEventListener("contextmenu", (e) => { if (selected) { e.preventDefault(); select(null); } });
  $("bag").addEventListener("click", (e) => { e.stopPropagation(); if (!started || paused()) return; closeVerbs(); if (subDone) stopTalk(); setInv(!invOpen); });
  for (const w of ["hannes", "jonas"]) $("who-" + w).addEventListener("click", (e) => { e.stopPropagation(); if (started && $("choice").hidden && $("mg").hidden && S.chars[w]) switchTo(w); });
  $("reveal").addEventListener("click", (e) => { e.stopPropagation(); setReveal(!revealAll); });
  $("tip").addEventListener("click", (e) => { e.stopPropagation(); tip(); });
  $("bookBtn").addEventListener("click", (e) => { e.stopPropagation(); openBook(); });
  $("selX").addEventListener("click", (e) => { e.stopPropagation(); select(null); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeVerbs(); setInv(false); select(null); stopTalk(); closeBook(); }
    const inDialog = e.target.closest && e.target.closest(".choice, .overlay, .verbs, .mg, .book");
    if (e.code === "Space" && started && !inDialog && $("mg").hidden) { e.preventDefault(); if (!spaceHeld) { spaceHeld = true; updateDots(pointer[0], pointer[1]); } }
    if (!inDialog && (e.key === "t" || e.key === "T")) tip();
    if (!inDialog && (e.key === "b" || e.key === "B") && started) openBook();
    if (e.key === "m" || e.key === "M") toggleMute();
  });
  document.addEventListener("keyup", (e) => { if (e.code === "Space" && spaceHeld) { e.preventDefault(); spaceHeld = false; updateDots(pointer[0], pointer[1]); } });
  window.addEventListener("blur", () => { if (spaceHeld) { spaceHeld = false; updateDots(pointer[0], pointer[1]); } });

  // ---------- Handlungen ----------
  async function run(key, verb) {
    let t = ++token;
    clearTemp();
    const h = hero(), item = verb.item;
    if (item) select(null);
    if (key.startsWith("char:")) {
      const id = key.slice(5);
      let out;
      const trink = item && ITEMS[item] && ITEMS[item].drink;
      if (id === active) { out = (D.self && (await D.self(verb, item, E))) || selfDefault(verb, item); if (trink) tempPose(active, "trinken"); }
      else {
        const o = S.chars[id];
        if (!verb.look) { const ok = await walkTo(o.x + (h.x < o.x ? -150 : 150), o.y); if (!ok || t !== token) return; }
        face(o.x); face(h.x, id);
        if (trink && (o.thirst < 75 || o.hunger < 75)) tempPose(id, "trinken");
        out = await partnerAction(id, verb, item);
        spend(verb.look ? 1 : 4);
      }
      t = token;
      renderInv(); renderHud(); renderGoals();
      await lines(out, t);
      clearTemp();
      if (S && S.jubel) { S.jubel = false; jubel(); }
      return;
    }
    const spot = room().hot[key];
    if (!spot) return;
    if (!verb.look) {
      const d = Math.hypot(spot.stand[0] - h.x, spot.stand[1] - h.y);
      if (D.together && !spot.exit) partnerFollow(spot.stand, spot.face);
      const ok = await walkTo(spot.stand[0], spot.stand[1]);
      if (!ok || t !== token) return;
      spend(Math.round(d / 160));
    }
    if (spot.exit) {
      if (spot.exit.need) { const why = spot.exit.need(E); if (why) { await lines(why, t); return; } }
      await enterRoom(spot.exit, t); return;
    }
    face(spot.face);
    lastSpot = spot;
    // Sitzplätze (sit: [x, y, Blickrichtung], zu zweit sit2 für den Partner): hinsetzen, nach dem Text wieder aufstehen
    const sitzt = verb.use && spot.sit ? [active].concat(D.together && spot.sit2 ? others().filter((id) => !S.chars[id].away) : []) : [];
    sitzt.forEach((id, i) => { const p = i ? spot.sit2 : spot.sit; E.sit(id, p[0], p[1], p[2]); });
    let out = D.act ? await D.act(key, verb, item, E) : undefined, ohneWirkung = null;
    // Begegnungen und Minispiele mitten in einer Handlung vergeben ein neues Token; die Antwort soll trotzdem kommen
    t = token;
    if (out === undefined) {
      const L = D.looks && D.looks[key], U = D.uses && D.uses[key];
      if (verb.look) out = [].concat(L || (typeof spot.look === "function" ? spot.look(E) : spot.look) || "Nichts Besonderes.");
      else if (verb.use) out = [].concat(U || (typeof spot.use === "function" ? spot.use(E) : spot.use) || (ohneWirkung = "Da kann ich nichts machen."));
      else out = [item === "handy" && D.noSignal ? D.noSignal : (ohneWirkung = "Das bringt hier nichts.")];
    }
    // Stellen am Boden (kneel): zum Benutzen hinknien, z. B. Wasser schöpfen, Beeren pflücken, Feuer machen
    // Gegenstände mit eigener Haltung (Handy hochhalten, mit dem Kukri hacken), Baden, Liegen
    const wirkt = !verb.look && !ohneWirkung && t === token && !h.done;
    const itemPose = wirkt && item && ITEM_POSE[item] && !h.pose ? ITEM_POSE[item] : null;
    if (itemPose) tempPose(active, itemPose);
    const badet = wirkt && verb.use && spot.bath;
    if (badet) await bathIn(active, spot.bath);
    const liegt = wirkt && verb.use && spot.lie && !badet;
    if (liegt) { const b = spot.lie; h.x = b[0]; h.y = b[1]; h.dir = b[2] || 1; h.lift = b[3] || 0; h.pose = "liegen"; placeAll(); }
    const kniet = wirkt && spot.kneel && !sitzt.length && !itemPose && !badet && !liegt && (!h.pose || h.pose === "knien");
    if (kniet) { h.pose = "knien"; place(active); }
    if (t === token) spend(verb.look ? 1 : 8);
    renderGoals(); renderInv();
    await lines(out, t);
    for (const id of sitzt) if (S.chars[id].pose === "sitzen") E.stand(id);
    if (kniet && h.pose === "knien" && !h.done) E.stand(active);
    if (badet && S) await bathOut(active, spot.stand);
    if (liegt && S && h.pose === "liegen") { h.pose = null; h.lift = 0; h.x = spot.stand[0]; h.y = spot.stand[1]; placeAll(); }
    if (S && t === token) clearTemp();
    if (S && S.jubel) { S.jubel = false; jubel(); }
    // Zu zweit freut sich der Partner über ein geschafftes Ziel
    if (t === token && S.cheer) { S.cheer = false; const o = others()[0]; if (o && !S.chars[o].away) { await pauseBetween(180); await say(tagOf(o) + pick(CHEER[o]), t); } }
    if (t === token) timedEvents();
    if (t === token && allGoals() && !S.flags["_sleepHint" + owner()] && !hero().done) {
      S.flags["_sleepHint" + owner()] = true;
      if (D.sleepHint) await lines([D.sleepHint(E)], t);
    }
  }
  async function enterRoom(exit, t) {
    $("fade").classList.add("on");
    await new Promise((r) => setTimeout(r, reduce ? 0 : 360));
    if (t !== null && t !== token) { $("fade").classList.remove("on"); return; }
    const h = hero();
    h.room = exit.to; h.x = exit.spawn[0]; h.y = exit.spawn[1]; h.dir = exit.dir; h.target = null; h.pose = null; h.lift = 0;
    // Zu zweit läuft der Partner mit
    if (D.together) for (const id of others()) { const o = S.chars[id]; o.room = exit.to; o.x = exit.spawn[0] - exit.dir * 170; o.y = exit.spawn[1] + 10; o.dir = exit.dir; o.target = null; o.pose = null; o.lift = 0; }
    showRoom();
    $("fade").classList.remove("on");
    if (D.enter) { const out = await D.enter(exit.to, E); if (out) await lines(out, t); clearTemp(); }
  }
  function show(id) {
    active = id;
    showRoom();
    for (const w of ["hannes", "jonas"]) { $("who-" + w).setAttribute("aria-pressed", w === id); $("who-" + w).hidden = !S.chars[w] || S.chars[w].away; }
    select(null); setInv(false); renderInv(); renderGoals(); renderHud();
  }
  async function switchTo(id) {
    if (id === active) return;
    const t = ++token;
    stopTalk(); closeVerbs(); stopWalk();
    if (D.together) { show(id); return; }
    $("fade").classList.add("on");
    await new Promise((r) => setTimeout(r, reduce ? 0 : 360));
    show(id);
    $("fade").classList.remove("on");
    const h = S.chars[id];
    if (!h.introduced) { h.introduced = true; if (D.chars[id].narr) { await pauseBetween(600); await say({ narr: D.chars[id].narr }, t); } }
    if (D.onSwitch) { const out = await D.onSwitch(id, E); if (out) await lines(out, t); }
  }
  function tip() {
    if (!started || paused()) return;
    closeVerbs(); setInv(false);
    // Erst das Überleben: Wer Durst hat und etwas zu trinken dabei hat, bekommt das als Tipp
    const h = hero(), drink = h.inv.find((it) => ITEMS[it] && ITEMS[it].drink), food = h.inv.find((it) => ITEMS[it] && ITEMS[it].eat);
    if (h.thirst < 30 && drink) return say(`Ich muss was trinken. ${itemName(drink)} auf mich anwenden.`, ++token);
    const bottle = ["filterflasche", "metallflasche"].find((it) => h.inv.includes(it));
    if (h.thirst < 30 && bottle && D.fourth !== "mood") return say(`Ich hab Durst. ${itemName(bottle)} am Wasser füllen.`, ++token);
    if (h.hunger < 30 && food) return say(`Ich sollte was essen. ${itemName(food)} auf mich anwenden.`, ++token);
    say(D.hint ? D.hint(E) : "Ich schau mich erst mal um.", ++token);
  }

  // ---------- Inventar-Hilfen ----------
  const has = (it, who) => (who ? S.chars[who] : hero()).inv.includes(it);
  function add(it, who) { if (it === "fisch") S.stats.fische++; (who ? S.chars[who] : hero()).inv.push(it); renderInv(); if (!who || who === active) gained(it); }
  function drop(it, who) { const inv = (who ? S.chars[who] : hero()).inv, i = inv.indexOf(it); if (i >= 0) inv.splice(i, 1); if (selected === it) select(null); renderInv(); }
  function swap(a, b, who) { const inv = (who ? S.chars[who] : hero()).inv, i = inv.indexOf(a); if (i >= 0) inv[i] = b; if (selected === a) select(null); renderInv(); }
  const showEl = (id) => { const el = $(id); if (el) el.setAttribute("opacity", 1); };
  const hideEl = (id) => { const el = $(id); if (el) el.setAttribute("opacity", 0); };
  function hot(key, on) { for (const el of document.querySelectorAll(`#rooms [data-hot="${key}"]`)) el.setAttribute("display", on ? "inline" : "none"); buildDots(); }

  // ---------- Tagebuch ----------
  let bookTab = "wissen";
  function openBook() { if (!started) return; closeVerbs(); setInv(false); stopTalk(true); $("book").hidden = false; renderBook(); }
  function renderBook() {
    for (const b of document.querySelectorAll(".book .tabs button")) b.setAttribute("aria-selected", b.dataset.tab === bookTab);
    const list = $("bookList");
    let html = "";
    if (bookTab === "wissen") {
      const got = SAVE.journal.filter((k) => JOURNAL[k]);
      html = got.length ? got.map((k) => `<div class="entry"><b>${JOURNAL[k].title}</b><p>${JOURNAL[k].text}</p></div>`).join("")
        : `<p class="empty">Noch nichts gelernt. Knoten, Pflanzen und Tricks landen hier, sobald Hannes oder Jonas sie anwenden.</p>`;
    } else if (bookTab === "clips") {
      const got = SAVE.clips.filter((k) => CLIPS[k] && CLIPS[k].folge);
      html = got.length ? got.map((k) => { const c = CLIPS[k]; return `<div class="entry"><img src="galerie/${k}.jpg" alt="" onerror="this.remove()"><b>${CHARS[c.who] ? CHARS[c.who].name : "Originalton"} · Folge ${c.folge}</b><p>„${c.text}“</p><button type="button" data-play="${k}">Anhören</button></div>`; }).join("")
        : `<p class="empty">Noch keine Originaltöne gehört. Jeder echte Satz aus den Folgen, den du im Spiel hörst, landet hier.</p>`;
    } else {
      html = Object.keys(EGGS).sort((a, b) => EGGS[a].day - EGGS[b].day).map((k) => SAVE.eggs.includes(k)
        ? `<div class="entry"><b>${EGGS[k].label}</b><p>Tag ${EGGS[k].day}</p></div>`
        : `<div class="entry locked"><b>???</b><p>Tag ${EGGS[k].day}</p></div>`).join("");
    }
    list.innerHTML = html;
    for (const b of list.querySelectorAll("[data-play]")) b.addEventListener("click", () => {
      stopBookClip();
      // Eigenes Audio-Objekt, damit es nicht mit derselben Zeile im Spiel kollidiert
      bookClip = new Audio(CLIPS[b.dataset.play].file.replace(/\.wav$/, ".mp3"));
      routeVoice(bookClip);
      if (!SAVE.muted) bookClip.play().catch(() => {});
    });
  }
  let bookClip = null;
  function stopBookClip() { if (bookClip) { bookClip.pause(); bookClip = null; } }
  function closeBook() { stopBookClip(); $("book").hidden = true; }
  for (const b of document.querySelectorAll(".book .tabs button")) b.addEventListener("click", (e) => { e.stopPropagation(); bookTab = b.dataset.tab; renderBook(); });
  $("bookClose").addEventListener("click", (e) => { e.stopPropagation(); closeBook(); });

  // ---------- Schlafen, Nacht, Tagesende ----------
  // Abend am Feuer (zu zweit) oder Video-Tagebuch (allein): Themen wählen, Antworten sind Originaltöne
  async function campfire() {
    const topics = ((D.campfire && D.campfire[owner()]) || []).filter((x) => !x.need || x.need(E));
    if (!topics.length) return;
    const told = new Set();
    for (;;) {
      const left = topics.filter((x) => !told.has(x.label));
      const opts = left.map((x) => ({ label: x.label, value: x.label, go: () => { told.add(x.label); return x.lines; } }));
      opts.push({ label: told.size ? "Gute Nacht" : "Gleich schlafen", value: null, go: () => [] });
      const r = await encounter({
        title: D.together ? "Abend am Feuer" : "Video-Tagebuch",
        text: D.together ? "Die Sonne geht unter. Worüber reden Hannes und Jonas noch?" : `Bevor ${CHARS[active].name} sich hinlegt, noch ein paar Worte in die Kamera.`,
        opts
      });
      if (r == null || !S || told.size >= topics.length) return;
    }
  }
  // Schlafengehen an der zuletzt benutzten Stelle. Offener Schlafplatz: bed: [x, y, Blickrichtung, Höhe]
  // (zu zweit bed2) – die Figur liegt sichtbar im Schlafsack. Tarp oder Shelter: tent: [x, y] (zu zweit tent2) –
  // die Figur kriecht hinein und verschwindet, das Zzz steigt aus dem Tarp.
  let lastSpot = null;
  const zzzSvg = (x, y, sc) => `<g class="zzz" transform="translate(${x} ${y}) scale(${sc})"><text>z</text><text>z</text><text>Z</text></g>`;
  function renderFront() { $("front").innerHTML = (S.sleepZ || []).filter((z) => z.room === hero().room).map((z) => zzzSvg(z.x, z.y, z.s)).join(""); }
  async function goToBed(ids) {
    // Nur wenn die Stelle im aktuellen Raum liegt (sonst schläft die Figur einfach dort, wo sie ist)
    const spot = lastSpot && Object.values(room().hot).includes(lastSpot) ? lastSpot : {};
    // sleepAt(E, id, i) entscheidet je Figur selbst, z. B. Hängematte für Jonas, Shelter für Hannes
    const plan = ids.map((id, i) => Object.assign({ id }, spot.sleepAt ? spot.sleepAt(E, id, i) : { bed: i ? spot.bed2 : spot.bed, tent: i ? spot.tent2 : spot.tent })).filter((p) => p.bed || p.tent);
    if (!plan.length) return;
    const wait = (ms) => new Promise((r) => setTimeout(r, reduce || window.__testFast ? 0 : ms));
    S.tint = 0.35; renderHud();
    for (const p of plan) { const h = S.chars[p.id]; h.target = null; h.pose = "knien"; if (p.tent) h.dir = p.tent[0] >= h.x ? 1 : -1; }
    placeAll();
    await wait(600);
    // Ins Tarp kriechen: kniend hinein und dabei ausblenden
    const kriecher = plan.filter((p) => p.tent).map((p) => ({ p, h: S.chars[p.id], x0: S.chars[p.id].x, y0: S.chars[p.id].y }));
    sfx("rascheln", 0.8);
    if (kriecher.length && !(reduce || window.__testFast)) {
      const t0 = performance.now();
      await new Promise((res) => {
        const step = (now) => {
          const k = Math.min(1, (now - t0) / 700);
          for (const c of kriecher) {
            c.h.x = c.x0 + (c.p.tent[0] - c.x0) * k * 0.6; c.h.y = c.y0 + (c.p.tent[1] - c.y0) * k * 0.6;
            place(c.p.id); const a = $("actor-" + c.p.id); if (a) a.setAttribute("opacity", (1 - k).toFixed(2));
          }
          k < 1 ? requestAnimationFrame(step) : res();
        };
        requestAnimationFrame(step);
      });
    }
    S.sleepZ = S.sleepZ || [];
    for (const p of plan) {
      const h = S.chars[p.id], a = $("actor-" + p.id);
      if (a) a.removeAttribute("opacity");
      if (p.tent) { h.pose = null; h.hiddenActor = true; S.sleepZ = S.sleepZ.filter((z) => z.id !== p.id); S.sleepZ.push({ id: p.id, room: h.room, x: p.tent[0], y: p.tent[1] - 60, s: 1.5 * scaleAt(p.tent[1], D.rooms[h.room]) }); }
      else { const b = p.bed; h.x = b[0]; h.y = b[1]; h.dir = b[2] || 1; h.lift = b[3] || 0; h.pose = "liegen"; }
    }
    placeAll(); renderFront();
    sfx("schnarchen", 0.7);
    await wait(2200);
  }
  async function sleep() {
    if (!S.flags["_feuer" + owner()]) { S.flags["_feuer" + owner()] = true; S.tint = 0.3; renderHud(); await campfire(); if (!S) return; S.tint = null; }
    const t = token;
    const ids = D.together ? Object.keys(S.chars) : [active];
    // Wer schläft, schläft bis in den Abend: die Uhr springt mindestens auf 21:30
    for (const id of ids) { S.chars[id].done = true; S.chars[id].clock = Math.max(S.chars[id].clock, 21.5 * 60); }
    renderHud();
    stopWalk();
    await goToBed(ids);
    if (!S) return;
    S.tint = null; renderHud();
    const left = Object.keys(S.chars).filter((id) => !S.chars[id].done);
    if (left.length) {
      const o = left[0];
      $("halfTitle").textContent = `${CHARS[active].name} schläft`;
      $("halfText").textContent = D.halfText ? D.halfText(o, E) : `${CHARS[o].name} ist noch wach und hat noch zu tun.`;
      $("halfGo").textContent = `Weiter mit ${CHARS[o].name}`;
      $("halfGo").dataset.to = o;
      $("half").hidden = false;
      return;
    }
    await endDay(t);
  }
  async function endDay(t) {
    if (D.night) { S.inNight = true; S.tint = 0.5; renderHud(); await D.night(E); if (S) { S.tint = null; S.inNight = false; } }
    if (!S) return;
    const n = S.day, next = n + 1;
    SAVE.unlocked = Math.max(SAVE.unlocked, Math.min(7, next));
    // Nachwirkung für morgen und Zahlen für den Abspann
    SAVE.carry = { day: n, chars: {} };
    for (const id in S.chars) SAVE.carry.chars[id] = { health: Math.round(S.chars[id].health), fourth: Math.round(S.chars[id].fourth) };
    SAVE.week = SAVE.week || {};
    SAVE.week[n] = { weg: Math.round(S.stats.weg), feuer: S.stats.feuer, fische: S.stats.fische, minispiele: S.stats.minispiele };
    save();
    const dayEggs = Object.keys(EGGS).filter((k) => EGGS[k].day === n);
    const found = dayEggs.filter((k) => SAVE.eggs.includes(k)).length;
    const clips = Object.keys(CLIPS).filter((k) => CLIPS[k].day === n);
    const heard = clips.filter((k) => SAVE.clips.includes(k)).length;
    $("deSub").textContent = `Tag ${n} · ${D.weekday}`;
    $("deTitle").textContent = n === 7 ? "Überlebt" : `Tag ${n} geschafft`;
    $("deText").textContent = D.outro || "";
    $("deStats").textContent = `Eastereggs: ${found} von ${dayEggs.length} · Originaltöne gehört: ${heard} von ${clips.length}` +
      (n === 7 ? ` · Insgesamt ${SAVE.eggs.length} von ${Object.keys(EGGS).length} Eastereggs` : "");
    $("deNext").hidden = !DAYS[next];
    $("deNext").textContent = `Weiter mit Tag ${next}`;
    $("deCredits").hidden = n !== 7;
    $("dayEnd").hidden = false;
  }

  // ---------- Abspann: Standbilder aus den Folgen, Zahlen der Woche, Mitwirkende ----------
  let creditsTimer = null;
  function showCredits() {
    stopTalk(true); token++;
    const week = Object.values(SAVE.week || {}), sum = (k) => week.reduce((a, d) => a + (d[k] || 0), 0);
    const clipKeys = Object.keys(CLIPS).filter((k) => CLIPS[k].folge), heard = SAVE.clips.filter((k) => CLIPS[k] && CLIPS[k].folge);
    const pics = (heard.length >= 8 ? heard : clipKeys).slice().sort((a, b) => CLIPS[a].day - CLIPS[b].day || CLIPS[a].t - CLIPS[b].t);
    const fmt = (v) => v.toLocaleString("de-DE");
    $("crStats").innerHTML = [
      ["Gespielte Tage", `${week.length} von 7`],
      ["Schritte im Spiel", fmt(Math.round(sum("weg") / 70))],
      ["Feuer gemacht", sum("feuer")],
      ["Fische gefangen", sum("fische")],
      ["Minispiele", sum("minispiele")],
      ["Eastereggs", `${SAVE.eggs.length} von ${Object.keys(EGGS).length}`],
      ["Originaltöne gehört", `${heard.length} von ${clipKeys.length}`],
      ["Gelernt", `${SAVE.journal.filter((k) => JOURNAL[k]).length} von ${Object.keys(JOURNAL).length}`]
    ].map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join("");
    const box = $("crPics");
    box.innerHTML = "";
    let i = 0;
    const next = () => {
      if ($("credits").hidden) return;
      const k = pics[i++ % pics.length], img = new Image();
      img.alt = ""; img.src = `galerie/${k}.jpg`;
      img.onload = () => {
        box.appendChild(img);
        requestAnimationFrame(() => img.classList.add("on"));
        $("crCaption").textContent = `Folge ${CLIPS[k].folge} · „${CLIPS[k].text.length > 110 ? CLIPS[k].text.slice(0, 107) + " …" : CLIPS[k].text}“`;
        while (box.children.length > 2) box.firstChild.remove();
      };
      img.onerror = () => next();
      creditsTimer = setTimeout(next, reduce ? 6000 : 4200);
    };
    $("credits").hidden = false;
    $("crRoll").classList.remove("roll"); void $("crRoll").offsetWidth; $("crRoll").classList.add("roll");
    next();
    $("crClose").focus({ preventScroll: true });
  }
  function closeCredits() { clearTimeout(creditsTimer); $("credits").hidden = true; }
  $("deCredits").addEventListener("click", showCredits);
  $("crClose").addEventListener("click", closeCredits);
  $("menuCredits").addEventListener("click", showCredits);

  // ---------- Tag starten ----------
  function startDay(n) {
    token++; lastSpot = null;
    stopTalk(true);
    D = DAYS[n];
    D.together = D._together0;
    S = { day: n, flags: {}, goals: {}, chars: {}, fires: new Set(), tint: null, stats: { weg: 0, feuer: 0, fische: 0, minispiele: 0 } };
    // Was vom Vortag nachwirkt (nur, wenn der Vortag gerade eben gespielt wurde)
    const prev = SAVE.carry && SAVE.carry.day === n - 1 ? SAVE.carry.chars : null, notes = [];
    for (const id in D.chars) {
      const c = D.chars[id];
      S.chars[id] = Object.assign({ id, room: c.room, x: c.start[0], y: c.start[1], dir: c.dir || 1, target: null, resolve: null, phase: 0, away: !!c.away,
        inv: c.inv.slice(), flags: {}, health: 100, thirst: 60, hunger: 60, fourth: 70, clock: D.clock || 600, done: false, warned: {}, introduced: false }, c.stats || {});
      const h = S.chars[id], name = CHARS[id].name, p = prev && prev[id];
      if (p && p.health < 60) { h.health = clamp(h.health - Math.round((60 - p.health) / 2)); notes.push(`${name} ist von gestern noch angeschlagen.`); }
      if (p && p.fourth >= 75) { h.fourth = clamp(h.fourth + 10); notes.push(`${name} ist von gestern noch gut drauf.`); }
      // Selbst geschnitzte Dinge gibt es nur, wenn sie an ihrem Tag auch entstanden sind
      for (const [it, made, text] of [["loeffel", 2, "Jonas hat an Tag 2 keinen Löffel gebrannt."], ["herzschale", 3, "Die Herzschüssel ist an Tag 3 nicht fertig geworden."]]) {
        if (n > made && h.inv.includes(it) && !SAVE.persist.includes(it)) { h.inv.splice(h.inv.indexOf(it), 1); notes.push(text); }
      }
    }
    for (const o in D.goals) S.goals[o] = {};
    active = D.first || Object.keys(D.chars)[0];
    // Tagesspezifische Folgen früherer Entscheidungen (D.carry gibt Hinweistexte zurück)
    if (D.carry) notes.push(...(D.carry(E) || []));
    buildRooms(); buildActors();
    for (const id of ["menu", "dayEnd", "half", "over", "book"]) $(id).hidden = true;
    $("choice").hidden = true; $("mg").hidden = true;
    selected = null; $("selchip").hidden = true; $("cursorlabel").hidden = true; closeVerbs(); setReveal(false);
    toasts.length = 0; clearTimeout(toastTimer); $("toast").hidden = true;
    for (const id of ["hud", "who", "bag", "tools", "gmini"]) $(id).hidden = false;
    setGoalPanel(false);
    started = false;
    if (ac) ac.suspend();
    show(active);
    if (D.setup) D.setup(E);
    // Töne des Tages vorladen, damit kein Satz verspätet oder abgehackt startet
    for (const k in CLIPS) if (CLIPS[k].day === n) sound(CLIPS[k].file);
    for (const k in NARR) if (NARR[k].file) sound(NARR[k].file);
    $("diSub").textContent = `Tag ${n} · ${D.weekday} · Folge ${D.folge}`;
    $("diTitle").textContent = D.title;
    $("diText").textContent = D.intro;
    $("diNotes").hidden = !notes.length;
    $("diNotes").innerHTML = notes.length ? `<b>Aus den letzten Tagen</b>${notes.map((x) => `<span>${x}</span>`).join("")}` : "";
    $("dayIntro").hidden = false;
    $("diGo").focus({ preventScroll: true });
  }
  async function begin() {
    initAmbience();
    if (ac) ac.resume();
    $("dayIntro").hidden = true;
    started = true;
    const t = ++token;
    hero().introduced = true;
    // Ab Tag 2 beginnt der Morgen mit Aufwachen: aus dem Schlafplatz kriechen und strecken
    if (S.day > 1) wakeUp(Object.keys(S.chars).filter((id) => S.chars[id].room === hero().room));
    // Erst die Szene ankommen lassen, dann setzt der Erzähler ein
    await pauseBetween(900);
    if (t !== token) return;
    if (D.chars[active].narr) await say({ narr: D.chars[active].narr }, t);
    if (D.start) { const out = await D.start(E); if (out) await lines(out, t); }
  }
  function toMenu() {
    token++; stopTalk(true); started = false;
    $("vvideo").pause(); $("vplayer").hidden = true;
    selected = null; $("selchip").hidden = true; $("cursorlabel").hidden = true; setGoalPanel(false);
    // Im Menü ist Ruhe: Waldrauschen und Knistern anhalten
    if (ac) ac.suspend();
    $("lights").innerHTML = ""; lightsKey = "";
    stopBookClip();
    toasts.length = 0; clearTimeout(toastTimer); $("toast").hidden = true;
    for (const id of ["hud", "who", "bag", "tools", "gmini"]) $(id).hidden = true;
    for (const id of ["dayEnd", "half", "over", "book", "dayIntro"]) $(id).hidden = true;
    $("choice").hidden = true; $("mg").hidden = true; $("inv").hidden = true; closeVerbs();
    $("goals").innerHTML = ""; $("where").textContent = "Hauptmenü";
    if (S) { $("rooms").innerHTML = ""; $("actors").innerHTML = ""; $("dots").innerHTML = ""; }
    S = null;
    renderMenu();
    $("menu").hidden = false;
  }
  function renderMenu() {
    const list = $("dayList");
    list.innerHTML = "";
    for (let n = 1; n <= 7; n++) {
      const d = DAYS[n], b = document.createElement("button");
      b.type = "button";
      b.disabled = !d || n > SAVE.unlocked;
      b.innerHTML = `<b>Tag ${n}</b><span>${d ? (n > SAVE.unlocked ? "noch gesperrt" : d.title) : "kommt noch"}</span>${SAVE.week && SAVE.week[n] ? "<i>✓</i>" : ""}`;
      // Vorschaubild: der Raum, in dem der Tag beginnt
      if (d) { const c = d.chars[d.first || Object.keys(d.chars)[0]], r = d.rooms[c.room]; if (r) b.style.backgroundImage = `url("${r.bg}")`; }
      // Beim allerersten Start von Tag 1 läuft vorher das Intro (Stefan setzt beide aus)
      b.addEventListener("click", () => (n === 1 && !SAVE.introSeen ? playIntro(() => startDay(1)) : startDay(n)));
      list.appendChild(b);
    }
    $("optRealtime").checked = SAVE.realtime;
    $("menuCredits").hidden = !(SAVE.week && SAVE.week[7]);
  }
  $("optRealtime").addEventListener("change", (e) => { SAVE.realtime = e.target.checked; save(); });
  function playIntro(then) {
    SAVE.introSeen = true; save();
    if (!window.AusgesetztIntro) { if (then) then(); return; }
    $("menu").hidden = true;
    AusgesetztIntro.play({ muted: () => SAVE.muted, done: () => { if (then) then(); else $("menu").hidden = false; } });
  }
  $("menuIntro").addEventListener("click", () => playIntro(null));
  $("diGo").addEventListener("click", begin);
  $("halfGo").addEventListener("click", () => { $("half").hidden = true; switchTo($("halfGo").dataset.to); });
  $("deNext").addEventListener("click", () => startDay(S.day + 1));
  $("deMenu").addEventListener("click", toMenu);
  $("toMenu").addEventListener("click", toMenu);
  $("overGo").addEventListener("click", () => startDay(S.day));
  $("restart").addEventListener("click", () => { if (S) startDay(S.day); });
  function renderMute() {
    $("mute").textContent = SAVE.muted ? "Ton an" : "Ton aus";
    const b = $("muteBtn");
    b.setAttribute("aria-pressed", SAVE.muted);
    b.setAttribute("aria-label", SAVE.muted ? "Ton einschalten (M)" : "Ton ausschalten (M)");
    b.title = b.getAttribute("aria-label");
    b.querySelector(".waves").style.display = SAVE.muted ? "none" : "";
    b.querySelector(".cross").style.display = SAVE.muted ? "" : "none";
  }
  function toggleMute() {
    SAVE.muted = !SAVE.muted; save(); renderMute();
    if (SAVE.muted) stopBookClip();
    if (ambGain) { ambGain.gain.cancelScheduledValues(ac.currentTime); ambGain.gain.value = SAVE.muted ? 0 : AMB; }
    if (sfxBus) sfxBus.gain.value = SAVE.muted ? 0 : 0.6;
    if (SAVE.muted && playing) { playing.pause(); playing = null; clearTimeout(subTimer); subTimer = setTimeout(stopTalk, 1800); }
    if (SAVE.muted) stopLinger();
  }
  // Zurück aus dem Hintergrund (Handy): Ton wieder einschalten, sonst bleiben die Stimmen stumm
  document.addEventListener("visibilitychange", () => { if (!document.hidden && ac && started && ac.state !== "running") ac.resume().catch(() => {}); });
  $("mute").addEventListener("click", toggleMute);
  $("muteBtn").addEventListener("click", toggleMute);

  // Vollbild: echte Vollbild-Ansicht, wo es geht; auf dem iPhone füllt die Bühne einfach das Fenster
  function toggleFullscreen() {
    const fs = document.fullscreenElement || document.webkitFullscreenElement;
    if (fs) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    if (stage.classList.contains("pseudo-fs")) { stage.classList.remove("pseudo-fs"); return; }
    const req = stage.requestFullscreen || stage.webkitRequestFullscreen;
    const pseudo = () => stage.classList.add("pseudo-fs");
    if (!req) return pseudo();
    Promise.resolve(req.call(stage)).then(() => { if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape").catch(() => {}); }).catch(pseudo);
  }
  $("fsBtn").addEventListener("click", (e) => { e.stopPropagation(); toggleFullscreen(); });
  $("fullscreen").addEventListener("click", toggleFullscreen);

  // ---------- Kurze Posen ----------
  // Posen, die nur während einer Handlung gelten: nach dem Text (oder beim nächsten Klick) steht die Figur wieder normal
  const ITEM_POSE = { handy: "handy", kukri: "hacken" };
  const MG_POSE = { angeln: "angeln", karte: "karte", feuer: "knien", schwedenfeuer: "knien", kescher: "knien", loeffel: "hacken" };
  const ruhig = () => reduce || window.__testFast;
  const warte = (ms) => new Promise((r) => setTimeout(r, ruhig() ? 0 : ms));
  function tempPose(id, pose) {
    const h = S.chars[id]; if (!h || h.done) return;
    const vorher = h.pose;
    h.pose = pose; (S.temp = S.temp || []).push([id, pose]); place(id);
    if (pose === vorher || ruhig()) return;
    if (pose === "hacken") setTimeout(() => hackTakt(id), 240);
    else if (pose === "trinken") sfx("gluckern", 0.8);
    else if (pose === "karte") sfx("papier", 0.7);
  }
  function clearTemp() {
    if (!S || !S.temp) return;
    for (const [id, pose] of S.temp) { const h = S.chars[id]; if (h && h.pose === pose && !h.done) h.pose = null; }
    S.temp = []; placeAll();
  }
  const anwesend = () => Object.keys(S.chars).filter((id) => { const c = S.chars[id]; return c.room === hero().room && !c.away && !c.hiddenActor && !c.done; });
  // Jubeln nach einem geschafften Ziel (zu zweit jubeln beide)
  function jubel() {
    const ids = (D.together ? anwesend() : [active]).filter((id) => !S.chars[id].pose && !S.chars[id].target);
    for (const id of ids) S.chars[id].pose = "jubeln";
    placeAll();
    setTimeout(() => { if (!S) return; for (const id of ids) if (S.chars[id].pose === "jubeln") S.chars[id].pose = null; placeAll(); }, ruhig() ? 0 : 1500);
  }
  // Ein- und Ausblenden einer Figur (beim Kriechen ins und aus dem Tarp)
  async function blende(ids, von, bis, ms, jeSchritt) {
    if (ruhig()) return;
    const t0 = performance.now();
    await new Promise((res) => {
      const step = (now) => {
        const k = Math.min(1, (now - t0) / ms);
        for (const id of ids) { const a = $("actor-" + id); if (a) a.setAttribute("opacity", (von + (bis - von) * k).toFixed(2)); }
        if (jeSchritt) jeSchritt(k);
        k < 1 ? requestAnimationFrame(step) : res();
      };
      requestAnimationFrame(step);
    });
  }
  // Aufwachen: aus dem Tarp kriechen (kniend einblenden), strecken, aufstehen
  async function wakeUp(ids) {
    ids = ids.filter((id) => S.chars[id] && !S.chars[id].away);
    for (const id of ids) { const h = S.chars[id]; h.hiddenActor = false; h.lift = 0; h.pose = "knien"; const a = $("actor-" + id); if (a && !ruhig()) a.setAttribute("opacity", "0"); }
    S.sleepZ = []; renderFront(); placeAll();
    sfx("rascheln", 0.7);
    await blende(ids, 0, 1, 600);
    for (const id of ids) { const a = $("actor-" + id); if (a) a.removeAttribute("opacity"); }
    await warte(350);
    if (!S) return;
    for (const id of ids) if (S.chars[id].pose === "knien") S.chars[id].pose = "jubeln";
    placeAll();
    await warte(900);
    if (!S) return;
    for (const id of ids) if (S.chars[id].pose === "jubeln") S.chars[id].pose = null;
    placeAll();
  }
  // Dösen: kurz ins Tarp kriechen, Zzz, wieder raus
  async function nap() {
    const spot = lastSpot && Object.values(room().hot).includes(lastSpot) ? lastSpot : null, h = hero();
    if (!spot || !spot.tent) return;
    h.target = null; h.pose = "knien"; h.dir = spot.tent[0] >= h.x ? 1 : -1; placeAll();
    await warte(500);
    const x0 = h.x, y0 = h.y;
    sfx("rascheln", 0.8);
    await blende([active], 1, 0, 600, (k) => { h.x = x0 + (spot.tent[0] - x0) * k * 0.6; h.y = y0 + (spot.tent[1] - y0) * k * 0.6; place(active); });
    const a = $("actor-" + active);
    h.hiddenActor = true; h.pose = null; if (a) a.removeAttribute("opacity");
    S.sleepZ = [{ id: active, room: h.room, x: spot.tent[0], y: spot.tent[1] - 60, s: 1.5 * scaleAt(spot.tent[1], room()) }];
    placeAll(); renderFront();
    sfx("schnarchen", 0.7);
    await warte(2200);
    if (!S) return;
    h.x = x0; h.y = y0;
    await wakeUp([active]);
  }
  // Baden: ins Wasser gehen und bis zu den Schultern eintauchen, danach wieder heraus
  async function tween(id, to, ms) {
    const h = S.chars[id], from = {};
    for (const k in to) from[k] = h[k] || 0;
    if (ruhig()) { Object.assign(h, to); placeAll(); return; }
    const t0 = performance.now();
    await new Promise((res) => {
      const step = (now) => {
        const k = Math.min(1, (now - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        for (const p in to) h[p] = from[p] + (to[p] - from[p]) * e;
        placeAll();
        k < 1 ? requestAnimationFrame(step) : res();
      };
      requestAnimationFrame(step);
    });
  }
  async function bathIn(id, b) { const h = S.chars[id]; h.target = null; h.pose = null; h.dir = b[0] >= h.x ? 1 : -1; setTimeout(() => sfx("platsch"), 300); await tween(id, { x: b[0], y: b[1], sink: b[2] || 330 }, 900); }
  async function bathOut(id, st) { const h = S.chars[id]; h.dir = st[0] >= h.x ? 1 : -1; sfx("raus", 0.8); await tween(id, { x: st[0], y: st[1], sink: 0 }, 800); h.sink = 0; placeAll(); }

  // ---------- Klettern ----------
  // Figur klettert in drei Zügen nach (x, y), sichtbar um lift höher. Oben steht sie wieder.
  async function climb(id, x, y, lift, dir) {
    const h = S.chars[id], a0 = [h.x, h.y, h.lift || 0], b = [x, y, lift || 0], ZUEGE = 3;
    const r = h.resolve; h.target = null; h.resolve = null; if (r) r(false);
    h.dir = dir || (Math.abs(x - h.x) > 3 ? (x > h.x ? 1 : -1) : h.dir);
    const runter = b[1] - b[2] > a0[1] - a0[2];
    h.lift = a0[2]; h.pose = "klettern";
    for (let i = 1; i <= ZUEGE && !(reduce || window.__testFast); i++) {
      // Je Zug: kurz ducken, dann ein Stück hoch (runter geht's schneller)
      const von = [h.x, h.y, h.lift], nach = a0.map((v, j) => v + (b[j] - v) * i / ZUEGE), dauer = runter ? 260 : 380, t0 = performance.now();
      sfx("kratzen", runter ? 0.5 : 0.7);
      await new Promise((res) => {
        const step = (now) => {
          const k = Math.min(1, (now - t0) / dauer), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          [h.x, h.y, h.lift] = von.map((v, j) => v + (nach[j] - v) * e);
          h.bob = Math.sin(k * Math.PI) * (runter ? -6 : 10);
          placeAll();
          k < 1 ? requestAnimationFrame(step) : res();
        };
        requestAnimationFrame(step);
      });
      await new Promise((res) => setTimeout(res, runter ? 60 : 140));
    }
    [h.x, h.y, h.lift] = b; h.bob = 0; h.pose = null; placeAll();
  }

  // ---------- Schnittstelle für die Tagesdateien ----------
  const E = {
    get h() { return hero(); },
    get active() { return active; },
    get flags() { return S.flags; },
    get together() { return D.together; },
    get room() { return hero().room; },
    char: (id) => S.chars[id],
    other: () => S.chars[others()[0]],
    has, add, drop, swap,
    show: showEl, hide: hideEl, hot,
    goal, hasGoal, allGoals,
    egg(k) { if (addTo("eggs", k)) { const dayEggs = Object.keys(EGGS).filter((x) => EGGS[x].day === S.day); toast(`Easteregg: ${EGGS[k].label} (${dayEggs.filter((x) => SAVE.eggs.includes(x)).length}/${dayEggs.length})`, "egg"); } },
    learn(k) { if (addTo("journal", k)) toast(`Gelernt: ${JOURNAL[k].title}`, "learn"); },
    persist(k) { addTo("persist", k); },
    unpersist(k) { const i = SAVE.persist.indexOf(k); if (i >= 0) { SAVE.persist.splice(i, 1); save(); } },
    persisted: (k) => SAVE.persist.includes(k),
    time: spend,
    stat(k, v, who) { const h = who ? S.chars[who] : hero(); h[k] = clamp(h[k] + v); renderHud(); },
    hurt,
    encounter, minigame, video,
    lines: (l) => lines(l, token),
    say: (l) => say(l, token),
    wait: (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms)),
    walk: (x, y, who) => walkTo(x, y, who),
    face,
    async goRoom(to, x, y, dir) { await enterRoom({ to, spawn: [x, y], dir: dir || 1 }, null); },
    place(id, x, y, roomId, dir) { const h = S.chars[id]; h.x = x; h.y = y; h.pose = null; h.lift = 0; h.bob = 0; if (roomId) h.room = roomId; if (dir) h.dir = dir; h.target = null; showRoom(); },
    hideActor(id, on) { S.chars[id].hiddenActor = on; placeAll(); },
    // Hinsetzen: Hüfte auf (x, Sitzhöhe), Füße am Boden bei y. Aufstehen mit E.stand.
    sit(id, x, y, dir) { const h = S.chars[id], r = h.resolve; h.target = null; h.resolve = null; if (r) r(false); h.x = x; h.y = y; if (dir) h.dir = dir; h.pose = "sitzen"; h.lift = 0; h.bob = 0; placeAll(); },
    nap,
    // Kurze Haltung während eigener Texte (z. B. Handy hoch oben auf dem Felsen); null hebt sie auf
    pose(id, p) { if (p) tempPose(id, p); else clearTemp(); },
    stand(id) { const h = S.chars[id]; h.pose = null; h.lift = 0; h.bob = 0; placeAll(); },
    climb,
    // Eine Figur taucht auf (vorher "away": kein Bild, keine Wahl oben links)
    arrive(id) { S.chars[id].away = false; show(active); },
    // Nach der Nacht wieder aufwachen und weiterspielen (für das Finale am letzten Morgen)
    wake(clock) { for (const id in S.chars) { const h = S.chars[id]; h.done = false; h.lift = 0; if (clock) h.clock = clock; } wakeUp(Object.keys(S.chars)); S.inNight = false; S.tint = null; renderHud(); },
    // Ab jetzt zu zweit: gemeinsame Ziele, beide in derselben Szene, Partner läuft mit
    setTogether(on) { D.together = on; for (const id in S.chars) S.chars[id].clock = Math.max(...Object.values(S.chars).map((c) => c.clock)); renderGoals(); renderHud(); },
    fire(roomId) { if (!S.fires.has(roomId)) S.stats.feuer++; S.fires.add(roomId); updateAmbience(); },
    tint(v) { S.tint = v; renderHud(); },
    weather,
    sleep,
    switchTo,
    thunder, flash() { flash = 1; },
    renderHud, renderInv, renderGoals,
    unlockClip: (k) => addTo("clips", k)
  };

  function boot() {
    renderMute();
    renderMenu();
    requestAnimationFrame(tick);
  }
  // Nur für automatische Tests: ein Geräusch stumm rendern und Spitze/Lautheit messen
  async function sfxProbe(name) {
    const oc = new OfflineAudioContext(1, 44100 * 3, 44100), g = oc.createGain(); g.gain.value = 0.6; g.connect(oc.destination);
    sfx(name, 1, { ac: oc, ziel: g });
    const d = (await oc.startRendering()).getChannelData(0);
    let peak = 0, sum = 0; for (const v of d) { peak = Math.max(peak, Math.abs(v)); sum += v * v; }
    return { peak: +peak.toFixed(3), rms: +Math.sqrt(sum / d.length).toFixed(4) };
  }
  return { day, boot, sfxProbe, minigame: (name, fn) => { MINIGAMES[name] = fn; }, CHARS, E };
})();
