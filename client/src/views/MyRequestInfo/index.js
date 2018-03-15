import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';

import {
  ButtonToolbar,
  ToggleButton,
  ToggleButtonGroup,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  Button,
  Row,
  Table
} from 'react-bootstrap';

class MyRequestInfo extends Component {  
  handleBack = () => (
    this.props.history.goBack()
  )

  render() {
    const { request, owner, fee_total } = this.props;
    return (
      <div className="container form-horizontal">
        <h3>Owner Info</h3>
        <Row>
          <Col componentClass={ControlLabel} xs={2}>Name</Col>
          <Col xs={10}><FormControl.Static>{request.owner_name}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} xs={2}>Deparment</Col>
          <Col xs={10}><FormControl.Static>{owner.department}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} xs={2}>Faculty</Col>
          <Col xs={10}><FormControl.Static>{owner.faculty}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} xs={2}>Phone</Col>
          <Col xs={10}><FormControl.Static>{owner.phone}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Email</Col>
          <Col xs={10}><FormControl.Static>{owner.email}</FormControl.Static></Col>
        </Row>

        <h3>Resource Info</h3>
        <p>
          <Link to={`/resources/${request.resource_id}`}>
            Click here to view more details on {request.model}
          </Link>
        </p>

        <h3>Fee Breakdown</h3>
        <Table>
          <thead>
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {
              request.block_list.map((event, index) => (
                <tr>
                  <td>{moment(event.block_start).format('dddd, MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{moment(event.block_end).format('dddd, MMMM Do YYYY, h:mm:ss a')}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Fee</Col>
          <Col sm={10}><FormControl.Static>${request.fee_amount} / {request.fee_cadence}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Total</Col>
          <Col sm={10}><FormControl.Static>${fee_total}</FormControl.Static></Col>
        </Row>

        {
          request.submitted_message != null || request.submitted_message != '' ? 
          <Row>
            <Col componentClass={ControlLabel} sm={2}>Message</Col>
            <Col xs={10}><FormControl.Static>{request.submitted_message}</FormControl.Static></Col>
          </Row> : null
        }

        <ButtonToolbar className="pull-right">
          <Button bsStyle="primary" onClick={this.handleBack}>Go Back</Button>
        </ButtonToolbar>
      </div>
    );
  }
}

export default withRouter(MyRequestInfo);