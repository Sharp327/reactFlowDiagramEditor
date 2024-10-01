import React from 'react';
import { getBezierPath, getEdgeCenter, EdgeText } from 'reactflow';

// Define a custom edge component
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  // Define a custom path (e.g., bezier)
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* Render the custom edge path */}
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeText x={labelX} y={labelY} label="Custom Label" />
    </>
  );
};

export default CustomEdge;
