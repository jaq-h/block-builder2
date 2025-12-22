import React, { useState, useRef } from "react";
import styled from "styled-components";
import Block from "../blocks/block";
import vite from "../../assets/vite.svg";

const Container = styled.div`
  max-width: 800px;
  height: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ColumnsWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`;

interface ColProps {
  $index: number;
}
const Column = styled.div<ColProps>`
  display: flex;
  flex-direction: column;
  min-width: ${({ $index }) => ($index === 0 ? "80px" : "200px")};
`;

  $isOver: boolean;
}

const Row = styled.div<RowProps>`
  flex: 1;
  border: 1px solid ${({ $isOver }) => ($isOver ? "#923ba3" : "#fff")};
  background-color: ${({ $isOver }) =>
    $isOver ? "rgba(146, 59, 163, 0.1)" : "transparent"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 8px;
  min-height: 144px;
  gap: 8px;
  overflow: auto;
  transition:
    border-color 0.2s,
    background-color 0.2s;
`;

interface BlockData {
  id: string;
  icon: string;
}

// Grid structure: [column][row] = blocks
type GridData = BlockData[][][];

// interface AssemblyProps {
//   // Add your props here
// }

const Assembly: React.FC = () => {
<<<<<<< Updated upstream
  // 2 columns x 3 rows grid
  const [grid, setGrid] = useState<GridData>([
    // Column 0
    [
      [
        { id: "block-1", icon: vite },
        { id: "block-2", icon: vite },
      ], // Row 0
      [], // Row 1
      [], // Row 2
    ],
    // Column 1
    [
      [], // Row 0
      [], // Row 1
      [], // Row 2
    ],
  ]);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverCell, setHoverCell] = useState<{
    col: number;
    row: number;
  } | null>(null);

  // Refs for each cell: rowRefs[col][row]
  const cellRefs = useRef<(HTMLDivElement | null)[][]>([
    [null, null, null],
    [null, null, null],
  ]);

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDragEnd = (id: string, x: number, y: number) => {
    // Find which cell the block was dropped on
    let targetCol: number | null = null;
    let targetRow: number | null = null;

    cellRefs.current.forEach((column, colIndex) => {
      column.forEach((ref, rowIndex) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
          ) {
            targetCol = colIndex;
            targetRow = rowIndex;
          }
        }
      });
    });

<<<<<<< Updated upstream
    if (targetCol !== null && targetRow !== null) {
      // Find source cell and block
      let sourceCol: number | null = null;
      let sourceRow: number | null = null;
      let blockData: BlockData | null = null;

      grid.forEach((column, colIndex) => {
        column.forEach((row, rowIndex) => {
          const block = row.find((b) => b.id === id);
          if (block) {
            sourceCol = colIndex;
            sourceRow = rowIndex;
            blockData = block;
          }
        });
      });

      if (
        sourceCol !== null &&
        sourceRow !== null &&
        (targetCol !== sourceCol || targetRow !== sourceRow)
      ) {
        setGrid((prev) => {
          const newGrid = prev.map((col) => col.map((row) => [...row]));
          // Remove from source
          newGrid[sourceCol!][sourceRow!] = newGrid[sourceCol!][
            sourceRow!
          ].filter((b) => b.id !== id);
          // Add to target
          return newGrid;
        });
      }
>>>>>>> Stashed changes
    }

    setDraggingId(null);
    setHoverCell(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;

    let hoveredCol: number | null = null;
    let hoveredRow: number | null = null;

    cellRefs.current.forEach((column, colIndex) => {
      column.forEach((ref, rowIndex) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            hoveredCol = colIndex;
            hoveredRow = rowIndex;
          }
        }
      });
    });

    if (hoveredCol !== null && hoveredRow !== null) {
      setHoverCell({ col: hoveredCol, row: hoveredRow });
    } else {
      setHoverCell(null);
    }
  };

  return (
    <Container onMouseMove={handleMouseMove}>
<<<<<<< Updated upstream
      <ColumnsWrapper>
        {grid.map((column, colIndex) => (
          <Column key={colIndex} $index={colIndex}>
            {column.map((row, rowIndex) => (
              <Row
                key={rowIndex}
                ref={(el) => (cellRefs.current[colIndex][rowIndex] = el)}
                $isOver={
                  hoverCell?.col === colIndex &&
                  hoverCell?.row === rowIndex &&
                  draggingId !== null
                }
              >
                {row.map((block) => (
                  <Block
                    key={block.id}
                    id={block.id}
                    icon={block.icon}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </Row>
            ))}
          </Column>
        ))}
      </ColumnsWrapper>
    </Container>
  );
};

export default Assembly;
