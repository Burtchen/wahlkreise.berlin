import "../App.css";

import { FullWidthElement, StyledContent } from "../App";

import Footer from "../components/Footer";
import Header from "../components/Header";

const Imprint = () => (
  <div className="App">
    <Header />
    <StyledContent>
      <FullWidthElement>
        <h2>Impressum</h2>
        <p>
          Dieses Angebot wird von Dr. Nicolas Scharioth mit der nachfolgenden
          Anschrift als Privatperson unterhalten und steht nicht in Verbindung
          mit Dr. Nicolas Scharioth als Gewerbetreibenden oder als
          Parteimitglied von BÜNDNIS 90 / DIE GRÜNEN und ist auch kein
          Partei-Angebot von BÜNDNIS 90 / DIE GRÜNEN. Wenn und soweit § 55 Abs.
          2 RStV Anwendung findet, ist Dr. Nicolas Scharioth mit der
          nachfolgenden Anschrift der Verantwortliche.
        </p>
        <p>
          Dr. Nicolas Scharioth
          <br />
          Christburger Str. 23
          <br />
          10405 Berlin
          <br />
          E-Mail: kontakt@wahlkreise.info
        </p>
        <p>
          <h3>Programmierung</h3>
          Verantwortlich für die Softwareprogrammierung zu den dargestellten
          Bundestagswahlkreisen ist Christian Burtchen (www.der-burtchen.de).
        </p>
      </FullWidthElement>
    </StyledContent>
    <Footer />
  </div>
);

export default Imprint;
