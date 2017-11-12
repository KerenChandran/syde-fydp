import React from 'react';

const MyResources = ({ resources, onEditClick, onDeleteClick }) => (
  <div>
    <table>
      <tr>
        <th>Name</th>
        <th>Location</th>
        <th>Incentive</th>
        <th>Availability</th>
      </tr>
      { resources.map(resource => (
        <tr>
          <td>{resource["Model"]} {resource["Category"]}</td>
          <td>{resource["location"]}</td>
          <td>{resource["incentive"]}</td>
          <td>{resource["available"] ? 'Yes' : 'No'}</td>
          <td>
            <button>Edit</button>
            <button>Delete</button>
          </td>
        </tr>
      ))
      }
    </table>
  </div>
);

export default MyResources;