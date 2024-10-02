// CustomEdge.js
import React from 'react';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  data,
  markerEnd,
}) => {
  // Use the custom path stored in the edge data
  const edgePath = data?.customPath || `M${sourceX},${sourceY} L${targetX},${targetY}`;

  return (
    <>
      <path
        id={id}
        style={{ stroke: '#00f', strokeWidth: 2 }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
};

export default CustomEdge;
