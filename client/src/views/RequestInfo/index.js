import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

import AccountPill from '../../components/Account';

class RequestInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      target_account: null,
      request_id: props.request.id,
      loading: true
    };
  }

  handleChange = (name) => (event) => (
    this.setState({ [name]: event.target.value })
  )

  handleAccountSelect = id => () => (
    this.setState({ target_account: id })
  )

  handleAccpet = () => {
    this.props.acceptRequest(this.state);
  }

  handleReject = () => {
    this.props.rejectRequest(this.state);
  }

  render() {
    const { message, target_account } = this.state;
    const { accounts, request, requester, fee_total } = this.props;
    return (
      <div className="container form-horizontal">
        <h3>Requester Info</h3>
        <Row>
          <Col componentClass={ControlLabel} xs={2}>Name</Col>
          <Col xs={10}><FormControl.Static>{request.requester_name}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} xs={2}>Deparment</Col>
          <Col xs={10}><FormControl.Static>{requester.department}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} xs={2}>Faculty</Col>
          <Col xs={10}><FormControl.Static>{requester.faculty}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} xs={2}>Phone</Col>
          <Col xs={10}><FormControl.Static>{requester.phone}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Email</Col>
          <Col xs={10}><FormControl.Static>{requester.email}</FormControl.Static></Col>
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

        <h3>Choose account</h3>
        <div style={{ display: 'flex' }}>
          {
            accounts.map(account => (
              <AccountPill
                {...account}
                key={account.id}
                onClick={this.handleAccountSelect}
                active={target_account === account.id}
              />
            ))
          }
        </div>

        {
          request.requester_message != null || request.requester_message != '' ? 
          <Row>
            <Col componentClass={ControlLabel} sm={2}>Message</Col>
            <Col xs={10}><FormControl.Static>{request.requester_message}</FormControl.Static></Col>
          </Row> : null
        }

        <FormGroup controlId="formMessage" className="top-spacing">
          <Col sm={12}>
            <FormControl
              componentClass="textarea"
              value={message}
              placeholder="Message to borrower"
              onChange={this.handleChange('message')}
            />
          </Col>
        </FormGroup>

        <ButtonToolbar className="pull-right">
          <Button bsStyle="primary" onClick={this.handleAccpet}>Accept</Button>
          <Button onClick={this.handleReject}>Reject</Button>
        </ButtonToolbar>
      </div>
    );
  }
}

export default RequestInfo;