import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

import { resourceActions } from '../modules/resources'; 

import { DateTimePicker } from 'react-widgets';
import {
  Button,
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Modal
} from 'react-bootstrap';

moment.locale('en');
momentLocalizer();


class ResourceAvailability extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource_id: props.match.params.id,
      start: new Date(),
      end: null
    };
  }
  
  handleUpdateDateEvent = name => value => {
    this.setState({ [name]: value })
  }

  handleSubmit = () => {
    const { resource_id, start, end } = this.state;
    this.props.initialAvailability({
      resource_id,
      start: moment(start).format('YYYY-MM-DD'),
      end: moment(end).format('YYYY-MM-DD'),
    });
  }

  render() {
    const { start, end } = this.state;
    return (
      <div className="form-horizontal">
        <button onClick={this.handleSubmit}>Submit</button>
        <FormGroup controlId="formStart">
          <Col componentClass={ControlLabel} sm={2}>Start</Col>
          <Col sm={10}>
            <DateTimePicker
              min={new Date()}
              format='MMMM DD, YYYY'
              time={false}
              onChange={this.handleUpdateDateEvent('start')}
              value={start}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formEnd">
          <Col componentClass={ControlLabel} sm={2}>End</Col>
          <Col sm={10}>
            <DateTimePicker
              min={start}
              format='MMMM DD, YYYY'
              time={false}
              onChange={this.handleUpdateDateEvent('end')}
              value={end}
            />
          </Col>
        </FormGroup>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  initialAvailability: bindActionCreators(resourceActions.initialAvailability, dispatch)
})

export default withRouter(connect(null, mapDispatchToProps)(ResourceAvailability));