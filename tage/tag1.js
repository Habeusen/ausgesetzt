// Tag 1 (Folge 1 und 2): Ausgesetzt. Getrennt, Dauerregen, abends trocken, nachts Bellen im Wald.
(function () {
  const c = (file, text, who, folge, t) => ({ file, text, who, folge, t });
  const H = "hannes", J = "jonas";
  let cordLeft = 5;

  const def = {
    title: "Ausgesetzt", weekday: "Samstag", folge: "1 und 2", clock: 14 * 60, fourth: "mood",
    intro: "Stefan hat die beiden an zwei verschiedenen Ufern ausgesetzt. Bis zur Nacht brauchen beide Trinkwasser, ein Dach, ein Feuer und müssen Stefan das OK schicken. Oben links wechselst du zwischen Hannes und Jonas.",
    outro: "Zwei Lager, zwei Feuer, zwei nasse Männer. Morgen scheint vielleicht sogar die Sonne.",
    weather: (t) => (t < 17.5 * 60 ? "regen" : t < 20.5 * 60 ? "grau" : "nacht"),
    chars: {
      hannes: { room: "hannes-lager", start: [900, 860], narr: "hannes", stats: { thirst: 55, hunger: 60, fourth: 65 },
        inv: ["messer", "feuerstahl", "filterflasche", "tarp", "paracord", "angelset", "schlafsack", "handy"] },
      jonas: { room: "jonas-wald", start: [960, 940], narr: "jonas", stats: { thirst: 55, hunger: 60, fourth: 65 },
        inv: ["kukri", "feuerstahl", "metallflasche", "plane", "powercord", "isomatte", "schlafsack", "handy"] }
    },
    goals: {
      hannes: [["water", "Trinkwasser"], ["tarp", "Unterschlupf"], ["fire", "Feuer"], ["ok", "OK an Stefan"]],
      jonas: [["water", "Trinkwasser"], ["tarp", "Unterschlupf"], ["fire", "Feuer"], ["ok", "OK an Stefan"]]
    },
    items: {
      powercord: { name: "Powercord", desc: () => `Seil mit roter Anzündwolle und 30 Metern Angelschnur drin. Noch ${cordLeft} Stücke.`, badge: () => cordLeft },
      eintopf: { name: "Schwedenwaldeintopf", desc: "Heuschrecke, Beeren, Kraut und Sprossen. Sieht furchtbar aus, riecht gut.", eat: 100, heal: 25, mood: 20, becomes: "metallflasche", say: "Schwedenwaldeintopf. Sieht aus wie Waldboden … schmeckt aber! Satt. Richtig satt." },
      waermflasche: { name: "Wärmflasche", desc: "Heiße Flasche an einer Schnur. Zum Umhängen.", mood: 25, heal: 5, becomes: "metallflasche_ok", say: "Umhängen … die trocknet sogar meine Klamotten. Wärmflasche deluxe." },
      angelset: { name: "Angelset", clip: "fisch" }
    },
    // Video-Tagebuch vor dem Schlafen
    campfire: {
      hannes: [{ label: "Wie es Jonas wohl geht", lines: ["lf-1h-jonas"] }, { label: "Was ihr heute von mir zu sehen kriegt", lines: ["lf-1h-tarp"] }],
      jonas: [{ label: "Wie es Hannes wohl geht", lines: ["lf-1j-hannes"] }, { label: "Das Wetter", lines: ["lf-1j-wetter"] }, { label: "Wildschweine und Feuer", lines: ["lf-1j-feuer"] }]
    },
    clips: {
      "lf-1h-jonas": c("ton/lf-1h-jonas.wav", "Hab gerade an Jonas gedacht. Der hat nur ein zwei mal drei Meter Zelt und nicht so hohe Schuhe wie ich. Ich glaube, dass seine Füße jetzt auch komplett durch sein müssen. Und dass der wahrscheinlich genauso eine schöne Zeit hat wie ich bisher.", "hannes", 2, 691),
      "lf-1h-tarp": c("ton/lf-1h-tarp.wav", "Oder es ist Jonas, und der zeigt euch den geilsten Content, den es gibt. Das könnte natürlich auch sehr gut sein. Aber von mir kriegt ihr nichts außer Tarpgeschichten. Und ja, ich hoffe, das wird nachher noch ein bisschen besser.", "hannes", 2, 722),
      "lf-1j-hannes": c("ton/lf-1j-hannes.wav", "Man denkt zum Beispiel darüber nach, wie es Hannes wohl geht. Ob der auch so pitschnass ist wie ich oder ein bisschen bessere Klamotten anhatte. Wahrscheinlich schon, aber irgendwann wirst du trotzdem nass. Er hatte ja auch ein bisschen Halsschmerzen, bevor es losging. Ich hoffe, das hat sich jetzt komplett gelegt oder wird jetzt auch nicht schlimmer.", "jonas", 2, 1202),
      "lf-1j-wetter": c("ton/lf-1j-wetter.wav", "Wenn so ein Kackwetter ist, die nächsten vier Tage … Samstag, Montag, Dienstag, Mittwoch. Und am Mittwoch wird es, glaube ich, erst besser. Boah. Ich hoffe, es wird früher besser, weil das schon abfuckt. Man kann halt einfach nicht so viel machen. Und es nervt, pitschnass zu sein. Ich weiß gar nicht, wie ich das in den nächsten Tagen trocken kriegen soll. Ich glaube, das wird gar nichts.", "jonas", 2, 1242),
      "lf-1j-feuer": c("ton/lf-1j-feuer.wav", "Ich hoffe, dass die ganzen Wildschweinspuren hier alt sind und die schon alles abgegrast haben und weiterziehen. Und mit dem Feuer, das war schwieriger als erwartet. Bei den Testläufen hat das viel besser geklappt. Aber da war es trocken. Mit nassem Holz ist es richtig Scheiße.", "jonas", 2, 2420),
      spoiler: c("tag1/ton/spoiler.wav", "Und, was denkt ihr, ob's Blaubeeren gibt? Spoiler: Es gibt keine.", H, 1, 609),
      "alles-voll": c("tag1/ton/alles-voll.wav", "Ich hab vorhin noch gesagt, hier wächst nichts. Es ist alles voll!", H, 1, 878),
      sascha: c("tag1/ton/sascha.wav", "Sascha, ich glaube, du warst das. Ich glaube, du hast die da angehängt für mich. Du wusstest, dass ich herkomme.", H, 1, 887),
      fisch: c("tag1/ton/fisch.wav", "Das heißt: Fisch, Fisch, Fisch und Fisch.", H, 1, 623),
      binz: c("tag1/ton/binz.wav", "Wenn ich mir einfach nur vorstelle, dass das die Ostsee ist … da ist scheiß Binz.", H, 1, 1348),
      filter: c("tag1/ton/filter.wav", "Weil da drinnen ist ein Filtersystem, was 99,9 % Bakterien, Viren und Scheiße rausfiltert.", H, 1, 1405),
      zunder: c("tag1/ton/zunder.wav", "Guckt euch an, das ist perfekt der Zunder. Damit kann ich die ganze Woche Dinge anzünden. Das wird brennen wie Scheiße.", H, 1, 1537),
      versuch: c("tag1/ton/versuch.wav", "Okay. Erster Versuch: fehlgeschlagen.", H, 1, 2252),
      feuermann: c("tag1/ton/feuermann.wav", "Ja, ja, ja, ich bin ein Feuermann! Ich krieg etwas Feuer an!", H, 1, 2278),
      "jonas-johanniskraut": c("tag1/ton/jonas-johanniskraut.wav", "Ich hab was Tolles gefunden. Das hier scheint mir Johanniskraut zu sein. Wenn man die gelben Blätter zerreibt, dann wird das rot. Damit kann man sich einen geilen Tee machen.", J, 1, 1020),
      "jonas-erdbeeren": c("tag1/ton/jonas-erdbeeren.wav", "Was lacht mich da an? Walderdbeeren, Junge, seht ihr das? Richtig viele. Kleine Plantage hier.", J, 1, 1059),
      "jonas-protein": c("tag1/ton/jonas-protein.wav", "So, erster Proteinkollege gefunden.", J, 1, 1586),
      "jonas-jackpot": c("tag1/ton/jonas-jackpot.wav", "Eigentlich hat man sowas nur im Frühjahr. Aber Jackpot, nice!", J, 1, 1632),
      "jonas-wildschwein": c("tag1/ton/jonas-wildschwein.wav", "Auf dem Weg hierher hab ich wieder so viele Wildschweinspuren gesehen. Ich glaube, die sind hier richtig viel unterwegs.", J, 1, 1760),
      "jonas-ast": c("tag1/ton/jonas-ast.wav", "War nur der scheiß Ast. Da ging mir der Puls grad mal kurz hoch.", J, 1, 1810),
      "jonas-umzingelt": c("tag1/ton/jonas-umzingelt.wav", "Ich hab die ganze Zeit das Szenario: Ich lieg im Tarp und hör auf einmal die Geräusche. Spring raus und seh: Ich bin umzingelt von Wildschweinen. Was dann?", J, 1, 1823),
      "jonas-platte": c("tag1/ton/jonas-platte.wav", "Was hat der denn für eine Platte freigelegt? Fettes Teil!", J, 1, 2700),
      "jonas-harz": c("tag1/ton/jonas-harz.wav", "Das riecht so geil, wirklich. Könnte ich den ganzen Tag schnuppern.", J, 1, 2809),
      "jonas-anzuender": c("tag1/ton/jonas-anzuender.wav", "Und dann hab ich einen geilen Anzünder für die ganze Woche.", J, 1, 2821),
      "f2-kroete": c("ton/f2-kroete.wav", "Na, mein kleiner Freund. Also Hannes meint, man kann dich essen, aber ich lasse das mal.", J, 2, 298),
      "f2-experiment": c("ton/f2-experiment.wav", "Feuer-Experiment Tag 1 beende ich jetzt. Ich habe hier ein gut dampfendes Getränk.", J, 2, 1757),
      "f2-tee": c("ton/f2-tee.wav", "Tee-Rating. Kiefer-Tee. Sechs von zehn. Zwei Abzug für Nadeln.", H, 2, 2019),
      "f2-waerme": c("ton/f2-waerme.wav", "Hey, das ist der Hammer. So geil. Mir ist auch nicht mehr so kalt.", J, 2, 2123),
      "f2-revier": c("ton/f2-revier.wav", "Mein Revier.", J, 2, 3017)
    },
    narr: {
      hannes: { file: "tag1/ton/damien-black/erzaehler-1.wav", text: "Tag eins. Hannes hat seinen Platz gefunden, einen lichten Kiefernwald am Ufer des Sees. Doch bevor die Nacht kommt, braucht er sauberes Wasser, ein Dach über dem Kopf und vor allem eines: ein Feuer." },
      hannesEnd: { file: "tag1/ton/damien-black/erzaehler-2.wav", text: "Der erste Tag ist geschafft. Nass bis auf die Knochen, aber mit einem Feuer, das gegen die Dunkelheit des Nordens anbrennt." },
      jonas: { file: "tag1/ton/damien-black/erzaehler-3.wav", text: "Ein paar Kilometer weiter westlich kämpft Jonas mit ganz anderen Sorgen. Sein Wald ist dunkel und dicht, und überall im Moos sind die Spuren von Wildschweinen." },
      beide: { file: "tag1/ton/damien-black/erzaehler-4.wav", text: "Zwei Männer, zwei Lager, ein Ziel. Morgen werden die Wege kürzer, und der Seepferdchensee rückt näher." },
      nacht1: { file: "ton/erzaehler/damien-black/erzaehler-101.wav", text: "Die erste Nacht. Im Norden wird es um diese Zeit nie ganz dunkel. Und irgendwo im Wald antwortet etwas auf die Stille." }
    },
    journal: {
      filter: { title: "Wasser filtern", text: "Hannes' Titanflasche filtert Seewasser direkt. Jonas muss abkochen: Flasche füllen, ins Feuer stellen, bis es blubbert." },
      tarp: { title: "Tarp spannen", text: "Erst eine Leine zwischen zwei Bäume, Spannknoten, dann das Tarp darüber. Ablaufschlaufen verhindern, dass Regen an der Leine hineinläuft." },
      kienspan: { title: "Kienspan", text: "Harzgetränktes Holz aus Wurzeltellern und alten Kiefern. Brennt auch, wenn alles andere nass ist." },
      birke: { title: "Birkenrinde", text: "Die äußere Rinde der Birke enthält Öl und brennt sogar nass. Mit der Klinge in Streifen abziehen." },
      johanniskraut: { title: "Johanniskraut", text: "Gelbe Blüte mit fünf Blütenblättern. Zerreibt man sie, färbt sie sich rot. Als Tee stimmungsaufhellend, hilft auch auf Wunden." },
      zunderfaser: { title: "Zunderfaser aufdröseln", text: "Die rote Anzündwolle aus dem Powercord brennt nur, wenn man sie ganz fein auseinanderzupft. Grob gibt es nur eine kurze Flamme." },
      waermflasche: { title: "Wärmflasche", text: "Heiß abgekochte Flasche an einer Schnur um den Hals hängen. Wärmt und trocknet die Kleidung am Körper." },
      steine: { title: "Feuer auf nassem Grund", text: "Steht Wasser auf der Feuerstelle, flache Steine darauflegen. Dann liegt das Feuer über dem Wasser." }
    },
    eggs: {
      sascha: "Sascha und die Blaubeeren", ki: "Die KI-Analyse", feuermann: "Der Feuermann", stefan: "Stefan verliert die Geduld",
      gopro: "Alles nass (die GoPro-Aufnahme)", wolf: "Der peinliche Wolfsschrei", orange: "Das orange Signal",
      kroete: "Die essbare Kröte", tee: "Das Tee-Rating", revier: "Mein Revier"
    },
    noSignal: "Kein Empfang. Ich muss irgendwo höher hinauf.",

    rooms: {
      "hannes-lager": {
        where: "Hannes' Lichtung", bg: "tag1/lager-b.jpg",
        walk: [[240, 780], [420, 722], [600, 682], [880, 642], [1120, 642], [1250, 690], [1480, 722], [1600, 770], [1500, 842], [1300, 902], [1150, 1060], [640, 1060], [380, 930], [230, 860]],
        center: [900, 820], y0: 640, s0: 0.42, s1: 0.8,
        overlays: `<g id="h-fire" opacity="0" pointer-events="none"><circle cx="1285" cy="590" r="300" fill="url(#glow)"/><use href="#flames" transform="translate(1285 632) scale(1.8)"/></g>`,
        hot: {
          beeren: { name: "Blaubeeren", kneel: true, stand: [440, 742], face: 300, poly: "M206,600 L470,604 L590,690 L560,756 L236,764 Z" },
          birke: { name: "Birke", stand: [1040, 650], face: 1060, poly: "M1024,130 L1094,130 L1094,548 L1024,548 Z" },
          // Oben auf dem Granitfelsen gibt es einen Balken Empfang (der Steinring darauf hat seinen eigenen Punkt)
          fels: { name: "Großer Felsen", stand: [1500, 735], face: 1400, dot: [1340, 525], poly: "M1080,585 L1180,512 L1400,482 L1560,500 L1570,575 L1430,592 L1146,594 Z" },
          feuer: { name: "Steinring", kneel: true, stand: [1190, 676], face: 1290, poly: "M1146,596 L1426,596 L1426,672 L1146,672 Z" },
          wurzel: { name: (E) => (E.flags.baumi ? "Baumi" : "Wurzelteller"), stand: [1520, 760], face: 1700, poly: "M1556,420 L1720,336 L1900,420 L1920,700 L1712,724 L1606,560 Z" },
          "exit-ufer": { name: "Zum Ufer", stand: [250, 820], face: 0, poly: "M0,560 L210,560 L240,1080 L0,1080 Z", exit: { to: "hannes-ufer", spawn: [1820, 820], dir: -1 } }
        }
      },
      "hannes-ufer": {
        where: "Hannes' Ufer", bg: "tag1/ufer-hannes.jpg",
        walk: [[230, 700], [300, 600], [420, 560], [560, 540], [640, 600], [1150, 600], [1240, 650], [1720, 700], [1900, 730], [1900, 1060], [280, 1060], [220, 920]],
        center: [960, 840], y0: 560, s0: 0.5, s1: 0.92,
        overlays: `<mask id="bushUfer" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><path d="M600,566 Q760,548 900,558 Q1060,546 1200,556 Q1300,560 1360,574 L1360,640 L600,640 Z" fill="#fff" filter="url(#feather)"/></mask>
          <g id="h-cord" opacity="0" pointer-events="none"><path d="M772,374 Q960,372 1156,344" stroke="#3f6b35" stroke-width="6" fill="none"/></g>
          <g id="h-tarp" opacity="0" pointer-events="none">
            <!-- Schatten auf dem Boden, dann das Tarp mit First genau auf der Leine und Kanten auf dem Boden -->
            <path d="M690,590 Q960,640 1290,560 L1300,600 Q960,690 680,630 Z" fill="#0d1408" opacity="0.55" filter="url(#soft)"/>
            <image href="tag1/tarp.png" x="640" y="337" width="680" height="364" filter="url(#gradeHannes)"/>
            <!-- Abspannleinen und Heringe -->
            <g stroke="#2a2a1e" stroke-width="2" fill="none" opacity="0.85"><path d="M707,573 L668,606"/><path d="M919,637 L934,670"/><path d="M1268,540 L1310,566"/><path d="M791,369 L760,380"/></g>
            <g fill="#c9c3b0" stroke="#3a3628" stroke-width="1.5"><path d="M664,600 l6,0 l-2,12 z"/><path d="M930,664 l6,0 l-2,12 z"/><path d="M1307,560 l6,0 l-2,12 z"/></g>
            <image href="tag1/ufer-hannes.jpg" x="0" y="0" width="1920" height="1080" preserveAspectRatio="none" mask="url(#bushUfer)"/>
          </g>
          <g pointer-events="none"><g fill="#3a2c1c" stroke="#160f08" stroke-width="2"><ellipse cx="1486" cy="884" rx="9" ry="6"/><ellipse cx="1502" cy="890" rx="9" ry="6"/><ellipse cx="1494" cy="876" rx="8" ry="5"/><ellipse cx="1514" cy="880" rx="8" ry="5"/><ellipse cx="1478" cy="894" rx="7" ry="5"/></g></g>`,
        hot: {
          losung: { name: "Tierlosung", stand: [1400, 890], face: 1500, poly: "M1450,850 L1550,850 L1550,920 L1450,920 Z" },
          see: { name: "See", kneel: true, stand: [470, 590], face: 700, dot: [560, 480], poly: "M400,420 L1100,420 L1100,520 L620,560 L440,600 L360,560 Z M1190,400 L1920,400 L1920,560 L1190,520 Z" },
          kiefern: { name: "Zwei Kiefern", stand: [960, 640], face: 960, tent: [820, 620], dot: [785, 300], poly: "M748,0 L822,0 L824,560 L748,560 Z M1112,0 L1186,0 L1186,540 L1112,540 Z" },
          stamm: { name: "Umgestürzter Stamm", stand: [1400, 730], face: 1450, poly: "M1200,570 L1700,620 L1700,690 L1200,620 Z" },
          tarp: { name: "Tarp", stand: [1000, 700], face: 960, tent: [820, 620], hidden: true, poly: "M780,360 L1150,340 L1290,560 L930,650 L690,590 Z" },
          "exit-lager": { name: "Zur Lichtung", stand: [1860, 820], face: 1920, poly: "M1780,620 L1920,620 L1920,1080 L1780,1080 Z", exit: { to: "hannes-lager", spawn: [280, 800], dir: 1 } }
        }
      },
      "jonas-wald": {
        where: "Jonas' Fichtenwald", bg: "tag1/wald-jonas.jpg",
        walk: [[200, 860], [330, 760], [620, 700], [880, 680], [1010, 720], [1060, 870], [1420, 870], [1640, 780], [1820, 780], [1820, 1000], [1300, 1060], [600, 1060], [180, 1000]],
        center: [900, 940], y0: 680, s0: 0.5, s1: 0.86,
        overlays: `<mask id="bushJonas" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><path d="M160,790 Q300,770 440,786 Q560,796 700,810 L700,860 L160,860 Z" fill="#fff" filter="url(#feather)"/></mask>
          <g id="j-kraut" pointer-events="none"><path d="M808,980 q-6,-40 4,-70 M832,984 q4,-46 -2,-80 M852,980 q8,-36 18,-60" stroke="#3d6b2c" stroke-width="4" fill="none"/><g fill="#f2c62c" stroke="#8a6a10" stroke-width="1.5"><g transform="translate(812 906)"><circle r="7"/><circle cx="9" cy="-4" r="7"/><circle cx="6" cy="8" r="7"/><circle cx="-6" cy="8" r="7"/><circle cx="-9" cy="-4" r="7"/></g><g transform="translate(830 900)"><circle r="6"/><circle cx="8" cy="-3" r="6"/><circle cx="5" cy="7" r="6"/><circle cx="-5" cy="7" r="6"/><circle cx="-8" cy="-3" r="6"/></g><g transform="translate(872 918)"><circle r="6"/><circle cx="8" cy="-3" r="6"/><circle cx="5" cy="7" r="6"/><circle cx="-5" cy="7" r="6"/><circle cx="-8" cy="-3" r="6"/></g></g><g fill="#c98a12"><circle cx="812" cy="908" r="3"/><circle cx="830" cy="902" r="3"/><circle cx="872" cy="920" r="3"/></g></g>
          <g id="j-beeren" opacity="1" pointer-events="none"><g fill="#2f5a26" stroke="#173014" stroke-width="2"><path d="M380,930 q-34,-20 -10,-44 q24,10 10,44z"/><path d="M400,936 q10,-40 44,-30 q-6,30 -44,30z"/><path d="M372,940 q-40,6 -46,-24 q34,-6 46,24z"/></g><g fill="#d62e26" stroke="#5a0e0a" stroke-width="1.5"><path d="M392,944 q10,-2 12,10 q-4,12 -12,12 q-8,0 -12,-12 q2,-12 12,-10z"/><path d="M428,950 q8,-2 10,8 q-3,10 -10,10 q-7,0 -10,-10 q2,-10 10,-8z"/><path d="M362,952 q8,-2 10,8 q-3,10 -10,10 q-7,0 -10,-10 q2,-10 10,-8z"/></g></g>
          <g id="j-cord" opacity="0" pointer-events="none"><path d="M262,540 Q400,556 540,532" stroke="#2f3236" stroke-width="5" fill="none"/></g>
          <g id="j-tarp" opacity="0" pointer-events="none"><ellipse cx="430" cy="800" rx="240" ry="34" fill="#071008" opacity="0.5" filter="url(#soft)"/><image href="tag1/plane.png" x="196" y="566" width="470" height="258" filter="url(#gradeJonas)"/><image href="tag1/wald-jonas.jpg" x="0" y="0" width="1920" height="1080" preserveAspectRatio="none" mask="url(#bushJonas)"/></g>
          <g pointer-events="none"><path d="M540,452 l10,16" stroke="#222" stroke-width="3"/><rect x="532" y="466" width="30" height="24" rx="4" fill="#1b1d20" stroke="#000" stroke-width="2"/><circle cx="551" cy="478" r="7" fill="#2b3a46" stroke="#000" stroke-width="2"/><rect x="536" y="469" width="6" height="3" fill="#c33"/></g>`,
        hot: {
          "j-gopro": { name: "GoPro", stand: [600, 800], face: 540, poly: "M524,456 L572,456 L572,498 L524,498 Z" },
          "j-totholz": { name: "Abgestorbener Baum", stand: [300, 820], face: 100, poly: "M0,596 L190,596 L196,676 L0,690 Z" },
          "j-fichten": { name: "Zwei Fichten", tent: [430, 790], stand: [420, 820], face: 400, dot: [250, 420], poly: "M196,0 L304,0 L312,830 L190,830 Z M488,0 L586,0 L600,780 L470,780 Z" },
          "j-wurzel": { name: "Wurzelteller", stand: [1120, 880], face: 1300, poly: "M1012,250 L1300,250 L1600,400 L1600,700 L1030,690 Z" },
          "j-ueberhang": { name: "Felsvorsprung", stand: [1700, 820], face: 1760, poly: "M1500,300 L1920,300 L1920,590 L1600,590 L1560,420 Z" },
          "j-spuren": { name: "Wühlspuren", stand: [700, 840], face: 760, poly: "M600,700 L870,680 L910,770 L620,790 Z" },
          "j-kraut": { name: "Gelbe Blüten", kneel: true, stand: [720, 1000], face: 830, poly: "M780,880 L900,880 L900,990 L780,990 Z" },
          "j-beeren": { name: "Rote Beeren", kneel: true, stand: [540, 980], face: 400, poly: "M320,880 L460,880 L460,980 L320,980 Z" },
          "j-plane": { name: "Hornbach-Plane", tent: [430, 790], stand: [560, 860], face: 420, hidden: true, poly: "M230,640 L620,600 L660,800 L210,820 Z" },
          "exit-see": { name: "Zum See", stand: [230, 920], face: 0, poly: "M0,620 L180,620 L180,1080 L0,1080 Z", exit: { to: "jonas-see", spawn: [1780, 900], dir: -1 } }
        }
      },
      "jonas-see": {
        where: "Jonas' Felsufer", bg: "tag1/see-jonas.jpg",
        walk: [[450, 800], [560, 760], [640, 680], [760, 650], [900, 700], [1300, 700], [1600, 790], [1900, 790], [1900, 1060], [300, 1060], [300, 880]],
        center: [1000, 900], y0: 640, s0: 0.5, s1: 0.95,
        overlays: `<g id="j-steine" opacity="0" pointer-events="none"><radialGradient id="nassStein" cx="0.4" cy="0.3"><stop offset="0" stop-color="#74706a"/><stop offset="0.55" stop-color="#3e3b36"/><stop offset="1" stop-color="#1c1a17"/></radialGradient><g filter="url(#gradeJonas)"><ellipse cx="1212" cy="668" rx="130" ry="20" fill="url(#shadowGrad)"/><g stroke="#14120f" stroke-width="1.6" stroke-linejoin="round"><path d="M1104,652 q4,-18 30,-20 q30,-2 40,14 q4,14 -18,20 q-40,6 -52,-14 z" fill="url(#nassStein)"/><path d="M1170,664 q2,-24 40,-26 q40,0 46,20 q2,16 -30,20 q-48,4 -56,-14 z" fill="url(#nassStein)"/><path d="M1250,650 q8,-18 34,-18 q28,2 30,18 q-2,14 -30,16 q-30,0 -34,-16 z" fill="url(#nassStein)"/><path d="M1150,632 q6,-14 28,-14 q22,2 24,14 q-4,10 -26,10 q-22,0 -26,-10 z" fill="url(#nassStein)"/><path d="M1222,628 q6,-14 30,-12 q24,2 22,14 q-4,10 -26,10 q-24,0 -26,-12 z" fill="url(#nassStein)"/></g><g fill="none" stroke="#e8eef2" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round"><path d="M1120,642 q14,-8 30,-6"/><path d="M1190,650 q16,-8 36,-6"/><path d="M1264,640 q12,-6 26,-4"/><path d="M1164,626 q10,-5 20,-4"/></g></g></g>
          <g id="j-holzshelter" opacity="0" pointer-events="none"><pattern id="stroh" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-58)"><rect width="14" height="14" fill="#7d6a3e"/><path d="M0,3 h14" stroke="#b39a5e" stroke-width="2"/><path d="M0,8 h14" stroke="#5a4826" stroke-width="1.6"/><path d="M0,12 h14" stroke="#9c8650" stroke-width="1.4"/></pattern><linearGradient id="strohSchatten" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></linearGradient><ellipse cx="1465" cy="828" rx="175" ry="24" fill="url(#shadowGrad)"/><g filter="url(#gradeJonas)" opacity="0.92"><path d="M1336,820 L1420,664 L1506,820 Z" fill="#120d08"/><g stroke="#1a120a" stroke-width="2"><rect x="1360" y="788" width="120" height="16" rx="8" fill="#5e4026"/><rect x="1372" y="770" width="104" height="15" rx="7" fill="#6a4a2c"/><rect x="1388" y="753" width="80" height="14" rx="7" fill="#5e4026"/></g><g fill="#c49a64" stroke="#3a2614" stroke-width="1.5"><ellipse cx="1474" cy="796" rx="6" ry="8"/><ellipse cx="1470" cy="777" rx="6" ry="7.5"/><ellipse cx="1462" cy="760" rx="5.5" ry="7"/></g><path d="M1418,662 L1604,704 Q1580,760 1530,830 L1506,822 Z" fill="url(#stroh)" stroke="#2a1f12" stroke-width="3" stroke-linejoin="round"/><path d="M1418,662 L1604,704 Q1580,760 1530,830 L1506,822 Z" fill="url(#strohSchatten)"/><path d="M1424,672 L1600,712 M1446,712 L1590,744 M1468,752 L1572,780" stroke="#c9b070" stroke-opacity="0.35" stroke-width="3" fill="none"/><path d="M1330,824 L1420,660 L1512,824" stroke="#2a1f16" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M1330,824 L1420,660 L1512,824" stroke="#6a4e30" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M1408,654 L1612,702" stroke="#2a1f16" stroke-width="10" stroke-linecap="round"/><path d="M1408,654 L1612,702" stroke="#6a4e30" stroke-width="4" stroke-linecap="round"/><path d="M1500,812 q16,-6 30,8 M1590,716 q14,4 18,16 M1440,668 q-10,-12 -4,-22" stroke="#a88e54" stroke-width="2" fill="none" stroke-linecap="round"/></g></g>
          <g id="j-fire" opacity="0" pointer-events="none"><circle cx="1210" cy="600" r="300" fill="url(#glow)"/><use href="#flames" transform="translate(1210 646) scale(1.6)"/></g>
          <g id="j-skelett" pointer-events="none"><path d="M330,742 q60,-18 120,0" stroke="#d8d2c0" stroke-width="5" fill="none"/><path d="M350,742 l-8,-12 M366,738 l-6,-14 M382,736 l-4,-15 M398,736 l0,-15 M414,738 l4,-14 M430,740 l6,-12" stroke="#d8d2c0" stroke-width="3"/><path d="M450,742 l22,-10 l0,20 z" fill="none" stroke="#d8d2c0" stroke-width="3"/><circle cx="326" cy="742" r="8" fill="none" stroke="#d8d2c0" stroke-width="3"/></g>
          <g id="j-kroete" pointer-events="none"><ellipse cx="880" cy="934" rx="26" ry="16" fill="#6a5a34" stroke="#2a2010" stroke-width="2"/><circle cx="866" cy="922" r="6" fill="#7a6a40" stroke="#2a2010" stroke-width="2"/><circle cx="866" cy="921" r="2.4" fill="#111"/><circle cx="890" cy="926" r="3" fill="#4a3e22"/><circle cx="878" cy="940" r="2.5" fill="#4a3e22"/></g>`,
        hot: {
          "j-see": { name: "See", kneel: true, stand: [620, 740], face: 400, poly: "M0,400 L700,400 L700,520 L560,620 L470,700 L0,700 Z" },
          "j-skelett": { name: "Etwas Helles im Wasser", kneel: true, stand: [560, 770], face: 380, poly: "M300,712 L490,712 L490,770 L300,770 Z" },
          "j-steine": { name: "Lose Steine", kneel: true, stand: [660, 790], face: 600, poly: "M520,690 L760,620 L780,720 L640,800 L520,780 Z" },
          "j-kroete": { name: "Kröte", stand: [800, 960], face: 880, poly: "M840,905 L920,905 L920,960 L840,960 Z" },
          "j-feuer": { name: "Platte unterm Felsen", kneel: true, stand: [1120, 740], face: 1210, poly: "M1000,560 L1460,560 L1460,690 L1000,690 Z" },
          "j-ueberhang-see": { name: "Felsüberhang", stand: [1100, 740], face: 1200, poly: "M880,300 L1700,260 L1720,520 L1100,470 L880,380 Z" },
          "j-astgabeln": { name: "Zwei Astgabeln", stand: [1300, 860], face: 1420, poly: "M1270,700 L1580,700 L1560,840 L1270,800 Z" },
          "exit-wald": { name: "In den Wald", stand: [1860, 900], face: 1920, poly: "M1780,680 L1920,680 L1920,1080 L1780,1080 Z", exit: { to: "jonas-wald", spawn: [240, 900], dir: 1 } }
        }
      }
    },

    setup() { cordLeft = 5; },

    encounters: null,
    async act(key, verb, item, E) {
      const h = E.h, f = h.flags, has = E.has;
      const sendOk = (climb) => {
        if (E.hasGoal("ok")) { E.egg("stefan"); return ["Noch ein OK hinterher …", "S: Einmal am Tag reicht. Akku sparen, ihr Helden."]; }
        E.goal("ok");
        return [climb, "OK und Standort an Stefan geschickt.", "S: 👍 Viel Spaß. Und denkt an die Zecken."];
      };
      switch (key) {
        // ----- Hannes -----
        case "see":
          if (verb.look) return ["binz"];
          if (verb.use) return ["Mit der Hand schöpfen? Lieber mit meiner coolen Wasserflasche."];
          if (item === "filterflasche") { E.swap("filterflasche", "filterflasche_voll"); E.goal("water"); E.learn("filter"); return ["Aufmachen, eintauchen, nicht reinfallen …", "filter"]; }
          if (item === "filterflasche_voll") return ["Die ist schon voll."];
          if (item === "angelset") return ["fisch", "Aber ohne Köder beißt hier nichts. Ich brauche was Krabbeliges für den Haken."];
          if (item === "angel_bereit") {
            E.time(20); E.swap("angel_bereit", "angelset");
            if (await E.minigame("angeln", { title: "Wurm am Haken" })) { E.add("fisch"); return ["Ein Barsch! Fisch, Fisch und Fisch!"]; }
            E.h.flags.wurm = false; return ["Wurm weg, Fisch weg.", "Ich brauche einen neuen Köder."];
          }
          return;
        case "losung":
          if (verb.look) return ["Tierlosung. Keine Ahnung, was es ist. Ich hab keinen Bock auf dich."];
          if (verb.use) return ["Anfassen? Ganz sicher nicht."];
          if (item === "handy") { E.egg("ki"); await E.encounter(KI); return []; }
          return ["Damit stocher ich da nicht drin rum."];
        case "kiefern":
          if (verb.look) return [E.hasGoal("tarp") ? "Mein Zuhause für heute Nacht." : "Zwei Kiefern, schön gerade und ein paar Meter auseinander. Perfekt für mein Tarp."];
          if (verb.use) {
            if (!has("kiefernnadeln") && !f.nadeln) { f.nadeln = true; E.add("kiefernnadeln"); return ["Ein paar frische Kiefernnadeln abzupfen. Für die Zähne oder einen Tee."]; }
            return [f.cord ? "Die Leine hält." : "Die stehen gut. Jetzt brauche ich eine Leine dazwischen."];
          }
          if (item === "paracord") { E.drop("paracord"); f.cord = true; E.show("h-cord"); return ["Leine zwischen die Kiefern, Spannknoten, festziehen. Hält."]; }
          if (item === "tarp") {
            if (!f.cord) return ["Ohne Leine hängt das Tarp nur traurig rum."];
            E.drop("tarp"); E.goal("tarp"); E.show("h-tarp"); E.hot("tarp", true); E.learn("tarp");
            return ["Tarp drüber, Ablaufschlaufen rein, damit der Regen nicht reinläuft …", "So, Leute. Zelt steht!"];
          }
          if (item === "schlafsack") return E.hasGoal("tarp") ? finish(E) : ["Erst brauche ich ein Dach über dem Kopf."];
          return;
        case "stamm":
          if (verb.look) return ["Ein umgestürzter, morscher Stamm. Den will ich haben."];
          if (verb.use) {
            if (f.bank) return ["Meine Bank."];
            f.bank = true; E.stat("health", 8); E.stat("fourth", 15); E.time(20);
            return ["Hingesetzt. Jetzt hab ich eine perfekte Bank, genau das, was ich wollte.", "Füße ausziehen, Socken auswringen. Tut gut."];
          }
          if (item === "beeren") { E.drop("beeren"); E.stat("hunger", 18); E.stat("fourth", 8); return ["Auf der Bank sitzen und Blaubeeren snacken. Schön."]; }
          return;
        case "tarp":
          if (verb.look) return ["Mein Tarp. Ablaufschlaufen drin, hält dicht. Hoffentlich."];
          if (verb.use) return ["Kurz drunter setzen … Der Boden ist klitschnass. Ich brauche meinen Schlafsack hier drin."];
          if (item === "schlafsack") return finish(E);
          return ["Das muss nicht unters Tarp."];
        case "beeren":
          if (verb.look) {
            if (!f.beeren) { f.beeren = true; E.egg("sascha"); return ["spoiler", "… Moment mal.", "alles-voll", "sascha"]; }
            return ["Blaubeeren ohne Ende."];
          }
          if (verb.use) {
            if (has("beeren")) return ["Ich hab schon eine Handvoll."];
            if (!f.otter) { f.otter = true; await E.encounter(OTTER); return []; }
            E.add("beeren"); return ["Die nehme ich mit. Frisch vom Strauch."];
          }
          return ["Die Beeren brauchen keine Hilfe."];
        case "fels":
          if (verb.look) return ["Ein großer Granitfelsen. Von da oben hat man bestimmt Empfang."];
          if (verb.use || item === "handy") {
            if (!has("handy")) return ["Ohne Handy brauch ich da nicht hoch."];
            // Hannes klettert sichtbar hoch, schickt das OK und kommt wieder runter
            const unten = [h.x, h.y];
            await E.climb(E.active, 1440, 548, 0, -1); E.time(10);
            await E.lines(sendOk("Rauf auf den Felsen … oben ein Balken!"));
            await E.climb(E.active, unten[0], unten[1], 0, 1);
            return [];
          }
          return ["Das brauch ich da oben nicht."];
        case "birke":
          if (verb.look) return ["Eine Birke. Die äußere Rinde brennt sogar, wenn sie nass ist."];
          if (verb.use) return ["Mit den Fingern krieg ich die Rinde nicht ab. Ich brauche eine Klinge."];
          if (item === "messer") { if (has("rinde") || E.hasGoal("fire")) return ["Genug Rinde für heute."]; E.add("rinde"); E.learn("birke"); return ["Ein paar Streifen von der äußeren Rinde. Ab in die Tasche."]; }
          return ["Damit krieg ich keine Rinde ab."];
        case "wurzel":
          if (verb.look) {
            if (f.wurzelSeen && !E.flags.baumi) { E.flags.baumi = true; E.egg("baumi"); return ["Weißt du was? Du heißt ab jetzt Baumi.", "Baumi, mein Bester. Du hast so viel Harz für mich."]; }
            f.wurzelSeen = true; return ["Eine umgekippte Kiefer. In den Wurzeln steckt Harz ohne Ende."];
          }
          if (verb.use) {
            if (!f.wurm) { f.wurm = true; E.add("wurm"); return ["Ich wühl mal in der Erde unter der Wurzel …", "Da kringelt sich ein fetter Regenwurm. Köder!"]; }
            return ["Riecht nach Harz. Aber mit bloßen Händen krieg ich da nix raus."];
          }
          if (item === "messer") { if (has("kienspan") || E.hasGoal("fire")) return ["Ich hab schon genug Kienspan."]; E.add("kienspan"); E.learn("kienspan"); return ["Ein Stück Wurzel freischnitzen …", "zunder"]; }
          return ["Da brauche ich eine Klinge."];
        case "feuer":
          if (verb.look) return [E.hasGoal("fire") ? "Das brennt. Endlich." : "Ein Steinring auf dem Felsen, leicht geschützt. Da war schon mal jemand vor mir."];
          if (verb.use) {
            if (!E.hasGoal("fire")) return ["Feuer macht sich nicht von allein. Ich brauche den Feuerstahl."];
            if (!f.socken) { f.socken = true; E.stat("fourth", 20); E.stat("health", 6); E.time(30); return ["Schuhe aus, Socken auf einen Stock, ab ans Feuer.", "Da ist frei, da ist ein bisschen Sonne, da ist das Feuer. So macht mir Survival Spaß."]; }
            return ["Schön warm. Die Socken sind fast trocken."];
          }
          if (item === "feuerstahl") {
            if (E.hasGoal("fire")) return ["Brennt doch schon."];
            if (has("kienspan") && has("rinde")) { if (!(await E.minigame("feuer", { wet: true }))) E.time(20); E.drop("kienspan"); E.drop("rinde"); E.goal("fire"); E.show("h-fire"); E.fire("hannes-lager"); return ["Erst mal ein bisschen Zunder abkratzen, Birkenrinde drauf …", "feuermann"]; }
            if (has("kienspan")) return ["Kienspan rein, Funken drauf …", "versuch", "Ich brauche noch was Feines dazu, das sofort brennt."];
            return ["Nur Funken auf nassem Moos. Ich brauche Zunder."];
          }
          if (item === "handy") return sendOk("Rauf auf den Felsen mit dem kleinen Hügel … ein Balken!");
          if (item === "kiefernnadeln") {
            if (!E.hasGoal("fire")) return ["Für Tee brauche ich erst ein Feuer."];
            if (!has("filterflasche_voll")) return ["Nadeln hab ich. Jetzt fehlt Wasser in der Titanflasche."];
            E.drop("kiefernnadeln"); E.swap("filterflasche_voll", "tee"); E.egg("tee"); E.time(20);
            return ["Nadeln rein, Flasche ans Feuer … dampft.", "f2-tee"];
          }
          if (item === "fisch") return ["Erst ausnehmen. Mit dem Messer."];
          if (item === "fisch_sauber") {
            if (!E.hasGoal("fire")) return ["Ohne Feuer wird das Sushi."];
            E.swap("fisch_sauber", "fisch_gebraten"); E.time(25); return ["Barsch auf einen Stock und übers Feuer …", "Fisch, Fisch und Fisch. Hab ich doch gesagt!"];
          }
          return ["Das verbrenne ich lieber nicht."];

        // ----- Jonas -----
        case "j-see":
          if (verb.look) return [E.flags.skelett ? "Da hinten treibt immer noch das Hechtskelett. Das Wasser trinke ich nur abgekocht." : "Da hinten ist der See. Das Wasser trink ich aber nur abgekocht."];
          if (verb.use) return ["Mit der Hand? Ich hab doch meine Metallflasche."];
          if (item === "metallflasche") { E.swap("metallflasche", "metallflasche_voll"); return ["Super rutschig hier … Flasche voll Seewasser. Abkochen muss ich das noch."]; }
          if (item === "metallflasche_voll" || item === "metallflasche_ok") return ["Die Flasche ist schon voll."];
          return;
        case "j-skelett":
          if (verb.look) { E.flags.skelett = true; return ["Ein Fischskelett. Junge, Junge, Junge.", "Von der Flosse bis zum Kopf so lang wie mein Arm. Das war bestimmt ein ordentlicher Hecht. Boah, stinkt auch.", "Deswegen: Wasser abkochen."]; }
          if (verb.use || item === "kukri") {
            if (f.skelettWeg) return ["Na gut, ich lass es da."];
            f.skelettWeg = true; E.time(10);
            return ["Ich versuch, das Ding mit einem Stock ans andere Ufer zu schleudern …", "Nein!", "Okay, noch ein Versuch. Krack … der Stock bricht.", "Na gut, ich lass es da. Ich koche das Wasser einfach ab."];
          }
          return ["Das fasse ich nicht an."];
        case "j-kroete":
          if (verb.look) return ["Eine fette Kröte. Na, mein kleiner Freund?"];
          if (verb.use || item) { E.egg("kroete"); return ["f2-kroete", "Kröten esse ich nicht. Da kenn ich mich nicht aus."]; }
          return;
        case "j-fichten":
          if (verb.look) return [E.hasGoal("tarp") ? "Mein Shelter. Sieht nett aus, oder?" : "Zwei Fichten, ein paar Meter auseinander. Wirft der mich ab? Nee, keine fetten Äste."];
          if (verb.use) {
            if (!f.sprossen) { f.sprossen = true; E.add("sprossen"); return ["Moment, hier unten an der Fichte … hellgrüne Sprossen!", "jonas-jackpot"]; }
            return [f.cord ? "Die Leine ist gespannt. Jetzt die Plane drüber." : "Ich brauche ein Seil zwischen den beiden."];
          }
          if (item === "powercord") {
            if (f.cord) return ["Die Leine hängt schon."];
            if (cordLeft <= 0) return ["Das Powercord ist alle. Zu großzügig abgeschnitten."];
            cordLeft--; f.cord = true; E.show("j-cord"); E.renderInv();
            return ["Ein Stück vom Powercord ab, erst am Baum fest, dann gegenüber ein Spannknoten. Richtig stramm gezogen."];
          }
          if (item === "plane") {
            if (!f.cord) return ["Ohne Leine hängt die Plane nur rum."];
            E.drop("plane"); E.goal("tarp"); E.show("j-tarp"); E.hot("j-plane", true); E.learn("tarp");
            return ["Plane drüber, orange Seite nach innen. Noch eine Schlaufe, damit der Regen abtropft."];
          }
          if (item === "isomatte") { if (!E.hasGoal("tarp")) return ["Erst das Dach, dann die Matte."]; E.drop("isomatte"); f.matte = true; E.stat("fourth", 10); return ["Isomatte rein. Sofort warm von unten. Ganz gemütlich."]; }
          if (item === "schlafsack") return E.hasGoal("tarp") ? finish(E) : ["Erst brauche ich ein Dach über dem Kopf."];
          return;
        case "j-plane":
          if (verb.look) {
            if (f.planeSeen) { E.egg("orange"); return ["Die orange Seite … wenn ich die nach außen drehe, sieht man die kilometerweit.", "Merk ich mir. Für den Seepferdchensee."]; }
            f.planeSeen = true; return ["Hornbach-Plane, orange Seite innen. Hätte ich mal die 4 × 3 genommen statt der 3 × 2."];
          }
          if (verb.use) return [f.matte ? "Gemütlich. Fehlt nur noch der Schlafsack." : "Auf dem nackten Boden? Da fehlt noch die Isomatte."];
          if (item === "isomatte") { E.drop("isomatte"); f.matte = true; E.stat("fourth", 10); return ["Isomatte rein. Sofort warm von unten."]; }
          if (item === "schlafsack") return finish(E);
          return ["Das muss nicht unter die Plane."];
        case "j-wurzel":
          if (verb.look) return ["jonas-platte", "In den Wurzeln von solchen Bäumen steckt unglaublich viel Harz."];
          if (verb.use) {
            if (!f.heuschrecke) { f.heuschrecke = true; E.add("heuschrecke"); return ["Da hüpft was zwischen den Wurzeln …", "jonas-protein"]; }
            return ["jonas-harz"];
          }
          if (item === "kukri") { if (has("kienspan") || E.hasGoal("fire")) return ["Ich hab schon genug Kienspan."]; E.add("kienspan"); E.learn("kienspan"); return ["Mit dem Kukri ein Stück harzige Wurzel abhacken …", "jonas-anzuender"]; }
          return ["Da brauche ich was Scharfes. Mein Kukri vielleicht."];
        case "j-gopro":
          // Die GoPro zeigt die Aufnahme von heute Morgen (Folge 1): alles nass, nasse Schuhe
          if (f.goproLeer) return [verb.look ? "Meine GoPro. Jetzt ist der Akku wirklich leer." : "Tot. Die macht heute nichts mehr."];
          await E.lines(["Mal gucken, was die GoPro heute Morgen aufgenommen hat …"]);
          await E.video({ src: "video/gopro-nass.mp4", label: "GOPRO · TAG 1 · 10:47", who: "jonas", subs: GOPRO_UT });
          f.goproLeer = true; E.egg("gopro");
          return ["… und dann war der Akku leer.", "Hat sich seitdem nicht viel geändert. Alles nass."];
        case "j-totholz":
          if (verb.look) return ["Ein längerer, abgestorbener Baum. Gutes, festes Holz zum Schnitzen."];
          if (item === "kukri") {
            if (has("moerser") || f.moerser) return ["Ich hab schon Stampfer und Mörser."];
            f.moerser = true; E.add("moerser"); E.stat("fourth", 12); E.time(30);
            return ["Ein Klotz ab, aushöhlen, noch ein Stampfer dazu …", "Mr. Hammer macht seinen eigenen Hammer. Und einen Mörser."];
          }
          if (verb.use) return ["Mit den Händen? Da brauche ich mein Kukri."];
          return ["Damit schnitz ich nichts."];
        case "j-ueberhang":
          if (verb.look) return ["Ein Felsvorsprung. Darunter bleibt es bestimmt trocken. Und oben drauf hat man bestimmt Empfang."];
          if (item === "handy") {
            // Jonas kraxelt sichtbar auf den Felsvorsprung und wieder runter
            const unten = [h.x, h.y];
            await E.climb(E.active, 1690, 606, 0, 1); E.time(10);
            await E.lines(sendOk("Ich kraxel auf den Felsvorsprung … ein Balken!"));
            await E.climb(E.active, unten[0], unten[1], 0, -1);
            return [];
          }
          if (verb.use || item) { if (has("reisig") || E.hasGoal("fire")) return ["Mehr trockenes Zeug brauche ich heute nicht."]; E.add("reisig"); return ["Kurz unterstellen … und hier liegt sautrockenes Zeug! Das gibt mir Feuergarantie."]; }
          return;
        case "j-spuren":
          if (verb.look) {
            if (!f.spuren) { f.spuren = true; return ["Überall umgewühltes Moos.", "jonas-wildschwein", "jonas-umzingelt"]; }
            return ["Wildschweinspuren. Ich schau mich lieber alle zehn Meter um."];
          }
          if (verb.use) {
            if (!f.schwein) { f.schwein = true; await E.encounter(WILDSCHWEIN); return []; }
            return ["*KNACK*", "jonas-ast"];
          }
          return ["Nee. Da lass ich lieber die Finger von."];
        case "j-steine":
          if (verb.look) return ["Lose, faustgroße Steine am Ufer."];
          if (verb.use || item) { if (f.steine || has("steine")) return ["Genug Steine geschleppt."]; E.add("steine"); return ["Ich nehm ein paar flache Steine mit."]; }
          return;
        case "j-ueberhang-see":
          if (verb.look) return ["Leicht überdacht, aber nicht so, dass die Bäume Feuer fangen können. Und eine Steinunterlage. Perfekt."];
          return ["Der Fels steht. Da muss ich nichts machen."];
        case "j-astgabeln":
          if (verb.look) return [f.holzshelter ? "Mein Feuerholz-Shelter mit Strohdach. Da bleibt das Holz trocken." : "Zwei Astgabeln. Daraus könnte man ein kleines Dach fürs Feuerholz bauen."];
          if (verb.use || item === "kukri") {
            if (f.holzshelter) return ["Steht schon."];
            f.holzshelter = true; E.show("j-holzshelter"); E.stat("fourth", 15); E.time(30);
            return ["Die zwei Astgabeln zueinander, fertig ist das Zelt.", "Stöcke dran, trockene Gräser drüber. Mein kleiner Holzschuppen mit Strohdach."];
          }
          return ["Damit bau ich nichts."];
        case "j-feuer":
          if (verb.look) return [E.hasGoal("fire") ? "Das brennt. Feuergarantie." : f.steine ? "Steine liegen. Jetzt ist das Feuer über dem Wasser." : "Die Platte unterm Felsen. Gute Stelle, aber da steht Wasser drauf."];
          if (verb.use) return [E.hasGoal("fire") ? "Schön warm." : "Ohne Feuerstahl wird das nix."];
          if (item === "steine") { E.drop("steine"); f.steine = true; E.show("j-steine"); E.learn("steine"); return ["Steine auf die nasse Platte. So liegt das Feuer über dem Wasser."]; }
          if (item === "powercord") {
            if (has("wolle")) return ["Ich hab schon Anzündwolle."];
            if (cordLeft <= 0) return ["Das Powercord ist alle."];
            cordLeft--; E.add("wolle"); return ["Joker ziehen: ein Stück abschneiden. Da drin: rote Anzündwolle."];
          }
          if (item === "feuerstahl") {
            if (E.hasGoal("fire")) return ["Brennt doch schon."];
            if (!f.steine) return ["Auf der nassen Platte? Das Wasser muss weg, oder ich lege Steine drauf."];
            if (!has("reisig")) return ["Hier ist alles klatschnass. Das glimmt höchstens. Ich brauche trockenes Zeug."];
            if (!has("kienspan") && !has("wolle")) return ["Nur Funken auf dem Reisig. Ich brauche noch einen Anzünder."];
            if (!has("kienspan") && !f.fein) {
              const ok = await E.encounter(ZUNDER);
              if (!ok) return [];
            }
            if (!(await E.minigame("feuer", { wet: true }))) E.time(20);
            E.drop("reisig"); if (has("kienspan")) E.drop("kienspan"); else E.drop("wolle");
            E.goal("fire"); E.show("j-fire"); E.fire("jonas-see"); E.time(40);
            return ["Reisig drauf, Anzünder drunter, Funken … Bleib beim Brennen. Brenne!", "Es brennt! Feuergarantie. Läuft."];
          }
          if (item === "metallflasche_voll") {
            if (!E.hasGoal("fire")) return ["Ohne Feuer kocht da nix."];
            E.swap("metallflasche_voll", "metallflasche_ok"); E.goal("water"); E.learn("filter"); E.time(30);
            return ["Flasche ans Feuer und festhalten … dampft … blubbert.", "f2-experiment"];
          }
          if (item === "metallflasche") return ["Leer bringt das nix. Erst Wasser holen."];
          if (item === "metallflasche_ok" && !has("moerser")) return ["Schon abgekocht. Das kann ich so trinken. Oder umhängen …"];
          if (["moerser", "metallflasche_ok", "kraut", "erdbeeren", "heuschrecke", "sprossen"].includes(item)) {
            const z = ["heuschrecke", "erdbeeren", "kraut", "sprossen"].filter((x) => has(x));
            if (!E.hasGoal("fire")) return ["Ohne Feuer kein Schwedenwaldeintopf."];
            if (!has("metallflasche_ok")) return ["Ich brauche erst abgekochtes Wasser in der Flasche."];
            if (!has("moerser")) return ["Das muss alles zerstampft werden. Ich brauche einen Mörser."];
            if (z.length < 3) return [`Für einen richtigen Eintopf brauche ich mehr Zutaten. Ich hab erst ${z.length}.`];
            z.forEach((x) => E.drop(x)); E.swap("metallflasche_ok", "eintopf"); E.time(30);
            return ["Alles in den Mörser, zerstampfen, ab in die Flasche …", "Schwedenwaldeintopf. So nenne ich das mal."];
          }
          return ["Das verbrenne ich lieber nicht."];
        case "j-kraut":
          if (verb.look) return ["Fünf gelbe Blütenblätter … das kenne ich doch."];
          if (verb.use) { if (has("kraut")) return ["Ich hab schon genug Johanniskraut."]; E.add("kraut"); E.learn("johanniskraut"); return ["jonas-johanniskraut"]; }
          return ["Das pflück ich lieber mit der Hand."];
        case "j-beeren":
          if (E.flags.erdbeeren) return ["Die Plantage ist leergeräumt."];
          if (verb.look) return ["jonas-erdbeeren"];
          if (verb.use) { E.flags.erdbeeren = true; E.add("erdbeeren"); E.hide("j-beeren"); return ["Komm her, die nehm ich direkt."]; }
          return ["Die nehme ich lieber mit der Hand."];
      }
    },

    combine(a, b, E) {
      const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
      if (pair("angelset", "wurm")) { E.drop("wurm"); E.swap("angelset", "angel_bereit"); return ["Wurm auf den Haken. Sorry, Kollege."]; }
      if (pair("messer", "fisch") || pair("kukri", "fisch")) { E.swap("fisch", "fisch_sauber"); return ["Bauch auf, ausnehmen, im Moos abwischen. Fertig."]; }
      if (pair("kukri", "powercord")) {
        if (cordLeft <= 0) return ["Das Powercord ist alle."];
        if (E.has("wolle")) return ["Ich hab schon Anzündwolle."];
        cordLeft--; E.add("wolle"); return ["Ein Stück abschneiden … da drin: rote Anzündwolle."];
      }
      if (pair("metallflasche_ok", "powercord")) {
        if (cordLeft <= 0) return ["Kein Seil mehr übrig."];
        cordLeft--; E.swap("metallflasche_ok", "waermflasche"); E.learn("waermflasche"); return ["Ich mach mir eine Schnur an die heiße Flasche …", "f2-waerme"];
      }
    },

    self(verb, item, E) {
      if (verb.use && E.active === "jonas") { E.egg("wolf"); E.flags.howl = true; return ["Soll ich einen peinlichen Wolfsschrei machen? …", "Auuuuuuuuuu!", "… Das war peinlich. Aber irgendwie geil."]; }
      if (item === "feuerstahl" && E.active === "hannes") { E.egg("feuermann"); return ["feuermann", "Ich bin ein Feuermann, uh-schalala …"]; }
      if (item === "handy") return ["Kein Empfang hier unten. Ich muss irgendwo höher hinauf."];
    },

    async onSwitch(id, E) {
      if (id === "hannes" && E.flags.howl && !E.flags.howlHeard) { E.flags.howlHeard = true; return ["Was war das? Klang wie ein Wolf …", "… oder wie Jonas, der einen peinlichen Wolfsschrei macht."]; }
    },

    timed(E) {
      const h = E.h;
      if (!h.warned.regen && h.clock > 16 * 60 && !E.hasGoal("tarp")) { h.warned.regen = true; E.hurt(10); E.say(E.active === "hannes" ? "Jetzt schüttet es richtig. Meine Jacke ist durch, meine Hose ist durch …" : "Regen ohne Ende. Ich brauche dringend ein Dach!"); }
      if (E.active === "hannes" && !h.warned.hals && h.clock > 15 * 60) { h.warned.hals = true; E.hurt(5); E.say("*hust* … Halsschmerzen. Hab ich niemandem erzählt."); }
      if (E.active === "jonas" && !h.warned.zecke && h.clock > 15 * 60) { h.warned.zecke = true; E.encounter(ZECKE); }
    },

    hint(E) {
      const h = E.h, has = E.has, f = h.flags;
      if (E.active === "hannes") {
        if (h.thirst < 20 && has("filterflasche_voll")) return "Ich hab doch Wasser in der Flasche. Einfach auf mich anwenden.";
        if (h.hunger < 20) return has("beeren") ? "Die Blaubeeren im Drybag! Auf mich anwenden." : "Auf der Lichtung wachsen Blaubeeren.";
        if (!E.hasGoal("water")) return "Am Ufer links ist der See. Meine Titanflasche hineintauchen.";
        if (!E.hasGoal("tarp")) return f.cord ? "Die Leine hängt. Jetzt das Tarp über die Kiefern." : "Die zwei Kiefern am Ufer sind perfekt. Ich brauche eine Leine dazwischen: das Paracord.";
        if (!E.hasGoal("fire")) {
          if (!has("kienspan")) return "Der Wurzelteller rechts auf der Lichtung ist voller Harz. Mit dem Messer gibt das Kienspan.";
          if (!has("rinde")) return "Kienspan allein reicht nicht. Birkenrinde brennt auch nass, mit dem Messer an die Birke.";
          return "Kienspan und Rinde hab ich. Jetzt den Feuerstahl am Steinring benutzen.";
        }
        if (!E.hasGoal("ok")) return "Unten im Wald kein Empfang. Auf den großen Felsen klettern und das OK schicken.";
        if (h.fourth < 40) return "Ich brauch was für die Laune. Socken am Feuer trocknen? Kiefernnadeltee?";
        return "Alles erledigt. Schlafsack unters Tarp.";
      }
      if (h.thirst < 20 && has("metallflasche_ok")) return "Die Flasche ist abgekocht. Auf mich anwenden und trinken.";
      if (h.hunger < 20) return "Ich brauche was zu essen. Walderdbeeren, Kraut oder eine Heuschrecke aus dem Wurzelteller.";
      if (!E.hasGoal("tarp")) return f.cord ? "Die Leine steht. Jetzt die Hornbach-Plane über die Fichten." : "Zwischen die zwei Fichten muss ein Seil. Mein Powercord.";
      if (!E.hasGoal("fire")) {
        if (!has("reisig")) return "Unter dem Felsvorsprung rechts im Wald bleibt es bestimmt trocken.";
        if (!has("kienspan") && !has("wolle")) return "Ich brauche einen Anzünder. Harz aus dem Wurzelteller, mit dem Kukri. Oder die Anzündwolle aus dem Powercord.";
        if (!f.steine) return has("steine") ? "Die Steine auf die nasse Platte unterm Felsen am See legen." : "Die Platte am See ist nass. Ein paar lose Steine vom Ufer könnten helfen.";
        return "Alles da. Feuerstahl auf die Platte unterm Felsen.";
      }
      if (!E.hasGoal("water")) return has("metallflasche_voll") ? "Das Seewasser auf dem Feuer abkochen." : "Die Metallflasche am See füllen und danach abkochen.";
      if (!E.hasGoal("ok")) return "Hier unten kein Empfang. Oben auf dem Felsvorsprung im Wald vielleicht?";
      if (h.fourth < 40) return "Mir ist kalt. Die heiße Flasche an eine Schnur aus dem Powercord, als Wärmflasche?";
      return "Alles erledigt. Schlafsack unter die Plane.";
    },
    sleepHint: (E) => (E.active === "hannes" ? "Wasser, Dach, Feuer, OK an Stefan. Jetzt nur noch den Schlafsack unters Tarp." : "Wasser, Dach, Feuer, OK an Stefan. Jetzt ab mit dem Schlafsack unter die Plane."),
    halfText: (o) => `${o === "jonas" ? "Jonas" : "Hannes"} sitzt noch ohne fertiges Lager im Wald.`,

    async night(E) {
      await E.lines([{ narr: "nacht1" }]);
      E.switchTo && (await E.switchTo("jonas"));
      await E.wait(600);
      await E.lines(["J: Was war das denn? Bellt da was?", "J: Klingt wie ein Wolf. Der will ja jagen …"]);
      await E.encounter(NACHT);
      await E.lines([{ narr: "beide" }]);
    }
  };
  Ausgesetzt.day(1, def);
  // Räume und Begegnungen von Tag 1 werden an Tag 2 und 3 wiederverwendet
  window.TAG1 = { rooms: def.rooms };

  async function finish(E) {
    const miss = [!E.hasGoal("water") && "Trinkwasser", !E.hasGoal("fire") && "ein Feuer", !E.hasGoal("ok") && "das OK an Stefan"].filter(Boolean);
    if (miss.length) return [`Noch nicht schlafen. Mir fehlt noch ${miss.length > 1 ? miss.slice(0, -1).join(", ") + " und " + miss[miss.length - 1] : miss[0]}.`];
    E.drop("schlafsack");
    await E.lines([E.active === "hannes" ? "Schlafsack rein. Schuhe aus. Guten Morgen aus meinem kleinen Tarp … na ja, fast." : "Schlafsack rein. Hoffentlich lassen mich die Wildschweine heute in Ruhe."]);
    if (E.active === "hannes") await E.lines([{ narr: "hannesEnd" }]);
    E.sleep();
    return [];
  }

  const OTTER = { title: "Kreuzotter!", text: "Zwischen den Blaubeeren schlängelt sich eine kleine Kreuzotter. Hannes' Hand ist nur eine Handbreit entfernt.", opts: [
    { label: "Ganz ruhig bleiben und langsam zurückziehen", go: () => ["Ganz langsam … und weg. Kleine Kreuzotter gesehen. Abgehakt."] },
    { label: "Mit einem Stock wegschieben", go: (E) => { E.hurt(30); return ["Au! Die hat mich erwischt!", "Die Hand pocht. Das war dumm."]; } },
    { label: "Schnell die Beeren schnappen", go: (E) => { E.hurt(15); E.add("beeren"); return ["Erwischt … aber sie mich auch. Am Handrücken. Mist."]; } }
  ] };
  const WILDSCHWEIN = { title: "Wildschwein!", text: "Es knackt im Unterholz. Zwischen den Fichten steht ein Wildschwein und schaut Jonas direkt an.", opts: [
    { label: "Ruhig verhalten, normal reden, langsam zurückziehen", go: () => ["Ganz ruhig, Kollege … ich geh ja schon.", "Puh. Es trottet weg."] },
    { label: "Wegrennen", go: (E) => { E.hurt(25); return ["Ich renn los – und lieg im Matsch. Knie aufgeschlagen.", "Das Wildschwein? Hat sich nicht mal bewegt."]; } },
    { label: "Den Wolfsschrei machen", go: () => ["Auuuuuuu!", "… Es schaut mich nur komisch an und geht. Peinlich, aber wirksam."] }
  ] };
  const KI = { title: "KI-Analyse", text: "Hannes hält sein Handy über die Losung. Kein Empfang, aber die Kamera läuft. Ergebnis der Analyse: 87 % Elch, 9 % Reh, 4 % Sascha.", opts: [
    { label: "Aha.", go: () => ["Elch. Na toll. Ich hab keinen Bock auf dich, Elch."] },
    { label: "Sascha?!", go: () => ["Sascha war hier. Ich wusste es. Erst die Blaubeeren, jetzt das."] }
  ] };
  const ZECKE = { title: "Zecken", text: "Jonas merkt: Er wollte am Start die Hose in die Socken stecken. Jetzt ist alles schon pitschnass.", opts: [
    { label: "Trotzdem in die Socken stecken und nachsehen", go: () => ["Hose in die Socken. Und … eine Zecke am Knöchel, rechtzeitig erwischt."] },
    { label: "Egal, weiter", go: (E) => { E.hurt(10); return ["Später juckt's am Bein. Da sitzt eine Zecke fest. Toll."]; } }
  ] };
  // Untertitel zum GoPro-Video (Sekunden im Clip)
  const GOPRO_UT = [[0, 3.6, "Und hier ist alles nass. Und ich hab nasse Schuhe."], [4.8, 5.6, "Ja, geil."], [6.2, 7.9, "Boah, das ist … Oh, fuck, ey."], [9.1, 9.5, "Nein."],
    [13.3, 19.2, "Gerade durch nasses Gras gegangen, das hat es einfach direkt durchgelassen."], [19.6, 21.3, "Ich hab die auch noch imprägniert, die scheiß Schuhe."], [21.4, 25.8, "Fuck, ich hätte besser Gummistiefel genommen."]];
  const ZUNDER = { title: "Anzündwolle", text: "Die rote Faser aus dem Powercord liegt in Jonas' Hand. Draußen ist alles nass, es geht Wind.", opts: [
    { label: "So wie sie ist auf das Reisig legen", value: false, go: (E) => { E.time(15); return ["Funken drauf … kurze Flamme … und weg.", "Wiederholter Fehlversuch. Fucking fuck."]; } },
    { label: "Grob in zwei Stücke reißen", value: false, go: (E) => { E.time(15); return ["Ein bisschen geschmort. Nicht aufgegangen.", "Es hat kurz gebrannt … war zu viel Wind."]; } },
    { label: "Ganz fein aufdröseln, jeden Faden einzeln auseinanderzupfen", value: true, go: (E) => { E.h.flags.fein = true; E.learn("zunderfaser"); return ["Jeden Garn wirklich so auseinandergedreht und gezibbelt …"]; } }
  ] };
  const NACHT = { title: "Gebell in der Nacht", text: "Aus dem Wald kommt ein heiseres, aggressives Bellen. Jonas liegt allein unter seiner Plane.", opts: [
    { label: "Gegen die Kanne klopfen", go: (E) => { E.unpersist("nachtmesser"); return ["*klong klong klong*", "J: … Seitdem ich gegen die Kanne geklopft hab, hör ich nix mehr."]; } },
    // Wirkt nach: Jonas startet Tag 2 übermüdet
    { label: "Mit dem Messer in der Hand schlafen", go: (E) => { E.persist("nachtmesser"); E.stat("fourth", -10, "jonas"); return ["J: Ich will jetzt gleich mit dem Messer schlafen. An Pennen ist nicht zu denken."]; } },
    { label: "Einen Kreis ums Zelt pinkeln", go: (E) => { E.unpersist("nachtmesser"); E.egg("revier"); return ["J: Wölfe meiden Menschen. Und Menschen-Urin riecht nach Mensch. Also …", "J: Wie so ein Anti-Schwedenkreis.", "f2-revier", "J: … Jetzt habe ich wieder nasse Füße."]; } }
  ] };
})();
