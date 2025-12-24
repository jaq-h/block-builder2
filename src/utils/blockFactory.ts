// Block factory utilities for creating BlockData from OrderTypeDefinition
import type { BlockData } from "./cardAssemblyUtils";
import type { OrderTypeDefinition } from "../data/orderTypes";
import { getDefaultPosition } from "../data/orderTypes";

export interface BlockCreationContext {
  baseId: string;
  counter: number;
}

export interface CreatedBlocks {
  blocks: BlockData[];
  nextCounter: number;
}

/**
 * Creates BlockData instances from an OrderTypeDefinition
 * Handles all cases: no-axis, limit-only, trigger-only, and dual-axis
 */
export const createBlocksFromOrderType = (
  orderType: OrderTypeDefinition,
  context: BlockCreationContext,
): CreatedBlocks => {
  const { baseId, counter } = context;
  const blocks: BlockData[] = [];
  let currentCounter = counter;
  const { type, icon, abrv, allowedRows, axes } = orderType;

  // Case 1: No axes (Market order) - no price data
  if (axes.length === 0) {
    currentCounter += 1;
    blocks.push({
      id: `${baseId}-${type}-${currentCounter}`,
      icon,
      abrv,
      allowedRows,
      axis: 1,
      yPosition: -1,
      axes: [],
    });
  }
  // Case 2: Limit-only
  else if (axes.length === 1 && axes[0] === "limit") {
    currentCounter += 1;
    blocks.push({
      id: `${baseId}-${type}-${currentCounter}`,
      icon,
      abrv,
      allowedRows,
      axis: 2,
      yPosition: getDefaultPosition(orderType, "limit"),
      axes: ["limit"],
    });
  }
  // Case 3: Trigger-only
  else if (axes.length === 1 && axes[0] === "trigger") {
    currentCounter += 1;
    blocks.push({
      id: `${baseId}-${type}-${currentCounter}`,
      icon,
      abrv,
      allowedRows,
      axis: 1,
      yPosition: getDefaultPosition(orderType, "trigger"),
      axes: ["trigger"],
    });
  }
  // Case 4: Dual-axis (trigger + limit)
  else if (axes.includes("trigger") && axes.includes("limit")) {
    currentCounter += 1;
    blocks.push({
      id: `${baseId}-${type}-${currentCounter}`,
      icon,
      abrv,
      allowedRows,
      axis: 1,
      yPosition: getDefaultPosition(orderType, "trigger"),
      axes: ["trigger"],
    });

    currentCounter += 1;
    blocks.push({
      id: `${baseId}-${type}-limit-${currentCounter}`,
      icon,
      abrv: `${abrv}-L`,
      allowedRows,
      axis: 2,
      yPosition: getDefaultPosition(orderType, "limit"),
      axes: ["limit"],
    });
  }

  return { blocks, nextCounter: currentCounter };
};

/** Cell display mode based on blocks' axes configurations */
export type CellDisplayMode = "empty" | "no-axis" | "limit-only" | "dual-axis";

export const getCellDisplayMode = (blocks: BlockData[]): CellDisplayMode => {
  if (blocks.length === 0) return "empty";
  if (blocks.every((b) => b.axes.length === 0)) return "no-axis";
  if (blocks.every((b) => b.axes.length === 1 && b.axes[0] === "limit"))
    return "limit-only";
  return "dual-axis";
};

/** Check if a block should show percentage */
export const shouldShowPercentage = (block: BlockData): boolean =>
  block.axes.length > 0 && block.yPosition >= 0;

/** Check if a block is vertically draggable */
export const isBlockVerticallyDraggable = (block: BlockData): boolean =>
  block.axes.length > 0;

/** Build order config entry for a block */
export const buildOrderConfigEntry = (
  block: BlockData,
  col: number,
  row: number,
  type: string,
): {
  col: number;
  row: number;
  type: string;
  axis?: 1 | 2;
  yPosition?: number;
} => {
  if (block.axes.length === 0) {
    return { col, row, type };
  }
  return { col, row, axis: block.axis, yPosition: block.yPosition, type };
};
