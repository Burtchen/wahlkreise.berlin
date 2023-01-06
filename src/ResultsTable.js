import "./App.css";

import { Table } from "antd";
import { isNumber, map, max, meanBy, omit, sumBy } from "lodash";

import {
  CONSTITUENCY,
  DEVIATION,
  ELIGIBLE_VOTERS,
  INEFFICIENT_MAJOR_PARTY_VOTES,
  partiesWithDirectSeats,
} from "./App";

const isPartyColumn = (columnName) =>
  [...partiesWithDirectSeats, "AfD", "FDP"].includes(columnName);

function ResultsTable({ dataForThisVersion }) {
  return (
    <Table
      style={{ marginTop: "2rem", width: "100%" }}
      bordered
      pagination={false}
      dataSource={dataForThisVersion
        .slice(1)
        .map((row, index) => ({ ...row, key: index }))}
      columns={Object.keys(dataForThisVersion[1]).map((column) => ({
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
                  {text?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
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
            index < 3 || index > 8
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
              {map(omit(mainSummaryRow, "key"), (summaryCell, index) => (
                <Table.Summary.Cell key={index} index={index}>
                  {summaryCell}
                </Table.Summary.Cell>
              ))}
            </Table.Summary.Row>{" "}
            <Table.Summary.Row>
              {map(omit(directVotesRow, "key"), (summaryCell, index) => (
                <Table.Summary.Cell key={index} index={index}>
                  {summaryCell}
                </Table.Summary.Cell>
              ))}
            </Table.Summary.Row>
          </>
        );
      }}
    />
  );
}

export default ResultsTable;
