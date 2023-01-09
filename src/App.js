import "./App.css";

import { read, utils } from "xlsx";
import { Layout, Select, Radio, Tabs, Button } from "antd";
import {
  chunk,
  cloneDeep,
  countBy,
  groupBy,
  isNumber,
  map,
  maxBy,
  meanBy,
  omit,
  sum,
  sumBy,
  uniq,
} from "lodash";
import { useState } from "react";
import styled from "styled-components";

import raw from "raw.macro";
import MetaTable from "./MetaTable";
import MapView from "./MapView";
import ResultsTable from "./ResultsTable";
import SeatCircles from "./SeatCircles";

// const jsonData = JSON.parse(raw("./bundestagswahlkreiskalkulator.json"));

const constituencyAssignments = JSON.parse(raw("./btw-kreise.json"));

const DEFAULT_TITLE = "Wahlausgang 2021";

export const ELIGIBLE_VOTERS = "Wahlberechtigte";
export const CONSTITUENCY = "Wahlkreis";
export const DEVIATION = "Abweichung";
export const INEFFICIENT_MAJOR_PARTY_VOTES = "Ineffizient verteilte Stimmen";
const GAP_BETWEEN_FIRST_AND_SECOND = "Abstand Platz 1 zu 2";

// todo: move to importable JSON
const jsonData = chunk(
  [
    {
      [DEFAULT_TITLE]: DEFAULT_TITLE,
      Erststimmen: "Erststimmen",
      "Gewonnene Direktmandate": "Gewonnene Direktmandate",
    },
    ...utils.sheet_to_json(
      read(raw("./btw-analyse.csv"), { type: "string" }).Sheets.Sheet1
    ),
  ],
  16
).map((group) => {
  const metaLine = cloneDeep(group[1]);
  return group
    .slice(1, 14)
    .map(
      (constituency, index) =>
        index === 0
          ? { title: group[0][DEFAULT_TITLE] }
          : map(constituency, (value, key) => ({
              [metaLine[key]]: value,
            })).reduce((acc, currentPair) => {
              const [key, value] = Object.entries(currentPair)[0];
              return value === 0 || value === 1 || key === "Meiste Stimmen"
                ? { ...acc }
                : {
                    ...acc,
                    [key]:
                      key === CONSTITUENCY || key === DEVIATION
                        ? value
                        : Math.round(value * 1000),
                  };
            }, {}),
      {}
    )
    .map((cleanedDistrict) => {
      const sortedVotes = Object.values(
        omit(cleanedDistrict, [ELIGIBLE_VOTERS, CONSTITUENCY, DEVIATION])
      );
      if (!sortedVotes.length || !isNumber(sortedVotes[0])) {
        return cleanedDistrict;
      }
      sortedVotes.sort((a, b) => b - a);
      return {
        ...cleanedDistrict,
        [GAP_BETWEEN_FIRST_AND_SECOND]: sortedVotes[0] - sortedVotes[1],
        [INEFFICIENT_MAJOR_PARTY_VOTES]:
          sum(sortedVotes) - sortedVotes[0] - (sortedVotes[0] - sortedVotes[1]),
      };
    });
});

const constituenciesByDistrict = groupBy(
  constituencyAssignments,
  (constituency) => constituency.districtName.split("-0")[0]
);

