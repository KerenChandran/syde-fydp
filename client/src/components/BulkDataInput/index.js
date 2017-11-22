import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import FileUpload from 'material-ui-icons/FileUpload';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

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
    const { classes, fullScreen, open } = this.props;

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
              <Button raised color="primary" component="span" className={classes.button}>
                Upload
                <FileUpload className={classes.rightIcon} />
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

export default withStyles(styles)(withMobileDialog()(BulkDataImport));