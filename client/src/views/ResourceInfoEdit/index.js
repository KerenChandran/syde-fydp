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
        <Form horizontal>
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
              <LocationSearch onChange={this.handleLocationChange} value={location}/>
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
            <Col sm={10}><FormControl.Static>{mobile ? 'Yes' : 'No'}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formAvailable">
            <Col componentClass={ControlLabel} sm={2}>Available</Col>
            <Col sm={10}><FormControl.Static>{available ? 'Yes' : 'No'}</FormControl.Static></Col>
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
                value={rules}
                placeholder="Rules"
                onChange={this.handleChange('rules')}
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
            <Col sm={10}><FormControl.Static>{incentive}</FormControl.Static></Col>
          </FormGroup>

          <FormGroup controlId="formFees">
            <Col componentClass={ControlLabel} sm={2}>User Fee</Col>
            <Col sm={10}>
              <FormControl
                type="number"
                value={fine}
                placeholder="User Fee"
                onChange={this.handleChange('fine')}
              />
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default ResourceInfoEditView;