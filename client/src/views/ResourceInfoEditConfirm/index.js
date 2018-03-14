import React, { Component } from 'react';

import { Row, FormControl, ControlLabel, Col, Button, ButtonGroup, Table, ButtonToolbar } from 'react-bootstrap';
import moment from 'moment';

class ResourceInfoEditConfirm extends Component {
  render() {
    const { resource, newEvents, existingEvents, onConfirm, onCancel } = this.props;
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
      <div className="container">
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

        {
          available && existingEvents.length ?
          <div>
            <h3>Existing Events</h3>
            <Table>
              <thead>
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  existingEvents.map((event, index) => (
                    <tr>
                      <td>{moment(event.block_start).format('dddd, MMMM Do YYYY, h:mm:ss a')}</td>
                      <td>{moment(event.block_end).format('dddd, MMMM Do YYYY, h:mm:ss a')}</td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </div> : null
        }

        {
          available && newEvents.length ?
          <div>
            <h3>Updated Availability</h3>
            <Table>
              <thead>
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  newEvents.map((event, index) => (
                    <tr>
                      <td>{moment(event.block_start).format('dddd, MMMM Do YYYY, h:mm:ss a')}</td>
                      <td>{moment(event.block_end).format('dddd, MMMM Do YYYY, h:mm:ss a')}</td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </div> : null
        }

        <ButtonToolbar className="center">
          <Button onClick={onCancel}>Cancel</Button>
          <Button bsStyle="primary" onClick={onConfirm}>Confirm</Button>
        </ButtonToolbar>
      </div>
    );
  }
}

export default ResourceInfoEditConfirm;