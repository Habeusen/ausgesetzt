// Tag 3 (Folge 4): Montag, 7. Juli. Der lange Tag. Niesel, nichts brennt, Einsamkeit.
// Hannes: Puls-Schreck, Umzug zum Treffpunkt. Jonas: Empfang im Camp, Hängematte, Johanniskraut, Herzschüssel für Marlene.
(function () {
  const c = (file, text, who, folge, t) => ({ file, text, who, folge, t });
  const R1 = window.TAG1.rooms, R2 = window.TAG2.rooms;
  const ext = (room, hot, extra) => Object.assign({}, room, extra || {}, { hot: Object.assign({}, room.hot, hot || {}) });

  const def = {
    title: "Der lange Tag", weekday: "Montag, 7. Juli", folge: "4", clock: 6 * 60 + 30, fourth: "mood",
    intro: "Tag drei. Der Regen ist zurück. Heute ist der Gegner nicht der Hunger, sondern die Langeweile und das Alleinsein. Halte die Stimmung oben: Projekte, Pausen, kleine Freuden. Morgen treffen sich die beiden.",
    outro: "Noch eine Nacht. Morgen trennt die beiden nur noch ein Hügel und ein See, der aussieht wie ein Seepferdchen.",
    weather: (t) => (t < 9 * 60 ? "regen" : t < 13 * 60 ? "niesel" : t < 14 * 60 ? "grau" : t < 18 * 60 ? "regen" : t < 21 * 60 ? "grau" : "nacht"),
    chars: {
      hannes: { room: "hannes-neu", start: [1000, 700], narr: "t3h", stats: { thirst: 60, hunger: 45, fourth: 45, health: 85 },
        inv: ["messer", "feuerstahl", "filterflasche", "angelset", "schlafsack", "handy", "notration"] },
      jonas: { room: "jonas-wald", start: [700, 900], narr: "t3j", stats: { thirst: 55, hunger: 45, fourth: 50 },
        inv: ["kukri", "feuerstahl", "metallflasche", "powercord", "schlafsack", "handy"] }
    },
    goals: {
      hannes: [["puls", "Puls beruhigen"], ["umzug", "Umzug zum Treffpunkt"], ["lager", "Lager am Treffpunkt"], ["ok", "OK an Stefan"]],
      jonas: [["empfang", "Empfang finden"], ["haengematte", "Hängematte bauen"], ["kraut", "Johanniskraut bestimmen"], ["herz", "Herzschüssel für Marlene"]]
    },
    items: {
      notration: { name: "Notration", desc: "Die kleine Notration. Nur für den Notfall." },
      ketten: { name: "Alte Ketten", desc: "Rostige Ketten aus dem Wald. Vielleicht wird ein Haken draus?" },
      holzkohle: { name: "Holzkohle", desc: "Ein Stück Holzkohle aus der Feuerstelle.", selfSay: "Kohletabletten sind ja auch nichts anderes … *knirsch* … schmeckt scheiße." },
      herzrohling: { name: "Holzklotz", desc: "Ein Stück Holz. Da steckt eine Herzschüssel drin." },
      regenwasser: { name: "Metallflasche (Regenwasser)", desc: "Von der Plane aufgefangen.", drink: 45, becomes: "metallflasche", say: "Regenwasser. Schmeckt ein bisschen nach Plane. Aber nass ist nass." }
    },
    // Video-Tagebuch vor dem Schlafen
    campfire: {
      hannes: [{ label: "Der Puls heute Morgen", lines: ["lf-3h-notration"] }, { label: "Satt sein", lines: ["lf-3h-satt"] }],
      jonas: [{ label: "Warum mache ich das eigentlich?", lines: ["lf-3j-warum"] }, { label: "Morgen treffe ich Hannes", lines: ["lf-3j-morgen"] }]
    },
    clips: {
      "lf-3h-notration": c("ton/lf-3h-notration.wav", "Es war ja nur eine kleine Ration hier, aber ich glaube, die war überlebenswichtig. Sonst hätte ich vielleicht abbrechen müssen, weil der Herzschlag schon deutlich drüber war. Einfach nur daliegen und über 120 Puls haben. Nicht so schön.", "hannes", 4, 2192),
      "lf-3h-satt": c("ton/lf-3h-satt.wav", "Ich habe eben gemerkt: Okay, ich habe genug, ich bin satt. Und jetzt ist mir aufgefallen: Manchmal im Alltag kriege ich das gar nicht unterschieden. Bin ich satt oder habe ich noch Appetit? Wenn du was Leckeres da hast, könntest du immer weiteressen. Erst wenn du übersatt bist, merkst du das.", "hannes", 4, 2501),
      "lf-3j-warum": c("ton/lf-3j-warum.wav", "Warum mache ich das hier eigentlich alles? Warum tue ich mir das an, mich hier auszusetzen, mit Mücken, mit Hunger, mit mangelnder Hygiene, mit schlecht schlafen? Aber es ist halt die Erfahrung. Das mal erlebt zu haben und die Sachen im Alltag wieder viel mehr zu schätzen. Ein vernünftiges Bett. Was Geiles zu essen. Zu Hause musst du aufpassen, dass du nicht zu viel isst. Und hier bist du einfach froh, wenn du überhaupt was hast.", "jonas", 4, 237),
      "lf-3j-morgen": c("ton/lf-3j-morgen.wav", "Das heißt, morgen werde ich Hannes treffen. Da freue ich mich schon richtig drauf. Das wird cool. Ich hoffe, es gibt Fisch. Ich zähle auf dich, Hannes. Hol uns einen Barsch raus! Barschbeutel. Ich will Fisch, frischen Fisch! Ich kümmere mich auch ums Feuer, wenn du uns Fisch rausholst. Das wäre Premium. Ich freu mich auf einen anderen Geschmack als Beeren.", "jonas", 4, 654),
      "f4-drbest": c("ton/f4-drbest.wav", "So, die neue Birkenbürste von Dr. Best. Mit der neuen Aktivkohle-Zahnpasta.", "jonas", 4, 145),
      "f4-lakritz": c("ton/f4-lakritz.wav", "Ganz genau: Es sind zwei Kugeln Eis, und zwar Lakritzeis. Weil das gibt es nur hier in Schweden, und das ist mega geil.", "jonas", 4, 802),
      "f4-helden": c("ton/f4-helden.wav", "Den Helden müssen wir nicht spielen. Wir machen das ja für uns.", "hannes", 4, 970),
      "f4-allein": c("ton/f4-allein.wav", "Ich hasse es, alleine zu sein.", "hannes", 4, 2130),
      "f4-lebensfreude": c("ton/f4-lebensfreude.wav", "Nur noch heute durchstehen. Da kommt Jonas. Da kommt das Wetter. Da kommt die Lebensfreude.", "hannes", 4, 2450),
      "f4-wolf": c("ton/f4-wolf.wav", "Hallo, lieber Wolf, bitte bleib doch weg, denn ihr habt von mir Respekt. Wow, das war Freestyle.", "jonas", 4, 3243)
    },
    narr: {
      t3h: { file: "ton/erzaehler/damien-black/erzaehler-301.wav", text: "Tag drei. Der Regen kehrt zurück, und mit ihm der härteste Gegner dieser Reise: die Langeweile." },
      t3j: { file: "ton/erzaehler/damien-black/erzaehler-302.wav", text: "Bei Jonas brennt heute gar nichts, weder Holz noch Kienspan noch die Laune. Nur die Mücken sind bester Stimmung." },
      t3e: { file: "ton/erzaehler/damien-black/erzaehler-303.wav", text: "Noch eine Nacht. Dann trennt die beiden nur noch ein Hügel und ein See, der aussieht wie ein Seepferdchen." }
    },
    journal: {
      johanniskraut2: { title: "Johanniskraut sicher bestimmen", text: "Fünf gelbe Blütenblätter. Die Blüte zwischen den Fingern zerreiben: Wird sie rot, ist es Johanniskraut. Breitwegerich hilft gegen Mückenstiche, aber nur wenn man sicher ist." },
      empfang: { title: "Handyempfang", text: "Wenig Empfang im Camp: Nachricht abschicken, Handy wegpacken und herumlaufen. Irgendwann geht sie durch." },
      muecken: { title: "Mückenschutz", text: "Mit Regenjacke, Handschuhen und Mütze über dem Gesicht schlafen. Durch die Maschen bekommt man Luft, die Mücken kommen nicht durch." },
      regenwasser: { title: "Regenwasser auffangen", text: "Die Plane so spannen, dass eine Ecke tiefer hängt. Dort tropft das Regenwasser ab und läuft direkt in die Flasche." },
      satt: { title: "Satt sein", text: "Bei Birkenblätterspinat merkt man endlich, wann man satt ist. Zu Hause isst man oft weiter, weil es schmeckt." }
    },
    eggs: { drbest: "Dr. Best aus dem Wald", lakritz: "Zwei Kugeln Lakritzeis", kohle: "Ich gehör verhaftet", farn: "Den Farn erlegt", gaense: "Die Gänse rufen Jonas", wolfsong: "Freestyle für den Wolf", ketten: "Die Kette, die kein Haken wird" },
    noSignal: "Kein Empfang.",
    looks: {
      "h2-see": "Grau und still. Kein Fisch zu sehen.", "h2-fels": "Mein Granitstein. Heute nass.", "h2-birke": "Die Birke.", "h2-holz": "Das alte Brett.", "h2-heidel": "Blaubeeren, wie immer.",
      "j-wurzel": "Mein Wurzelteller.", "j-spuren": "Alte Wühlspuren.", "j-beeren": "Die Erdbeeren sind nachgewachsen.", "j-gopro": "Die GoPro. Leer.", "j-see": "Grau. Es nieselt.", "j-totholz": "Der abgestorbene Baum. Gutes Holz zum Schnitzen."
    },

    rooms: {
      "hannes-neu": ext(R2["hannes-neu"], {
        "exit-forstweg": Object.assign({}, R2["hannes-neu"].hot["exit-forstweg"], { exit: { to: "treffpunkt", spawn: [200, 880], dir: 1, need: (E) => (E.hasGoal("puls") ? (E.h.flags.abgebaut ? null : ["Erst abbauen. Ich zieh heute zum Treffpunkt."]) : ["Mir geht's gerade gar nicht gut. Erst mal liegen bleiben."]) } })
      }),
      "treffpunkt": ext(R2["treffpunkt"], {
        "t-platz": { name: "Freie Stelle", stand: [1560, 760], face: 1620, poly: "M1420,600 L1860,600 L1860,700 L1420,700 Z" },
        "t-tarp": { name: "Tarp", tent: [1580, 690], tent2: [1680, 690], stand: [1560, 760], face: 1620, hidden: true, poly: "M1430,540 L1760,520 L1800,690 L1420,700 Z" },
        "t-erdbeeren": { name: "Wegrand", kneel: true, stand: [1600, 960], face: 1700, poly: "M1520,900 L1900,900 L1900,1070 L1520,1070 Z" },
        "t-ketten": { name: "Etwas Rostiges im Gras", kneel: true, stand: [460, 1000], face: 360, poly: "M300,990 L420,990 L420,1060 L300,1060 Z" }
      }, {
        overlays: `<g id="t-tarpbild" opacity="0" pointer-events="none"><path d="M1420,690 Q1610,730 1830,680 L1830,705 Q1610,750 1410,712 Z" fill="#0d1408" opacity="0.5" filter="url(#soft)"/><path d="M1520,568 L1520,694 M1727,552 L1727,668" stroke="#4a3624" stroke-width="7" stroke-linecap="round"/><image href="tag1/tarp.png" x="1429" y="549" width="408" height="218" filter="url(#gradeHannes)"/></g>
          <g pointer-events="none"><g fill="none" stroke="#6a4a34" stroke-width="5"><ellipse cx="340" cy="1028" rx="16" ry="9"/><ellipse cx="364" cy="1034" rx="16" ry="9"/><ellipse cx="388" cy="1028" rx="16" ry="9"/></g></g>`
      }),
      "jonas-wald": ext(R2["jonas-wald"], {}, {}),
      "jonas-see": R2["jonas-see"]
    },

    // Folgen von Tag 2
    carry(E) {
      if (E.persisted("barsch1")) { E.stat("fourth", 10, "hannes"); return ["Hannes zehrt noch vom Barsch beim ersten Wurf gestern."]; }
      return [];
    },
    setup(E) {
      for (const id of ["h2-tarp", "h2-cord", "j-tarp", "j-cord", "j-steine", "j-holzshelter", "j-tuer", "j-leinebild", "j-schweden"]) E.show(id);
      E.hot("h2-tarp", true); E.hot("j-plane", true);
      if (E.persisted("loeffel")) E.add("loeffel", "jonas");
    },
    async start(E) {
      await E.encounter(PULS);
    },

    async act(key, verb, item, E) {
      const h = E.h, f = h.flags, has = E.has;
      switch (key) {
        // ----- Hannes -----
        case "h2-tarp":
          if (verb.look) return ["Mein Tarp. Wir werden zu einem Spot gehen, wo Jonas und ich uns treffen. Da schlage ich das Dauerlager auf."];
          if (verb.use) {
            if (!E.hasGoal("puls")) return ["Ich bleib noch kurz liegen."];
            if (f.abgebaut) return [];
            f.abgebaut = true; E.hide("h2-tarp"); E.hide("h2-cord"); E.hot("h2-tarp", false); E.add("tarp"); E.add("paracord"); E.time(20);
            return ["Erst mal muss ich kacken. Nach zweieinhalb Tagen ist es so weit.", "… Erledigt. Auf Malle war es schlimmer.", "Alles abgebaut. Der Wannabe-Bear-Grylls läuft langsam zum neuen Spot."];
          }
          return;
        case "t-platz":
          if (verb.look) return [E.hasGoal("lager") ? "Mein Lager am Treffpunkt." : "Hier ist frei. Zwei Stöcke als Stangen, dann geht das Tarp auch ohne Bäume."];
          if (item === "tarp" || item === "paracord" || verb.use) {
            if (E.hasGoal("lager")) return ["Steht."];
            if (!has("tarp") || !has("paracord")) return ["Ich brauche Tarp und Paracord."];
            E.drop("tarp"); E.drop("paracord"); E.show("t-tarpbild"); E.hot("t-platz", false); E.hot("t-tarp", true); E.goal("lager"); E.time(40);
            return ["Zwei Stöcke als Stangen, Paracord drüber, Tarp drauf. Solange es trocken ist.", "Wenn es jetzt regnet, hab ich's trocken. Das macht so viel aus."];
          }
          return;
        case "t-tarp":
          if (verb.look) return ["Mein Tarp am Treffpunkt. Morgen kommt Jonas."];
          if (item === "schlafsack") return finish(E);
          if (verb.use) return doze(E);
          return ["Später."];
        case "t-bank":
          if (verb.look) return ["Die alte Bank am Treffpunkt. Morgen sitzen wir hier zu zweit."];
          if (verb.use) {
            if (!f.bankAllein) { f.bankAllein = true; E.stat("fourth", 10); E.time(20); return ["Hinsetzen. Ich hasse es …", "f4-allein", "Allein an den Gedanken, dass ich jemanden treffen könnte, könnte ich schon heulen. Ich freu mich auf ihn."]; }
            if (!f.lebensfreude && h.clock > 16 * 60) { f.lebensfreude = true; E.stat("fourth", 15); return ["f4-lebensfreude"]; }
            return ["Ich sitz hier und guck den Ameisen beim Laufen zu."];
          }
          if (item === "handy") { if (E.hasGoal("ok")) return ["Hab ich schon."]; E.goal("ok"); return ["Ein Balken am Forstweg. OK an Stefan.", "S: 👍 Morgen ist Halbzeit."]; }
          return;
        case "t-feuer":
          if (verb.look) return ["Die präparierte Feuerstelle. Heute ist alles zu nass."];
          if (item === "feuerstahl") { E.stat("fourth", -5); E.time(30); return ["Ich hab hier eine ganze Handvoll super Anzündzeug plus Kienspan …", "Hier und da mal eine Flamme, ein mini kleines Fähnchen … glimmt sofort wieder aus.", "Bad News: Heute packe ich kein Feuer mehr an. Alles zu nass."]; }
          if (verb.use) { if (has("holzkohle")) return ["Hab schon Kohle."]; E.add("holzkohle"); return ["Ein Stück alte Holzkohle aus der Feuerstelle."]; }
          return;
        case "t-erdbeeren":
          if (verb.look) return ["Am Wegrand … kleine Walderdbeeren!"];
          if (verb.use) { if (f.erdbeeren) return ["Leer gegessen."]; f.erdbeeren = true; E.stat("hunger", 15); E.stat("fourth", 12); E.time(15); return ["Oh, die sind wirklich gut. Da hat der Körper mal was anderes.", "Blaubeeren können ja nicht irgendwann mal Schnitzel wachsen lassen."]; }
          return;
        case "t-ketten":
          if (verb.look) return ["Da liegen alte Ketten im Gras."];
          if (verb.use) { if (has("ketten") || f.ketten) return ["Hab ich schon."]; f.ketten = true; E.add("ketten"); return ["Ich nehm die Ketten mal mit. Kann man vielleicht was mitmachen."]; }
          return;
        case "t-see":
          if (verb.look) return ["Der Seepferdchensee. Spiegelglatt heute."];
          if (item === "filterflasche") { E.swap("filterflasche", "filterflasche_voll"); return ["Flasche voll. Vom Seepferdchensee."]; }
          return;
        case "t-holz":
          if (item === "ketten") { E.egg("ketten"); E.drop("ketten"); E.stat("fourth", 6); return ["Ich hänge die Kette auf den Stamm und schlage unten drauf, um einen Haken aufzubiegen …", "Bringt nichts. Viel zu massiv."]; }
          return;
        case "h2-ameisen":
          if (verb.use && !f.made) { f.made = true; E.add("made"); return ["Die Ameisen sind schon an meinem versteckten Köder. Eine Made krieg ich noch."]; }
          return;
        case "h2-see":
          if (item === "angel_bereit") { await E.minigame("angeln", { noBite: true, title: "Angel im Regen" }); E.swap("angel_bereit", "angelset"); E.stat("fourth", 8); E.time(40); return ["Heute beißt keiner.", "Aber irgendwie gut, was zu tun zu haben."]; }
          if (item === "filterflasche") { E.swap("filterflasche", "filterflasche_voll"); return ["Flasche voll."]; }
          return;
        case "h2-heidel":
          if (verb.use) { E.stat("hunger", 12); E.stat("fourth", 5); E.time(10); return ["Meine Popcorn-Kiste. Blaubeeren."]; }
          return;

        // ----- Jonas -----
        case "j-plane":
          if (verb.look) return [E.hasGoal("haengematte") ? "Meine Jägerhängematte unter der Plane." : "Die Plane hängt. Darunter wäre Platz für eine Hängematte."];
          if (item === "handy") return sendJ(E);
          if (item === "schlafsack") return finish(E);
          // Auch mit Seewasser in der Flasche: auskippen und Regenwasser auffangen (abkochen geht heute nicht)
          if (item === "metallflasche" || item === "metallflasche_voll") {
            const w = E.weather();
            if (w !== "regen" && w !== "niesel") return ["Gerade regnet es nicht. Wenn es wieder regnet, läuft es von der Plane runter."];
            E.swap(item, "regenwasser"); E.learn("regenwasser"); E.time(30);
            return [item === "metallflasche_voll" ? "Seewasser auskippen, abkochen geht ja eh nicht. Die Flasche unter die Ecke der Plane …" : "Die Flasche unter die Ecke der Plane, wo das Wasser abtropft …", "Regenwasser. Wenigstens ist der Regen heute zu was gut."];
          }
          if (verb.use) return doze(E);
          return;
        case "j-fichten":
          if (verb.look) return ["Meine zwei Fichten. Daran könnte ich auch eine Hängematte spannen."];
          if (item === "powercord") {
            if (E.hasGoal("haengematte")) return ["Hängt schon."];
            await E.lines(["Den Knoten hab ich beim Junggesellenabschied auf dem Segelboot gelernt. Acht, acht und neun …"]);
            await E.minigame("knoten", { title: "Hängematten-Knoten", text: "Das Seil muss die Hängematte tragen. Wähle jeden Schritt richtig." });
            E.goal("haengematte"); E.stat("fourth", 15); E.time(45);
            return ["Zack, zack. Rüber. Dann können wir hier belegen.", "Ich hänge ein bisschen nach rechts. Aber es geht auf jeden Fall.", "Mit meiner Jägerhängematte bin ich mega zufrieden."];
          }
          if (item === "kukri") { E.egg("farn"); E.stat("fourth", 6); return ["Ich könnte ja Messerwerfen üben. Zielscheibe: der Farn da.", "Zack. Ich habe den Farn erlegt.", "Liebe Kinder, macht das nicht zu Hause nach."]; }
          if (item === "handy") return sendJ(E);
          return;
        case "j-kraut":
          if (verb.look) return ["Gelbe Blüten. Und da drüben noch was Grünes mit breiten Blättern."];
          if (verb.use) {
            if (E.hasGoal("kraut")) return ["Hab genug Johanniskraut."];
            const ok = await E.encounter(PFLANZE);
            if (ok) { E.goal("kraut"); E.add("kraut"); E.learn("johanniskraut2"); }
            return [];
          }
          if (item === "handy") return sendJ(E);
          return;
        case "j-totholz":
          if (item === "kukri") {
            if (E.hasGoal("herz")) return ["Die Schüssel ist fertig."];
            if (!f.herz1) { f.herz1 = true; E.add("herzrohling"); E.stat("fourth", 10); E.time(40); return ["Ein großes Stück riskiert. Für so ein dünnes Scheibchen ist das echt viel Arbeit.", "Kann man die Herzschüssel schon erkennen? Ich glaub, ich bin der Sache auf jeden Fall näher."]; }
            return ["Den Klotz hab ich schon. Jetzt im Lager weiterschnitzen. Am besten unter der Plane."];
          }
          if (item === "handy") return sendJ(E);
          return;
        case "j-ueberhang":
          if (verb.look) return ["Mein Meldepunkt. Jeden Tag diese 480 Meter Zickzack."];
          if (item === "handy") return sendJ(E, true);
          return;
        case "j-feuer":
          if (item === "feuerstahl") { E.stat("fourth", -5); E.time(20); return ["Alles zu nass. Das Holz, der Kienspan, das ganze Reisig.", "Nicht mal mit ganz feinen Spänen. Kein Feuer heute."]; }
          if (verb.use) { if (has("holzkohle")) return ["Hab schon Kohle."]; E.add("holzkohle"); return ["Ein Stück Holzkohle vom Schwedenfeuer. Damit kann man doch malen …"]; }
          return;
        case "j-ueberhang-see":
          if (item === "holzkohle") { E.drop("holzkohle"); E.egg("lakritz"); E.stat("fourth", 20); E.time(30); return ["Kohle zermatschen, Zahnbürste als Pinsel, und dann auf den Fels …", "Weiß schon jemand, was es wird?", "f4-lakritz", "Das werde ich mir in Göteborg gönnen. Da verwette ich meinen Arsch drauf."]; }
          return;
        case "j-see":
          if (verb.use && !f.gaense) { f.gaense = true; E.egg("gaense"); E.stat("fourth", 8); return ["Was sind das für Vögel? Gänse! Direkt über meinem Camp.", "Die rufen gar nicht mehr auf … ich ruf zurück: JONAS!", "Gänse antworten nicht. Na gut."]; }
          if (item === "metallflasche") { E.swap("metallflasche", "metallflasche_voll"); return ["Kanne voll. Abkochen geht heute aber nicht."]; }
          return;
        case "j-beeren":
          if (verb.use) { if ((f.erdbeeren || 0) >= 3) return ["Leer gepflückt. Morgen gibt's neue."]; f.erdbeeren = (f.erdbeeren || 0) + 1; E.stat("hunger", 18); E.stat("fourth", 6); E.time(10); return ["Nieselregen bei den Erdbeeren. Ich ess sie direkt."]; }
          return;
        case "j-wiese": return;
        case "j-wurzel":
          if (verb.use) { if (f.heuschrecke) return ["Keine Heuschrecken mehr. Die haben sich verkrochen."]; f.heuschrecke = true; E.stat("hunger", 15); return ["Eine Heuschrecke zwischen den Wurzeln. Protein ist Protein."]; }
          return;
      }
    },

    combine(a, b, E) {
      const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
      if (pair("angelset", "made")) { E.drop("made"); E.swap("angelset", "angel_bereit"); return ["Grüne Made an den Haken."]; }
      if (pair("kukri", "herzrohling")) {
        if (E.active !== "jonas") return;
        E.drop("herzrohling"); E.add("herzschale"); E.persist("herzschale"); E.goal("herz"); E.stat("fourth", 25); E.time(90);
        return ["Ich schnitze und schnitze … wie stabil so ein Ast ist.", "Marlene, vielleicht gibt es doch noch eine Herzschüssel.", "An meine liebe Ehefrau: Ich hab sie mit Liebe gemacht."];
      }
    },

    self(verb, item, E) {
      const h = E.h, f = h.flags;
      if (E.active === "jonas" && verb.use && !f.drbest) { f.drbest = true; E.egg("drbest"); E.stat("fourth", 6); return ["f4-drbest", "Schmeckt bestimmt mega. Sieht auch gut aus."]; }
      if (E.active === "jonas" && verb.use && E.hasGoal("haengematte") && !f.netz) { f.netz = true; E.learn("muecken"); E.stat("fourth", 8); return ["Neue Idee gegen die Mücken: Regenjacke, Handschuhe, Mütze übers Gesicht.", "Ich krieg voll gut Luft, und keine Mücke kommt an mich ran."]; }
      if (item === "holzkohle") { E.drop("holzkohle"); E.egg("kohle"); E.stat("health", 3); return ["Kohletabletten sind ja auch nichts anderes. Könnte gegen die Verdauung helfen …", "*knirsch* Schmeckt scheiße.", "Ich glaube, ich gehör verhaftet."]; }
      if (item === "handy" && E.active === "jonas") return sendJ(E);
      if (item === "notration") return ["Die hebe ich für den Notfall auf."];
    },

    // Jonas: Nachricht abschicken und dann im Camp rumlaufen, bis sie durchgeht
    timed(E) {
      const h = E.h;
      if (E.active === "jonas" && h.flags.sendAt && !E.hasGoal("empfang") && h.clock - h.flags.sendAt >= 15) {
        E.goal("empfang"); E.learn("empfang");
        E.say("*Vibriert* … Sie ist durch! Hier im Camp. Ein bisschen Glück, ein bisschen Rumlaufen.");
      }
      if (E.active === "hannes" && !h.warned.langeweile && h.clock > 14 * 60 && h.fourth < 40) { h.warned.langeweile = true; E.say("Ich weiß nicht, was ich machen soll. Komplette Langeweile."); }
    },

    hint(E) {
      const h = E.h, has = E.has, f = h.flags;
      if (E.allGoals() && h.clock < 18 * 60) return E.active === "hannes" ? "Alles erledigt, aber es ist noch früh. Im Tarp dösen, Erdbeeren am Wegrand suchen oder auf der Bank sitzen." : "Alles erledigt, aber es ist noch früh. In der Hängematte dösen, mit Kohle malen oder Gänse zählen.";
      if (E.active === "hannes") {
        if (!E.hasGoal("puls")) return "Erst den Puls runterkriegen.";
        if (!f.abgebaut && !E.hasGoal("lager")) return "Das Tarp abbauen. Heute ziehe ich zum Treffpunkt am Forstweg, rechts raus.";
        if (h.room !== "treffpunkt" && !E.hasGoal("lager")) return "Rechts geht's zum Forstweg und zum Treffpunkt.";
        if (!E.hasGoal("lager")) return "Rechts neben der Bank ist Platz für das Tarp.";
        if (!E.hasGoal("ok")) return "Am Forstweg hab ich Empfang. Handy an der Bank benutzen.";
        if (h.fourth < 50) return "Mir ist langweilig. Erdbeeren am Wegrand? Die Bank? Irgendwas basteln?";
        return "Alles erledigt. Schlafsack unters Tarp.";
      }
      if (h.thirst < 40 && (has("metallflasche") || has("metallflasche_voll"))) return "Kein Feuer heißt kein Abkochen. Aber es regnet: Die Metallflasche unter die Plane halten und Regenwasser auffangen.";
      if (h.hunger < 30) return "Hunger. Erdbeeren bei den roten Beeren links vorne.";
      if (!E.hasGoal("empfang")) return f.sendAt ? "Nachricht ist raus. Jetzt einfach im Camp rumlaufen und was machen." : "Ich hab gestern gemerkt, dass manchmal im Camp eine Nachricht durchgeht. Einfach mal das Handy probieren.";
      if (!E.hasGoal("haengematte")) return "Eine Hängematte! Mit dem Powercord an den Fichten.";
      if (!E.hasGoal("kraut")) return "Die gelben Blüten im Wald. Ist das Johanniskraut?";
      if (!E.hasGoal("herz")) return has("herzrohling") ? "Den Holzklotz mit dem Kukri zur Herzschüssel schnitzen." : "Für Marlene: Mit dem Kukri ein Stück vom abgestorbenen Baum holen.";
      return "Alles erledigt. Ab unter die Plane.";
    },
    sleepHint: (E) => (E.active === "hannes" ? "Nur noch heute durchstehen. Schlafsack unters Tarp." : "Ab in die Hängematte."),
    halfText: (o) => (o === "jonas" ? "Jonas hängt noch im Fichtenwald fest." : "Hannes ist noch auf dem Weg zum Treffpunkt."),

    async enter(room, E) {
      if (room === "treffpunkt" && E.h.flags.abgebaut && !E.hasGoal("umzug")) { E.goal("umzug"); E.time(60); return ["Ich merke, wie die Kraft weg ist. Aber wir haben ja Zeit.", "Angekommen am Treffpunkt. Hier bleib ich, bis Jonas kommt."]; }
    },

    async night(E) {
      await E.switchTo("jonas");
      await E.wait(500);
      await E.lines(["J: Ich hab noch gar keinen Wolfsabschreck-Gesang gemacht."]);
      E.egg("wolfsong");
      await E.lines(["f4-wolf", { narr: "t3e" }]);
    }
  };

  function sendJ(E, top) {
    const f = E.h.flags;
    if (E.hasGoal("empfang")) return ["Nachricht ist schon durch."];
    if (top) { E.goal("empfang"); return ["Oben am Meldepunkt geht's natürlich. Aber das sind jeden Tag 480 Meter."]; }
    if (f.sendAt) return ["Ist abgeschickt. Jetzt rumlaufen und warten."];
    f.sendAt = E.h.clock;
    return ["Nachricht abschicken … kein Empfang.", "Handy wegpacken und eine Viertelstunde im Camp rumlaufen. Irgendwann geht sie durch."];
  }

  // Dösen lässt die Zeit vergehen, kostet aber Stimmung: der lange Tag
  async function doze(E) {
    if (E.h.clock >= 18 * 60) return ["Jetzt ist es Abend. Gleich kann ich schlafen."];
    // Erstes Dösen in der Hängematte: Die Mücken finden Jonas trotzdem
    if (E.active === "jonas" && E.hasGoal("haengematte") && !E.h.flags.muecken) {
      E.h.flags.muecken = true;
      const r = await E.minigame("muecken");
      E.time(30); E.stat("fourth", r.stiche < 3 ? 6 : -8);
      // Wirkt nach: zerstochen auf die Wanderung an Tag 4
      if (r.stiche >= 3) E.persist("zerstochen"); else E.unpersist("zerstochen");
      return [r.stiche < 3 ? "Hab sie erwischt. Jetzt kann ich in Ruhe dösen." : "Tausende Mücken. Die Tür bringt nichts. Ich bin komplett zerstochen.", "Neue Idee für heute Nacht: Regenjacke, Handschuhe, Mütze übers Gesicht."];
    }
    E.time(90); E.stat("fourth", -6);
    return [E.active === "hannes" ? "Ich dös ein bisschen im Tarp. Es regnet die ganze Zeit. Die Zeit vergeht einfach nicht." : "Ein bisschen in der Hängematte dösen. Die Füße werden kalt. Langsam frustriert es mich."];
  }

  async function finish(E) {
    if (E.h.clock < 18 * 60) return ["Es ist noch viel zu früh. Der Tag hat gefühlt 50 Stunden. Irgendwas muss ich noch machen. Oder ein bisschen dösen."];
    const goals = E.active === "hannes" ? [["puls", "der Puls"], ["umzug", "der Umzug"], ["lager", "ein Lager am Treffpunkt"], ["ok", "das OK an Stefan"]] : [["empfang", "die Nachricht an Stefan"], ["haengematte", "die Hängematte"], ["kraut", "das Johanniskraut"], ["herz", "die Herzschüssel"]];
    const miss = goals.filter(([k]) => !E.hasGoal(k)).map(([, l]) => l);
    if (miss.length) return [`Noch nicht. Es fehlt noch ${miss.length > 1 ? miss.slice(0, -1).join(", ") + " und " + miss[miss.length - 1] : miss[0]}.`];
    E.drop("schlafsack");
    await E.lines([E.active === "hannes" ? "Ohne Tarp wäre ich in diesem Regen verloren gewesen. Gute Nacht. Morgen kommt Jonas." : "Volle Montur, Handschuhe an, Maske an, rüber und schlafen. In der Hängematte."]);
    E.sleep();
    return [];
  }

  const PULS = { title: "Puls über 120", text: "Hannes wacht auf. Sein Herz rast, obwohl er nur daliegt. Über 120 Schläge in Ruhe.", opts: [
    { label: "Die kleine Notration essen und viel trinken", go: (E) => { E.drop("notration", "hannes"); E.goal("puls"); E.stat("health", 10); return ["H: Ich hab mir die kleine Notration reingepfiffen. Bei dem Ruhepuls war das schon scary.", "H: … Ich glaube, es hat sich alles stabilisiert.", "f4-helden"]; } },
    { label: "Notfalls das Handy anmachen und ChatGPT und Gemini fragen", go: (E) => { E.drop("notration", "hannes"); E.goal("puls"); return ["H: Beide meinten: Das sollte man vielleicht nicht ignorieren.", "H: Also doch die Notration. Und trinken. Viel trinken.", "f4-helden"]; } },
    { label: "Einfach liegen bleiben und abwarten", go: (E) => { E.hurt(15); E.drop("notration", "hannes"); E.goal("puls"); return ["H: … Wird nicht besser. Ich bin hier am Arsch.", "H: Okay. Notration. Jetzt.", "f4-helden"]; } }
  ] };
  const PFLANZE = { title: "Was blüht da?", text: "Zwei Pflanzen am Wegesrand. Eine mit fünf gelben Blütenblättern, eine mit breiten, gerippten Blättern dicht am Boden.", opts: [
    { label: "Die gelbe Blüte zwischen den Fingern zerreiben", value: true, go: () => ["J: Eindeutig rot. Das heißt: Johanniskraut.", "J: Die Blüte hab ich auch wiedererkannt, fünfblättrig, gelb. Das kommt mit rein."] },
    { label: "Die breiten Blätter auf die Mückenstiche reiben", value: false, go: (E) => { E.stat("fourth", -4); return ["J: Ich bin nicht sicher, ob das hier Breitwegerich ist. Sieht ein bisschen so aus …", "J: Ja. Lieber nicht. Erst die gelbe Blüte prüfen."]; } },
    { label: "Beides einfach essen", value: false, go: (E) => { E.hurt(6); return ["J: Bitter. Und ich weiß nicht mal, was ich da gerade gegessen hab. Dumme Idee."]; } }
  ] };

  Ausgesetzt.day(3, def);
  window.TAG3 = { rooms: def.rooms };
})();
