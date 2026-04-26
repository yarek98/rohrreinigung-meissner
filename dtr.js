/**
 * DTR (Dynamic Text Replacement) System
 * Rohrreinigung Meißner
 *
 * Reads ?keyword= from Google Ads Tracking Template
 * Extracts city name and replaces .city-name and .city-name-inline spans
 * Detects region for footer legal links and impressum routing
 *
 * Tracking Template:
 * {lpurl}?keyword={keyword}&gclid={gclid}&gbraid={gbraid}&wbraid={wbraid}&utm_source=google&utm_medium=cpc&utm_campaign={_campaign}&utm_term={keyword}&utm_content={creative}&matchtype={matchtype}&network={network}&device={device}&loc_physical={loc_physical_ms}&loc_interest={loc_interest_ms}&adgroup={adgroupid}&adposition={adposition}
 */

var DTR_CONFIG={
  cssClass:'city-name',
  cssClassInline:'city-name-inline',
  paramName:'keyword',
  titleSearch:'Ihrer Nähe',
  titleTemplate:'Rohrreinigung Notdienst {city} – Heute noch Termin',
  phone:'0157 92807130'
};

// Region definitions — city key → [displayName, regionId]
// regionId: muenchen, nrw, berlin, bremen, hamburg, nuernberg
var DTR_CITIES={
  // ============================================
  // MÜNCHEN / BAYERN (~539 Städte)
  // ============================================
  "abensberg":["Abensberg","muenchen"],"adelshofen":["Adelshofen","muenchen"],"adelsried":["Adelsried","muenchen"],
  "adelzhausen":["Adelzhausen","muenchen"],"adlkofen":["Adlkofen","muenchen"],"affing":["Affing","muenchen"],
  "aham":["Aham","muenchen"],"aichach":["Aichach","muenchen"],"aichen":["Aichen","muenchen"],
  "aiglsbach":["Aiglsbach","muenchen"],"aindling":["Aindling","muenchen"],"albaching":["Albaching","muenchen"],
  "allershausen":["Allershausen","muenchen"],"alling":["Alling","muenchen"],"altdorf":["Altdorf","muenchen"],
  "altenmarkt":["Altenmarkt","muenchen"],"altenstadt":["Altenstadt","muenchen"],
  "altfraunhofen":["Altfraunhofen","muenchen"],"althegnenberg":["Althegnenberg","muenchen"],
  "altomünster":["Altomünster","muenchen"],"amberg":["Amberg","muenchen"],"amerang":["Amerang","muenchen"],
  "ampfing":["Ampfing","muenchen"],"andechs":["Andechs","muenchen"],"antdorf":["Antdorf","muenchen"],
  "anzing":["Anzing","muenchen"],"apfeldorf":["Apfeldorf","muenchen"],"aresing":["Aresing","muenchen"],
  "aschau":["Aschau","muenchen"],"aschheim":["Aschheim","muenchen"],"attenhofen":["Attenhofen","muenchen"],
  "attenkirchen":["Attenkirchen","muenchen"],"au":["Au","muenchen"],"augsburg":["Augsburg","muenchen"],
  "aying":["Aying","muenchen"],"aystetten":["Aystetten","muenchen"],"aßling":["Aßling","muenchen"],
  "baar":["Baar","muenchen"],"baar-ebenhausen":["Baar-Ebenhausen","muenchen"],
  "babensham":["Babensham","muenchen"],"bad aibling":["Bad Aibling","muenchen"],
  "bad endorf":["Bad Endorf","muenchen"],"bad feilnbach":["Bad Feilnbach","muenchen"],
  "bad heilbrunn":["Bad Heilbrunn","muenchen"],"bad kohlgrub":["Bad Kohlgrub","muenchen"],
  "bad tölz":["Bad Tölz","muenchen"],"bad wiessee":["Bad Wiessee","muenchen"],
  "bad wörishofen":["Bad Wörishofen","muenchen"],"baierbach":["Baierbach","muenchen"],
  "baierbrunn":["Baierbrunn","muenchen"],"baisweil":["Baisweil","muenchen"],"baldham":["Baldham","muenchen"],
  "bayersoien":["Bayersoien","muenchen"],"bayrischzell":["Bayrischzell","muenchen"],
  "benediktbeuern":["Benediktbeuern","muenchen"],"berg":["Berg","muenchen"],"bergheim":["Bergheim","muenchen"],
  "bergkirchen":["Bergkirchen","muenchen"],"berglern":["Berglern","muenchen"],"bernau":["Bernau","muenchen"],
  "bernbeuren":["Bernbeuren","muenchen"],"bernried":["Bernried","muenchen"],"biberbach":["Biberbach","muenchen"],
  "bichl":["Bichl","muenchen"],"bidingen":["Bidingen","muenchen"],"biessenhofen":["Biessenhofen","muenchen"],
  "bobingen":["Bobingen","muenchen"],"bodenkirchen":["Bodenkirchen","muenchen"],
  "bonstetten":["Bonstetten","muenchen"],"brannenburg":["Brannenburg","muenchen"],
  "breitbrunn":["Breitbrunn","muenchen"],"bruckberg":["Bruckberg","muenchen"],
  "bruckmühl":["Bruckmühl","muenchen"],"brunnen":["Brunnen","muenchen"],"brunnthal":["Brunnthal","muenchen"],
  "buchbach":["Buchbach","muenchen"],"buchloe":["Buchloe","muenchen"],"burggen":["Burggen","muenchen"],
  "burgheim":["Burgheim","muenchen"],"buxheim":["Buxheim","muenchen"],"böbing":["Böbing","muenchen"],
  "chieming":["Chieming","muenchen"],"dachau":["Dachau","muenchen"],"dasing":["Dasing","muenchen"],
  "denklingen":["Denklingen","muenchen"],"diedorf":["Diedorf","muenchen"],
  "dietramszell":["Dietramszell","muenchen"],"dießen":["Dießen","muenchen"],
  "dinkelscherben":["Dinkelscherben","muenchen"],"dorfen":["Dorfen","muenchen"],
  "eberfing":["Eberfing","muenchen"],"ebersberg":["Ebersberg","muenchen"],"eching":["Eching","muenchen"],
  "edling":["Edling","muenchen"],"egenhofen":["Egenhofen","muenchen"],"egglkofen":["Egglkofen","muenchen"],
  "eggstätt":["Eggstätt","muenchen"],"eglfing":["Eglfing","muenchen"],"egling":["Egling","muenchen"],
  "egmating":["Egmating","muenchen"],"egweil":["Egweil","muenchen"],"ehekirchen":["Ehekirchen","muenchen"],
  "ehingen":["Ehingen","muenchen"],"eichenau":["Eichenau","muenchen"],"eiselfing":["Eiselfing","muenchen"],
  "eitensheim":["Eitensheim","muenchen"],"eitting":["Eitting","muenchen"],"ellgau":["Ellgau","muenchen"],
  "elsendorf":["Elsendorf","muenchen"],"emersacker":["Emersacker","muenchen"],
  "emmering":["Emmering","muenchen"],"engelsberg":["Engelsberg","muenchen"],
  "eppishausen":["Eppishausen","muenchen"],"erding":["Erding","muenchen"],"erdweg":["Erdweg","muenchen"],
  "eresing":["Eresing","muenchen"],"ergolding":["Ergolding","muenchen"],
  "ergoldsbach":["Ergoldsbach","muenchen"],"ernsgaden":["Ernsgaden","muenchen"],
  "eschenlohe":["Eschenlohe","muenchen"],"essenbach":["Essenbach","muenchen"],"ettal":["Ettal","muenchen"],
  "ettringen":["Ettringen","muenchen"],"eurasburg":["Eurasburg","muenchen"],
  "fahrenzhausen":["Fahrenzhausen","muenchen"],"farchant":["Farchant","muenchen"],
  "feichten":["Feichten","muenchen"],"feldafing":["Feldafing","muenchen"],
  "feldkirchen":["Feldkirchen","muenchen"],"feldkirchen-westerham":["Feldkirchen-Westerham","muenchen"],
  "finning":["Finning","muenchen"],"finsing":["Finsing","muenchen"],"fischach":["Fischach","muenchen"],
  "fischbachau":["Fischbachau","muenchen"],"flintsbach":["Flintsbach","muenchen"],
  "forstern":["Forstern","muenchen"],"forstinning":["Forstinning","muenchen"],
  "frasdorf":["Frasdorf","muenchen"],"frauenneuharting":["Frauenneuharting","muenchen"],
  "fraunberg":["Fraunberg","muenchen"],"freising":["Freising","muenchen"],
  "friedberg":["Friedberg","muenchen"],"fuchstal":["Fuchstal","muenchen"],"furth":["Furth","muenchen"],
  "fürstenfeldbruck":["Fürstenfeldbruck","muenchen"],"gablingen":["Gablingen","muenchen"],
  "gachenbach":["Gachenbach","muenchen"],"gaimersheim":["Gaimersheim","muenchen"],
  "gaißach":["Gaißach","muenchen"],"gammelsdorf":["Gammelsdorf","muenchen"],
  "garching":["Garching","muenchen"],"gars":["Gars","muenchen"],"gauting":["Gauting","muenchen"],
  "geisenfeld":["Geisenfeld","muenchen"],"geisenhausen":["Geisenhausen","muenchen"],
  "geltendorf":["Geltendorf","muenchen"],"geretsried":["Geretsried","muenchen"],
  "germaringen":["Germaringen","muenchen"],"germering":["Germering","muenchen"],
  "gerolsbach":["Gerolsbach","muenchen"],"gersthofen":["Gersthofen","muenchen"],
  "gerzen":["Gerzen","muenchen"],"gessertshausen":["Gessertshausen","muenchen"],
  "gilching":["Gilching","muenchen"],"glonn":["Glonn","muenchen"],"gmund":["Gmund","muenchen"],
  "grabenstätt":["Grabenstätt","muenchen"],"grafing":["Grafing","muenchen"],
  "grafrath":["Grafrath","muenchen"],"grasbrunn":["Grasbrunn","muenchen"],
  "grassau":["Grassau","muenchen"],"greifenberg":["Greifenberg","muenchen"],
  "griesstätt":["Griesstätt","muenchen"],"großaitingen":["Großaitingen","muenchen"],
  "großkarolinenfeld":["Großkarolinenfeld","muenchen"],"großmehring":["Großmehring","muenchen"],
  "großweil":["Großweil","muenchen"],"gräfelfing":["Gräfelfing","muenchen"],
  "gröbenzell":["Gröbenzell","muenchen"],"grünwald":["Grünwald","muenchen"],
  "gstadt":["Gstadt","muenchen"],"haag":["Haag","muenchen"],"haar":["Haar","muenchen"],
  "habach":["Habach","muenchen"],"haimhausen":["Haimhausen","muenchen"],"halblech":["Halblech","muenchen"],
  "halfing":["Halfing","muenchen"],"hallbergmoos":["Hallbergmoos","muenchen"],
  "hattenhofen":["Hattenhofen","muenchen"],"hausham":["Hausham","muenchen"],
  "hebertshausen":["Hebertshausen","muenchen"],"heldenstein":["Heldenstein","muenchen"],
  "hepberg":["Hepberg","muenchen"],"hergolding":["Hergolding","muenchen"],
  "herrsching":["Herrsching","muenchen"],"hilgertshausen-tandern":["Hilgertshausen-Tandern","muenchen"],
  "hiltenfingen":["Hiltenfingen","muenchen"],"hofstetten":["Hofstetten","muenchen"],
  "hohenbrunn":["Hohenbrunn","muenchen"],"hohenfurch":["Hohenfurch","muenchen"],
  "hohenkammer":["Hohenkammer","muenchen"],"hohenlinden":["Hohenlinden","muenchen"],
  "hohenpeißenberg":["Hohenpeißenberg","muenchen"],"hohenpolding":["Hohenpolding","muenchen"],
  "hohenthann":["Hohenthann","muenchen"],"hohenwart":["Hohenwart","muenchen"],
  "hollenbach":["Hollenbach","muenchen"],"holzheim":["Holzheim","muenchen"],
  "holzkirchen":["Holzkirchen","muenchen"],"horgau":["Horgau","muenchen"],
  "huglfing":["Huglfing","muenchen"],"hurlach":["Hurlach","muenchen"],
  "höhenkirchen-siegertsbrunn":["Höhenkirchen-Siegertsbrunn","muenchen"],
  "hörgertshausen":["Hörgertshausen","muenchen"],"höslwang":["Höslwang","muenchen"],
  "icking":["Icking","muenchen"],"iffeldorf":["Iffeldorf","muenchen"],"igling":["Igling","muenchen"],
  "ilmmünster":["Ilmmünster","muenchen"],"inchenhofen":["Inchenhofen","muenchen"],
  "ingenried":["Ingenried","muenchen"],"ingolstadt":["Ingolstadt","muenchen"],
  "inning":["Inning","muenchen"],"irschenberg":["Irschenberg","muenchen"],"irsee":["Irsee","muenchen"],
  "isen":["Isen","muenchen"],"ismaning":["Ismaning","muenchen"],"jachenau":["Jachenau","muenchen"],
  "jengen":["Jengen","muenchen"],"jesenwang":["Jesenwang","muenchen"],
  "jettenbach":["Jettenbach","muenchen"],"jetzendorf":["Jetzendorf","muenchen"],
  "kaltental":["Kaltental","muenchen"],"karlsfeld":["Karlsfeld","muenchen"],
  "karlshuld":["Karlshuld","muenchen"],"karlskron":["Karlskron","muenchen"],
  "kaufbeuren":["Kaufbeuren","muenchen"],"kaufering":["Kaufering","muenchen"],
  "kiefersfelden":["Kiefersfelden","muenchen"],"kienberg":["Kienberg","muenchen"],
  "kinsau":["Kinsau","muenchen"],"kirchberg":["Kirchberg","muenchen"],
  "kirchheim":["Kirchheim","muenchen"],"kirchseeon":["Kirchseeon","muenchen"],
  "kissing":["Kissing","muenchen"],"kochel":["Kochel","muenchen"],"kolbermoor":["Kolbermoor","muenchen"],
  "kottgeisering":["Kottgeisering","muenchen"],"kraiburg":["Kraiburg","muenchen"],
  "krailling":["Krailling","muenchen"],"kranzberg":["Kranzberg","muenchen"],
  "kreuth":["Kreuth","muenchen"],"kröning":["Kröning","muenchen"],"krün":["Krün","muenchen"],
  "kutzenhausen":["Kutzenhausen","muenchen"],"königsbrunn":["Königsbrunn","muenchen"],
  "königsdorf":["Königsdorf","muenchen"],"königsmoos":["Königsmoos","muenchen"],
  "kösching":["Kösching","muenchen"],"kühbach":["Kühbach","muenchen"],
  "lamerdingen":["Lamerdingen","muenchen"],"landsberg":["Landsberg","muenchen"],
  "landsberied":["Landsberied","muenchen"],"landshut":["Landshut","muenchen"],
  "langenbach":["Langenbach","muenchen"],"langenmosen":["Langenmosen","muenchen"],
  "langenneufnach":["Langenneufnach","muenchen"],"langenpreising":["Langenpreising","muenchen"],
  "langerringen":["Langerringen","muenchen"],"langweid":["Langweid","muenchen"],
  "laugna":["Laugna","muenchen"],"lechbruck":["Lechbruck","muenchen"],"lengdorf":["Lengdorf","muenchen"],
  "lenggries":["Lenggries","muenchen"],"lenting":["Lenting","muenchen"],"mainburg":["Mainburg","muenchen"],
  "maisach":["Maisach","muenchen"],"maitenbeth":["Maitenbeth","muenchen"],
  "mammendorf":["Mammendorf","muenchen"],"manching":["Manching","muenchen"],
  "markt indersdorf":["Markt Indersdorf","muenchen"],"markt schwaben":["Markt Schwaben","muenchen"],
  "markt wald":["Markt Wald","muenchen"],"marquartstein":["Marquartstein","muenchen"],
  "marzling":["Marzling","muenchen"],"mauern":["Mauern","muenchen"],
  "mauerstetten":["Mauerstetten","muenchen"],"meitingen":["Meitingen","muenchen"],
  "merching":["Merching","muenchen"],"mering":["Mering","muenchen"],
  "mettenheim":["Mettenheim","muenchen"],"mickhausen":["Mickhausen","muenchen"],
  "miesbach":["Miesbach","muenchen"],"mindelstetten":["Mindelstetten","muenchen"],
  "mittelneufnach":["Mittelneufnach","muenchen"],"mittelstetten":["Mittelstetten","muenchen"],
  "mittenwald":["Mittenwald","muenchen"],"moorenweis":["Moorenweis","muenchen"],
  "moosach":["Moosach","muenchen"],"moosburg":["Moosburg","muenchen"],
  "moosinning":["Moosinning","muenchen"],"murnau":["Murnau","muenchen"],
  "mühldorf":["Mühldorf","muenchen"],"münchen":["München","muenchen"],
  "münchsmünster":["Münchsmünster","muenchen"],"münsing":["Münsing","muenchen"],
  "nandlstadt":["Nandlstadt","muenchen"],"nassenfels":["Nassenfels","muenchen"],
  "neubeuern":["Neubeuern","muenchen"],"neubiberg":["Neubiberg","muenchen"],
  "neuburg":["Neuburg","muenchen"],"neuching":["Neuching","muenchen"],
  "neufahrn":["Neufahrn","muenchen"],"neufraunhofen":["Neufraunhofen","muenchen"],
  "neumarkt-sankt veit":["Neumarkt-Sankt Veit","muenchen"],"neuried":["Neuried","muenchen"],
  "neustadt":["Neustadt","muenchen"],"neusäß":["Neusäß","muenchen"],
  "niederaichbach":["Niederaichbach","muenchen"],"niederviehbach":["Niederviehbach","muenchen"],
  "nordendorf":["Nordendorf","muenchen"],"nußdorf":["Nußdorf","muenchen"],
  "oberammergau":["Oberammergau","muenchen"],"oberau":["Oberau","muenchen"],
  "oberaudorf":["Oberaudorf","muenchen"],"oberbergkirchen":["Oberbergkirchen","muenchen"],
  "oberding":["Oberding","muenchen"],"oberdolling":["Oberdolling","muenchen"],
  "obergriesbach":["Obergriesbach","muenchen"],"oberhaching":["Oberhaching","muenchen"],
  "oberndorf":["Oberndorf","muenchen"],"oberneukirchen":["Oberneukirchen","muenchen"],
  "oberostendorf":["Oberostendorf","muenchen"],"oberottmarshausen":["Oberottmarshausen","muenchen"],
  "oberpframmern":["Oberpframmern","muenchen"],"oberschleißheim":["Oberschleißheim","muenchen"],
  "oberschweinbach":["Oberschweinbach","muenchen"],"obersöchering":["Obersöchering","muenchen"],
  "obersüßbach":["Obersüßbach","muenchen"],"obing":["Obing","muenchen"],
  "odelzhausen":["Odelzhausen","muenchen"],"ohlstadt":["Ohlstadt","muenchen"],
  "olching":["Olching","muenchen"],"otterfing":["Otterfing","muenchen"],
  "ottobrunn":["Ottobrunn","muenchen"],"parsdorf":["Parsdorf","muenchen"],
  "pastetten":["Pastetten","muenchen"],"paunzhausen":["Paunzhausen","muenchen"],
  "peiting":["Peiting","muenchen"],"peißenberg":["Peißenberg","muenchen"],
  "pentenried":["Pentenried","muenchen"],"penzberg":["Penzberg","muenchen"],
  "penzing":["Penzing","muenchen"],"petersdorf":["Petersdorf","muenchen"],
  "petershausen":["Petershausen","muenchen"],"pfaffenhofen":["Pfaffenhofen","muenchen"],
  "pfaffing":["Pfaffing","muenchen"],"pfeffenhausen":["Pfeffenhausen","muenchen"],
  "pforzen":["Pforzen","muenchen"],"pförring":["Pförring","muenchen"],
  "pittenhart":["Pittenhart","muenchen"],"planegg":["Planegg","muenchen"],
  "pliening":["Pliening","muenchen"],"poing":["Poing","muenchen"],"polling":["Polling","muenchen"],
  "postau":["Postau","muenchen"],"prem":["Prem","muenchen"],"prien":["Prien","muenchen"],
  "prittriching":["Prittriching","muenchen"],"prutting":["Prutting","muenchen"],
  "puchheim":["Puchheim","muenchen"],"pullach":["Pullach","muenchen"],
  "putzbrunn":["Putzbrunn","muenchen"],"pähl":["Pähl","muenchen"],"pöcking":["Pöcking","muenchen"],
  "pörnbach":["Pörnbach","muenchen"],"pöttmes":["Pöttmes","muenchen"],"pürgen":["Pürgen","muenchen"],
  "rain":["Rain","muenchen"],"raisting":["Raisting","muenchen"],"ramerberg":["Ramerberg","muenchen"],
  "rammingen":["Rammingen","muenchen"],"raubling":["Raubling","muenchen"],
  "rechtmehring":["Rechtmehring","muenchen"],"rehling":["Rehling","muenchen"],
  "reichersbeuern":["Reichersbeuern","muenchen"],"reichertshausen":["Reichertshausen","muenchen"],
  "reichertsheim":["Reichertsheim","muenchen"],"reichertshofen":["Reichertshofen","muenchen"],
  "reichling":["Reichling","muenchen"],"ried":["Ried","muenchen"],"rieden":["Rieden","muenchen"],
  "riedering":["Riedering","muenchen"],"riemerling":["Riemerling","muenchen"],
  "rimsting":["Rimsting","muenchen"],"rohr":["Rohr","muenchen"],"rohrbach":["Rohrbach","muenchen"],
  "rohrdorf":["Rohrdorf","muenchen"],"rohrenfels":["Rohrenfels","muenchen"],
  "rosenheim":["Rosenheim","muenchen"],"rott":["Rott","muenchen"],
  "rottach-egern":["Rottach-Egern","muenchen"],"rottenbuch":["Rottenbuch","muenchen"],
  "rottenburg":["Rottenburg","muenchen"],"rudelzhausen":["Rudelzhausen","muenchen"],
  "röhrmoos":["Röhrmoos","muenchen"],"sachsenkam":["Sachsenkam","muenchen"],
  "samerberg":["Samerberg","muenchen"],"sankt wolfgang":["Sankt Wolfgang","muenchen"],
  "sauerlach":["Sauerlach","muenchen"],"saulgrub":["Saulgrub","muenchen"],
  "schechen":["Schechen","muenchen"],"scherstetten":["Scherstetten","muenchen"],
  "scheuring":["Scheuring","muenchen"],"scheyern":["Scheyern","muenchen"],
  "schiltberg":["Schiltberg","muenchen"],"schleching":["Schleching","muenchen"],
  "schlehdorf":["Schlehdorf","muenchen"],"schliersee":["Schliersee","muenchen"],
  "schmiechen":["Schmiechen","muenchen"],"schnaitsee":["Schnaitsee","muenchen"],
  "schondorf":["Schondorf","muenchen"],"schongau":["Schongau","muenchen"],
  "schonstett":["Schonstett","muenchen"],"schrobenhausen":["Schrobenhausen","muenchen"],
  "schwabbruck":["Schwabbruck","muenchen"],"schwabhausen":["Schwabhausen","muenchen"],
  "schwabmünchen":["Schwabmünchen","muenchen"],"schwabsoien":["Schwabsoien","muenchen"],
  "schwaigen":["Schwaigen","muenchen"],"schweitenkirchen":["Schweitenkirchen","muenchen"],
  "schwifting":["Schwifting","muenchen"],"schwindegg":["Schwindegg","muenchen"],
  "schäftlarn":["Schäftlarn","muenchen"],"schönberg":["Schönberg","muenchen"],
  "schöngeising":["Schöngeising","muenchen"],"seefeld":["Seefeld","muenchen"],
  "seeon-seebruck":["Seeon-Seebruck","muenchen"],"seeshaupt":["Seeshaupt","muenchen"],
  "siegenburg":["Siegenburg","muenchen"],"sielenbach":["Sielenbach","muenchen"],
  "sindelsdorf":["Sindelsdorf","muenchen"],"soyen":["Soyen","muenchen"],
  "spatzenhausen":["Spatzenhausen","muenchen"],"st. georgen":["St. Georgen","muenchen"],
  "stadtbergen":["Stadtbergen","muenchen"],"starnberg":["Starnberg","muenchen"],
  "stein":["Stein","muenchen"],"steindorf":["Steindorf","muenchen"],
  "steingaden":["Steingaden","muenchen"],"steinhöring":["Steinhöring","muenchen"],
  "steinkirchen":["Steinkirchen","muenchen"],"stephanskirchen":["Stephanskirchen","muenchen"],
  "straßlach-dingharting":["Straßlach-Dingharting","muenchen"],"stötten":["Stötten","muenchen"],
  "stöttwang":["Stöttwang","muenchen"],"sulzemoos":["Sulzemoos","muenchen"],
  "söchtenau":["Söchtenau","muenchen"],"tacherting":["Tacherting","muenchen"],
  "taufkirchen":["Taufkirchen","muenchen"],"teising":["Teising","muenchen"],
  "thaining":["Thaining","muenchen"],"thierhaupten":["Thierhaupten","muenchen"],
  "tiefenbach":["Tiefenbach","muenchen"],"train":["Train","muenchen"],
  "traunreut":["Traunreut","muenchen"],"trostberg":["Trostberg","muenchen"],
  "tuntenhausen":["Tuntenhausen","muenchen"],"tussenhausen":["Tussenhausen","muenchen"],
  "tutzing":["Tutzing","muenchen"],"töging":["Töging","muenchen"],
  "türkenfeld":["Türkenfeld","muenchen"],"türkheim":["Türkheim","muenchen"],
  "tüßling":["Tüßling","muenchen"],"uffing":["Uffing","muenchen"],
  "unterammergau":["Unterammergau","muenchen"],"unterdießen":["Unterdießen","muenchen"],
  "unterföhring":["Unterföhring","muenchen"],"unterhaching":["Unterhaching","muenchen"],
  "untermeitingen":["Untermeitingen","muenchen"],"unterneukirchen":["Unterneukirchen","muenchen"],
  "unterreit":["Unterreit","muenchen"],"unterschleißheim":["Unterschleißheim","muenchen"],
  "ustersbach":["Ustersbach","muenchen"],"utting":["Utting","muenchen"],
  "valley":["Valley","muenchen"],"vaterstetten":["Vaterstetten","muenchen"],
  "velden":["Velden","muenchen"],"vierkirchen":["Vierkirchen","muenchen"],
  "vilgertshofen":["Vilgertshofen","muenchen"],"vilsbiburg":["Vilsbiburg","muenchen"],
  "vilsheim":["Vilsheim","muenchen"],"vogtareuth":["Vogtareuth","muenchen"],
  "vohburg":["Vohburg","muenchen"],"volkenschwand":["Volkenschwand","muenchen"],
  "waakirchen":["Waakirchen","muenchen"],"waal":["Waal","muenchen"],
  "wackersberg":["Wackersberg","muenchen"],"waidhofen":["Waidhofen","muenchen"],
  "walchensee":["Walchensee","muenchen"],"waldkraiburg":["Waldkraiburg","muenchen"],
  "walkertshofen":["Walkertshofen","muenchen"],"wallgau":["Wallgau","muenchen"],
  "walpertskirchen":["Walpertskirchen","muenchen"],"warngau":["Warngau","muenchen"],
  "wartenberg":["Wartenberg","muenchen"],"wasserburg":["Wasserburg","muenchen"],
  "wehringen":["Wehringen","muenchen"],"weichering":["Weichering","muenchen"],
  "weichs":["Weichs","muenchen"],"weihmichl":["Weihmichl","muenchen"],"weil":["Weil","muenchen"],
  "weilheim":["Weilheim","muenchen"],"welden":["Welden","muenchen"],
  "wessobrunn":["Wessobrunn","muenchen"],"westendorf":["Westendorf","muenchen"],
  "wettstetten":["Wettstetten","muenchen"],"weyarn":["Weyarn","muenchen"],
  "weßling":["Weßling","muenchen"],"wiedergeltingen":["Wiedergeltingen","muenchen"],
  "wielenbach":["Wielenbach","muenchen"],"wildenberg":["Wildenberg","muenchen"],
  "wildsteig":["Wildsteig","muenchen"],"windach":["Windach","muenchen"],
  "wolfratshausen":["Wolfratshausen","muenchen"],"wolnzach":["Wolnzach","muenchen"],
  "wurmsham":["Wurmsham","muenchen"],"wörth":["Wörth","muenchen"],
  "wörthsee":["Wörthsee","muenchen"],"ziemetshausen":["Ziemetshausen","muenchen"],
  "zolling":["Zolling","muenchen"],"zorneding":["Zorneding","muenchen"],
  "zusmarshausen":["Zusmarshausen","muenchen"],"übersee":["Übersee","muenchen"],
  // ============================================
  // NÜRNBERG / FRANKEN (~110 Städte, 50km Radius)
  // ============================================
  "nürnberg":["Nürnberg","nuernberg"],"nuernberg":["Nürnberg","nuernberg"],
  "fürth":["Fürth","nuernberg"],"zirndorf":["Zirndorf","nuernberg"],
  "oberasbach":["Oberasbach","nuernberg"],"stein bei nürnberg":["Stein bei Nürnberg","nuernberg"],
  "wendelstein":["Wendelstein","nuernberg"],"schwabach":["Schwabach","nuernberg"],
  "erlangen":["Erlangen","nuernberg"],"herzogenaurach":["Herzogenaurach","nuernberg"],
  "lauf":["Lauf an der Pegnitz","nuernberg"],"lauf an der pegnitz":["Lauf an der Pegnitz","nuernberg"],
  "röthenbach":["Röthenbach an der Pegnitz","nuernberg"],"röthenbach an der pegnitz":["Röthenbach an der Pegnitz","nuernberg"],
  "rückersdorf":["Rückersdorf","nuernberg"],"schwaig":["Schwaig bei Nürnberg","nuernberg"],
  "schwaig bei nürnberg":["Schwaig bei Nürnberg","nuernberg"],"feucht":["Feucht","nuernberg"],
  "schwarzenbruck":["Schwarzenbruck","nuernberg"],"burgthann":["Burgthann","nuernberg"],
  "winkelhaid":["Winkelhaid","nuernberg"],"altdorf bei nürnberg":["Altdorf bei Nürnberg","nuernberg"],
  "leinburg":["Leinburg","nuernberg"],"schnaittach":["Schnaittach","nuernberg"],
  "neunkirchen am sand":["Neunkirchen am Sand","nuernberg"],"ottensoos":["Ottensoos","nuernberg"],
  "reichenschwand":["Reichenschwand","nuernberg"],"henfenfeld":["Henfenfeld","nuernberg"],
  "hersbruck":["Hersbruck","nuernberg"],"pommelsbrunn":["Pommelsbrunn","nuernberg"],
  "happurg":["Happurg","nuernberg"],"offenhausen":["Offenhausen","nuernberg"],
  "kirchensittenbach":["Kirchensittenbach","nuernberg"],"simmelsdorf":["Simmelsdorf","nuernberg"],
  "engelthal":["Engelthal","nuernberg"],"roth":["Roth","nuernberg"],
  "büchenbach":["Büchenbach","nuernberg"],"georgensgmünd":["Georgensgmünd","nuernberg"],
  "abenberg":["Abenberg","nuernberg"],"spalt":["Spalt","nuernberg"],
  "heideck":["Heideck","nuernberg"],"hilpoltstein":["Hilpoltstein","nuernberg"],
  "allersberg":["Allersberg","nuernberg"],"greding":["Greding","nuernberg"],
  "thalmässing":["Thalmässing","nuernberg"],"berg bei neumarkt":["Berg bei Neumarkt","nuernberg"],
  "pyrbaum":["Pyrbaum","nuernberg"],"postbauer-heng":["Postbauer-Heng","nuernberg"],
  "neumarkt in der oberpfalz":["Neumarkt in der Oberpfalz","nuernberg"],"berching":["Berching","nuernberg"],
  "velburg":["Velburg","nuernberg"],"freystadt":["Freystadt","nuernberg"],
  "heroldsberg":["Heroldsberg","nuernberg"],"kalchreuth":["Kalchreuth","nuernberg"],
  "eckental":["Eckental","nuernberg"],"heßdorf":["Heßdorf","nuernberg"],
  "baiersdorf":["Baiersdorf","nuernberg"],"bubenreuth":["Bubenreuth","nuernberg"],
  "uttenreuth":["Uttenreuth","nuernberg"],"buckenhof":["Buckenhof","nuernberg"],
  "möhrendorf":["Möhrendorf","nuernberg"],"hemhofen":["Hemhofen","nuernberg"],
  "großenseebach":["Großenseebach","nuernberg"],"weisendorf":["Weisendorf","nuernberg"],
  "adelsdorf":["Adelsdorf","nuernberg"],"höchstadt an der aisch":["Höchstadt an der Aisch","nuernberg"],
  "forchheim":["Forchheim","nuernberg"],"effeltrich":["Effeltrich","nuernberg"],
  "langensendelbach":["Langensendelbach","nuernberg"],"poxdorf":["Poxdorf","nuernberg"],
  "neunkirchen am brand":["Neunkirchen am Brand","nuernberg"],"kunreuth":["Kunreuth","nuernberg"],
  "pretzfeld":["Pretzfeld","nuernberg"],"ebermannstadt":["Ebermannstadt","nuernberg"],
  "gößweinstein":["Gößweinstein","nuernberg"],"pegnitz":["Pegnitz","nuernberg"],
  "auerbach in der oberpfalz":["Auerbach in der Oberpfalz","nuernberg"],"sulzbach-rosenberg":["Sulzbach-Rosenberg","nuernberg"],
  "hahnbach":["Hahnbach","nuernberg"],"vilseck":["Vilseck","nuernberg"],
  "edelsfeld":["Edelsfeld","nuernberg"],"neuhaus an der pegnitz":["Neuhaus an der Pegnitz","nuernberg"],
  "vorra":["Vorra","nuernberg"],"hartenstein":["Hartenstein","nuernberg"],
  "cadolzburg":["Cadolzburg","nuernberg"],"langenzenn":["Langenzenn","nuernberg"],
  "veitsbronn":["Veitsbronn","nuernberg"],"obermichelbach":["Obermichelbach","nuernberg"],
  "puschendorf":["Puschendorf","nuernberg"],"tuchenbach":["Tuchenbach","nuernberg"],
  "seukendorf":["Seukendorf","nuernberg"],"ammerndorf":["Ammerndorf","nuernberg"],
  "roßtal":["Roßtal","nuernberg"],"heilsbronn":["Heilsbronn","nuernberg"],
  "wilhermsdorf":["Wilhermsdorf","nuernberg"],"windsbach":["Windsbach","nuernberg"],
  "kammerstein":["Kammerstein","nuernberg"],"weißenburg in bayern":["Weißenburg in Bayern","nuernberg"],
  "treuchtlingen":["Treuchtlingen","nuernberg"],"pleinfeld":["Pleinfeld","nuernberg"],
  "ellingen":["Ellingen","nuernberg"],"gunzenhausen":["Gunzenhausen","nuernberg"],
  "absberg":["Absberg","nuernberg"],"haundorf":["Haundorf","nuernberg"],"muhr am see":["Muhr am See","nuernberg"],
  "dietenhofen":["Dietenhofen","nuernberg"],"ansbach":["Ansbach","nuernberg"],
  "sachsen bei ansbach":["Sachsen bei Ansbach","nuernberg"],"petersaurach":["Petersaurach","nuernberg"],
  "neuendettelsau":["Neuendettelsau","nuernberg"],
  // ============================================
  // NRW (~70 Städte)
  // ============================================
  "köln":["Köln","koeln"],"düsseldorf":["Düsseldorf","duesseldorf"],"essen":["Essen","ruhrgebiet"],
  "dortmund":["Dortmund","ruhrgebiet"],"duisburg":["Duisburg","ruhrgebiet"],"bochum":["Bochum","ruhrgebiet"],
  "wuppertal":["Wuppertal","duesseldorf"],"bonn":["Bonn","koeln"],"münster":["Münster","nrw"],
  "gelsenkirchen":["Gelsenkirchen","ruhrgebiet"],
  "mönchengladbach":["Mönchengladbach","duesseldorf"],"aachen":["Aachen","nrw"],"krefeld":["Krefeld","duesseldorf"],
  "oberhausen":["Oberhausen","ruhrgebiet"],"hagen":["Hagen","ruhrgebiet"],"mülheim":["Mülheim an der Ruhr","nrw"],
  "leverkusen":["Leverkusen","koeln"],"solingen":["Solingen","duesseldorf"],"herne":["Herne","ruhrgebiet"],
  "neuss":["Neuss","duesseldorf"],"moers":["Moers","ruhrgebiet"],
  "siegen":["Siegen","ruhrgebiet"],"ratingen":["Ratingen","duesseldorf"],
  "bergisch gladbach":["Bergisch Gladbach","koeln"],"iserlohn":["Iserlohn","nrw"],
  "remscheid":["Remscheid","duesseldorf"],
  "recklinghausen":["Recklinghausen","ruhrgebiet"],"bottrop":["Bottrop","ruhrgebiet"],"marl":["Marl","ruhrgebiet"],
  "lüdenscheid":["Lüdenscheid","nrw"],"dinslaken":["Dinslaken","ruhrgebiet"],"dorsten":["Dorsten","ruhrgebiet"],
  "arnsberg":["Arnsberg","ruhrgebiet"],"troisdorf":["Troisdorf","koeln"],"siegburg":["Siegburg","koeln"],
  "hilden":["Hilden","duesseldorf"],"dormagen":["Dormagen","koeln"],"kerpen":["Kerpen","koeln"],
  "hürth":["Hürth","koeln"],"brühl":["Brühl","koeln"],"frechen":["Frechen","koeln"],
  "erftstadt":["Erftstadt","koeln"],"wesseling":["Wesseling","koeln"],"pulheim":["Pulheim","koeln"],
  "düren":["Düren","koeln"],"jülich":["Jülich","koeln"],"grevenbroich":["Grevenbroich","nrw"],
  "lünen":["Lünen","ruhrgebiet"],"unna":["Unna","ruhrgebiet"],"schwerte":["Schwerte","ruhrgebiet"],
  "kamen":["Kamen","ruhrgebiet"],"castrop-rauxel":["Castrop-Rauxel","ruhrgebiet"],"hattingen":["Hattingen","ruhrgebiet"],
  "witten":["Witten","ruhrgebiet"],"velbert":["Velbert","duesseldorf"],"mettmann":["Mettmann","duesseldorf"],
  "erkrath":["Erkrath","duesseldorf"],"langenfeld":["Langenfeld","duesseldorf"],
  "monheim":["Monheim am Rhein","duesseldorf"],"meerbusch":["Meerbusch","duesseldorf"],"kaarst":["Kaarst","duesseldorf"],
  "viersen":["Viersen","duesseldorf"],"kempen":["Kempen","duesseldorf"],"kleve":["Kleve","duesseldorf"],
  "wesel":["Wesel","duesseldorf"],"gummersbach":["Gummersbach","koeln"],"olpe":["Olpe","koeln"],
  "lohmar":["Lohmar","koeln"],"soest":["Soest","nrw"],"goch":["Goch","nrw"],
  "heinsberg":["Heinsberg","nrw"],"erkelenz":["Erkelenz","nrw"],"beckum":["Beckum","nrw"],
  "ahlen":["Ahlen","nrw"],"bocholt":["Bocholt","nrw"],
  // ============================================
  // BERLIN + BRANDENBURG (~120 Städte)
  // ============================================
  "angermünde":["Angermünde","berlin"],"bad freienwalde":["Bad Freienwalde","berlin"],
  "bad saarow":["Bad Saarow","berlin"],"baumschulenweg":["Berlin-Baumschulenweg","berlin"],
  "beelitz":["Beelitz","berlin"],"beeskow":["Beeskow","berlin"],"belzig":["Belzig","berlin"],
  "berlin":["Berlin","berlin"],"bestensee":["Bestensee","berlin"],
  "biesdorf":["Berlin-Biesdorf","berlin"],"birkenwerder":["Birkenwerder","berlin"],
  "blankenfelde-mahlow":["Blankenfelde-Mahlow","berlin"],"brandenburg":["Brandenburg/Havel","berlin"],
  "brieselang":["Brieselang","berlin"],"britz":["Berlin-Britz","berlin"],
  "buckow":["Berlin-Buckow","berlin"],"charlottenburg":["Berlin-Charlottenburg","berlin"],
  "dahlem":["Berlin-Dahlem","berlin"],"dallgow-döberitz":["Dallgow-Döberitz","berlin"],
  "eberswalde":["Eberswalde","berlin"],"eisenhüttenstadt":["Eisenhüttenstadt","berlin"],
  "erkner":["Erkner","berlin"],"falkensee":["Falkensee","berlin"],
  "fehrbellin":["Fehrbellin","berlin"],
  "fredersdorf-vogelsdorf":["Fredersdorf-Vogelsdorf","berlin"],"friedenau":["Berlin-Friedenau","berlin"],
  "friedrichshain":["Berlin-Friedrichshain","berlin"],"frohnau":["Berlin-Frohnau","berlin"],
  "fürstenwalde":["Fürstenwalde","berlin"],"gatow":["Berlin-Gatow","berlin"],
  "glienicke":["Glienicke/Nordbahn","berlin"],"gransee":["Gransee","berlin"],
  "gropiusstadt":["Berlin-Gropiusstadt","berlin"],"großbeeren":["Großbeeren","berlin"],
  "grunewald":["Berlin-Grunewald","berlin"],"hakenfelde":["Berlin-Hakenfelde","berlin"],
  "haselhorst":["Berlin-Haselhorst","berlin"],"hellersdorf":["Berlin-Hellersdorf","berlin"],
  "hennigsdorf":["Hennigsdorf","berlin"],"hermsdorf":["Berlin-Hermsdorf","berlin"],
  "hohen neuendorf":["Hohen Neuendorf","berlin"],"hohenschönhausen":["Berlin-Hohenschönhausen","berlin"],
  "hoppegarten":["Hoppegarten","berlin"],"jüterbog":["Jüterbog","berlin"],
  "karlshorst":["Berlin-Karlshorst","berlin"],"karow":["Berlin-Karow","berlin"],
  "kaulsdorf":["Berlin-Kaulsdorf","berlin"],"kleinmachnow":["Kleinmachnow","berlin"],
  "kremmen":["Kremmen","berlin"],"kreuzberg":["Berlin-Kreuzberg","berlin"],
  "königs wusterhausen":["Königs Wusterhausen","berlin"],"köpenick":["Berlin-Köpenick","berlin"],
  "lankwitz":["Berlin-Lankwitz","berlin"],"lichtenberg":["Berlin-Lichtenberg","berlin"],
  "lichterfelde":["Berlin-Lichterfelde","berlin"],"luckenwalde":["Luckenwalde","berlin"],
  "ludwigsfelde":["Ludwigsfelde","berlin"],"lübben":["Lübben","berlin"],
  "lübbenau":["Lübbenau","berlin"],"mahlsdorf":["Berlin-Mahlsdorf","berlin"],
  "mariendorf":["Berlin-Mariendorf","berlin"],"marzahn":["Berlin-Marzahn","berlin"],
  "michendorf":["Michendorf","berlin"],"mitte":["Berlin-Mitte","berlin"],
  "mittenwalde":["Mittenwalde","berlin"],"moabit":["Berlin-Moabit","berlin"],
  "märkisches viertel":["Berlin-Märkisches Viertel","berlin"],
  "mühlenbecker land":["Mühlenbecker Land","berlin"],"müncheberg":["Müncheberg","berlin"],
  "nauen":["Nauen","berlin"],"neuenhagen":["Neuenhagen","berlin"],
  "neukölln":["Berlin-Neukölln","berlin"],"neuruppin":["Neuruppin","berlin"],
  "nikolassee":["Berlin-Nikolassee","berlin"],"nuthetal":["Nuthetal","berlin"],
  "oranienburg":["Oranienburg","berlin"],"pankow":["Berlin-Pankow","berlin"],
  "potsdam":["Potsdam","berlin"],"premnitz":["Premnitz","berlin"],
  "prenzlauer berg":["Berlin-Prenzlauer Berg","berlin"],"rangsdorf":["Rangsdorf","berlin"],
  "reinickendorf":["Berlin-Reinickendorf","berlin"],"rheinsberg":["Rheinsberg","berlin"],
  "rudow":["Berlin-Rudow","berlin"],"rüdersdorf":["Rüdersdorf","berlin"],
  "schöneberg":["Berlin-Schöneberg","berlin"],"schönefeld":["Schönefeld","berlin"],
  "schönwalde":["Schönwalde","berlin"],"seelow":["Seelow","berlin"],
  "siemensstadt":["Berlin-Siemensstadt","berlin"],"spandau":["Berlin-Spandau","berlin"],
  "spreenhagen":["Spreenhagen","berlin"],"staaken":["Berlin-Staaken","berlin"],
  "steglitz":["Berlin-Steglitz","berlin"],"storkow":["Storkow","berlin"],
  "strausberg":["Strausberg","berlin"],"tegel":["Berlin-Tegel","berlin"],
  "teltow":["Teltow","berlin"],"tempelhof":["Berlin-Tempelhof","berlin"],
  "templin":["Templin","berlin"],"tiergarten":["Berlin-Tiergarten","berlin"],
  "trebbin":["Trebbin","berlin"],"treptow":["Berlin-Treptow","berlin"],
  "treuenbrietzen":["Treuenbrietzen","berlin"],"velten":["Velten","berlin"],
  "wandlitz":["Wandlitz","berlin"],"wannsee":["Berlin-Wannsee","berlin"],
  "wedding":["Berlin-Wedding","berlin"],"weißensee":["Berlin-Weißensee","berlin"],
  "werder":["Werder/Havel","berlin"],"westend":["Berlin-Westend","berlin"],
  "wildau":["Wildau","berlin"],"wilmersdorf":["Berlin-Wilmersdorf","berlin"],
  "woltersdorf":["Woltersdorf","berlin"],"wriezen":["Wriezen","berlin"],
  "zehdenick":["Zehdenick","berlin"],"zehlendorf":["Berlin-Zehlendorf","berlin"],
  "zeuthen":["Zeuthen","berlin"],"zossen":["Zossen","berlin"],
  // ============================================
  // BREMEN + 80km (~100 Städte)
  // ============================================
  "bremen":["Bremen","bremen"],"gröpelingen":["Bremen-Gröpelingen","bremen"],
  "walle":["Bremen-Walle","bremen"],"burg-grambke":["Bremen-Burg-Grambke","bremen"],
  "burgdamm":["Bremen-Burgdamm","bremen"],"schwachhausen":["Bremen-Schwachhausen","bremen"],
  "vegesack":["Bremen-Vegesack","bremen"],"blumenthal":["Bremen-Blumenthal","bremen"],
  "delmenhorst":["Delmenhorst","bremen"],"lemwerder":["Lemwerder","bremen"],
  "ritterhude":["Ritterhude","bremen"],"stuhr":["Stuhr","bremen"],
  "ganderkesee":["Ganderkesee","bremen"],"lilienthal":["Lilienthal","bremen"],
  "weyhe":["Weyhe","bremen"],"berne":["Berne","bremen"],
  "osterholz-scharmbeck":["Osterholz-Scharmbeck","bremen"],"schwanewede":["Schwanewede","bremen"],
  "hude":["Hude","bremen"],"grasberg":["Grasberg","bremen"],"oyten":["Oyten","bremen"],
  "syke":["Syke","bremen"],"worpswede":["Worpswede","bremen"],"harpstedt":["Harpstedt","bremen"],
  "achim":["Achim","bremen"],"dötlingen":["Dötlingen","bremen"],"elsfleth":["Elsfleth","bremen"],
  "thedinghausen":["Thedinghausen","bremen"],"ottersberg":["Ottersberg","bremen"],
  "hatten":["Hatten","bremen"],"bassum":["Bassum","bremen"],"hambergen":["Hambergen","bremen"],
  "tarmstedt":["Tarmstedt","bremen"],"oldenburg":["Oldenburg","bremen"],"brake":["Brake","bremen"],
  "wildeshausen":["Wildeshausen","bremen"],"langwedel":["Langwedel","bremen"],
  "ovelgönne":["Ovelgönne","bremen"],"bruchhausen-vilsen":["Bruchhausen-Vilsen","bremen"],
  "twistringen":["Twistringen","bremen"],"großenkneten":["Großenkneten","bremen"],
  "gnarrenburg":["Gnarrenburg","bremen"],"wardenburg":["Wardenburg","bremen"],
  "rastede":["Rastede","bremen"],"beverstedt":["Beverstedt","bremen"],"verden":["Verden","bremen"],
  "hoya":["Hoya","bremen"],"visbek":["Visbek","bremen"],"loxstedt":["Loxstedt","bremen"],
  "goldenstedt":["Goldenstedt","bremen"],"rotenburg":["Rotenburg","bremen"],
  "zeven":["Zeven","bremen"],"wiefelstede":["Wiefelstede","bremen"],
  "barnstorf":["Barnstorf","bremen"],"emstek":["Emstek","bremen"],
  "bremerhaven":["Bremerhaven","bremen"],"bad zwischenahn":["Bad Zwischenahn","bremen"],
  "kirchlinteln":["Kirchlinteln","bremen"],"sulingen":["Sulingen","bremen"],
  "nordenham":["Nordenham","bremen"],"garrel":["Garrel","bremen"],"edewecht":["Edewecht","bremen"],
  "vechta":["Vechta","bremen"],"bösel":["Bösel","bremen"],"schiffdorf":["Schiffdorf","bremen"],
  "bremervörde":["Bremervörde","bremen"],"varel":["Varel","bremen"],
  "scheeßel":["Scheeßel","bremen"],"cloppenburg":["Cloppenburg","bremen"],
  "cappeln":["Cappeln","bremen"],"bakum":["Bakum","bremen"],"westerstede":["Westerstede","bremen"],
  "geestland":["Geestland","bremen"],"butjadingen":["Butjadingen","bremen"],
  "visselhövede":["Visselhövede","bremen"],"sittensen":["Sittensen","bremen"],
  "lohne":["Lohne","bremen"],"diepholz":["Diepholz","bremen"],"friesoythe":["Friesoythe","bremen"],
  "molbergen":["Molbergen","bremen"],"zetel":["Zetel","bremen"],
  "wilhelmshaven":["Wilhelmshaven","bremen"],
  "barßel":["Barßel","bremen"],"apen":["Apen","bremen"],"harsefeld":["Harsefeld","bremen"],
  "dinklage":["Dinklage","bremen"],"lastrup":["Lastrup","bremen"],"sande":["Sande","bremen"],
  "steinfeld":["Steinfeld","bremen"],"walsrode":["Walsrode","bremen"],
  "uplengen":["Uplengen","bremen"],"stolzenau":["Stolzenau","bremen"],
  "saterland":["Saterland","bremen"],"quakenbrück":["Quakenbrück","bremen"],
  "himmelpforten":["Himmelpforten","bremen"],"tostedt":["Tostedt","bremen"],
  "holdorf":["Holdorf","bremen"],"friedeburg":["Friedeburg","bremen"],
  "schortens":["Schortens","bremen"],"badbergen":["Badbergen","bremen"],"damme":["Damme","bremen"],
  "rahden":["Rahden","bremen"],"hemmoor":["Hemmoor","bremen"],"lorup":["Lorup","bremen"],
  "stade":["Stade","bremen"],"schneverdingen":["Schneverdingen","bremen"],
  "horneburg":["Horneburg","bremen"],"detern":["Detern","bremen"],"werlte":["Werlte","bremen"],
  "filsum":["Filsum","bremen"],"esterwegen":["Esterwegen","bremen"],
  "wiesmoor":["Wiesmoor","bremen"],"bad fallingbostel":["Bad Fallingbostel","bremen"],
  "jever":["Jever","bremen"],"löningen":["Löningen","bremen"],"stemwede":["Stemwede","bremen"],
  "menslage":["Menslage","bremen"],"buxtehude":["Buxtehude","bremen"],
  "schwarmstedt":["Schwarmstedt","bremen"],"rehburg-loccum":["Rehburg-Loccum","bremen"],
  "soltau":["Soltau","bremen"],"hesel":["Hesel","bremen"],"nortrup":["Nortrup","bremen"],
  "rhauderfehn":["Rhauderfehn","bremen"],"ostrhauderfehn":["Ostrhauderfehn","bremen"],
  "neuenkirchen-vörden":["Neuenkirchen-Vörden","bremen"],
  "neustadt am rübenberge":["Neustadt am Rübenberge","bremen"],
  "bersenbrück":["Bersenbrück","bremen"],"cuxhaven":["Cuxhaven","bremen"],
  "otterndorf":["Otterndorf","bremen"],"petershagen":["Petershagen","bremen"],
  "dörverden":["Dörverden","bremen"],"wagenfeld":["Wagenfeld","bremen"],
  "blender":["Blender","bremen"],"drakenburg":["Drakenburg","bremen"],
  "eystrup":["Eystrup","bremen"],"hassel":["Hassel","bremen"],
  "gandesbergen":["Gandesbergen","bremen"],"etelsen":["Etelsen","bremen"],
  "sottrum":["Sottrum","bremen"],"bötersen":["Bötersen","bremen"],
  "hassendorf":["Hassendorf","bremen"],"ahausen":["Ahausen","bremen"],
  "fintel":["Fintel","bremen"],"heeslingen":["Heeslingen","bremen"],
  "seedorf":["Seedorf","bremen"],"oerel":["Oerel","bremen"],
  "hipstedt":["Hipstedt","bremen"],"sandbostel":["Sandbostel","bremen"],
  "vollersode":["Vollersode","bremen"],"holste":["Holste","bremen"],
  "hagen im bremischen":["Hagen im Bremischen","bremen"],
  "dorum":["Dorum","bremen"],"wremen":["Wremen","bremen"],
  "midlum":["Midlum","bremen"],"nordholz":["Nordholz","bremen"],
  "langen bei bremerhaven":["Langen bei Bremerhaven","bremen"],
  "bederkesa":["Bederkesa","bremen"],"stotel":["Stotel","bremen"],
  "bramstedt":["Bramstedt","bremen"],"drangstedt":["Drangstedt","bremen"],
  "sandstedt":["Sandstedt","bremen"],"rechtenfleth":["Rechtenfleth","bremen"],
  "wiepenkathen":["Wiepenkathen","bremen"],"donnern":["Donnern","bremen"],
  "hundsmühlen":["Hundsmühlen","bremen"],"sandkrug":["Sandkrug","bremen"],
  "kirchhatten":["Kirchhatten","bremen"],"bookholzberg":["Bookholzberg","bremen"],
  "ahlhorn":["Ahlhorn","bremen"],"huntlosen":["Huntlosen","bremen"],
  "essen oldenburg":["Essen (Oldenburg)","bremen"],"lindern":["Lindern","bremen"],
  "peheim":["Peheim","bremen"],"bethen":["Bethen","bremen"],
  "beverbruch":["Beverbruch","bremen"],"lutten":["Lutten","bremen"],
  "oythe":["Oythe","bremen"],"langförden":["Langförden","bremen"],
  "rechterfeld":["Rechterfeld","bremen"],"mühlen":["Mühlen","bremen"],
  "lemförde":["Lemförde","bremen"],"brockum":["Brockum","bremen"],
  "rehden":["Rehden","bremen"],"hemsloh":["Hemsloh","bremen"],
  "wetschen":["Wetschen","bremen"],"eydelstedt":["Eydelstedt","bremen"],
  "drebber":["Drebber","bremen"],"stemshorn":["Stemshorn","bremen"],
  "varrel":["Varrel","bremen"],"kirchdorf":["Kirchdorf","bremen"],
  "heiligenfelde":["Heiligenfelde","bremen"],
  "martfeld":["Martfeld","bremen"],"borstel":["Borstel","bremen"],
  "siedenburg":["Siedenburg","bremen"],"asendorf":["Asendorf","bremen"],
  "scholen":["Scholen","bremen"],"affinghausen":["Affinghausen","bremen"],
  "schwaförden":["Schwaförden","bremen"],"ehrenburg":["Ehrenburg","bremen"],
  // ============================================
  // HAMBURG + 80km (~120 Städte)
  // ============================================
  "hamburg":["Hamburg","hamburg"],"altona":["Hamburg-Altona","hamburg"],
  "bergedorf":["Hamburg-Bergedorf","hamburg"],"billstedt":["Hamburg-Billstedt","hamburg"],
  "blankenese":["Hamburg-Blankenese","hamburg"],"eimsbüttel":["Hamburg-Eimsbüttel","hamburg"],
  "eppendorf":["Hamburg-Eppendorf","hamburg"],"farmsen-berne":["Hamburg-Farmsen-Berne","hamburg"],
  "finkenwerder":["Hamburg-Finkenwerder","hamburg"],"hafencity":["Hamburg-HafenCity","hamburg"],
  "hamm":["Hamburg-Hamm","hamburg"],"harburg":["Hamburg-Harburg","hamburg"],
  "harvestehude":["Hamburg-Harvestehude","hamburg"],"jenfeld":["Hamburg-Jenfeld","hamburg"],
  "langenhorn":["Hamburg-Langenhorn","hamburg"],"lokstedt":["Hamburg-Lokstedt","hamburg"],
  "niendorf":["Hamburg-Niendorf","hamburg"],"osdorf":["Hamburg-Osdorf","hamburg"],
  "ottensen":["Hamburg-Ottensen","hamburg"],"poppenbüttel":["Hamburg-Poppenbüttel","hamburg"],
  "rahlstedt":["Hamburg-Rahlstedt","hamburg"],"rotherbaum":["Hamburg-Rotherbaum","hamburg"],
  "schnelsen":["Hamburg-Schnelsen","hamburg"],"st. georg":["Hamburg-St. Georg","hamburg"],
  "st. pauli":["Hamburg-St. Pauli","hamburg"],"stellingen":["Hamburg-Stellingen","hamburg"],
  "tonndorf":["Hamburg-Tonndorf","hamburg"],"volksdorf":["Hamburg-Volksdorf","hamburg"],
  "wandsbek":["Hamburg-Wandsbek","hamburg"],"wilhelmsburg":["Hamburg-Wilhelmsburg","hamburg"],
  "winterhude":["Hamburg-Winterhude","hamburg"],"ahrensburg":["Ahrensburg","hamburg"],
  "bad oldesloe":["Bad Oldesloe","hamburg"],"bad segeberg":["Bad Segeberg","hamburg"],
  "bargteheide":["Bargteheide","hamburg"],"buchholz":["Buchholz","hamburg"],
  "elmshorn":["Elmshorn","hamburg"],"geesthacht":["Geesthacht","hamburg"],
  "glinde":["Glinde","hamburg"],"halstenbek":["Halstenbek","hamburg"],
  "itzehoe":["Itzehoe","hamburg"],"kaltenkirchen":["Kaltenkirchen","hamburg"],
  "lauenburg":["Lauenburg","hamburg"],"lüneburg":["Lüneburg","hamburg"],
  "norderstedt":["Norderstedt","hamburg"],"pinneberg":["Pinneberg","hamburg"],
  "quickborn":["Quickborn","hamburg"],"reinbek":["Reinbek","hamburg"],
  "rellingen":["Rellingen","hamburg"],"schenefeld":["Schenefeld","hamburg"],
  "seevetal":["Seevetal","hamburg"],"tornesch":["Tornesch","hamburg"],
  "uetersen":["Uetersen","hamburg"],"wedel":["Wedel","hamburg"],"winsen":["Winsen","hamburg"],
  "wentorf":["Wentorf","hamburg"],"schwarzenbek":["Schwarzenbek","hamburg"],
  "trittau":["Trittau","hamburg"],"henstedt-ulzburg":["Henstedt-Ulzburg","hamburg"],
  "neumünster":["Neumünster","hamburg"],"rendsburg":["Rendsburg","hamburg"],
  "uelzen":["Uelzen","hamburg"],"lüchow":["Lüchow","hamburg"],
  "dannenberg":["Dannenberg","hamburg"],
  "gifhorn":["Gifhorn","hamburg"],"wolfsburg":["Wolfsburg","hamburg"],
  "braunschweig":["Braunschweig","hamburg"],"salzgitter":["Salzgitter","hamburg"],
  "peine":["Peine","hamburg"],"hildesheim":["Hildesheim","hamburg"],
  "hameln":["Hameln","hamburg"],"hannover":["Hannover","hannover"],
  "langenhagen":["Langenhagen","hamburg"],"garbsen":["Garbsen","hamburg"],
  "laatzen":["Laatzen","hamburg"],"barsinghausen":["Barsinghausen","hamburg"],
  "burgwedel":["Burgwedel","hamburg"],"isernhagen":["Isernhagen","hamburg"],
  "lehrte":["Lehrte","hamburg"],"seelze":["Seelze","hamburg"],"springe":["Springe","hamburg"],
  "wunstorf":["Wunstorf","hamburg"],"sehnde":["Sehnde","hamburg"],
  "hemmingen":["Hemmingen","hamburg"],"ronnenberg":["Ronnenberg","hamburg"],
  "pattensen":["Pattensen","hamburg"],"gehrden":["Gehrden","hamburg"],
  "wennigsen":["Wennigsen","hamburg"],
  
  
  
  
  // ============================================
  // STUTTGART + 60km (~150 Städte)
  // ============================================
  "stuttgart":["Stuttgart","stuttgart"],"bad cannstatt":["Bad Cannstatt","stuttgart"],
  "vaihingen":["Vaihingen","stuttgart"],"möhringen":["Möhringen","stuttgart"],
  "degerloch":["Degerloch","stuttgart"],"zuffenhausen":["Zuffenhausen","stuttgart"],
  "feuerbach":["Feuerbach","stuttgart"],"stammheim":["Stammheim","stuttgart"],
  "weilimdorf":["Weilimdorf","stuttgart"],"obertürkheim":["Obertürkheim","stuttgart"],
  "untertürkheim":["Untertürkheim","stuttgart"],"hedelfingen":["Hedelfingen","stuttgart"],
  "sillenbuch":["Sillenbuch","stuttgart"],"birkach":["Birkach","stuttgart"],
  "botnang":["Botnang","stuttgart"],"ludwigsburg":["Ludwigsburg","stuttgart"],
  "esslingen":["Esslingen am Neckar","stuttgart"],"böblingen":["Böblingen","stuttgart"],
  "sindelfingen":["Sindelfingen","stuttgart"],"waiblingen":["Waiblingen","stuttgart"],
  "fellbach":["Fellbach","stuttgart"],"leonberg":["Leonberg","stuttgart"],
  "kornwestheim":["Kornwestheim","stuttgart"],
  "bietigheim-bissingen":["Bietigheim-Bissingen","stuttgart"],
  "kirchheim unter teck":["Kirchheim unter Teck","stuttgart"],
  "nürtingen":["Nürtingen","stuttgart"],"göppingen":["Göppingen","stuttgart"],
  "reutlingen":["Reutlingen","stuttgart"],"tübingen":["Tübingen","stuttgart"],
  "herrenberg":["Herrenberg","stuttgart"],"calw":["Calw","stuttgart"],
  "pforzheim":["Pforzheim","stuttgart"],"backnang":["Backnang","stuttgart"],
  "schorndorf":["Schorndorf","stuttgart"],"winnenden":["Winnenden","stuttgart"],
  "gerlingen":["Gerlingen","stuttgart"],"ditzingen":["Ditzingen","stuttgart"],
  "korntal-münchingen":["Korntal-Münchingen","stuttgart"],
  "filderstadt":["Filderstadt","stuttgart"],
  "leinfelden-echterdingen":["Leinfelden-Echterdingen","stuttgart"],
  "ostfildern":["Ostfildern","stuttgart"],"plochingen":["Plochingen","stuttgart"],
  "wendlingen":["Wendlingen am Neckar","stuttgart"],"wernau":["Wernau","stuttgart"],
  "remseck":["Remseck am Neckar","stuttgart"],"remshalden":["Remshalden","stuttgart"],
  "weinstadt":["Weinstadt","stuttgart"],"kernen":["Kernen im Remstal","stuttgart"],
  "weil der stadt":["Weil der Stadt","stuttgart"],"renningen":["Renningen","stuttgart"],
  "rutesheim":["Rutesheim","stuttgart"],"magstadt":["Magstadt","stuttgart"],
  "holzgerlingen":["Holzgerlingen","stuttgart"],"schönaich":["Schönaich","stuttgart"],
  "waldenbuch":["Waldenbuch","stuttgart"],"steinenbronn":["Steinenbronn","stuttgart"],
  "aichtal":["Aichtal","stuttgart"],"metzingen":["Metzingen","stuttgart"],
  "bad urach":["Bad Urach","stuttgart"],
  "dettingen an der erms":["Dettingen an der Erms","stuttgart"],
  "neuhausen auf den fildern":["Neuhausen auf den Fildern","stuttgart"],
  "vaihingen an der enz":["Vaihingen an der Enz","stuttgart"],
  "sachsenheim":["Sachsenheim","stuttgart"],
  "marbach am neckar":["Marbach am Neckar","stuttgart"],
  "freiberg am neckar":["Freiberg am Neckar","stuttgart"],
  "tamm":["Tamm","stuttgart"],"asperg":["Asperg","stuttgart"],
  "möglingen":["Möglingen","stuttgart"],"markgröningen":["Markgröningen","stuttgart"],
  "schwieberdingen":["Schwieberdingen","stuttgart"],
  "murr":["Murr","stuttgart"],"steinheim an der murr":["Steinheim an der Murr","stuttgart"],
  "affalterbach":["Affalterbach","stuttgart"],"pleidelsheim":["Pleidelsheim","stuttgart"],
  "ingersheim":["Ingersheim","stuttgart"],"besigheim":["Besigheim","stuttgart"],
  "löchgau":["Löchgau","stuttgart"],"mühlacker":["Mühlacker","stuttgart"],
  "nagold":["Nagold","stuttgart"],"aidlingen":["Aidlingen","stuttgart"],
  "gärtringen":["Gärtringen","stuttgart"],"nufringen":["Nufringen","stuttgart"],
  "jettingen":["Jettingen","stuttgart"],"bondorf":["Bondorf","stuttgart"],
  "gäufelden":["Gäufelden","stuttgart"],"ehningen":["Ehningen","stuttgart"],
  "weilheim an der teck":["Weilheim an der Teck","stuttgart"],
  "lenningen":["Lenningen","stuttgart"],"denkendorf":["Denkendorf","stuttgart"],
  "altbach":["Altbach","stuttgart"],
  "reichenbach an der fils":["Reichenbach an der Fils","stuttgart"],
  "ebersbach an der fils":["Ebersbach an der Fils","stuttgart"],
  "uhingen":["Uhingen","stuttgart"],"eislingen":["Eislingen/Fils","stuttgart"],
  "süßen":["Süßen","stuttgart"],"donzdorf":["Donzdorf","stuttgart"],
  "schwaikheim":["Schwaikheim","stuttgart"],"korb":["Korb","stuttgart"],
  "winterbach":["Winterbach","stuttgart"],"urbach":["Urbach","stuttgart"],
  "plüderhausen":["Plüderhausen","stuttgart"],"welzheim":["Welzheim","stuttgart"],
  "murrhardt":["Murrhardt","stuttgart"],
  "sulzbach an der murr":["Sulzbach an der Murr","stuttgart"],
  "oppenweiler":["Oppenweiler","stuttgart"],"aspach":["Aspach","stuttgart"],
  "weissach im tal":["Weissach im Tal","stuttgart"],"weissach":["Weissach","stuttgart"],
  "heimsheim":["Heimsheim","stuttgart"],
  "rottenburg am neckar":["Rottenburg am Neckar","stuttgart"],
  "ammerbuch":["Ammerbuch","stuttgart"],"dettenhausen":["Dettenhausen","stuttgart"],
  "weil im schönbuch":["Weil im Schönbuch","stuttgart"],
  // ============================================
  // HANNOVER + 55km (zusätzliche ~100 Städte)
  // ============================================
  "linden":["Hannover-Linden","hannover"],"ricklingen":["Hannover-Ricklingen","hannover"],
  "döhren":["Hannover-Döhren","hannover"],"bothfeld":["Hannover-Bothfeld","hannover"],
  "herrenhausen":["Hannover-Herrenhausen","hannover"],
  "vahrenwald":["Hannover-Vahrenwald","hannover"],
  "kirchrode":["Hannover-Kirchrode","hannover"],"bemerode":["Hannover-Bemerode","hannover"],
  "kleefeld":["Hannover-Kleefeld","hannover"],"misburg":["Hannover-Misburg","hannover"],
  "anderten":["Hannover-Anderten","hannover"],"wettbergen":["Hannover-Wettbergen","hannover"],
  "badenstedt":["Hannover-Badenstedt","hannover"],"davenstedt":["Hannover-Davenstedt","hannover"],
  "ahlem":["Hannover-Ahlem","hannover"],"limmer":["Hannover-Limmer","hannover"],
  "stöcken":["Hannover-Stöcken","hannover"],"kronsberg":["Hannover-Kronsberg","hannover"],
  "wedemark":["Wedemark","hannover"],"uetze":["Uetze","hannover"],
  "nienburg":["Nienburg","hannover"],"stadthagen":["Stadthagen","hannover"],
  "bückeburg":["Bückeburg","hannover"],"rinteln":["Rinteln","hannover"],
  "obernkirchen":["Obernkirchen","hannover"],"bad eilsen":["Bad Eilsen","hannover"],
  "bad nenndorf":["Bad Nenndorf","hannover"],"rodenberg":["Rodenberg","hannover"],
  "bad münder":["Bad Münder","hannover"],"coppenbrügge":["Coppenbrügge","hannover"],
  "nordstemmen":["Nordstemmen","hannover"],"sarstedt":["Sarstedt","hannover"],
  "giesen":["Giesen","hannover"],"harsum":["Harsum","hannover"],
  "algermissen":["Algermissen","hannover"],"söhlde":["Söhlde","hannover"],
  "hohenhameln":["Hohenhameln","hannover"],"ilsede":["Ilsede","hannover"],
  "lengede":["Lengede","hannover"],"vechelde":["Vechelde","hannover"],
  "wendeburg":["Wendeburg","hannover"],"edemissen":["Edemissen","hannover"],
  "meinersen":["Meinersen","hannover"],"wathlingen":["Wathlingen","hannover"],
  "nienhagen":["Nienhagen","hannover"],"wietze":["Wietze","hannover"],
  "winsen aller":["Winsen (Aller)","hannover"],"hambühren":["Hambühren","hannover"],
  "lachendorf":["Lachendorf","hannover"],"elze":["Elze","hannover"],
  "gronau":["Gronau (Leine)","hannover"],
  "bad salzdetfurth":["Bad Salzdetfurth","hannover"],
  "bockenem":["Bockenem","hannover"],"alfeld":["Alfeld","hannover"],
  "emmerthal":["Emmerthal","hannover"],"aerzen":["Aerzen","hannover"],
  "hessisch oldendorf":["Hessisch Oldendorf","hannover"],
  "auetal":["Auetal","hannover"],"sachsenhagen":["Sachsenhagen","hannover"],
  "hagenburg":["Hagenburg","hannover"],"bad pyrmont":["Bad Pyrmont","hannover"],
  "salzhemmendorf":["Salzhemmendorf","hannover"],
  "lindwedel":["Lindwedel","hannover"],"hodenhagen":["Hodenhagen","hannover"],
  "rethem":["Rethem","hannover"],"ahlden":["Ahlden","hannover"],
  "godshorn":["Godshorn","hannover"],"kaltenweide":["Kaltenweide","hannover"],
  "letter":["Letter","hannover"],"hemmingen-westerfeld":["Hemmingen-Westerfeld","hannover"],
  "weetzen":["Weetzen","hannover"],"empelde":["Empelde","hannover"],
  "devese":["Devese","hannover"],"ihme-roloven":["Ihme-Roloven","hannover"],
  "diekholzen":["Diekholzen","hannover"],"schellerten":["Schellerten","hannover"],
  "holle":["Holle","hannover"],"lamspringe":["Lamspringe","hannover"],
  "duingen":["Duingen","hannover"],"delligsen":["Delligsen","hannover"],
  "hemeringen":["Hemeringen","hannover"],"tündern":["Tündern","hannover"],
  "afferde":["Afferde","hannover"],"lachem":["Lachem","hannover"],
  "rohrsen":["Rohrsen","hannover"],"wehrbergen":["Wehrbergen","hannover"],
  "vöhrum":["Vöhrum","hannover"],"rosenthal":["Rosenthal","hannover"],
  "stederdorf":["Stederdorf","hannover"],"dungelbeck":["Dungelbeck","hannover"],
  "eltze":["Eltze","hannover"],"schwicheldt":["Schwicheldt","hannover"],
  "essinghausen":["Essinghausen","hannover"],"berkum":["Berkum","hannover"],
  "altenhagen peine":["Altenhagen","hannover"],"groß ilsede":["Groß Ilsede","hannover"],
  "celle":["Celle","hannover"],"westercelle":["Westercelle","hannover"],
  "altencelle":["Altencelle","hannover"],"groß hehlen":["Groß Hehlen","hannover"],
  "vorwerk":["Vorwerk","hannover"],"scheuen":["Scheuen","hannover"],
  "garßen":["Garßen","hannover"],"bostel":["Bostel","hannover"],
  "ahlten":["Ahlten","hannover"],"immensen":["Immensen","hannover"],
  "arpke":["Arpke","hannover"],"hämelerwald":["Hämelerwald","hannover"],
  "berenbostel":["Berenbostel","hannover"],"havelse":["Havelse","hannover"],
  "horst":["Horst","hannover"],"meyenfeld":["Meyenfeld","hannover"],
  "osterwald":["Osterwald","hannover"],"frielingen":["Frielingen","hannover"],
  "steinhude":["Steinhude","hannover"],"luthe":["Luthe","hannover"],
  "bokeloh":["Bokeloh","hannover"],"idensen":["Idensen","hannover"],
  "mesmerode":["Mesmerode","hannover"],"großenheidorn":["Großenheidorn","hannover"],
  "bordenau":["Bordenau","hannover"],"mardorf":["Mardorf","hannover"],
  "schneeren":["Schneeren","hannover"],"poggenhagen":["Poggenhagen","hannover"],
  "mandelsloh":["Mandelsloh","hannover"],"helstorf":["Helstorf","hannover"],
  "alvesrode":["Alvesrode","hannover"],"gestorf":["Gestorf","hannover"],
  "eldagsen":["Eldagsen","hannover"],"bennigsen":["Bennigsen","hannover"],
  "völksen":["Völksen","hannover"],"altenhagen i":["Altenhagen I","hannover"],
  "lüdersen":["Lüdersen","hannover"],"mittelrode":["Mittelrode","hannover"],
  "dolgen":["Dolgen","hannover"],"everloh":["Everloh","hannover"],
  "benthe":["Benthe","hannover"],"northen":["Northen","hannover"],
  "argestorf":["Argestorf","hannover"],"holtensen":["Holtensen","hannover"],
  "leveste":["Leveste","hannover"],"egestorf":["Egestorf","hannover"],
  "sorsum":["Sorsum","hannover"],"bredenbeck":["Bredenbeck","hannover"],
  "degersen":["Degersen","hannover"],"bantorf":["Bantorf","hannover"],
  "höver":["Höver","hannover"],"bilm":["Bilm","hannover"],
  "bolzum":["Bolzum","hannover"],"wehmingen":["Wehmingen","hannover"],
  "ilten":["Ilten","hannover"],"kolshorn":["Kolshorn","hannover"],
  "wassel":["Wassel","hannover"],"reden":["Reden","hannover"],
  "ohlendorf":["Ohlendorf","hannover"],"schulenburg":["Schulenburg","hannover"],
  "koldingen":["Koldingen","hannover"],"ruthe":["Ruthe","hannover"],
  "jeinsen":["Jeinsen","hannover"],"schliekum":["Schliekum","hannover"],
  // ============================================
  // BIELEFELD + 55km (~96 Städte)
  // ============================================
  "bielefeld":["Bielefeld","bielefeld"],"brackwede":["Brackwede","bielefeld"],
  "sennestadt":["Sennestadt","bielefeld"],"schildesche":["Schildesche","bielefeld"],
  "jöllenbeck":["Jöllenbeck","bielefeld"],"heepen":["Heepen","bielefeld"],
  "stieghorst":["Stieghorst","bielefeld"],"gadderbaum":["Gadderbaum","bielefeld"],
  "senne":["Senne","bielefeld"],"dornberg":["Dornberg","bielefeld"],
  "gütersloh":["Gütersloh","bielefeld"],"herford":["Herford","bielefeld"],
  "minden":["Minden","bielefeld"],"bad salzuflen":["Bad Salzuflen","bielefeld"],
  "detmold":["Detmold","bielefeld"],"lemgo":["Lemgo","bielefeld"],
  "paderborn":["Paderborn","bielefeld"],"lippstadt":["Lippstadt","bielefeld"],
  "rheda-wiedenbrück":["Rheda-Wiedenbrück","bielefeld"],
  "löhne":["Löhne","bielefeld"],"bünde":["Bünde","bielefeld"],
  "bad oeynhausen":["Bad Oeynhausen","bielefeld"],
  "porta westfalica":["Porta Westfalica","bielefeld"],
  "enger":["Enger","bielefeld"],"spenge":["Spenge","bielefeld"],
  "halle westfalen":["Halle (Westf.)","bielefeld"],
  "versmold":["Versmold","bielefeld"],"oerlinghausen":["Oerlinghausen","bielefeld"],
  "werther":["Werther (Westf.)","bielefeld"],
  "borgholzhausen":["Borgholzhausen","bielefeld"],
  "steinhagen":["Steinhagen","bielefeld"],"leopoldshöhe":["Leopoldshöhe","bielefeld"],
  "bad driburg":["Bad Driburg","bielefeld"],"brakel":["Brakel","bielefeld"],
  "höxter":["Höxter","bielefeld"],"blomberg":["Blomberg","bielefeld"],
  "lage":["Lage","bielefeld"],
  "horn-bad meinberg":["Horn-Bad Meinberg","bielefeld"],
  "schlangen":["Schlangen","bielefeld"],"augustdorf":["Augustdorf","bielefeld"],
  "extertal":["Extertal","bielefeld"],"dörentrup":["Dörentrup","bielefeld"],
  "kalletal":["Kalletal","bielefeld"],"barntrup":["Barntrup","bielefeld"],
  "schieder-schwalenberg":["Schieder-Schwalenberg","bielefeld"],
  "lügde":["Lügde","bielefeld"],"kirchlengern":["Kirchlengern","bielefeld"],
  "hiddenhausen":["Hiddenhausen","bielefeld"],"vlotho":["Vlotho","bielefeld"],
  "hille":["Hille","bielefeld"],"lübbecke":["Lübbecke","bielefeld"],
  "espelkamp":["Espelkamp","bielefeld"],
  "preussisch oldendorf":["Preußisch Oldendorf","bielefeld"],
  "rödinghausen":["Rödinghausen","bielefeld"],"melle":["Melle","bielefeld"],
  "dissen":["Dissen","bielefeld"],"bad laer":["Bad Laer","bielefeld"],
  "bad rothenfelde":["Bad Rothenfelde","bielefeld"],
  "hilter":["Hilter","bielefeld"],
  "georgsmarienhütte":["Georgsmarienhütte","bielefeld"],
  "osnabrück":["Osnabrück","bielefeld"],"harsewinkel":["Harsewinkel","bielefeld"],
  "herzebrock-clarholz":["Herzebrock-Clarholz","bielefeld"],
  "rietberg":["Rietberg","bielefeld"],"delbrück":["Delbrück","bielefeld"],
  "verl":["Verl","bielefeld"],
  "schloß holte-stukenbrock":["Schloß Holte-Stukenbrock","bielefeld"],
  "hövelhof":["Hövelhof","bielefeld"],
  "bad lippspringe":["Bad Lippspringe","bielefeld"],
  "altenbeken":["Altenbeken","bielefeld"],"salzkotten":["Salzkotten","bielefeld"],
  "büren":["Büren","bielefeld"],"borchen":["Borchen","bielefeld"],
  "lichtenau":["Lichtenau","bielefeld"],"nieheim":["Nieheim","bielefeld"],
  "marienmünster":["Marienmünster","bielefeld"],
  "sassenberg":["Sassenberg","bielefeld"],"warendorf":["Warendorf","bielefeld"],
  "oelde":["Oelde","bielefeld"],"ennigerloh":["Ennigerloh","bielefeld"],
  "erwitte":["Erwitte","bielefeld"],"geseke":["Geseke","bielefeld"],
  "bad wünnenberg":["Bad Wünnenberg","bielefeld"],
  "warburg":["Warburg","bielefeld"],"beverungen":["Beverungen","bielefeld"],
  // ============================================
  // FRANKFURT / RHEIN-MAIN (~170 Städte)
  // ============================================
  "frankfurt":["Frankfurt am Main","frankfurt"],"offenbach":["Offenbach","frankfurt"],
  "neu-isenburg":["Neu-Isenburg","frankfurt"],"dreieich":["Dreieich","frankfurt"],
  "langen":["Langen","frankfurt"],"eschborn":["Eschborn","frankfurt"],
  "bad vilbel":["Bad Vilbel","frankfurt"],"maintal":["Maintal","frankfurt"],
  "mühlheim am main":["Mühlheim am Main","frankfurt"],"oberursel":["Oberursel","frankfurt"],
  "kronberg":["Kronberg","frankfurt"],"schwalbach am taunus":["Schwalbach am Taunus","frankfurt"],
  "sulzbach":["Sulzbach","frankfurt"],"kelsterbach":["Kelsterbach","frankfurt"],
  "mörfelden-walldorf":["Mörfelden-Walldorf","frankfurt"],"hattersheim":["Hattersheim","frankfurt"],
  "steinbach":["Steinbach","frankfurt"],"liederbach":["Liederbach","frankfurt"],
  "hanau":["Hanau","frankfurt"],"bad homburg":["Bad Homburg","frankfurt"],
  "rüsselsheim":["Rüsselsheim","frankfurt"],"groß-gerau":["Groß-Gerau","frankfurt"],
  "dietzenbach":["Dietzenbach","frankfurt"],"rodgau":["Rodgau","frankfurt"],
  "obertshausen":["Obertshausen","frankfurt"],"heusenstamm":["Heusenstamm","frankfurt"],
  "rödermark":["Rödermark","frankfurt"],"seligenstadt":["Seligenstadt","frankfurt"],
  "mainhausen":["Mainhausen","frankfurt"],"bruchköbel":["Bruchköbel","frankfurt"],
  "nidderau":["Nidderau","frankfurt"],"karben":["Karben","frankfurt"],
  "rosbach":["Rosbach","frankfurt"],"kelkheim":["Kelkheim","frankfurt"],
  "königstein":["Königstein","frankfurt"],"hofheim":["Hofheim","frankfurt"],
  "flörsheim":["Flörsheim","frankfurt"],"hochheim":["Hochheim","frankfurt"],
  "friedrichsdorf":["Friedrichsdorf","frankfurt"],"usingen":["Usingen","frankfurt"],
  "wehrheim":["Wehrheim","frankfurt"],"egelsbach":["Egelsbach","frankfurt"],
  "erzhausen":["Erzhausen","frankfurt"],"weiterstadt":["Weiterstadt","frankfurt"],
  "griesheim":["Griesheim","frankfurt"],"pfungstadt":["Pfungstadt","frankfurt"],
  "ober-ramstadt":["Ober-Ramstadt","frankfurt"],"eppertshausen":["Eppertshausen","frankfurt"],
  "münster hessen":["Münster","frankfurt"],"messel":["Messel","frankfurt"],
  "niederdorfelden":["Niederdorfelden","frankfurt"],"schöneck":["Schöneck","frankfurt"],
  "hammersbach":["Hammersbach","frankfurt"],"langenselbold":["Langenselbold","frankfurt"],
  "erlensee":["Erlensee","frankfurt"],"rodenbach":["Rodenbach","frankfurt"],
  "großkrotzenburg":["Großkrotzenburg","frankfurt"],"hainburg":["Hainburg","frankfurt"],
  "darmstadt":["Darmstadt","frankfurt"],"wiesbaden":["Wiesbaden","frankfurt"],
  "mainz":["Mainz","frankfurt"],"aschaffenburg":["Aschaffenburg","frankfurt"],
  "gießen":["Gießen","frankfurt"],"gelnhausen":["Gelnhausen","frankfurt"],
  "bensheim":["Bensheim","frankfurt"],"heppenheim":["Heppenheim","frankfurt"],
  "viernheim":["Viernheim","frankfurt"],"lampertheim":["Lampertheim","frankfurt"],
  "dieburg":["Dieburg","frankfurt"],"babenhausen":["Babenhausen","frankfurt"],
  "reinheim":["Reinheim","frankfurt"],"groß-umstadt":["Groß-Umstadt","frankfurt"],
  "taunusstein":["Taunusstein","frankfurt"],"eltville":["Eltville","frankfurt"],
  "geisenheim":["Geisenheim","frankfurt"],"rüdesheim":["Rüdesheim","frankfurt"],
  "bad schwalbach":["Bad Schwalbach","frankfurt"],"idstein":["Idstein","frankfurt"],
  "bad camberg":["Bad Camberg","frankfurt"],"butzbach":["Butzbach","frankfurt"],
  "lich":["Lich","frankfurt"],"nidda":["Nidda","frankfurt"],
  "büdingen":["Büdingen","frankfurt"],"limeshain":["Limeshain","frankfurt"],
  "kahl am main":["Kahl am Main","frankfurt"],"alzenau":["Alzenau","frankfurt"],
  "goldbach":["Goldbach","frankfurt"],"hösbach":["Hösbach","frankfurt"],
  "kleinostheim":["Kleinostheim","frankfurt"],"stockstadt am main":["Stockstadt am Main","frankfurt"],
  "großostheim":["Großostheim","frankfurt"],"ingelheim":["Ingelheim","frankfurt"],
  "bingen":["Bingen","frankfurt"],"oestrich-winkel":["Oestrich-Winkel","frankfurt"],
  "bad nauheim":["Bad Nauheim","frankfurt"],"wächtersbach":["Wächtersbach","frankfurt"],
  "birstein":["Birstein","frankfurt"],"brachttal":["Brachttal","frankfurt"],
  "freigericht":["Freigericht","frankfurt"],"hasselroth":["Hasselroth","frankfurt"],
  "linsengericht":["Linsengericht","frankfurt"],"bischofsheim":["Bischofsheim","frankfurt"],
  "raunheim":["Raunheim","frankfurt"],"trebur":["Trebur","frankfurt"],
  "nauheim":["Nauheim","frankfurt"],"büttelborn":["Büttelborn","frankfurt"],
  "gernsheim":["Gernsheim","frankfurt"],"riedstadt":["Riedstadt","frankfurt"],
  "zwingenberg":["Zwingenberg","frankfurt"],"alsbach-hähnlein":["Alsbach-Hähnlein","frankfurt"],
  "bickenbach":["Bickenbach","frankfurt"],"seeheim-jugenheim":["Seeheim-Jugenheim","frankfurt"],
  "mühltal":["Mühltal","frankfurt"],"modautal":["Modautal","frankfurt"],
  "fischbachtal":["Fischbachtal","frankfurt"],"groß-bieberau":["Groß-Bieberau","frankfurt"],
  "otzberg":["Otzberg","frankfurt"],"worms":["Worms","frankfurt"],
  "frankenthal":["Frankenthal","frankfurt"],"bad kreuznach":["Bad Kreuznach","frankfurt"],
  "alzey":["Alzey","frankfurt"],"oppenheim":["Oppenheim","frankfurt"],
  "nierstein":["Nierstein","frankfurt"],"limburg":["Limburg","frankfurt"],
  "wetzlar":["Wetzlar","frankfurt"],"weinheim":["Weinheim","frankfurt"],
  "lorsch":["Lorsch","frankfurt"],"michelstadt":["Michelstadt","frankfurt"],
  "erbach":["Erbach","frankfurt"],"bad könig":["Bad König","frankfurt"],
  "höchst im odenwald":["Höchst im Odenwald","frankfurt"],
  "bad orb":["Bad Orb","frankfurt"],"schlüchtern":["Schlüchtern","frankfurt"],
  "miltenberg":["Miltenberg","frankfurt"],"obernburg":["Obernburg","frankfurt"],
  "wörth am main":["Wörth am Main","frankfurt"],"lollar":["Lollar","frankfurt"],
  "pohlheim":["Pohlheim","frankfurt"],"hungen":["Hungen","frankfurt"],
  "grünberg":["Grünberg","frankfurt"],"solms":["Solms","frankfurt"],
  "leun":["Leun","frankfurt"],"braunfels":["Braunfels","frankfurt"],
  "weilburg":["Weilburg","frankfurt"],"runkel":["Runkel","frankfurt"],
  "hadamar":["Hadamar","frankfurt"],"herborn":["Herborn","frankfurt"],
  "asslar":["Asslar","frankfurt"],"ehringshausen":["Ehringshausen","frankfurt"],
  "selters":["Selters","frankfurt"],
  "bad soden-salmünster":["Bad Soden-Salmünster","frankfurt"],
  "steinau an der straße":["Steinau an der Straße","frankfurt"],
  "brensbach":["Brensbach","frankfurt"],"höchst":["Höchst","frankfurt"],
  "bad soden":["Bad Soden","frankfurt"],"kriftel":["Kriftel","frankfurt"],
  "eppstein":["Eppstein","frankfurt"],"neuberg":["Neuberg","frankfurt"],
  "florstadt":["Florstadt","frankfurt"],"ober-mörlen":["Ober-Mörlen","frankfurt"],
  "groß-zimmern":["Groß-Zimmern","frankfurt"],"roßdorf":["Roßdorf","frankfurt"],
  "rockenberg":["Rockenberg","frankfurt"],"wölfersheim":["Wölfersheim","frankfurt"],
  "ranstadt":["Ranstadt","frankfurt"],"ortenberg":["Ortenberg","frankfurt"],
  "münzenberg":["Münzenberg","frankfurt"],"breuberg":["Breuberg","frankfurt"],
  "großwallstadt":["Großwallstadt","frankfurt"],"elsenfeld":["Elsenfeld","frankfurt"],
  "erlenbach am main":["Erlenbach am Main","frankfurt"],"gedern":["Gedern","frankfurt"],
  "klingenberg":["Klingenberg","frankfurt"],"osthofen":["Osthofen","frankfurt"],
  "ronneburg":["Ronneburg","frankfurt"],"kirchheimbolanden":["Kirchheimbolanden","frankfurt"],
  "monsheim":["Monsheim","frankfurt"],"klein-zimmern":["Klein-Zimmern","frankfurt"],
  // ============================================
  // NRW ERGÄNZUNGEN — Köln/Bonn
  // ============================================
  "porz":["Köln-Porz","koeln"],"rodenkirchen":["Köln-Rodenkirchen","koeln"],
  "overath":["Overath","koeln"],"much":["Much","koeln"],
  "windeck":["Windeck","koeln"],"eitorf":["Eitorf","koeln"],
  "königswinter":["Königswinter","koeln"],"bad honnef":["Bad Honnef","koeln"],
  "meckenheim":["Meckenheim","koeln"],"rheinbach":["Rheinbach","koeln"],
  "swisttal":["Swisttal","koeln"],"bornheim":["Bornheim","koeln"],
  "alfter":["Alfter","koeln"],"wachtberg":["Wachtberg","koeln"],
  "niederkassel":["Niederkassel","koeln"],"sankt augustin":["Sankt Augustin","koeln"],
  "bad münstereifel":["Bad Münstereifel","koeln"],"zülpich":["Zülpich","koeln"],
  "wipperfürth":["Wipperfürth","koeln"],"lindlar":["Lindlar","koeln"],
  "engelskirchen":["Engelskirchen","koeln"],"nümbrecht":["Nümbrecht","koeln"],
  "waldbröl":["Waldbröl","koeln"],"wiehl":["Wiehl","koeln"],
  "reichshof":["Reichshof","koeln"],"bergneustadt":["Bergneustadt","koeln"],
  "marienheide":["Marienheide","koeln"],"morsbach":["Morsbach","koeln"],
  "radevormwald":["Radevormwald","koeln"],"hückeswagen":["Hückeswagen","koeln"],
  "rösrath":["Rösrath","koeln"],"wegberg":["Wegberg","koeln"],
  "hückelhoven":["Hückelhoven","koeln"],"wassenberg":["Wassenberg","koeln"],
  "geilenkirchen":["Geilenkirchen","koeln"],"herzogenrath":["Herzogenrath","koeln"],
  "würselen":["Würselen","koeln"],"alsdorf":["Alsdorf","koeln"],
  "baesweiler":["Baesweiler","koeln"],"stolberg":["Stolberg","koeln"],
  "eschweiler":["Eschweiler","koeln"],"langerwehe":["Langerwehe","koeln"],
  "bedburg":["Bedburg","koeln"],"elsdorf":["Elsdorf","koeln"],
  // ============================================
  // NRW ERGÄNZUNGEN — Düsseldorf/Niederrhein
  // ============================================
  "wülfrath":["Wülfrath","duesseldorf"],"heiligenhaus":["Heiligenhaus","duesseldorf"],
  "haan":["Haan","duesseldorf"],"emmerich":["Emmerich am Rhein","duesseldorf"],
  "rees":["Rees","duesseldorf"],"xanten":["Xanten","duesseldorf"],
  "kamp-lintfort":["Kamp-Lintfort","duesseldorf"],"rheinberg":["Rheinberg","duesseldorf"],
  "neukirchen-vluyn":["Neukirchen-Vluyn","duesseldorf"],"voerde":["Voerde","duesseldorf"],
  "hamminkeln":["Hamminkeln","duesseldorf"],"alpen":["Alpen","duesseldorf"],
  "sonsbeck":["Sonsbeck","duesseldorf"],"kalkar":["Kalkar","duesseldorf"],
  "bedburg-hau":["Bedburg-Hau","duesseldorf"],"kranenburg":["Kranenburg","duesseldorf"],
  "issum":["Issum","duesseldorf"],"geldern":["Geldern","duesseldorf"],
  "straelen":["Straelen","duesseldorf"],"nettetal":["Nettetal","duesseldorf"],
  "tönisvorst":["Tönisvorst","duesseldorf"],"willich":["Willich","duesseldorf"],
  "korschenbroich":["Korschenbroich","duesseldorf"],"jüchen":["Jüchen","duesseldorf"],
  "rommerskirchen":["Rommerskirchen","duesseldorf"],
  // ============================================
  // NRW ERGÄNZUNGEN — Ruhrgebiet
  // ============================================
  "gladbeck":["Gladbeck","ruhrgebiet"],"herten":["Herten","ruhrgebiet"],
  "waltrop":["Waltrop","ruhrgebiet"],"bergkamen":["Bergkamen","ruhrgebiet"],
  "selm":["Selm","ruhrgebiet"],"werne":["Werne","ruhrgebiet"],
  "haltern am see":["Haltern am See","ruhrgebiet"],
  "oer-erkenschwick":["Oer-Erkenschwick","ruhrgebiet"],
  "datteln":["Datteln","ruhrgebiet"],"hemer":["Hemer","ruhrgebiet"],
  "menden":["Menden","ruhrgebiet"],"fröndenberg":["Fröndenberg","ruhrgebiet"],
  "holzwickede":["Holzwickede","ruhrgebiet"],"bönen":["Bönen","ruhrgebiet"],
  "meschede":["Meschede","ruhrgebiet"],"brilon":["Brilon","ruhrgebiet"],
  "winterberg":["Winterberg","ruhrgebiet"],"sundern":["Sundern","ruhrgebiet"],
  "schmallenberg":["Schmallenberg","ruhrgebiet"],"attendorn":["Attendorn","ruhrgebiet"],
  "plettenberg":["Plettenberg","ruhrgebiet"],"werdohl":["Werdohl","ruhrgebiet"],
  "altena":["Altena","ruhrgebiet"],"kierspe":["Kierspe","ruhrgebiet"],
  "meinerzhagen":["Meinerzhagen","ruhrgebiet"],"balve":["Balve","ruhrgebiet"],
  "neuenrade":["Neuenrade","ruhrgebiet"],"finnentrop":["Finnentrop","ruhrgebiet"],
  "lennestadt":["Lennestadt","ruhrgebiet"],"olsberg":["Olsberg","ruhrgebiet"],
  "marsberg":["Marsberg","ruhrgebiet"],"warstein":["Warstein","ruhrgebiet"],
  "kreuztal":["Kreuztal","ruhrgebiet"],"netphen":["Netphen","ruhrgebiet"],
  "freudenberg":["Freudenberg","ruhrgebiet"],"bad berleburg":["Bad Berleburg","ruhrgebiet"],
  "wilnsdorf":["Wilnsdorf","ruhrgebiet"],"hilchenbach":["Hilchenbach","ruhrgebiet"],
  // ============================================
  // NRW ERGÄNZUNGEN — Münsterland
  // ============================================
  "coesfeld":["Coesfeld","nrw"],"borken":["Borken","nrw"],
  "vreden":["Vreden","nrw"],"ahaus":["Ahaus","nrw"],
  "steinfurt":["Steinfurt","nrw"],
  "emsdetten":["Emsdetten","nrw"],"greven":["Greven","nrw"],
  "telgte":["Telgte","nrw"],"rheine":["Rheine","nrw"],
  "ibbenbüren":["Ibbenbüren","nrw"],"lengerich":["Lengerich","nrw"],
  "dülmen":["Dülmen","nrw"],"senden":["Senden","nrw"],
  "lüdinghausen":["Lüdinghausen","nrw"],"nottuln":["Nottuln","nrw"],
  "havixbeck":["Havixbeck","nrw"],
  // ============================================
  // BERLIN ERGÄNZUNGEN
  // ============================================
  "wittenberge":["Wittenberge","berlin"],"perleberg":["Perleberg","berlin"],
  "pritzwalk":["Pritzwalk","berlin"],"kyritz":["Kyritz","berlin"],
  "rathenow":["Rathenow","berlin"],"cottbus":["Cottbus","berlin"],
  "senftenberg":["Senftenberg","berlin"],"spremberg":["Spremberg","berlin"],
  "forst":["Forst (Lausitz)","berlin"],"guben":["Guben","berlin"],
  "herzberg":["Herzberg (Elster)","berlin"],"dahme":["Dahme/Mark","berlin"],
  "luckau":["Luckau","berlin"],"calau":["Calau","berlin"],
  "vetschau":["Vetschau","berlin"],"schwedt":["Schwedt/Oder","berlin"],
  "prenzlau":["Prenzlau","berlin"],"fürstenberg":["Fürstenberg/Havel","berlin"],
  "altlandsberg":["Altlandsberg","berlin"],
  "petershagen/eggersdorf":["Petershagen/Eggersdorf","berlin"],
  "schöneiche":["Schöneiche bei Berlin","berlin"],
  "grünheide":["Grünheide (Mark)","berlin"],
  "panketal":["Panketal","berlin"],"ahrensfelde":["Ahrensfelde","berlin"],
  "werneuchen":["Werneuchen","berlin"],"bad belzig":["Bad Belzig","berlin"],
  "lehnin":["Kloster Lehnin","berlin"],"groß kreutz":["Groß Kreutz (Havel)","berlin"],
  "leegebruch":["Leegebruch","berlin"],"oberkrämer":["Oberkrämer","berlin"],
  "liebenwalde":["Liebenwalde","berlin"],"schulzendorf":["Schulzendorf","berlin"],
  "eichwalde":["Eichwalde","berlin"],"stahnsdorf":["Stahnsdorf","berlin"],
  "französisch buchholz":["Berlin-Französisch Buchholz","berlin"],
  "malchow":["Berlin-Malchow","berlin"],"blankenburg":["Berlin-Blankenburg","berlin"],
  "niederschönhausen":["Berlin-Niederschönhausen","berlin"],
  "wittenau":["Berlin-Wittenau","berlin"],"lübars":["Berlin-Lübars","berlin"],
  "konradshöhe":["Berlin-Konradshöhe","berlin"],"heiligensee":["Berlin-Heiligensee","berlin"],
  "kladow":["Berlin-Kladow","berlin"],
  // ============================================
  // HAMBURG ERGÄNZUNGEN
  // ============================================
  "bramfeld":["Hamburg-Bramfeld","hamburg"],"horn":["Hamburg-Horn","hamburg"],
  "hammerbrook":["Hamburg-Hammerbrook","hamburg"],"borgfelde":["Hamburg-Borgfelde","hamburg"],
  "rothenburgsort":["Hamburg-Rothenburgsort","hamburg"],"veddel":["Hamburg-Veddel","hamburg"],
  "neugraben-fischbek":["Hamburg-Neugraben-Fischbek","hamburg"],
  "hausbruch":["Hamburg-Hausbruch","hamburg"],"rönneburg":["Hamburg-Rönneburg","hamburg"],
  "lohbrügge":["Hamburg-Lohbrügge","hamburg"],"kirchwerder":["Hamburg-Kirchwerder","hamburg"],
  "neuallermöhe":["Hamburg-Neuallermöhe","hamburg"],"allermöhe":["Hamburg-Allermöhe","hamburg"],
  "curslack":["Hamburg-Curslack","hamburg"],"duvenstedt":["Hamburg-Duvenstedt","hamburg"],
  "bergstedt":["Hamburg-Bergstedt","hamburg"],
  "lemsahl-mellingstedt":["Hamburg-Lemsahl-Mellingstedt","hamburg"],
  "hummelsbüttel":["Hamburg-Hummelsbüttel","hamburg"],
  "fuhlsbüttel":["Hamburg-Fuhlsbüttel","hamburg"],
  "ohlsdorf":["Hamburg-Ohlsdorf","hamburg"],"alsterdorf":["Hamburg-Alsterdorf","hamburg"],
  "groß flottbek":["Hamburg-Groß Flottbek","hamburg"],
  "othmarschen":["Hamburg-Othmarschen","hamburg"],
  "rissen":["Hamburg-Rissen","hamburg"],"sülldorf":["Hamburg-Sülldorf","hamburg"],
  "iserbrook":["Hamburg-Iserbrook","hamburg"],"lurup":["Hamburg-Lurup","hamburg"],
  "bahrenfeld":["Hamburg-Bahrenfeld","hamburg"],
  "büchen":["Büchen","hamburg"],"mölln":["Mölln","hamburg"],
  "ratzeburg":["Ratzeburg","hamburg"],"bad bramstedt":["Bad Bramstedt","hamburg"],
  "barsbüttel":["Barsbüttel","hamburg"],"oststeinbek":["Oststeinbek","hamburg"],
  "ammersbek":["Ammersbek","hamburg"],"großhansdorf":["Großhansdorf","hamburg"],
  "tangstedt":["Tangstedt","hamburg"],"bönningstedt":["Bönningstedt","hamburg"],
  "jork":["Jork","hamburg"],"neu wulmstorf":["Neu Wulmstorf","hamburg"],
  "rosengarten":["Rosengarten","hamburg"],"stelle":["Stelle","hamburg"]
};

