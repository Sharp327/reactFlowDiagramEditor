import React from 'react';

const IntersectionNode = ({ data }) => {
    return (
        <div
            style={{
                width: 5,
                height: 5,
                marginTop: -2.5,
                marginLeft: -2.5,
                backgroundColor: 'red',
                borderRadius: '50%',
                border: "1px solid red",
            }}
        ></div>
    );
};
  

export default IntersectionNode;
