// CustomEdge.js
import React from 'react';

const CustomEdge = (data) => {
  // Use the custom path stored in the edge data
console.log(data);
  return (
    <>
      <path
        id={data.id}
        style={{ stroke: '#00f', strokeWidth: 2 }}
        className="react-flow__edge-path"
        d={data.data?.path}
        markerEnd={data.markerEnd}
      />
    </>
  );
};

export default CustomEdge;
