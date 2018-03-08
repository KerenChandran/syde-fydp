import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { resourceActions, resourceSelectors } from '../modules/resources';
import { requestActions } from '../modules/request';

import {
  Button,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Grid,
  Row
} from 'react-bootstrap';

class RequestResource extends Component {
  state = {
    new_incentive: false
  };

  componentDidMount() {
    const { fetchResource, match: { params }} = this.props;
    fetchResource(params.id);
  }

  handleChange = name => event => (
    this.setState({ [name]: event.target.value })
  )

  handleNegotiate = () => {
    const { fee_amount, fee_cadence, incentive_type } = this.props.resource;
    this.setState({
      fee_amount,
      fee_cadence,
      incentive_type,
      new_incentive: !this.state.new_incentive
    })
  }

  handleAccept = () => {
    const { history, saveIncentive, match: { params } } = this.props;
    
    saveIncentive(this.state);
    history.push(`/resources/${params.id}/request`);
  }

  render() {
    const { resource } = this.props;
    const { fee_amount, fee_cadence, incentive_type, new_incentive } = this.state;

    return (
      <div>
        <Grid>
          <Row>
            <Col sm={2}>Model</Col>
            <Col sm={10}>{resource.category}</Col>
          </Row>
          <Row>
            <Col sm={2}>Incentive Type</Col>
            <Col sm={10}>{resource.incentive_type}</Col>
          </Row>
          <Row>
            <Col sm={2}>Fee Amount</Col>
            <Col sm={10}>{resource.fee_amount}</Col>
          </Row>
          <Row>
            <Col sm={2}>Fee Cadence</Col>
            <Col sm={10}>{resource.fee_cadence}</Col>
          </Row>
        </Grid>
        {
          new_incentive && (
            <div className="form-horizontal">
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
          )
        }
        <Button bsStyle="primary" onClick={this.handleAccept}>Accept</Button>
        <Button onClick={this.handleNegotiate}>Negotiate</Button>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  resource: resourceSelectors.getResource(state, props.match.params.id)
});

const mapDispatchToProps = dispatch => ({
  fetchResource: bindActionCreators(resourceActions.fetchResource, dispatch),
  saveIncentive: bindActionCreators(requestActions.saveIncentive, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestResource);