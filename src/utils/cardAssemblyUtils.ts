import type { AxisType, OrderTypeDefinition } from "../data/orderTypes";
import { GRID_CONFIG } from "../data/orderTypes";

// Types
export interface BlockData {
  id: string;
  icon?: string;
  abrv: string;
  allowedRows: number[];
  axis: 1 | 2;
  yPosition: number; // -1 for no position
  axes: AxisType[];
  linkedBlockId?: string;
}

export type ProviderBlockData = OrderTypeDefinition;
export type GridData = BlockData[][][];
export interface CellPosition {
  col: number;
  row: number;
}

// Use centralized config
export const FIRST_PLACEMENT_ROW = GRID_CONFIG.firstPlacementRow;

/** Create an empty grid */
export const createEmptyGrid = (): GridData =>
  clearGrid(GRID_CONFIG.numColumns, GRID_CONFIG.numRows);

/** Check if any block has been placed in the grid */
export const hasAnyBlockBeenPlaced = (grid: GridData): boolean =>
  grid.some((column) => column.some((row) => row.length > 0));

/** Get all cells that have blocks */
export const getOccupiedCells = (grid: GridData): CellPosition[] => {
  const occupied: CellPosition[] = [];
  grid.forEach((column, colIndex) => {
    column.forEach((row, rowIndex) => {
      if (row.length > 0) {
        occupied.push({ col: colIndex, row: rowIndex });
      }
    });
  });
  return occupied;
};

/** Get diagonal cells from all occupied cells */
export const getDiagonalCells = (
  occupiedCells: CellPosition[],
  numColumns: number,
  numRows: number,
): Set<string> => {
  const diagonals = new Set<string>();
  const offsets = [
    { col: -1, row: -1 },
    { col: -1, row: 1 },
    { col: 1, row: -1 },
    { col: 1, row: 1 },
  ];

  occupiedCells.forEach(({ col, row }) => {
    offsets.forEach((offset) => {
      const newCol = col + offset.col;
      const newRow = row + offset.row;
      if (
        newCol >= 0 &&
        newCol < numColumns &&
        newRow >= 0 &&
        newRow < numRows
      ) {
        diagonals.add(`${newCol}-${newRow}`);
      }
    });
  });

  occupiedCells.forEach(({ col, row }) => diagonals.delete(`${col}-${row}`));
  return diagonals;
};

/** Check if a cell is a valid target considering placement rules */
export const isCellValidForPlacement = (
  colIndex: number,
  rowIndex: number,
  allowedRows: number[],
  grid: GridData,
): boolean => {
  if (!allowedRows.includes(rowIndex)) return false;
  if (!hasAnyBlockBeenPlaced(grid)) return rowIndex === FIRST_PLACEMENT_ROW;

  const occupiedCells = getOccupiedCells(grid);
  const diagonalCells = getDiagonalCells(
    occupiedCells,
    grid.length,
    grid[0].length,
  );
  return diagonalCells.has(`${colIndex}-${rowIndex}`);
};

/** Get alignment based on column index */
export const getAlignment = (colIndex: number): "left" | "right" =>
  colIndex === 0 ? "right" : "left";

/** Check if a cell should be disabled (darkened) */
export const isCellDisabled = (
  colIndex: number,
  rowIndex: number,
  grid: GridData,
): boolean => {
  if (!hasAnyBlockBeenPlaced(grid)) return rowIndex !== FIRST_PLACEMENT_ROW;

  const isOccupied = grid[colIndex][rowIndex].length > 0;
  const occupiedCells = getOccupiedCells(grid);
  const diagonalCells = getDiagonalCells(
    occupiedCells,
    grid.length,
    grid[0].length,
  );
  return !isOccupied && !diagonalCells.has(`${colIndex}-${rowIndex}`);
};

/** Find the cell at a given x, y position using data attributes */
export const findCellAtPosition = (
  x: number,
  y: number,
): CellPosition | null => {
  const elements = document.querySelectorAll("[data-col][data-row]");
  for (const element of Array.from(elements)) {
    const rect = element.getBoundingClientRect();
    if (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    ) {
      const col = parseInt(element.getAttribute("data-col") || "-1", 10);
      const row = parseInt(element.getAttribute("data-row") || "-1", 10);
      if (col !== -1 && row !== -1) return { col, row };
    }
  }
  return null;
};

/** Find a block in the grid by its ID */
export const findBlockInGrid = (
  grid: GridData,
  id: string,
): { col: number; row: number; block: BlockData } | null => {
  for (let colIndex = 0; colIndex < grid.length; colIndex++) {
    for (let rowIndex = 0; rowIndex < grid[colIndex].length; rowIndex++) {
      const block = grid[colIndex][rowIndex].find((b) => b.id === id);
      if (block) return { col: colIndex, row: rowIndex, block };
    }
  }
  return null;
};

/** Clear all blocks from the grid */
export const clearGrid = (numColumns: number, numRows: number): GridData =>
  Array.from({ length: numColumns }, () =>
    Array.from({ length: numRows }, () => []),
  );

/** Reverse the blocks between columns (swap columns) */
export const reverseColumns = (grid: GridData): GridData => [
  [...grid[1].map((row) => [...row])],
  [...grid[0].map((row) => [...row])],
];

/** Check if a provider block should be highlighted based on hovered grid cell */
export const isProviderBlockHighlighted = (
  block: ProviderBlockData,
  hoveredGridCell: CellPosition | null,
  isDragging: boolean,
  grid: GridData,
): boolean => {
  if (isDragging || !hoveredGridCell) return false;
  return (
    block.allowedRows.includes(hoveredGridCell.row) &&
    isCellValidForPlacement(
      hoveredGridCell.col,
      hoveredGridCell.row,
      block.allowedRows,
      grid,
    )
  );
};

/** Calculate Y position percentage from mouse Y within a cell */
export const calculateYPosition = (
  mouseY: number,
  cellRect: DOMRect,
  headerOffset = 20,
  bottomOffset = 4,
): number => {
  const availableHeight = cellRect.height - headerOffset - bottomOffset;
  const relativeY = mouseY - cellRect.top - headerOffset;
  return Math.max(0, Math.min(100, 100 - (relativeY / availableHeight) * 100));
};

/** Determine which axis based on X position within cell */
export const findAxisAtPosition = (mouseX: number, cellRect: DOMRect): 1 | 2 =>
  mouseX - cellRect.left < cellRect.width / 2 ? 1 : 2;

/** Find cell element and calculate position data for a block drop */
export const findCellAndPositionData = (
  x: number,
  y: number,
): { col: number; row: number; axis: 1 | 2; yPosition: number } | null => {
  const elements = document.querySelectorAll("[data-col][data-row]");

  for (const element of Array.from(elements)) {
    const rect = element.getBoundingClientRect();
    if (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    ) {
      const col = parseInt(element.getAttribute("data-col") || "-1", 10);
      const row = parseInt(element.getAttribute("data-row") || "-1", 10);
      if (col !== -1 && row !== -1) {
        const axis = findAxisAtPosition(x, rect);
        const yPosition = calculateYPosition(y, rect);
        return { col, row, axis, yPosition };
      }
    }
  }

  return null;
};
