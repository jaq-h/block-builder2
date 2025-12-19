import React, { useState, useRef } from "react";
import styled from "styled-components";
import Block from "../blocks/block";
import vite from "../../assets/vite.svg";

const Container = styled.div`
  max-width: 380px;
  height: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ColumnsWrapper = styled.div`
  overflow: scroll;
  display: flex;
  flex: 1;
  height: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100px;
  width: 100%;
`;

const ProviderColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 60px;
  width: 80px;
  justify-content: space-between;
  border-right: 1px solid #444;
  background-color: rgba(50, 50, 50, 0.3);
`;

interface RowProps {
  $isOver: boolean;
  $isValidTarget: boolean;
  $align: "left" | "right";
}

const Row = styled.div<RowProps>`
  flex: 1;
  border: 1px solid
    ${({ $isOver, $isValidTarget }) =>
      $isOver ? "#923ba3" : $isValidTarget ? "#5a9" : "#fff"};
  background-color: ${({ $isOver, $isValidTarget }) =>
    $isOver
      ? "rgba(146, 59, 163, 0.1)"
      : $isValidTarget
        ? "rgba(85, 170, 153, 0.1)"
        : "transparent"};
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: ${({ $align }) =>
    $align === "left" ? "flex-start" : "flex-end"};
  padding: 8px;
  min-height: 144px;
  gap: 8px;
  overflow: auto;
  transition:
    border-color 0.2s,
    background-color 0.2s;
`;

