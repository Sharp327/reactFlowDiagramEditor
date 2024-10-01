import React from 'react';
import { Handle } from 'reactflow';
import './Node.css'; // You can create your own CSS file for custom styling

const Node = ({ data }) => {
  return (
    <div className="custom-node">
      <Handle
        type="target"
        position="top"
        style={{ borderRadius: '50%', background: '#555' }}
      />
      <div className="node-content">{data.label}</div>
      <Handle
        type="source"
        position="bottom"
        style={{ borderRadius: '50%', background: '#555' }}
      />
    </div>
  );
};

export default Node;
