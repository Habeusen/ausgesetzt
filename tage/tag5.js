// Tag 5 (Folge 6): Mittwoch. Querfeldein mit Stefans Landkarte: Steinbruch, Sumpfsee, Baumstamm, Hufeisen, Gewitter.
(function () {
  const c = (file, text, who, folge, t) => ({ file, text, who, folge, t });
  const R3 = window.TAG3.rooms;
  const ext = (room, hot, extra) => Object.assign({}, room, extra || {}, { hot: Object.assign({}, room.hot, hot || {}) });

  const def = {
    title: "Querfeldein", weekday: "Mittwoch", folge: "6", clock: 6 * 60, fourth: "stamina", together: true, first: "hannes",
    intro: "Heute geht es los: nur mit Stefans Landkarte vom Seepferdchensee Richtung Stefan. Fünf Kilometer, die unwegsamsten der Woche. Es wird heiß, die Bremsen sind wach, und am Nachmittag zieht etwas auf.",
    outro: "Ein großer See, eine Hängematte mit Veranda und ein Feuer, das endlich niemand bewachen muss.",
    weather: (t) => (t < 8 * 60 ? "grau" : t < 15.5 * 60 ? "hitze" : t < 17.5 * 60 ? "gewitter" : t < 21 * 60 ? "grau" : "nacht"),
    staminaFactor: (E, id) => (E.char(id).flags.torso ? 0.6 : 1),
    chars: {
      hannes: { room: "treffpunkt", start: [1500, 790], dir: -1, stats: { thirst: 55, hunger: 50, fourth: 80 },
        inv: ["messer", "feuerstahl", "filterflasche", "angelset", "schlafsack", "handy", "karte", "tarp", "paracord"] },
      jonas: { room: "treffpunkt", start: [1250, 860], stats: { thirst: 55, hunger: 50, fourth: 80 },
        inv: ["kukri", "feuerstahl", "metallflasche", "powercord", "schlafsack", "handy", "plane", "pullover", "loeffel", "herzschale"] }
    },
    goals: { team: [["packen", "Lager abbauen"], ["karte", "Den Weg finden"], ["stamm", "Baumstamm überqueren"], ["wasser", "Wasser filtern"], ["schutz", "Schutz vor dem Gewitter"], ["feuer", "Feuer am großen See"]] },
    items: {
      treibholz: { name: "Trockenes Holz", desc: "Tote, trockene Äste. Endlich mal trocken." }
    },
    // Abend am Feuer am großen See
    campfire: {
      team: [{ label: "Wie war der Tag?", lines: ["lf-5h-tag"] }, { label: "Wie weit ist es noch?", lines: ["lf-5j-km"] }, { label: "Das Hufeisen", need: (E) => E.flags.hufeisen, lines: ["J: Mütze weg geglaubt, Hufeisen gefunden. Wenn das mal nicht Glück bringt.", "H: Das nehmen wir mit bis zu Stefan."] }]
    },
    clips: {
      "lf-5h-tag": c("ton/lf-5h-tag.wav", "Ja, war ein geiler Tag heute. Wir haben echt viel erlebt. … Gut, dass wir diese Entscheidung getroffen haben, zu gehen. Wir sind heute gefühlt durch alles gelaufen, was es hier gibt.", "hannes", 6, 2345),
      "lf-5j-km": c("ton/lf-5j-km.wav", "Ich glaube, wir müssen morgen ungefähr 7,5 Kilometer. Das werden wir schaffen. Wie heute, wie die letzten Tage. Und Hannes, wie k.o. bist du von unserem Marsch heute? – Geht eigentlich. Ich glaube, der Mittagsschlaf vorhin hat mich gekillt. Aber eigentlich geht's wieder. Der Marsch war einfach richtig geil.", "jonas", 6, 2375),
      "f6-elch": c("ton/f6-elch.wav", "Hast du das Gebell gehört? Was ist es? Wolf? – Elch.", "jonas", 6, 142),
      "f6-broetchen": c("ton/f6-broetchen.wav", "Jonas, ich hab Brötchen mitgebracht. Guten Morgen. Hast du den Tisch schon gedeckt?", "hannes", 6, 349),
      "f6-gaming": c("ton/f6-gaming.wav", "Das ist wie so eine japanische Gaming-Show hier, ne?", "jonas", 6, 875),
      "f6-lightly": c("ton/f6-lightly.wav", "Laut Karte, laut Gefühl: lightly left.", "hannes", 6, 1325),
      "f6-revier": c("ton/f6-revier.wav", "Weißt du, was ich gemacht hab? Als ich ein bisschen Wildpanik hatte, hab ich um mein Zelt herum gepinkelt. – Alter. – Seht ihr, ich bin nicht der Einzige.", "jonas", 6, 1431),
      "f6-hufeisen": c("ton/f6-hufeisen.wav", "… warum ich Glück gehabt habe. Schaut mal, was ich gefunden habe. Wenn das mal nicht Glück bringt.", "jonas", 6, 1477),
      "f6-hobbit": c("ton/f6-hobbit.wav", "Ich fühle mich gerade ein bisschen wie beim Hobbit. Wo die im Düsterwald den Elbenpfad nicht verlieren dürfen.", "jonas", 6, 1823),
      "f6-gewitter": c("ton/f6-gewitter.wav", "Und der Horror geht weiter. Hinter uns ist eine fette schwarze Wolke, und es hat gerade heftig gedonnert.", "jonas", 6, 1851),
      "f6-roomtour": c("ton/f6-roomtour.wav", "Hi, ich bin Jonas. Ich zeige euch heute, wie ich wohne. Fangen wir hier an: Hier ist meine Vorratskammer und ein Kleiderschrank.", "jonas", 6, 2238)
    },
    narr: {
      t5: { file: "ton/erzaehler/damien-black/erzaehler-501.wav", text: "Tag fünf. Die Sonne ist zurück, und mit ihr die Bremsen. Vor ihnen liegen fünf Kilometer, die keine Straße kennen." },
      t5g: { file: "ton/erzaehler/damien-black/erzaehler-502.wav", text: "Hinter ihnen türmt sich der Himmel auf. Wer jetzt kein Dach hat, wird es bereuen." },
      t5e: { file: "ton/erzaehler/damien-black/erzaehler-503.wav", text: "Ein großer See, eine Hängematte mit Veranda und ein Feuer, das endlich niemand bewachen muss." }
    },
    journal: {
      karte: { title: "Navigieren ohne GPS", text: "Die Karte ist nicht immer aktuell: Wege verschwinden, Privatwege tauchen auf. Dann an Gewässern orientieren, dem Fluss folgen und auf Fahrspuren und Wegmarkierungen achten." },
      gewitter: { title: "Blitz und Donner", text: "Sekunden zwischen Blitz und Donner zählen und durch drei teilen: So viele Kilometer ist das Gewitter entfernt. Unter zehn Sekunden: sofort Schutz suchen." },
      tragen: { title: "Drybag tragen", text: "Ein Drybag ist kein Wanderrucksack. Pullover unten einrollen und als Hüftgurt nutzen, oder Moos als Polster zwischen Gurt und Schulter." }
    },
    eggs: { broetchen: "Frühstück mit Brötchen", torso: "Herr Torso Backpack", gaming: "Japanische Gaming-Show", hufeisen: "Das Hufeisen", roomtour: "Roomtour bei Jonas", revier2: "Ich bin nicht der Einzige", hobbit2: "Der Elbenpfad", kot: "Datteln oder Bratwurst" },
    looks: { "t-bank": "Unsere Bank. Heute ziehen wir weiter.", "t-holz": "Die Stämme bleiben hier.", "t-see": "Tschüss, Seepferdchensee." },

    rooms: {
      treffpunkt: ext(R3["treffpunkt"], {
        "t-platz": Object.assign({}, R3["treffpunkt"].hot["t-platz"], { hidden: true }),
        "t-tarp": Object.assign({}, R3["treffpunkt"].hot["t-tarp"], { hidden: false }),
        "exit-zurueck": { name: "Aufbrechen", stand: [90, 900], face: 0, poly: "M0,760 L110,760 L110,1080 L0,1080 Z",
          exit: { to: "steinbruch", spawn: [1760, 640], dir: -1, need: (E) => (E.hasGoal("packen") ? null : ["Erst das Lager abbauen."]) } }
      }),
      steinbruch: {
        where: "Steinbruch", bg: "bg/steinbruch.jpg",
        walk: [[0, 780], [700, 740], [1300, 720], [1600, 640], [1800, 600], [1900, 620], [1900, 1060], [0, 1060]],
        center: [900, 900], y0: 600, s0: 0.42, s1: 0.95,
        hot: {
          "s-kies": { name: "Schotterberge", stand: [700, 800], face: 500, poly: "M0,440 L800,440 L1400,700 L0,820 Z" },
          "s-schild": { name: "Altes Schild", stand: [1640, 700], face: 1720, poly: "M1680,600 L1770,600 L1770,840 L1680,840 Z" },
          "s-beeren": { name: "Heidelbeeren am Hang", kneel: true, stand: [1500, 980], face: 1700, poly: "M1520,900 L1900,900 L1900,1060 L1520,1060 Z" },
          "s-kot": { name: "Haufen am Wegrand", stand: [520, 980], face: 420, poly: "M340,960 L480,960 L480,1030 L340,1030 Z" },
          "exit-karte": { name: "Querfeldein, Richtung See", stand: [80, 900], face: 0, poly: "M0,800 L90,800 L90,1080 L0,1080 Z",
            exit: { to: "sumpf", spawn: [1700, 940], dir: -1, need: (E) => (E.hasGoal("karte") ? null : ["Erst die Karte checken. Wo geht's lang?"]) } }
        },
        overlays: `<g pointer-events="none" fill="#5a3e22" stroke="#2a1a0e" stroke-width="2"><ellipse cx="380" cy="1000" rx="14" ry="8"/><ellipse cx="404" cy="1006" rx="12" ry="7"/><ellipse cx="428" cy="998" rx="13" ry="8"/></g>`
      },
      sumpf: {
        where: "Sumpfiger See", bg: "bg/sumpf.jpg",
        walk: [[0, 760], [700, 740], [1300, 760], [1900, 760], [1900, 1060], [0, 1060]],
        center: [900, 900], y0: 720, s0: 0.55, s1: 0.95,
        hot: {
          "su-stamm": { name: "Umgestürzter Baum über dem Wasser", stand: [520, 780], face: 600, poly: "M380,560 L1440,540 L1440,610 L380,610 Z" },
          "su-wasser": { name: "Sumpfiges Ufer", kneel: true, stand: [900, 790], face: 900, poly: "M380,480 L1440,480 L1440,540 L380,560 Z M380,612 L1280,612 L1280,720 L380,720 Z" },
          "su-bach": { name: "Kleiner Fluss", kneel: true, stand: [1400, 800], face: 1450, poly: "M1300,640 L1600,640 L1600,760 L1300,760 Z" },
          "su-gras": { name: "Hohes Gras", stand: [800, 960], face: 800, poly: "M600,900 L1000,900 L1000,1000 L600,1000 Z" },
          "exit-fluss": { name: "Am Fluss entlang", stand: [1840, 940], face: 1920, poly: "M1830,760 L1920,760 L1920,1080 L1830,1080 Z",
            exit: { to: "grosser-see", spawn: [1700, 960], dir: -1, need: (E) => (!E.hasGoal("stamm") ? ["Erst über den Baumstamm. Da drüben geht's weiter."] : !E.hasGoal("wasser") ? ["Wasser tanken, bevor wir weitergehen. Am Fluss mit dem Filter."] : null) } }
        }
      },
      "grosser-see": {
        where: "Am großen See", bg: "bg/grosser-see.jpg",
        walk: [[0, 780], [500, 740], [900, 730], [1920, 780], [1920, 1060], [0, 1060]],
        center: [900, 900], y0: 700, s0: 0.5, s1: 0.95,
        overlays: `<g id="g-schutz" opacity="0" pointer-events="none"><path d="M60,790 Q320,830 600,790 L600,812 Q320,850 50,812 Z" fill="#071008" opacity="0.5" filter="url(#soft)"/><image href="tag1/plane.png" x="70" y="540" width="520" height="286" filter="url(#gradeJonas)"/></g>
          <g id="g-matte" opacity="0" pointer-events="none"><linearGradient id="matteStoff" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4e5232"/><stop offset="0.6" stop-color="#30341c"/><stop offset="1" stop-color="#1a1d0e"/></linearGradient><ellipse cx="245" cy="830" rx="120" ry="14" fill="url(#shadowGrad)"/><path d="M122,690 L168,728 M372,684 L322,724" stroke="#1a1c1e" stroke-width="4" stroke-linecap="round"/><path d="M122,690 L168,728 M372,684 L322,724" stroke="#8a8a7a" stroke-width="1.6" stroke-linecap="round"/><path d="M166,726 Q244,758 324,722 Q300,792 246,798 Q190,794 166,726 Z" fill="url(#matteStoff)" stroke="#16180c" stroke-width="2.5" stroke-linejoin="round"/><path d="M166,726 Q244,758 324,722" fill="none" stroke="#8a8e5a" stroke-width="2" opacity="0.7"/><path d="M190,746 Q214,780 236,792 M226,754 Q244,782 254,796 M268,752 Q280,778 282,792" stroke="#1e2210" stroke-width="2" fill="none" opacity="0.7"/><path d="M196,746 Q246,768 300,740 Q290,760 248,770 Q208,768 196,746 Z" fill="#3c4a2a" opacity="0.85"/></g>
          <g id="g-fire" opacity="0" pointer-events="none"><circle cx="600" cy="860" r="240" fill="url(#glow)"/><use href="#flames" transform="translate(600 890) scale(1.2)"/></g>`,
        hot: {
          "g-baeume": { name: "Kiefern mit tiefen Ästen", tent: [250, 790], tent2: [340, 800], stand: [460, 800], face: 220, poly: "M60,0 L380,0 L380,760 L60,760 Z" },
          "g-feuer": { name: "Alte Feuerstelle", kneel: true, stand: [820, 900], face: 600, poly: "M380,820 L820,820 L820,950 L380,950 Z" },
          "g-see": { name: "Großer See", kneel: true, bath: [1080, 640], stand: [1100, 760], face: 1100, poly: "M300,470 L1920,470 L1920,700 L300,720 Z" },
          "g-strand": { name: "Steinstrand", kneel: true, stand: [1300, 860], face: 1400, poly: "M800,730 L1920,760 L1920,900 L800,880 Z" }
        }
      }
    },

    setup(E) { E.show("t-tarpbild"); E.hot("t-tarp", true); E.hot("t-platz", false); },
    async start(E) {
      await E.lines([{ narr: "t5" }, "J: Hannes? Was war das denn für ein Gebell heute Nacht?", "f6-elch", "J: Hannes ist ganz gelassen. Mich beunruhigt das irgendwie. So aggressives Bellen."]);
    },

    async act(key, verb, item, E) {
      const has = E.has, f = E.flags;
      switch (key) {
        case "t-tarp":
          if (verb.look) return ["Mein Tarp. Heute kommt es mit."];
          if (verb.use) { if (E.hasGoal("packen")) return []; E.hide("t-tarpbild"); E.hot("t-tarp", false); E.goal("packen"); E.time(25); return ["Tarp runter, Stangen weg, alles in den Drybag.", "J: Wir melden uns ab. Kraut euch."]; }
          return;
        case "t-feuer":
          if (verb.look) return ["Kalt. Jonas war heute Nacht schon wach und hat Feuer gemacht, da hat er Rinde vorgetrocknet."];
          return;
        // ----- Steinbruch -----
        case "s-kies": if (verb.look) return ["Wo sind wir denn hier gelandet? Ein Steinbruch.", "Ach, das ist Straßenschotter. Wie praktisch, dass der direkt an der Straße ist."]; if (verb.use) { E.stat("fourth", -4); return ["J: Springt einfach den ganzen Hügel runter. Bam."]; } return;
        case "s-schild": if (verb.look) return ["Ein Privatweg. Was soll das bedeuten? Kommt hier nicht her.", "Also müssen wir querfeldein."]; return;
        case "s-kot":
          if (verb.look) { E.egg("kot"); return ["H: Hier hat ein größeres Tier gekotet. Eher so Datteln.", "J: Da hinten war eine Mulde voller Haufen. Das war eher die XXL-Ein-Meter-Bratwurst.", "H: Elch."]; }
          return ["Nein. Einfach nein."];
        case "s-beeren":
          if (verb.look) return ["Das Heidelbeerfeld. Da wird jetzt nochmal richtig gegönnt. Zweites Frühstück."];
          if (verb.use) { if (has("beeren")) return ["Hab schon eine Handvoll."]; E.add("beeren"); E.stat("hunger", 15); E.time(10); return ["Die Dose nochmal ordentlich vollmachen. Falls es am See keine gibt."]; }
          return;
        case "exit-karte": return;
        // ----- Sumpf -----
        case "su-stamm":
          if (verb.look) return ["Ein umgestürzter Baum über den Seearm. Nicht von Menschenhand. Aber er sieht stabil aus."];
          if (verb.use) {
            if (E.hasGoal("stamm")) return ["Wir sind drüber."];
            await E.encounter(STAMM);
            return [];
          }
          return;
        case "su-wasser": if (verb.look) return ["Alles sumpfig. Kein Zugang zum Wasser, keine Feuerstelle. Super viele Insekten.", "Das Ziel entspricht nicht unserer Vorstellung."]; if (verb.use) { E.hurt(3); return ["Kackbremsen! Fuckbremsen, Junge!"]; } return;
        case "su-bach":
          if (verb.look) return ["Ein kleiner Fluss. Hier kann man gut Wasser tanken."];
          if (item === "filterflasche") { E.swap("filterflasche", "filterflasche_voll"); E.goal("wasser"); return ["Direkt am Fluss filtern. Läuft."]; }
          if (item === "metallflasche") { E.swap("metallflasche", "metallflasche_voll"); return ["Kanne voll. Abkochen müsste ich das aber noch. Hannes' Filter ist schneller."]; }
          if (verb.use) { E.stat("thirst", 5); return ["Ein Schluck mit der Hand … lieber filtern."]; }
          return;
        case "su-gras":
          if (verb.look) return ["Hohes Gras. Irgendwas glänzt da."];
          if (verb.use) {
            if (f.hufeisen) return ["Nur noch Gras."];
            f.hufeisen = true; E.add("hufeisen"); E.persist("hufeisen"); E.egg("hufeisen");
            return ["J: Ich dachte schon, meine Mütze wäre weg. Sie war zwischen Drybag und Rücken. Und jetzt weiß ich auch …", "f6-hufeisen"];
          }
          return;
        // ----- Großer See -----
        case "g-baeume":
          if (verb.look) return [E.hasGoal("schutz") ? "Unser Schutz. Hier läuft das Wasser ab." : "Kiefern mit tiefen Ästen. Hier kann man schnell was aufspannen."];
          if (item === "plane" || item === "tarp" || item === "paracord" || item === "powercord") {
            if (E.hasGoal("schutz")) {
              if (item === "powercord" && !f.matte) { f.matte = true; E.show("g-matte"); E.egg("roomtour"); E.time(30); return ["J: Hängematte mit Veranda und Markise. Ich zeig euch, wie ich wohne.", "f6-roomtour", "H: Ich hab keine Isomatte. Ohne macht das keinen Sinn. Ich bleib oben an der kleinen Straße."]; }
              return ["Steht schon."];
            }
            // Gebraucht werden eine Plane und eine Schnur, nicht zwei vom selben
            const cover = item === "plane" || item === "tarp";
            if (cover ? f.dach : f.schnur) return [cover ? "Eine Plane hängt schon. Jetzt fehlt noch eine Schnur." : "Die Schnur ist gespannt. Jetzt fehlt noch die Plane."];
            if (cover) f.dach = true; else f.schnur = true;
            E.drop(item);
            if (!(f.dach && f.schnur)) return [cover ? "Plane drüber! Jetzt fehlt noch eine Schnur, damit das hält." : "Schnur zwischen die Äste! Jetzt die Plane drüber."];
            E.goal("schutz"); E.show("g-schutz"); E.time(20);
            return ["In Windeseile errichtet: unser Shelter. Richtig aufgespannt, dass wir beide drunter passen.", "Hier würde das Wasser ablaufen. Hoffentlich klappt das.", "Warten wir mal ab, was uns erwartet."];
          }
          return;
        case "g-strand":
          if (verb.look) return ["Ein Strand aus Steinen. Und überall trockenes Holz. Tote Bäume, die wir nur fällen müssen."];
          if (verb.use) { if (has("treibholz")) return ["Genug Holz."]; E.add("treibholz"); return ["Trockenes Holz! Zur Abwechslung mal. Endlich."]; }
          return;
        case "g-feuer":
          if (verb.look) return ["Eine Feuerstelle für die Waldarbeiter. Länger nicht benutzt."];
          if (item === "feuerstahl") {
            if (E.hasGoal("feuer")) return ["Brennt."];
            if (!E.hasGoal("schutz")) return ["Erst Schutz vor dem Gewitter! Das Feuer kann warten."];
            if (!has("treibholz")) return ["Trockenes Holz vom Steinstrand holen."];
            if (!(await E.minigame("feuer"))) E.time(15);
            E.drop("treibholz"); E.goal("feuer"); E.show("g-fire"); E.fire("grosser-see"); E.time(30);
            return ["Trockenes Holz … zack, es brennt.", "Das ist mal was Schönes, dass wir nicht die ganze Zeit am Feuer sein müssen."];
          }
          return;
        case "g-see":
          if (verb.look) return ["Ein großer See. Eine Insel, Kanus, Kajaks, eine Schleuse. Hier geht richtig was ab."];
          if (item === "filterflasche") { E.swap("filterflasche", "filterflasche_voll"); return ["Seewasser durch den Filter. Läuft."]; }
          if (verb.use) { E.egg("gaming"); E.stat("fourth", 15); return ["Abkühlung! Rein ins Wasser …", "*rutsch*", "J: Alter, bist du echt gerade runtergerutscht?", "f6-gaming"]; }
          return;
      }
    },

    self(verb, item, E) {
      const h = E.h;
      if (item === "pullover" && E.active === "jonas") { h.flags.torso = true; E.drop("pullover"); E.egg("torso"); E.learn("tragen"); return ["Ich hab eine geile Idee: Pullover unten rein, einrollen, zu. Oben fest, unten wie ein Hüftgurt.", "Herr Torso Backpack ist dabei. Winke, winke."]; }
      if (verb.use && E.active === "hannes" && !h.flags.moos) { h.flags.moos = true; h.flags.torso = true; return ["Meine Idee: Moos als Polster zwischen Gurt und Schulter. Könnte helfen."]; }
    },
    async partner(id, verb, item, E) {
      if (verb.use && id === "jonas" && E.active === "hannes" && !E.flags.broetchen) {
        E.flags.broetchen = true; E.egg("broetchen"); E.stat("fourth", 10); E.stat("fourth", 10, "jonas");
        return ["f6-broetchen", "J: Ja, ich hab schon Tee gemacht. All you can eat. Heidelbeeren.", "H: Er hat ein bisschen vegetarische Salami gekauft für mich."];
      }
      if (verb.use && id === "hannes" && E.active === "jonas" && !E.flags.revier2) {
        E.flags.revier2 = true; E.egg("revier2");
        return ["f6-revier"];
      }
    },

    async enter(room, E) {
      if (room === "steinbruch" && !E.flags.sb) {
        E.flags.sb = true; E.time(90);
        const r = await E.minigame("karte");
        E.goal("karte"); E.learn("karte"); E.time(60 + (r && r.deadEnds ? r.deadEnds * 30 : 0));
        return ["f6-lightly", "Den See links liegen lassen. Mit links können wir nichts falsch machen."];
      }
      if (room === "sumpf" && !E.flags.su) { E.flags.su = true; E.time(60); return ["Wir sind am See angekommen. Aber den eingezeichneten Traktorweg gibt's nicht mehr.", "Da vorne ist noch ein Fluss. An dem können wir uns orientieren."]; }
      if (room === "grosser-see" && !E.flags.gs) {
        E.flags.gs = true; E.time(60);
        await E.lines(["f6-hobbit", "f6-gewitter", { narr: "t5g" }]);
        const r = await E.minigame("gewitter");
        if (r === "nah") return ["Unter zehn Sekunden! Sofort Schutz! Die Plane unter die Kiefern, schnell!"];
        if (r === "weit") return ["Noch ein paar Kilometer. Aber es kommt näher. Schnell einen Unterschlupf bauen."];
        E.hurt(5); return ["Keine Ahnung, wie weit. Egal, schnell Schutz suchen!"];
      }
    },

    timed(E) {
      const h = E.h;
      if (!h.warned.regen && E.weather() === "gewitter" && !E.hasGoal("schutz") && h.room === "grosser-see") { h.warned.regen = true; E.hurt(10); E.say("Platzregen! Wir werden pitschnass. Schnell unter die Kiefern!"); }
    },

    hint(E) {
      const has = E.has, h = E.h;
      if (!E.hasGoal("packen")) return "Erst das Tarp abbauen. Dann links aufbrechen.";
      if (h.room === "treffpunkt") return "Links geht's los, Richtung Steinbruch.";
      if (h.fourth < 30) return "Wir sind k.o. Jonas' Pullover als Hüftgurt hilft, oder Hannes' Moos-Idee. Und Essen.";
      if (h.room === "steinbruch") return "Ab hier querfeldein, links durchs Gelände.";
      if (!E.hasGoal("stamm")) return "Über den umgestürzten Baumstamm. Einer geht vor und hilft dem anderen.";
      if (!E.hasGoal("wasser")) return has("filterflasche") ? "Am kleinen Fluss rechts die Titanflasche füllen." : "Wasser tanken am Fluss.";
      if (h.room === "sumpf") return "Am Fluss entlang nach rechts.";
      if (!E.hasGoal("schutz")) return "Plane und Schnur unter die Kiefern links. Schnell!";
      if (!E.hasGoal("feuer")) return has("treibholz") ? "Feuerstahl auf die alte Feuerstelle." : "Trockenes Holz am Steinstrand holen.";
      return "Alles erledigt. Schlafsack unter den Shelter.";
    },
    sleepHint: () => "Ein geiler Tag. Ab unter den Shelter. Schlafsack auf die Kiefern anwenden.",

    async night(E) { await E.lines(["H: Der Marsch war richtig abenteuerlich. Ich merk's in den Beinen und im Rücken.", "J: 50 Kilometer musst du noch wandern.", "H: Easy, sagt sogar Stefan.", { narr: "t5e" }]); }
  };

  // Schlafen: Schlafsack auf den Shelter
  const origAct = def.act;
  def.act = async (key, verb, item, E) => {
    if (key === "g-baeume" && item === "schlafsack") {
      const miss = (E.together ? [["schutz", "der Schutz"], ["feuer", "das Feuer"], ["wasser", "das Wasser"]] : []).filter(([k]) => !E.hasGoal(k)).map(([, l]) => l);
      if (miss.length) return [`Noch nicht. Es fehlt noch ${miss.join(" und ")}.`];
      E.drop("schlafsack");
      await E.lines([E.flags.matte ? "J: Ich chill hier einfach in der Hängematte, die ich mir selbst gebaut habe. Ein Träumchen." : "J: Ab unter den Shelter. Ein Träumchen."]);
      E.sleep(); return [];
    }
    return origAct(key, verb, item, E);
  };

  const STAMM = { title: "Baumstamm-Überquerung", text: "Der Stamm liegt quer über dem Seearm. Rutschig, aber breit genug. Wie geht ihr rüber?", opts: [
    { label: "Jonas geht vor und reicht Hannes von drüben die Hand", go: (E) => { E.goal("stamm"); E.time(15); return ["J: Ich geh schon mal rüber und mach dir den Weg frei. Los!", "J: Wow … das kann man schon nicht. Aber hier, nimm die Hand.", "H: Jawoll! Sehr gut!", "J: Yes!"]; } },
    { label: "Beide gleichzeitig, schnell rüberrennen", go: (E) => { E.hurt(12); E.hurt(12, "jonas"); E.goal("stamm"); return ["H: Ich geh auf jeden Fall über den Stamm …", "*platsch*", "J: Beide nass bis zur Hüfte. Na gut, drüben sind wir."]; } },
    { label: "Außen herum durchs Gebüsch", go: (E) => { E.stat("fourth", -25); E.stat("fourth", -25, "jonas"); E.goal("stamm"); E.time(60); return ["H: Hier geht's auch … Alles so ein Fick hier.", "J: Eine Stunde später, völlig zerkratzt, auf der anderen Seite."]; } }
  ] };

  Ausgesetzt.day(5, def);
  window.TAG5 = { rooms: def.rooms };
})();
