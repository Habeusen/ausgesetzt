// Tag 2 (Folge 3): Sonntag. Hannes zieht um den See und fängt seinen ersten Barsch.
// Jonas bleibt im Fichtenwald und wird zum Handwerker: Wäscheleine, Schwedenfeuer, Löffel, Mückentür.
(function () {
  const c = (file, text, who, folge, t) => ({ file, text, who, folge, t });
  const R = window.TAG1.rooms;
  const ext = (room, hot, extra) => Object.assign({}, room, extra || {}, { hot: Object.assign({}, room.hot, hot) });

  const def = {
    title: "Handwerk und Umzug", weekday: "Sonntag", folge: "3", clock: 7 * 60, fourth: "mood",
    intro: "Die ganze Nacht hat es geregnet. Hannes fühlt seinen Platz nicht und will um den See ziehen. Jonas bleibt im Fichtenwald und hat sich einiges vorgenommen. Mittags soll die Sonne kommen.",
    outro: "Hannes hat einen Barsch gefangen, Jonas einen Löffel gebrannt. Und am Forstweg wartet der Treffpunkt für Tag 4.",
    weather: (t) => (t < 10.5 * 60 ? "regen" : t < 18 * 60 ? "sonne" : t < 19.5 * 60 ? "niesel" : t < 21 * 60 ? "grau" : "nacht"),
    chars: {
      hannes: { room: "hannes-ufer", start: [1300, 860], dir: -1, narr: "t2h", stats: { thirst: 60, hunger: 55, fourth: 55 },
        inv: ["messer", "feuerstahl", "filterflasche", "angelset", "schlafsack", "handy"] },
      jonas: { room: "jonas-wald", start: [900, 940], narr: "t2j", stats: { thirst: 55, hunger: 50, fourth: 60 },
        inv: ["kukri", "feuerstahl", "metallflasche", "powercord", "schlafsack", "handy"] }
    },
    goals: {
      hannes: [["abbau", "Lager abbauen"], ["lager", "Neues Lager"], ["fisch", "Barsch fangen"], ["ok", "OK an Stefan"]],
      jonas: [["leine", "Wäscheleine"], ["feuer", "Schwedenfeuer"], ["essen", "Heuschrecken mit Erdbeeren"], ["loeffel", "Löffel brennen"], ["tuer", "Mückentür"]]
    },
    items: {
      holzscheite: { name: "Holzscheite", desc: "Trockene Scheite unter dem alten Brett. Da hat wohl jemand Holz gelagert." },
      holzscheibe: { name: "Holzscheibe", desc: "Eine Baumscheibe von einer Fällung. Perfekt für ein Schwedenfeuer." },
      viertel: { name: "Vier Holzviertel", desc: "Die Scheibe geviertelt, die Spitzen abgehackt." },
      spaene: { name: "Kienspan-Späne", desc: "Grobe und feine Späne getrennt gesammelt. Brennt geil." },
      heuschrecken: { name: "Heuschrecken", desc: "Ein paar Proteinkollegen.", eat: 15, say: "Knackig. Protein ist Protein." },
      rohling: { name: "Löffelrohling", desc: "Ein Holzstück in Löffelform. Fehlt noch die Mulde." },
      zweige: { name: "Fichtenzweige", desc: "Ein Armvoll Fichtenzweige für die Tür." },
      smoothie: { name: "Blaubeer-Smoothie", desc: "Heiß und lila.", drink: 30, eat: 20, mood: 15, becomes: "filterflasche", say: "Heißer Blueberry-Shake. Mögen wir." }
    },
    // Video-Tagebuch vor dem Schlafen
    campfire: {
      hannes: [{ label: "Allein hier draußen", lines: ["lf-2h-durchhalten"] }, { label: "Barsch Nummer eins", need: (E) => E.hasGoal("fisch"), lines: ["H: Ladies and Gentlemen, this is Barsch number one. Am Stock gegrillt. Ich bin so stolz."] }],
      jonas: [{ label: "Das Schwedenfeuer", lines: ["lf-2j-schwedenfeuer"] }, { label: "Die Mücken", lines: ["lf-2j-muecken"] }]
    },
    clips: {
      "lf-2h-durchhalten": c("ton/lf-2h-durchhalten.wav", "Ich sag mal so: Würde ich jetzt nicht die Aussicht haben, Jonas noch zu sehen … keine Ahnung, ob ich die sieben Tage durchhalten würde. Wahrscheinlich nicht. Hunger ist nicht das Problem. Aber diese Langeweile, und halt niemanden sehen.", "hannes", 3, 2155),
      "lf-2j-schwedenfeuer": c("ton/lf-2j-schwedenfeuer.wav", "Ich bin wirklich happy mit meinem Schwedenfeuer. Das ist mega geil. Weil ich ein Feuer hab, das ich gut kontrollieren kann: Wenn ich die Scheite zusammenschiebe, geht's aus, dann ist die Luftzufuhr weg. Ich kann mein Gefäß abstellen und darin kochen. Ich brauche ganz wenig Holz, nur kleine Zweige. Das ist total effizient.", "jonas", 3, 2441),
      "lf-2j-muecken": c("ton/lf-2j-muecken.wav", "Die abgefucktesten Jagdtiere sind immer noch die Mücken. Ich hoffe, dass meine Tür hilft. Na ja, wir werden es sehen.", "jonas", 3, 4265),
      "f3-wetter": c("ton/f3-wetter.wav", "Willkommen beim Wetterbericht für Camp Jonas. Die nächsten 10 Minuten bleibt es beständig. Es könnten Sonnenstrahlen durchkommen. Und danach ist es ungewiss.", "jonas", 3, 1445),
      "f3-neun": c("ton/f3-neun.wav", "Da waren es nur noch neun.", "jonas", 3, 1385),
      "f3-schwedenfeuer": c("ton/f3-schwedenfeuer.wav", "Ich muss sagen, ich bin wirklich happy mit dem Schwedenfeuer. Das ist mega geil.", "jonas", 3, 2439),
      "f3-langweilig": c("ton/f3-langweilig.wav", "Das ist scheiße langweilig.", "hannes", 3, 2139),
      "f3-aussicht": c("ton/f3-aussicht.wav", "Würde ich jetzt nicht die Aussicht haben, Jonas noch zu sehen … die sieben Tage durchhalten? Wahrscheinlich nicht.", "hannes", 3, 2162),
      "f3-mittwoch": c("ton/f3-mittwoch.wav", "Und hier treffen wir uns. Bis dahin.", "hannes", 3, 2367),
      "f3-barsch": c("ton/f3-barsch.wav", "Ladies and gentlemen, this is Barsch number one. Niemand hätte gedacht, dass ich dich bekomme. Aber ich habe dich.", "hannes", 3, 3446),
      "f3-loeffel": c("ton/f3-loeffel.wav", "Ich sage euch was. Ich bin so stolz auf meinen Löffel. Der ist richtig geil geworden.", "jonas", 3, 4100)
    },
    narr: {
      t2h: { file: "ton/erzaehler/damien-black/erzaehler-201.wav", text: "Tag zwei. Der Regen hat Hannes nicht gebrochen, aber er hat ihm eines gezeigt: Dieser Platz ist nicht seiner. Er packt alles zusammen und folgt dem Ufer." },
      t2j: { file: "ton/erzaehler/damien-black/erzaehler-202.wav", text: "Jonas bleibt. Sein Wald hat ihm Holz gegeben, Harz und eine Holzscheibe. Heute wird er zum Handwerker." },
      t2e: { file: "ton/erzaehler/damien-black/erzaehler-203.wav", text: "Am Abend des zweiten Tages haben beide etwas, das es am Morgen noch nicht gab. Hannes einen Fisch. Jonas einen Löffel." }
    },
    journal: {
      abspannknoten: { title: "Abspannknoten", text: "Vom gespannten Ende zur festen Seite, einmal herum, die lose Seite durch die Schlaufe ziehen. Mit Seilreibung und Slipknoten sichern, dann lässt er sich leicht lösen." },
      schwedenfeuer: { title: "Schwedenfeuer", text: "Holzscheibe vierteln, die inneren Spitzen abhacken und wieder zusammensetzen. In der Mitte entsteht ein Luftkanal. Klein, kontrollierbar, man kann die Kanne obendrauf stellen." },
      loeffel: { title: "Löffel brennen", text: "Glühende Kienspan-Kohle auf das Holz legen, vorsichtig pusten, Asche ausschaben. Drei Runden, dann mit dem Messer nachschnitzen." },
      made: { title: "Köder: grüne Maden", text: "Am Ufer und bei Ameisenhaufen findet man grüne Maden. Die Barsche lieben sie." },
      kienspan2: { title: "Späne sortieren", text: "Beim Kienspan-Schnitzen grobe und feine Späne getrennt sammeln. Feine zum Anzünden, grobe zum Nachlegen. Nie alle auf einmal, sonst erstickt das Feuer." }
    },
    eggs: { wetter: "Der Wetterbericht für Camp Jonas", spinne: "Die Unterwasserspinne", tuer: "Die Heiligtümer des Todes", neun: "Da waren's nur noch neun", unfall: "Der Unfall mit der Unterhose", lkw: "Der rückwärtsfahrende LKW" },
    noSignal: "Kein Empfang. Vielleicht oben am Forstweg?",
    looks: {
      "j-wurzel": "Mein Wurzelteller. Harz ohne Ende.", "j-spuren": "Frische Wühlspuren? Nee, die sind von gestern.", "j-kraut": "Johanniskraut. Gelb, fünf Blätter.",
      "j-beeren": "Die Erdbeer-Plantage. Ist nachgewachsen.", "j-gopro": "Die GoPro. Immer noch leer.", "j-steine": "Die restlichen Steine.", "j-see": "Der See. Heute spiegelglatt.",
      "j-kroete": "Mein kleiner Freund ist noch da.", "j-skelett": "Das Hechtskelett treibt immer noch rum.", "j-astgabeln": "Mein Holzschuppen mit Strohdach. Hab ich gar nicht mehr benutzt.",
      feuer: "Der alte Steinring.", birke: "Die Birke vom alten Platz.", wurzel: "Baumi. Mein Bester. Muss leider hierbleiben.", beeren: "Blaubeeren, wie immer."
    },
    uses: { "j-spuren": "Heute lass ich die Wildschweine in Ruhe.", "j-gopro": "Tot. Immer noch.", "j-kroete": "Lassen wir ihn in Ruhe." },

    rooms: {
      "hannes-ufer": ext(R["hannes-ufer"], {
        "exit-weg": { name: "Um den See ziehen", stand: [250, 900], face: 0, poly: "M0,700 L215,700 L215,1080 L0,1080 Z",
          exit: { to: "hannes-neu", spawn: [1500, 960], dir: -1, need: (E) => (E.hasGoal("abbau") ? null : ["Erst das Lager abbauen. Das Tarp kommt mit."]) } }
      }),
      "hannes-lager": R["hannes-lager"],
      "hannes-neu": {
        where: "Hannes' neues Lager", bg: "bg/hannes-lager2.jpg",
        walk: [[200, 720], [420, 600], [700, 560], [1000, 560], [1240, 600], [1240, 700], [1100, 760], [1650, 870], [1900, 870], [1900, 1060], [0, 1060], [0, 860]],
        center: [800, 900], y0: 560, s0: 0.42, s1: 0.95,
        overlays: `<g id="h2-cord" opacity="0" pointer-events="none"><path d="M905,380 Q1030,384 1150,350" stroke="#3f6b35" stroke-width="5" fill="none"/></g>
          <g id="h2-tarp" opacity="0" pointer-events="none"><path d="M850,480 Q1000,520 1190,470 L1200,500 Q1000,545 840,510 Z" fill="#0d1408" opacity="0.5" filter="url(#soft)"/><image href="tag1/tarp.png" x="812" y="340" width="462" height="248" filter="url(#gradeHannes)"/></g>
          <g id="h2-fire" opacity="0" pointer-events="none"><circle cx="520" cy="620" r="220" fill="url(#glow)"/><use href="#flames" transform="translate(520 650) scale(1.1)"/></g>
          <g id="h2-ameisen" pointer-events="none"><path d="M240,960 q60,-70 120,0 z" fill="#6a5034" stroke="#2a1f12" stroke-width="2"/><g fill="#1a120a"><circle cx="270" cy="950" r="2"/><circle cx="300" cy="935" r="2"/><circle cx="325" cy="952" r="2"/><circle cx="290" cy="958" r="2"/></g></g>`,
        hot: {
          "h2-see": { name: "See", stand: [300, 760], face: 100, poly: "M0,470 L500,470 L330,560 L180,620 L170,720 L0,800 Z" },
          "h2-fels": { name: "Granitplatte", stand: [520, 740], face: 420, poly: "M180,560 L560,520 L700,560 L650,720 L200,720 Z" },
          "h2-kiefern": { name: "Zwei Kiefern", stand: [1010, 600], face: 1000, dot: [912, 300], poly: "M880,0 L945,0 L945,490 L880,490 Z M1115,0 L1175,0 L1175,480 L1115,480 Z" },
          "h2-tarp": { name: "Tarp", stand: [1010, 600], face: 1000, hidden: true, poly: "M900,380 L1150,350 L1190,480 L860,500 Z" },
          "h2-birke": { name: "Umgefallene Birke", stand: [1180, 880], face: 1400, poly: "M1050,640 L1920,700 L1920,820 L1650,800 L1050,720 Z" },
          "h2-holz": { name: "Altes Brett", stand: [1450, 900], face: 1450, poly: "M1230,720 L1660,610 L1680,700 L1320,880 L1230,860 Z" },
          "h2-stein": { name: "Flacher Stein", stand: [880, 860], face: 940, poly: "M900,780 L980,780 L980,830 L900,830 Z" },
          "h2-heidel": { name: "Blaubeeren", stand: [520, 980], face: 300, poly: "M40,990 L420,990 L420,1075 L40,1075 Z" },
          "h2-ameisen": { name: "Ameisenhaufen", stand: [420, 960], face: 300, poly: "M230,900 L370,900 L370,970 L230,970 Z" },
          // Am rechten Rand auf Höhe des Waldwegs, nicht unten in der Ecke (dort liegen die Knöpfe)
          "exit-forstweg": { name: "Zum Forstweg", stand: [1860, 880], face: 1920, dot: [1880, 700], poly: "M1830,560 L1920,560 L1920,850 L1830,850 Z", exit: { to: "treffpunkt", spawn: [200, 880], dir: 1 } }
        }
      },
      "treffpunkt": {
        where: "Alter Forstweg", bg: "bg/treffpunkt.jpg",
        walk: [[120, 720], [520, 660], [1000, 640], [1500, 660], [1900, 700], [1900, 1060], [0, 1060], [0, 760]],
        center: [900, 880], y0: 620, s0: 0.45, s1: 0.92,
        hot: {
          "t-bank": { name: "Alte Bank", stand: [1280, 700], face: 1280, poly: "M1100,565 L1465,565 L1465,670 L1100,670 Z" },
          "t-feuer": { name: "Feuerstelle", stand: [1250, 790], face: 1250, poly: "M1140,680 L1360,680 L1360,760 L1140,760 Z" },
          "t-holz": { name: "Holzstapel", stand: [430, 760], face: 300, poly: "M80,510 L390,510 L390,700 L80,700 Z" },
          "t-see": { name: "Blick auf den See", stand: [900, 680], face: 900, poly: "M640,400 L1150,400 L1150,560 L640,560 Z" },
          "exit-zurueck": { name: "Zurück zum Lager", stand: [90, 900], face: 0, poly: "M0,760 L110,760 L110,1080 L0,1080 Z", exit: { to: "hannes-neu", spawn: [1760, 950], dir: -1 } }
        }
      },
      "jonas-wald": ext(R["jonas-wald"], {
        "j-leine": { name: "Platz für eine Wäscheleine", stand: [820, 780], face: 800, poly: "M640,500 L1000,500 L1000,620 L640,620 Z" },
        "j-wiese": { name: "Grasbüschel", stand: [1200, 960], face: 1200, poly: "M1100,960 L1500,960 L1500,1070 L1100,1070 Z" }
      }, {
        overlays: R["jonas-wald"].overlays + `<g id="j-leinebild" opacity="0" pointer-events="none"><g filter="url(#gradeJonas)"><linearGradient id="stoffBlau" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a6e88"/><stop offset="1" stop-color="#26303e"/></linearGradient><linearGradient id="stoffGruen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6a7a48"/><stop offset="1" stop-color="#2c3a1e"/></linearGradient><linearGradient id="stoffGrau" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a8278"/><stop offset="1" stop-color="#3e3a34"/></linearGradient><path d="M600,540 Q820,584 1010,530" stroke="#1c1e20" stroke-width="5" fill="none"/><path d="M600,540 Q820,584 1010,530" stroke="#5a5e60" stroke-width="2" fill="none"/><path d="M688,560 L728,566 L734,640 L716,642 L708,592 L700,642 L682,640 Z" fill="url(#stoffBlau)" stroke="#14161a" stroke-width="2" stroke-linejoin="round"/><path d="M700,576 l2,40 M720,578 l4,38" stroke="#1c2430" stroke-width="2" opacity="0.7"/><path d="M790,572 L852,578 L860,600 L846,602 L848,650 L796,646 L796,598 L782,596 Z" fill="url(#stoffGruen)" stroke="#14180e" stroke-width="2" stroke-linejoin="round"/><path d="M806,610 q20,6 32,0 M806,628 q18,5 30,0" stroke="#1e2814" stroke-width="2" fill="none" opacity="0.7"/><path d="M906,566 l12,1 l0,34 q0,10 -10,10 l-12,0 l0,-10 l10,0 z M934,562 l12,0 l0,34 q0,10 -10,10 l-12,0 l0,-10 l10,0 z" fill="url(#stoffGrau)" stroke="#1a1814" stroke-width="2"/><g fill="#2a2620"><rect x="704" y="557" width="4" height="9"/><rect x="814" y="568" width="4" height="9"/><rect x="908" y="560" width="4" height="9"/><rect x="936" y="557" width="4" height="9"/></g><g fill="#9ab8d0" opacity="0.7"><circle cx="712" cy="650" r="2.5"/><circle cx="828" cy="656" r="2.5"/><circle cx="912" cy="620" r="2"/></g></g></g>
          <g id="j-tuer" opacity="0" pointer-events="none"><g filter="url(#gradeJonas)" transform="translate(-318 -14)"><pattern id="fichtenzweige" width="26" height="22" patternUnits="userSpaceOnUse" patternTransform="scale(0.7) rotate(9)"><rect width="26" height="22" fill="#1f3818"/><path d="M2,20 L13,4 L24,20 M7,14 L13,4 L19,14 M5,18 l3,-3 M21,18 l-3,-3 M10,10 l-2,-2 M16,10 l2,-2" stroke="#3f6a2c" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M13,4 v16" stroke="#5a4a2a" stroke-width="1.4"/></pattern><ellipse cx="592" cy="804" rx="90" ry="14" fill="url(#shadowGrad)"/><path d="M530,792 L600,628 L652,792 Q596,806 530,792 Z" fill="url(#fichtenzweige)" stroke="#12200e" stroke-width="2" stroke-linejoin="round"/><path d="M530,792 L600,628 L652,792 Q596,806 530,792 Z" fill="url(#strohSchattenTuer)"/><linearGradient id="strohSchattenTuer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></linearGradient><path d="M540,770 l-16,-6 M548,740 l-14,-10 M560,708 l-12,-12 M572,676 l-10,-14 M640,760 l16,-8 M630,724 l14,-10 M620,690 l14,-12 M610,656 l12,-12" stroke="#3f6a2c" stroke-width="3" stroke-linecap="round"/><path d="M520,800 L600,610 L660,800 M548,740 L632,740" stroke="#2a1d12" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M520,800 L600,610 L660,800 M548,740 L632,740" stroke="#6a4e30" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></g>`
      }),
      "jonas-see": ext(R["jonas-see"], {}, {
        overlays: R["jonas-see"].overlays.replace('<g id="j-fire"', `<g id="j-schweden" opacity="0" pointer-events="none"><ellipse cx="1210" cy="664" rx="80" ry="16" fill="#000" opacity="0.35" filter="url(#soft)"/><path d="M1150,658 L1150,600 L1270,600 L1270,658 Q1210,672 1150,658 Z" fill="#7a5634" stroke="#2a1a0e" stroke-width="3"/><ellipse cx="1210" cy="600" rx="60" ry="13" fill="#c9a06a" stroke="#2a1a0e" stroke-width="3"/><path d="M1210,587 L1210,613 M1150,600 L1270,600" stroke="#2a1a0e" stroke-width="4"/><ellipse cx="1210" cy="600" rx="10" ry="4" fill="#1a0e06"/></g><g id="j-fire"`)
      })
    },

    // Folgen von Tag 1
    carry(E) {
      if (E.persisted("nachtmesser")) { E.stat("fourth", -12, "jonas"); return ["Jonas hat mit dem Messer in der Hand kaum geschlafen und ist übermüdet."]; }
      return [];
    },
    setup(E) {
      // Morgen nach Tag 1: Hannes' Tarp steht noch, bei Jonas stehen Plane, Steine und Holzschuppen
      for (const id of ["h-tarp", "h-cord", "j-tarp", "j-cord", "j-steine", "j-holzshelter"]) E.show(id);
      E.hot("tarp", true); E.hot("j-plane", true);
    },

    async act(key, verb, item, E) {
      const h = E.h, f = h.flags, has = E.has;
      switch (key) {
        // ----- Hannes, Morgen am alten Platz -----
        case "tarp":
          if (verb.look) return ["Mein Tarp. Die ganze Nacht Regen, aber drunter blieb's halbwegs trocken.", "Hab trotzdem was von einem Hirsch und einem Elch gehört. Die waren ziemlich laut."];
          if (verb.use) {
            if (E.hasGoal("abbau")) return [];
            E.hide("h-tarp"); E.hide("h-cord"); E.hot("tarp", false); E.add("tarp"); E.add("paracord"); E.goal("abbau"); E.time(25);
            return ["Zelt, Tarp, alles abgebaut.", "Tschüss, Rindenbett. Tschüss, Baumi. War bequemer als gedacht.", "Ich glaube, da hinten am See ist es besser. Auf geht's."];
          }
          return ["Erst mal abbauen."];
        case "kiefern":
          if (verb.use && !f.zaehne) { f.zaehne = true; E.stat("fourth", 6); return ["Morgenroutine: Kiefernnadeln kauen, Zweig als Zahnbürste.", "Zähne fühlen sich richtig gut an. Fast wie zu Hause."]; }
          return;
        case "see": if (verb.look) return ["Spiegelglatt heute Morgen. Auf der anderen Seite sieht's besser aus."]; return;
        case "stamm": if (verb.look) return ["Meine glorreiche Bank. Die bleibt hier."]; return;
        case "losung": if (verb.look) return ["Die Elch-Losung von gestern. Ich hab immer noch keinen Bock auf dich."]; return;

        // ----- Hannes, neues Lager -----
        case "h2-see":
          if (verb.look) {
            if (f.seeSeen) { E.egg("spinne"); return ["Oh! Eine Unterwasserspinne!", "Die läuft einfach unter Wasser. Hab ich noch nie gesehen."]; }
            f.seeSeen = true; return ["Klares Wasser, und gefühlt hab ich noch keinen einzigen Fisch gesehen."];
          }
          if (verb.use) return ["Mit der Hand? Ich hab meine Flasche."];
          if (item === "filterflasche") { E.swap("filterflasche", "filterflasche_voll"); return ["Flasche voll. Filter drauf, fertig."]; }
          if (item === "angelset") return ["Ohne Köder wird das nix. Grüne Maden wären perfekt."];
          if (item === "angel_bereit") return angeln(E);
          return;
        case "h2-fels":
          if (verb.look) return [E.flags.h2fire ? "Mein Feuer auf dem warmen Stein." : "Eine flache Granitplatte am Wasser. Hier mach ich mein Feuer. Und angeln kann man von hier auch."];
          if (verb.use) {
            if (!f.chill) { f.chill = true; E.stat("fourth", 12); E.time(30); return ["Kurz auf den warmen Stein legen. Die Sonne kommt raus."]; }
            if (h.fourth < 45 && !f.langweilig) { f.langweilig = true; return ["f3-langweilig", "Hunger ist nicht das Problem. Aber diese Langeweile, und niemanden sehen …"]; }
            return ["Schön hier. Aber auf Dauer allein …"];
          }
          if (item === "feuerstahl") {
            if (E.flags.h2fire) return ["Brennt doch schon."];
            if (!has("holzscheite")) return ["Kein trockenes Holz. Unter dem alten Brett lag doch was?"];
            if (!has("rinde")) return ["Holz hab ich. Jetzt noch was Feines zum Anzünden. Birkenrinde von der umgefallenen Birke?"];
            if (!(await E.minigame("feuer"))) E.time(15);
            E.drop("holzscheite"); E.drop("rinde"); E.flags.h2fire = true; E.show("h2-fire"); E.fire("hannes-neu"); E.time(20);
            return ["Rinde, Scheite, Funken … läuft.", "Eigentlich brauch ich's noch nicht. Aber vielleicht fange ich ja doch noch was."];
          }
          if (item === "angel_bereit") return angeln(E);
          if (item === "fisch") return ["Erst ausnehmen."];
          if (item === "fisch_sauber") {
            if (!E.flags.h2fire) return ["Ohne Feuer wird das Sushi."];
            E.swap("fisch_sauber", "fisch_gebraten"); E.time(20); return ["Barsch auf einen Stock und ab ins Feuer.", "Wer hätte gedacht, dass ich hier heute einen kleinen Barsch roste."];
          }
          if (item === "filterflasche_voll" && has("beeren")) {
            if (!E.flags.h2fire) return ["Für den Smoothie brauche ich Feuer."];
            if (!f.gestampft) return ["Die Blaubeeren müssen erst zermatscht werden. Auf einem flachen Stein?"];
            E.drop("beeren"); E.swap("filterflasche_voll", "smoothie"); E.time(15);
            return ["Zermatschte Blaubeeren ins Wasser, aufkochen …", "Ein heißer Blueberry-Shake. Fehlt nur die Vanille-Eiskugel."];
          }
          return ["Das verbrenne ich lieber nicht."];
        case "h2-kiefern":
          if (verb.look) return [E.hasGoal("lager") ? "Mein neues Zuhause." : "Zwei Kiefern, genau richtig für das Tarp."];
          if (verb.use) return [f.cord ? "Die Leine hängt. Tarp drüber." : "Erst eine Leine zwischen die Kiefern."];
          if (item === "paracord") { E.drop("paracord"); f.cord = true; E.show("h2-cord"); return ["Leine dran, Spannknoten. Hält."]; }
          if (item === "tarp") {
            if (!f.cord) return ["Ohne Leine hängt das Tarp nur rum."];
            E.drop("tarp"); E.show("h2-tarp"); E.hot("h2-tarp", true); E.goal("lager"); E.time(30);
            return ["Tarp drüber, solange es trocken ist.", "Mein neues Lager ist halb aufgeschlagen. Ich weiß noch nicht, ob der Platz gut ist. Aber er ist besser."];
          }
          if (item === "schlafsack") return E.hasGoal("lager") ? finish(E) : ["Erst das Tarp."];
          return;
        case "h2-tarp":
          if (verb.look) return ["Mein Tarp. Diesmal etwas höher und vorne geschlossener."];
          if (item === "schlafsack") return finish(E);
          return ["Später."];
        case "h2-birke":
          if (verb.look) return ["Schöne umgefallene Birke. Noch nicht verrottet. Guter Brennwert."];
          if (item === "messer") { if (has("rinde")) return ["Genug Rinde."]; E.add("rinde"); return ["Ein paar Streifen Birkenrinde. Brennt auch nass."]; }
          if (verb.use) return ["Mit der Hand krieg ich die Rinde nicht ab."];
          return;
        case "h2-holz":
          if (verb.look) return ["Ein altes Brett, irgendwer hat es über einen Stapel gelegt. Da gucken kleine Holzscheite raus."];
          if (verb.use) { if (has("holzscheite") || E.flags.h2fire) return ["Genug Holz."]; E.add("holzscheite"); E.time(10); return ["Brett hoch und … guck euch das an. Trockene Scheite. Das ist quasi mein Jackpot."]; }
          return;
        case "h2-stein":
          if (verb.look) return ["Ein flacher Stein. Taugt als Mörser."];
          if (item === "beeren") { if (f.gestampft) return ["Schon zermatscht."]; f.gestampft = true; return ["Blaubeeren auf den Stein und mit einem zweiten Stein zermatschen. Lila Hände inklusive."]; }
          return ["Liegt gut da."];
        case "h2-heidel":
          if (verb.look) return ["Überall Blaubeeren. Überfucking-all."];
          if (verb.use) { if (has("beeren")) return ["Ich hab eine Handvoll."]; E.add("beeren"); E.time(10); return ["Eine Handvoll. Und gleich noch eine in den Mund."]; }
          return;
        case "h2-ameisen":
          if (verb.look) return ["Ein Ameisenhaufen. Und da drin krabbelt was Grünes."];
          if (verb.use) { if (has("made") || f.made) return ["Ich hab schon eine Made."]; f.made = true; E.add("made"); E.learn("made"); return ["So, ihr Lieben, ich hab hier was gefunden: eine grüne Made.", "Die spieße ich auf und schmeiß sie ins Wasser."]; }
          return;

        // ----- Treffpunkt am Forstweg -----
        case "t-bank":
          if (verb.look) { return ["Eine alte Bank. Die ist auch schon komplett durch.", "Das hier wird der Treffpunkt. Ein alter Forstweg, Rettungsweg, hier holt Stefan uns irgendwann ab.", "f3-mittwoch"]; }
          if (verb.use) { E.stat("fourth", 8); E.time(15); return ["Hinsetzen. Kurz nachdenken.", "f3-aussicht"]; }
          if (item === "handy") {
            if (E.hasGoal("ok")) return ["Hab heute schon."];
            E.goal("ok"); return ["Hier oben am Forstweg ein Balken!", "OK und Standort an Stefan.", "S: 👍 Neuer Spot? Sieht gut aus."];
          }
          return;
        case "t-see": if (verb.look) { if (!f.lkw) { f.lkw = true; E.egg("lkw"); return ["Dieses Piepen … wie ein LKW, der rückwärts fährt.", "Und aus der Richtung ein lautes Krachen. Da finden wohl Holzarbeiten statt. Kein Elch also."]; } return ["Grau, aber schön."]; } return;
        case "t-holz": if (verb.look) return ["Frisch gefällte Stämme am Wegesrand. Nass wie alles hier."]; if (verb.use) return ["Viel zu schwer. Und nass."]; return;
        case "t-feuer": if (verb.look) return ["Eine Feuerstelle mit Steinring. Hier wird später gegrillt. Hoffentlich."]; return;

        // ----- Jonas -----
        case "j-leine":
          if (verb.look) return [E.hasGoal("leine") ? "Meine Wäscheleine. Die Klamotten trocknen langsam." : "Alles ist pitschnass. Hier zwischen den Bäumen wäre Platz für eine Wäscheleine."];
          if (item === "powercord") {
            if (E.hasGoal("leine")) return ["Hängt schon."];
            await E.lines(["Ich nutze einfach mein Seil. Um den Baum herum … und jetzt der Abspannknoten."]);
            const fails = await E.minigame("knoten", {});
            E.show("j-leinebild"); E.goal("leine"); E.learn("abspannknoten"); E.stat("fourth", 10);
            return [fails ? "Hab ein paar Anläufe gebraucht. Aber: Fertig ist die Wäscheleine." : "Seilreibung nutzen, Slipknoten. Fertig ist die Wäscheleine."];
          }
          if (verb.use) return ["Mit der bloßen Hand spannt sich keine Leine. Mein Powercord!"];
          return;
        case "j-plane":
          if (verb.look) return [E.hasGoal("tuer") ? "Mit Tür. Wie zwei der drei Heiligtümer des Todes." : "Mücken rein, Mücken raus. Die kommen durch den Haupteingang. Ich brauch eine Tür."];
          if (item === "kukri" && has("kienspan")) {
            if (has("spaene")) return ["Hab schon Späne."];
            E.drop("kienspan"); E.add("spaene"); E.learn("kienspan2"); E.stat("fourth", 15); E.time(30);
            return ["Zeitvertreib im Zelt: am Kienspan rumschnitzen.", "Die groben Späne und die feinen getrennt sammeln. Das brennt ganz geil."];
          }
          if (item === "zweige") {
            if (E.hasGoal("tuer")) return ["Die Tür steht."];
            E.drop("zweige"); E.show("j-tuer"); E.goal("tuer"); E.egg("tuer"); E.time(25);
            return ["Ein Dreieck als Rahmen, Fichtenzweige dran …", "Wie zwei der drei Heiligtümer des Todes. Für die Harry-Potter-Fans.", "Kein hundertprozentiger Schutz vor den Biestern. Aber ist schon mal was."];
          }
          if (item === "schlafsack") return finish(E);
          return;
        case "j-fichten":
          if (verb.use) { if (has("zweige") || E.hasGoal("tuer")) return ["Genug Zweige."]; E.add("zweige"); return ["Ein Armvoll Fichtenzweige abgemacht."]; }
          if (verb.look) return ["Meine zwei Fichten. Halten die Plane wie eine Eins."];
          return;
        case "j-wurzel":
          if (item === "kukri") { if (has("kienspan")) return ["Hab genug Kienspan."]; E.add("kienspan"); return ["Noch ein Stück vom Gold des Waldes."]; }
          return;
        case "j-totholz":
          if (item === "kukri") {
            if (has("rohling") || E.hasGoal("loeffel")) return ["Mehr Löffel brauch ich nicht."];
            E.add("rohling"); E.time(20); return ["Ein Stück festes Holz, grob in Löffelform gehackt. Jetzt fehlt die Mulde. Die brenne ich rein."];
          }
          if (verb.look) return ["Gutes festes Holz. Für einen Löffel?"];
          return;
        case "j-ueberhang":
          if (verb.look) return ["Mein Meldepunkt da oben. Und auf dem Weg dahin lag doch diese Holzscheibe."];
          if (verb.use) {
            if (f.scheibe) return ["Ganz nach oben … und wieder runter."];
            f.scheibe = true; E.add("holzscheibe"); E.time(30);
            await E.encounter(ELCH);
            return ["Auf dem Rückweg: die Holzscheibe von der Baumfällung. Die nehme ich mit."];
          }
          if (item === "handy") {
            if (f.okJ) return ["Hab heute schon Bescheid gegeben."];
            f.okJ = true; return ["Oben am Meldepunkt: OK an Stefan.", "S: 👍"];
          }
          return;
        case "j-wiese":
          if (verb.look) return ["Hier hüpfen die kleinen Hüpfer rum. Heuschrecken!"];
          if (verb.use) {
            if (has("heuschrecken")) return ["Ich hab genug Proteinkollegen."];
            const n = await E.minigame("heuschrecken", { n: 6, time: 22 });
            if (n < 6) E.egg("neun");
            if (n <= 0) return ["Keine einzige. Mit Kamera ist das echt nicht einfach."];
            E.add("heuschrecken");
            return n < 6 ? ["f3-neun", `Na gut, ${n} Stück. Reicht für heute.`] : ["Sechs Heuschrecken. Heute gibt's Heuschrecken mit Erdbeeren."];
          }
          return;
        case "j-beeren":
          if (verb.use) { if (has("erdbeeren")) return ["Hab schon welche."]; E.add("erdbeeren"); return ["Ich hab die Stelle mit den Walderdbeeren wiedergefunden. Zack, zack, zack."]; }
          return;
        case "j-see":
          if (item === "metallflasche") { E.swap("metallflasche", "metallflasche_voll"); return ["Kanne voll."]; }
          return;
        case "j-ueberhang-see":
          if (verb.look) {
            if (f.wetterSeen) { E.egg("wetter"); return ["f3-wetter"]; }
            f.wetterSeen = true; return ["Der Himmel überlegt noch, was er heute will."];
          }
          return;
        case "j-feuer":
          if (verb.look) return [E.hasGoal("feuer") ? "Mein Schwedenfeuer. Kontrollierbar, effizient, die Kanne steht sicher." : "Die Steine liegen noch. Gestern hat es hier gebrannt. Heute will ich was Kleineres, Kontrollierbareres."];
          if (item === "viertel") {
            if (f.schwedenBuilt) return ["Steht schon."];
            const ok = await E.minigame("schwedenfeuer");
            if (!ok) return ["Später nochmal puzzeln."];
            f.schwedenBuilt = true; E.drop("viertel"); E.learn("schwedenfeuer"); E.show("j-schweden");
            return ["Jetzt kann hier ein leichtes Feuer rauskommen. Und oben drauf passt die Kanne."];
          }
          if (item === "holzscheibe") return ["Die muss erst gespalten werden. Mit dem Kukri."];
          if (item === "feuerstahl") {
            if (E.hasGoal("feuer")) return ["Brennt schon."];
            if (!f.schwedenBuilt) return ["Erst das Schwedenfeuer bauen. Dafür brauche ich die Holzscheibe."];
            if (!has("spaene") && !has("kienspan")) return ["Ich brauche Anzündmaterial. Kienspan-Späne wären ideal."];
            const ok = await E.encounter(SPAENE);
            if (!ok) return [];
            E.drop(has("spaene") ? "spaene" : "kienspan"); E.goal("feuer"); E.show("j-fire"); E.fire("jonas-see"); E.time(30);
            return ["Ah, brennt noch gut.", "f3-schwedenfeuer"];
          }
          if (["metallflasche_voll", "erdbeeren", "heuschrecken"].includes(item)) {
            if (!E.hasGoal("feuer")) return ["Erst Feuer."];
            if (!has("metallflasche_voll")) return ["Ich brauche Wasser in der Kanne."];
            if (!has("erdbeeren") || !has("heuschrecken")) return ["Heute gibt's Heuschrecken mit Erdbeeren. Mir fehlt noch was davon."];
            E.drop("erdbeeren"); E.drop("heuschrecken");
            await E.lines(["Fischis zermatschen … also Heuschrecken. Erdbeer-Bombe. Rein in die Kanne, ab aufs Feuer."]);
            await E.encounter(KANNE);
            return [];
          }
          if (item === "rohling") {
            if (!E.hasGoal("feuer")) return ["Für die Glut brauche ich ein Feuer."];
            if (!has("kienspan")) return ["Ich brauche ein dickes Stück Kienspan als Kohlebrikett."];
            await E.lines(["Ein Stück Kienspan abbrechen, glühen lassen, auf den Löffel legen …"]);
            const good = await E.minigame("loeffel");
            E.drop("rohling"); E.drop("kienspan"); E.add("loeffel"); E.persist("loeffel"); E.goal("loeffel"); E.learn("loeffel"); E.time(60);
            return [good ? "f3-loeffel" : "Ein paar feine Risse, aber er ist dicht. Ich bin trotzdem stolz.", "Damit gibt's gleich Suppe."];
          }
          return;
      }
    },

    combine(a, b, E) {
      const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
      if (pair("kukri", "holzscheibe")) { E.swap("holzscheibe", "viertel"); E.time(20); return ["Viertelstücke machen, die Spitzen abhacken. Jetzt hab ich diese Form."]; }
      if (pair("angelset", "made")) { E.drop("made"); E.swap("angelset", "angel_bereit"); return ["Made auf den Haken. Grüne Maden, die mag ich."]; }
      if (pair("messer", "fisch")) { E.swap("fisch", "fisch_sauber"); return ["Ausnehmen. Fertig."]; }
      if (pair("kukri", "powercord")) return ["Heute brauche ich keine Anzündwolle. Heute schaffe ich es ohne das rote Zeug."];
    },

    timed(E) {
      const h = E.h;
      if (E.active === "jonas" && !h.warned.zecke && h.clock > 12 * 60) { h.warned.zecke = true; E.encounter(ZECKE2); }
      if (E.active === "jonas" && !h.warned.unfall && h.clock > 15 * 60) { h.warned.unfall = true; E.encounter(UNFALL); }
      if (E.active === "hannes" && !h.warned.bremsen && h.clock > 12 * 60 && E.weather() === "sonne") { h.warned.bremsen = true; E.encounter(BREMSEN); }
    },

    hint(E) {
      const h = E.h, has = E.has, f = h.flags;
      if (E.active === "hannes") {
        if (!E.hasGoal("abbau")) return "Erst das Tarp abbauen. Dann ziehe ich links am Ufer entlang um den See.";
        if (h.room === "hannes-ufer" || h.room === "hannes-lager") return "Links am Ufer geht's um den See. Da hinten ist es besser.";
        if (!E.hasGoal("lager")) return f.cord ? "Jetzt das Tarp über die Leine." : "Die zwei Kiefern in der Mitte. Paracord dazwischen.";
        if (!E.hasGoal("fisch")) {
          if (has("fisch_gebraten")) return "Den Barsch essen! Auf mich anwenden.";
          if (has("fisch_sauber")) return E.flags.h2fire ? "Barsch aufs Feuer auf der Granitplatte." : "Für den Barsch brauche ich Feuer: Scheite unterm alten Brett, Rinde von der Birke, Feuerstahl auf die Granitplatte.";
          if (has("fisch")) return "Erst ausnehmen. Messer und Barsch kombinieren.";
          if (has("angel_bereit")) return "Angel mit Made von der Granitplatte oder am See auswerfen.";
          if (has("made")) return "Made und Angelset kombinieren.";
          return "Ein Köder muss her. Beim Ameisenhaufen vorne links krabbelt was Grünes.";
        }
        if (!E.hasGoal("ok")) return "Hier unten kein Empfang. Rechts geht's zum Forstweg, vielleicht da?";
        return "Alles erledigt. Schlafsack unters Tarp.";
      }
      if (!E.hasGoal("leine")) return "Meine Klamotten sind pitschnass. Eine Wäscheleine aus dem Powercord, zwischen den Bäumen in der Mitte.";
      if (!E.hasGoal("tuer")) return has("zweige") ? "Die Zweige an der Plane zu einer Tür machen." : "Gegen die Mücken: eine Tür aus Fichtenzweigen. Zweige gibt's an den Fichten.";
      if (!E.hasGoal("feuer")) {
        if (!has("holzscheibe") && !has("viertel") && !f.schwedenBuilt) return "Auf dem Weg zum Meldepunkt, beim Felsvorsprung, lag diese Holzscheibe.";
        if (has("holzscheibe")) return "Die Holzscheibe mit dem Kukri vierteln.";
        if (!f.schwedenBuilt) return "Die Viertel unten am See auf die Steine setzen. Ein Schwedenfeuer.";
        if (!has("spaene") && !has("kienspan")) return "Kienspan aus dem Wurzelteller, dann im Zelt mit dem Kukri Späne schnitzen.";
        return "Feuerstahl aufs Schwedenfeuer.";
      }
      if (!E.hasGoal("essen")) {
        if (!has("heuschrecken")) return "Heuschrecken fangen im Gras rechts vorne.";
        if (!has("erdbeeren")) return "Walderdbeeren bei den roten Beeren links.";
        if (!has("metallflasche_voll")) return "Wasser in die Kanne, am See.";
        return "Alles in die Kanne und aufs Feuer.";
      }
      if (!E.hasGoal("loeffel")) {
        if (!has("rohling")) return "Ein Löffel! Mit dem Kukri ein Stück vom abgestorbenen Baum links.";
        if (!has("kienspan")) return "Für die Glut brauche ich ein dickes Stück Kienspan aus dem Wurzelteller.";
        return "Den Rohling am Feuer mit Glut ausbrennen.";
      }
      return "Alles erledigt. Schlafsack unter die Plane.";
    },
    sleepHint: (E) => (E.active === "hannes" ? "Alles erledigt. Schlafsack unters Tarp." : "Alles erledigt. Ab unter die Plane."),
    halfText: (o) => (o === "jonas" ? "Jonas ist noch mitten in seinen Projekten." : "Hannes ist noch unterwegs um den See."),

    async enter(room, E) {
      if (room === "hannes-neu" && !E.flags.weg) {
        E.flags.weg = true; E.time(200);
        return ["Drei bis vier Stunden um den See …", "Eine Fußspur im Matsch. Elch? Keine Ahnung.", "Und überall Blaubeeren. Überfucking-all.", "Also. Hier ist mein neuer Spot."];
      }
      if (room === "treffpunkt" && !E.flags.tpSeen) { E.flags.tpSeen = true; return ["Ein alter Forstweg. Und eine Feuerstelle mit Bank. Interessant."]; }
    },

    async night(E) {
      await E.lines([{ narr: "t2e" }]);
      await E.lines(["J: Ich habe nur eine Mücke drin. Und die werde ich einfach nicht los. Good night."]);
    }
  };

  async function finish(E) {
    const goals = E.active === "hannes" ? [["lager", "ein Dach"], ["fisch", "was Richtiges im Bauch"], ["ok", "das OK an Stefan"]] : [["leine", "die Wäscheleine"], ["feuer", "das Schwedenfeuer"], ["essen", "was zu essen"], ["loeffel", "den Löffel"], ["tuer", "die Tür"]];
    const miss = goals.filter(([k]) => !E.hasGoal(k)).map(([, l]) => l);
    if (miss.length) return [`Noch nicht. Mir fehlt noch ${miss.length > 1 ? miss.slice(0, -1).join(", ") + " und " + miss[miss.length - 1] : miss[0]}.`];
    E.drop("schlafsack");
    await E.lines([E.active === "hannes" ? "Ein Tag mit Smoothie, Barsch und Bad. Die Tage sind ultralang. Jetzt nutze ich den Cheatcode: Schlafen." : "Die Mücken sind die abgefucktesten Jagdtiere. Ich hoffe, die Tür hilft."]);
    E.sleep();
    return [];
  }

  // Barsch Nummer eins: echtes Anschlagen statt Auswahl
  // Wirkt nach: Ein Barsch beim ersten Wurf hebt Hannes' Stimmung an Tag 3
  async function angeln(E) {
    E.time(15); E.swap("angel_bereit", "angelset");
    const first = !E.flags.angelVersuch; E.flags.angelVersuch = true;
    if (await E.minigame("angeln", { title: "Made am Haken", win: "Zwei Minuten nach dem Wurf … jetzt! Anschlagen!" })) { E.add("fisch"); if (first) E.persist("barsch1"); else E.unpersist("barsch1"); return ["f3-barsch"]; }
    E.unpersist("barsch1");
    E.h.flags.made = false; return ["Made weg. Beim Ameisenhaufen gibt's neue."];
  }
  const ELCH = { title: "Lautes Knacken", text: "Am Meldepunkt kracht es unten im Wald. Dumpfe Geräusche, als würden zwei Elche ihre Geweihe aneinanderschlagen.", opts: [
    { label: "Lauter reden, damit der Elch ausweicht", go: () => ["J: Hallo Elch! Ich bin's nur! … Er geht mir aus dem Weg. Gut so."] },
    { label: "Ruhig zur Seite gehen und ihn passieren lassen", go: () => ["J: Ganz ruhig, langsam auf die Seite. Nichts zu sehen. Aber es hat geknallt."] },
    { label: "Kukri ziehen", go: (E) => { E.stat("fourth", -5); return ["J: Gibt's heute Abend Elch. … Wär aber ein Großfeuer.", "J: Na gut, steck ich wieder ein."]; } }
  ] };
  const SPAENE = { title: "Anzünden", text: "Das Schwedenfeuer steht, die Kanne wartet. Wie legst du die Späne rein?", opts: [
    { label: "Alle Späne auf einmal reinstopfen", value: false, go: (E) => { E.time(15); return ["Das war erstmal nichts. Zu viele Späne, das Feuer erstickt.", "Nochmal. Da unten soll es brennen."]; } },
    { label: "Erst die feinen Späne, dann die groben nachlegen", value: true, go: () => ["Erst die feinen, dann die groben, von oben Gestrüpp nachschieben …"] }
  ] };
  const KANNE = { title: "Die Kanne kocht", text: "Es dampft. Gleich kocht es über. Was machst du mit dem Deckel?", opts: [
    { label: "Deckel ganz zuschrauben", go: (E) => { E.goal("essen"); E.stat("hunger", 30); E.stat("fourth", 10); return ["J: Lieber nicht, sonst Überdruck. Also doch halb drauf … und festhalten.", "J: Kann sich sehen lassen. Fehlt nur Zucker und eine Vanille-Eiskugel."]; } },
    { label: "Deckel halb drauf und festhalten", go: (E) => { E.goal("essen"); E.stat("hunger", 35); E.stat("fourth", 12); return ["J: Sicher abstellen. Bleib sicher stehen, bitte.", "J: Unser Smoothie gefällt uns. Mögen wir."]; } },
    { label: "Deckel halb drauf und schnell abnehmen", go: (E) => { E.goal("essen"); E.stat("hunger", 15); E.stat("fourth", -10); return ["J: Was für ein Fail. Die Flasche fällt mir aus der Hand.", "J: Da liegt die ganze Erdbeer-Heuschrecken-Scheiße. Ich ess das jetzt vom Boden. Schmeckt noch nach Erdbeeren.", "J: Hose auch nass. Absoluter Fail."]; } }
  ] };
  const ZECKE2 = { title: "Zecke!", text: "Jonas entdeckt eine Zecke auf seiner Hand.", opts: [
    { label: "Wegflitschen", go: (E) => { E.stat("fourth", -6); return ["J: Weg damit. … Die liegt jetzt irgendwo im Umkreis von einem Meter und krabbelt heute Nacht zurück. Hätte ich sie mal kaputt gemacht."]; } },
    { label: "Zwischen zwei Fingernägeln zerdrücken", go: () => ["J: Knack. Erledigt. Danach einmal komplett nach Zecken absuchen."] }
  ] };
  const UNFALL = { title: "Ein Pups mit Folgen", text: "Jonas will beim Wäscheabhängen nur kurz etwas Luft ablassen. Es ist nicht nur Luft.", opts: [
    { label: "In den See springen und gleich Wäsche waschen", go: (E) => { E.egg("unfall"); E.stat("fourth", 15); return ["J: Zum Glück nur in die Unterhose. Ich opfere mein T-Shirt.", "J: … Das war echt erfrischend. Ich bin fast froh, dass ich mir in die Hose gekackt habe.", "J: Was lernen wir daraus? Kiefernnadeln gut, gut, gut kauen."]; } },
    { label: "Ignorieren und weitermachen", go: (E) => { E.egg("unfall"); E.stat("fourth", -20); return ["J: Nein. Einfach nein. Das geht so nicht weiter."]; } }
  ] };
  const BREMSEN = { title: "Bremsen!", text: "Die Sonne ist da, und mit ihr die Bremsen. Sie umschwirren Hannes am Feuer.", opts: [
    { label: "Ins Wasser flüchten", go: (E) => { E.stat("fourth", 8); return ["H: Ab in den See. Die Bremsen bleiben draußen. Erfrischend!"] ; } },
    { label: "Rauch machen", go: () => ["H: Feuer qualmen lassen. Mücken mögen den Rauch nicht, Bremsen auch nicht so."] },
    { label: "Totschlagen", go: (E) => { E.hurt(4); return ["H: Eine erwischt. Drei haben mich erwischt."]; } }
  ] };

  // Barsch essen hakt das Ziel ab
  const origSelf = def.self;
  def.self = (verb, item, E) => {
    if (item === "fisch_gebraten" && E.active === "hannes") { E.drop("fisch_gebraten"); E.stat("hunger", 55); E.stat("fourth", 15); E.goal("fisch"); return ["Oh Gott, ist das knusprig.", "Geiler Fisch, Leute. Geiler Fisch."]; }
    return origSelf ? origSelf(verb, item, E) : undefined;
  };
  Ausgesetzt.day(2, def);
  window.TAG2 = { rooms: def.rooms };
})();
