const detectIntersections = (edges, nodes) => {
  const intersections = [];
  const points = {};

  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (sourceNode && targetNode) {
      // Use midpoint for potential jumper placement
      const midPoint = {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2,
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
