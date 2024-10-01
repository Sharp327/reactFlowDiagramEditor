const detectIntersections = (edges) => {
  const intersections = [];
  const points = {};

  edges.forEach(edge => {
    const { source, target } = edge;
    const sourceNode = document.getElementById(source);
    const targetNode = document.getElementById(target);
    
    if (sourceNode && targetNode) {
      const sourcePosition = sourceNode.getBoundingClientRect();
      const targetPosition = targetNode.getBoundingClientRect();

      // Calculate midpoint for each edge to detect intersections
      const midPoint = {
        x: (sourcePosition.x + targetPosition.x) / 2,
        y: (sourcePosition.y + targetPosition.y) / 2,
      };

      const key = `${midPoint.x},${midPoint.y}`;
      if (!points[key]) {
        points[key] = { x: midPoint.x, y: midPoint.y, count: 1 };
      } else {
        points[key].count += 1;
        if (points[key].count === 2) {
          intersections.push({ x: midPoint.x, y: midPoint.y });
        }
      }
    }
  });

  return intersections;
};

export default detectIntersections;
