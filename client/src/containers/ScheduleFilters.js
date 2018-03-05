import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import { scheduleActions } from '../modules/schedule';

import {
  Button,
  Col,
  ControlLabel,
  FormControl,
  FormGroup
} from 'react-bootstrap';

import { DateTimePicker } from 'react-widgets';

class ScheduleFilters extends Component {
  constructor(props) { 
    super(props);
    this.state = {
      window_start: new Date(),
      window_end: null,
      preferred_duration: {
        type: 'hours',
        quantity: 0
      }
    };
  }

  handleDateChange = name => value => {
    this.setState({ [name]: value })
  }

  handleDurationChange = name => event => {
    const preferred_duration = {
      ...this.state.preferred_duration,
      [name]: event.target.value
    };

    this.setState({ preferred_duration });
  }

  handleSubmit = () => {
    const { window_start, window_end, ...others } = this.state;
    this.props.submitFilters({
      ...others,
      window_start: moment(window_start).format('YYYY-MM-DD'),
      window_end: moment(window_end).format('YYYY-MM-DD')
    });
  }

  render() {
    const { window_start, window_end, preferred_duration: { quantity, type } } = this.state;
    return (
      <div className="form-inline">
        <FormGroup controlId="windowStart">
          <Col componentClass={ControlLabel} sm={2}>Start Availability</Col>
          <Col sm={10}>
            <DateTimePicker
              time={false}
              min={new Date()}
              format="YYYY-MM-DD"
              onChange={this.handleDateChange('window_start')}
              value={window_start}
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="windowEnd">
          <Col componentClass={ControlLabel} sm={2}>End Availability</Col>
          <Col sm={10}>
            <DateTimePicker
              time={false}
              min={window_start}
              format="YYYY-MM-DD"
              onChange={this.handleDateChange('window_end')}
              value={window_end}
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="quantity">
          <Col componentClass={ControlLabel} sm={2}>Quantity</Col>
          <Col sm={10}>
            <FormControl placeholder="Quantity" onChange={this.handleDurationChange('quantity')} value={quantity} />
          </Col>
        </FormGroup>
        <FormGroup controlId="type">
          <Col componentClass={ControlLabel} sm={2}>Type</Col>
          <Col sm={10}>
            <FormControl placeholder="Type" onChange={this.handleDurationChange('type')} value={type} />
          </Col>
        </FormGroup>
        <FormGroup controlId="type">
          <Button onClick={this.handleSubmit}>GO</Button>
        </FormGroup>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  submitFilters: bindActionCreators(scheduleActions.fetchScheduleFilterResourceIds, dispatch)
});

export default connect(null, mapDispatchToProps)(ScheduleFilters);