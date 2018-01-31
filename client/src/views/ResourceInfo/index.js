import React, { Component } from 'react';

import { Form, FormGroup, FormControl, ControlLabel, Col, Button, ButtonGroup } from 'react-bootstrap';

class ResourceInfoView extends Component {
  render() {
    const { currentUserId, resource, onDeleteClick, onEditClick } = this.props;
    const {
      category,
      company,
      faculty,
      location,
      model,
      mobile,
      available,
      description,
      rules,
      application,
      incentive,
      fine,
      ownerId
    } = resource;

    console.log('currentUserId', currentUserId);
    console.log('ownerId', ownerId);

    return (
      <div style={{ display: 'block', width: '100%'}}>
        <Form horizontal>
          { ownerId == currentUserId && (
            <FormGroup>
              <ButtonGroup>
                <Button bsStyle="danger" onClick={onDeleteClick}>Delete Resource</Button>
                <Button onClick={onEditClick}>Edit Resource</Button>
              </ButtonGroup>
            </FormGroup>
          )}
          <FormGroup controlId="formCategory">
            <Col componentClass={ControlLabel} sm={2}>Category</Col>
            <Col sm={10}><FormControl.Static>{category}</FormControl.Static></Col>
          </FormGroup>
      
          <FormGroup controlId="formCompany">
            <Col componentClass={ControlLabel} sm={2}>Company</Col>
            <Col sm={10}><FormControl.Static>{company}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formFaculty">
            <Col componentClass={ControlLabel} sm={2}>Faculty</Col>
            <Col sm={10}><FormControl.Static>{faculty}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formLocation">
            <Col componentClass={ControlLabel} sm={2}>Location</Col>
            <Col sm={10}><FormControl.Static>{location}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formModel">
            <Col componentClass={ControlLabel} sm={2}>Model</Col>
            <Col sm={10}><FormControl.Static>{model}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formMobile">
            <Col componentClass={ControlLabel} sm={2}>Mobile</Col>
            <Col sm={10}><FormControl.Static>{mobile ? 'Yes' : 'No'}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formAvailable">
            <Col componentClass={ControlLabel} sm={2}>Available</Col>
            <Col sm={10}><FormControl.Static>{available ? 'Yes' : 'No'}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formDescription">
            <Col componentClass={ControlLabel} sm={2}>Description</Col>
            <Col sm={10}><FormControl.Static>{description}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formRules">
            <Col componentClass={ControlLabel} sm={2}>Rules</Col>
            <Col sm={10}><FormControl.Static>{rules}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formApplication">
            <Col componentClass={ControlLabel} sm={2}>Application</Col>
            <Col sm={10}><FormControl.Static>{application}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formIncentive">
            <Col componentClass={ControlLabel} sm={2}>Incentive</Col>
            <Col sm={10}><FormControl.Static>{incentive}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formFees">
            <Col componentClass={ControlLabel} sm={2}>User Fee</Col>
            <Col sm={10}><FormControl.Static>{fine}</FormControl.Static></Col>
          </FormGroup>

        </Form>
      </div>
    );
  }
}

export default ResourceInfoView;