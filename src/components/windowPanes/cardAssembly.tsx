import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 800px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface AssemblyProps {
  // Add your props here
}

const Assembly: React.FC<AssemblyProps> = (props) => {
  return (
    <Container>
      <h1>Assembly Component</h1>
    </Container>
  );
};

export default Assembly;
