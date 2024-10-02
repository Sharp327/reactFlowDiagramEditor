import { getSmoothStepPath } from 'reactflow';
import intersect from 'svg-path-intersections';

// Helper to create an SVG path element
const createSVGPathElement = (pathString) => {
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const pathElement = document.createElementNS(svgNamespace, 'path');
  pathElement.setAttribute('d', pathString);  // Set the path data
  return pathElement;
};

function getIntersection(path1, path2) {
  const path1Length = path1.getTotalLength();
  const path2Length = path2.getTotalLength();
  const path2Points = [];

  for (let j = 0; j < path2Length; j++) {
    path2Points.push(path2.getPointAtLength(j));
  }

  const found = [];
  for (let i = 0; i < path1Length; i++) {
    const point1 = path1.getPointAtLength(i);

    for (let j = 0; j < path2Points.length; j++) {
      if (pointIntersect(point1, path2Points[j])) {
        found.push(path2Points[j]);
      }
    }
  }
  return found;
}

function pointIntersect(p1, p2) {
  p1.x = Math.round(p1.x);
  p1.y = Math.round(p1.y);
  p2.x = Math.round(p2.x);
  p2.y = Math.round(p2.y);
  return p1.x === p2.x && p1.y === p2.y;
}
// Function to detect intersections between smoothstep edges
const detectIntersections = (edges, nodes) => {
  const intersections = [];

  edges.forEach((edge1, index1) => {
    const sourceNode1 = nodes.find(n => n.id === edge1.source);
    const targetNode1 = nodes.find(n => n.id === edge1.target);

    if (sourceNode1 && targetNode1) {
      // Generate the path for the first smoothstep edge
      const [edgePath1] = getSmoothStepPath({
        sourceX: sourceNode1.position.x,
        sourceY: sourceNode1.position.y,
        targetX: targetNode1.position.x,
        targetY: targetNode1.position.y,
        borderRadius: 50,
      });

      // Create an actual SVG path element from the path string
      const pathElement1 = createSVGPathElement(edgePath1);

      // Check against all other edges to find intersections
      edges.forEach((edge2, index2) => {
        if (index1 !== index2) {  // Avoid comparing the edge with itself
          const sourceNode2 = nodes.find(n => n.id === edge2.source);
          const targetNode2 = nodes.find(n => n.id === edge2.target);

          if (sourceNode2 && targetNode2) {
            // Generate the path for the second smoothstep edge
            const [edgePath2] = getSmoothStepPath({
              sourceX: sourceNode2.position.x,
              sourceY: sourceNode2.position.y,
              targetX: targetNode2.position.x,
              targetY: targetNode2.position.y,
              borderRadius: 50,
            });

            // Create another SVG path element from the path string
            const pathElement2 = createSVGPathElement(edgePath2);
            const intersectionPoints = getIntersection(pathElement1, pathElement2);
            // Use the `intersect` function to find intersection points between the paths
            // const intersectionPoints = intersect.findPathIntersections(pathElement1.getAttribute('d'), pathElement2.getAttribute('d'));

            if (intersectionPoints.length > 0) {
              intersections.push(intersectionPoints[0]);
            }
          }
        }
      });
    }
  });

    const uniqueIntersections = intersections
      .map((point) => ({
        id: `intersection-${JSON.stringify([point.x, point.y])}`, // Generate unique ID based on coordinates
        type: 'intersection',
        position: {x: point.x + 45, y: point.y},
        data: {},
      }))
      .filter((node, index, self) => 
        index === self.findIndex((n) => n.id === node.id) // Keep the first occurrence of each ID
      );

  return uniqueIntersections; // Return unique intersection points
};

export default detectIntersections;
