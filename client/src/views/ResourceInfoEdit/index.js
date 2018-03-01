import React, { Component } from 'react';

import {
  FormGroup,
  FormControl,
  ControlLabel,
  Col,
  Button
} from 'react-bootstrap';

import LocationSearch from '../../components/LocationSearch';

class ResourceInfoEditView extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props.resource }
  }

  handleChange = (name) => (event) => (
    this.setState({ [name]: event.target.value })
  )

  handleNumberChange = (name) => event => (
    this.setState({ [name]: parseInt(event.target.value, 10) })
  )

  handleSwitchChange = (name) => (event, checked) => (
    this.setState({ [name]: checked })
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
          <FormGroup>
            <Col smOffset={10} sm={2}>
              <Button type="button" onClick={this.props.onBackClick}>Go Back</Button>
              <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Submit</Button>
            </Col>
          </FormGroup>
          <FormGroup controlId="formCategory">
            <Col componentClass={ControlLabel} sm={2}>
              Category
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                value={category}
                placeholder="Category"
                onChange={this.handleChange('category')}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="formCompany">
            <Col componentClass={ControlLabel} sm={2}>Company</Col>
            <Col sm={10}>
              <FormControl
                type="text"
                value={company}
                placeholder="Company"
                onChange={this.handleChange('company')}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="formFaculty">
            <Col componentClass={ControlLabel} sm={2}>Faculty</Col>
            <Col sm={10}>
              <FormControl
                type="text"
                value={faculty}
                placeholder="Faculty"
                onChange={this.handleChange('faculty')}
              />
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


          <FormGroup controlId="formMobile">
            <Col componentClass={ControlLabel} sm={2}>Mobile</Col>
            <Col sm={10}>
              <FormControl componentClass="select" onChange={this.handleChange('mobile')} value={mobile}>
                <option value="">N/A</option>
                <option value={false}>False</option>
                <option value={true}>True</option>
              </FormControl>
            </Col>
          </FormGroup>

          <FormGroup controlId="formAvailable">
            <Col componentClass={ControlLabel} sm={2}>Available</Col>
            <Col sm={10}>
              <FormControl componentClass="select" onChange={this.handleChange('available')} value={available}>
                <option value="">N/A</option>
                <option value={false}>False</option>
                <option value={true}>True</option>
              </FormControl>
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

          <FormGroup controlId="formRules">
            <Col componentClass={ControlLabel} sm={2}>Rules</Col>
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

          <FormGroup controlId="formIncentive">
            <Col componentClass={ControlLabel} sm={2}>Incentive</Col>
            <Col sm={10}>
              <FormControl componentClass="select" placeholder="user_fee" onChange={this.handleChange('incentive_type')} value={incentive_type}>
                <option value="">N/A</option>
                <option value="user_fee">User Fee</option>
              </FormControl>
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