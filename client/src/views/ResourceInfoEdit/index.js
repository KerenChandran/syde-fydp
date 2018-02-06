import React, { Component } from 'react';

import {
  Form,
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
      rules,
      application,
      incentive,
      fine
    } = this.state;

    return (
      <div style={{ display: 'block', width: '100%'}}>
        <Form>
          <FormGroup>
            <Col smOffset={10} sm={2}>
              <Button type="button" onClick={this.props.onBackClick}>Go Back</Button>
              <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Submit</Button>
            </Col>
          </FormGroup>
          <FormGroup controlId="formCategory">
            <ControlLabel>Category</ControlLabel>
            <FormControl
              type="text"
              value={category}
              placeholder="Category"
              onChange={this.handleChange('category')}
            />
          </FormGroup>

          <FormGroup controlId="formCompany">
            <ControlLabel>Company</ControlLabel>
            <FormControl
              type="text"
              value={company}
              placeholder="Company"
              onChange={this.handleChange('company')}
            />
          </FormGroup>

          <FormGroup controlId="formFaculty">
            <ControlLabel>Faculty</ControlLabel>
            <FormControl
              type="text"
              value={faculty}
              placeholder="Faculty"
              onChange={this.handleChange('faculty')}
            />
          </FormGroup>

          <FormGroup controlId="formLocation">
            <ControlLabel>Location</ControlLabel>
            <LocationSearch onChange={this.handleLocationChange} value={location}/>
          </FormGroup>

          <FormGroup controlId="formModel">
            <ControlLabel>Model</ControlLabel>
            <FormControl
              type="text"
              value={model}
              placeholder="Model"
              onChange={this.handleChange('model')}
            />
          </FormGroup>


          <FormGroup controlId="formMobile">
            <Col componentClass={ControlLabel} sm={2}>Mobile</Col>
            <Col sm={10}><FormControl.Static>{mobile ? 'Yes' : 'No'}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formAvailable">
            <Col componentClass={ControlLabel} sm={2}>Available</Col>
            <Col sm={10}><FormControl.Static>{available ? 'Yes' : 'No'}</FormControl.Static></Col>
          </FormGroup>


          <FormGroup controlId="formDescription">
            <ControlLabel>Description</ControlLabel>
            <FormControl
              componentClass="textarea"
              value={description}
              placeholder="Description"
              onChange={this.handleChange('description')}
            />
          </FormGroup>

          <FormGroup controlId="formRules">
            <ControlLabel>Rules</ControlLabel>
            <FormControl
              componentClass="textarea"
              value={rules}
              placeholder="Rules"
              onChange={this.handleChange('rules')}
            />
          </FormGroup>

          <FormGroup controlId="formApplication">
            <ControlLabel>Application</ControlLabel>
            <FormControl
              componentClass="textarea"
              value={application}
              placeholder="Application"
              onChange={this.handleChange('application')}
            />
          </FormGroup>

          <FormGroup controlId="formIncentive">
            <Col componentClass={ControlLabel} sm={2}>Incentive</Col>
            <Col sm={10}><FormControl.Static>{incentive}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formFees">
            <ControlLabel>User Fee</ControlLabel>
            <FormControl
              type="number"
              value={fine}
              placeholder="User Fee"
              onChange={this.handleChange('fine')}
            />
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default ResourceInfoEditView;