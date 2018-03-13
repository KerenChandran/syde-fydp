import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { requestActions, requestSelectors } from '../modules/request';
import { resourceSelectors, resourceActions } from '../modules/resources';
import { scheduleSelectors, scheduleActions } from '../modules/schedule';
import { userSelectors } from '../modules/users';

import {
  ButtonToolbar,
  ToggleButton,
  ToggleButtonGroup,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  Button,
  Row
} from 'react-bootstrap';

class RequestInfo extends Component {
  state = {
    message: '',
    source_account: null
  }

  componentDidMount() {
    const { fetchResource, match: { params }, clearSchedule } = this.props;
    fetchResource(params.id);
    clearSchedule();
  }

  componentWillUnmount() {
    this.props.clearIncentive();
  }

  handleSubmit = () => {
    const { currentUser, resource, incentive, requestedEvents, submitRequest } = this.props;
    const { source_account, message } = this.state;
    
    const { new_incentive, ...others } = incentive;
    const incentive_data = new_incentive ? { new_incentive, ...others } : { new_incentive, incentive_id: resource.incentive_id };

    submitRequest({
      resource_id: resource.resource_id,
      user_id: currentUser.id,
      requested_blocks: requestedEvents,
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

  render() {
    const { accounts, resource } = this.props;
    const { message, source_account } = this.state;

    return (
      <div className="container form-horizontal">
        <h2 style={{ textAlign: 'center' }}>Final Review</h2>
        <Row>
          <Col componentClass={ControlLabel} sm={2}>Fee</Col>
          <Col sm={10}>${resource.fee_amount} / {resource.fee_cadence} </Col>
        </Row>
        <h4>Choose account</h4>
        <ButtonToolbar vertical>
          <ToggleButtonGroup type="radio" name="options" onChange={this.handleRadioChange('source_account')} value={source_account}>
            { accounts.map(account => (
              <ToggleButton key={account.id} value={account.id}>ID: {account.id} - {account.type}, ${account.balance}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </ButtonToolbar>
        <FormGroup controlId="formMessage">
          <Col componentClass={ControlLabel} sm={2}>Message</Col>
          <Col sm={10}>
            <FormControl
              componentClass="textarea"
              value={message}
              placeholder="Message"
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
  requestedEvents: scheduleSelectors.getRequestedEvents(state),
  resource: resourceSelectors.getResource(state, props.match.params.id),
  accounts: userSelectors.currentUserAccounts(state)
});

const mapDispatchToProps = dispatch => ({
  clearIncentive: bindActionCreators(requestActions.clearIncentive, dispatch),
  fetchResource: bindActionCreators(resourceActions.fetchResource, dispatch),
  submitRequest: bindActionCreators(requestActions.submitRequest, dispatch),
  clearSchedule: bindActionCreators(scheduleActions.clearSchedule, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestInfo)