import styled from "styled-components";

import version2Map from "./version-2-sqooshed.png";

import {
  CONSTITUENCY,
  ELIGIBLE_VOTERS,
  FullWidthElement,
  INEFFICIENT_MAJOR_PARTY_VOTES,
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
        currentConstituency: constituency[activeVersion],
      })),
      "currentConstituency"
    ),
    (object, constituencyNumber) => {
      const electionDataForTheFederalConstituency = omit(
        dataForThisVersion.find(
          (constituency) =>
            constituency[CONSTITUENCY] === parseInt(constituencyNumber)
        ),
        [ELIGIBLE_VOTERS, INEFFICIENT_MAJOR_PARTY_VOTES]
      );

      const partyVotes = sortBy(
        [...partiesWithDirectSeats, "AfD", "FDP"].map((name) => {
          return { name, votes: electionDataForTheFederalConstituency[name] };
        }),
        "votes"
      ).reverse();

      return {
        constituencyNumber,
        stateLevelConstituencies: map(object, "name"),
        votes: partyVotes,
      };
    }
  );

  return activeVersion === "Variante 2 der Landeswahlleitung" ? (
    <FullWidthElement>
      <Popover
        content={
          <p style={{ maxWidth: "240px" }}>
            Für diese Variante hat die Landesregierung nicht, wie üblich, die
            geltenden Wahlkreise zur Abgeordnetenhauswahl zu neuen
            Bundestagswahlkreisen zusammengeführt, sondern teilweise komplett
            neue Wahlkreise konzipiert, für die wir (derzeit) nur Kartenmaterial
            in einer anderen Form haben.
          </p>
        }
        title="Hinweis zu Variante 2 der Landeswahlleitung"
      >
        <span>Warum sieht diese Karte anders aus?</span>
      </Popover>
      <img src={version2Map} alt="Karte von Version 2 der Landeswahlleitung" />
    </FullWidthElement>
  ) : (
    <SVGContainer>
      <BerlinMap
        constituencyAssignments={federalConstituenciesWithElectionResults}
        showResults={showResults}
      />
    </SVGContainer>
  );
};

export default MapView;
