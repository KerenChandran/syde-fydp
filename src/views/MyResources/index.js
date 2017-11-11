import React from 'react';

const MyResources = ({ resources }) => (
  <div>
    My resources
    <div>Name: {resources[0].Category}</div>
  </div>
);

export default MyResources;