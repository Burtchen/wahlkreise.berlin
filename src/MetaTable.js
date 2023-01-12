import "./App.css";

import { Table, Row, Col } from "antd";
import { sortBy, times } from "lodash";
import styled from "styled-components";
import { ConstituencyCircle, FullWidthElement, partyColor } from "./App";
import { Fragment } from "react";

const TableHeadline = styled.h3`
  font-size: 1rem;
`;

const IntroParagraph = styled.p`
  font-size: 1rem;
  margin-top: 2rem;
`;

const TableIntroParagraph = styled.p`
  height: 80px;
  font-size: 0.9rem;
`;

const StyledTable = styled(Table)`
  margin-top: 0;
  margin-bottom: 2rem;
  background: transparent;
  tr,
  td,
  th {
    background: #f5f3f4 !important;
    border: none;
    padding: 8px !important;
  }
`;

function MetaTable({ metaData, seats }) {
  return (
    <>
      <FullWidthElement style={{ textAlign: "left" }}>
        <h2>Die Varianten im Vergleich</h2>
        <IntroParagraph>
          Der Zuschnitt der Wahlkreise hat einen Einfluss auf die wahrscheinlich
          erzielten Erstimmen. Bei angenommenen Stimmen wie bei der letzten
          Abgeordnetenhauswahl 2021 ergäbe sich folgendes Bild der direkt
          gewählten Abgeordneten. Die tatsächliche Zusammensetzung der Berliner
          Bundestagsabgeordneten hängt auch noch von weiteren Faktoren wie dem
          Zweitstimmenergebnis und der Nachfolgeregelung für Überhangmandate ab.
        </IntroParagraph>
        <StyledTable
          pagination={false}
          dataSource={seats.map((versionWithSeatInfo, index) => {
            return {
              key: index,
              version: versionWithSeatInfo.version,
              seats: versionWithSeatInfo.seats,
            };
          })}
          columns={[
            { key: "version", dataIndex: "version", title: "Variante" },
            {
              key: "seats",
              dataIndex: "seats",
              title: "Angenommene Direktmandate",
              render(data) {
                return {
                  children: Object.keys(partyColor).map((party, partyIndex) => (
                    <Fragment key={partyIndex}>
                      {times(data[party], (index) => (
                        <ConstituencyCircle
                          key={index}
                          backgroundColor={partyColor[party]}
                        />
                      ))}
                    </Fragment>
                  )),
                };
              },
            },
          ]}
        />
        <IntroParagraph>
          Die vorgeschlagenen Varianten lassen sich zudem nach verschiedenen
          Kriterien beurteilen, die in der Forschung oder Rechtslage
          herangezogen werden.
        </IntroParagraph>
      </FullWidthElement>
      <Row gutter={16}>
        <Col xs={24} md={12} xl={8}>
          <TableHeadline>Ineffiziente Stimmen</TableHeadline>
          <TableIntroParagraph>
            In einer Mehrheitswahl wie bei den Erststimmen zählt ausschließlich
            Platz 1, alle übrigen Stimmen sind "nicht effizient".
          </TableIntroParagraph>
          <StyledTable
            pagination={false}
            dataSource={sortBy(
              metaData.inefficientVotesSums,
              "inefficientVotesSum"
            )
              .reverse()
              .map((sortedVersion, index) => ({
                key: index,
                version: sortedVersion.version,
                inefficientVotesSum: sortedVersion.inefficientVotesSum
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
              }))}
            columns={[
              {
                key: "version",
                dataIndex: "version",
                title: "Variante",
              },
              {
                key: "inefficientVotesSum",
                dataIndex: "inefficientVotesSum",
                title: "Σ Ineffizente Stimmen",
              },
            ]}
          />
        </Col>
        <Col xs={24} md={12} xl={8}>
          <TableHeadline>Abstände Platz 1 und 2</TableHeadline>
          <TableIntroParagraph>
            Ein großer Abstand auf Platz 2 deutet auf einen Wahlkreis hin, in
            dem besonders viele Stimmen einer Partei gebunden werden.
          </TableIntroParagraph>
          <StyledTable
            pagination={false}
            dataSource={sortBy(metaData.gapVotesConstituencies, "gapVotes")
              .reverse()
              .slice(0, 7)
              .map((sortedVersion, index) => ({
                key: index,
                versionAndConstituency: `Wahlkreis ${sortedVersion.constituency} - ${sortedVersion.version}`,
                gapVotes: sortedVersion.gapVotes
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
              }))}
            columns={[
              {
                key: "versionAndConstituency",
                dataIndex: "versionAndConstituency",
                title: "Variante und Wahlkreis",
              },
              {
                key: "gapVotes",
                dataIndex: "gapVotes",
                title: "Abstand 1 - 2",
              },
            ]}
          />
        </Col>
        <Col xs={24} md={12} xl={8}>
          <TableHeadline>Aufgeteilte Bezirke</TableHeadline>
          <TableIntroParagraph>
            Je mehr Wahlkreise ein Bezirk umfasst, desto herausfordernder wird
            die Administration und eine organische Repräsentation "vor Ort".
          </TableIntroParagraph>
          <StyledTable
            pagination={false}
            dataSource={sortBy(metaData.splitDistricts, 1).map(
              (sortedVersion, index) => ({
                key: index,
                version: sortedVersion.version,
                splitDistricts:
                  (sortedVersion[2] || 0) +
                  (sortedVersion[3] || 0) +
                  (sortedVersion[4] || 0),
              })
            )}
            columns={[
              {
                key: "version",
                dataIndex: "version",
                title: "Variante",
              },
              {
                key: "splitDistricts",
                dataIndex: "splitDistricts",
                title: "Aufgeteilte Bezirke",
              },
            ]}
          />
        </Col>
        <Col xs={24} md={12} xl={8}>
          <TableHeadline>Wahlkreisgröße im Schnitt</TableHeadline>
          <TableIntroParagraph>
            1 Person = 1 Stimme - dafür sollten Wahlkreise möglichst gleich groß
            sein. Die durchschnittliche Abweichung der Versionen.
          </TableIntroParagraph>
          <StyledTable
            pagination={false}
            dataSource={sortBy(metaData.meanDeviations, "meanDeviation")
              .reverse()
              .map((sortedVersion, index) => ({
                key: index,
                version: sortedVersion.version,
                meanDeviation: `${(sortedVersion.meanDeviation * 10).toFixed(
                  1
                )}%`,
              }))}
            columns={[
              { key: "version", dataIndex: "version", title: "Variante" },
              {
                key: "meanDeviation",
                dataIndex: "meanDeviation",
                title: "Durchschnitt Abweichung",
              },
            ]}
          />
        </Col>
        <Col xs={24} md={12} xl={8}>
          <TableHeadline>Wahlkreisgrößen: Die Ausreißer</TableHeadline>
          <TableIntroParagraph>
            Welche Wahlkreise einzelner Varianten besonders stark vom Mittelwert
            abweichen.
          </TableIntroParagraph>
          <StyledTable
            pagination={false}
            dataSource={sortBy(
              metaData.deviationConstituencies,
              (constituency) => Math.abs(constituency.deviation)
            )
              .reverse()
              .slice(0, 7)
              .map((sortedVersion, index) => ({
                key: index,
                versionAndConstituency: `Wahlkreis ${sortedVersion.constituency} - ${sortedVersion.version}`,
                deviation: `${(sortedVersion.deviation * 10).toFixed(1)}%`,
              }))}
            columns={[
              {
                key: "versionAndConstituency",
                dataIndex: "versionAndConstituency",
                title: "Variante und Wahlkreis",
              },
              {
                key: "deviation",
                dataIndex: "deviation",
                title: "Abweichung",
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}

export default MetaTable;
