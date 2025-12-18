import React from "react";
import styled from "styled-components";

const Button = styled.button`
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border: none;
  border-radius: 4px;
  background-color: #923ba3;
  cursor: pointer;

  &:hover {
    background-color: #d0d0d0;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

interface BlockProps {
  icon: string;
  onClick?: () => void;
}

const Block: React.FC<BlockProps> = ({ icon, onClick }) => {
  return (
    <Button onClick={onClick}>
      <img src={icon} alt="" width={20} height={20}></img>
    </Button>
  );
};

export default Block;
