import "../App.css";

import { Layout } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";
const { Footer: Antdfooter } = Layout;

export const StyledFooter = styled(Antdfooter)`
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80vw;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Footer = () => (
  <StyledFooter>
    <Link to="/">Hauptseite</Link>
    <Link to="/impressum">Impressum</Link>
    <Link to="/datenschutz">Datenschutzerklärung</Link>
  </StyledFooter>
);

export default Footer;
