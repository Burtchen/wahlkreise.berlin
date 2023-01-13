import "./App.css";

import { Layout, Select, Radio, Tabs, Button, Row, Col, Alert } from "antd";
import {
  cloneDeep,
  countBy,
  flatten,
  groupBy,
  isNumber,
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
import Header from "./components/Header";

const predefinedData = JSON.parse(raw("./data/btw-varianten.json"));
const constituencyAssignments = JSON.parse(raw("./data/btw-kreise.json"));
const stateLevelConstituencies = JSON.parse(raw("./data/agh-kreise.json"));

export const ELIGIBLE_VOTERS = "Wahlberechtigte";
export const CONSTITUENCY = "Wahlkreis";
export const DEVIATION = "Abweichung";
export const INEFFICIENT_MAJOR_PARTY_VOTES = "Ineffizient verteilte Stimmen";
const GAP_BETWEEN_FIRST_AND_SECOND = "Abstand Platz 1 zu 2";

const constituenciesByDistrict = groupBy(
  constituencyAssignments,
  (constituency) => constituency.districtName.split("-0")[0]
);

const metaData = predefinedData.reduce(
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

const { Content } = Layout;
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
  vertical-align: top;
  align-items: center;
  color: #333333;
  height: 80px !important;
  padding-left: 12px;
  padding-right: 12px;
  font-size: 0.8rem !important;
  width: 128px;
  text-align: center;
  align-content: center;
  justify-content: center;
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

const ConstituencyCol = styled(Col)`
  .ant-select-selector {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
`;

const ConstituencyName = styled.h3`
  font-size: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ConstituencyPrefix = styled.span`
  background: #fafafa;
  width: 18px;
  height: 32px;
  display: inline-block;
  position: relative;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-right: none;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
  padding-left: 6px;
  padding-top: 8px;
  box-sizing: border-box;
  font-weight: 400;
  line-height: 1;
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

const titles = predefinedData.map((version) => version[0].title);

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
    options: [
      ...[...titles.slice(3, 7)].map((title) => ({
        label: title.replace("Variante", ""),
        value: title,
      })),
      { label: "Eigene Variante bauen!", value: null },
    ],
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

const allTheSeats = predefinedData.map((version) => ({
  version: version[0].title,
  seats: getSeats(version),
}));

const originalSeats = allTheSeats[0].seats;

export const partiesWithDirectSeats = Object.keys(originalSeats);
const PARTIES_INCLUDING_OTHERS = [
  ...partiesWithDirectSeats,
  "AfD",
  "FDP",
  "Sonstige",
];

const orderedConstituencyList = flatten(
  Object.values(constituenciesByDistrict)
);

const districtDataForState = orderedConstituencyList.map((constituency) => ({
  name: constituency.districtName,
  constituency: constituency["Variante 1 der Landeswahlleitung"],
}));

const getCodeFromCustomSelection = (customData) =>
  customData
    .map((setConstituency) => (setConstituency.constituency - 74).toString(16)) // 0 = not set
    .join("");

export const isCustomVersion = (version) => version.match(/^[A-Fa-f0-9]+$/);

const TOTAL_ELIGIBLE_VOTES = 2468919;

const mapConstituencyAssignments = (code) =>
  groupBy(
    code.split("").map((letter, index) => {
      const districtName = orderedConstituencyList[index].districtName;
      const matchingStateLevelConstituency = stateLevelConstituencies.find(
        (constituency) => constituency["AGH-Wahlkreis"] === districtName
      );
      return {
        districtName,
        constituencyNumber: parseInt(letter, 16) + 74,
        ...[...PARTIES_INCLUDING_OTHERS, ELIGIBLE_VOTERS].reduce(
          (acc, key) => ({
            ...acc,
            [key]: letter !== "0" ? matchingStateLevelConstituency[key] : 0,
          }),
          {}
        ),
      };
    }),
    "constituencyNumber"
  );

// todo: fix format instead of all the hoops for table and map view
const convertCodeToElectionData = (code) => [
  {
    title: code,
    ...map(
      mapConstituencyAssignments(code),
      (groupOfStateLevelConstituencies, constituencyKey) => {
        return [
          CONSTITUENCY,
          ELIGIBLE_VOTERS,
          DEVIATION,
          ...PARTIES_INCLUDING_OTHERS,
        ].reduce(
          (acc, key) => ({
            ...acc,
            [key]:
              key === CONSTITUENCY
                ? constituencyKey
                : key === DEVIATION
                ? sumBy(groupOfStateLevelConstituencies, ELIGIBLE_VOTERS) /
                    (TOTAL_ELIGIBLE_VOTES / 11) -
                  1
                : sumBy(groupOfStateLevelConstituencies, key),
          }),
          {}
        );
      }
    ),
  },
];

const districtList = [
  "Mitte",
  "Friedrichshain-Kreuzberg",
  "Pankow",
  "Charlottenburg-Wilmersdorf",
  "Spandau",
  "Steglitz-Zehlendorf",
  "Tempelhof-Schoeneberg",
  "Neukoelln",
  "Treptow-Koepenick",
  "Marzahn-Hellersdorf",
  "Lichtenberg",
  "Reinickendorf",
];

function App() {
  const [activeVersion, setActiveVersion] = useState(titles[0]);
  const [visibleDistricts, setVisibleDistricts] = useState([]);
  const [buildModeActive, setBuildModeActive] = useState(false);
  const [customSelection, setCustomSelection] = useState(
    districtDataForState // always prepopuluate version 1
  );

  useEffect(() => {
    if (buildModeActive && customSelection.length > 0) {
      setActiveVersion(getCodeFromCustomSelection(customSelection));
    }
  }, [customSelection, buildModeActive]);

  const dataForThisVersion = isCustomVersion(activeVersion)
    ? convertCodeToElectionData(activeVersion)
    : predefinedData.find((version) => version[0].title === activeVersion);

  const projectedSeats = allTheSeats.find(
    (group) => group.version === activeVersion
  )?.seats;

  return (
    <div className="App">
      <Header />
      <StyledContent>
        <FullWidthElement>
          <p>
            Im Rahmen des{" "}
            <a href="https://www.bundestag.de/dokumente/textarchiv/2022/kw45-pa-kommission-wahlrecht-wahlrechtsreform-918172">
              Neuzuschnitts der Wahlkreise für künftige Bundestagswahlen
            </a>{" "}
            verliert Berlin einen seiner zwölf Wahlkreise. Bisher hatte Berlin
            zwölf Wahlkreise - und zwölf Stadtbezirke, die auch fast genau
            aufeinander passten.
          </p>
          <p>
            Die Berliner Landeswahlleitung hat für die Neuordnung zwei
            Vorschläge vorgelegt. Diese Seite stellt diese Varianten und ihre
            Auswirkungen auf die direkt gewählten Sitze (Erststimme) im
            Vergleich mit der bestehenden Zusammensetzung sowie vorgeschlagenen
            Alternativen vor.
          </p>
        </FullWidthElement>
        {buildModeActive && (
          <FullWidthElement style={{ marginBottom: "2rem" }}>
            <h3>SimLandeswahlleitung: Eigene Version bauen!</h3>
            <Row>
              <Col span={24}>
                <Select
                  style={{ minWidth: "200px", marginBottom: "0.75rem" }}
                  value={visibleDistricts}
                  mode="multiple"
                  id="district-selector"
                  placeholder="Bezirk(e) auswählen"
                  options={districtList.map((district) => ({
                    value: district,
                    label: district,
                  }))}
                  onChange={setVisibleDistricts}
                />
              </Col>
              <Col span={24}>
                {visibleDistricts.length < 1 ? (
                  <label
                    htmlFor="district-selector"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Im Feld die Namen der Bezirke eingeben, deren Wahlkreise Sie
                    anpassen möchten, oder{" "}
                    <Button onClick={() => setVisibleDistricts(districtList)}>
                      alle Bezirke auswählen
                    </Button>
                    .
                  </label>
                ) : (
                  <p style={{ fontSize: "0.8rem" }}>
                    Die Zahl vor dem Dropdown entspricht dem
                    Abgeordnetenhauswahlkreis des Bezirks. Der Wert des
                    Dropdowns dem Bundestagswahlkreis, den Sie verändern können.
                  </p>
                )}
              </Col>
            </Row>
            {map(dataForThisVersion[0], DEVIATION).filter(
              (deviationForConstituency) =>
                isNumber(deviationForConstituency) &&
                Math.abs(deviationForConstituency) > 0.15
            ).length > 0 && (
              <Alert
                message="Die Größe mindestens eines Wahlkreises weicht um mehr als 15% vom Mittelwert ab."
                type="warning"
                style={{ marginBottom: "1rem" }}
              />
            )}
            {Object.keys(omit(dataForThisVersion[0], "title")).length > 11 && (
              <Alert
                message="Sie haben mehr als 11 Bundestagswahlkreise ausgewählt - die Reduktion auf 11 ist aber genau das Anliegen der Reform."
                type="warning"
                style={{ marginBottom: "1rem" }}
              />
            )}
            {Object.entries(constituenciesByDistrict)
              .filter(([district]) => visibleDistricts.includes(district))
              .map(([district, constituencies]) => (
                <Row key={district}>
                  <Col span={4}>
                    <ConstituencyName>
                      {district.replace("burg", "b'g")}
                    </ConstituencyName>
                  </Col>
                  {constituencies.map((constituency, index) => {
                    const matchingCustomConstituency = customSelection.find(
                      (setConstituency) =>
                        setConstituency.name === constituency.districtName
                    );
                    return (
                      <ConstituencyCol span={2} key={constituency.districtName}>
                        <ConstituencyPrefix>
                          {constituency.districtName.split("-0")[1]}
                        </ConstituencyPrefix>
                        <ConstituencySelect
                          value={
                            matchingCustomConstituency &&
                            matchingCustomConstituency.constituency !== 74
                              ? matchingCustomConstituency.constituency
                              : undefined
                          }
                          onChange={(newConstituency) => {
                            const existingIndex = customSelection.findIndex(
                              (setConstituency) =>
                                setConstituency.name ===
                                constituency.districtName
                            );

                            const clonedSelection = cloneDeep(customSelection);
                            clonedSelection[existingIndex] = {
                              name: constituency.districtName,
                              constituency: newConstituency,
                            };
                            setCustomSelection([...clonedSelection]);
                          }}
                          options={times(12, (index) => ({
                            label: `WK ${index + 75}`,
                            value: index + 75,
                          }))}
                        />
                      </ConstituencyCol>
                    );
                  })}
                </Row>
              ))}
          </FullWidthElement>
        )}
        <FullWidthElement
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            textAlign: "center",
          }}
        >
          {!buildModeActive &&
            variantGroups.map((group) => (
              <StyledRadioGroup
                size="large"
                key={group.label}
                onChange={(e) => {
                  if (e.target.value === null) {
                    setBuildModeActive(true);
                  } else {
                    setActiveVersion(e.target.value);
                  }
                }}
                value={
                  group.options.find((option) => option.value === activeVersion)
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
                    constituencyAssignments={
                      activeVersion.match(/^[A-Fa-f0-9]+$/)
                        ? flatten(
                            Object.values(
                              mapConstituencyAssignments(activeVersion)
                            )
                          )
                        : constituencyAssignments
                    }
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
                    constituencyAssignments={
                      activeVersion.match(/^[A-Fa-f0-9]+$/)
                        ? flatten(
                            Object.values(
                              mapConstituencyAssignments(activeVersion)
                            )
                          )
                        : constituencyAssignments
                    }
                    dataForThisVersion={dataForThisVersion}
                    showResults={true}
                  />
                ),
              },
              {
                label: `Tabelle`,
                key: "3",
                children: (
                  <ResultsTable
                    activeVersion={activeVersion}
                    dataForThisVersion={dataForThisVersion}
                  />
                ),
              },
            ]}
          />
        </FullWidthElement>
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