// Region addresses for impressum
var DTR_REGIONS={
  muenchen:{
    name:'München',
    address:'Sonnenstr. 21, 80331 München',
    email:'muenchen@rohrreinigung-meissner.de'
  },
  nrw:{
    name:'Münsterland',
    address:'Salzstr. 21, 48143 Münster',
    email:'muenster@rohrreinigung-meissner.de'
  },
  koeln:{
    name:'Köln / Bonn',
    address:'Hohenstaufenring 62, 50674 Köln',
    email:'koeln@rohrreinigung-meissner.de'
  },
  duesseldorf:{
    name:'Düsseldorf / Niederrhein',
    address:'Herzogstr. 15, 40217 Düsseldorf',
    email:'duesseldorf@rohrreinigung-meissner.de'
  },
  ruhrgebiet:{
    name:'Ruhrgebiet',
    address:'Viehofer Str. 17, 45127 Essen',
    email:'ruhrgebiet@rohrreinigung-meissner.de'
  },
  berlin:{
    name:'Berlin',
    address:'Oranienstraße 63, 10969 Berlin',
    email:'berlin@rohrreinigung-meissner.de'
  },
  bremen:{
    name:'Bremen',
    address:'Obernstr. 39, 28195 Bremen',
    email:'bremen@rohrreinigung-meissner.de'
  },
  hamburg:{
    name:'Hamburg',
    address:'Mönckebergstr. 7, 20095 Hamburg',
    email:'hamburg@rohrreinigung-meissner.de'
  },
  frankfurt:{
    name:'Frankfurt / Rhein-Main',
    address:'Kaiserstr. 62, 60329 Frankfurt am Main',
    email:'frankfurt@rohrreinigung-meissner.de'
  },
  stuttgart:{
    name:'Stuttgart',
    address:'Königstr. 28, 70173 Stuttgart',
    email:'stuttgart@rohrreinigung-meissner.de'
  },
  hannover:{
    name:'Hannover',
    address:'Georgstr. 36, 30159 Hannover',
    email:'hannover@rohrreinigung-meissner.de'
  },
  bielefeld:{
    name:'Bielefeld / OWL',
    address:'Bahnhofstr. 19, 33602 Bielefeld',
    email:'bielefeld@rohrreinigung-meissner.de'
  },
  nuernberg:{
    name:'Nürnberg / Franken',
    address:'Königstr. 32, 90402 Nürnberg',
    email:'nuernberg@rohrreinigung-meissner.de'
  }
};

