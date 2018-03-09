import React, { Component } from 'react';

import {
  FormGroup,
  FormControl,
  ControlLabel,
  Col,
  Button
} from 'react-bootstrap';

import BootstrapSwitch from 'react-bootstrap-switch';

import LocationSearch from '../../components/LocationSearch';

class ResourceInfoEditView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incentive_type: 'user_fee',
      mobile: true,
      ...this.props.resource
    }
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
      available,
      description,
      rules_restrictions,
      application,
      incentive_type,
      fee_amount,
      fee_cadence
    } = this.state;

    return (
      <div style={{ display: 'block', width: '100%'}}>
        <div className="form-horizontal">
          <FormGroup controlId="formCategory">
            <Col componentClass={ControlLabel} sm={2}>Category</Col>
            <Col sm={10}>
              <FormControl
                type="text"
                value={category}
                placeholder="Category"
                onChange={this.handleChange('category')}
              />
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
              <BootstrapSwitch offText="No" onText="Yes" onChange={this.handleSwitchChange('mobile')} />
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

          <FormGroup controlId="formApplication">
            <Col componentClass={ControlLabel} sm={2}>Application</Col>
            <Col sm={10}>
              <FormControl
                componentClass="textarea"
                value={application}
                placeholder="Application"
                onChange={this.handleChange('application')}
              />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={6}>
              <Button type="button" onClick={this.props.onBackClick}>Go Back</Button>
            </Col>
            <Col sm={6}>
              <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Continue</Button>
            </Col>
          </FormGroup>



          {/*
          
            MOVE THESE TO THE AVAILABILITY PAGE!!!
        
          */}

          <FormGroup controlId="formAvailable">
            <Col componentClass={ControlLabel} sm={2}>Available</Col>
            <Col sm={10}>
              <BootstrapSwitch offText="No" onText="Yes" onChange={this.handleSwitchChange('mobile')} />
            </Col>
          </FormGroup>

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
                    <option value="">N/A</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                  </FormControl>
                </Col>
              </FormGroup>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default ResourceInfoEditView;