import "./App.css";

import { read, utils } from "xlsx";
import { Layout, Select, Radio, Table, Popover, Tooltip } from "antd";
import {
  chunk,
  cloneDeep,
  isNumber,
  map,
  max,
  maxBy,
  meanBy,
  omit,
  sum,
  sumBy,
  times,
} from "lodash";
import { useState } from "react";
import styled from "styled-components";

import version2Map from "./version-2-sqooshed.png";
import { ReactComponent as BerlinMap } from "./berlin-state-level-districts.svg";

import raw from "raw.macro";
import MetaTable from "./MetaTable";

// const jsonData = JSON.parse(raw("./bundestagswahlkreiskalkulator.json"));

const constituencyAssignments = JSON.parse(raw("./btw-kreise.json"));

const DEFAULT_TITLE = "Wahlausgang 2021";

const ELIGIBLE_VOTERS = "Wahlberechtigte";
const CONSTITUENCY = "Wahlkreis";
const DEVIATION = "Abweichung";
const INEFFICIENT_MAJOR_PARTY_VOTES = "Ineffizient verteilte Stimmen";
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
    .map((constituency, index) => {
      if (index === 0) {
        return { title: group[0][DEFAULT_TITLE] };
      }
      return map(constituency, (value, key) => ({
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
      }, {});
    }, {})
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

const metaData = jsonData.reduce(
  (acc, version) => {
    const justTheConstituencies = version.filter(
      (row) => row[DEVIATION] && row[DEVIATION] !== -10
    );
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
    meanDeviations: [],
    deviationConstituencies: [],
    inefficientVotesSums: [],
    gapVotesConstituencies: [],
  }
);

const isPartyColumn = (columnName) =>
  [...partiesWithDirectSeats, "AfD", "FDP"].includes(columnName);

const { Header, Content, Footer } = Layout;
const { Group: RadioGroup, Button: RadioButton } = Radio;

const PartyList = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 350px;
  margin-left: auto;
  margin-right: auto;
  > span {
    width: 110px;
  }
  > div {
    width: calc(100% - 110px);
    text-align: left;
  }
`;

const PartyName = styled.span`
  font-size: 1.2rem;
  text-align: left;
`;

const SVGContainer = styled.div`
  width: 100%;
  svg {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    ${({ constituencyColors }) => constituencyColors};
  }
`;

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
`;

const StyledRadioButton = styled(RadioButton)`
  display: inline-flex;
  align-items: center;
  color: #333333;
  height: 80px !important;
  font-size: 0.8rem !important;
  width: 140px;
  line-height: 1.4 !important;
`;

const StyledSelect = styled(Select)`
  @media (min-width: 768px) {
    display: none;
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

const tableColumns = Object.keys(jsonData[0][1]);

const getTooltipText = (newSeats, originalSeats) => {
  const text = `${newSeats} direkt gewählt - `;
  if (newSeats === originalSeats) {
    return text + "Keine Veränderung gegenüber 2021.";
  }
  return (
    text +
    Math.abs(newSeats - originalSeats).toString() +
    (newSeats > originalSeats ? " mehr " : " weniger ") +
    "als 2021"
  );
};

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

const partiesWithDirectSeats = Object.keys(originalSeats);

function App() {
  const [activeVersion, setActiveVersion] = useState(titles[0]);

  const getTableData = () =>
    jsonData.find((version) => version[0].title === activeVersion).slice(1);

  const tableData = jsonData.find(
    (version) => version[0].title === activeVersion
  );

  const projectedSeats = allTheSeats.find(
    (group) => group.version === activeVersion
  ).seats;

  const constituencyColors = constituencyAssignments
    .map((constituency) => {
      const currentConstituency = constituency[activeVersion];
      const electionDataToUse = omit(
        tableData.find(
          (constituency) => constituency[CONSTITUENCY] === currentConstituency
        ),
        [ELIGIBLE_VOTERS, INEFFICIENT_MAJOR_PARTY_VOTES]
      );
      const numbersInThisElection = Object.values(electionDataToUse);
      const mostVotesInDistrict = max(numbersInThisElection);
      const partyWithMostVotes = Object.entries(electionDataToUse).find(
        (pair) => pair[1] === mostVotesInDistrict
      )[0];
      return `#${constituency.districtName} { fill: ${partyColor[partyWithMostVotes]}};`;
    })
    .join(" ");

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
        <FullWidthElement
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
          {variantGroups.map((group) => (
            <StyledRadioGroup
              size="large"
              key={group.label}
              onChange={(e) => setActiveVersion(e.target.value)}
              value={
                group.options.find((option) => option.value === activeVersion)
                  ? activeVersion
                  : undefined
              }
            >
              {group.options.map((option) => (
                <StyledRadioButton value={option.value}>
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
        {activeVersion === "Variante 2 der Landeswahlleitung" ? (
          <FullWidthElement>
            <Popover
              content={
                <p style={{ maxWidth: "240px" }}>
                  Für diese Variante hat die Landesregierung nicht, wie üblich,
                  die geltenden Wahlkreise zur Abgeordnetenhauswahl zu neuen
                  Bundestagswahlkreisen zusammengeführt, sondern teilweise
                  komplett neue Wahlkreise konzipiert, für die wir (derzeit) nur
                  Kartenmaterial in einer anderen Form haben.
                </p>
              }
              title="Hinweis zu Variante 2 der Landesregierung"
            >
              <span>Warum sieht diese Karte anders aus?</span>
            </Popover>
            <img src={version2Map} alt="Logo" />
          </FullWidthElement>
        ) : (
          <SVGContainer constituencyColors={constituencyColors}>
            <BerlinMap className="berlin-map" />
          </SVGContainer>
        )}
        <FullWidthElement>
          <h2>Direktmandate</h2>
          {partiesWithDirectSeats.map((party) => (
            <PartyList>
              <PartyName>{party}</PartyName>
              <div>
                <Tooltip
                  title={getTooltipText(
                    projectedSeats[party],
                    originalSeats[party]
                  )}
                >
                  {times(
                    max([projectedSeats[party], originalSeats[party]]),
                    (index) => (
                      <ConstituencyCircle
                        key={index}
                        backgroundColor={partyColor[party]}
                        isNewSeat={index >= originalSeats[party]}
                        isLostSeat={
                          index < originalSeats[party] &&
                          index >= projectedSeats[party]
                        }
                      />
                    )
                  )}
                </Tooltip>
              </div>
            </PartyList>
          ))}
        </FullWidthElement>
        <FullWidthElement>
          <h2>Im Detail</h2>
          <Table
            style={{ marginTop: "2rem", width: "100%" }}
            bordered
            pagination={false}
            dataSource={getTableData()}
            columns={tableColumns.map((column) => ({
              title: column,
              dataIndex: column,
              key: column,
              render(text, row) {
                return {
                  props: {
                    style: {
                      background:
                        parseInt(text) ===
                        max(
                          Object.entries(row)
                            .filter((pair) => isPartyColumn(pair[0]))
                            .map((pair) => pair[1])
                        )
                          ? "orange"
                          : "transparent",
                    },
                  },
                  children:
                    Object.values(row).length < 3 ? ( // removed constituency case
                      column === CONSTITUENCY ? (
                        <div>({text})</div> // parenthesis for omitted constituency no
                      ) : (
                        <div /> // no deviation or anything else
                      )
                    ) : column === DEVIATION ? (
                      <div>{(parseFloat(text) * 10).toFixed(1)}%</div>
                    ) : (
                      <div>
                        {text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </div>
                    ),
                };
              },
            }))}
            summary={(pageData) => {
              let mainSummaryRow = {};
              let directVotesRow = {};
              Object.keys(pageData[0]).forEach((key, index) => {
                mainSummaryRow[key] =
                  key === CONSTITUENCY
                    ? "Gesamt/Mittelwert"
                    : key === DEVIATION
                    ? `${meanBy(
                        pageData.filter((row) => row[DEVIATION] !== -10),
                        (mV) => Math.abs(isNumber(mV[key]) ? mV[key] : 0)
                      ).toFixed(1)}%`
                    : sumBy(pageData, key)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                directVotesRow[key] =
                  index < 3
                    ? null
                    : pageData.filter(
                        (rowData) =>
                          rowData[key] ===
                          Math.max(
                            ...Object.values(
                              omit(rowData, [
                                ELIGIBLE_VOTERS,
                                INEFFICIENT_MAJOR_PARTY_VOTES,
                              ])
                            )
                          )
                      ).length;
              });
              return (
                <>
                  <Table.Summary.Row>
                    {map(mainSummaryRow, (summaryCell, index) => (
                      <Table.Summary.Cell index={index}>
                        {summaryCell}
                      </Table.Summary.Cell>
                    ))}
                  </Table.Summary.Row>{" "}
                  <Table.Summary.Row>
                    {map(directVotesRow, (summaryCell, index) => (
                      <Table.Summary.Cell index={index}>
                        {summaryCell}
                      </Table.Summary.Cell>
                    ))}
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </FullWidthElement>
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
