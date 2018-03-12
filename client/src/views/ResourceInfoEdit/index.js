import React, { Component } from 'react';

import {
  FormGroup,
  FormControl,
  ControlLabel,
  Col,
  Button,
  Row
} from 'react-bootstrap';

import Select, { Creatable } from 'react-select';

import BootstrapSwitch from 'react-bootstrap-switch';

import LocationSearch from '../../components/LocationSearch';

class ResourceInfoEditView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: true,
      available: true,
      incentive_type: 'user_fee',
      fee_cadence: 'hourly',
      ...this.props.resource
    };
    this.categories = [{"category":"Aircrafts"},{"category":"Arduino Shields Etc."},{"category":"Arduinos"},{"category":"Audio Accessories"},{"category":"Batteries"},{"category":"Battery Chargers"},{"category":"Bio Medical Equipment"},{"category":"Brakes"},{"category":"Breadboards"},{"category":"Cables"},{"category":"Cameras"},{"category":"Clamps"},{"category":"Clutches (Electric)"},{"category":"Computer Accessories"},{"category":"Counters"},{"category":"Couplings"},{"category":"Data Acquisition"},{"category":"Drills"},{"category":"FPGAs"},{"category":"Fans"},{"category":"Gearboxes"},{"category":"Heat Guns"},{"category":"Heat Sinks"},{"category":"Instrumentation (Force)"},{"category":"Instrumentation (Light)"},{"category":"Instrumentation (Sound)"},{"category":"Instrumentation (Torque)"},{"category":"Leads"},{"category":"Lights"},{"category":"Linear Actuators (Electric)"},{"category":"Measuring Devices"},{"category":"Microcontrollers & DSPs"},{"category":"Mobile Platforms/Chassis"},{"category":"Motor Controllers"},{"category":"Motors (AC)"},{"category":"Motors (DC)"},{"category":"Motors (Servo)"},{"category":"Motors (Stepper)"},{"category":"Multimeters"},{"category":"Oscilloscopes"},{"category":"Pliers"},{"category":"Power Supplies"},{"category":"Relays"},{"category":"Robotic Arms/Manipulators"},{"category":"Safety Glasses"},{"category":"Scanners"},{"category":"Sensors (BioMed)"},{"category":"Sensors (Color)"},{"category":"Sensors (Flex)"},{"category":"Sensors (Force)"},{"category":"Sensors (Gas)"},{"category":"Sensors (Infrared)"},{"category":"Sensors (Laser)"},{"category":"Sensors (Light)"},{"category":"Sensors (Liquid)"},{"category":"Sensors (Magnetic)"},{"category":"Sensors (Motion, Orientation)"},{"category":"Sensors (Pressure)"},{"category":"Sensors (Proximity)"},{"category":"Sensors (RF)"},{"category":"Sensors (Sound)"},{"category":"Sensors (Temperature)"},{"category":"Sensors (Touch)"},{"category":"Sensors (Ultrasonic)"},{"category":"Signal Generators"},{"category":"Socket Sets"},{"category":"Solder Suckers"},{"category":"Soldering Stations"},{"category":"Solenoid Actuators (Electric)"},{"category":"Speakers"},{"category":"Tachometers"},{"category":"Transformers/Inverters"},{"category":"Tweezers"},{"category":"Vises"},{"category":"Wall Adapters"},{"category":"Wheels"},{"category":"Wire Cutters"}];
    this.rules = [{"rule" : "No weekend use"},{"rule": "Operators must be present"},{"rule": "Safety training required"},{"rule": "No undergrad students"}];
  }

  handleChange = (name) => (event) => (
    this.setState({ [name]: event.target.value })
  )

  handleNumberChange = (name) => event => (
    this.setState({ [name]: parseInt(event.target.value, 10) })
  )

  handleSwitchChange = (name) => (event, state) => (
    this.setState({ [name]: state })
  )

  handleLocationChange = (location) => {
    this.setState({ location: location });
  }

  handleSelectChange = name => value => {
    this.setState({ [name]: value })
  }
  
  handleSubmit = () => {
    this.props.onSubmitClick(this.state);
  }

  render() {
    const {
      category,
      company,
      faculty,
      location,
      model,
      mobile,
      description,
      rules_restrictions,
      application,
      available,
      fee_amount,
      fee_cadence,
      incentive_type
    } = this.state;

    return (
      <div className="container form-horizontal">
        <FormGroup controlId="formCategory">
          <Col componentClass={ControlLabel} sm={2}>Category</Col>
          <Col sm={10}>
            <Select simpleValue required value={category} onChange={this.handleSelectChange('category')} options={this.categories} labelKey="category" valueKey="category" />
          </Col>
        </FormGroup>

        <FormGroup controlId="formModel">
          <Col componentClass={ControlLabel} sm={2}>Model</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              value={model}
              placeholder="Model"
              onChange={this.handleChange('model')}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formDescription">
          <Col componentClass={ControlLabel} sm={2}>Description</Col>
          <Col sm={10}>
            <FormControl
              componentClass="textarea"
              value={description}
              placeholder="Description"
              onChange={this.handleChange('description')}
            />
          </Col>
        </FormGroup>


        <FormGroup controlId="formManufacturer">
          <Col componentClass={ControlLabel} sm={2}>Manufacturer</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              value={company}
              placeholder="Manufacturer"
              onChange={this.handleChange('company')}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formMobile">
          <Col componentClass={ControlLabel} sm={2}>Mobile</Col>
          <Col sm={10}>
            <BootstrapSwitch offText="No" onText="Yes" onChange={this.handleSwitchChange('mobile')} value={mobile}/>
          </Col>
        </FormGroup>

        <FormGroup controlId="formLocation">
          <Col componentClass={ControlLabel} sm={2}>Location</Col>
          <Col sm={10}>
            <LocationSearch
              onChange={this.handleLocationChange}
              location={location}
            />
          </Col>            
        </FormGroup>

        <FormGroup controlId="formRules">
          <Col componentClass={ControlLabel} sm={2}>Rules for Use</Col>
          <Col sm={10}>
            <Creatable simpleValue multi options={this.rules} onChange={this.handleSelectChange('rules_restrictions')} value={rules_restrictions} labelKey="rule" valueKey="rule"/>
          </Col>
        </FormGroup>

        {/* <FormGroup controlId="formApplication">
          <Col componentClass={ControlLabel} sm={2}>Application</Col>
          <Col sm={10}>
            <FormControl
              componentClass="textarea"
              value={application}
              placeholder="Application"
              onChange={this.handleChange('application')}
            />
          </Col>
        </FormGroup> */}

        <FormGroup controlId="formAvailable">
          <Col componentClass={ControlLabel} sm={2}>Available</Col>
          <Col sm={10}>
            <BootstrapSwitch offText="No" onText="Yes" onChange={this.handleSwitchChange('available')} value={available} />
          </Col>
        </FormGroup>

        { 
          available && incentive_type === 'user_fee' && 
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

        <Row>
          <Button bsClass="col-sm-6 btn" type="button" onClick={this.props.onBackClick}>Go Back</Button>
          <Button bsClass="col-sm-6 btn" bsStyle="primary" type="submit" onClick={this.handleSubmit}>Continue</Button>
        </Row>
      </div>
    );
  }
}

export default ResourceInfoEditView;