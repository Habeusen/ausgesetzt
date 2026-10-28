// Tag 6 (Folge 7): Donnerstag. Hitze, Straße, Brücke mit Höhenangst, gerissener Gurt, Steg, Unterhosen-Kescher und Pizza-Wette.
(function () {
  const c = (file, text, who, folge, t) => ({ file, text, who, folge, t });
  const R5 = window.TAG5.rooms;
  const ext = (room, hot, extra) => Object.assign({}, room, extra || {}, { hot: Object.assign({}, room.hot, hot || {}) });

  const def = {
    title: "Hitze und Straße", weekday: "Donnerstag", folge: "7", clock: 5 * 60 + 30, fourth: "stamina", together: true, first: "hannes",
    intro: "Was der Regen nicht geschafft hat, versucht jetzt die Hitze. Heute geht es an der Straße entlang, über eine lange Brücke, bis ein Lagerplatz am Wasser auftaucht. Wasser wird knapp, Schatten ist Gold wert.",
    outro: "Über zehn Kilometer, ein gerissener Gurt und eine verlorene Wette. Morgen ist der letzte Tag.",
    weather: (t) => (t < 8 * 60 ? "sonne" : t < 19 * 60 ? "hitze" : t < 21.5 * 60 ? "sonne" : "nacht"),
    chars: {
      hannes: { room: "grosser-see", start: [900, 880], stats: { thirst: 50, hunger: 40, fourth: 65 },
        inv: ["messer", "feuerstahl", "filterflasche_voll", "angelset", "schlafsack", "handy", "karte", "tarp", "paracord"] },
      jonas: { room: "grosser-see", start: [560, 900], stats: { thirst: 50, hunger: 40, fourth: 60 },
        inv: ["kukri", "feuerstahl", "metallflasche", "powercord", "schlafsack", "handy", "plane", "unterhose", "angelschnur", "loeffel"] }
    },
    goals: { team: [["aufbruch", "Lager abbauen"], ["bruecke", "Über die Brücke"], ["gurt", "Gurt reparieren"], ["schatten", "Sonnenschutz am Steg"], ["ok", "Standort an Stefan"], ["fisch", "Fischversuch"]] },
    items: {
      unterhose: { name: "Lange Unterhose", desc: "Jonas' lange Unterhose. Für Notfälle aller Art." },
      angelschnur: { name: "20 Meter Angelschnur", desc: "Aus dem Powercord, mit Knotenperlen." },
      angel_lang: { name: "Verlängerte Angel", desc: "Zwei Schnüre, je zwei Knoten. Vier, fünf Meter weiter." },
      samen: { name: "Brennnesselsamen", desc: "Ölig, nahrhaft, ziemlich lecker.", eat: 12, mood: 6, say: "Powersnack. Brennnesselsamen. Viele Öle." },
      kraut: { name: "Johanniskraut", desc: "Gelb, fünf Blätter, zerrieben rot.", eat: 3, heal: 12, mood: 6, say: "Johanniskraut auf die Stiche. Und ein bisschen kauen." }
    },
    // Abend am Steg
    campfire: {
      team: [{ label: "Hunger oder Energie?", lines: ["lf-6j-energie"] }, { label: "Was gibt es zu Hause als Erstes?", lines: ["lf-6h-schnitzel"] }, { label: "Die Pizza-Wette", need: (E) => E.hasGoal("fisch"), lines: ["f7-pizza"] }]
    },
    clips: {
      "lf-6h-schnitzel": c("ton/lf-6h-schnitzel.wav", "Ja, ich habe gerade nochmal über Essen fantasiert. Hunger haben wir eigentlich nicht. Wir haben Bock auf Energie, aber nicht unbedingt Hunger. Und ich werde mir von Antonia wünschen, wenn wir Samstag da sind, dass es Sonntagsschnitzel gibt.", "hannes", 7, 518),
      "lf-6j-energie": c("ton/lf-6j-energie.wav", "Also, das war eine krasse Erkenntnis, die wir beide gerade hatten: so crazy, keinen Hunger zu haben, aber ein Energiebedürfnis. Ein ganz komisch anderes Gefühl. Hannes redet ständig über Essen, hat aber keinen Hunger. Eher Bock, etwas zu essen an sich. Der Hunger ist nicht da. Essen ist eine geile Tätigkeit. Einfach auch etwas Geiles essen.", "jonas", 7, 546),
      "f7-militaer": c("ton/f7-militaer.wav", "Wir fühlen uns hier ein bisschen wie bei so einer Militärgrundausbildung.", "jonas", 7, 602),
      "f7-10von10": c("ton/f7-10von10.wav", "Also, Leute: 10 out of 10, would do it again.", "hannes", 7, 513),
      "f7-hoehenangst": c("ton/f7-hoehenangst.wav", "Hab ich erwähnt, dass ich ein bisschen Höhenangst hab?", "jonas", 7, 948),
      "f7-monster": c("ton/f7-monster.wav", "Und ich glaube, die Fische checken das. Die sind nicht doof. Die haben Angst vor dem schwarzen Monster.", "jonas", 7, 1924),
      "f7-pizza": c("ton/f7-pizza.wav", "Und ich hab verloren. Hannes kriegt eine Pizza. Was hättest du gern für eine Pizza? – Pizza Diavolo.", "jonas", 7, 1934)
    },
    narr: {
      t6: { file: "ton/erzaehler/damien-black/erzaehler-601.wav", text: "Tag sechs. Was der Regen nicht geschafft hat, versucht jetzt die Hitze." },
      t6e: { file: "ton/erzaehler/damien-black/erzaehler-602.wav", text: "Über zehn Kilometer, ein gerissener Gurt und eine verlorene Wette. Morgen ist der letzte Tag." }
    },
    journal: {
      hitze: { title: "Hitze", text: "Schatten suchen, Mütze im Bach nass machen, oft trinken. Bei Hitze sinkt das Wasser doppelt so schnell." },
      brennnessel: { title: "Brennnessel und Löwenzahn", text: "Brennnesseln wachsen auf nährstoffreichem Boden, also nah an der Zivilisation. Ihre Samen sind ölig und nahrhaft." },
      kreislauf: { title: "Kreislauf am Morgen", text: "Nach Tagen mit wenig Essen ist der Kreislauf morgens im Keller. Langsam aufstehen, erst Tee, dann Feuer anpusten." },
      schnur: { title: "Angelschnur verlängern", text: "Zwei Schnüre übereinanderlegen und an jeder Seite einen Knoten machen. Bombenfest, und die Angel reicht vier, fünf Meter weiter." }
    },
    eggs: { sonne: "Die Sonne veräppelt Hannes", flugsaurier: "Ein Flugsaurier", pizza: "Die Pizza-Wette", militaer: "Militärgrundausbildung", privat: "Privatgrundstück", diavolo: "Pizza Diavolo gewonnen" },
    looks: { "g-feuer": "Die Glut von gestern.", "g-strand": "Der Steinstrand." },

    rooms: {
      "grosser-see": ext(R5["grosser-see"], {
        "exit-strasse": { name: "Zur Straße", stand: [1840, 940], face: 1920, poly: "M1830,780 L1920,780 L1920,1080 L1830,1080 Z",
          exit: { to: "bruecke", spawn: [120, 960], dir: 1, need: (E) => (E.hasGoal("aufbruch") ? null : ["Erst das Lager abbauen."]) } }
      }),
      bruecke: {
        where: "Straße und Brücke", bg: "bg/bruecke.jpg",
        walk: [[0, 700], [600, 660], [780, 630], [1280, 600], [1640, 470], [1670, 490], [1400, 640], [1100, 710], [1100, 1060], [0, 1060]],
        center: [600, 900], y0: 470, s0: 0.25, s1: 0.95,
        hot: {
          "b-bruecke": { name: "Lange Brücke", stand: [820, 650], face: 1300, poly: "M760,600 L1660,460 L1660,500 L1280,640 L760,660 Z",
            exit: { to: "steg6", spawn: [1700, 960], dir: -1, need: (E) => (E.flags.bruecke ? null : ["Hab ich erwähnt, dass ich ein bisschen Höhenangst hab? Erst mal klären, wie wir da rübergehen."]) } },
          "b-schilf": { name: "Schilf am Ufer", stand: [500, 720], face: 300, poly: "M0,480 L760,480 L760,640 L0,690 Z" },
          "b-nessel": { name: "Brennnesseln", kneel: true, stand: [1000, 960], face: 1200, poly: "M1100,860 L1500,860 L1500,1060 L1100,1060 Z" },
          "b-birke": { name: "Birke mit Schatten", stand: [1000, 760], face: 1800, poly: "M1800,0 L1920,0 L1920,640 L1800,640 Z" },
          "b-stein": { name: "Großer Stein", stand: [1080, 880], face: 1750, poly: "M1700,720 L1900,720 L1900,840 L1700,840 Z" }
        }
      },
      steg6: {
        where: "Alter Steg", bg: "bg/steg6.jpg",
        walk: [[0, 780], [400, 780], [900, 730], [1100, 710], [1460, 560], [1480, 590], [1260, 750], [1920, 830], [1920, 1060], [0, 1060]],
        center: [800, 900], y0: 560, s0: 0.5, s1: 0.95,
        overlays: `<g id="st-schatten" opacity="0" pointer-events="none"><path d="M140,700 Q380,740 620,700 L620,720 Q380,760 130,722 Z" fill="#0d1408" opacity="0.5" filter="url(#soft)"/><image href="tag1/plane.png" x="150" y="470" width="470" height="258" filter="url(#gradeHannes)"/></g>
          <g id="st-fire" opacity="0" pointer-events="none"><circle cx="800" cy="800" r="200" fill="url(#glow)"/><use href="#flames" transform="translate(800 830) scale(1)"/></g>`,
        hot: {
          "st-baeume": { name: "Zwei Kiefern", stand: [520, 800], face: 330, poly: "M180,0 L480,0 L480,690 L180,690 Z" },
          "st-schild": { name: "Altes Schild", stand: [740, 800], face: 560, poly: "M420,640 L700,680 L690,780 L420,760 Z" },
          "st-steg": { name: "Steg", stand: [1240, 730], face: 1400, poly: "M1000,640 L1460,500 L1480,540 L1240,760 L1000,740 Z" },
          "st-see": { name: "See", kneel: true, stand: [1050, 720], face: 1200, poly: "M700,320 L1920,320 L1920,700 L1500,700 L1000,620 L700,620 Z" },
          "st-feuer": { name: "Platz für ein Feuer", kneel: true, stand: [880, 900], face: 800, poly: "M720,760 L900,760 L900,860 L720,860 Z" }
        }
      }
    },

    // Folgen von Tag 5
    carry(E) { return E.persisted("hufeisen") ? ["Das Hufeisen aus dem Sumpf ist im Drybag. Bringt angeblich Glück."] : []; },
    setup(E) { E.show("g-schutz"); E.show("g-matte"); },
    async start(E) {
      await E.lines([{ narr: "t6" }, "H: Guten Morgen. Heute ist schon Donnerstag.", "J: Hannes ist sogar mal vor mir aufgestanden."]);
      await E.encounter(KREISLAUF);
    },

    async act(key, verb, item, E) {
      const has = E.has, f = E.flags;
      switch (key) {
        case "g-baeume":
          if (verb.use) { if (E.hasGoal("aufbruch")) return []; E.hide("g-schutz"); E.hide("g-matte"); E.goal("aufbruch"); E.time(30); return ["Unser kleines Zelt abgebaut, auch Tarp genannt. Wie immer Sprachschwierigkeiten.", "J: Und ich polstere den Drybag mit der Isomatte am Rücken. Gute Idee, Jonas."]; }
          if (verb.look) return ["Jonas' Chalet. Mit Einstiegsleiter über einen Ast."];
          return;
        case "g-see":
          if (verb.look) { if (!f.sonne) { f.sonne = true; E.egg("sonne"); return ["H: Ich wollte den Sonnenaufgang sehen. Ich dachte, sie ist schon da …", "H: … und dann wandert die einfach nur ganz leicht schräg hoch, die ganze Zeit an den Baumkronen entlang.", "H: Hat mich ein bisschen veräppelt, die Sonne."]; } return ["Der große See in der Morgensonne."]; }
          if (item === "filterflasche") { E.swap("filterflasche", "filterflasche_voll"); return ["Flasche voll. Heute brauchen wir jeden Schluck."]; }
          return;
        // ----- Brücke -----
        case "b-bruecke":
          if (verb.look) return ["Eine lange Brücke über den großen See. Da vorne, der große Hügel: Da müssen wir hin."];
          return;
        case "b-schilf":
          if (verb.look) return ["Überall Schilf. Und am Wegesrand gelbe Blüten."];
          if (verb.use) { if (has("kraut")) return ["Genug Johanniskraut."]; E.add("kraut"); return ["J: Das scheint mir Johanniskraut zu sein. Zerreiben … rot. Daraus kann man sich heute Abend einen schönen Tee machen.", "J: Johanniskraut, Johanniskraut, Johanniskraut …"]; }
          return;
        case "b-nessel":
          if (verb.look) return ["Brennnesseln! Und Löwenzahn. Die mögen nur nährstoffreichen Boden. Wir kommen der Zivilisation näher."];
          if (verb.use) { if (has("samen")) return ["Genug Samen."]; E.add("samen"); E.hurt(2); E.learn("brennnessel"); return ["Endlich noch ein Powersnack: Brennnesselsamen.", "H: Hab mich gestochen. Aber das ist auch nicht schlimm."]; }
          return;
        case "b-birke":
          if (verb.look) return ["Endlich Schatten. Jeder Schatten ist dankbar."];
          if (verb.use) { E.stat("fourth", 20); E.stat("thirst", -3); E.time(25); E.learn("hitze"); return ["Nackenpause im Schatten. Energie für die nächsten Meter."]; }
          return;
        case "b-stein": if (verb.use) { E.stat("fourth", 10); E.time(15); return ["Kurz hinsetzen. Fix und fertig."]; } return;
        // ----- Steg -----
        case "st-baeume":
          if (verb.look) return [E.hasGoal("schatten") ? "Unser kleiner Sonnenschutz." : "Zwei Kiefern. Hier könnte man die Plane als Sonnenschutz spannen. Ohne Tarp ginge es auch, wenn das Wetter so bleibt."];
          if (item === "plane" || item === "tarp") { if (E.hasGoal("schatten")) return ["Steht."]; E.drop(item); E.show("st-schatten"); E.goal("schatten"); E.time(20); return ["Kleinen Sonnenschutz hingezimmert. Für unser absolut fälliges Päuschen.", "Schuhe aus. Das ist das Geilste."]; }
          if (item === "schlafsack") return finish(E);
          return;
        case "st-schild":
          if (verb.look) { E.egg("flugsaurier"); return ["Hier liegt so ein altes Schild. Könnte man schon fast als Bett nehmen.", "H: Hä? Was ist das denn?", "J: Eine Libelle. Ein Schreckflug.", "H: Ein Flugsaurier."]; }
          return;
        case "st-steg":
          if (verb.look) return ["Der Steg! Damit kommen wir ins Wasser. Und angeln kann man hier auch."];
          if (item === "angel_lang" || item === "angelset" || item === "angelschnur") {
            if (item !== "angel_lang") return ["Zu kurz. Da vorne springen die Fische. Ich muss die Schnur verlängern."];
            await E.lines(["Schöne Schlaufen gelegt, weit ausgeworfen …"]);
            await E.minigame("angeln", { noBite: true, title: "Weit ausgeworfen", lose: "Der Schwimmer sieht unverändert aus." });
            E.time(30); f.angel = true;
            return ["Der hat nichts gecatcht."];
          }
          if (item === "unterhose") {
            if (E.hasGoal("fisch")) return ["Die Unterhose hat genug gelitten."];
            await E.lines(["J: Ich hab versucht, eine Reuse zu bauen. Da sollte meine lange Unterhose drüber. Zu viel Arbeit.", "J: Plan B: Unterhose unten zuknoten und das Ganze als Kescher nehmen.", "J: Hannes, wie wahrscheinlich ist das?", "H: Sehr unwahrscheinlich. Ich würde eine Pizza drauf wetten."]);
            const n = await E.minigame("kescher");
            E.goal("fisch"); E.egg("pizza");
            if (n > 0) E.persist("diavolo"); else E.unpersist("diavolo");
            if (n > 0) { E.egg("diavolo"); return ["J: ICH HAB EINEN! Winzig, aber einen!", "H: Okay … du kriegst eine Pizza. Pizza Diavolo?"]; }
            return ["f7-monster", "f7-pizza"];
          }
          if (verb.use) { E.stat("fourth", 10); return ["Füße ins Wasser halten. Hat Spaß gemacht."]; }
          return;
        case "st-see":
          if (verb.use) { E.stat("fourth", 12); E.stat("thirst", 3); return ["Mütze im See nass machen. Abkühlung!"]; }
          if (item === "filterflasche") { E.swap("filterflasche", "filterflasche_voll"); return ["Wasser! Das ging langsam zur Neige."]; }
          return;
        case "st-feuer":
          if (verb.look) return [f.feuer6 ? "Kleines Feuer. Johanniskrauttee wäre jetzt was." : "Ein Platz für ein kleines Feuer."];
          if (item === "feuerstahl") {
            if (f.feuer6) return ["Brennt."];
            if (!(await E.minigame("feuer", { title: "Feuer mit Schilf" }))) E.time(15);
            f.feuer6 = true; E.show("st-fire"); E.fire("steg6"); E.time(20);
            return ["Mein Feuerstahl … der fehlt! Irgendwie rausgefallen.", "… Feuerstahl wieder komplett. Schilf brennt gut.", "Hat gut und schnell gebrannt. Reicht für eine halbe Kanne."];
          }
          if (item === "kraut") { if (!f.feuer6) return ["Erst Feuer."]; E.drop("kraut"); E.stat("fourth", 20); E.stat("thirst", 25); return ["Johanniskrauttee. Ich tue die Pflanze als Ganzes rein, dann krieg ich sie besser rausgefischt.", "Sehr beruhigend. Und ein bisschen stimmungsaufhellend."]; }
          return;
      }
    },

    combine(a, b, E) {
      const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
      if (pair("angelset", "angelschnur")) { E.drop("angelschnur"); E.swap("angelset", "angel_lang"); E.learn("schnur"); return ["Ich lege die übereinander. Erst mit dem einen ein Knoten. Zack. Dann auf der anderen Seite.", "Jetzt haben die beide zwei Knoten. Bombenfest."]; }
    },

    async partner(id, verb, item, E) {
      if (verb.use && !E.flags.militaer) { E.flags.militaer = true; E.egg("militaer"); return ["f7-militaer", "H: Aber so lernst du, dass der Körper mehr kann, als du denkst."]; }
      if (verb.use && id === "jonas" && !E.flags.ausschlag) { E.flags.ausschlag = true; return ["J: Was mir ein bisschen Sorgen bereitet, ist mein Ausschlag am Handgelenk.", "H: Johanniskraut soll man auf Wunden reiben können."]; }
    },

    async enter(room, E) {
      if (room === "bruecke" && !E.flags.br) {
        E.flags.br = true;
        const r = await E.minigame("karte", { map: "tag6", title: "An der Straße entlang", text: "Heute geht's über Asphalt und Schotter zur Brücke. Kein Schatten, wenig Wasser: Umwege kosten Kraft.", ziel: "Da vorne: die Brücke über den großen See." });
        E.time(90 + (r && r.deadEnds ? r.deadEnds * 25 : 0)); if (r && r.deadEnds) E.stat("fourth", -5 * r.deadEnds);
        return ["Die Sonne ist schon wieder brutal. Kaum Schatten auf der Strecke.", "J: Ein Rast am Bachlauf. Der rastet, der rastet."]; }
      if (room === "steg6" && !E.flags.st) {
        E.flags.st = true; E.time(120);
        await E.lines(["Der Spot, den wir uns rausgesucht haben, ist leider Privatgrundstück."]);
        E.egg("privat");
        // Mit dem Hufeisen von Tag 5 gibt es eine glückliche Lösung mehr
        await E.encounter(E.persisted("hufeisen") ? Object.assign({}, GURT, { opts: GURT.opts.concat([{ label: "Hufeisen-Glück: nachsehen, ob die Naht noch hält", go: (E) => { E.goal("gurt"); E.stat("fourth", 5, "jonas"); return ["H: Hast du einfach Peng gemacht?", "J: Warte … die untere Naht hält noch. Ein Knoten oben, fertig.", "H: Das Hufeisen. Ich sag's ja."]; } }]) }) : GURT);
        return ["Vielleicht haben wir finally unseren Spot gefunden. Ein Steg! Damit kommen wir ins Wasser.", "f7-10von10"];
      }
    },

    // Brücke: Höhenangst klären, bevor man drübergeht
    async self(verb, item, E) {
      if (item === "samen") return;
    },

    hint(E) {
      const has = E.has, h = E.h;
      if (!E.hasGoal("aufbruch")) return "Shelter und Hängematte an den Kiefern abbauen.";
      if (h.room === "grosser-see") return "Rechts geht's zur Straße.";
      if (h.room === "bruecke" && !E.flags.bruecke) return "Die Brücke. Jonas hat Höhenangst. Mal mit ihm reden: Hand auf Jonas.";
      if (h.room === "bruecke") return "Über die Brücke, dann weiter.";
      if (!E.hasGoal("schatten")) return "Plane oder Tarp als Sonnenschutz an die zwei Kiefern links.";
      if (!E.hasGoal("ok")) return "Standort an Stefan: Handy auf die Figur selbst anwenden.";
      if (!E.hasGoal("fisch")) return has("unterhose") ? "Jonas' lange Unterhose als Kescher am Steg?" : "Angeln am Steg.";
      return "Alles erledigt. Schlafsack unter den Sonnenschutz an den Kiefern.";
    },
    sleepHint: () => "Morgen der letzte Tag. Schlafsack unter den Sonnenschutz.",

    async night(E) { await E.lines(["H: Über zehn Kilometer mit wenig Energie. Harte Sonne. Gerüstes Gepäck.", "J: Was will man mehr.", { narr: "t6e" }]); }
  };

  // Brücke und Handy auf sich selbst, Partner-Gespräch über die Brücke
  const origPartner = def.partner, origSelf = def.self;
  def.partner = async (id, verb, item, E) => {
    if (E.h.room === "bruecke" && verb.use && !E.flags.bruecke) { const r = await E.encounter(HOEHE); return r || []; }
    return origPartner(id, verb, item, E);
  };
  def.self = async (verb, item, E) => {
    if (item === "handy") { if (E.hasGoal("ok")) return ["Schon geschickt."]; E.goal("ok"); return ["Handyakku halb geladen. Gerade Stefan einen Standort geschickt mit unserem Backup. Und Handy wieder aus."]; }
    if (E.h.room === "bruecke" && verb.use && !E.flags.bruecke) return (await E.encounter(HOEHE)) || [];
    return origSelf(verb, item, E);
  };

  async function finish(E) {
    const miss = [["schatten", "der Sonnenschutz"], ["ok", "der Standort an Stefan"], ["fisch", "der Fischversuch"]].filter(([k]) => !E.hasGoal(k)).map(([, l]) => l);
    if (miss.length) return [`Noch nicht. Es fehlt noch ${miss.join(" und ")}.`];
    E.drop("schlafsack");
    await E.lines(["Rest in Peace, Leute. Wir sind durch."]);
    E.sleep(); return [];
  }

  const KREISLAUF = { title: "Kreislauf im Keller", text: "Muskulär ist alles in Ordnung. Aber schnell aufstehen? Feuer anpusten? Gerade nicht drin.", opts: [
    { label: "Erst einen Tannennadeltee, dann alles andere", go: (E) => { E.learn("kreislauf"); E.stat("fourth", 10); E.stat("fourth", 10, "jonas"); return ["H: Tee macht alles wieder fit."]; } },
    { label: "Sofort aufspringen und losgehen", go: (E) => { E.hurt(6); E.hurt(6, "jonas"); return ["J: Mir wird schwarz vor Augen. Langsam, langsam."]; } }
  ] };
  const HOEHE = { title: "Hab ich erwähnt …", text: "„… dass ich ein bisschen Höhenangst hab?“ Vor Jonas liegt die lange Brücke über den See.", opts: [
    { label: "Ganz links am Geländer gehen, Hannes geht daneben", value: ["f7-hoehenangst", "H: Nein. Wir gehen ganz links am Geländer.", "J: … Geht. Geht doch."], go: (E) => { E.flags.bruecke = true; E.goal("bruecke"); return []; } },
    { label: "Augen zu und durchrennen", value: ["J: Augen zu … AU. Gegen das Geländer."], go: (E) => { E.hurt(8, "jonas"); E.flags.bruecke = true; E.goal("bruecke"); return []; } },
    { label: "Einen anderen Weg suchen", value: ["H: Es gibt keinen anderen Weg. Nur die Brücke."], go: () => [] }
  ] };
  const GURT = { title: "Peng!", text: "Mitten auf der Straße reißt Jonas' Drybag-Gurt. Komplett aus der oberen Naht gerissen.", opts: [
    { label: "Mit Paracord eine neue Schlaufe knoten", go: (E) => { E.goal("gurt"); E.time(15); return ["H: Hast du einfach Peng gemacht?", "H: Paracord durch, Knoten, fest. Hält."]; } },
    { label: "Über beide Schultern werfen und vorne festhalten", go: (E) => { E.goal("gurt"); E.stat("fourth", -15, "jonas"); return ["H: Hast du einfach Peng gemacht?", "J: Das erwürgt mich ja. … Aber jetzt hab ich's auf beiden Schultern gleichzeitig. Vielleicht ist das ein Gewinn."]; } }
  ] };

  Ausgesetzt.day(6, def);
  window.TAG6 = { rooms: def.rooms };
})();
