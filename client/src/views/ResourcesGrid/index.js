import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Grid, Col } from 'react-bootstrap';

import './index.css';

const BASE_URL = 'http://localhost:3000/api/download_file/image/';

class ResourcesGrid extends Component {
  handleClick = (id) => () => {
    this.props.showDetailsForm(id);
  }

  render() {
    const { resources, showDetailsForm } = this.props;

    return (
      <div className="resource-grid-parent">
        {
          resources.map(resource => {
            const src = resource.file_information && resource.file_information.resource && resource.file_information.resource[0].filename ? BASE_URL + resource.file_information.resource[0].filename : 'https://getuikit.com/v2/docs/images/placeholder_600x400.svg';

            return (
              <div className="resource-grid-child" key={resource.resource_id} onClick={this.handleClick(resource.resource_id)}>
                <img className={cx({ 'image-padding': src !== 'https://getuikit.com/v2/docs/images/placeholder_600x400.svg'})} width={200} height={200} alt="Image" src={src} />
                <h5 className="center">{resource.model}</h5>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default ResourcesGrid;