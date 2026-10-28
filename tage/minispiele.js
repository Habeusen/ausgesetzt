// Minispiele. Jedes bekommt api (body, foot, title, text, msg, button, done) und gibt über api.done(ergebnis) zurück.
(function () {
  const M = Ausgesetzt.minigame;

  // Leinwand in Bühnengröße, Koordinaten in 960 x 440
  function canvas(api) {
    const c = document.createElement("canvas");
    c.width = 960; c.height = 440;
    // Auf Touchscreens soll Ziehen die Pinzette bewegen, nicht die Seite scrollen
    c.style.touchAction = "none";
    api.body.appendChild(c);
    const ctx = c.getContext("2d");
    const pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * 960, ((e.clientY - r.top) / r.height) * 440]; };
    return { c, ctx, pos };
  }
  // Läuft, bis das Minispiel beendet ist oder zugeht (z. B. über "Menü"); onEnd räumt danach auf
  function loop(fn, onEnd) {
    let alive = true, last = performance.now();
    const mg = document.getElementById("mg");
    const step = (now) => { if (alive && mg.hidden) { alive = false; if (onEnd) onEnd(); } if (!alive) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; fn(dt); requestAnimationFrame(step); };
    requestAnimationFrame(step);
    return () => { alive = false; };
  }
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  // Leertaste als Aktionstaste. Ein fokussierter Knopf würde sonst beim Loslassen ein zweites Mal auslösen.
  const spaceKey = (fn) => (e) => {
    if (e.code !== "Space" || e.repeat) return;
    e.preventDefault(); e.stopPropagation();
    if (document.activeElement && document.activeElement.closest("#mg")) document.activeElement.blur();
    fn();
  };

  // ---------- Zecken-OP (Tag 7): 4 Uhr nachts, Stirnlampe, Pinzette, langsam ziehen ----------
  M("zecke", (api) => {
    api.title("Nacht-OP, 4 Uhr morgens");
    api.text("Doktor Jonas, Stirnlampe an. Finde die Zecke, greif sie mit der Pinzette (gedrückt halten) und zieh sie ganz langsam nach oben heraus.");
    const { c, ctx, pos } = canvas(api);
    const tick = { x: 380 + Math.random() * 260, y: 230 + Math.random() * 90 };
    let mouse = [480, 220], grabbed = false, found = false, pulled = 0, start = null, broken = false, done = false, comment = 0, commentText = "";
    const quips = ["H: Vorsichtig, Doktor!", "H: Aua! Das ist kein Grand Canyon, das ist mein Hintern!", "H: Hast du da überhaupt Licht?", "H: Ich will das nicht sehen. Mach einfach.", "H: Sag mir einfach, wenn's vorbei ist."];
    c.addEventListener("pointermove", (e) => {
      mouse = pos(e);
      if (grabbed && !done) {
        const dy = start[1] - mouse[1], dx = Math.abs(mouse[0] - start[0]);
        const speed = Math.hypot(e.movementX || 0, e.movementY || 0);
        // Mit dem Hufeisen von Tag 5 zittert die Hand weniger
        const limit = Ausgesetzt.E.persisted("hufeisen") ? 13 : 9;
        if (speed > limit || dx > 60) { broken = true; grabbed = false; api.msg("Zu ruckartig! Der Kopf ist fast abgerissen. Nochmal ganz ruhig ansetzen.", "#ff8a6a"); pulled = Math.max(0, pulled - 30); }
        else pulled = Math.max(pulled, dy);
        if (pulled >= 110) { done = true; grabbed = false; api.msg("Draußen! Mit Kopf. Jonas, du bist ein Held.", "#c4e6a6"); setTimeout(() => { stop(); api.done(true); }, 1600); }
      }
    });
    c.addEventListener("pointerdown", (e) => {
      const [x, y] = pos(e);
      mouse = [x, y]; // auf dem Touchscreen gibt es kein Bewegen ohne Berühren
      // Finger sind ungenauer als die Maus: größerer Greifradius
      if (Math.hypot(x - tick.x, y - (tick.y - pulled)) < (e.pointerType === "touch" ? 34 : 22) && !done) { found = true; grabbed = true; start = [x, y + pulled]; broken = false; api.msg("Gegriffen. Jetzt gaaanz langsam nach oben ziehen …", "#f0d97a"); }
      else if (!done) api.msg(found ? "Daneben. Die Pinzette muss genau auf die Zecke." : pick(["Hier ist nur Haut.", "Mehr nach links? Mehr nach rechts?", "Leuchte mal richtig hin."]));
    });
    c.addEventListener("pointerup", () => { if (grabbed && !done) { grabbed = false; api.msg("Losgelassen. Sie hängt noch. Neu greifen."); } });
    const stop = loop((dt) => {
      comment -= dt;
      if (comment <= 0) { comment = 4 + Math.random() * 3; commentText = pick(quips).slice(3); }
      ctx.fillStyle = "#05070a"; ctx.fillRect(0, 0, 960, 440);
      // Hautfläche, leicht gewölbt (abstrakt), Zittern der Hand um 4 Uhr
      const jitter = grabbed ? (Math.random() - 0.5) * 2.4 : 0;
      const g = ctx.createRadialGradient(480, 470, 60, 480, 470, 520);
      g.addColorStop(0, "#e9b9a0"); g.addColorStop(1, "#b77d66");
      ctx.save();
      ctx.beginPath(); ctx.arc(mouse[0], mouse[1], 120, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(480, 520, 560, 400, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(120,70,50,0.35)";
      for (let i = 0; i < 40; i++) { const x = (i * 97) % 900 + 30, y = 180 + ((i * 53) % 240); ctx.fillRect(x, y, 2, 2); }
      // Zecke
      const ty = tick.y - pulled;
      ctx.fillStyle = "#2a1a12"; ctx.beginPath(); ctx.ellipse(tick.x + jitter, ty, 9, 11, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#5a3020"; ctx.beginPath(); ctx.arc(tick.x + jitter, ty + 12, 4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#2a1a12"; ctx.lineWidth = 1.5;
      for (let k = -1; k <= 1; k += 2) for (let l = 0; l < 4; l++) { ctx.beginPath(); ctx.moveTo(tick.x + jitter + k * 6, ty - 4 + l * 3); ctx.lineTo(tick.x + jitter + k * 15, ty - 8 + l * 5); ctx.stroke(); }
      if (pulled > 0 && !done) { ctx.strokeStyle = "rgba(255,190,170,0.6)"; ctx.beginPath(); ctx.moveTo(tick.x, tick.y + 12); ctx.lineTo(tick.x + jitter, ty + 14); ctx.stroke(); }
      ctx.restore();
      // Lichtkegel-Rand
      const r = ctx.createRadialGradient(mouse[0], mouse[1], 90, mouse[0], mouse[1], 130);
      r.addColorStop(0, "rgba(255,240,200,0)"); r.addColorStop(1, "rgba(5,7,10,1)");
      ctx.fillStyle = r; ctx.beginPath(); ctx.arc(mouse[0], mouse[1], 130, 0, Math.PI * 2); ctx.fill();
      // Pinzette
      ctx.strokeStyle = "#cfd6dc"; ctx.lineWidth = 4; ctx.lineCap = "round";
      const px = mouse[0] + jitter, py = mouse[1];
      ctx.beginPath(); ctx.moveTo(px + 70, py - 90); ctx.lineTo(px + (grabbed ? 2 : 6), py); ctx.moveTo(px + 84, py - 82); ctx.lineTo(px + (grabbed ? 3 : 14), py + 4); ctx.stroke();
      // Zugmesser
      ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.fillRect(900, 60, 18, 300);
      ctx.fillStyle = broken ? "#e45b45" : "#8fc06a"; ctx.fillRect(900, 360 - (pulled / 110) * 300, 18, (pulled / 110) * 300);
      ctx.fillStyle = "#a9cdf0"; ctx.font = "bold 18px Alegreya Sans, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("Hannes: " + commentText, 24, 420);
    });
    api.button("Aufgeben (Hannes zieht selbst)", () => { stop(); api.done(false); });
  });

  // ---------- Schwedenfeuer (Tag 2): Viertel so drehen, dass die abgehackten Spitzen innen einen Luftkanal bilden ----------
  M("schwedenfeuer", (api) => {
    api.title("Schwedenfeuer");
    api.text("Klick auf ein Viertel, um es zu drehen. Die abgehackten Spitzen müssen nach innen zeigen, damit in der Mitte ein Luftkanal entsteht.");
    const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 960 440");
    api.body.appendChild(svg);
    const rot = [1, 2, 3, 2].map((r, i) => (r + i) % 4 || 1);
    const draw = () => {
      svg.innerHTML = `<rect width="960" height="440" fill="#1a140e"/><circle cx="480" cy="220" r="170" fill="#2a2016"/>`;
      for (let i = 0; i < 4; i++) {
        const g = document.createElementNS(ns, "g");
        const ang = i * 90 + rot[i] * 90;
        g.setAttribute("transform", `translate(${480 + [70, 70, -70, -70][i]} ${220 + [-70, 70, 70, -70][i]}) rotate(${ang})`);
        g.style.cursor = "pointer";
        // Viertel: Rinde außen (Bogen), abgehackte Spitze an einer Ecke (helle Schnittfläche)
        g.innerHTML = `<path d="M-60,-60 L60,-60 A120,120 0 0 1 -60,60 Z" transform="translate(-0 0)" fill="#8a6440" stroke="#3a2614" stroke-width="4"/>
          <path d="M-60,-60 L-28,-60 L-60,-28 Z" fill="#e6c79a" stroke="#3a2614" stroke-width="3"/>
          <path d="M-40,-40 L40,40" stroke="#6a4a2c" stroke-width="2" opacity="0.6"/>`;
        g.addEventListener("click", (e) => { e.stopPropagation(); rot[i] = (rot[i] + 1) % 4; draw(); check(); });
        svg.appendChild(g);
      }
      const ok = rot.every((r) => r === 0);
      if (ok) svg.insertAdjacentHTML("beforeend", `<circle cx="480" cy="220" r="26" fill="#ffb347" opacity="0.8"/><text x="480" y="420" fill="#c4e6a6" font-size="22" text-anchor="middle" font-family="Alegreya Sans">Luftkanal frei!</text>`);
    };
    const check = () => { if (rot.every((r) => r === 0)) { api.msg("Puzzlen, zack zack. Jetzt haben wir es: ein Kanal, wo Luft und Zeug nachgeschoben werden kann.", "#c4e6a6"); setTimeout(() => api.done(true), 1800); } };
    draw();
    api.button("Abbrechen", () => api.done(false));
  });

  // ---------- Kochen am Feuer: Zutaten rein, rühren (oder den Fisch wenden), nichts anbrennen lassen ----------
  // opts: title, text, zutaten (Namen), wenden (true: Fisch am Stock statt Topf)
  M("kochen", (api, opts) => {
    const wenden = !!opts.wenden, zutaten = (opts.zutaten || []).map((n) => ({ n, drin: false }));
    api.title(opts.title || (wenden ? "Fisch am Stock" : "Kochen am Feuer"));
    api.text(opts.text || (wenden ? "Der Barsch hängt über der Glut. Wende ihn rechtzeitig (Knopf oder Leertaste), sonst brennt eine Seite an." : "Gib alle Zutaten hinein und rühr immer wieder um (Knopf oder Leertaste), sonst brennt es am Boden an."));
    const { ctx } = canvas(api);
    let garen = 0, brand = 0, still = 0, ruehr = 0, seite = 0, done = false, flammen = 0, maxBrand = 0;
    const dauer = (wenden ? 10 : 9) + zutaten.length * 1.5;
    const aktion = () => { if (done) return; brand = Math.max(0, brand - (wenden ? 0.55 : 0.3)); still = 0; ruehr = 1; if (wenden) seite = 1 - seite; };
    api.button(wenden ? "Wenden" : "Umrühren", aktion);
    for (const z of zutaten) {
      const b = api.button(z.n, () => { if (z.drin || done) return; z.drin = true; b.disabled = true; b.style.opacity = "0.4"; ruehr = 1; });
    }
    const onKey = spaceKey(aktion);
    document.addEventListener("keydown", onKey);
    const ende = (ok, text, farbe) => { done = true; api.msg(text, farbe); setTimeout(() => { stop(); document.removeEventListener("keydown", onKey); api.done(ok); }, 1700); };
    const stop = loop((dt) => {
      flammen += dt;
      if (!done) {
        still += dt; ruehr = Math.max(0, ruehr - dt * 3);
        // Ohne Rühren/Wenden steigt die Hitze am Boden immer schneller
        if (still > (wenden ? 1.6 : 1.1)) brand = Math.min(1, brand + dt * (wenden ? 0.32 : 0.38));
        maxBrand = Math.max(maxBrand, brand);
        const alle = zutaten.every((z) => z.drin);
        garen = Math.min(alle ? 1 : 0.92, garen + dt / dauer);
        if (brand >= 1) ende(false, wenden ? "Schwarz auf einer Seite. Na ja, die andere geht noch." : "Angebrannt! Riecht nach Lagerfeuer. Essen kann man's trotzdem.", "#ff8a6a");
        else if (garen >= 1) ende(true, wenden ? "Knusprig von beiden Seiten. Perfekt." : "Fertig. Riecht richtig gut!", "#c4e6a6");
        else if (!alle && garen >= 0.92) api.msg("Da fehlt noch was. Alle Zutaten rein!", "#f0d97a");
      }
      // Zeichnen: Glut und Flammen, darüber Topf oder Fisch am Stock
      ctx.fillStyle = "#120e0b"; ctx.fillRect(0, 0, 960, 440);
      ctx.fillStyle = "#2a1c12"; ctx.beginPath(); ctx.ellipse(420, 380, 210, 40, 0, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 9; i++) {
        const x = 270 + i * 38, h = 60 + 40 * Math.sin(flammen * 6 + i * 1.7) + brand * 30;
        ctx.fillStyle = `rgba(255,${120 + i * 8},40,0.75)`; ctx.beginPath(); ctx.moveTo(x - 20, 380); ctx.quadraticCurveTo(x, 380 - h * 1.4, x + 20, 380); ctx.fill();
      }
      if (wenden) {
        ctx.strokeStyle = "#6b4a2c"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(140, 300); ctx.lineTo(700, 230); ctx.stroke();
        ctx.save(); ctx.translate(430, 262); ctx.rotate(-0.12); ctx.scale(1, seite ? -1 : 1);
        const roh = [150, 160, 150], gar = [196, 140, 70], schwarz = [40, 30, 25];
        const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k)), c = brand > 0.5 ? mix(gar, schwarz, (brand - 0.5) * 2) : mix(roh, gar, Math.min(1, garen + brand));
        ctx.fillStyle = `rgb(${c})`; ctx.beginPath(); ctx.ellipse(0, 0, 110, 36, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(100, 0); ctx.lineTo(160, -30); ctx.lineTo(160, 30); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(-80, -8, 6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = "#4b5258"; ctx.beginPath(); ctx.moveTo(300, 190); ctx.lineTo(540, 190); ctx.lineTo(520, 330); ctx.lineTo(320, 330); ctx.closePath(); ctx.fill();
        ctx.fillStyle = `rgb(${Math.round(110 - brand * 60)},${Math.round(90 - brand * 50)},${Math.round(60 - brand * 30)})`; ctx.beginPath(); ctx.ellipse(420, 196, 116, 20, 0, 0, Math.PI * 2); ctx.fill();
        zutaten.filter((z) => z.drin).forEach((z, i) => { ctx.fillStyle = ["#d62e26", "#f2c62c", "#5a9a3a", "#8a6a3a"][i % 4]; ctx.beginPath(); ctx.arc(360 + i * 38 + Math.sin(flammen * 3 + i) * 6, 196, 9, 0, Math.PI * 2); ctx.fill(); });
        ctx.strokeStyle = "#8a6440"; ctx.lineWidth = 9; ctx.beginPath(); const a = flammen * (ruehr > 0 ? 9 : 1); ctx.moveTo(420 + Math.cos(a) * 50, 200 + Math.sin(a) * 8); ctx.lineTo(560, 60); ctx.stroke();
        if (garen > 0.3) for (let i = 0; i < 4; i++) { const t = (flammen * 0.6 + i / 4) % 1; ctx.fillStyle = `rgba(230,230,230,${(0.35 * (1 - t)).toFixed(2)})`; ctx.beginPath(); ctx.arc(380 + i * 26 + Math.sin(t * 6 + i) * 10, 180 - t * 120, 10 + t * 14, 0, Math.PI * 2); ctx.fill(); }
      }
      // Anzeigen: gar (gelb), angebrannt (rot)
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(760, 60, 34, 300); ctx.fillRect(820, 60, 34, 300);
      ctx.fillStyle = "#e8b044"; ctx.fillRect(760, 360 - garen * 300, 34, garen * 300);
      ctx.fillStyle = brand > 0.7 ? "#ff5a3a" : "#c8603a"; ctx.fillRect(820, 360 - brand * 300, 34, brand * 300);
      ctx.fillStyle = "#ece6d6"; ctx.font = "15px Alegreya Sans, sans-serif"; ctx.fillText("gar", 764, 384); ctx.fillText("Hitze", 818, 384);
    }, () => document.removeEventListener("keydown", onKey));
  });

  // ---------- Knoten (Tag 2 und 7): Abspannknoten in drei Schritten ----------
  M("knoten", (api, opts) => {
    api.title(opts.title || "Abspannknoten");
    api.text(opts.text || "Wäscheleine spannen. Wähle jeden Schritt richtig, sonst rutscht das Seil.");
    const steps = [
      { q: "Schritt 1: Das Seil liegt schon um den Baum. Und jetzt?", a: ["Vom gespannten Ende mit der Hand zur festen Seite gehen und einmal herum", "Einfach ganz fest ziehen und einen doppelten Knoten machen", "Das lose Ende dreimal um den Baum wickeln"], ok: 0 },
      { q: "Schritt 2: Du hältst jetzt eine Schlaufe in der Hand.", a: ["Die Schlaufe loslassen, die hält schon", "Die nicht feste Seite greifen und durch die Schlaufe ziehen", "Die Schlaufe um den Baum legen"], ok: 1 },
      { q: "Schritt 3: Das Seil soll stramm bleiben und später leicht lösbar sein.", a: ["Mit Seilreibung zweimal herum und mit einem Slipknoten sichern", "Alles mit dem Messer abschneiden", "Mit einem Hängeknoten zuziehen"], ok: 0 }
    ];
    let i = 0, fails = 0;
    const box = document.createElement("div");
    box.style.cssText = "position:absolute;inset:0;display:grid;place-content:center;gap:10px;padding:16px;max-width:640px;margin:0 auto";
    api.body.appendChild(box);
    const show = () => {
      if (i >= steps.length) { api.msg(fails ? "Hält. Hat ein paar Versuche gebraucht, aber hält." : "Fertig ist die Wäscheleine. Richtig stramm.", "#c4e6a6"); setTimeout(() => api.done(fails), 1500); return; }
      const s = steps[i];
      box.innerHTML = `<p style="margin:0;font-weight:700;font-size:clamp(14px,1.8vw,19px)">${s.q}</p>`;
      s.a.forEach((t, k) => {
        const b = document.createElement("button");
        b.type = "button"; b.textContent = t;
        b.style.cssText = "font:inherit;font-weight:700;text-align:left;padding:9px 12px;border-radius:5px;border:1px solid var(--panel-line);background:rgba(255,255,255,0.05);color:var(--fg);cursor:pointer";
        b.addEventListener("click", (e) => { e.stopPropagation(); if (k === s.ok) { i++; api.msg(""); show(); } else { fails++; api.msg(pick(["Das Seil rutscht durch. Nochmal.", "Hält nicht. Die Wäsche läge im Dreck.", "Nee, so nicht."]), "#ff8a6a"); } });
        box.appendChild(b);
      });
    };
    show();
  });

  // ---------- Löffel brennen (Tag 2): Glut im richtigen Bereich halten ----------
  M("loeffel", (api) => {
    api.title("Löffel brennen");
    api.text("Kienspan-Glut liegt auf dem Holz. Pusten hält sie heiß. Bleib im grünen Bereich: zu wenig und sie geht aus, zu viel und das Holz reißt. Drei Runden.");
    const { ctx } = canvas(api);
    let heat = 0.5, round = 1, prog = 0, cracked = 0, done = false;
    const blow = () => { heat = Math.min(1.2, heat + 0.13); };
    api.button("Pusten", blow);
    const onKey = spaceKey(blow);
    document.addEventListener("keydown", onKey);
    const stop = loop((dt) => {
      if (done) return;
      heat -= dt * 0.22;
      const inZone = heat > 0.45 && heat < 0.85;
      if (inZone) prog += dt / 6;
      if (heat > 1) { cracked++; heat = 0.6; api.msg("Zu heiß! Ein feiner Riss im Holz.", "#ff8a6a"); }
      if (heat < 0.15) { heat = 0.5; prog = Math.max(0, prog - 0.15); api.msg("Glut aus. Neues Stück Kienspan drauf.", "#ff8a6a"); }
      if (prog >= 1) {
        if (round >= 3) { done = true; api.msg("Ausgeschabt, nachgeschnitzt … Ich bin so stolz auf meinen Löffel!", "#c4e6a6"); setTimeout(() => { stop(); document.removeEventListener("keydown", onKey); api.done(cracked < 4); }, 1800); }
        else { round++; prog = 0; api.msg(`Ausschaben. Runde ${round} von 3.`, "#f0d97a"); }
      }
      ctx.fillStyle = "#14100c"; ctx.fillRect(0, 0, 960, 440);
      ctx.fillStyle = "#b98a52"; ctx.beginPath(); ctx.ellipse(420, 230, 160, 110, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#3a2614"; ctx.beginPath(); ctx.ellipse(420, 230, 40 + (round - 1 + prog) * 28, 26 + (round - 1 + prog) * 20, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255,${Math.round(120 + heat * 80)},40,${Math.min(1, 0.3 + heat * 0.7)})`; ctx.beginPath(); ctx.arc(420, 230, 22 + heat * 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(760, 60, 40, 320);
      ctx.fillStyle = "rgba(143,192,106,0.45)"; ctx.fillRect(760, 380 - 0.85 * 320, 40, (0.85 - 0.45) * 320);
      ctx.fillStyle = "#ffb347"; ctx.fillRect(752, 380 - Math.min(1.2, heat) / 1.2 * 320 - 3, 56, 6);
      ctx.fillStyle = "#e8b044"; ctx.fillRect(140, 400, 600 * prog, 10);
      ctx.fillStyle = "#ece6d6"; ctx.font = "16px Alegreya Sans, sans-serif"; ctx.fillText(`Runde ${round}/3 · Leertaste oder Knopf zum Pusten`, 140, 392);
    }, () => document.removeEventListener("keydown", onKey));
  });

  // ---------- Heuschrecken fangen (Tag 2) ----------
  M("heuschrecken", (api, opts) => {
    const goal = opts.n || 10, time = opts.time || 25;
    api.title("Heuschrecken fangen");
    api.text(`Klick auf die Heuschrecken im Gras, bevor sie wegspringen. Ziel: ${goal}. Zeit: ${time} Sekunden.`);
    const { ctx, c, pos } = canvas(api);
    let hoppers = [], caught = 0, left = time, escaped = 0, over = false;
    const spawn = () => hoppers.push({ x: 80 + Math.random() * 800, y: 160 + Math.random() * 240, t: 0, life: 1.2 + Math.random() * 1.4, jump: 0 });
    c.addEventListener("pointerdown", (e) => {
      const [x, y] = pos(e);
      const hit = hoppers.find((h) => Math.hypot(h.x - x, h.y - y) < 28);
      if (hit) { hoppers.splice(hoppers.indexOf(hit), 1); caught++; api.msg(pick(["Zack!", "Hab dich!", "Proteinkollege!", "Rein in den Pott."]), "#c4e6a6"); }
      else if (Math.random() < 0.25 && caught > 0) { caught--; escaped++; api.msg(`Mir ist eine aus den Fingern gesprungen. Da waren's nur noch ${caught}.`, "#ff8a6a"); }
    });
    const stop = loop((dt) => {
      if (over) return;
      left -= dt;
      if (Math.random() < dt * 1.6 && hoppers.length < 5) spawn();
      for (const h of hoppers) { h.t += dt; if (h.t > h.life) { h.t = 0; h.jump = 1; h.x += (Math.random() - 0.5) * 300; h.y += (Math.random() - 0.5) * 120; h.x = Math.max(40, Math.min(920, h.x)); h.y = Math.max(140, Math.min(410, h.y)); } h.jump = Math.max(0, h.jump - dt * 4); }
      if (left <= 0 || caught >= goal) { over = true; stop(); api.msg(caught >= goal ? `${caught} Heuschrecken. Die kommen in den Pott.` : `${caught} von ${goal}. Gar nicht so einfach mit Kamera.`, caught >= goal ? "#c4e6a6" : "#f0d97a"); setTimeout(() => api.done(caught), 1600); }
      ctx.fillStyle = "#3d5a26"; ctx.fillRect(0, 0, 960, 440);
      ctx.strokeStyle = "#5d7f3a"; ctx.lineWidth = 2;
      for (let i = 0; i < 160; i++) { const x = (i * 61) % 960, y = 120 + ((i * 37) % 320); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 4, y - 18); ctx.stroke(); }
      for (const h of hoppers) {
        const lift = h.jump * 30;
        ctx.fillStyle = "#8aaa3a"; ctx.beginPath(); ctx.ellipse(h.x, h.y - lift, 16, 6, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#4e6a22"; ctx.beginPath(); ctx.moveTo(h.x - 4, h.y - lift + 3); ctx.lineTo(h.x - 14, h.y - lift + 12); ctx.moveTo(h.x + 4, h.y - lift + 3); ctx.lineTo(h.x + 16, h.y - lift + 10); ctx.stroke();
      }
      ctx.fillStyle = "#ece6d6"; ctx.font = "bold 18px Alegreya Sans, sans-serif"; ctx.fillText(`Gefangen: ${caught}/${goal}   Zeit: ${Math.max(0, Math.ceil(left))}`, 20, 30);
    });
  });

  // ---------- Gewitter (Tag 5): Sekunden zwischen Blitz und Donner zählen ----------
  M("gewitter", (api) => {
    api.title("Gewitter im Nacken");
    api.text("Achte auf den Blitz und zähle die Sekunden bis zum Donner. Drei Sekunden sind etwa ein Kilometer.");
    const { ctx } = canvas(api);
    const secs = 3 + Math.floor(Math.random() * 7);
    let t = 0, flashT = 1.2, thunderT = 1.2 + secs, asked = false, f = 0;
    const stop = loop((dt) => {
      t += dt;
      if (t > flashT && t < flashT + 0.15) f = 1;
      if (Math.abs(t - thunderT) < dt) Ausgesetzt.E.thunder();
      f = Math.max(0, f - dt * 3);
      ctx.fillStyle = "#1a2028"; ctx.fillRect(0, 0, 960, 440);
      ctx.fillStyle = "#2a3440"; ctx.beginPath(); ctx.moveTo(0, 300); ctx.quadraticCurveTo(480, 200, 960, 290); ctx.lineTo(960, 440); ctx.lineTo(0, 440); ctx.fill();
      if (f > 0) { ctx.fillStyle = `rgba(235,240,255,${f * 0.8})`; ctx.fillRect(0, 0, 960, 440); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(700, 0); ctx.lineTo(670, 80); ctx.lineTo(700, 90); ctx.lineTo(650, 210); ctx.stroke(); }
      if (t > flashT) { ctx.fillStyle = "#ece6d6"; ctx.font = "bold 26px Alegreya Sans, sans-serif"; ctx.fillText(t < thunderT ? "…" : "DONNER", 440, 120); }
      if (t > thunderT + 0.8 && !asked) {
        asked = true; stop();
        api.text("Wie weit ist das Gewitter weg?");
        const opts = [secs, Math.max(1, secs - 3), secs + 3].map((s) => Math.round((s / 3) * 10) / 10);
        const right = opts[0];
        opts.sort(() => Math.random() - 0.5).forEach((km) => api.button(`etwa ${km.toString().replace(".", ",")} km`, () => api.done(km === right ? (secs < 6 ? "nah" : "weit") : "falsch")));
      }
    });
  });

  // ---------- Kartennavigation (Tag 5, 6 und 7; Tag 6/7 bringen eigene Wegpunkte mit) ----------
  const KARTEN = {
    tag6: {
      deco: `<path d="M60,330 C140,250 260,260 330,320 C260,380 120,390 60,330 Z" fill="#9cc2dc" stroke="#5a8aa8"/><path d="M620,120 C720,90 860,130 880,200 C820,250 700,230 640,190 Z" fill="#9cc2dc" stroke="#5a8aa8"/>`,
      N: {
        start: { x: 170, y: 320, name: "Großer See", to: ["strasse"] },
        strasse: { x: 300, y: 220, name: "Kleine Straße", to: ["privat", "damm"] },
        privat: { x: 330, y: 90, name: "Abkürzung über den Hof", to: ["strasse"], dead: "Privatgrundstück. Ein Hund bellt. Zurück zur Straße." },
        damm: { x: 470, y: 260, name: "Schleuse? Nee, ein Damm", to: ["bach", "schotter"] },
        schotter: { x: 520, y: 380, name: "Schotterweg in der Sonne", to: ["damm"], dead: "Kein Schatten, und der Weg führt ins Nichts. Zurück zum Damm." },
        bach: { x: 600, y: 300, name: "Bachlauf, Rast", to: ["ziel"] },
        ziel: { x: 760, y: 220, name: "Brücke über den großen See", to: [] }
      }
    },
    tag7: {
      deco: `<path d="M720,300 C780,260 900,270 920,330 C880,390 760,380 720,300 Z" fill="#9cc2dc" stroke="#5a8aa8"/>`,
      N: {
        start: { x: 120, y: 330, name: "Steg vom Vortag", to: ["huegel"] },
        huegel: { x: 260, y: 220, name: "Hügel ohne Schatten", to: ["hof", "wiese"] },
        hof: { x: 330, y: 90, name: "Weg links zum Hof", to: ["huegel"], dead: "Sackgasse am Bauernhof. Zurück auf den Hügel." },
        wiese: { x: 430, y: 280, name: "Wiese mit Pilzen", to: ["wald", "strasse"] },
        strasse: { x: 520, y: 140, name: "Große Straße", to: ["wiese"], dead: "Zu viel Verkehr, kein Lagerplatz. Zurück zur Wiese." },
        wald: { x: 600, y: 300, name: "Kiefernwald am Wasser", to: ["ziel"] },
        ziel: { x: 760, y: 320, name: "Spot mit Feuerstelle und Steg", to: [] }
      }
    }
  };
  M("karte", (api, opts) => {
    api.title(opts.title || "Nur mit Stefans Landkarte");
    api.text(opts.text || "Wähle den nächsten Wegpunkt. Das Gelände hält sich nicht immer an die Karte.");
    const K = KARTEN[opts.map];
    const N = K ? K.N : {
      start: { x: 90, y: 330, name: "Seepferdchensee", to: ["huegel"] },
      huegel: { x: 230, y: 250, name: "Hügel mit Heidelbeeren", to: ["steinbruch", "sumpfweg"] },
      sumpfweg: { x: 300, y: 380, name: "Abkürzung durchs Moor", to: ["huegel"], dead: "Knietief im Moor. Zurück auf den Hügel." },
      steinbruch: { x: 400, y: 170, name: "Steinbruch", to: ["privat", "querfeldein"] },
      privat: { x: 540, y: 90, name: "Privatweg", to: ["steinbruch"], dead: "„Kommt hier nicht her.“ Ein Privatweg. Zurück zum Steinbruch." },
      querfeldein: { x: 530, y: 250, name: "Querfeldein, Wildpfad", to: ["see", "traktor"] },
      traktor: { x: 640, y: 330, name: "Eingezeichneter Traktorweg", to: ["querfeldein"], dead: "Hier soll ein Traktorweg sein. Ist keiner. Den gibt es anscheinend nicht mehr." },
      see: { x: 660, y: 200, name: "Sumpfiger See", to: ["fluss"] },
      fluss: { x: 760, y: 280, name: "Am Fluss entlang", to: ["spuren"] },
      spuren: { x: 830, y: 200, name: "Feste Fahrspuren", to: ["ziel"] },
      ziel: { x: 900, y: 120, name: "Schotterstraße zum großen See", to: [] }
    };
    const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 960 440");
    api.body.appendChild(svg);
    let at = "start", steps = 0, deadEnds = 0;
    const draw = () => {
      let s = `<rect width="960" height="440" fill="#e8dfc4"/>` + (K ? K.deco : `<path d="M40,360 C120,300 60,260 140,250 C200,240 160,330 90,380 Z" fill="#9cc2dc" stroke="#5a8aa8"/><path d="M600,150 q60,-30 100,20 q-30,50 -90,20 z" fill="#9cc2dc" stroke="#5a8aa8"/><path d="M700,240 C760,260 800,300 860,360" stroke="#5a8aa8" stroke-width="4" fill="none"/>`);
      s += `<text x="20" y="30" font-family="Spectral SC, serif" font-size="20" fill="#5a4a2a">Karte von Stefan · ${steps} Etappen</text>`;
      for (const [k, n] of Object.entries(N)) for (const t of n.to) s += `<line x1="${n.x}" y1="${n.y}" x2="${N[t].x}" y2="${N[t].y}" stroke="#8a7a5a" stroke-dasharray="6 6" stroke-width="2"/>`;
      for (const [k, n] of Object.entries(N)) {
        const reach = N[at].to.includes(k);
        s += `<g data-k="${k}" style="cursor:${reach ? "pointer" : "default"}"><circle cx="${n.x}" cy="${n.y}" r="${k === at ? 14 : 10}" fill="${k === at ? "#e8b044" : reach ? "#2f6fa8" : "#b5a77e"}" stroke="#3a2a14" stroke-width="2"/>
          <text x="${n.x}" y="${n.y - 18}" text-anchor="${n.x > 780 ? "end" : n.x < 160 ? "start" : "middle"}" font-family="Alegreya Sans, sans-serif" font-size="14" font-weight="700" fill="${reach ? "#1f2a3a" : "#7a6a4a"}">${n.name}</text></g>`;
      }
      svg.innerHTML = s;
      for (const g of svg.querySelectorAll("[data-k]")) g.addEventListener("click", (e) => { e.stopPropagation(); go(g.dataset.k); });
    };
    const go = (k) => {
      if (!N[at].to.includes(k)) return;
      steps++;
      if (N[k].dead) { deadEnds++; api.msg(N[k].dead, "#a04020"); at = k; draw(); setTimeout(() => { at = N[k].to[0]; draw(); }, 900); return; }
      at = k; api.msg(k === "ziel" ? (opts.ziel || "Schotterstraße! Der Traktorweg wird immer fester. Wir haben's.") : N[k].name, k === "ziel" ? "#2f6a2a" : "#3a2a14"); draw();
      if (k === "ziel") setTimeout(() => api.done({ steps, deadEnds }), 1600);
    };
    draw();
  });

  // ---------- Unterhosen-Kescher (Tag 6) ----------
  M("kescher", (api) => {
    api.title("Plan B: Unterhosen-Kescher");
    api.text("Die Fischis kommen nah ran. Halte den Kescher still unter einem Fisch und klick zum Hochziehen. Fünf Versuche.");
    const { ctx, c, pos } = canvas(api);
    let net = [480, 380], lastNet = [480, 380], tries = 5, caught = 0, over = false, splash = 0;
    const fish = Array.from({ length: 6 }, () => ({ x: Math.random() * 960, y: 160 + Math.random() * 220, vx: (Math.random() < 0.5 ? -1 : 1) * (30 + Math.random() * 40), scared: 0 }));
    c.addEventListener("pointermove", (e) => { net = pos(e); });
    c.addEventListener("pointerdown", (e) => {
      if (over) return;
      net = pos(e); lastNet = net.slice(); // Tippen ohne vorheriges Ziehen (Touchscreen)
      tries--; splash = 0.5;
      const hit = fish.find((f) => Math.hypot(f.x - net[0], f.y - net[1]) < 30 && f.scared <= 0);
      if (hit && Math.random() < 0.35) { caught++; fish.splice(fish.indexOf(hit), 1); api.msg("Ich hab einen! Einen winzigen, aber einen!", "#c4e6a6"); }
      else { for (const f of fish) if (Math.hypot(f.x - net[0], f.y - net[1]) < 160) { f.scared = 1.5; f.vx = (f.x > net[0] ? 1 : -1) * 160; } api.msg(pick(["Weg sind sie. Die haben Angst vor dem schwarzen Monster.", "Daneben. Die sind nicht doof.", "Zu langsam."]), "#ff8a6a"); }
      if (tries <= 0 || caught > 0) { over = true; setTimeout(() => { stop(); api.done(caught); }, 1500); }
    });
    const stop = loop((dt) => {
      const speed = Math.hypot(net[0] - lastNet[0], net[1] - lastNet[1]) / Math.max(dt, 0.001); lastNet = net.slice();
      for (const f of fish) {
        if (speed > 500 && Math.hypot(f.x - net[0], f.y - net[1]) < 140) { f.scared = 1; f.vx = (f.x > net[0] ? 1 : -1) * 140; }
        f.scared -= dt; if (f.scared <= 0) f.vx = Math.sign(f.vx || 1) * 40;
        f.x += f.vx * dt; if (f.x < -30) f.x = 990; if (f.x > 990) f.x = -30;
      }
      splash = Math.max(0, splash - dt);
      ctx.fillStyle = "#2c4a50"; ctx.fillRect(0, 0, 960, 440);
      ctx.fillStyle = "rgba(255,255,255,0.05)"; for (let i = 0; i < 20; i++) ctx.fillRect((i * 73 + performance.now() / 40) % 960, (i * 41) % 440, 60, 2);
      for (const f of fish) { ctx.fillStyle = "#9ab07a"; ctx.beginPath(); ctx.ellipse(f.x, f.y, 14, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(f.x - Math.sign(f.vx) * 14, f.y); ctx.lineTo(f.x - Math.sign(f.vx) * 24, f.y - 6); ctx.lineTo(f.x - Math.sign(f.vx) * 24, f.y + 6); ctx.fill(); }
      ctx.strokeStyle = "#1a1a1a"; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(net[0], net[1], 34, 16, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(20,20,20,0.5)"; ctx.beginPath(); ctx.ellipse(net[0], net[1] + 10, 30, 18, 0, 0, Math.PI); ctx.fill();
      if (splash > 0) { ctx.strokeStyle = `rgba(255,255,255,${splash})`; ctx.beginPath(); ctx.arc(net[0], net[1], 60 * (1 - splash), 0, Math.PI * 2); ctx.stroke(); }
      ctx.fillStyle = "#ece6d6"; ctx.font = "bold 18px Alegreya Sans, sans-serif"; ctx.fillText(`Versuche: ${tries}`, 20, 30);
    });
  });

  // ---------- Himbeeren sortieren (Tag 7) ----------
  M("himbeeren", (api) => {
    api.title("Himbeeren für Hannes");
    api.text("Pflücke die guten Himbeeren. Fahr mit der Maus drüber (am Handy: einmal antippen zum Ansehen, nochmal zum Pflücken): In manchen sitzt eine kleine Made.");
    const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 960 440");
    api.body.appendChild(svg);
    const berries = Array.from({ length: 12 }, (_, i) => ({ x: 140 + (i % 6) * 135, y: 150 + Math.floor(i / 6) * 160 + (i % 2) * 20, made: Math.random() < 0.3, picked: false }));
    let good = 0, maden = 0;
    svg.innerHTML = `<rect width="960" height="440" fill="#2f4a26"/>`;
    for (const b of berries) {
      const g = document.createElementNS(ns, "g");
      g.style.cursor = "pointer";
      g.innerHTML = `<circle cx="${b.x}" cy="${b.y}" r="30" fill="#c8243a" stroke="#6a0e1a" stroke-width="2"/>${Array.from({ length: 9 }, (_, k) => `<circle cx="${b.x - 14 + (k % 3) * 14}" cy="${b.y - 14 + Math.floor(k / 3) * 14}" r="7" fill="#e0324a" opacity="0.8"/>`).join("")}<g class="m" opacity="0"><path d="M${b.x - 6},${b.y + 4} q6,-8 12,0" stroke="#f4f0d8" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
      g.addEventListener("pointerenter", () => { if (b.made) g.querySelector(".m").setAttribute("opacity", 1); });
      g.addEventListener("pointerleave", () => { g.querySelector(".m").setAttribute("opacity", 0); });
      // Touch: erstes Antippen zeigt die Beere von nahem, zweites pflückt
      g.addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") b.touchSeen = !!b.seen; b.seen = true; if (b.made) g.querySelector(".m").setAttribute("opacity", 1); });
      g.addEventListener("click", (e) => {
        e.stopPropagation();
        if (b.picked || b.touchSeen === false) { b.touchSeen = true; return; }
        b.picked = true; g.setAttribute("opacity", 0.15);
        if (b.made) { maden++; api.msg("Mit Made. Die esse ich selbst. Extra Proteine.", "#f0d97a"); } else { good++; api.msg(`${good} gute Himbeeren für Hannes.`, "#c4e6a6"); }
      });
      svg.appendChild(g);
    }
    api.button("Fertig gepflückt", () => api.done({ good, maden }));
  });

  // ---------- Feuer machen (alle Tage): Funken im richtigen Moment, dann im Atemrhythmus anpusten ----------
  // Ergebnis: true = zügig geschafft, false = hat gedauert (das Feuer brennt am Ende trotzdem)
  M("feuer", (api, opts) => {
    api.title(opts.title || "Feuer machen");
    api.text("Erst Funken schlagen: tippen, wenn der Strich im hellen Feld ist. Dann anpusten: tippen, wenn der Kreis am größten ist. Nicht hektisch werden.");
    const { ctx, c } = canvas(api);
    const wet = opts.wet ? 0.6 : 1;
    let phase = "funken", hits = 0, marker = 0, dir = 1, heat = 0, t = 0, lastBlow = -9, sparks = [], flame = 0, over = false, msgT = 0;
    const zone = [0.58, 0.78];
    const act = () => {
      if (over) return;
      if (phase === "funken") {
        const ok = marker > zone[0] && marker < zone[1];
        for (let i = 0; i < (ok ? 14 : 5); i++) sparks.push({ x: 380, y: 300, vx: 40 + Math.random() * 160, vy: -60 - Math.random() * 120, life: 0.6 + Math.random() * 0.5, hit: ok });
        if (ok) { hits++; api.msg(hits >= 2 ? "Der Zunder glimmt! Jetzt vorsichtig anpusten." : "Treffer. Noch einmal.", "#f0d97a"); if (hits >= 2) { phase = "pusten"; heat = 0.18; t = 0; } }
        else api.msg(pick(["Funken daneben.", "Zu früh, zu spät … nochmal.", "Die Funken landen im Moos."]), "#ff8a6a");
        return;
      }
      const breath = (Math.sin(t * Math.PI * 2 / 1.8) + 1) / 2;
      if (t - lastBlow < 0.5) { heat = Math.max(0.05, heat - 0.12); api.msg("Zu hektisch! Die Glut verweht.", "#ff8a6a"); }
      else if (breath > 0.75) { heat += 0.16 * wet; api.msg(pick(["Gut so …", "Es wird heller.", "Weiter, ganz ruhig."]), "#f0d97a"); }
      else { heat += 0.04 * wet; api.msg("Zu schwach. Warte, bis der Kreis groß ist.", "#e6d3a6"); }
      lastBlow = t;
      if (heat >= 1) { over = true; flame = 0.01; api.msg("Es brennt!", "#c4e6a6"); setTimeout(() => { stop(); api.done(t < 18); }, 1500); }
    };
    c.addEventListener("pointerdown", act);
    api.button(opts.button || "Funken / Pusten", act);
    const onKey = spaceKey(act);
    document.addEventListener("keydown", onKey);
    const stop = loop((dt) => {
      t += dt;
      if (phase === "funken" && !over) { marker += dir * dt * 0.9; if (marker > 1) { marker = 1; dir = -1; } if (marker < 0) { marker = 0; dir = 1; } }
      if (phase === "pusten" && !over) { heat = Math.max(0.05, heat - dt * 0.035); if (t > 30) { over = true; flame = 0.01; api.msg("Hat gedauert, aber es brennt.", "#e6d3a6"); setTimeout(() => { stop(); api.done(false); }, 1500); } }
      if (flame > 0) flame = Math.min(1, flame + dt * 1.2);
      ctx.fillStyle = "#0f0c0a"; ctx.fillRect(0, 0, 960, 440);
      // Boden und Zundernest
      ctx.fillStyle = "#2a2018"; ctx.beginPath(); ctx.ellipse(480, 360, 300, 60, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#8a6a44"; ctx.lineWidth = 6;
      for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(400 + i * 26, 360); ctx.lineTo(470 + i * 6, 300 - (i % 3) * 8); ctx.stroke(); }
      ctx.fillStyle = "#c9b48a"; ctx.beginPath(); ctx.ellipse(480, 330, 48, 18, 0, 0, Math.PI * 2); ctx.fill();
      // Glut
      const g = phase === "pusten" ? heat : 0;
      if (g > 0) {
        const r = ctx.createRadialGradient(480, 328, 2, 480, 328, 40 + g * 80);
        r.addColorStop(0, `rgba(255,${200 + g * 50},120,${0.5 + g * 0.5})`); r.addColorStop(0.4, `rgba(255,110,30,${0.35 + g * 0.4})`); r.addColorStop(1, "rgba(255,80,20,0)");
        ctx.fillStyle = r; ctx.beginPath(); ctx.arc(480, 328, 40 + g * 80, 0, Math.PI * 2); ctx.fill();
      }
      // Flammen am Ende
      if (flame > 0) for (let i = 0; i < 5; i++) {
        const h = (60 + i * 18) * flame * (0.85 + Math.sin(t * 9 + i) * 0.15), x = 440 + i * 20;
        ctx.fillStyle = ["#c42a0c", "#f2621a", "#ffa12a", "#ffe68a", "#f2621a"][i];
        ctx.beginPath(); ctx.moveTo(x - 18, 330); ctx.quadraticCurveTo(x - 10, 330 - h * 0.6, x, 330 - h); ctx.quadraticCurveTo(x + 10, 330 - h * 0.6, x + 18, 330); ctx.fill();
      }
      // Funken
      for (const s of sparks) { s.life -= dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 300 * dt; }
      sparks = sparks.filter((s) => s.life > 0);
      for (const s of sparks) { ctx.fillStyle = s.hit ? "#ffd27a" : "#ff9a4a"; ctx.fillRect(s.x, s.y, 3, 3); }
      // Feuerstahl
      if (phase === "funken") {
        ctx.save(); ctx.translate(360, 290); ctx.rotate(-0.5);
        ctx.fillStyle = "#555b61"; ctx.fillRect(-90, -6, 120, 12); ctx.fillStyle = "#2a2d30"; ctx.fillRect(-130, -10, 44, 20); ctx.restore();
        // Zeitleiste
        ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(180, 60, 600, 18);
        ctx.fillStyle = "rgba(255,210,122,0.45)"; ctx.fillRect(180 + zone[0] * 600, 60, (zone[1] - zone[0]) * 600, 18);
        ctx.fillStyle = "#fff"; ctx.fillRect(180 + marker * 600 - 2, 52, 4, 34);
        ctx.fillStyle = "#ece6d6"; ctx.font = "bold 18px Alegreya Sans, sans-serif"; ctx.textAlign = "left"; ctx.fillText(`Funken: ${hits}/2`, 180, 110);
      } else if (!over) {
        // Atemkreis
        const breath = (Math.sin(t * Math.PI * 2 / 1.8) + 1) / 2;
        ctx.strokeStyle = breath > 0.75 ? "#c4e6a6" : "rgba(236,230,214,0.6)"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(780, 160, 20 + breath * 50, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(180, 60, 400, 14);
        ctx.fillStyle = "#ffb347"; ctx.fillRect(180, 60, 400 * Math.min(1, heat), 14);
        ctx.fillStyle = "#ece6d6"; ctx.font = "bold 18px Alegreya Sans, sans-serif"; ctx.textAlign = "left"; ctx.fillText("Glut", 180, 100); ctx.fillText("Pusten, wenn der Kreis groß ist", 660, 245);
      }
      msgT += dt;
    }, () => document.removeEventListener("keydown", onKey));
  });

  // ---------- Angeln (Tag 1, 2, 3, 6, 7): Pose beobachten, beim echten Biss anschlagen ----------
  // opts.noBite: an diesem Tag beißt keiner, nur Zupfer. Ergebnis: true = Fisch, false = nichts
  M("angeln", (api, opts) => {
    api.title(opts.title || "Angeln");
    api.text("Beobachte die Pose. Zupft es nur kurz, ist es ein Knabbern. Erst wenn sie richtig abtaucht, anschlagen: tippen oder Leertaste.");
    const { ctx, c } = canvas(api);
    let t = 0, state = "ruhe", stateT = 0, next = 2 + Math.random() * 3, bites = 0, over = false, rings = [];
    const dip = () => (state === "zupf" ? Math.sin(stateT * 20) * 6 : state === "biss" ? Math.min(1, stateT * 6) * 34 : 0);
    const end = (ok, text, color) => { over = true; api.msg(text, color); setTimeout(() => { stop(); api.done(ok); }, 1500); };
    const strike = () => {
      if (over) return;
      if (state === "biss") return end(true, opts.win || "Anschlagen … Fisch! Fisch, Fisch und Fisch!", "#c4e6a6");
      if (opts.noBite) { api.msg(pick(["Nichts dran.", "Nur Wind.", "Geduld …"]), "#e6d3a6"); return; }
      end(false, state === "zupf" ? "Zu früh! Der Köder ist weg." : "Ins Leere gezogen. Der Köder ist weg.", "#ff8a6a");
    };
    c.addEventListener("pointerdown", strike);
    api.button("Anschlagen", strike);
    const onKey = spaceKey(strike);
    document.addEventListener("keydown", onKey);
    const stop = loop((dt) => {
      t += dt; stateT += dt;
      if (!over) {
        if (state === "ruhe" && stateT > next) {
          const bite = !opts.noBite && (Math.random() < 0.35 || t > 14);
          state = bite ? "biss" : "zupf"; stateT = 0;
          rings.push({ r: 4, a: bite ? 0.9 : 0.5 });
        } else if (state === "zupf" && stateT > 0.35) { state = "ruhe"; stateT = 0; next = 1.2 + Math.random() * 2.5; }
        else if (state === "biss" && stateT > 0.75) {
          bites++; state = "ruhe"; stateT = 0; next = 2 + Math.random() * 3;
          if (bites >= 2) end(false, "Zu lange gewartet. Der Fisch hat den Köder geklaut.", "#ff8a6a");
          else api.msg("Weg ist er! Der kommt vielleicht nochmal …", "#ff8a6a");
        }
        if (opts.noBite && t > (opts.time || 12)) end(false, opts.lose || "Nichts. Heute beißt keiner.", "#e6d3a6");
      }
      ctx.fillStyle = "#24424c"; ctx.fillRect(0, 0, 960, 440);
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      for (let i = 0; i < 24; i++) ctx.fillRect((i * 83 + t * 18) % 960, (i * 47) % 440, 70, 2);
      const y = 230 + Math.sin(t * 1.6) * 3 + dip();
      for (const r of rings) { r.r += dt * 60; r.a -= dt * 0.6; }
      rings = rings.filter((r) => r.a > 0);
      for (const r of rings) { ctx.strokeStyle = `rgba(255,255,255,${r.a})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(480, 236, r.r, r.r * 0.35, 0, 0, Math.PI * 2); ctx.stroke(); }
      // Schnur und Pose
      ctx.strokeStyle = "rgba(230,230,220,0.6)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(960, 0); ctx.quadraticCurveTo(700, 120, 480, y - 22); ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 960, 236); ctx.clip();
      ctx.fillStyle = "#d8322a"; ctx.beginPath(); ctx.ellipse(480, y, 10, 16, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f4f0e2"; ctx.beginPath(); ctx.ellipse(480, y - 6, 10, 10, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = "#222"; ctx.fillRect(479, y - 26, 2, 10);
      ctx.restore();
      ctx.fillStyle = "rgba(36,66,76,0.55)"; ctx.fillRect(0, 236, 960, 204);
    }, () => document.removeEventListener("keydown", onKey));
  });

  // ---------- Mücken (Tag 3): Jonas in der Hängematte, die Mücken kommen trotzdem ----------
  M("muecken", (api) => {
    api.title("Mücken in der Hängematte");
    api.text("Klatsch die Mücken weg, bevor sie stechen. 20 Sekunden.");
    const { ctx, c, pos } = canvas(api);
    let t = 0, left = 20, killed = 0, stiche = 0, over = false, mozz = [], claps = [];
    const spawn = () => { const a = Math.random() * Math.PI * 2; mozz.push({ x: 480 + Math.cos(a) * 520, y: 220 + Math.sin(a) * 300, ph: Math.random() * 6, sit: 0 }); };
    c.addEventListener("pointerdown", (e) => {
      if (over) return;
      const [x, y] = pos(e);
      claps.push({ x, y, a: 1 });
      const hit = mozz.find((m) => Math.hypot(m.x - x, m.y - y) < (e.pointerType === "touch" ? 46 : 34));
      if (hit) { mozz.splice(mozz.indexOf(hit), 1); killed++; api.msg(pick(["Klatsch!", "Erwischt.", "Eine weniger.", "Abgefuckte Jagdtiere."]), "#c4e6a6"); }
      else api.msg("Daneben.", "#e6d3a6");
    });
    const stop = loop((dt) => {
      t += dt;
      if (!over) {
        left -= dt;
        if (Math.random() < dt * (1.2 + t * 0.08) && mozz.length < 9) spawn();
        for (const m of mozz) {
          const dx = 480 - m.x, dy = 220 - m.y, d = Math.hypot(dx, dy);
          if (d > 60) { m.x += (dx / d) * 70 * dt + Math.sin(t * 7 + m.ph) * 60 * dt; m.y += (dy / d) * 70 * dt + Math.cos(t * 6 + m.ph) * 60 * dt; }
          else { m.sit += dt; if (m.sit > 1.4) { stiche++; m.sit = -2; m.x += 200 * Math.sign(Math.random() - 0.5); api.msg("Gestochen. Juckt.", "#ff8a6a"); } }
        }
        if (left <= 0) { over = true; api.msg(`${killed} erwischt, ${stiche}× gestochen.`, stiche < 3 ? "#c4e6a6" : "#f0d97a"); setTimeout(() => { stop(); api.done({ killed, stiche }); }, 1600); }
      }
      // Hängematte von oben, Jonas' Gesicht unter der Mütze
      ctx.fillStyle = "#1c2418"; ctx.fillRect(0, 0, 960, 440);
      ctx.fillStyle = "#3e4a2a"; ctx.beginPath(); ctx.ellipse(480, 240, 420, 150, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#e0b096"; ctx.beginPath(); ctx.ellipse(480, 220, 52, 64, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#1a1a1a"; ctx.beginPath(); ctx.ellipse(480, 176, 58, 32, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = "#6a4a30"; ctx.beginPath(); ctx.ellipse(480, 262, 40, 22, 0, 0, Math.PI); ctx.fill();
      ctx.fillStyle = "#222"; ctx.fillRect(458, 214, 12, 4); ctx.fillRect(490, 214, 12, 4);
      for (const m of mozz) {
        ctx.fillStyle = "#111"; ctx.beginPath(); ctx.ellipse(m.x, m.y, 5, 3, 0.4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(220,220,220,0.5)"; ctx.lineWidth = 1; const w = Math.sin(t * 60 + m.ph) * 5;
        ctx.beginPath(); ctx.moveTo(m.x - 1, m.y); ctx.lineTo(m.x - 6, m.y - 4 - w); ctx.moveTo(m.x + 1, m.y); ctx.lineTo(m.x + 6, m.y - 4 + w); ctx.stroke();
      }
      for (const cl of claps) { cl.a -= dt * 3; ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, cl.a)})`; ctx.beginPath(); ctx.arc(cl.x, cl.y, 30 * (1.3 - cl.a), 0, Math.PI * 2); ctx.stroke(); }
      claps = claps.filter((cl) => cl.a > 0);
      ctx.fillStyle = "#ece6d6"; ctx.font = "bold 18px Alegreya Sans, sans-serif"; ctx.textAlign = "left"; ctx.fillText(`Erwischt: ${killed}   Stiche: ${stiche}   Zeit: ${Math.max(0, Math.ceil(left))}`, 20, 30);
    });
  });
})();
