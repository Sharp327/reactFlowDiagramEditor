const avoidOverlapping = (nodes) => {
    const adjustedNodes = [...nodes];
    const overlapThreshold = 20; // Minimum distance between nodes
  
    for (let i = 0; i < adjustedNodes.length; i++) {
      for (let j = i + 1; j < adjustedNodes.length; j++) {
        const nodeA = adjustedNodes[i];
        const nodeB = adjustedNodes[j];
  
        const distance = Math.sqrt(
          Math.pow(nodeA.position.x - nodeB.position.x, 2) +
          Math.pow(nodeA.position.y - nodeB.position.y, 2)
        );
  
        if (distance < overlapThreshold) {
          // Adjust nodeB position
          nodeB.position.x += overlapThreshold - distance;
          nodeB.position.y += overlapThreshold - distance; // or apply any logic you want to avoid overlap
        }
      }
    }
  
    return adjustedNodes;
  };
  
  export default avoidOverlapping;
  