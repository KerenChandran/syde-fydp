import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
  Button,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
} from 'react-bootstrap';

import Select from 'react-select';

class ResourceSearchFilters extends Component {
  constructor(props) {
    super(props);
    this.categories = [{"category":"Aircrafts"},{"category":"Arduino Shields Etc."},{"category":"Arduinos"},{"category":"Audio Accessories"},{"category":"Batteries"},{"category":"Battery Chargers"},{"category":"Bio Medical Equipment"},{"category":"Brakes"},{"category":"Breadboards"},{"category":"Cables"},{"category":"Cameras"},{"category":"Clamps"},{"category":"Clutches (Electric)"},{"category":"Computer Accessories"},{"category":"Counters"},{"category":"Couplings"},{"category":"Data Acquisition"},{"category":"Drills"},{"category":"FPGAs"},{"category":"Fans"},{"category":"Gearboxes"},{"category":"Heat Guns"},{"category":"Heat Sinks"},{"category":"Instrumentation (Force)"},{"category":"Instrumentation (Light)"},{"category":"Instrumentation (Sound)"},{"category":"Instrumentation (Torque)"},{"category":"Leads"},{"category":"Lights"},{"category":"Linear Actuators (Electric)"},{"category":"Measuring Devices"},{"category":"Microcontrollers & DSPs"},{"category":"Mobile Platforms/Chassis"},{"category":"Motor Controllers"},{"category":"Motors (AC)"},{"category":"Motors (DC)"},{"category":"Motors (Servo)"},{"category":"Motors (Stepper)"},{"category":"Multimeters"},{"category":"Oscilloscopes"},{"category":"Pliers"},{"category":"Power Supplies"},{"category":"Relays"},{"category":"Robotic Arms/Manipulators"},{"category":"Safety Glasses"},{"category":"Scanners"},{"category":"Sensors (BioMed)"},{"category":"Sensors (Color)"},{"category":"Sensors (Flex)"},{"category":"Sensors (Force)"},{"category":"Sensors (Gas)"},{"category":"Sensors (Infrared)"},{"category":"Sensors (Laser)"},{"category":"Sensors (Light)"},{"category":"Sensors (Liquid)"},{"category":"Sensors (Magnetic)"},{"category":"Sensors (Motion, Orientation)"},{"category":"Sensors (Pressure)"},{"category":"Sensors (Proximity)"},{"category":"Sensors (RF)"},{"category":"Sensors (Sound)"},{"category":"Sensors (Temperature)"},{"category":"Sensors (Touch)"},{"category":"Sensors (Ultrasonic)"},{"category":"Signal Generators"},{"category":"Socket Sets"},{"category":"Solder Suckers"},{"category":"Soldering Stations"},{"category":"Solenoid Actuators (Electric)"},{"category":"Speakers"},{"category":"Tachometers"},{"category":"Transformers/Inverters"},{"category":"Tweezers"},{"category":"Vises"},{"category":"Wall Adapters"},{"category":"Wheels"},{"category":"Wire Cutters"}];
  }

  render() {
    const { handleChange, handleSelectChange, filters } = this.props;
    const { category, company, mobile, model, searchText } = filters;
    return (
      <Form horizontal>
        <FormGroup controlId="formKeyword">
          <Col componentClass={ControlLabel} sm={2}>Keyword</Col>
          <Col xs={9}>
            <FormControl type="text" placeholder="Enter Key Word" value={searchText} onChange={handleChange('searchText')} />
          </Col>
        </FormGroup>

        <FormGroup controlId="formCategory">
          <Col componentClass={ControlLabel} sm={2}>Category</Col>
          <Col xs={9}>
          <Select simpleValue required value={category} onChange={handleSelectChange('category')} options={this.categories} labelKey="category" valueKey="category" />
          </Col>
        </FormGroup>

        <FormGroup controlId="formModel">
          <Col componentClass={ControlLabel} sm={2}>Model</Col>
          <Col xs={9}>
            <FormControl type="text" placeholder="Any" value={model} onChange={handleChange('model')} />
          </Col>
        </FormGroup>

        <FormGroup controlId="formManufacturer">
          <Col componentClass={ControlLabel} sm={2}>Manufacturer</Col>
          <Col xs={9}>
            <FormControl type="text" placeholder="Any" value={company} onChange={handleChange('company')}/>
          </Col>
        </FormGroup>

        <FormGroup controlId="formMobility">
          <Col componentClass={ControlLabel} sm={2}>Mobility</Col>
          <Col xs={9}>
            <FormControl componentClass="select" value={mobile} onChange={handleChange('mobile')}>
              <option value={''}>Any</option>
              <option value={true}>True</option>
              <option value={false}>False</option>
            </FormControl>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

ResourceSearchFilters.propTypes = {
  handleChange: PropTypes.func,
  filters: PropTypes.object
}

ResourceSearchFilters.defaultProps = {
  filters: {
    category: '',
    company: '',
    mobile: '',
    model: '',
    searchText: ''
  },
  handleChange: () => {}
}

export default ResourceSearchFilters;