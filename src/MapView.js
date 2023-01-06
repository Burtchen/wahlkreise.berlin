import styled from "styled-components";

import version2Map from "./version-2-sqooshed.png";
import { ReactComponent as BerlinMap } from "./berlin-state-level-districts.svg";

import { FullWidthElement } from "./App";
import { Popover } from "antd";

const SVGContainer = styled.div`
  width: 100%;
  svg {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    ${({ constituencyColors }) => constituencyColors};
  }
`;

const MapView = ({ activeVersion, constituencyColors }) =>
  activeVersion === "Variante 2 der Landeswahlleitung" ? (
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
    <SVGContainer constituencyColors={constituencyColors}>
      <BerlinMap className="berlin-map" />
    </SVGContainer>
  );

export default MapView;
