import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
  Button,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
} from 'react-bootstrap';

class ResourceSearchFilters extends Component {
  render() {
    const { handleChange, filters } = this.props;
    const { category, company, mobile, model, searchText } = filters;
    return (
      <Form horizontal>
        <FormGroup controlId="formKeyword">
          <Col componentClass={ControlLabel} sm={2}>Keyword</Col>
          <Col sm={10}>
            <FormControl type="text" placeholder="Enter Key Word" value={searchText} onChange={handleChange('searchText')} />
          </Col>
        </FormGroup>

        <FormGroup controlId="formCategory">
          <Col componentClass={ControlLabel} sm={2}>Category</Col>
          <Col sm={10}>
            <FormControl type="text" placeholder="Any" value={category} onChange={handleChange('category')} />
          </Col>
        </FormGroup>

        <FormGroup controlId="formModel">
          <Col componentClass={ControlLabel} sm={2}>Model</Col>
          <Col sm={10}>
            <FormControl type="text" placeholder="Any" value={model} onChange={handleChange('model')} />
          </Col>
        </FormGroup>

        <FormGroup controlId="formManufacturer">
          <Col componentClass={ControlLabel} sm={2}>Manufacturer</Col>
          <Col sm={10}>
            <FormControl type="text" placeholder="Any" value={company} onChange={handleChange('company')}/>
          </Col>
        </FormGroup>

        <FormGroup controlId="formMobility">
          <Col componentClass={ControlLabel} sm={2}>Mobility</Col>
          <Col sm={10}>
            <FormControl componentClass="select" value={mobile} onChange={handleChange('mobile')}>
              <option value={''}>Any</option>
              <option value={true}>True</option>
              <option value={false}>False</option>
            </FormControl>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

ResourceSearchFilters.propTypes = {
  handleChange: PropTypes.func,
  filters: PropTypes.object
}

ResourceSearchFilters.defaultProps = {
  filters: {
    category: '',
    company: '',
    mobile: '',
    model: '',
    searchText: ''
  },
  handleChange: () => {}
}

export default ResourceSearchFilters;