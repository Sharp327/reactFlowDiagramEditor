import React from 'react';

// Create a functional component for the jumper point
const JumperComponent = ({ x, y }) => (
  <svg style={{ position: 'absolute', pointerEvents: 'none', overflow: 'visible' }}>
    <circle cx={x} cy={y} r={5} fill="blue" />
  </svg>
);

export default JumperComponent;
