import React, { Component } from 'react';

import { Row, FormControl, ControlLabel, Col, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';

class ResourceInfoView extends Component {
  render() {
    const { currentUser, isMyResource, resource, owner, onDeleteClick, onEditClick, onRequestClick } = this.props;
    const {
      category,
      company,
      faculty,
      location,
      model,
      mobile,
      available,
      description,
      rules_restrictions,
      application,
      incentive_type,
      fee_amount,
      fee_cadence,
      ownerid,
      room_number
    } = resource;

    const incentive = incentive_type === 'user_fee' ? 'User Fee' : '';

    return (
      <div className="container form-horizontal">
        <h3>Resource Info</h3>
        <Row>
          <Col componentClass={ControlLabel} sm={2}>Category</Col>
          <Col sm={10}><FormControl.Static>{category}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Model</Col>
          <Col sm={10}><FormControl.Static>{model}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Description</Col>
          <Col sm={10}><FormControl.Static>{description}</FormControl.Static></Col>
        </Row>
    
        <Row>
          <Col componentClass={ControlLabel} sm={2}>Manufacturer</Col>
          <Col sm={10}><FormControl.Static>{company}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Mobile</Col>
          <Col sm={10}><FormControl.Static>{mobile ? 'Yes' : 'No'}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Location</Col>
          <Col sm={10}><FormControl.Static>{location.name}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Room Number</Col>
          <Col sm={10}><FormControl.Static>{room_number}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Rules for Use</Col>
          <Col sm={10}><FormControl.Static>{rules_restrictions}</FormControl.Static></Col>
        </Row>

        {/* <Row>
          <Col componentClass={ControlLabel} sm={2}>Application</Col>
          <Col sm={10}><FormControl.Static>{application}</FormControl.Static></Col>
        </Row> */}

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Available</Col>
          <Col sm={10}><FormControl.Static>{available ? 'Yes' : 'No'}</FormControl.Static></Col>
        </Row>

        {/* <Row>
          <Col componentClass={ControlLabel} sm={2}>Incentive</Col>
          <Col sm={10}><FormControl.Static>{incentive}</FormControl.Static></Col>
        </Row> */}

        {
          available && incentive_type === 'user_fee' && 
          <div>
            <Row>
              <Col componentClass={ControlLabel} sm={2}>Fee Amount</Col>
              <Col sm={10}><FormControl.Static>{fee_amount}</FormControl.Static></Col>
            </Row>
            <Row>
              <Col componentClass={ControlLabel} sm={2}>Fee Cadence</Col>
              <Col sm={10}><FormControl.Static>{fee_cadence}</FormControl.Static></Col>
            </Row>
          </div>
        }

        <h3>Owner Info</h3>
        <Row>
          <Col componentClass={ControlLabel} sm={2}>Name</Col>
          <Col sm={10}><FormControl.Static>{owner.first_name} {owner.last_name}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Deparment</Col>
          <Col sm={10}><FormControl.Static>{owner.department}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Faculty</Col>
          <Col sm={10}><FormControl.Static>{owner.faculty}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Role</Col>
          <Col sm={10}><FormControl.Static>{owner.role}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Phone</Col>
          <Col sm={10}><FormControl.Static>{owner.phone}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Email</Col>
          <Col sm={10}><FormControl.Static>{owner.email}</FormControl.Static></Col>
        </Row>

        { currentUser != null && (
          <ButtonToolbar className="right-align">
            {isMyResource && <Button onClick={onEditClick}>Edit Resource</Button>}
            {available ? <Button bsStyle="primary" onClick={onRequestClick}>{isMyResource ? "Update Availability" : "Request Resource"}</Button> : null}
          </ButtonToolbar>
        )}
      </div>
    );
  }
}

export default ResourceInfoView;