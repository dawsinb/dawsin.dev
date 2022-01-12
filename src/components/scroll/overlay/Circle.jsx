function Circle({ size, strokeWidth }) {
  return (
    <svg
      viewBox={`
        ${-strokeWidth} 
        ${-strokeWidth} 
        ${size + strokeWidth * 2} 
        ${size + strokeWidth * 2}
      `}
    >
      <circle
        r={size / 2}
        cx={size / 2}
        cy={size / 2}
        strokeWidth={strokeWidth}
        stroke={'white'}
        fill={'white'}
        fillOpacity={0.1}
      />
    </svg>
  );
}

Circle.defaultProps = {
  size: 100,
  strokeWidth: 2
};

export default Circle;
