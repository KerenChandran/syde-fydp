import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

class BulkDataImport extends Component {
  static state = {
    file: null
  };

  handleRequestClose = () => {
    this.props.closeForm();
  };

  handleFileUpload = (event) => (
    this.setState({
      file: event.target.files[0]
    })
  )

  handleSubmit = () => {
    console.log('Submit Form');
    this.handleRequestClose();
  }

  render() {
    const { fullScreen, open } = this.props;

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onRequestClose={this.handleRequestClose}
        >
          <DialogTitle>Bulk Data Import</DialogTitle>
          <DialogContent>
            <DialogContentText>Download template here</DialogContentText>
            <input accept="*" id="file" type="file" style={{ display: 'none' }}/>
            <label htmlFor="file">
              <Button raised color="primary" component="span">
                Upload
              </Button>
            </label>
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

BulkDataImport.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(BulkDataImport);