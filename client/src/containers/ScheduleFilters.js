import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import { resourceActions } from '../modules/resources';

import {
  Button,
  ButtonGroup,
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
          <Col componentClass={ControlLabel} sm={4}>Available</Col>
          <Col sm={4}>
            <DateTimePicker
              time={false}
              min={new Date()}
              format="YYYY-MM-DD"
              onChange={this.handleDateChange('window_start')}
              value={window_start}
            />
          </Col>
          <Col sm={4}>
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
          <Col componentClass={ControlLabel} sm={4}>Duration</Col>
          <Col sm={4}>
            <FormControl placeholder="Quantity" onChange={this.handleDurationChange('quantity')} value={quantity} />
          </Col>
          <Col sm={4}>
            <FormControl componentClass="select" value={type} onChange={this.handleDurationChange('type')}>
              <option value='hours'>Hours</option>
              <option value='days'>Days</option>
              <option value='weeks'>Weeks</option>
            </FormControl>
          </Col>
        </FormGroup>
        <ButtonGroup>
          <Button bsStyle="primary" onClick={this.handleSubmit}>GO</Button>
        </ButtonGroup>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  submitFilters: bindActionCreators(resourceActions.fetchScheduleFilterResources, dispatch)
});

export default connect(null, mapDispatchToProps)(ScheduleFilters);