const metaData = jsonData.reduce(
  (acc, version) => {
    const justTheConstituencies = version.filter(
      (row) => row[DEVIATION] && row[DEVIATION] !== -10
    );

    if (version[0].title === "Variante 2 der Landeswahlleitung") {
      acc.splitDistricts = [
        ...acc.splitDistricts,
        {
          // hard-coded sad emoji
          version: "Variante 2 der Landeswahlleitung",
          1: 8,
          2: 3,
          3: 1,
        },
      ];
    } else {
      const districtSplits = Object.entries(constituenciesByDistrict).map(
        ([districtName, stateConstituencies]) => ({
          districtName,
          splits: uniq(map(stateConstituencies, version[0].title)).length,
        })
      );

      acc.splitDistricts = [
        ...acc.splitDistricts,
        {
          version: version[0].title,
          ...countBy(districtSplits, (district) => district.splits),
        },
      ];
    }

    acc.deviationConstituencies = [
      ...acc.deviationConstituencies,
      ...justTheConstituencies.map((row) => ({
        deviation: row[DEVIATION],
        version: version[0].title,
        constituency: row[CONSTITUENCY],
      })),
    ];

    acc.meanDeviations.push({
      meanDeviation: meanBy(justTheConstituencies, (row) =>
        Math.abs(row[DEVIATION])
      ),
      version: version[0].title,
    });

    acc.gapVotesConstituencies = [
      ...acc.gapVotesConstituencies,
      ...justTheConstituencies.map((row) => ({
        gapVotes: row[GAP_BETWEEN_FIRST_AND_SECOND],
        version: version[0].title,
        constituency: row[CONSTITUENCY],
      })),
    ];

    acc.inefficientVotesSums.push({
      inefficientVotesSum: sumBy(
        justTheConstituencies,
        INEFFICIENT_MAJOR_PARTY_VOTES
      ),
      version: version[0].title,
    });

    return acc;
  },
  {
    splitDistricts: [],
    meanDeviations: [],
    deviationConstituencies: [],
    inefficientVotesSums: [],
    gapVotesConstituencies: [],
  }
);

const { Header, Content, Footer } = Layout;
const { Group: RadioGroup, Button: RadioButton } = Radio;

export const FullWidthElement = styled.div`
  width: 100%;
`;

const StyledContent = styled(Content)`
  display: flex;
  max-width: 1200px;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
`;

const StyledRadioGroup = styled(RadioGroup)`
  margin-bottom: 1rem;
  @media (max-width: 1023px) {
    display: none;
  }
`;

const StyledRadioButton = styled(RadioButton)`
  display: inline-flex;
  align-items: center;
  color: #333333;
  height: 80px !important;
  padding-left: 12px;
  padding-right: 12px;
  font-size: 0.8rem !important;
  width: 140px;
  line-height: 1.4 !important;
`;

const StyledSelect = styled(Select)`
  @media (min-width: 1024px) {
    display: none;
  }
  min-width: 320px;
`;

export const ConstituencyCircle = styled.div`
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.5rem;
  width: 30px;
  height: 30px;
  background-color: ${({ backgroundColor, isLostSeat }) =>
    isLostSeat ? "white" : backgroundColor};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ isNewSeat, isLostSeat }) =>
    isNewSeat || isLostSeat ? "black" : "transparent"};
`;

const titles = jsonData.map((version) => version[0].title);

const variantGroups = [
  {
    label: "Bestehende Wahlkreise",
    options: [...titles.slice(0, 1)].map((title) => {
      return { label: title, value: title };
    }),
  },
  {
    label: "Vorschläge der Landeswahlleitung",
    options: [...titles.slice(1, 3)].map((title) => {
      return { label: title, value: title };
    }),
  },
  {
    label: "Eigene Vorschläge",
    options: [...titles.slice(3, 7)].map((title) => ({
      label: title,
      value: title,
    })),
  },
];

const getSeats = (tableData) =>
  tableData.slice(1).reduce((acc, row) => {
    const winningParty = maxBy(
      Object.entries(
        omit(row, [
          ELIGIBLE_VOTERS,
          INEFFICIENT_MAJOR_PARTY_VOTES,
          CONSTITUENCY,
          DEVIATION,
        ])
      ),
      (entryPair) => entryPair[1]
    );
    return winningParty
      ? {
          ...acc,
          [winningParty[0]]: acc[winningParty[0]]
            ? acc[winningParty[0]] + 1
            : 1,
        }
      : acc;
  }, {});

export const partyColor = {
  SPD: "#cc0000",
  GRUENE: "#01cc00",
  CDU: "#0033ff",
  "DIE LINKE": "#9b00cc",
};

