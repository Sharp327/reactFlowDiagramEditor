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

// Helper function to detect if a line intersects a node bounding box
const doesLineIntersectNode = (node, lineStart, lineEnd) => {
  const nodeXMin = node.position.x - 100 / 2;
  const nodeXMax = node.position.x + 100 / 2;
  const nodeYMin = node.position.y - 36 / 2;
  const nodeYMax = node.position.y + 36 / 2;

  // Check if the line crosses the bounding box of the node
  const intersectsHorizontally =
    (lineStart.x >= nodeXMin && lineStart.x <= nodeXMax) ||
    (lineEnd.x >= nodeXMin && lineEnd.x <= nodeXMax);
  const intersectsVertically =
    (lineStart.y >= nodeYMin && lineStart.y <= nodeYMax) ||
    (lineEnd.y >= nodeYMin && lineEnd.y <= nodeYMax);

  return intersectsHorizontally && intersectsVertically;
};

// Add similar logs before generating the path
const getShorterSegmentedPath = (sourceX, sourceY, targetX, targetY) => {
  console.log('Path start:', { sourceX, sourceY, targetX, targetY }); // Debugging log
  
  const segmentLength = 50;
  
  let path = `M${sourceX},${sourceY}`;
  
  // Ensure vertical start for a cleaner path at the bottom edge of the node
  const verticalStartY = sourceY; // Start directly from the bottom border
  path += ` L${sourceX},${verticalStartY}`;
  
  let currentX = sourceX;
  let currentY = verticalStartY;
  
  while (Math.abs(currentX - targetX) > segmentLength || Math.abs(currentY - targetY) > segmentLength) {
    if (Math.abs(currentY - targetY) > segmentLength) {
        currentY += currentY < targetY ? segmentLength : -segmentLength;
      } else {
        currentX += currentX < targetX ? segmentLength : -segmentLength;
    }
  
    path += ` L${currentX},${currentY}`;
  }
  
  path += ` L${targetX},${targetY}`;
  return path;
};

// Functions to get start and end points of nodes
const getBottomCenter = (node) => ({
  x: node.position.x + 100 / 2,
  y: node.position.y + 36,
});

const getTopCenter = (node) => ({
  x: node.position.x + 100 / 2,
  y: node.position.y,
});

// Remove space from the output start
const getVerticalOutputStart = (node) => ({
  x: node.position.x + 100 / 2,
  y: node.position.y + 36, // Align with the bottom border
});

// Dijkstra's Algorithm to find the shortest path
const dijkstra = (nodes, edges, startId, endId) => {
  const distances = {};
  const previous = {};
  const queue = [];

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    queue.push(node.id);
  });

  distances[startId] = 0;

  while (queue.length > 0) {
    // Get the node with the smallest distance
    const currentId = queue.reduce((minNodeId, nodeId) => 
      distances[nodeId] < distances[minNodeId] ? nodeId : minNodeId
    );

    if (currentId === endId) {
      break; // We found the shortest path to the target node
    }

    queue.splice(queue.indexOf(currentId), 1); // Remove current node from the queue

    edges.forEach(edge => {
      if (edge.source === currentId || edge.target === currentId) {
        const neighborId = edge.source === currentId ? edge.target : edge.source;
        const newDistance = distances[currentId] + edge.data.weight; // Use edge weight

        if (newDistance < distances[neighborId]) {
          distances[neighborId] = newDistance;
          previous[neighborId] = currentId;
        }
      }
    });
  }

  // Reconstruct the shortest path
  const path = [];
  let currentNodeId = endId;

  while (currentNodeId !== null) {
    path.unshift(currentNodeId);
    currentNodeId = previous[currentNodeId];
  }

  return path.length > 1 ? path : []; // Return the path or an empty array if no path found
};
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
  
  const getAdjustedPathAroundNode = (sourceX, sourceY, targetX, targetY, node) => {
    const nodeXMin = node.position.x - 100 / 2;
    const nodeXMax = node.position.x + 100 / 2;
    const nodeYMin = node.position.y - 36 / 2;
    const nodeYMax = node.position.y + 36 / 2;
  
    // Control point offset for smoothness
    const controlOffset = 50; // Change this value to adjust the curve's depth
    const offset = { x: controlOffset, y: 0 }; // Offset for the control points
  
    // Determine where to offset the path based on the node's position
    if (sourceY < nodeYMin) {
      // Source is above the node
      return createSmoothstepCurve({ x: sourceX, y: sourceY }, { x: targetX, y: targetY }, offset);
    } else if (sourceY > nodeYMax) {
      // Source is below the node
      return createSmoothstepCurve({ x: sourceX, y: sourceY }, { x: targetX, y: targetY }, offset);
    } else if (sourceX < nodeXMin) {
      // Source is left of the node
      return createSmoothstepCurve({ x: sourceX, y: sourceY }, { x: targetX, y: targetY }, offset);
    } else if (sourceX > nodeXMax) {
      // Source is right of the node
      return createSmoothstepCurve({ x: sourceX, y: sourceY }, { x: targetX, y: targetY }, offset);
    } else {
      // Default straight line if no intersection
      return `M${sourceX},${sourceY} L${targetX},${targetY}`;
    }
  };
  
  // Optimize paths and find intersections
  const optimizePaths = (nodes, edges) => {
    const updatedEdges = edges.map(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
  
      if (!sourceNode || !targetNode) return edge;
  
      const sourcePoint = getVerticalOutputStart(sourceNode);
      const targetPoint = getTopCenter(targetNode);
  
      const intersectingNode = nodes.find(node =>
        node.id !== sourceNode.id && node.id !== targetNode.id &&
        doesLineIntersectNode(node, sourcePoint, targetPoint)
      );
  
      let edgePath;
      if (intersectingNode) {
        edgePath = getAdjustedPathAroundNode(
          sourcePoint.x,
          sourcePoint.y,
          targetPoint.x,
          targetPoint.y,
          intersectingNode
        );
      } else {
        edgePath = createSmoothstepCurve(sourcePoint, targetPoint, { x: 50, y: 0 });
      }
  
      return {
        ...edge,
        path: edgePath,
      };
    });

  const intersections = [];
  for (let i = 0; i < updatedEdges.length; i++) {
    for (let j = i + 1; j < updatedEdges.length; j++) {
      const edge1 = updatedEdges[i];
      const edge2 = updatedEdges[j];

      const A = getVerticalOutputStart(nodes.find(n => n.id === edge1.source));
      const B = getTopCenter(nodes.find(n => n.id === edge1.target));
      const C = getVerticalOutputStart(nodes.find(n => n.id === edge2.source));
      const D = getTopCenter(nodes.find(n => n.id === edge2.target));

      if (checkLineIntersection(A, B, C, D)) {
        const intersectionPoint = getLineIntersectionPoint(A, B, C, D);
        intersections.push(intersectionPoint);
      }
    }
  }

  return { updatedEdges, intersections };
};
  
export default optimizePaths;
  
