import "../App.css";

import { FullWidthElement, StyledContent } from "../App";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Privacy = () => (
  <div className="App">
    <Header />
    <StyledContent>
      <FullWidthElement>
        <h2>Datenschutzerklärung</h2>
        <p>
          Dr. Nicolas Scharioth
          <br />
          Christburger Str. 23, 10405 Berlin
          <br /> ist als Betreiber der Website nicolas-scharioth.de
          Verantwortlicher für die personenbezogenen Daten der Nutzer:innen der
          Website im Sinne der Datenschutzgrundverordnung (DSGVO). Der Schutz
          der personenbezogenen Daten meiner Besucher:innen ist mir wichtig. Sie
          können von mir erwarten, dass ich mit Ihren Daten sensibel und
          sorgfältig umgehe und für eine hohe Datensicherheit sorge. Ich beachte
          die Vorschriften des Bundesdatenschutz- und des Telemediengesetzes
          sowie die Datenschutzgrundverordnung und werde personenbezogene Daten
          der Nutzer:innen nur in dem in dieser Datenschutzerklärung
          beschriebenen Umfang verarbeiten.
        </p>
        <h3>Rechtsgrundlage zur Erhebung personenbezogener Daten</h3>
        <p>
          Diese Webseite verwendet kein Kontaktformular. Von Ihnen erhobene
          Daten verwende ich ausschließlich, um den von Ihnen damit jeweils
          angeforderten Dienst zu erbringen. Dies tue ich auf Grundlage des Art.
          6 Abs. 1 lit. b DSGVO.In jedem Fall haben von meiner Seite nur
          berechtigte Personen Zugang zu Ihren personenbezogenen Daten, und dies
          auch nur insoweit, als es im Rahmen der oben genannten Zwecke
          erforderlich ist.
        </p>
        <h3>Ihre Rechte</h3>
        <p>
          Sie können sich jederzeit bei mir melden und Auskunft, Berichtigung,
          Löschung oder Einschränkung der Verarbeitung der über Sie
          gespeicherten Daten verlangen. Außerdem steht Ihnen ein Recht auf
          Datenübertragbarkeit und das Recht zur Beschwerde bei einer
          Aufsichtsbehörde zu. Bitte wenden Sie sich zur Ausübung Ihrer mir
          gegenüber zustehenden Rechte an mail@nicolas-scharioth.de.
        </p>
        <h3>Persönliche Daten</h3>
        Persönliche Daten, die elektronisch übermittelt werden, z.B. Name,
        E-Mail-Adresse oder andere persönlichen Angaben, werden nur zum jeweils
        angegebenen Zweck verwendet und sicher verwahrt. Es werden nur dann
        Informationen zugeschickt, sofern eine Anmeldung dafür vorliegt.
        <h3>Weitergabe von Daten an Dritte</h3>
        <p>
          Ich gebe keine personenbezogene Daten an Dritte weiter, es sei denn,
          ich bin aufgrund von behördlichen oder gerichtlichen Anordnungen dazu
          verpflichtet. Hierbei kann es sich insbesondere um die
          Auskunftserteilung für Zwecke der Strafverfolgung, zur Gefahrenabwehr
          oder zur Durchsetzung geistiger Eigentumsrechte handeln.
        </p>
        <h3>Verwendung von Cookies</h3>
        <p>
          Es gibt eine Technik, genannt „Cookies“, mit deren Hilfe Informationen
          aus einer Website an persönliche Bedürfnisse angepasst werden können.
          Ein Cookie ist ein Datenelement, das eine Website an den Browser
          schicken kann, um es dort auf dem System zu speichern. Gelegentlich
          werden auch temporäre Cookies genutzt.
        </p>
        <h3>Links zu anderen Webseiten</h3>
        <p>
          Diese Website enthält Links zu externen Webseiten Dritter, auf deren
          Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden
          Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
          Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
          verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
          Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
          Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine
          permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne
          konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
          bekannt werden von Rechtsverletzungen werde ich derartige Links
          umgehend entfernen.
        </p>
        <h3>Änderung dieser Datenschutzerklärung</h3>
        <p>
          Ich behalte mir das Recht vor, diese Datenschutzerklärung jederzeit
          mit Wirkung für die Zukunft zu ändern. Eine jeweils aktuelle Version
          ist an dieser Stelle verfügbar. Bitte informieren Sie sich regelmäßig
          über die geltende Datenschutzerklärung.
        </p>
        <p>Stand: 10. Januar 2023</p>
      </FullWidthElement>
    </StyledContent>
    <Footer />
  </div>
);

export default Privacy;
