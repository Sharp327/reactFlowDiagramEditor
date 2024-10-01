import { useEffect, useState } from 'react';
import dagre from 'dagre';
import debounce from 'lodash.debounce';

// Custom hook for managing the diagram's state
const useDiagram = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  // Function to auto-arrange nodes (with debounce)
  const arrangeNodesDebounced = debounce((nodes, edges, direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setGraph({
      rankdir: direction,  // Top-Bottom or Left-Right
      ranksep: 100,        // Space between rows/columns
      edgesep: 50,         // Space between edges
      nodesep: 100,        // Space between nodes
    });

    // Set nodes in the graph
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 172, height: 36 }); // Example dimensions
    });

    // Set edges in the graph
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target, { curve: 'step' });  // Set a default label for each edge
    });

    try {
      // Perform layout and update positions
      dagre.layout(dagreGraph);

      const arrangedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        if (!nodeWithPosition) {
          console.warn(`Node with id ${node.id} not found in Dagre graph.`);
          return node;
        }

        return {
          ...node,
          position: {
            x: nodeWithPosition.x - 172 / 2,
            y: nodeWithPosition.y - 36 / 2,
          },
        };
      });

      setNodes(arrangedNodes); // Update the state with arranged nodes
    } catch (error) {
      console.error('Error during layout:', error);
    }
  }, 300); // 300ms delay

  const handleAutoArrange = () => {
    if (nodes.length >= 10) {
      arrangeNodesDebounced(nodes, edges);
    }
  };
  
  // Function to add a new node
  const addNode = (label) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',  // Specify the node type
      data: { label },
      position: { x: 0, y: 0 },  // Temporary position until arranged
    };

    const newNodes = [...nodes, newNode];
    setNodes(newNodes); // Update state with new node
    arrangeNodesDebounced(newNodes, edges);  // Debounced auto-arrangement
  };

  // Function to add a new edge
  const addEdge = (source, target) => {
    // Check if an edge between these nodes already exists
    const existingEdge = edges.find(edge => edge.source === source && edge.target === target);
  
    if (!existingEdge) {
      // Generate a unique edge ID by appending a timestamp
      const newEdge = {
        id: `e${source}-${target}-${Date.now()}`, // Ensure uniqueness
        source,
        target,
        type: 'custom'
      };
  
      const newEdges = [...edges, newEdge];
      setEdges(newEdges); // Update state with the new edge
      handleAutoArrange();
      // arrangeNodesDebounced(nodes, newEdges); // Debounced auto-arrangement
    } else {
      console.warn(`Edge between ${source} and ${target} already exists.`);
    }
  };
  

  return {
    nodes,
    edges,
    addNode,
    addEdge,
  };
};

export default useDiagram;
