import styled from "styled-components";
import Assembly from "./components/windowPanes/cardAssembly";

const Container = styled.div`
  display: block;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

function App() {
  return (
    <Container>
      <Assembly />
    </Container>
  );
}

export default App;
