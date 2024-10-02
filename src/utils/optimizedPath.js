// Helper to calculate determinant (used for intersection detection)
const determinant = (a, b, c, d) => a * d - b * c;

const checkLineIntersection = (A, B, C, D) => {
  const detL1 = determinant(A.x - B.x, A.y - B.y, C.x - D.x, C.y - D.y);

  // Check if lines are parallel
  if (detL1 === 0) {
    return false; // Lines are parallel and don't intersect
  }

  const t = determinant(C.x - A.x, C.y - A.y, C.x - D.x, C.y - D.y) / detL1;
  const u = determinant(A.x - B.x, A.y - B.y, C.x - A.x, C.y - A.y) / detL1;

  // If t and u are between 0 and 1, the lines intersect
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
};

const getLineIntersectionPoint = (A, B, C, D) => {
  const detL1 = determinant(A.x - B.x, A.y - B.y, C.x - D.x, C.y - D.y);

  // If lines are parallel, return null
  if (detL1 === 0) return null;

  const t = determinant(C.x - A.x, C.y - A.y, C.x - D.x, C.y - D.y) / detL1;
  const intersectionX = A.x + t * (B.x - A.x);
  const intersectionY = A.y + t * (B.y - A.y);

  return { x: intersectionX, y: intersectionY };
};

const getTopCenter = (node) => ({
  x: node.position.x + 51,
  y: node.position.y,
});

// Remove space from the output start
const getBottomCenter = (node) => ({
  x: node.position.x + 51,
  y: node.position.y + 36, // Align with the bottom border
});

const createSmoothstepCurve = (start, end, offset) => {
    const controlPoint1 = {
      x: start.x + offset.x,
      y: start.y,
    };
    const controlPoint2 = {
      x: end.x - offset.x,
      y: end.y,
    };
    
    return `M${start.x},${start.y} C${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${end.x},${end.y}`;
};
  
const getIntersection = (edge1, edge2, nodes) => {
  // Get the start and end points of the two edges
  const A = getBottomCenter(nodes.find(n => n.id === edge1.source));
  const B = getTopCenter(nodes.find(n => n.id === edge1.target));
  const C = getBottomCenter(nodes.find(n => n.id === edge2.source));
  const D = getTopCenter(nodes.find(n => n.id === edge2.target));

  // Check if the edges intersect
  if (checkLineIntersection(A, B, C, D)) {
    // Get the intersection point if the lines intersect
    return getLineIntersectionPoint(A, B, C, D);
  }

  return null; // Return null if no intersection is found
};

// Function to create a stepping (orthogonal) path
const createSteppingLine = (start, end, offset = 50) => {
  const midX = (start.x + end.x) / 2; // Midpoint X between start and end
  const midY = (start.y + end.y) / 2; // Midpoint Y between start and end
  
  return `M${start.x},${start.y} ` +  // Start point
         `L${start.x},${midY} ` +     // Horizontal line from start to midpoint x
         `L${end.x},${midY} ` +       // Vertical line down/up to target's y level
         `L${end.x},${end.y}`;        // Horizontal line to target point
};

const createSteppedPathAroundMultipleNodes = (start, end, nodes) => {
  // Find all nodes that the line might intersect
  const nodesToAvoid = nodes.filter(node => (
    (start.x < node.position.x + node.width && start.x > node.position.x) ||
    (end.x < node.position.x + node.width && end.x > node.position.x)
  ));

  // If there are no nodes to avoid, create a direct path
  if (nodesToAvoid.length === 0) {
    return `M${start.x},${start.y} L${end.x},${end.y}`;
  }

  // Sort nodes to avoid by their x positions
  const sortedNodes = nodesToAvoid.sort((a, b) => a.position.x - b.position.x);

  let path = `M${start.x},${start.y} `; // Start the path from the source

  // Create the stepping path around each node
  for (let i = 0; i < sortedNodes.length; i++) {
    const node = sortedNodes[i];
    const leftSide = {
      x: node.position.x - OFFSET,
      y: start.y
    };
    const rightSide = {
      x: node.position.x + node.width + OFFSET,
      y: start.y
    };

    // Decide which side to go based on the relative position of the start and end
    const midpointX = (start.x + end.x) / 2;

    if (midpointX < node.position.x) {
      // Go left if the midpoint is to the left of the node
      path += `L${leftSide.x},${start.y} `;
    } else {
      // Go right if the midpoint is to the right of the node
      path += `L${rightSide.x},${start.y} `;
    }

    // Move down to a vertical position below the node
    path += `L${leftSide.x},${node.position.y + node.height + OFFSET} `;
    
    // Update the starting point for the next segment
    start.y = node.position.y + node.height + OFFSET; // Set new start point to be below this node
  }

  // Finally, connect to the end point
  path += `L${end.x},${start.y} `; // Go horizontally to the target
  path += `L${end.x},${end.y}`;     // Finally, connect to the bottom center of the target node

  return path;
};


// Optimize paths and find intersections
const optimizePaths = (nodes, edges) => {
  const updatedEdges = edges.map(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return edge;

    const sourcePoint = getBottomCenter(sourceNode);
    const targetPoint = getTopCenter(targetNode);

    let edgePath;
    edgePath = createSteppedPathAroundMultipleNodes(sourcePoint, targetPoint, nodes);
    // edgePath = createSmoothstepCurve(sourcePoint, targetPoint, { x: 50, y: 0 });

    return {
      ...edge,
      data: {
        path: edgePath,
      }
    };
  });

  console.log(updatedEdges);

  const intersections = [];

  // updatedEdges.forEach((edge1, index1) => {
  //   updatedEdges.forEach((edge2, index2) => {
  //     if (index1 !== index2) {  // Avoid comparing the edge with itself
  //       const intersectionPoints = getIntersection(edge1, edge2, nodes);
  //       if (intersectionPoints) {
  //         intersections.push(intersectionPoints);
  //       }
  //     }
  //   });
  // });

  const uniqueIntersections = intersections
  .map((point) => ({
    id: `intersection-${JSON.stringify([point.x, point.y])}`, // Generate unique ID based on coordinates
    type: 'intersection',
    position: {x: point.x, y: point.y},
    data: {},
  }))
  .filter((node, index, self) => 
    index === self.findIndex((n) => n.id === node.id) // Keep the first occurrence of each ID
  );

  return { updatedEdges, intersections: uniqueIntersections };
};
  
export {optimizePaths, getIntersection};
  
