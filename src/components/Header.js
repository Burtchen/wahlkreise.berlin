import "../App.css";

import { Layout } from "antd";
import styled from "styled-components";
const { Header: AntdHeader } = Layout;

const Title = styled.h1`
  color: #22223b;
`;

const Header = () => (
  <AntdHeader>
    <Title>Berlins neue Bundestagswahlkreise</Title>
  </AntdHeader>
);

export default Header;
