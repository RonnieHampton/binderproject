type ClampPositionProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  margin?: number;
};

export default function getClampedFixedPosition({
  x,
  y,
  width,
  height,
  margin = 8,
}: ClampPositionProps) {
  return {
    x: Math.max(margin, Math.min(x, window.innerWidth - width - margin)),
    y: Math.max(margin, Math.min(y, window.innerHeight - height - margin)),
  };
}
