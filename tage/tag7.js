// Tag 7 (Folge 8): Freitag und Samstagmorgen. Letzter Spot, Himbeeren, Wobbler, Zecken. Nachts die OP, morgens das rote Haus.
(function () {
  const c = (file, text, who, folge, t) => ({ file, text, who, folge, t });
  const R6 = window.TAG6.rooms;
  const ext = (room, hot, extra) => Object.assign({}, room, extra || {}, { hot: Object.assign({}, room.hot, hot || {}) });

  const def = {
    title: "Das rote Haus", weekday: "Freitag", folge: "8", clock: 5 * 60 + 40, fourth: "stamina", together: true, first: "jonas",
    intro: "Willkommen zum letzten Tag. Noch ein kurzes Stück, dann ein letzter Lagerplatz nah bei Stefan. Und morgen früh: das rote Haus.",
    outro: "Sieben Tage und zwei Männer, kein Wiederholungsbedarf. Aber keiner von beiden würde diese Woche je missen wollen.",
    weather: (t) => (t < 8 * 60 ? "sonne" : t < 18 * 60 ? "hitze" : t < 21.5 * 60 ? "sonne" : "nacht"),
    chars: {
      hannes: { room: "steg6", start: [900, 900], stats: { thirst: 55, hunger: 40, fourth: 55 },
        inv: ["messer", "feuerstahl", "filterflasche", "angelset", "schlafsack", "handy", "karte", "tarp", "paracord"] },
      jonas: { room: "steg6", start: [640, 920], stats: { thirst: 55, hunger: 40, fourth: 60 },
        inv: ["kukri", "feuerstahl", "metallflasche", "powercord", "schlafsack", "handy", "plane", "loeffel"] }
    },
    goals: { team: [["aufbruch", "Aufbrechen"], ["spot", "Letzten Spot finden"], ["himbeeren", "Himbeeren für Hannes"], ["feuer", "Letztes Feuer"], ["leine", "Abspannknoten ohne Hilfe"]] },
    items: {
      himbeeren: { name: "Himbeer-Erdbeer-Potpourri", desc: "Jede Himbeere kontrolliert. Die mit Maden hat Jonas selbst gegessen." },
      wobbler: { name: "Wobbler", desc: "Ein Kunstköder aus dem Schilf. Mit krassem Doppelhaken." },
      angel_wobbler: { name: "Angel mit Wobbler", desc: "Damit hole ich uns einen dicken Hecht raus." },
      feuerholz: { name: "Feuerholz", desc: "Nicht schwer. Aber die Erschöpfung kickt rein." }
    },
    // Der letzte Abend unter freiem Himmel
    campfire: {
      team: [{ label: "Worüber wir beim Laufen reden", lines: ["lf-7j-reden"] }, { label: "Nur mit dem Nötigsten unterwegs", lines: ["lf-7j-flucht"] }, { label: "Was hast du heute gemacht, Hannes?", lines: ["lf-7h-gelegen"] }]
    },
    clips: {
      "lf-7j-reden": c("ton/lf-7j-reden.wav", "Ich glaube, morgens losgehen ist eine gute Idee. Viel angenehmer. Die Sonne ist zwar schon am Start, aber es ist viel frischer. Gestern haben wir uns richtig viel unterhalten, weil wir Zeit hatten. Beim Gehen denkt man viel nach, kommt auf Ideen. Wir haben uns über ETFs unterhalten, über Großeltern, über alles Mögliche. War nochmal interessant, ein bisschen rumphilosophiert.", "jonas", 8, 305),
      "lf-7j-flucht": c("ton/lf-7j-flucht.wav", "Ich muss immer wieder daran denken: Wir machen das jetzt ein paar Tage, mit wenig Essen, mit dem Nötigsten, einfach nur auf Achse. Und es gibt Menschen, die flüchten zwei, drei Jahre, von Syrien bis nach Europa, und machen das jeden Tag. Müssen gucken, wie sie was zu essen haben. Haben nur das Nötigste dabei, wahrscheinlich in ein Tuch gewickelt. Und wir sind schon nach einer Woche fix und fertig und fühlen uns wie Helden.", "jonas", 8, 634),
      "lf-7h-gelegen": c("ton/lf-7h-gelegen.wav", "– Was hast du heute sonst so gemacht, Hannes? – Das Gleiche. Feuer. Tee. Ich hab hier gelegen und gelegen. Wir haben erzählt und gelegen. – Schlafen und gelegen? – Ja, wir haben geschlafen und gelegen. … Dafür hat Jonas andere schöne Sachen. Jonas ist heute auf jeden Fall aktiver als ich. Aber das Energielevel ist einfach zu low, Leute.", "hannes", 8, 1740),
      "f8-protein": c("ton/f8-protein.wav", "Ich würde jetzt sagen: extra Proteine. Bonus.", "jonas", 8, 1513),
      "f8-knoten": c("ton/f8-knoten.wav", "Ich hasse Knoten. Die Scheiße verheddert sich ständig.", "jonas", 8, 1696),
      "f8-wobbler": c("ton/f8-wobbler.wav", "Ich werde einen Hecht fangen. Ich habe hier eben im Schilf einen Wobbler gefunden. Damit hole ich uns einen dicken Hecht raus.", "jonas", 8, 1708),
      "f8-grandcanyon": c("ton/f8-grandcanyon.wav", "Kurze Zeitinfo: Heute Nacht um vier gab es eine kleine Operation. Jonas war Doktor. Ich hatte eine Zecke am Arsch, die Jonas morgens um vier rausoperieren durfte. Das war wunderschön. Danke für diesen Intimmoment. – Das war schön, einmal in den Grand Canyon zu fahren.", "hannes", 8, 2151),
      "f8-frieden": c("ton/f8-frieden.wav", "Hey, hey, wir kommen in Frieden. Aber wir haben Hunger.", "hannes", 8, 2191),
      "f8-lastmarch": c("ton/f8-lastmarch.wav", "Alexa, spiele The Last March of the Ents.", "jonas", 8, 2260),
      "f8-rotes-haus": c("ton/f8-rotes-haus.wav", "Ich kenne das rote Haus von Stefan. Da müssen wir hin. Dann haben wir es geschafft.", "hannes", 8, 2326),
      "f8-abenteuer": c("ton/f8-abenteuer.wav", "Für uns war es auf jeden Fall das härteste Abenteuer, was wir je gemacht haben. Gelitten bis zum Geht-nicht-mehr, aber es war geil. Kein Wiederholungsbedarf, aber super froh, es gemacht zu haben.", "hannes", 8, 2344),
      "f8-ueberlebt": c("ton/f8-ueberlebt.wav", "Überlebt.", "jonas", 8, 2424),
      "f8-medikit": c("ton/f8-medikit.wav", "Einfach ein gutes Gefühl. Und hier, mein Medikit: noch versiegelt. Ich habe es nicht gebraucht.", "jonas", 8, 2472)
    },
    narr: {
      t7: { file: "ton/erzaehler/damien-black/erzaehler-701.wav", text: "Tag sieben. Der letzte Tag. Die Kraft ist fast aufgebraucht, aber das Ziel ist nah." },
      t7n: { file: "ton/erzaehler/damien-black/erzaehler-702.wav", text: "Es ist vier Uhr morgens. Manche Freundschaften werden nie auf die Probe gestellt." },
      t7e: { file: "ton/erzaehler/damien-black/erzaehler-703.wav", text: "Sieben Tage und zwei Männer, kein Wiederholungsbedarf. Aber keiner von beiden würde diese Woche je missen wollen." }
    },
    journal: {
      fuchsbandwurm: { title: "Mythos Fuchsbandwurm", text: "Es gibt keinen belegten Fall, in dem sich ein Mensch über Beeren angesteckt hat. Die Fälle kommen meist über Hunde, die Fuchskot gefressen haben." },
      steinpilz: { title: "Steinpilz oder nicht?", text: "Unter den Hut schauen: Der Steinpilz hat Röhren, keine Lamellen. Lamellen heißt: Verwechslungsgefahr, Finger weg." },
      kaltbaden: { title: "Kaltbaden", text: "Kalt baden oder duschen ist wie ein Kaffeeersatz. Nur kurz kalt, danach fühlt man sich tausendmal fitter." },
      zecke: { title: "Zecken entfernen", text: "Mit der Pinzette direkt an der Haut greifen und ganz langsam, gleichmäßig herausziehen. Nicht drehen, nicht ruckeln, sonst bleibt der Kopf stecken." }
    },
    eggs: { kacken: "Das Kackabenteuer", fund: "Skateboard-Shirt und Slip", protein: "Extra Proteine", hecht: "Der Hecht, der nicht kam", frieden: "Wir kommen in Frieden", sack: "Zecke am Sack", lastmarch: "The Last March", medikit: "Das versiegelte Medikit", steinpilz: "Kein Steinpilz" },
    looks: { "st-see": "Der Steg-See. Gleich geht's weiter.", "st-schild": "Das alte Schild." },

    rooms: {
      steg6: ext(R6["steg6"], {
        "exit-weiter": { name: "Weiter Richtung Stefan", stand: [90, 920], face: 0, poly: "M0,800 L90,800 L90,1080 L0,1080 Z",
          exit: { to: "steg7", spawn: [1700, 960], dir: -1, need: (E) => (E.hasGoal("aufbruch") ? null : ["Erst den Sonnenschutz abbauen."]) } }
      }),
      steg7: {
        where: "Der letzte Spot", bg: "bg/steg7.jpg",
        walk: [[0, 800], [400, 770], [800, 730], [1250, 770], [1450, 830], [1920, 900], [1920, 1060], [0, 1060]],
        center: [900, 900], y0: 700, s0: 0.55, s1: 0.95,
        overlays: `<g id="s7-fire" opacity="0" pointer-events="none"><circle cx="860" cy="830" r="250" fill="url(#glow)"/><use href="#flames" transform="translate(860 860) scale(1.2)"/></g>
          <g id="s7-leinebild" opacity="0" pointer-events="none"><linearGradient id="shirt7" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a5a74"/><stop offset="1" stop-color="#1e2634"/></linearGradient><linearGradient id="slip7" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a4a44"/><stop offset="1" stop-color="#3e1e1a"/></linearGradient><path d="M60,520 Q300,560 600,500" stroke="#1c1e20" stroke-width="5" fill="none"/><path d="M60,520 Q300,560 600,500" stroke="#7a7e70" stroke-width="2" fill="none"/><path d="M178,538 L206,534 L226,538 L246,552 L238,566 L228,560 L228,606 L184,606 L184,560 L172,566 L164,552 Z" fill="url(#shirt7)" stroke="#12161e" stroke-width="2" stroke-linejoin="round"/><circle cx="206" cy="574" r="7" fill="none" stroke="#d8d0b0" stroke-width="2" opacity="0.7"/><path d="M196,590 q10,4 20,0" stroke="#12161e" stroke-width="1.6" fill="none" opacity="0.6"/><path d="M346,546 L386,544 L384,560 Q372,566 366,580 Q358,566 348,562 Z" fill="url(#slip7)" stroke="#1e0e0c" stroke-width="2" stroke-linejoin="round"/><g fill="#2a2620"><rect x="186" y="533" width="4" height="9"/><rect x="220" y="535" width="4" height="9"/><rect x="352" y="541" width="4" height="9"/><rect x="376" y="540" width="4" height="9"/></g></g>
          <g pointer-events="none"><path d="M1010,1010 q20,-30 40,0 z" fill="#8a5a2a" stroke="#3a2614" stroke-width="2"/><rect x="1024" y="1008" width="12" height="22" fill="#e6d8b8"/></g>`,
        hot: {
          "s7-feuer": { name: "Feuerstelle", stand: [1100, 900], face: 860, poly: "M660,760 L1060,760 L1060,920 L660,920 Z" },
          "s7-sitz": { name: "Sitzstein", stand: [1060, 800], face: 1060, sit: [945, 772, 1], sit2: [1170, 776, -1], poly: "M870,540 L1280,540 L1280,750 L870,750 Z" },
          "s7-liege": { name: "Liegestein", stand: [1400, 860], face: 1450, poly: "M1290,530 L1700,530 L1700,800 L1290,800 Z" },
          "s7-himbeeren": { name: "Himbeerbüsche", stand: [1500, 960], face: 1650, poly: "M1440,820 L1920,830 L1920,1000 L1440,1000 Z" },
          "s7-steg": { name: "Kleiner Steg", stand: [480, 800], face: 300, poly: "M120,640 L480,640 L480,780 L120,780 Z" },
          "s7-baum": { name: "Umgestürzter Baum am Wasser", stand: [600, 780], face: 500, poly: "M60,480 L900,480 L900,620 L60,620 Z" },
          "s7-schilf": { name: "Schilf", stand: [200, 840], face: 60, poly: "M0,560 L110,560 L110,780 L0,780 Z" },
          "s7-pilz": { name: "Pilz", stand: [1100, 990], face: 1030, poly: "M995,975 L1065,975 L1065,1035 L995,1035 Z" }
        }
      },
      "rotes-haus": {
        where: "Stefans rotes Haus", bg: "bg/rotes-haus.jpg",
        walk: [[200, 760], [1000, 700], [1400, 570], [1560, 530], [1700, 570], [1920, 700], [1920, 1060], [200, 1060]],
        center: [1000, 900], y0: 520, s0: 0.42, s1: 0.95,
        hot: {
          "rh-haus": { name: "Das rote Haus", stand: [1540, 560], face: 1560, poly: "M1240,200 L1860,200 L1860,520 L1240,520 Z" },
          "rh-zaun": { name: "Alter Zaun", stand: [700, 760], face: 700, poly: "M300,520 L1220,520 L1220,620 L300,620 Z" }
        }
      }
    },

    // Folgen von Tag 5 und 6
    carry(E) {
      const n = [];
      if (E.persisted("hufeisen")) n.push("Das Hufeisen ist noch dabei. Vielleicht hilft das Glück heute Nacht bei einer ruhigen Hand.");
      if (E.persisted("diavolo")) n.push("Hannes hat die Pizza-Wette verloren. Jonas wird ihn daran erinnern.");
      return n;
    },
    setup(E) { E.show("st-schatten"); },
    async start(E) { await E.lines([{ narr: "t7" }, "H: Guten Morgen zusammen. Willkommen zum letzten Tag!", "J: Yay."]); },

    async act(key, verb, item, E) {
      const has = E.has, f = E.flags;
      switch (key) {
        case "st-see":
          if (item === "filterflasche") { E.swap("filterflasche", "filterflasche_voll"); return ["Flasche voll für den Marsch. Heute wird's wieder heiß."]; }
          return;
        case "st-baeume":
          if (verb.use) { if (E.hasGoal("aufbruch")) return []; E.hide("st-schatten"); E.goal("aufbruch"); E.time(20); return ["Fertig gepackt. Wofi, letzter Tag, letzte Etappe. Auf geht's."]; }
          return;
        case "s7-feuer":
          if (verb.look) return [E.hasGoal("feuer") ? "Unser letztes Feuerchen." : "Hier ist sogar eine Feuerstelle."];
          if (item === "feuerstahl") {
            if (E.hasGoal("feuer")) return ["Brennt."];
            if (!has("feuerholz")) return ["Erst Feuerholz holen. Am umgestürzten Baum liegt was."];
            if (!(await E.minigame("feuer", { title: "Das letzte Feuer" }))) E.time(15);
            E.drop("feuerholz"); E.goal("feuer"); E.show("s7-fire"); E.fire("steg7"); E.time(20);
            return ["Ich hör schon was knistern.", "Feuer, damit wir es warm um den Bauch haben. Für die letzten Stunden."];
          }
          if (item === "metallflasche_voll") { if (!E.hasGoal("feuer")) return ["Erst Feuer, dann abkochen."]; E.swap("metallflasche_voll", "metallflasche_ok"); E.time(15); return ["Kanne ins Feuer. Abgekocht."]; }
          return;
        case "s7-sitz": if (verb.look) return ["Die bequemsten Steine der Welt. Schaut euch diesen Sitzstein an."]; if (verb.use) { E.stat("fourth", 20); E.time(20); return ["Herrlich. Der war echt bequem."]; } return;
        case "s7-liege": if (verb.look) return ["Und dahinten ein krasser Liegestein."]; if (verb.use) { E.stat("fourth", 30); E.time(40); return ["Beste Bauchlage. Wir haben nur noch gelegen und gelegen.", "Aber geht natürlich nichts gegen die Isomatte."]; } return;
        case "s7-himbeeren":
          if (verb.look) return ["Himbeeren! Vielleicht sogar zwei, die man essen könnte. Riecht so geil nach Honig."];
          if (verb.use) {
            if (has("himbeeren") || E.hasGoal("himbeeren")) return ["Leer gepflückt."];
            // Die Himbeeren sind Jonas' Geschenk an Hannes: pflücken kann nur Jonas
            if (E.active === "hannes") return ["H: Die pflückt Jonas. Er hat mir eine Überraschung versprochen."];
            const r = await E.minigame("himbeeren");
            E.learn("fuchsbandwurm");
            if (r && r.maden) E.egg("protein");
            if (!r || r.good < 3) return ["Zu wenig. Nochmal pflücken."];
            E.add("himbeeren"); E.stat("hunger", (r.maden || 0) * 5);
            return [r.maden ? "f8-protein" : "Alle ohne Maden. Perfekt.", "Übrigens, der Mythos Fuchsbandwurm: Über Beeren hat sich noch nie jemand angesteckt. Das kommt über Hunde."];
          }
          return;
        case "s7-steg":
          if (verb.look) return ["Ein kleiner Steg. Hier kann man angeln, und man kann sich den Arsch waschen."];
          if (verb.use) { E.learn("kaltbaden"); E.stat("fourth", 30); E.time(20); return ["Kaltbaden ist echt ein Kaffeeersatz. Ich könnte jetzt wieder loswandern."]; }
          if (item === "filterflasche") { E.swap("filterflasche", "filterflasche_voll"); E.time(5); return ["Flasche vom Steg aus füllen. Filter drauf."]; }
          if (item === "metallflasche") { E.swap("metallflasche", "metallflasche_voll"); return ["Kanne voll. Am Feuer abkochen."]; }
          if (item === "angel_wobbler") {
            if (f.hecht) return ["Kein Hecht."];
            f.hecht = true;
            await E.lines(["Das Paracord ist zu schwer dafür. Ich muss die andere Angelschnur nehmen …"]);
            await E.minigame("angeln", { noBite: true, title: "Wobbler-Schwimm-Versuch", lose: "Nichts. Kein Hecht." });
            E.egg("hecht"); E.time(40);
            return ["Ganz vergessen: Hechte beißen erst abends."];
          }
          return;
        case "s7-baum":
          if (verb.look) return ["Ein umgestürzter Baum am Wasser. Und drumherum jede Menge totes Holz."];
          if (verb.use) {
            if (!f.kacken) { f.kacken = true; E.egg("kacken"); E.learn("steinpilz"); E.time(20); return ["H: Ich mach jetzt meinen Kackabenteuer. Die Kacke, die ich mir seit zwei Tagen aufhebe.", "H: Ich sitz hier auf dem Baum. Das müsste eigentlich so gehen. Ab die Wurst.", "H: Ein dicker schwarzer Haufen. Ich hatte nur Blaubeeren und Walderdbeeren.", "H: Super dünn geworden. Da kriegst du fast ein Sixpack, ohne was zu machen."]; }
            if (has("feuerholz") || E.hasGoal("feuer")) return ["Genug Holz."];
            E.add("feuerholz"); E.stat("fourth", -8); E.time(20);
            return ["Feuerholz holen ist tatsächlich nicht so schwer. Aber die Erschöpfung kickt ordentlich rein."];
          }
          if (item === "powercord" || item === "paracord") {
            if (E.hasGoal("leine")) return ["Hängt."];
            await E.lines(["Den Abspannknoten üben. Wie war das jetzt noch?"]);
            const fails = await E.minigame("knoten", { title: "Abspannknoten, diesmal ohne Hilfe", text: "Erinnerst du dich noch an Tag 2?" });
            E.goal("leine"); E.show("s7-leinebild"); E.time(20);
            if (!E.flags.fund) { E.flags.fund = true; E.egg("fund"); }
            return [fails ? "f8-knoten" : "Zack, Schlaufe. Seilreibung, Slipknoten. Mega gut gespannt.", "Und was hab ich hier gefunden? Ein Skateboard-Shirt. Und einen Slip.", "H: Als Kopftuch?"];
          }
          return;
        case "s7-schilf":
          if (verb.look) return ["Schilf. Was guckt mich denn hier an?"];
          if (verb.use) { if (has("wobbler") || f.wobbler) return ["Nur noch Schilf."]; f.wobbler = true; E.add("wobbler"); return ["Ein Wobbler! Mit krassem Doppelhaken.", "f8-wobbler"]; }
          return;
        case "s7-pilz":
          if (verb.look) return ["Was würdet ihr sagen, was ist das für ein Pilz? Sieht aus wie ein Steinpilz."];
          if (verb.use) { E.egg("steinpilz"); E.learn("steinpilz"); return ["Unter den Hut geguckt: Der hat Lamellen. Also kein Steinpilz. Verwechslungsgefahr.", "Komm, ich drück dich wieder rein. Vielleicht kannst du da weitermachen."]; }
          return;
        case "rh-haus":
          if (verb.look) return ["Stefans rotes Haus. Das Ziel."];
          if (E.flags.arrive) { const r = E.flags.arrive; E.flags.arrive = null; r(); return []; }
          return ["Gleich. Erst noch einmal tief durchatmen."];
        case "rh-zaun": if (verb.look) return ["Ein alter Holzzaun. Zivilisation."]; return;
      }
    },

    combine(a, b, E) {
      const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
      if (pair("angelset", "wobbler")) { E.drop("wobbler"); E.swap("angelset", "angel_wobbler"); return ["Wobbler an die Angel. Ich hasse Knoten."]; }
    },

    async partner(id, verb, item, E) {
      if (item === "himbeeren" && id === "hannes") {
        E.drop("himbeeren"); E.goal("himbeeren"); E.stat("hunger", 25, "hannes"); E.stat("fourth", 20, "hannes");
        return ["Hannes, ich hab was für dich.", "H: Liebe?", "So ähnlich. Ein Potpourri aus Himbeeren und Erdbeeren. Jede Himbeere kontrolliert. Die mit Maden hab ich selbst gegessen.", "H: Oh nein, das ist so süß. Zucker. Energie."];
      }
      if (verb.use && id === "hannes" && !E.flags.zeckeSack) { E.flags.zeckeSack = true; E.egg("sack"); return ["J: Diese kleine Zecke hatte ich gerade am Sack.", "J: Dafür hast du die Todesstrafe verdient.", "J: Hoffentlich krieg ich keine Borreliose am Sack."]; }
    },

    async enter(room, E) {
      if (room === "steg7" && !E.flags.s7) {
        E.flags.s7 = true;
        const r = await E.minigame("karte", { map: "tag7", title: "Die letzte Etappe", text: "Ein letzter Lagerplatz, nah bei Stefan. Hügel, Hitze, und die Karte stimmt nicht überall.", ziel: "Feuerstelle, Steg, Angelplatz. Das ist er." });
        E.goal("spot"); E.time(90 + (r && r.deadEnds ? r.deadEnds * 25 : 0)); if (r && r.deadEnds) E.stat("fourth", -5 * r.deadEnds);
        return ["Hügel und kein Schatten, Leute. Wir unterhalten uns über Marathons und Mammutmärsche.", "Wir haben unseren Spot gefunden. Hier ist sogar eine Feuerstelle. Last day."]; }
    },

    hint(E) {
      const has = E.has, h = E.h;
      if (!E.hasGoal("aufbruch")) return "Den Sonnenschutz an den Kiefern abbauen. Dann links weiter.";
      if (h.room === "steg6") return "Links geht's weiter.";
      if (!E.hasGoal("himbeeren")) return E.active === "hannes" ? "Jonas will mir rechts Himbeeren pflücken. Oben links zu Jonas wechseln." : has("himbeeren") ? "Die Himbeeren Hannes schenken. Auf Hannes anwenden." : "Rechts wachsen Himbeeren. Für Hannes!";
      if (!E.hasGoal("feuer")) return has("feuerholz") ? "Feuerstahl auf die Feuerstelle." : "Am umgestürzten Baum am Wasser liegt Feuerholz.";
      if (!E.hasGoal("leine")) return "Den Abspannknoten üben: Paracord oder Powercord auf den umgestürzten Baum.";
      return "Letzter Abend. Schlafsack auf die Feuerstelle: Wir schlafen unter freiem Himmel auf der Plane.";
    },
    sleepHint: () => "Letzter Abend. Heute schlafen wir unter freiem Himmel direkt am See. Schlafsack an die Feuerstelle.",

    async night(E) {
      await E.lines(["H: Heute haben wir den primitivsten Unterstand: den blauen Himmel.", "J: Gute Nacht.", { narr: "t7n" }]);
      await E.lines(["H: Jonas … Jonas! Wach auf. Ich glaub, ich hab da eine Zecke. Am Arsch.", "J: Morgens um vier. Na gut. Doktor Jonas, Stirnlampe an."]);
      E.learn("zecke");
      const ok = await E.minigame("zecke");
      await E.lines(ok ? ["J: Draußen. Mit Kopf.", "f8-grandcanyon"] : ["H: Gib her, ich mach das selbst … Autsch.", "J: Grand Canyon. Ich sag nix."]);
      E.wake(6 * 60 + 10);
      await E.lines(["H: Guten Morgen aus dem letzten Camp, am letzten Morgen, zum letzten Marsch.", "f8-frieden"]);
      E.egg("frieden");
      await E.goRoom("rotes-haus", 300, 960, 1);
      E.egg("lastmarch");
      await E.lines(["f8-lastmarch", "H: Ziel in Sicht. Klick auf das rote Haus."]);
      await new Promise((r) => { E.flags.arrive = r; });
      E.egg("medikit");
      await E.lines(["f8-rotes-haus", "f8-abenteuer", "f8-ueberlebt", "f8-medikit"].concat(E.persisted("diavolo") ? ["J: Und Hannes? Du schuldest mir noch eine Pizza Diavolo.", "H: … Ja. Ich weiß."] : [], [{ narr: "t7e" }]));
    }
  };

  // Schlafen am letzten Abend: Schlafsack an die Feuerstelle
  const origAct = def.act;
  def.act = async (key, verb, item, E) => {
    if (key === "s7-feuer" && item === "schlafsack") {
      const miss = [["spot", "der Spot"], ["himbeeren", "die Himbeeren"], ["feuer", "das Feuer"], ["leine", "der Knoten"]].filter(([k]) => !E.hasGoal(k)).map(([, l]) => l);
      if (miss.length) return [`Noch nicht. Es fehlt noch ${miss.join(", ")}.`];
      E.drop("schlafsack");
      await E.lines(["Wir legen uns hier auf die Plane, direkt am See, und schlafen."]);
      E.sleep(); return [];
    }
    return origAct(key, verb, item, E);
  };

  Ausgesetzt.day(7, def);
})();
