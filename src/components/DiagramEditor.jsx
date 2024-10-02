import React, { useMemo, useState, useEffect } from 'react';
import ReactFlow from 'reactflow';
import useDiagram from '../hooks/useDiagram';
import 'reactflow/dist/style.css';
import Node from './Node';
import JumperComponent from './JumperComponent';
import {optimizePaths} from '../utils/optimizedPath';
import CustomEdge from './CustomEdge';
import IntersectionNode from './IntersectionNode';
const edgeTypes = { custom: CustomEdge };
const nodeTypes = { custom: Node, intersection: IntersectionNode };

const DiagramEditor = () => {
  const { nodes, edges, addNode, addEdge } = useDiagram();
  // const intersections = detectIntersections(edges, nodes);

  const onConnect = (params) => {
    addEdge(params.source, params.target);
  };

  const handleAddNode = () => {
    addNode(`Node ${nodes.length + 1}`);
  };

  // Optimize paths before rendering

  console.log(nodes);
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <button onClick={handleAddNode}>Add Node</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}  // Use updated edges with optimized paths
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}  // Pass custom edge type
        onConnect={onConnect}
        fitView
      />
      {/* {intersections.map((jumper, index) => (
        <JumperComponent key={index} x={jumper.x} y={jumper.y} />
      ))} */}
    </div>
  );
};

export default DiagramEditor;
