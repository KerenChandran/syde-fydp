import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Grid, Col } from 'react-bootstrap';

import './index.css';

const BASE_URL = 'http://localhost:3000/api/download_file/image/';

class ResourcesGrid extends Component {
  render() {
    const { resources } = this.props;

    return (
      <div className="resource-grid-parent">
        {
          resources.map(resource => {
            const src = resource.file_information && resource.file_information.resource && resource.file_information.resource[0].filename ? BASE_URL + resource.file_information.resource[0].filename : '';

            return (
              <div className="resource-grid-child" key={resource.resource_id}>
                <img alt="Image" src={src} />
                <h5>{resource.model}</h5>
                {resource.resource_id}
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default ResourcesGrid;