const allTheSeats = jsonData.map((version) => ({
  version: version[0].title,
  seats: getSeats(version),
}));

const originalSeats = allTheSeats[0].seats;

export const partiesWithDirectSeats = Object.keys(originalSeats);

function App() {
  const [activeVersion, setActiveVersion] = useState(titles[0]);
  const [buildModeActive, setBuildModeActive] = useState(false);

  const dataForThisVersion = jsonData.find(
    (version) => version[0].title === activeVersion
  );

  const projectedSeats = allTheSeats.find(
    (group) => group.version === activeVersion
  ).seats;

  return (
    <div className="App">
      <Header>
        <h1 style={{ color: "#22223B" }}>Der Atlas der Berliner Wahlkreise</h1>
      </Header>
      <StyledContent>
        <FullWidthElement>
          <p>
            Im Rahmen des{" "}
            <a href="https://www.bundestag.de/dokumente/textarchiv/2022/kw45-pa-kommission-wahlrecht-wahlrechtsreform-918172">
              Neuzuschnitts der Wahlkreise für künftige Bundestagswahlen
            </a>{" "}
            verliert Berlin einen seiner zwölf Wahlkreise, die bisher
            weitgestehend den Stadtbezirken entsprachen. Die Berliner
            Landeswahlleitung hat für diese Neuordnung zwei Vorschläge
            vorgelegt. Diese Seite stellt diese Varianten und ihre Auswirkungen
            auf die direkt gewählten Sitze (Erststimme) im Vergleich mit der
            bestehenden Zusammensetzung sowie vorgeschlagenen Alternativen vor.
          </p>
        </FullWidthElement>
        <FullWidthElement>
          <Button
            style={{ display: "none" }}
            onClick={() => setBuildModeActive(true)}
          >
            Eigene Variante bauen
          </Button>
        </FullWidthElement>
        {!buildModeActive && (
          <>
            <FullWidthElement
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
              {variantGroups.map((group) => (
                <StyledRadioGroup
                  size="large"
                  key={group.label}
                  onChange={(e) => setActiveVersion(e.target.value)}
                  value={
                    group.options.find(
                      (option) => option.value === activeVersion
                    )
                      ? activeVersion
                      : undefined
                  }
                >
                  {group.options.map((option) => (
                    <StyledRadioButton key={option.value} value={option.value}>
                      {option.label}
                    </StyledRadioButton>
                  ))}
                </StyledRadioGroup>
              ))}
              <StyledSelect
                value={activeVersion}
                id="select-active-version"
                onChange={(newValue) => setActiveVersion(newValue)}
                options={variantGroups}
              />
            </FullWidthElement>

            <FullWidthElement>
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    label: `Wahlkreiszuschnitte`,
                    key: "1",
                    children: (
                      <MapView
                        activeVersion={activeVersion}
                        constituencyAssignments={constituencyAssignments}
                        dataForThisVersion={dataForThisVersion}
                        showResults={false}
                      />
                    ),
                  },
                  {
                    label: `Erststimmenverteilung`,
                    key: "2",
                    children: (
                      <MapView
                        activeVersion={activeVersion}
                        constituencyAssignments={constituencyAssignments}
                        dataForThisVersion={dataForThisVersion}
                        showResults={true}
                      />
                    ),
                  },
                  {
                    label: `Tabelle`,
                    key: "3",
                    children: (
                      <ResultsTable dataForThisVersion={dataForThisVersion} />
                    ),
                  },
                ]}
              />
            </FullWidthElement>
          </>
        )}
        <SeatCircles
          projectedSeats={projectedSeats}
          originalSeats={originalSeats}
        />
        <MetaTable seats={allTheSeats} metaData={metaData} />
      </StyledContent>
      <Footer>
        <p>
          Rohdaten und Varianten-Vorschläge: Dr. Nicolas Scharioth.
          Programmierung: Christian Burtchen.
        </p>
      </Footer>
    </div>
  );
}

export default App;
