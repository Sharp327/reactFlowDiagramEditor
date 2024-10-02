import {optimizePaths, getIntersection} from './optimizedPath';

const detectIntersections = (edges, nodes) => {
  const { updatedEdges, intersections } = optimizePaths(nodes, edges);

  return intersections; // Return unique intersection points
};

export default detectIntersections;
