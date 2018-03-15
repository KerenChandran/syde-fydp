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

import RequestInfo from '../views/RequestInfo';
import MyRequestInfo from '../views/MyRequestInfo';

class RequestReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }
  
  componentDidMount() {
    const { fetchResource, fetchRequestTotal, fetchUser, request } = this.props;
    
    if (request != null) {
      const promises = [
        fetchResource(request.resource_id),
        fetchUser(request.ownerid),
        fetchRequestTotal(request.fee_amount, request.fee_cadence, request.block_list)
      ];

      if (request.requester_id != null) {
        promises.push(fetchUser(request.requester_id));
      }

      Promise.all(promises).then(() => 
        this.setState({ loading: false })
      );
    }
  }

  componentWillUnmount() {
    this.props.clearRequestTotal();
  }

  render() {
    const { accounts, request, owner, requester, fee_total, acceptRequest, rejectRequest } = this.props;
    if (this.state.loading) {
      return null;
    }

    if (requester != null) { //Your own resource
      return (
        <RequestInfo
          accounts={accounts}
          acceptRequest={acceptRequest}
          rejectRequest={rejectRequest}
          fee_total={fee_total}
          request={request}
          requester={requester}
        />
      );
    }

    return ( //Requesting someone else's resource
      <MyRequestInfo
        fee_total={fee_total}
        request={request}
        owner={owner}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  accounts: userSelectors.currentUserTargetAccounts(state),
  fee_total: requestSelectors.getRequestTotal(state),
  request: requestSelectors.getRequest(state, props.match.params.id),
  requester: userSelectors.getRequesterByRequest(state, props.match.params.id),
  owner: userSelectors.getOwnerByRequest(state, props.match.params.id)
});

const mapDispatchToProps = dispatch => ({
  acceptRequest: bindActionCreators(requestActions.acceptRequest, dispatch),
  rejectRequest: bindActionCreators(requestActions.rejectRequest, dispatch),
  fetchResource: bindActionCreators(resourceActions.fetchResource, dispatch),
  fetchRequestTotal: bindActionCreators(requestActions.fetchRequestTotal, dispatch),
  fetchUser: bindActionCreators(userActions.fetchUser, dispatch),
  clearRequestTotal: bindActionCreators(requestActions.clearRequestTotal, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestReview);