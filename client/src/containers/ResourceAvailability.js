import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

import { resourceActions, resourceSelectors } from '../modules/resources'; 

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
import BootstrapSwitch from 'react-bootstrap-switch';

moment.locale('en');
momentLocalizer();


class ResourceAvailability extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource_id: props.match.params.id,
      start: new Date(),
      end: null,
      incentive_type: 'user_fee',
      fee_amount: null,
      fee_cadence: 'hourly',
      available: true
    };
  }

  handleSwitchChange = (name) => (event, state) => (
    this.setState({ [name]: state })
  )
  
  handleUpdateDateEvent = name => value => {
    this.setState({ [name]: value })
  }

  handleChange = (name) => (event) => (
    this.setState({ [name]: event.target.value })
  )

  handleSubmit = async () => {
    const { history, initialAvailability, newResource, addResource } = this.props;
    const { resource_id, start, end, incentive_type, fee_amount, fee_cadence, available } = this.state;
    const newId = await addResource({
      ...newResource,
      incentive_type,
      fee_amount,
      fee_cadence,
      available
    });
    await initialAvailability({
      resource_id: resource_id === 'new' ? newId : resource_id,
      availability_start: moment(start).format('YYYY-MM-DD'),
      availability_end: moment(end).format('YYYY-MM-DD'),
    });
  }

  render() {
    const { start, end, incentive_type, fee_amount, fee_cadence, available } = this.state;
    return (
      <div className="container form-horizontal">
        { available && <h4 className="row" style={{ textAlign: 'center' }}>Enter range of availability. You'll be able to select specific dates and times later.</h4>}
        <FormGroup controlId="formAvailable">
          <Col componentClass={ControlLabel} sm={2}>Available</Col>
          <Col sm={10}>
            <BootstrapSwitch offText="No" onText="Yes" onChange={this.handleSwitchChange('available')} value={available} />
          </Col>
        </FormGroup>

        { available && (
          <div>
          { 
            incentive_type === 'user_fee' && 
            <div>
              <FormGroup controlId="formFees">
                <Col componentClass={ControlLabel} sm={2}>Fee Amount</Col>
                <Col sm={10}>
                  <FormControl
                    type="number"
                    value={fee_amount}
                    placeholder="Free"
                    onChange={this.handleChange('fee_amount')}
                  />
                </Col>
              </FormGroup>
  
              <FormGroup controlId="formCadence">
                <Col componentClass={ControlLabel} sm={2}>Fee Cadence</Col>
                <Col sm={10}>
                  <FormControl componentClass="select" placeholder="Fee Cadence" onChange={this.handleChange('fee_cadence')} value={fee_cadence}>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                  </FormControl>
                </Col>
              </FormGroup>
            </div>
          }
  
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
        )}
        <Button bsClass="col-sm-10 col-sm-offset-2 btn" bsStyle="primary" onClick={this.handleSubmit}>Continue</Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  newResource: resourceSelectors.getNewResource(state)
});

const mapDispatchToProps = (dispatch) => ({
  addResource: bindActionCreators(resourceActions.addDataImport, dispatch),
  initialAvailability: bindActionCreators(resourceActions.initialAvailability, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceAvailability);