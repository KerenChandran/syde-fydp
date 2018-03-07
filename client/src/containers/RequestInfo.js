import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { requestActions, requestSelectors } from '../modules/request';
import { resourceSelectors, resourceActions } from '../modules/resources';
import { scheduleSelectors } from '../modules/schedule';
import { userSelectors } from '../modules/users';

import {
  ButtonToolbar,
  ToggleButton,
  ToggleButtonGroup,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  Button
} from 'react-bootstrap';

class RequestInfo extends Component {
  state = {
    message: '',
    source_account: null
  }

  componentDidMount() {
    const { fetchResource, match: { params } } = this.props;
    fetchResource(params.id);
  }

  componentWillUnmount() {
    this.props.clearRequest();
  }

  handleSubmit = () => {
    const { currentUser, resource, request, requestedEvents, submitRequest } = this.props;
    const { source_account, message } = this.state;

    const { new_incentive, incentive_id, ...others } = request;
    const incentive_data = new_incentive ? {
      new_incentive,
      ...others
    } : {
      new_incentive,
      incentive_id
    };

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
    const { accounts } = this.props;
    const { message } = this.state;

    return (
      <div className="form-horizontal">
        Choose account
        <ButtonToolbar vertical>
          <ToggleButtonGroup type="radio" name="options" defaultValue={1} onChange={this.handleRadioChange('source_account')}>
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
        <Button bsStyle="primary" onClick={this.handleSubmit}>Submit</Button>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  currentUser: userSelectors.currentUser(state),
  request: requestSelectors.getRequest(state),
  requestedEvents: scheduleSelectors.getRequestedEvents(state),
  resource: resourceSelectors.getResource(state, props.match.params.id),
  accounts: userSelectors.currentUserAccounts(state)
});

const mapDispatchToProps = dispatch => ({
  clearRequest: bindActionCreators(requestActions.clearRequest, dispatch),
  fetchResource: bindActionCreators(resourceActions.fetchResource, dispatch),
  submitRequest: bindActionCreators(requestActions.submitRequest, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestInfo)