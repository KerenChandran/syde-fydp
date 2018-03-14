import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { resourceActions } from '../modules/resources';
import { userActions, userSelectors } from '../modules/users';
import { requestSelectors } from '../modules/request';

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
import { requestActions } from '../modules/request';

class RequestReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      target_account: null,
      request_id: props.match.params.id,
      loading: true
    };
  }
  
  componentDidMount() {
    const { fetchResource, fetchUser, request } = this.props;
    
    if (request != null) {
      fetchResource(request.resource_id).then(resource => 
        fetchUser(request.requester_id)
      ).then(
        fetchUser(request.ownerid)
      ).then(() => 
        this.setState({ loading: false })
      );
    }
  }

  handleChange = (name) => (event) => (
    this.setState({ [name]: event.target.value })
  )

  handleRadioChange = name => event => (
    this.setState({ [name]: event })
  )

  handleAccpet = () => {
    this.props.acceptRequest(this.state);
  }

  handleReject = () => {
    this.props.rejectRequest(this.state);
  }

  render() {
    const { message, target_account } = this.state;
    const { accounts, request, requester } = this.props;
    return (
      <div className="container form-horizontal">
        <h4>{request.requester_name}</h4>
        <h5>{requester.department} - {requester.faculty}</h5>
        <Link to={`/resources/${request.resource_id}`}>{request.model}</Link>
        <h4>Requested Time</h4>
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
        <h4>Choose account</h4>
        <ButtonToolbar vertical>
          <ToggleButtonGroup type="radio" name="options" value={target_account} onChange={this.handleRadioChange('target_account')}>
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
        <Row>
          <Button bsClass="col-sm-6 btn" bsStyle="primary" onClick={this.handleAccpet}>Accept</Button>
          <Button bsClass="col-sm-6 btn" onClick={this.handleReject}>Reject</Button>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  accounts: userSelectors.currentUserAccounts(state),
  request: requestSelectors.getRequest(state, props.match.params.id),
  requester: userSelectors.getRequesterByRequest(state, props.match.params.id)
});

const mapDispatchToProps = dispatch => ({
  acceptRequest: bindActionCreators(requestActions.acceptRequest, dispatch),
  rejectRequest: bindActionCreators(requestActions.rejectRequest, dispatch),
  fetchResource: bindActionCreators(resourceActions.fetchResource, dispatch),
  fetchUser: bindActionCreators(userActions.fetchUser, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestReview);