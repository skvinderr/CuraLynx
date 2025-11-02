import { useMemo, useState } from "react";
import { cn } from "../../../utils";

export type InteractiveGridPatternProps = {
  className?: string;
  squaresClassName?: string;
  width?: number;
  height?: number;
  squares?: [number, number];
};

/**
 * InteractiveGridPattern (React)
 * - Renders an SVG grid of squares.
 * - On hover, the hovered square fills softly.
 * - Tailwind classes drive the stroke/fill/transition styles.
 */
export default function InteractiveGridPattern({
  className,
  squaresClassName,
  width = 40,
  height = 40,
  squares = [24, 24],
}: InteractiveGridPatternProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const [horizontal, vertical] = squares;
  const totalSquares = horizontal * vertical;

  const gridWidth = useMemo(() => width * horizontal, [width, horizontal]);
  const gridHeight = useMemo(() => height * vertical, [height, vertical]);

  const getX = (index: number) => (index % horizontal) * width;
  const getY = (index: number) => Math.floor(index / horizontal) * height;

  return (
    <svg
      width={gridWidth}
      height={gridHeight}
      className={cn("absolute inset-0 h-full w-full border border-gray-400/30", className)}
      aria-hidden
   >
      {Array.from({ length: totalSquares }).map((_, index) => (
        <rect
          key={index}
          x={getX(index)}
          y={getY(index)}
          width={width}
          height={height}
          className={cn(
            "stroke-gray-400/30 transition-all duration-100 ease-in-out [&:not(:hover)]:duration-1000",
            hovered === index ? "fill-gray-300/30" : "fill-transparent",
            squaresClassName,
          )}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        />
      ))}
    </svg>
  );
}
