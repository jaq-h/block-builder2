import React from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
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
