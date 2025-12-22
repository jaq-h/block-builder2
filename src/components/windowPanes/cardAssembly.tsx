import styled from "styled-components";
import Block from "../blocks/block";
import vite from "../../assets/vite.svg";

const Container = styled.div`
  height: 100%;
  margin: auto;
  display: flex;
`;

const ColumnsWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`;

  display: flex;
  flex-direction: column;
`;

  $isOver: boolean;
}

const Row = styled.div<RowProps>`
  flex: 1;
  display: flex;
  align-items: center;
  min-height: 144px;
  gap: 8px;
  overflow: auto;
  transition:
`;

interface BlockData {
  id: string;
}

// Grid structure: [column][row] = blocks
type GridData = BlockData[][][];


const Assembly: React.FC = () => {
<<<<<<< HEAD
<<<<<<< Updated upstream
  // 2 columns x 3 rows grid
  const [grid, setGrid] = useState<GridData>([
    [
      [], // Row 1
      [], // Row 2
    ],
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

<<<<<<< HEAD
<<<<<<< Updated upstream
    if (targetCol !== null && targetRow !== null) {
      // Find source cell and block
      let sourceCol: number | null = null;
      let sourceRow: number | null = null;
      let blockData: BlockData | null = null;

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
<<<<<<< HEAD
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
            ))}
    </Container>
  );
};

export default Assembly;
