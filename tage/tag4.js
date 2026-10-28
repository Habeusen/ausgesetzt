// Tag 4 (Folge 5): Dienstag. Jonas packt, quält sich den Aufstieg hoch und findet den Seepferdchensee.
// Am Treffpunkt steht Hannes in Unterhose. Ab da zu zweit: Feuer, Heidelbeeren in der Herzschale, Interviews, Kartenbesprechung.
(function () {
  const c = (file, text, who, folge, t) => ({ file, text, who, folge, t });
  const R2 = window.TAG2.rooms, R3 = window.TAG3.rooms;
  const ext = (room, hot, extra) => Object.assign({}, room, extra || {}, { hot: Object.assign({}, room.hot, hot || {}) });

  const def = {
    title: "Wiedersehen am Seepferdchensee", weekday: "Dienstag", folge: "5", clock: 6 * 60, fourth: "stamina", first: "jonas",
    intro: "Heute ist Halbzeit. Jonas packt seinen Drybag und macht sich auf den Weg zu Hannes. Achte auf seine Ausdauer: Bergauf kostet Kraft, Pausen und Beeren geben sie zurück.",
    outro: "Aus zwei Lagern wird eines. Und aus einem Plan wird eine Herausforderung: zu Fuß, nur mit einer Karte, bis zu Stefans rotem Haus.",
    weather: (t) => (t < 9 * 60 ? "niesel" : t < 12 * 60 ? "grau" : t < 21 * 60 ? "sonne" : "nacht"),
    chars: {
      jonas: { room: "jonas-wald", start: [700, 900], narr: "t4j", stats: { thirst: 60, hunger: 45, fourth: 75 },
        inv: ["kukri", "feuerstahl", "metallflasche", "powercord", "schlafsack", "handy", "herzschale", "loeffel"] },
      hannes: { room: "treffpunkt", start: [1560, 780], dir: -1, away: true, stats: { thirst: 60, hunger: 50, fourth: 70 },
        inv: ["messer", "feuerstahl", "filterflasche", "angelset", "schlafsack", "handy", "karte"] }
    },
    goals: {
      jonas: [["packen", "Drybag packen"], ["aufstieg", "Den Aufstieg schaffen"], ["see", "Seepferdchensee finden"]],
      hannes: [],
      team: [["wiedersehen", "Wiedersehen"], ["feuer", "Feuer zu zweit"], ["beeren", "Heidelbeeren für Hannes"], ["interview", "Interviews am Feuer"], ["plan", "Route zu Stefan planen"]]
    },
    items: {
      rinde_gross: { name: "Große Birkenrinde", desc: "Riesige, fetzige Birkenrinde. Super Zunder, wenn sie am Feuer trocknet." },
      holzscheite: { name: "Holzscheite", desc: "Lange Stücke vom Baumstamm, gespalten." },
      heidelbeeren: { name: "Ein Liter Heidelbeeren", desc: "Die Kanne voller Heidelbeeren.", eat: 30, mood: 0, say: "Die esse ich nicht alle allein. Die sind für uns.", becomes: "metallflasche" },
      herzschale_voll: { name: "Herzschale mit Heidelbeeren", desc: "Mit Liebe gepflückt, in einer Herzschale serviert. Mit Löffel." },
      angelschnur: { name: "20 Meter Angelschnur", desc: "Aus dem Powercord gezogen, mit Knotenperlen." }
    },
    // Abend am Feuer, zum ersten Mal zu zweit
    campfire: {
      team: [{ label: "Was machen wir hier eigentlich den ganzen Tag?", lines: ["lf-4h-action"] }, { label: "Wohin geht es morgen?", lines: ["lf-4h-morgen"] }, { label: "Wie ist es, wieder zu zweit zu sein?", lines: ["f5-gamechanger"] }]
    },
    clips: {
      "lf-4h-morgen": c("ton/lf-4h-morgen.wav", "Aber morgen erwartet uns erst mal der See namens Löktjärnen oder Abortjärnen. Wir wissen noch nicht genau, welchen wir nehmen. Aber irgendeinen nehmen wir davon.", "hannes", 5, 1264),
      "lf-4h-action": c("ton/lf-4h-action.wav", "Weil, seien wir ehrlich, Leute: Viel machen wir hier nicht. Feuer machen. Wir haben versucht zu angeln, heute nichts gefangen. Ein bisschen was gemacht, erzählt. Aber wir waren hauptsächlich am Feuer. Ist schön, ist gut. Aber ein bisschen Action ist schon geil.", "hannes", 5, 1288),
      "f5-hobbit": c("ton/f5-hobbit.wav", "Es geht zu Hannes Beutlin, dem kleinen Hobbit. Hobbit-Musik, go!", "jonas", 5, 214),
      "f5-schuhe": c("ton/f5-schuhe.wav", "Sind die Schuhe nicht mehr trocken, kann dich nasses Gras nicht schocken.", "jonas", 5, 300),
      "f5-aufstieg": c("ton/f5-aufstieg.wav", "Das ist der Aufstieg des Todes hier.", "jonas", 5, 399),
      "f5-seepferdchen": c("ton/f5-seepferdchen.wav", "Hier ist der nächste See. Kann eigentlich nur bedeuten, dass das der Seepferdchensee ist.", "jonas", 5, 689),
      "f5-hannesruf": c("ton/f5-hannesruf.wav", "Hannes!", "jonas", 5, 765),
      "f5-unterhose": c("ton/f5-unterhose.wav", "Stehst du da in der Unterhose? Survival, Hannes!", "jonas", 5, 819),
      "f5-vereint": c("ton/f5-vereint.wav", "Puh, wir sind wieder vereint beim Seepferdchen. Geht's dir gut?", "jonas", 5, 853),
      "f5-gamechanger": c("ton/f5-gamechanger.wav", "Dass wir uns gesehen haben, das hat auf jeden Fall Freude ausgelöst. Alter, das ist ein kompletter Gamechanger.", "jonas", 5, 1474),
      "f5-nass": c("ton/f5-nass.wav", "Nass. Sehr nass. Sehr, sehr nass.", "hannes", 5, 2037)
    },
    narr: {
      t4j: { file: "ton/erzaehler/damien-black/erzaehler-401.wav", text: "Am vierten Tag packt Jonas seinen Rucksack, zum letzten Mal allein. Vor ihm liegt der Aufstieg." },
      t4m: { file: "ton/erzaehler/damien-black/erzaehler-402.wav", text: "Nach drei Tagen und drei Nächten sind sie wieder vereint. Und plötzlich fühlt sich alles leichter an." },
      t4e: { file: "ton/erzaehler/damien-black/erzaehler-403.wav", text: "Aus zwei Lagern wird eines. Und aus einem Plan wird eine Herausforderung: zu Fuß, nur mit einer Karte, bis zu Stefans rotem Haus." }
    },
    journal: {
      pilze: { title: "Falscher Pfifferling", text: "Der falsche Pfifferling ist knallorange. Der echte ist blasser, eher eigelb. Im Zweifel stehen lassen." },
      heidelbeer: { title: "Heidelbeeren pflücken", text: "Einen Busch greifen, umdrehen und die Beeren abstreifen. So ist die Kanne schnell voll." },
      orientierung: { title: "Orientierung an der Seeform", text: "Ohne GPS hilft die Form der Seen auf der Karte: Nase, Fuß, Bucht. Im Gelände dieselben Merkmale wiederfinden." }
    },
    eggs: { hobbit: "Hannes Beutlin, der kleine Hobbit", unterhose: "Survival in Unterhose", daumen: "Kukri gegen Daumen", fischruf: "Fisch! Oder doch nicht", pilz: "Der falsche Pfifferling", perlen: "Knotenperlen" },
    looks: { "t-see": "Der Seepferdchensee. Endlich zu zweit.", "t-holz": "Ein dicker Baumstamm. Da kann man lange Stücke abhacken." },

    rooms: {
      "jonas-wald": ext(R3["jonas-wald"], {
        // Den Felsufer-Raum gibt es heute nicht: Jonas packt und bricht auf
        "exit-see": Object.assign({}, R3["jonas-wald"].hot["exit-see"], { exit: Object.assign({}, R3["jonas-wald"].hot["exit-see"].exit, { need: () => ["Keine Zeit mehr für den See. Heute geht's zu Hannes."] }) }),
        "exit-aufbruch": { name: "Aufbrechen zu Hannes", stand: [1780, 900], face: 1920, poly: "M1830,780 L1920,780 L1920,1040 L1830,1040 Z",
          exit: { to: "aufstieg", spawn: [400, 1010], dir: 1, need: (E) => (E.hasGoal("packen") ? null : ["Erst packen. Plane, Schnur, alles muss in den Drybag."]) } }
      }),
      "aufstieg": {
        where: "Der Aufstieg", bg: "bg/aufstieg.jpg",
        walk: [[160, 1060], [1900, 1060], [1900, 760], [1500, 700], [1300, 420], [1420, 180], [1360, 170], [1180, 330], [900, 620], [600, 820], [160, 920]],
        center: [900, 900], y0: 180, s0: 0.28, s1: 0.95,
        hot: {
          "a-birke": { name: "Birke mit großer Rinde", stand: [1560, 770], face: 1700, poly: "M1630,0 L1830,0 L1830,720 L1640,720 Z" },
          "a-stein": { name: "Moosiger Felsblock", stand: [1300, 890], face: 1380, sit: [1380, 805, 1], poly: "M1230,660 L1560,640 L1560,820 L1230,830 Z" },
          "a-pfuetze": { name: "Große Pfütze", kneel: true, stand: [520, 960], face: 300, poly: "M160,870 L460,870 L460,1000 L160,1000 Z" },
          "a-pilze": { name: "Orange Pilze", kneel: true, stand: [760, 990], face: 700, poly: "M640,1000 L780,1000 L780,1060 L640,1060 Z" },
          "a-erdbeeren": { name: "Grasiger Hang", kneel: true, stand: [1600, 980], face: 1700, poly: "M1500,940 L1900,940 L1900,1070 L1500,1070 Z" },
          "exit-gipfel": { name: "Weiter nach oben", stand: [1380, 200], face: 1500, poly: "M1290,140 L1470,140 L1470,280 L1290,280 Z", dot: [1380, 200],
            // Ohne die große Rinde gäbe es am Treffpunkt keinen Zunder, und zurück geht es nicht mehr
            exit: { to: "treffpunkt", spawn: [260, 880], dir: 1, need: (E) => (E.h.fourth < 25 ? ["Ich kann nicht mehr. Erst mal Pause machen. Der Felsblock da sieht gut aus."] : !E.has("rinde_gross") ? ["Moment. Die riesige Birkenrinde da rechts nehm ich noch mit. Oben ist bestimmt alles nass."] : null) } }
        },
        overlays: `<g pointer-events="none"><g fill="#f08a1a" stroke="#7a3a08" stroke-width="2"><path d="M670,1030 q14,-24 28,0 z"/><path d="M710,1040 q12,-20 24,0 z"/><path d="M745,1028 q10,-18 20,0 z"/></g></g>`
      },
      "treffpunkt": ext(R3["treffpunkt"], {
        "t-platz": Object.assign({}, R3["treffpunkt"].hot["t-platz"], { hidden: true }),
        // Hannes' altes Lager gibt es an diesem Tag nicht mehr
        "exit-zurueck": Object.assign({}, R3["treffpunkt"].hot["exit-zurueck"], { exit: Object.assign({}, R3["treffpunkt"].hot["exit-zurueck"].exit, { need: () => ["Zurück? Nee. Ab hier geht's nur noch vorwärts, zu Stefan."] }) }),
        "t-tarp": Object.assign({}, R3["treffpunkt"].hot["t-tarp"], { hidden: false })
      }, { overlays: R3["treffpunkt"].overlays + `<g id="t-feuerbild" opacity="0" pointer-events="none"><circle cx="1250" cy="700" r="260" fill="url(#glow)"/><use href="#flames" transform="translate(1250 738) scale(1.2)"/></g>` })
    },

    // Folgen von Tag 3
    carry(E) {
      if (E.persisted("zerstochen")) { E.stat("fourth", -8, "jonas"); return ["Jonas ist von den Mücken in der Hängematte komplett zerstochen. Das juckt beim Wandern."]; }
      return [];
    },
    setup(E) {
      for (const id of ["j-tarp", "j-cord", "j-steine", "j-holzshelter", "j-tuer", "j-leinebild", "j-schweden", "t-tarpbild"]) E.show(id);
      E.hot("j-plane", true);
    },

    async act(key, verb, item, E) {
      const h = E.h, f = h.flags, has = E.has, team = E.together;
      switch (key) {
        // ----- Jonas packt -----
        case "j-plane":
          if (verb.look) return ["Meine Plane. Heute kommt sie mit."];
          if (verb.use) {
            if (E.hasGoal("packen")) return [];
            E.hide("j-tarp"); E.hide("j-cord"); E.hide("j-tuer"); E.hot("j-plane", false); E.add("plane"); E.goal("packen"); E.time(30);
            return ["Hängematte war einigermaßen bequem. Die Zickzack-Isomatte ist nur zur Mitte gerutscht.", "Ich packe meinen Drybag und nehme mit: ein Tarp, eine Schnur, einen Schlafsack, Feuerstahl, Messer und Trinkflasche.", "Bonus-Sachen, Souvenirs: Herzschale und Löffel.", "f5-hobbit"];
          }
          return;
        case "j-fichten": if (verb.look) return ["Tschüss, ihr zwei."]; return;

        // ----- Aufstieg -----
        case "a-birke":
          if (verb.look) return ["Riesenfetzige Birkenrinde. Wäre super Zunder."];
          if (verb.use || item === "kukri") {
            if (has("rinde_gross") || f.rinde) return ["Hab schon genug Rinde."];
            f.rinde = true; E.add("rinde_gross");
            return ["Noch ein bisschen nass. Aber die nehm ich mit. Am Feuer trocknen, und dann hab ich guten Zunder für später."];
          }
          return;
        case "a-stein":
          if (verb.look) return ["Rückseite trocken. Da kann ich mich doch kurz drauf setzen."];
          if (verb.use) { E.stat("fourth", 30); E.time(20); return ["Kurz hinsetzen. Ich hab ja Zeit, ist noch früh.", "Erst mal ein bäriges Frühstück, damit man bärenstark wird."]; }
          return;
        case "a-pfuetze":
          if (verb.look) return ["f5-aufstieg", "Und da haben wir die erste große Pfütze."];
          if (verb.use) { E.stat("fourth", -5); return ["f5-schuhe"]; }
          return;
        case "a-pilze":
          if (verb.look) return ["Ganz viele Pilze. Das dürfte aber der falsche Pfifferling sein. Der ist knallorange."];
          if (verb.use) { E.egg("pilz"); E.learn("pilze"); return ["Der echte ist eher blasser. Die lass ich lieber stehen."]; }
          return;
        case "a-erdbeeren":
          if (verb.look) return ["Ich bin zu weit gelaufen … aber gut, dass ich das gemacht habe."];
          if (verb.use) {
            if (f.erdbeeren) return ["Leer gepflückt."];
            f.erdbeeren = true; E.stat("fourth", 25); E.stat("hunger", 20); E.time(15);
            return ["Ganz viele Erdbeeren! Schaut euch diese Ausbeute an.", "So viel Geschmack. Bin ich gar nicht mehr gewohnt."];
          }
          return;

        // ----- Treffpunkt, zu zweit -----
        case "t-holz":
          if (item === "kukri") {
            if (has("holzscheite")) return ["Genug Holz."];
            E.add("holzscheite"); E.time(25);
            if (!E.flags.daumen) { E.flags.daumen = true; E.hurt(8); E.egg("daumen"); return ["Lange Stücke vom Stamm hacken, dann spalten …", "Der Kukri steckt fest. Ich hau auf den Griff … und mein Daumen war drunter. Was Dummes gemacht.", "Erste-Hilfe-Set. Mit Pflaster geht's."]; }
            return ["Lange Stücke abgehackt und gespalten. Schöne Scheite."];
          }
          if (verb.use) return [E.active === "hannes" ? "Mit dem Messer? Dafür brauch ich Jonas' Kukri." : "Das Kukri, nicht die Hand."];
          return;
        case "t-feuer":
          if (verb.look) return [E.flags.feuer4 ? "Unser Lagerfeuer. Lagerfeuerromantik." : "Unsere Feuerstelle. Alles klitschnass, aber wir versuchen es trotzdem."];
          if (item === "feuerstahl") {
            if (E.flags.feuer4) return ["Brennt."];
            if (!has("holzscheite")) return ["Ohne Holz nix. Lange Stücke vom Stamm hacken, mit dem Kukri."];
            if (!has("rinde_gross")) return ["Ich brauche guten Zunder. Die große Birkenrinde vom Aufstieg wäre ideal."];
            if (!(await E.minigame("feuer", { wet: true, title: "Feuer zu zweit, alles klitschnass" }))) E.time(20);
            E.drop("holzscheite"); E.drop("rinde_gross"); E.flags.feuer4 = true; E.goal("feuer"); E.fire("treffpunkt"); E.show("t-feuerbild"); E.time(30);
            return ["Rinde vorgetrocknet, Scheite drauf … es brennt!", "Zu zweit ein ganz anderes Gefühl. Rumsitzen, hacken, schnitzen, quatschen. Balsam für die Seele."];
          }
          if (item === "metallflasche_voll") { if (!E.flags.feuer4) return ["Erst Feuer, dann abkochen."]; E.swap("metallflasche_voll", "metallflasche_ok"); E.time(15); return ["Kanne ins Feuer. Sprudelt. Abgekocht."]; }
          if (verb.use) { if (!E.flags.feuer4) return ["Feuer macht sich nicht von allein."]; E.stat("fourth", 10); E.time(30); return ["Mittagsschläfchen auf der Isomatte am Feuer. Ohne Mücken. So geil."]; }
          return;
        case "t-erdbeeren":
          if (verb.look) return ["Heidelbeeren, so weit das Auge reicht. Ein Paradies."];
          if (verb.use) {
            if (!team) return ["Erst mal zu Hannes."];
            if (has("heidelbeeren") || E.hasGoal("beeren")) return ["Genug gepflückt."];
            if (!has("metallflasche")) return ["Ich brauche die leere Kanne zum Sammeln."];
            E.learn("heidelbeer"); E.swap("metallflasche", "heidelbeeren"); E.stat("fourth", 10); E.time(45);
            return ["Neue Heidelbeer-Pflückskills: Busch greifen, umdrehen, zack.", "Etwa ein Liter Heidelbeeren. So viele hab ich die ganzen letzten Tage nicht gegessen."];
          }
          return;
        case "t-bank":
          if (verb.look) return ["Unsere Bank. Unser Lagerfeuer. Unser kleiner Spot."];
          if (item === "karte") {
            if (E.hasGoal("plan")) return ["Die Route steht."];
            E.goal("plan"); E.time(30);
            return ["H: Wie kommen wir nur mit Landkarte, ohne Google Maps, vom Seepferdchensee rüber zu Stefan?", "J: Wo sind wir genau? … Das ist das Seepferdchen.", "H: Morgen ungefähr fünf Kilometer. Aber die unwegsamsten fünf. Insgesamt 15 bis 20 Kilometer.", "J: Wir machen das. Neue Challenge.", "H: Und bei Stefan warten Linsensuppe und Gulaschsuppe."];
          }
          if (item === "handy") return ["Heute schicken wir das OK zu zweit. Erledigt."];
          return;
        case "t-tarp":
          if (verb.look) return ["Hannes' Tarp. Jonas hängt seine Hängematte daneben."];
          if (item === "schlafsack") return finish(E);
          return;
        case "t-see":
          if (item === "filterflasche") { E.swap("filterflasche", "filterflasche_voll"); E.time(5); return ["Filter rein, Seewasser rein. Trinkwasser für uns beide."]; }
          if (item === "metallflasche") { E.swap("metallflasche", "metallflasche_voll"); return ["Kanne voll Seewasser. Am Feuer abkochen."]; }
          if (item === "angelset" || item === "angelschnur") {
            if (E.flags.fischruf) return ["Heute beißt nix."];
            E.flags.fischruf = true; E.egg("fischruf"); E.time(40);
            return ["H: Fisch!", "J: Hast du was gefangen? Ich komme, Baby!", "H: … Nee. Doch nicht.", "J: Ich hab mich schon so gefreut."];
          }
          return;
      }
    },

    combine(a, b, E) {
      const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
      if (pair("heidelbeeren", "herzschale")) { E.swap("heidelbeeren", "metallflasche"); E.swap("herzschale", "herzschale_voll"); return ["Wie serviert man mit Liebe gepflückte Heidelbeeren am besten? In einer Herzschale."]; }
      if (pair("powercord", "kukri") || pair("powercord", "messer")) {
        if (E.has("angelschnur")) return ["Hab ich schon."];
        E.add("angelschnur"); E.egg("perlen"); E.time(20);
        return ["Das lange Powercord durchfädeln … hier sind unsere Knotenperlen.", "Ziehen, ziehen, ziehen … flup. 20 Meter Angelschnur."];
      }
    },

    // Mit dem Partner reden oder ihm etwas geben
    async partner(id, verb, item, E) {
      // Ohne Herzschüssel (an Tag 3 nicht fertig geworden) gibt es die Beeren direkt aus der Kanne
      if (item === "heidelbeeren" && id === "hannes" && !E.has("herzschale")) {
        E.swap("heidelbeeren", "metallflasche"); E.goal("beeren"); E.stat("fourth", 10, "hannes"); E.stat("hunger", 25, "hannes");
        return ["Hier, direkt aus der Kanne. Eine Schale hätte schöner ausgesehen.", "H: Egal. Lecker, lecker."];
      }
      if (item === "herzschale_voll" && id === "hannes") {
        E.drop("herzschale_voll"); E.goal("beeren"); E.stat("fourth", 15, "hannes"); E.stat("hunger", 30, "hannes");
        return ["Komm, ich schütte dir was rein. Und wie isst man Heidelbeeren am besten? Mit einem kleinen Löffelchen.", "H: Der Tisch ist dick gedeckt, Leute.", "H: Lecker, lecker."];
      }
      if (verb.use) {
        if (!E.together) return;
        const o = id;
        if (o === "jonas" && !E.flags.intJ) { E.flags.intJ = true; await E.encounter(INTERVIEW_J); checkInterview(E); return []; }
        if (o === "hannes" && !E.flags.intH) { E.flags.intH = true; await E.encounter(INTERVIEW_H); checkInterview(E); return []; }
        return [o === "jonas" ? "J: Geil, dass wir zu zweit sind." : "H: Morgen geht's los auf die Expedition."];
      }
    },

    async enter(room, E) {
      if (room === "aufstieg" && !E.flags.aufstiegIn) { E.flags.aufstiegIn = true; E.time(30); return ["Der Drybag ist deutlich schwerer geworden. Und ich bin schlapper.", "Mein sicherer, trockener Weg ist heute überall mit Pfützen."]; }
      if (room === "treffpunkt" && !E.flags.met) {
        E.flags.met = true; E.goal("aufstieg"); E.time(120);
        let ok = false;
        while (!ok) ok = await E.encounter(SEE);
        E.goal("see"); E.learn("orientierung");
        await E.lines(["Der Treffpunkt mit der Feuerstelle und der Bank. Damit Hannes auch kommt, muss ich ihn ja rufen, oder?", "f5-hannesruf"]);
        await E.wait(900);
        // Hannes kriecht verschlafen aus seinem Tarp
        E.place("hannes", 1580, 720, null, -1); E.arrive("hannes"); E.egg("unterhose");
        await E.wakeUp("hannes");
        await E.lines(["f5-unterhose", "H: Junge, ich dachte, wer redet hier am frühen Morgen?"]);
        // Beide laufen aufeinander zu und fallen sich in die Arme
        await Promise.all([E.walk(880, 830, "jonas"), E.walk(965, 830, "hannes")]);
        E.face(2000, "jonas"); E.face(0, "hannes");
        E.pose("jonas", "umarmen"); E.pose("hannes", "umarmen");
        await E.lines(["f5-vereint"]);
        E.pose("jonas", null);
        await E.lines([{ narr: "t4m" }]);
        E.setTogether(true); E.goal("wiedersehen");
        return ["J: Erste Lagebesprechung. Wir machen mal ein bisschen Feuer."];
      }
    },

    hint(E) {
      const has = E.has, h = E.h;
      if (!E.together) {
        if (!E.hasGoal("packen")) return "Die Plane abbauen und alles in den Drybag. Dann rechts raus zum Aufbruch.";
        if (h.room === "jonas-wald" || h.room === "jonas-see") return "Rechts im Wald geht's los, Richtung Hannes.";
        if (h.fourth < 30) return "Ich bin k.o. Auf dem Felsblock rasten oder am Hang Erdbeeren suchen.";
        if (!has("rinde_gross")) return "Die große Birkenrinde rechts wäre guter Zunder für später.";
        return "Ganz nach oben, den Pfad hinauf.";
      }
      if (!E.hasGoal("feuer")) {
        if (!has("holzscheite")) return E.active === "jonas" ? "Mit dem Kukri lange Stücke vom Baumstamm links hacken." : "Holz hacken geht nur mit Jonas' Kukri. Jonas machen lassen, oder ihn um das Kukri bitten.";
        if (!has("rinde_gross")) return "Die große Birkenrinde hat Jonas. Wer das Feuer macht, braucht Scheite und Rinde.";
        return "Feuerstahl auf die Feuerstelle.";
      }
      if (!E.hasGoal("beeren")) {
        if (has("herzschale_voll")) return "Die Herzschale Hannes geben. Einfach auf Hannes anwenden.";
        if (has("heidelbeeren")) return "Heidelbeeren und Herzschale kombinieren.";
        return E.active === "jonas" ? "Heidelbeeren pflücken am Wegrand rechts unten. In die leere Kanne." : "Jonas soll Heidelbeeren pflücken. Er hat die Herzschale.";
      }
      if (!E.hasGoal("interview")) return "Interviewtime! Mit der Hand die andere Figur anklicken. Beide Interviews führen.";
      if (!E.hasGoal("plan")) return "Hannes hat Stefans Karte. Auf der Bank ausbreiten.";
      return "Alles erledigt. Schlafsack unters Tarp.";
    },
    sleepHint: () => "Morgen geht es los auf die Expedition. Schlafsack unters Tarp.",

    async night(E) {
      await E.lines(["J: Wieder geht ein Tag zu Ende. Ich hier in der Hängematte. Mücken sind keine da.", { narr: "t4e" }]);
    }
  };

  function checkInterview(E) { if (E.flags.intJ && E.flags.intH) E.goal("interview"); }

  async function finish(E) {
    const miss = [["feuer", "das Feuer"], ["beeren", "die Heidelbeeren"], ["interview", "die Interviews"], ["plan", "die Route"]].filter(([k]) => !E.hasGoal(k)).map(([, l]) => l);
    if (miss.length) return [`Noch nicht. Es fehlt noch ${miss.length > 1 ? miss.slice(0, -1).join(", ") + " und " + miss[miss.length - 1] : miss[0]}.`];
    E.drop("schlafsack");
    await E.lines(["H: Gute Nacht, Jonas.", "J: Gute Nacht. Morgen: Expedition."]);
    E.sleep();
    return [];
  }

  const SEE = { bild: "see", ton: "wind", title: "Welcher See ist es?", text: "Oben angekommen. Vor Jonas liegt ein See. Auf Stefans Karte ist der Treffpunkt am Seepferdchensee markiert. Woran erkennt er ihn?", opts: [
    { label: "An der Form: Nase rechts oben, Fuß unten, genau wie ein Seepferdchen", value: true, go: () => ["f5-seepferdchen", "Dann bin ich jetzt hier am Fuß vom Seepferdchen. Da hoch und dann rechts die Nase. Bald bin ich da."] },
    { label: "Am Fisch, der gerade gesprungen ist", value: false, go: (E) => { E.stat("fourth", -8); return ["Ein dicker Fisch. Schön. Hilft aber nicht beim Orientieren."]; } },
    { label: "Der See an der Straße, da wo ich ausgesetzt wurde", value: false, go: (E) => { E.stat("fourth", -8); return ["Nee. Das ist der See, an dem ich zuerst hätte ausgesetzt werden sollen. Direkt an der Straße."]; } }
  ] };
  const INTERVIEW_J = { bild: "interview", ton: "piepen", title: "Interview mit Jonas", text: "Interviewtime. Goldener Schnitt, Kamera läuft. Was fragt Hannes?", opts: [
    { label: "Was war bisher am schwersten?", go: () => ["J: Magenverstimmung, ein bisschen Durchfall … und Langeweile. Der eine Nachmittag, wo die Zeit einfach nicht vergangen ist."] },
    { label: "Was war am geilsten?", go: () => ["J: Dass das mit der Hängematte geklappt hat. Und mit dem Löffel.", "f5-gamechanger"] },
    { label: "Was würdest du jetzt am liebsten essen?", go: () => ["J: Eine Pizza.", "J: Hunger eigentlich keiner. Aber eben war ich schon ein bisschen dizzy. Die Erdbeeren haben geholfen."] }
  ] };
  const INTERVIEW_H = { bild: "interview", ton: "piepen", title: "Reverse-Interview", text: "Jetzt bist du fällig, Hannes. Was fragt Jonas?", opts: [
    { label: "Wie würdest du den ersten Tag in einem Wort beschreiben?", go: () => ["f5-nass", "J: Geil, nass wäre auch mein Wort gewesen."] },
    { label: "Womit hattest du am meisten zu kämpfen?", go: () => ["H: Alleine sein, auf jeden Fall. Ich dachte, Feuer machen wird ein Problem. War es gar nicht."] },
    { label: "Was war dein bester Gegenstand?", go: () => ["H: Meine Titanflasche. Die hat hart gecarried. Kochen, Smoothies, Wasserfilter."] }
  ] };

  Ausgesetzt.day(4, def);
})();
