import { useEffect, useState } from 'react';
import dagre from 'dagre';
import debounce from 'lodash.debounce';
import detectIntersections from '../utils/detectIntersections';

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
      dagreGraph.setNode(node.id, { width: 100, height: 36 }); // Example dimensions
    });

    // Set edges in the graph
    edges.forEach((edge) => {
      const sourceExists = nodes.find(node => node.id === edge.source);
      const targetExists = nodes.find(node => node.id === edge.target);

      if (sourceExists && targetExists) {
        dagreGraph.setEdge(edge.source, edge.target, {
          label: '',
          width: 1,
          height: 1,
        });
      } else {
        console.warn(`Edge with invalid source or target: ${edge.id}`);
      }
    });

    try {
      // Perform layout and update positions
      dagre.layout(dagreGraph);

      const arrangedNodes = nodes.filter((val)=>val.type == 'custom').map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        if (!nodeWithPosition) {
          console.warn(`Node with id ${node.id} not found in Dagre graph.`);
          return node;
        }

        return {
          ...node,
          position: {
            x: nodeWithPosition.x - 100 / 2,
            y: nodeWithPosition.y - 36 / 2,
          },
        };
      });
      const intersections = detectIntersections(edges, arrangedNodes);

      setNodes([...arrangedNodes, ...intersections]); // Update the state with arranged nodes
    } catch (error) {
      console.error('Error during layout:', error);
    }
  }, 300); // 300ms delay

  // Function to add a new node
  const addNode = (label) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',  // Specify the node type
      data: { label },
      position: { x: 0, y: 0 },  // Temporary position until arranged
    };

    const newNodes = [...nodes.filter((val)=>val.type == 'custom'), newNode];
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
        type: 'smoothstep'
      };

      const newEdges = [...edges, newEdge];
      setEdges(newEdges); // Update state with the new edge
      const intersections = detectIntersections(newEdges, nodes.filter((val)=>val.type == 'custom'));

      setNodes([...nodes.filter((val)=>val.type == 'custom'), ...intersections]); 
      arrangeNodesDebounced(nodes.filter((val)=>val.type == 'custom'), newEdges);

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