const ProviderRow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  gap: 8px;
`;

interface BlockData {
  id: string;
  icon?: string;
  abrv: string;
  allowedRows: number[];
}

// Provider blocks (static, never removed)
interface ProviderBlockData {
  type: string;
  abrv: string;
  icon?: string;
  allowedRows: number[];
}

// Grid structure: [column][row] = blocks
type GridData = BlockData[][][];

const Assembly: React.FC = () => {
  // Static provider blocks (column 0)
  const providerBlocks: ProviderBlockData[] = [
    { type: "limit", abrv: "Lmt", allowedRows: [1, 2, 3] },
    { type: "market", abrv: "Mkt", icon: vite, allowedRows: [1, 2, 3] },
    { type: "iceberg", abrv: "Ice", icon: vite, allowedRows: [1, 2, 3] },
    { type: "stop-loss", abrv: "SL", icon: vite, allowedRows: [1, 2, 3] },
    {
      type: "stop-loss-limit",
      abrv: "SL-Lmt",
      icon: vite,
      allowedRows: [1, 2, 3],
    },
    { type: "take-profit", abrv: "TP", icon: vite, allowedRows: [1, 2, 3] },
    {
      type: "take-profit-limit",
      abrv: "TP-Lmt",
      icon: vite,
      allowedRows: [1, 2, 3],
    },
    { type: "trailing-stop", abrv: "TS", icon: vite, allowedRows: [1, 2, 3] },
    {
      type: "trailing-stop-limit",
      abrv: "TS-Lmt",
      icon: vite,
      allowedRows: [1, 2, 3],
    },
  ];

  // Counter for generating unique IDs
  const blockIdCounter = useRef(0);

  // 2 columns x 3 rows grid (columns 1 and 2)
  const [grid, setGrid] = useState<GridData>([
    // Column 1 (index 0 in grid) - LEFT column, blocks align RIGHT
    [
      [], // Row 0
      [], // Row 1
      [], // Row 2
    ],
    // Column 2 (index 1 in grid) - RIGHT column, blocks align LEFT
    [
      [], // Row 0
      [], // Row 1
      [], // Row 2
    ],
  ]);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [draggingFromProvider, setDraggingFromProvider] = useState<
    string | null
  >(null);
  const [hoveredProviderId, setHoveredProviderId] = useState<string | null>(
    null,
  );
  const [hoverCell, setHoverCell] = useState<{
    col: number;
    row: number;
  } | null>(null);

  // Refs for each cell in the grid (not including provider)
  const cellRefs = useRef<(HTMLDivElement | null)[][]>([
    [null, null, null],
    [null, null, null],
  ]);

  // Get allowed rows for the currently active block (dragging or hovering)
  const getActiveAllowedRows = (): number[] => {
    // Check if dragging from provider
    if (draggingFromProvider) {
      const provider = providerBlocks.find(
        (b) => b.type === draggingFromProvider,
      );
      return provider?.allowedRows || [];
    }
    // Check if hovering over provider
    if (hoveredProviderId) {
      const provider = providerBlocks.find((b) => b.type === hoveredProviderId);
      return provider?.allowedRows || [];
    }
    // Check if dragging an existing block
    if (draggingId) {
      for (const column of grid) {
        for (const row of column) {
          const block = row.find((b) => b.id === draggingId);
          if (block) {
            return block.allowedRows;
          }
        }
      }
    }
    return [];
  };

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleProviderDragStart = (type: string) => {
    setDraggingFromProvider(type);
    setHoveredProviderId(null);
  };

  const handleProviderMouseEnter = (type: string) => {
    if (!draggingFromProvider && !draggingId) {
      setHoveredProviderId(type);
    }
  };

  const handleProviderMouseLeave = () => {
    setHoveredProviderId(null);
  };

  const handleProviderDragEnd = (type: string, x: number, y: number) => {
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

    if (targetCol !== null && targetRow !== null) {
      // Create a new block instance from the provider
      const providerBlock = providerBlocks.find((b) => b.type === type);
      if (providerBlock) {
        // Check if the target row is allowed
        if (!providerBlock.allowedRows.includes(targetRow)) {
          setDraggingFromProvider(null);
          setHoverCell(null);
          return;
        }

        blockIdCounter.current += 1;
        const newBlock: BlockData = {
          id: `${type}-${blockIdCounter.current}`,
          icon: providerBlock.icon,
          abrv: providerBlock.abrv,
          allowedRows: providerBlock.allowedRows,
        };

        setGrid((prev) => {
          const newGrid = prev.map((col) => col.map((row) => [...row]));
          newGrid[targetCol!][targetRow!].push(newBlock);
          return newGrid;
        });
      }
    }

    setDraggingFromProvider(null);
    setHoverCell(null);
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

    if (targetCol !== null && targetRow !== null) {
      // Check if target row is allowed for this block
      if (blockData && !blockData.allowedRows.includes(targetRow)) {
        setDraggingId(null);
        setHoverCell(null);
        return;
      }

      // Move block to new cell
      if (
        sourceCol !== null &&
        sourceRow !== null &&
        blockData &&
        (targetCol !== sourceCol || targetRow !== sourceRow)
      ) {
        setGrid((prev) => {
          const newGrid = prev.map((col) => col.map((row) => [...row]));
          // Remove from source
          newGrid[sourceCol!][sourceRow!] = newGrid[sourceCol!][
            sourceRow!
          ].filter((b) => b.id !== id);
          // Add to target
          newGrid[targetCol!][targetRow!].push(blockData!);
          return newGrid;
        });
      }
    } else {
      // Dropped outside - remove the block
      if (sourceCol !== null && sourceRow !== null) {
        setGrid((prev) => {
          const newGrid = prev.map((col) => col.map((row) => [...row]));
          newGrid[sourceCol!][sourceRow!] = newGrid[sourceCol!][
            sourceRow!
          ].filter((b) => b.id !== id);
          return newGrid;
        });
      }
    }

    setDraggingId(null);
    setHoverCell(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId && !draggingFromProvider) return;

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

  const isDragging = draggingId !== null || draggingFromProvider !== null;
  const activeAllowedRows = getActiveAllowedRows();
  const showValidTargets = isDragging || hoveredProviderId !== null;

  // Get alignment based on column index
  const getAlignment = (colIndex: number): "left" | "right" => {
    return colIndex === 0 ? "right" : "left";
  };

  // Check if a row is a valid target
  const isValidTarget = (rowIndex: number): boolean => {
    return showValidTargets && activeAllowedRows.includes(rowIndex);
  };

  return (
    <Container onMouseMove={handleMouseMove}>
      <ColumnsWrapper>
        {/* Provider Column */}
        <ProviderColumn>
          <ProviderRow>
            {providerBlocks.map((block) => (
              <Block
                key={block.type}
                id={block.type}
                icon={block.icon}
                abrv={block.abrv}
                onDragStart={() => handleProviderDragStart(block.type)}
                onDragEnd={(id, x, y) =>
                  handleProviderDragEnd(block.type, x, y)
                }
                onMouseEnter={() => handleProviderMouseEnter(block.type)}
                onMouseLeave={handleProviderMouseLeave}
              />
            ))}
          </ProviderRow>
        </ProviderColumn>

        {/* Grid Columns */}
        {grid.map((column, colIndex) => (
          <Column key={colIndex}>
            {column.map((row, rowIndex) => (
              <Row
                key={rowIndex}
                ref={(el) => (cellRefs.current[colIndex][rowIndex] = el)}
                $isOver={
                  hoverCell?.col === colIndex &&
                  hoverCell?.row === rowIndex &&
                  isDragging &&
                  activeAllowedRows.includes(rowIndex)
                }
                $isValidTarget={isValidTarget(rowIndex)}
                $align={getAlignment(colIndex)}
              >
                {row.map((block) => (
                  <Block
                    key={block.id}
                    id={block.id}
                    icon={block.icon}
                    abrv={block.abrv}
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
