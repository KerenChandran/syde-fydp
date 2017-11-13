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

class ResourceInfo extends Component {
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
    this.props.submitForm(this.state);
    this.handleRequestClose();
  }

  handleChange = (name) => (event) => (
    this.setState({ [name]: event.target.value })
  )

  handleSwitchChange = (name) => (event, checked) => (
    this.setState({ [name]: checked })
  )

  render() {
    const { fullScreen, open, resource } = this.props;
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
     } = resource;

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onRequestClose={this.handleRequestClose}
        >
          <DialogTitle>Data Import</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Name" value={name} disabled />
            <TextField label="Faculty" margin="normal" value={faculty} disabled/>
            <TextField label="Location" margin="normal" value={location} disabled/>
            <FormGroup row>
              <FormControlLabel
                label="Mobile"
                control={<Switch/>}
                checked={mobile}
                disabled
              />
              <FormControlLabel
                label="Available"
                control={<Switch/>}
                checked={available}
                disabled
              />
            </FormGroup>
            <TextField
              fullWidth
              multiline
              label="Description"
              margin="normal"
              value={description}
              disabled
            />
            <TextField
              fullWidth
              multiline
              label="Rules & Regulation"
              margin="normal"
              value={rules}
              disabled
            />
            <TextField
              fullWidth
              multiline
              label="Use Cases"
              margin="normal"
              value={usage}
              disabled
            />
            <TextField
              fullWidth
              multiline
              label="Incentive"
              margin="normal"
              value={incentive}
              disabled
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} color="primary">Close</Button>
            <Button onClick={this.handleContactInfo} raised color="primary" autoFocus>Contact Info</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ResourceInfo.defaultProps = {
  open: false,
  resource: {},
  submitForm: () => {},
  closeForm: () => {}
};

ResourceInfo.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(ResourceInfo);