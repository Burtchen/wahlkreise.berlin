import styled from "styled-components";

import version2ConstituenciesMap from "./v2-constituencies.png";
import version2ResultsMap from "./v2-results.png";
import { InfoCircleOutlined } from "@ant-design/icons";

import {
  CONSTITUENCY,
  ELIGIBLE_VOTERS,
  FullWidthElement,
  INEFFICIENT_MAJOR_PARTY_VOTES,
  isCustomVersion,
  partiesWithDirectSeats,
} from "./App";
import { Popover } from "antd";
import BerlinMap from "./BerlinMap";
import { groupBy, map, omit, sortBy } from "lodash";

const SVGContainer = styled.div`
  width: 100%;
  svg {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    g:hover {
      filter: brightness(70%);
    }
  }
`;

const MapView = ({
  activeVersion,
  dataForThisVersion,
  constituencyAssignments,
  showResults,
}) => {
  const federalConstituenciesWithElectionResults = map(
    groupBy(
      constituencyAssignments.map((constituency) => ({
        name: constituency.districtName,
        currentConstituency: isCustomVersion(activeVersion)
          ? constituency.constituencyNumber
          : constituency[activeVersion],
      })),
      "currentConstituency"
    ),
    (object, constituencyNumber) => {
      const electionDataForTheFederalConstituency = isCustomVersion(
        activeVersion
      )
        ? dataForThisVersion[0]
        : omit(
            dataForThisVersion.find(
              (constituency) =>
                constituency[CONSTITUENCY] === parseInt(constituencyNumber)
            ),
            [ELIGIBLE_VOTERS, INEFFICIENT_MAJOR_PARTY_VOTES]
          );

      const partyVotes = sortBy(
        [...partiesWithDirectSeats, "AfD", "FDP"].map((name) => ({
            name,
            votes: isCustomVersion(activeVersion)
              ? Object.values(electionDataForTheFederalConstituency).find(
                  (a) => a[CONSTITUENCY] === constituencyNumber
                )[name]
              : electionDataForTheFederalConstituency[name],
        })),
        "votes"
      ).reverse();

      return {
        constituencyNumber,
        stateLevelConstituencies: map(object, "name"),
        votes: partyVotes,
      };
    }
  );

  return (
    <>
      {showResults && (
        <p>
          Diese Karte zeigt, wie die Stimmverteilung in dieser Variante aussähe
          und welche Partei wo Direktmandate erzielen würde, wenn genauso wie
          2021 gewählt würde.
        </p>
      )}
      {activeVersion === "Variante 2 der Landeswahlleitung" ? (
        <FullWidthElement style={{ position: "relative" }}>
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
            title="Hinweis zu Variante 2 der Landeswahlleitung"
          >
            <p style={{ position: "absolute", right: "100px" }}>
              <InfoCircleOutlined /> Warum sieht diese Karte anders aus?
            </p>
          </Popover>
          <img
            src={showResults ? version2ResultsMap : version2ConstituenciesMap}
            alt="Karte von Version 2 der Landeswahlleitung"
          />
        </FullWidthElement>
      ) : (
        <SVGContainer>
          <BerlinMap
            constituencyAssignments={federalConstituenciesWithElectionResults}
            showResults={showResults}
          />
        </SVGContainer>
      )}
    </>
  );
};

export default MapView;
