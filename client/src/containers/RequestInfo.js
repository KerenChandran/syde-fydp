import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { requestActions, requestSelectors } from '../modules/request';
import { resourceSelectors, resourceActions } from '../modules/resources';
import { scheduleSelectors, scheduleActions } from '../modules/schedule';
import { userSelectors, userActions } from '../modules/users';

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

import AccountPill from '../components/Account';

class RequestInfo extends Component {
  state = {
    message: '',
    source_account: null,
    loading: true
  }

  componentDidMount() {
    const { fetchResource, fetchUser, match: { params } } = this.props;
    fetchResource(params.id).then(resource => (
      fetchUser(resource.ownerid)
    )).then(() => this.setState({ loading: false }));
  }

  componentWillUnmount() {
    const { clearIncentive, clearSchedule } = this.props;
    clearIncentive();
    clearSchedule();
  }

  handleSubmit = () => {
    const { currentUser, resource, incentive, newRequestedEvents, submitRequest } = this.props;
    const { source_account, message } = this.state;
    
    const { new_incentive, ...others } = incentive;
    const incentive_data = new_incentive ? { new_incentive, ...others } : { new_incentive, incentive_id: resource.incentive_id };

    submitRequest({
      resource_id: resource.resource_id,
      user_id: currentUser.id,
      requested_blocks: newRequestedEvents,
      incentive_data,
      source_account,
      message
    });
  }

  handleChange = name => event => (
    this.setState({ [name]: event.target.value})
  );

  handleRadioChange = name => event => (
    this.setState({ [name]: event })
  );

  handleAccountSelect = id => () => (
    this.setState({ source_account: id })
  );

  render() {
    const { accounts, resource, match: { params }, newRequestedEvents, owner } = this.props;
    const { message, source_account } = this.state;

    if (!resource || !owner || this.state.loading) {
      return null;
    }

    return (
      <div className="container form-horizontal">
        <h3>Resource Info</h3>
        <Row>
          <Col componentClass={ControlLabel} sm={2}>Category</Col>
          <Col sm={10}><FormControl.Static>{resource.category}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Model</Col>
          <Col sm={10}><FormControl.Static>{resource.model}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Description</Col>
          <Col sm={10}><FormControl.Static>{resource.description}</FormControl.Static></Col>
        </Row>
    
        <Row>
          <Col componentClass={ControlLabel} sm={2}>Manufacturer</Col>
          <Col sm={10}><FormControl.Static>{resource.company}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Mobile</Col>
          <Col sm={10}><FormControl.Static>{resource.mobile ? 'Yes' : 'No'}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Location</Col>
          <Col sm={10}><FormControl.Static>{resource.location.name}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Room Number</Col>
          <Col sm={10}><FormControl.Static>{resource.room_number}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Rules for Use</Col>
          <Col sm={10}><FormControl.Static>{resource.rules_restrictions}</FormControl.Static></Col>
        </Row>

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
              newRequestedEvents.map((event, index) => (
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
          <Col sm={10}><FormControl.Static>${resource.fee_amount} / {resource.fee_cadence}</FormControl.Static></Col>
        </Row>

        <Row>
          <Col componentClass={ControlLabel} sm={2}>Total</Col>
          <Col sm={10}><FormControl.Static>$123</FormControl.Static></Col>
        </Row>

        <h3>Choose account</h3>
        <div style={{ display: 'flex' }}>
          {
            accounts.map(account => (
              <AccountPill
                {...account}
                key={account.id}
                onClick={this.handleAccountSelect}
                active={source_account === account.id}
              />
            ))
          }
        </div>

        <FormGroup controlId="formMessage" className="top-spacing">
          <Col sm={12}>
            <FormControl
              componentClass="textarea"
              value={message}
              placeholder="Message to owner"
              onChange={this.handleChange('message')}
            />
          </Col>
        </FormGroup>
        <Button bsClass="col-sm-12 btn" bsStyle="primary" disabled={source_account == null} onClick={this.handleSubmit}>Submit</Button>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  currentUser: userSelectors.currentUser(state),
  incentive: requestSelectors.getRequestIncentive(state),
  newRequestedEvents: scheduleSelectors.getNewRequestedEvents(state),
  resource: resourceSelectors.getResource(state, props.match.params.id),
  owner: userSelectors.getOwnerByResource(state, props.match.params.id),
  accounts: userSelectors.currentUserAccounts(state)
});

const mapDispatchToProps = dispatch => ({
  clearIncentive: bindActionCreators(requestActions.clearIncentive, dispatch),
  fetchResource: bindActionCreators(resourceActions.fetchResource, dispatch),
  submitRequest: bindActionCreators(requestActions.submitRequest, dispatch),
  clearSchedule: bindActionCreators(scheduleActions.clearSchedule, dispatch),
  fetchUser: bindActionCreators(userActions.fetchUser, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestInfo)