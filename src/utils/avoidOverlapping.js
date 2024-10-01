const preventOverlappingNodes = (nodes) => {
  const adjustedNodes = [...nodes];

  for (let i = 0; i < adjustedNodes.length; i++) {
    for (let j = i + 1; j < adjustedNodes.length; j++) {
      const nodeA = adjustedNodes[i];
      const nodeB = adjustedNodes[j];

      const distanceX = Math.abs(nodeA.position.x - nodeB.position.x);
      const distanceY = Math.abs(nodeA.position.y - nodeB.position.y);

      if (distanceX < 100 && distanceY < 50) {
        adjustedNodes[j].position = {
          x: nodeB.position.x + 100,
          y: nodeB.position.y + 50,
        };
      }
    }
  }

  return adjustedNodes;
};

// Use this function before setting nodes in useDiagram
setNodes(preventOverlappingNodes(nodes));
