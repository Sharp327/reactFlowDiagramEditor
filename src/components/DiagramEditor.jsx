import React, { useMemo } from 'react';
import ReactFlow from 'reactflow';
import useDiagram from '../hooks/useDiagram';
import 'reactflow/dist/style.css';
import Node from './Node';
import JumperComponent from './JumperComponent';
import detectIntersections from '../utils/detectIntersections';
import CustomEdge from './CustomEdge';

const DiagramEditor = () => {
  const { nodes, edges, addNode, addEdge } = useDiagram();
  const intersections = detectIntersections(edges, nodes);
  const edgeTypes = { custom: CustomEdge };

  const nodeTypes = useMemo(() => ({
    custom: Node,
  }), []);

  const onConnect = (params) => {
    addEdge(params.source, params.target);
  };

  const handleAddNode = () => {
    addNode(`Node ${nodes.length + 1}`);
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <button onClick={handleAddNode}>Add Node</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      />
      {intersections.map((jumper, index) => (
        <JumperComponent key={index} x={jumper.x} y={jumper.y} />
      ))}
    </div>
  );
};

export default DiagramEditor;
