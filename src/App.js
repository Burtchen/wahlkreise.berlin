import "./App.css";

import { Layout, Select, Radio, Tabs, Button, Row, Col } from "antd";
import {
  cloneDeep,
  countBy,
  flatten,
  groupBy,
  map,
  maxBy,
  meanBy,
  omit,
  sumBy,
  times,
  uniq,
} from "lodash";
import { useEffect, useState } from "react";
import styled from "styled-components";

import raw from "raw.macro";
import MetaTable from "./MetaTable";
import MapView from "./MapView";
import ResultsTable from "./ResultsTable";
import SeatCircles from "./SeatCircles";
import Footer from "./components/Footer";

const jsonData = JSON.parse(raw("./data/btw-varianten.json"));

const constituencyAssignments = JSON.parse(raw("./data/btw-kreise.json"));

export const ELIGIBLE_VOTERS = "Wahlberechtigte";
export const CONSTITUENCY = "Wahlkreis";
export const DEVIATION = "Abweichung";
export const INEFFICIENT_MAJOR_PARTY_VOTES = "Ineffizient verteilte Stimmen";
const GAP_BETWEEN_FIRST_AND_SECOND = "Abstand Platz 1 zu 2";

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

const { Header, Content } = Layout;
const { Group: RadioGroup, Button: RadioButton } = Radio;

export const FullWidthElement = styled.div`
  width: 100%;
`;

export const StyledContent = styled(Content)`
  display: flex;
  max-width: 1200px;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
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

const ConstituencySelect = styled(Select)`
  width: 80px;
  .ant-select-selector {
    padding: 0 5px !important;
    inset-inline-start: 0 !important;
  }
  .ant-select-dropdown .ant-select-item {
    padding: 5px;
  }
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

const orderedConstituencyList = flatten(
  Object.values(constituenciesByDistrict)
);

const districtDataForState = orderedConstituencyList.map((constituency) => ({
  name: constituency.districtName,
  constituency: constituency["Variante 1 der Landeswahlleitung"],
}));

const getCodeFromCustomSelection = (customData) =>
  customData
    .map((setConstituency) => (setConstituency.constituency - 73).toString(16)) // 0 = not set
    .join("");

const convertCodeToElectionData = (code) => {
  const mappedConstituencies = groupBy(
    code.split("").map((letter, index) => ({
      districtName: orderedConstituencyList[index].districtName,
      constituencyNumber: parseInt(letter, 16) + 73,
    })),
    "constituencyNumber"
  );
  console.log(mappedConstituencies);
  return code;
};

function App() {
  const [activeVersion, setActiveVersion] = useState(titles[0]);
  const [buildModeActive, setBuildModeActive] = useState(false);
  const [customSelection, setCustomSelection] = useState([
    ...orderedConstituencyList.map((constituency) => ({
      constituency: 73, // = 0
      name: constituency.districtName,
    })),
  ]);

  useEffect(() => {
    if (buildModeActive && customSelection.length > 0) {
      setActiveVersion(getCodeFromCustomSelection(customSelection));
    }
  }, [customSelection, buildModeActive]);

  const dataForThisVersion = activeVersion.match(/^[A-Fa-f0-9]+$/)
    ? convertCodeToElectionData(activeVersion)
    : jsonData.find((version) => version[0].title === activeVersion);

  const projectedSeats = allTheSeats.find(
    (group) => group.version === activeVersion
  )?.seats;

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
            onClick={() => {
              setBuildModeActive(true);
            }}
          >
            Eigene Variante bauen
          </Button>
        </FullWidthElement>
        {buildModeActive && (
          <div>
            <Button onClick={() => setCustomSelection(districtDataForState)}>
              Mit Variante 1 vorbelegen
            </Button>
            <Row>
              {Object.entries(constituenciesByDistrict).map(
                ([district, constituencies]) => (
                  <Col span={4} key={district}>
                    <h3>{district}</h3>
                    <ul style={{ listStyleType: "none" }}>
                      {constituencies.map((constituency) => {
                        const matchingCustomConstituency = customSelection.find(
                          (setConstituency) =>
                            setConstituency.name === constituency.districtName
                        );
                        let value;
                        if (
                          matchingCustomConstituency &&
                          matchingCustomConstituency.constituency !== 73
                        ) {
                          value = matchingCustomConstituency.constituency;
                        } else {
                          value = undefined;
                        }
                        return (
                          <li key={constituency.districtName}>
                            {constituency.districtName.split("-0")[1]}
                            <ConstituencySelect
                              value={value}
                              onChange={(newConstituency) => {
                                const existingIndex = customSelection.findIndex(
                                  (setConstituency) =>
                                    setConstituency.name ===
                                    constituency.districtName
                                );

                                const clonedSelection =
                                  cloneDeep(customSelection);
                                clonedSelection[existingIndex] = {
                                  name: constituency.districtName,
                                  constituency: newConstituency,
                                };
                                setCustomSelection([...clonedSelection]);
                              }}
                              options={times(12, (index) => ({
                                label: `WK ${index + 74}`,
                                value: index + 74,
                              }))}
                            />{" "}
                          </li>
                        );
                      })}
                    </ul>
                  </Col>
                )
              )}
            </Row>
          </div>
        )}
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
        {projectedSeats && (
          <SeatCircles
            projectedSeats={projectedSeats}
            originalSeats={originalSeats}
          />
        )}
        <MetaTable seats={allTheSeats} metaData={metaData} />
      </StyledContent>
      <Footer />
    </div>
  );
}

export default App;
