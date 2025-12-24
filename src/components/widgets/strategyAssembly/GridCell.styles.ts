// GridCell styled components
import styled from "styled-components";

// =============================================================================
// CONSTANTS
// =============================================================================

export const MARKET_PADDING = 20; // Space for market axis and price label
export const BLOCK_HEIGHT = 40; // Height of block element
export const MARKET_GAP = 10; // Gap between market axis and 0% block position

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getTrackHeight = () =>
  `calc(100% - ${BLOCK_HEIGHT + MARKET_PADDING + MARKET_GAP}px)`;

export const getTrackStart = (isDescending: boolean) =>
  isDescending ? MARKET_PADDING + MARKET_GAP : 0;

export const getTrackEnd = (isDescending: boolean) =>
  isDescending ? 0 : MARKET_PADDING + MARKET_GAP;

export const getPositionPercent = (yPosition: number, isDescending: boolean) =>
  isDescending ? yPosition / 100 : (100 - yPosition) / 100;

// =============================================================================
// ANIMATIONS
// =============================================================================

const breathingAnimation = `
  @keyframes breathing {
    0%, 100% {
      border-color: rgba(255, 255, 255, 0.5);
      box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1);
    }
    50% {
      border-color: rgba(255, 255, 255, 1);
      box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.2);
    }
  }
`;

// =============================================================================
// CELL CONTAINER
// =============================================================================

interface CellContainerProps {
  $isOver: boolean;
  $isValidTarget: boolean;
  $isDisabled: boolean;
  $align: "left" | "right";
  $tint?: string;
}

export const CellContainer = styled.div<CellContainerProps>`
  ${breathingAnimation}
  flex: 1;
  position: relative;
  border: 1px solid
    ${({ $isOver, $isValidTarget, $isDisabled }) =>
      $isDisabled
        ? "transparent"
        : $isOver
          ? "var(--outline-color-secondary)"
          : $isValidTarget
            ? "var(--accent-color-purple)"
            : "#e5e7eb"};
  box-shadow: ${({ $isOver, $isValidTarget }) =>
    $isOver
      ? "0 0 0 1px var(--outline-color-secondary)"
      : $isValidTarget
        ? "0 0 0 1px var(--accent-color-purple)"
        : "none"};
  border-radius: 8px;
  margin: 4px;
  background-color: ${({ $isDisabled, $tint }) =>
    $isDisabled ? "rgb(22, 18, 31)" : $tint || "#686b8214"};
  background-image: ${({ $isOver, $isValidTarget, $isDisabled }) => {
    if ($isDisabled) return "none";
    if ($isOver) {
      return `
        linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
      `;
    }
    if ($isValidTarget) {
      return `
        linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
      `;
    }
    return "none";
  }};
  background-size: ${({ $isOver, $isValidTarget }) =>
    $isOver || $isValidTarget ? "20px 20px" : "auto"};
  animation: ${({ $isOver, $isValidTarget }) =>
    $isOver || $isValidTarget ? "breathing 1.5s ease-in infinite" : "none"};
  display: flex;
  flex-direction: column;
  padding: 8px;
  min-height: 220px;
  overflow: visible;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background-image 0.3s ease-out,
    background-color 0.2s;
`;

// =============================================================================
// ROW LABEL BADGE
// =============================================================================

export const RowLabelBadge = styled.div<{ $type: "primary" | "conditional" }>`
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${({ $type }) =>
    $type === "primary"
      ? "rgba(100, 200, 100, 0.25)"
      : "rgba(200, 150, 50, 0.25)"};
  color: ${({ $type }) =>
    $type === "primary"
      ? "rgba(150, 255, 150, 0.9)"
      : "rgba(255, 200, 100, 0.9)"};
  border: 1px solid
    ${({ $type }) =>
      $type === "primary"
        ? "rgba(100, 200, 100, 0.5)"
        : "rgba(200, 150, 50, 0.5)"};
`;

// =============================================================================
// CELL HEADER
// =============================================================================

export const CellHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 4px;
`;

export const OrderTypeLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: capitalize;
`;

// =============================================================================
// AXIS COMPONENTS
// =============================================================================

export const AxisLabelItem = styled.span<{ $position?: "above" | "below" }>`
  position: absolute;
  ${({ $position }) => ($position === "above" ? "top: 2px" : "bottom: 2px")};
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  pointer-events: none;
`;

export const SliderArea = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: row;
`;

export const AxisColumn = styled.div<{ $isSingleAxis?: boolean }>`
  position: relative;
  flex: ${({ $isSingleAxis }) => ($isSingleAxis ? "1" : "0 0 50%")};
  height: 100%;
  display: flex;
  flex-direction: column;
`;

// =============================================================================
// PERCENTAGE SCALE & SLIDER TRACK
// =============================================================================

export const PercentageScale = styled.div<{ $isDescending?: boolean }>`
  position: absolute;
  left: 4px;
  top: ${({ $isDescending }) =>
    getTrackStart($isDescending ?? false) + BLOCK_HEIGHT / 2}px;
  bottom: ${({ $isDescending }) =>
    getTrackEnd($isDescending ?? false) + BLOCK_HEIGHT / 2}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 8px;
  color: rgba(255, 255, 255, 0.25);
  pointer-events: none;