// Normalize function: lowercase, replace hyphens/underscores/plus with space, collapse
function dtrNorm(s){return s.replace(/[\+\-_]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();}

// Umlaut normalization: muenchen→münchen etc.
// EXPLIZITE Mappings für bekannte Städte — keine generische ae/oe/ue Regel
// (würde sonst "amerang"→"ämerang", "babenhausen"→"bäbenhausen" verursachen)
function dtrUmlaut(s){
  var map={
    'muenchen':'münchen','nuernberg':'nürnberg','koeln':'köln','duesseldorf':'düsseldorf',
    'luebeck':'lübeck','saarbruecken':'saarbrücken','wuerzburg':'würzburg','tuebingen':'tübingen',
    'guetersloh':'gütersloh','luedenscheid':'lüdenscheid','luenen':'lünen','luebbecke':'lübbecke',
    'buende':'bünde','buedingen':'büdingen','huerth':'hürth','moenchengladbach':'mönchengladbach',
    'moelln':'mölln','moerfelden':'mörfelden','muelheim':'mülheim','muenster':'münster',
    'osnabrueck':'osnabrück','goettingen':'göttingen','goeppingen':'göppingen','guetersloh':'gütersloh',
    'tuerkheim':'türkheim','schoenebeck':'schönebeck','offenburg':'offenburg','rueckersdorf':'rückersdorf',
    'pluederhausen':'plüderhausen','wuelfrath':'wülfrath','huerth':'hürth','buehl':'bühl',
    'fuerstenfeldbruck':'fürstenfeldbruck','muehldorf':'mühldorf','muehlheim':'mühlheim',
    'koenigsbrunn':'königsbrunn','koenigswinter':'königswinter','wuelfrath':'wülfrath',
    'koeniglutter':'königslutter','suessen':'süßen','gluecksburg':'glücksburg','flensburg':'flensburg',
    'huettenberg':'hüttenberg','buehlertal':'bühlertal','aelfeld':'alfeld'
  };
  for(var k in map){if(map.hasOwnProperty(k))s=s.split(k).join(map[k]);}
  // German "strasse" → "straße" (nur bei genauer Wortgrenze)
  s=s.replace(/strasse/g,'straße');
  return s;
}

// Pre-compute sorted + normalized keys (once on load)
var DTR_SORTED_KEYS=Object.keys(DTR_CITIES).sort(function(a,b){return b.length-a.length});
var DTR_NORM_KEYS=[];
for(var _i=0;_i<DTR_SORTED_KEYS.length;_i++){
  DTR_NORM_KEYS.push(dtrNorm(DTR_SORTED_KEYS[_i]));
}

/**
 * Extract city from keyword parameter
 * Returns {name: "Berlin-Kreuzberg", region: "berlin"} or null
 *
 * Uses word-boundary matching to prevent false positives:
 * "au" won't match "braunschweig", "essen" won't match "essenbach"
 */
function dtrExtractCity(keyword){
  if(!keyword)return null;
  // Decode → normalize (+, -, _ → space) → umlaut-fix → wrap in spaces for word boundary
  var decoded=' '+dtrUmlaut(dtrNorm(decodeURIComponent(keyword)))+' ';
  for(var i=0;i<DTR_SORTED_KEYS.length;i++){
    var nk=DTR_NORM_KEYS[i];
    var pos=decoded.indexOf(nk);
    if(pos===-1)continue;
    // Word boundary check: char before and after must be space (or string edge)
    var before=decoded.charAt(pos-1);
    var after=decoded.charAt(pos+nk.length);
    if((before===' '||before==='')&&(after===' '||after==='')){
      return{name:DTR_CITIES[DTR_SORTED_KEYS[i]][0],region:DTR_CITIES[DTR_SORTED_KEYS[i]][1]};
    }
  }
  return null;
}

/**
 * Save city + region — sessionStorage (current tab) + Cookie (7 days, cross-session)
 */
function dtrSave(cityName,region){
  try{
    sessionStorage.setItem('dtr_city',cityName);
    if(region)sessionStorage.setItem('dtr_region',region);
  }catch(e){}
  try{
    // 7-day cookie for returning visitors
    var d=new Date();d.setTime(d.getTime()+7*24*60*60*1000);
    var exp='; expires='+d.toUTCString();
    document.cookie='dtr_city='+encodeURIComponent(cityName)+exp+'; path=/; SameSite=Lax';
    if(region)document.cookie='dtr_region='+encodeURIComponent(region)+exp+'; path=/; SameSite=Lax';
  }catch(e){}
}

/**
 * Load city + region — Priorität: sessionStorage > Cookie
 * Returns {name, region} or null
 */
function dtrLoad(){
  // 1. sessionStorage (current tab/session)
  try{
    var c=sessionStorage.getItem('dtr_city');
    var r=sessionStorage.getItem('dtr_region');
    if(c)return{name:c,region:r||null};
  }catch(e){}
  // 2. Cookie (7-day persistent)
  try{
    var ck=document.cookie.split('; ');
    var city=null,reg=null;
    for(var i=0;i<ck.length;i++){
      var p=ck[i].split('=');
      if(p[0]==='dtr_city')city=decodeURIComponent(p[1]||'');
      if(p[0]==='dtr_region')reg=decodeURIComponent(p[1]||'');
    }
    if(city)return{name:city,region:reg||null};
  }catch(e){}
  return null;
}

/**
 * Auto-init: detect city from URL params or sessionStorage, apply everywhere
 * Call this from any page — works on main page, subpages, and legal pages
 * Returns {name, region} or null
 */
function dtrInit(){
  var P=new URLSearchParams(window.location.search);
  // Stadt-Aliase: stadt > city > ort > location
  var stadt=P.get('stadt')||P.get('city')||P.get('ort')||P.get('location');
  // Keyword-Aliase: keyword > kw > q > search
  var keyword=P.get('keyword')||P.get('kw')||P.get('q')||P.get('search');
  var region=P.get('region');
  var result=null;

  // Priority 1: explicit ?stadt= parameter
  if(stadt){
    var decoded=decodeURIComponent(stadt);
    result={name:decoded,region:null};
    // Try to find region for this city
    var cityLower=decoded.toLowerCase();
    if(DTR_CITIES[cityLower])result.region=DTR_CITIES[cityLower][1];
  }
  // Priority 2: extract city from ?keyword= parameter
  if(!result&&keyword){
    result=dtrExtractCity(keyword);
  }
  // Priority 3: load from sessionStorage (cross-page persistence)
  if(!result){
    result=dtrLoad();
  }

  // Apply city if found
  if(result&&result.name){
    dtrApplyCity(result.name,result.region);
    dtrSave(result.name,result.region);
  }

  // Apply region on impressum pages
  if(region){
    dtrApplyRegion(region);
  }else if(result&&result.region){
    dtrApplyRegion(result.region);
  }

  // Decorate internal links with keyword param for cross-page persistence
  if(result&&result.name){
    var kwParam=keyword||result.name.toLowerCase().replace(/\s/g,'+');
    document.querySelectorAll('a[href]').forEach(function(a){
      var h=a.getAttribute('href');
      // Only internal HTML links, skip tel:, mailto:, http external, #anchors
      if(!h||h.indexOf('tel:')===0||h.indexOf('mailto:')===0||h.indexOf('#')===0)return;
      if(h.indexOf('http')===0&&h.indexOf(location.hostname)===-1)return;
      // Skip if already has keyword param
      if(h.indexOf('keyword=')!==-1)return;
      // Append keyword
      var sep=h.indexOf('?')===-1?'?':'&';
      a.setAttribute('href',h+sep+'keyword='+encodeURIComponent(kwParam));
    });
  }

  return result;
}

/**
 * Apply city to all DTR spans and update meta
 */
function dtrApplyCity(cityName,region){
  if(!cityName)return;
  // Hero headline
  var heroCityWrap=document.querySelector('.hero-city-wrap');
  if(heroCityWrap)heroCityWrap.innerHTML='in <span class="city-name">'+cityName+'</span> – Heute noch Termin';
  // All city-name spans (direct replacement)
  document.querySelectorAll('.'+DTR_CONFIG.cssClass).forEach(function(el){el.textContent=cityName});
  // All city-name-inline spans (with leading space + "in")
  document.querySelectorAll('.'+DTR_CONFIG.cssClassInline).forEach(function(el){el.textContent=' in '+cityName});
  // FAQ special span (includes trailing ?)
  document.querySelectorAll('.city-name-faq').forEach(function(el){el.textContent=' in '+cityName+'?'});
  // Page title
  document.title=DTR_CONFIG.titleTemplate.replace('{city}',cityName);
  // Meta description
  var meta=document.querySelector('meta[name="description"]');
  if(meta)meta.setAttribute('content','Rohrreinigung in '+cityName+' – TÜV-zertifizierter Meisterbetrieb Meißner. 24/7 Notdienst, faire Preise, schnelle Anfahrt. Jetzt anrufen!');
  // OG tags
  var ogTitle=document.querySelector('meta[property="og:title"]');
  var ogDesc=document.querySelector('meta[property="og:description"]');
  if(ogTitle)ogTitle.setAttribute('content','Rohrreinigung '+cityName+' – 24/7 Notdienst | Meißner');
  if(ogDesc)ogDesc.setAttribute('content','TÜV-zertifizierter Rohrreinigungs-Fachbetrieb in '+cityName+' – Abfluss, Toilette, Kanal, faire Preise, schnelle Anfahrt.');
  // Top bar (if exists)
  var topBarText=document.getElementById('topBarText');
  if(topBarText)topBarText.innerHTML='Schnelle Anfahrt nach <strong>'+cityName+'</strong> – kostenlose Erstberatung';
  // Footer legal links — append ?region=
  if(region){
    document.querySelectorAll('a[href^="impressum"],a[href^="datenschutz"],a[href^="agb"]').forEach(function(a){
      var href=a.getAttribute('href');
      if(href.indexOf('?')===-1)a.setAttribute('href',href+'?region='+region);
    });
  }
}

/**
 * Apply region to impressum page (dynamic address block)
 */
function dtrApplyRegion(regionId){
  var r=DTR_REGIONS[regionId];
  if(!r)return;
  var block=document.getElementById('dtr-region-block');
  if(block){
    block.innerHTML='<h2>Niederlassung '+r.name+'</h2><p><strong>Rohrreinigung Meißner – Niederlassung '+r.name+'</strong><br>'+r.address+'<br>Ansprechpartner: Stefan Meißner, Gebietsleiter<br>E-Mail: <a href="mailto:'+r.email+'">'+r.email+'</a><br>Telefon: <a href="tel:+4915792631860">'+DTR_CONFIG.phone+'</a></p>';
    block.style.display='block';
  }
}
