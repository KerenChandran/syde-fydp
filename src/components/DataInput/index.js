import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Switch from 'material-ui/Switch';
import { FormControl, FormControlLabel, FormGroup } from 'material-ui/Form';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

class DataImport extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props.resource }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.resource)
  }

  handleRequestClose = () => {
    this.props.closeForm();
  };

  handleSubmit = () => {
    this.props.submitForm();
    this.handleRequestClose();
  }

  handleChange = (name) => (event) => (
    this.setState({ [name]: event.target.value })
  )

  handleSwitchChange = (name) => (event, checked) => (
    this.setState({ [name]: checked })
  )

  render() {
    const { fullScreen, open } = this.props;
    const {
      name,
      faculty,
      location,
      mobile,
      available,
      description,
      rules,
      usage,
      incentive
    } = this.state;

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onRequestClose={this.handleRequestClose}
        >
          <DialogTitle>Data Import</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Name" onChange={this.handleChange('name')} value={name} />
            <TextField label="Faculty" onChange={this.handleChange('faculty')} margin="normal" value={faculty} />
            <TextField label="Location" onChange={this.handleChange('location')} margin="normal" value={location} />
            <FormGroup row>
              <FormControlLabel
                label="Mobile"
                control={<Switch/>}
                checked={mobile}
                onChange={this.handleSwitchChange('mobile')}
              />
              <FormControlLabel
                label="Available"
                control={<Switch/>}
                checked={available}
                onChange={this.handleSwitchChange('available')}
              />
            </FormGroup>
            <TextField
              fullWidth
              multiline
              label="Description"
              onChange={this.handleChange('description')}
              margin="normal"
              value={description}
            />
            <TextField
              fullWidth
              multiline
              label="Rules & Regulation"
              onChange={this.handleChange('rules')}
              margin="normal"
              value={rules}
            />
            <TextField
              fullWidth
              multiline
              label="Use Cases"
              onChange={this.handleChange('usage')}
              margin="normal"
              value={usage}
            />
            <TextField
              fullWidth
              multiline
              label="Incentive"
              onChange={this.handleChange('incentive')}
              margin="normal"
              value={incentive}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} color="primary">Cancel</Button>
            <Button onClick={this.handleSubmit} raised color="primary" autoFocus>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DataImport.defaultProps = {
  resource: {
    name: '',
    location: '',
    faculty: '',
    description: '',
    rules: '',
    available: false,
    date: Date.now(),
    incentive: '',
    mobile: false,
    usage: ''
  }
}

DataImport.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(DataImport);