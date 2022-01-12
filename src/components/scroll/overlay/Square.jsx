function Square({ size, strokeWidth }) {
  return (
    <svg
      viewBox={`
        ${-strokeWidth / 2} 
        ${-strokeWidth / 2} 
        ${size + strokeWidth} 
        ${size + strokeWidth}
      `}
    >
      <rect width={size} height={size} strokeWidth={strokeWidth} stroke={'white'} fill={'white'} fillOpacity={0.1} />
    </svg>
  );
}

Square.defaultProps = {
  size: 100,
  strokeWidth: 2
};

export default Square;
