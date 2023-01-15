import "./App.css";

import { Tooltip } from "antd";
import { max, times } from "lodash";
import {
  ConstituencyCircle,
  FullWidthElement,
  partiesWithDirectSeats,
  partyColor,
} from "./App";
import styled from "styled-components";

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

const SeatCircles = ({ projectedSeats, originalSeats }) => (
  <FullWidthElement>
    <h2>Direktmandate</h2>
    {partiesWithDirectSeats.map((party) => (
      <PartyList key={party}>
        <PartyName>
          {party
            .replace("GRUENE", "B'90/Grüne")
            .replace("DIE LINKE", "Die Linke")}
        </PartyName>
        <div>
          <Tooltip
            title={getTooltipText(projectedSeats[party], originalSeats[party])}
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
);

export default SeatCircles;
