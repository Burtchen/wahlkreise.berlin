const STATE_CONSTITUENCIES_WITH_DESCRIPTIONS = [
  {
    constituency: "Mitte-01",
    description:
      "Ortsteil Mitte nördlich der Allee Unter den Linden sowie auf der anderen Spreeseite nördlich der Linie Monbijoustraße-Krausnickstraße-Sophienstraße-Rosenthaler Straße",
  },
  {
    constituency: "Mitte-02",
    description:
      "Ortsteil Mitte südlich der Allee Unter den Linden sowie auf der anderen Spreeseite südlich der Linie Monbijoustraße-Krausnickstraße-Sophienstraße-Rosenthaler Straße",
  },
  {
    constituency: "Mitte-03",
    description:
      "Tiergarten, Hansaviertel und Moabit südlich der Linie Huttenstraße–Turmstraße–Seydlitzstraße",
  },
  {
    constituency: "Mitte-04",
    description:
      "Moabit nördlich der Linie Huttenstraße–Turmstraße–Seydlitzstraße sowie der Brüsseler Kiez des Weddings, allerdings mit der Triftstraße als südliche Begrenzung",
  },
  {
    constituency: "Mitte-05",
    description:
      "Wedding nördlich der Seestraße/Osloer Straße bis zur Drontheimer Straße sowie östlich der Müllerstraße nördlich der Utrechter Straße/Groninger Straße/Liebenwalder Straße/Schulstraße/Heinz-Galinski-Straße",
  },
  {
    constituency: "Mitte-06",
    description: "Gesundbrunnen nördlich der Ringbahn",
  },
  {
    constituency: "Mitte-07",
    description:
      "Gesundbrunnen südlich der Ringbahn und der Wedding südlich der Triftstraße auf der westlichen Seite der Müllerstraße sowie südlich der Utrechter Straße auf der östlichen Seite der Müllerstraße",
  },
  {
    constituency: "Friedrichshain-Kreuzberg-01",
    description:
      "Kreuzberg westlich der Linie Lindenstraße/Zossener Straße und südlich der Gneisenaustraße",
  },
  {
    constituency: "Friedrichshain-Kreuzberg-02",
    description:
      "Kreuzberg südlich der Skalitzer Straße ab dem Wassertorplatz und Erkelenzdamm über Fraenkelufer zur Admiralbrücke über die Grimmstraße, Urbanstraße und Fontanestraße bis zum Südstern.",
  },
  {
    constituency: "Friedrichshain-Kreuzberg-03",
    description:
      "Kreuzberg nördlich der Linie Gitschiner Straße-Skalitzer Straße bis zur Lindenstraße sowie östlich der Zossener Straße und nördlich der Gneisenaustraße bis Höhe Fontanepromenade, Grimmstraße, Erkelenzdamm",
  },
  {
    constituency: "Friedrichshain-Kreuzberg-04",
    description:
      "Friedrichshain westlich der Warschauer Straße, nördlich der Karl-Marx-Allee entlang der Linie Fritz-Schiff-Weg/Richard-Sorge-Straße/Kochhannstraße/Petersburger Straße",
  },
  {
    constituency: "Friedrichshain-Kreuzberg-05",
    description:
      "Friedrichshain nördlich der Boxhagener und Scharnweberstraße, westlich bis zur Linie Fritz-Schiff-Weg/Richard-Sorge-Straße/Kochhannstraße/Petersburger Straße",
  },
  {
    constituency: "Friedrichshain-Kreuzberg-06",
    description:
      "Friedrichshain östlich der Warschauer Straße und Südlich der Boxhagener und Scharnweberstraße",
  },
  {
    constituency: "Pankow-01",
    description: "Buch, Karow und Französisch Buchholz",
  },
  {
    constituency: "Pankow-02",
    description:
      "Blankenfelde, Rosenthal, Wilhelmsruh sowie Niederschönhausen nördlich der Linie Hessestraße-Dietzgenstraße-Beuthstraße-Buchholzer Str.-Schönhauer Str.",
  },
  {
    constituency: "Pankow-03",
    description:
      "Niederschönhausen südlich der Linie Hessestraße-Dietzgenstraße-Beuthstraße-Buchholzer Str.-Schönhauer Str. und Pankow nördlich der Stettiner Bahn",
  },
  {
    constituency: "Pankow-04",
    description:
      "Weißensee nördlich der Pistoriusstraße, Stadtrandsiedlung Malchow und Blankenburg",
  },
  {
    constituency: "Pankow-05",
    description: "Pankow südlich der Stettiner Bahn und Heinersdorf",
  },
  {
    constituency: "Pankow-06",
    description:
      "Prenzlauer Berg nördlich der Eberswalder Straße bis zum Ortsteil Pankow und auf der anderen Seite der Schönhauser Allee zusätzlich das Gebiet bis zur Prenzlauer Allee zwischen Danziger Straße und Ringbahn",
  },
  {
    constituency: "Pankow-07",
    description:
      "Prenzlauer Berg nördlich der Ringbahn zwischen Schönhauser Allee und Greifswalder Straße sowie Weißensee südlich der Pistoriusstraße",
  },
  {
    constituency: "Pankow-08",
    description:
      "Prenzlauer Berg westlich der Greifswalder Straße, aber nur südlich der Eberswalder/Danziger Straße, östlich der Prenzlauer Allee auch nördlich der Danziger Straße bis zur Ringbahn",
  },
  {
    constituency: "Pankow-09",
    description:
      "Prenzlauer Berg östlich der Greifswalder Straße und Weißensee östlich der Berliner Allee bis zur Indira-Gandhi-Straße",
  },
  {
    constituency: "Charlottenburg-Wilmersdorf-01",
    description:
      "Charlottenburg-Nord sowie von Charlottenburg die Gebiete Kalowswerder mit dem Mierendorffplatz und Alt-Lietzow nordöstlich der Otto-Suhr-Allee",
  },
  {
    constituency: "Charlottenburg-Wilmersdorf-02",
    description:
      "Westend sowie von Charlottenburg das Gebiet um den Klausenerplatz und das Schloss Charlottenburg",
  },
  {
    constituency: "Charlottenburg-Wilmersdorf-03",
    description:
      "Von Charlottenburg die Gebiete beiderseits der Schloßstraße sowie rund um den Lietzensee, den Stuttgarter Platz und den Adenauerplatz",
  },
  {
    constituency: "Charlottenburg-Wilmersdorf-04",
    description:
      "Von Charlottenburg die Gebiete beiderseits der Bismarckstraße, der Kantstraße und des Kurfürstendamms sowie von Wilmersdorf die Umgebung des Olivaer Platzes",
  },
  {
    constituency: "Charlottenburg-Wilmersdorf-05",
    description:
      "Halensee, Grunewald, Schmargendorf (westl. Teil) sowie Wilmersdorf (westl. Teil)",
  },
  {
    constituency: "Charlottenburg-Wilmersdorf-06",
    description:
      "Wilmersdorf (östl. Teil) mit Ludwigkirchplatz, Prager Platz, Bundesplatz und Volkspark",
  },
  {
    constituency: "Charlottenburg-Wilmersdorf-07",
    description:
      "Schmargendorf (östl. Teil) und Wilmersdorf (südl. Teil) mit dem Rheingauviertel122",
  },
  {
    constituency: "Spandau-01",
    description:
      "Hakenfelde, Falkenhagener Feld (nördl.Teil) und der Ortsteil Spandau (nördl. Teil)",
  },
  {
    constituency: "Spandau-02",
    description:
      "Ortsteil Spandau (südl. Teil) und Falkenhagener Feld (südöstl. Teil)",
  },
  {
    constituency: "Spandau-03",
    description: "Wilhelmstadt (nördl. Teil), Haselhorst und Siemensstadt",
  },
  {
    constituency: "Spandau-04",
    description: "Staaken und Falkenhagener Feld (südwestl. Teil)",
  },
  {
    constituency: "Spandau-05",
    description: "Wilhelmstadt (südl. Teil) mit Pichelsdorf, Gatow und Kladow",
  },
  {
    constituency: "Steglitz-Zehlendorf-01",
    description:
      "Steglitz (nordwestl. Teil) mit Breitenbachplatz, Schloßstraße und Asternplatz",
  },
  {
    constituency: "Steglitz-Zehlendorf-02",
    description:
      "Steglitz (südöstl. Teil) mit Albrechtstraße, Steglitzer Damm und Südende",
  },
  {
    constituency: "Steglitz-Zehlendorf-03",
    description:
      "Lichterfelde (westl. Teil) und Berlin-Zehlendorf (südl. Teil)",
  },
  {
    constituency: "Steglitz-Zehlendorf-04",
    description: "Lichterfelde (südl. Teil)",
  },
  {
    constituency: "Steglitz-Zehlendorf-05",
    description: "Lankwitz und Lichterfelde (nordöstl. Teil)",
  },
  {
    constituency: "Steglitz-Zehlendorf-06",
    description: "Dahlem und Berlin-Zehlendorf (nördl. Teil)",
  },
  {
    constituency: "Steglitz-Zehlendorf-07",
    description: "Wannsee, Nikolassee und Zehlendorf (westl. Teil)",
  },
  {
    constituency: "Tempelhof-Schoeneberg-01",
    description:
      "Schöneberg nördlich der Grunewaldstraße und der Großgörschenstraße (Wittenbergplatz, Viktoria-Luise-Platz, Nollendorfplatz, Barbarossaplatz, Dennewitzplatz und Gebiet nördlich des Bayerischen Platzes) sowie zusätzlich das Gebiet um die Akazienstraße",
  },
  {
    constituency: "Tempelhof-Schoeneberg-02",
    description:
      "Schöneberg südlich der Grunewaldstraße und der Großgörschenstraße sowie nordöstlich der Linie Rubensstraße-Vorarlberger Damm (mit Rathaus Schöneberg, damaliger Kaiser-Wilhelm-Platz, Schöneberger Insel) und der Teil von Tempelhof westlich der Linie Werner-Voß-Damm-Gontermannstraße-Wüsthoffstraße-Boelckestraße",
  },
  {
    constituency: "Tempelhof-Schoeneberg-03",
    description:
      "Friedenau sowie Schöneberg südlich der Linie Rubensstraße-Vorarlberger Damm (mit der Siedlung Lindenhof) und der Teil von Tempelhof westlich der Paul-Schmidt-Straße und der Chlodwigstraße (mit der Marienhöhe)",
  },
  {
    constituency: "Tempelhof-Schoeneberg-04",
    description:
      "Tempelhof nördlich des Teltowkanals ohne die zu den Wahlkreisen 2, 3 und 5 gehörenden Teile",
  },
  {
    constituency: "Tempelhof-Schoeneberg-05",
    description:
      "Mariendorf ohne den Teil südlich der Linie Siemensstraße-Kruckenbergstraße-Körtingstraße-Pilatusweg-Klausenpaß sowie von Tempelhof das Gebiet südlich des Teltowkanals und die Siedlung an der Oberlandstraße östlich der Neukölln-Mittenwalder Eisenbahn",
  },
  {
    constituency: "Tempelhof-Schoeneberg-06",
    description:
      "Marienfelde, zusätzlich der Teil Lichtenrades nördlich der Linie Simpsonweg-Geibelstraße-Goethestraße-Halker Zeile-Buckower Chaussee und der südliche Teil Mariendorfs, der nicht zum Wahlkreis 5 gehört",
  },
  {
    constituency: "Tempelhof-Schoeneberg-07",
    description:
      "Lichtenrade ohne den Teil nördlich der Linie Simpsonweg-Geibelstraße-Goethestraße-Halker Zeile-Buckower Chaussee",
  },
  {
    constituency: "Neukoelln-01",
    description:
      "Ortsteil Neukölln östlich der Linie Karl-Marx-Straße/Weichselstraße/Donaustraße bis zur Treptower Straße und entlang der Sonnenallee innerhalb der Ringbahn",
  },
  {
    constituency: "Neukoelln-02",
    description:
      "Ortsteil Neukölln westlich der Karl-Marx-Straße und nördlich der Ringbahn sowie östlich der Karl-Marx-Straße entlang der Linie Weichselstraße/Donaustraße/Wanzlikpfad/Kirchgasse/Richardstraße/Karl-Marx-Platz",
  },
  {
    constituency: "Neukoelln-03",
    description:
      "Ortsteil Neukölln außerhalb der Ringbahn sowie des Richardplatzes, außerdem ein Gebiet von Britz nördlich der Linie Tempelhofer Weg/Gradestraße/Blaschkoallee/Späthstraße/Neue Späthstraße bis zur Neuen Späthbrücke",
  },
  {
    constituency: "Neukoelln-04",
    description:
      "Britz südlich der Späthstraße und Neue Späthstraße, östlich der Linie Buschkrugallee/Parchimer Allee/Fritz-Reuter-Allee/Gutschmidtstraße/Severingstraße entlang des Kölner Damms bis zur Bezirksgrenze und nördlich der Linie Friedrich-Kaysler-Weg/Horst-Caspar-Steig/Agnes-Straub-Weg/Neuköllner-Straße/Flurweg/Minzeweg/Silberdistelweg",
  },
  {
    constituency: "Neukoelln-05",
    description:
      "Britz südwestlich der Linie Tempelhofer Weg/Buschkrugallee sowie Buckow westlich des Kölner Damms",
  },
  {
    constituency: "Neukoelln-06",
    description:
      "Gropiusstadt und Buckow nördlich des Horst-Caspar-Steig sowie Rudow südöstlich der Linie Flurweg/Silberdistelweg",
  },
  {
    constituency: "Treptow-Koepenick-01",
    description: "Alt-Treptow, Plänterwald und Baumschulenweg",
  },
  {
    constituency: "Treptow-Koepenick-02",
    description: "Oberschöneweide, Niederschöneweide und Johannisthal",
  },
  {
    constituency: "Treptow-Koepenick-03",
    description: "Adlershof und Altglienicke",
  },
  {
    constituency: "Treptow-Koepenick-04",
    description: "Köpenick (westl. Teil), Bohnsdorf, Grünau und Schmöckwitz",
  },
  {
    constituency: "Treptow-Koepenick-05",
    description:
      "Köpenick (östl. Teil) mit Allende-Viertel und Wendenschloss sowie Müggelheim",
  },
  {
    constituency: "Treptow-Koepenick-06",
    description: "Köpenick (nördl. Teil), Friedrichshagen und Rahnsdorf",
  },
  {
    constituency: "Marzahn-Hellersdorf-01",
    description: "Marzahn (nördl. Teil) mit Ahrensfelde",
  },
  {
    constituency: "Marzahn-Hellersdorf-02",
    description: "Marzahn (mittl. Teil)",
  },
  {
    constituency: "Marzahn-Hellersdorf-03",
    description: "Hellersdorf (nördl. Teil)",
  },
  {
    constituency: "Marzahn-Hellersdorf-04",
    description: "Marzahn (südl. Teil) und Biesdorf",
  },
  {
    constituency: "Marzahn-Hellersdorf-05",
    description: "Kaulsdorf (südl. Teil) und Mahlsdorf",
  },
  {
    constituency: "Marzahn-Hellersdorf-06",
    description: "Kaulsdorf (nördl. Teil) und Hellersdorf (südl. Teil)",
  },
  {
    constituency: "Lichtenberg-01",
    description:
      "Neu-Hohenschönhausen (nordöstl. Teil), Wartenberg und Falkenberg",
  },
  {
    constituency: "Lichtenberg-02",
    description:
      "Neu-Hohenschönhausen (südwestl. Teil), Alt-Hohenschönhausen (nördl. Teil) und Malchow",
  },
  {
    constituency: "Lichtenberg-03",
    description:
      "Alt-Hohenschönhausen (südl. Teil), Ortsteil Lichtenberg (östl. Teil) und Fennpfuhl",
  },
  {
    constituency: "Lichtenberg-04",
    description: "Ortsteil Lichtenberg (westl. Teil)",
  },
  {
    constituency: "Lichtenberg-05",
    description: "Friedrichsfelde (nördl. Teil) und Rummelsburg (nördl. Teil)",
  },
  {
    constituency: "Lichtenberg-06",
    description:
      "Karlshorst, Friedrichsfelde (südl. Teil) und Rummelsburg (südl. Teil)",
  },
  {
    constituency: "Reinickendorf-01",
    description: "Ortsteil Reinickendorf (östl. Teil)",
  },
  {
    constituency: "Reinickendorf-02",
    description: "Ortsteil Reinickendorf (westl. Teil) und Tegel (südl. Teil)",
  },
  {
    constituency: "Reinickendorf-03",
    description: "Heiligensee, Konradshöhe und Tegel (nördl. Teil)",
  },
  {
    constituency: "Reinickendorf-04",
    description:
      "Wittenau mit Borsigwalde, Waidmannslust und Tegel (östl. Teil)",
  },
  {
    constituency: "Reinickendorf-05",
    description: "Märkisches Viertel und Lübars",
  },
  {
    constituency: "Reinickendorf-06",
    description: "Frohnau, Hermsdorf und von Tegel die Siedlung Freie Scholle",
  },
];

export default STATE_CONSTITUENCIES_WITH_DESCRIPTIONS;
