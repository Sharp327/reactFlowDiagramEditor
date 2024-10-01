import { useEffect, useState } from 'react';
import dagre from 'dagre';

// Initialize the Dagre graph for node arrangement
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Custom hook for managing the diagram's state
const useDiagram = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Function to auto-arrange nodes
  const autoArrangeNodes = (direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    // Add nodes to the Dagre graph
    nodes.forEach(node => {
      dagreGraph.setNode(node.id, { width: 100, height: 50 }); // Assuming a fixed size for nodes
    });

    // Add edges to the Dagre graph
    edges.forEach(edge => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    // Update node positions based on Dagre layout
    const arrangedNodes = nodes.map(node => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - 100 / 2, // Centering the node
          y: nodeWithPosition.y - 50 / 2,   // Centering the node
        },
      };
    });

    setNodes(arrangedNodes);
  };

  // Function to add a new node
  const addNode = (label) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom', // Specify the type of node
      data: { label },
      position: { x: Math.random() * 200, y: Math.random() * 200 },
    };
    setNodes((nds) => [...nds, newNode]);
    autoArrangeNodes(); // Automatically arrange nodes after adding a new node
  };

  // Function to add a new edge
  const addEdge = (source, target) => {
    const newEdge = {
      id: `e${source}-${target}`,
      source,
      target,
    };
    setEdges((eds) => [...eds, newEdge]);
  };

  // Effect to prevent overlapping nodes
  useEffect(() => {
    preventOverlappingNodes();
  }, [nodes]);

  // Function to prevent overlapping nodes
  const preventOverlappingNodes = () => {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (areNodesOverlapping(nodes[i], nodes[j])) {
          // Adjust the position of nodes[j]
          nodes[j].position.y += 60; // Move down to avoid overlap
        }
      }
    }
    setNodes([...nodes]); // Trigger a re-render
  };

  // Helper function to check if two nodes are overlapping
  const areNodesOverlapping = (node1, node2) => {
    const xOverlap = Math.abs(node1.position.x - node2.position.x) < 100; // Node width
    const yOverlap = Math.abs(node1.position.y - node2.position.y) < 50;   // Node height
    return xOverlap && yOverlap;
  };

  return {
    nodes,
    edges,
    addNode,
    addEdge,
  };
};

export default useDiagram;
