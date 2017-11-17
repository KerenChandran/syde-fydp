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
import ContactInfo from './ContactInfo';

class ResourceInfo extends Component {
  state = {
    showContactInfo: false
  };

  handleRequestClose = () => {
    this.setState({ showContactInfo: false });
    this.props.closeForm();
  };

  toggleShowContactInfo = () => {
    this.setState({ showContactInfo: !this.state.showContactInfo });
  }

  render() {
    const { fullScreen, open, resource } = this.props;
    const { showContactInfo } = this.state;
    const { name, email, phone, emailPreferred, phonePreferred, ...resouceProperties } = resource;


    const buttonLabel = showContactInfo ? 'Resource Info' : 'Contact Info'
    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onRequestClose={this.handleRequestClose}
        >
          <DialogTitle>{[resource.company, resource.model].join(' - ')}</DialogTitle>
          <DialogContent>
            { showContactInfo ?
              <ContactInfo
                name={name}
                email={email}
                phone={phone}
                emailPreferred={emailPreferred}
                phonePreferred={phonePreferred}
              /> :
              <ResourceDetails {...resouceProperties} />
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} color="primary">Close</Button>
            <Button onClick={this.toggleShowContactInfo} raised color="primary" autoFocus>{buttonLabel}</Button>
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