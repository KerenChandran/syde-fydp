import React, { Component } from 'react';

import {
  FormGroup,
  FormControl,
  ControlLabel,
  Col,
  Button,
  Row
} from 'react-bootstrap';

import BootstrapSwitch from 'react-bootstrap-switch';

import LocationSearch from '../../components/LocationSearch';

class ResourceInfoEditView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: true,
      category: 'Battery Chargers',
      ...this.props.resource
    }
    this.categories = ["Aircrafts","Arduino Shields Etc.","Arduinos","Audio Accessories","Batteries","Battery Chargers","Bio Medical Equipment","Brakes","Breadboards","Cables","Cameras","Clamps","Clutches (Electric)","Computer Accessories","Counters","Couplings","Data Acquisition","Drills","FPGAs","Fans","Gearboxes","Heat Guns","Heat Sinks","Instrumentation (Force)","Instrumentation (Light)","Instrumentation (Sound)","Instrumentation (Torque)","Leads","Lights","Linear Actuators (Electric)","Measuring Devices","Microcontrollers & DSPs","Mobile Platforms/Chassis","Motor Controllers","Motors (AC)","Motors (DC)","Motors (Servo)","Motors (Stepper)","Multimeters","Oscilloscopes","Pliers","Power Supplies","Relays","Robotic Arms/Manipulators","Safety Glasses","Scanners","Sensors (BioMed)","Sensors (Color)","Sensors (Flex)","Sensors (Force)","Sensors (Gas)","Sensors (Infrared)","Sensors (Laser)","Sensors (Light)","Sensors (Liquid)","Sensors (Magnetic)","Sensors (Motion, Orientation)","Sensors (Pressure)","Sensors (Proximity)","Sensors (RF)","Sensors (Sound)","Sensors (Temperature)","Sensors (Touch)","Sensors (Ultrasonic)","Signal Generators","Socket Sets","Solder Suckers","Soldering Stations","Solenoid Actuators (Electric)","Speakers","Tachometers","Transformers/Inverters","Tweezers","Vises","Wall Adapters","Wheels","Wire Cutters"];
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
      application
    } = this.state;

    return (
      <div className="container form-horizontal">
        <FormGroup controlId="formCategory">
          <Col componentClass={ControlLabel} sm={2}>Category</Col>
          <Col sm={10}>
            <FormControl componentClass="select" placeholder="Category" onChange={this.handleChange('category')} value={category}>
              {this.categories.map(category => <option key={category} value={category}>{category}</option>)}
            </FormControl>
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
            <FormControl
              componentClass="textarea"
              value={rules_restrictions}
              placeholder="Rules"
              onChange={this.handleChange('rules_restrictions')}
            />
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

        <Row>
          <Button bsClass="col-sm-6 btn" type="button" onClick={this.props.onBackClick}>Go Back</Button>
          <Button bsClass="col-sm-6 btn" bsStyle="primary" type="submit" onClick={this.handleSubmit}>Continue</Button>
        </Row>
      </div>
    );
  }
}

export default ResourceInfoEditView;