`;

export const SliderTrack = styled.div<{ $isDescending?: boolean }>`
  position: absolute;
  left: 50%;
  top: ${({ $isDescending }) =>
    getTrackStart($isDescending ?? false) + BLOCK_HEIGHT / 2}px;
  bottom: ${({ $isDescending }) =>
    getTrackEnd($isDescending ?? false) + BLOCK_HEIGHT / 2}px;
  width: 2px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1)
  );
  transform: translateX(-50%);
  pointer-events: none;
`;

// =============================================================================
// MARKET PRICE LINE & LABEL
// =============================================================================

export const MarketPriceLine = styled.div<{ $isDescending?: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  ${({ $isDescending }) =>
    $isDescending ? "top" : "bottom"}: ${MARKET_PADDING}px;
  height: 0;
  border-top: 2px dashed var(--outline-color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
`;

export const MarketPriceLabel = styled.div<{ $isDescending?: boolean }>`
  position: absolute;
  ${({ $isDescending }) => ($isDescending ? "bottom: 6px" : "top: 6px")};
  font-size: 9px;
  font-weight: 500;
  color: var(--text-color-primary);
  white-space: nowrap;
  background-color: var(--ds-bg-color);
  padding: 2px 6px;
  border-radius: 3px;
`;

// =============================================================================
// BLOCK POSITIONER
// =============================================================================

export const BlockPositioner = styled.div<{
  $yPosition: number;
  $isDescending?: boolean;
}>`
  position: absolute;
  left: 0;
  right: 0;
  top: ${({ $yPosition, $isDescending }) => {
    const isDesc = $isDescending ?? false;
    const percent = getPositionPercent($yPosition, isDesc);
    const offset = getTrackStart(isDesc);
    return `calc(${getTrackHeight()} * ${percent} + ${offset}px)`;
  }};
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 2;

  > * {
    pointer-events: auto;
  }
`;

// =============================================================================
// DASHED INDICATOR
// =============================================================================

export const DashedIndicator = styled.div<{
  $yPosition: number;
  $isDescending?: boolean;
}>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  border-left: 2px dashed var(--border-color-options-row-underscored);
  pointer-events: none;
  z-index: 1;
  ${({ $yPosition, $isDescending }) => {
    const isDesc = $isDescending ?? false;
    const percent = getPositionPercent($yPosition, isDesc);
    const offset = getTrackStart(isDesc);
    const blockTop = `calc(${getTrackHeight()} * ${percent} + ${offset + BLOCK_HEIGHT / 2}px)`;
    const endOffset = getTrackEnd(isDesc);
    return `top: ${blockTop}; bottom: ${endOffset + BLOCK_HEIGHT / 2}px;`;
  }}
`;

// =============================================================================
// PERCENTAGE LABEL
// =============================================================================

export const PercentageLabel = styled.div<{
  $yPosition: number;
  $isDescending?: boolean;
  $sign?: string;
}>`
  position: absolute;
  right: 4px;
  font-size: 10px;
  font-weight: 500;
  color: var(--accent-color-purple);
  pointer-events: none;
  z-index: 3;
  top: ${({ $yPosition, $isDescending }) => {
    const isDesc = $isDescending ?? false;
    const percent = getPositionPercent($yPosition, isDesc);
    const offset = getTrackStart(isDesc);
    return `calc(${getTrackHeight()} * ${percent} + ${offset + BLOCK_HEIGHT / 2 - 6}px)`;
  }};

  &::before {
    content: "${({ $sign }) => $sign || ""}";
    margin-right: 1px;
  }
`;

export const CalculatedPriceLabel = styled.div<{
  $yPosition: number;
  $isDescending?: boolean;
}>`
  position: absolute;
  right: 4px;
  font-size: 9px;
  font-weight: 400;
  color: var(--text-color-primary);
  opacity: 0.7;
  pointer-events: none;
  z-index: 3;
  top: ${({ $yPosition, $isDescending }) => {
    const isDesc = $isDescending ?? false;
    const percent = getPositionPercent($yPosition, isDesc);
    const offset = getTrackStart(isDesc);
    return `calc(${getTrackHeight()} * ${percent} + ${offset + BLOCK_HEIGHT / 2 + 8}px)`;
  }};
`;

// =============================================================================
// EMPTY STATE & PLACEHOLDERS
// =============================================================================

export const EmptyPlaceholder = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(104, 107, 130, 0.5);
  font-size: 12px;
`;

export const CenteredContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// =============================================================================
// WARNING ALERT
// =============================================================================

export const WarningAlert = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  margin: 8px;
  border: 2px dashed var(--border-color-options-row-underscored);
  border-radius: 8px;
  background-color: rgba(133, 91, 251, 0.1);
  text-align: center;
`;

export const WarningIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`;

export const WarningText = styled.div`
  font-size: 11px;
  color: var(--accent-color-purple);
  font-weight: 500;
`;

export const WarningSubtext = styled.div`
  font-size: 9px;
  color: rgba(133, 91, 251, 0.6);
  margin-top: 4px;
`;
