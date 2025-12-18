import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";

interface ButtonProps {
  $isDragging: boolean;
}

const Button = styled.button<ButtonProps>`
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border: none;
  border-radius: 4px;
  background-color: #923ba3;
  cursor: ${({ $isDragging }) => ($isDragging ? "grabbing" : "grab")};
  user-select: none;

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
  onDragEnd?: (x: number, y: number) => void;
}

const Block: React.FC<BlockProps> = ({ icon, onClick, onDragEnd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    },
    [isDragging, startPos],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd?.(position.x, position.y);
    }
  }, [isDragging, position, onDragEnd]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <Button
      $isDragging={isDragging}
      onMouseDown={handleMouseDown}
      onClick={onClick}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <img src={icon} alt="" width={20} height={20} draggable={false} />
    </Button>
  );
};

export default Block;
