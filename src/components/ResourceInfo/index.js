import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog, {
  DialogActions,
  DialogContent,
  div,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

import ResourceDetails from './ResourceDetails';

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
    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onRequestClose={this.handleRequestClose}
        >
          <DialogTitle>{[resource.company, resource.model].join(' - ')}</DialogTitle>
          <DialogContent>
            <ResourceDetails {...resource} />
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