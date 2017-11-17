import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
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
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  twoColLeft: {
    width: '45%',
    marginRight: '5%'
  },
  twoColRight: {
    width: '45%',
    marginLeft: '5%'
  }
});

class DataInput extends Component {
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
    const { classes, fullScreen, open } = this.props;
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
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onRequestClose={this.handleRequestClose}
        >
          <DialogTitle>Data Import</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Category" onChange={this.handleChange('category')} value={category} />
            <TextField fullWidth label="Company" onChange={this.handleChange('company')} value={company} margin="normal" />
            <TextField fullWidth label="Model" onChange={this.handleChange('model')} value={model} margin="normal" />
            <FormGroup row>
              <TextField className={classes.twoColLeft} label="Faculty" onChange={this.handleChange('faculty')} margin="normal" value={faculty} />
              <TextField className={classes.twoColRight} label="Location" onChange={this.handleChange('location')} margin="normal" value={location} />
            </FormGroup>
            <FormControl className={classes.twoColLeft}>
              <InputLabel htmlFor="incentive">Incentive Type</InputLabel>
              <Select
                value={incentive}
                onChange={this.handleChange('incentive')}
                input={<Input id="incentive" />}
              >
                <MenuItem value={'User Fees'}>User Fees</MenuItem>
                <MenuItem value={'Co-Publishing'}>Co-Publishing</MenuItem>
              </Select>
            </FormControl>
            { incentive === 'User Fees' ?
              <FormControl className={classes.twoColRight}>
                <InputLabel htmlFor="userFee">Amount</InputLabel>
                <Input
                  id="userFee"
                  startAdornment={<InputAdornment component='span' position="start">$</InputAdornment>}
                  onChange={this.handleChange('fine')}
                  margin="normal"
                  value={fine}
                />
              </FormControl> : null
            }
            <FormGroup>
              <FormControlLabel
                label="Mobile"
                control={<Switch checked={mobile} onChange={this.handleSwitchChange('mobile')} />}
              />
              <FormControlLabel
                label="Available"
                control={<Switch checked={available} onChange={this.handleSwitchChange('available')} />}
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
              label="Rules & Restrictions"
              onChange={this.handleChange('rules')}
              margin="normal"
              value={rules}
            />
            <TextField
              fullWidth
              multiline
              label="Application"
              onChange={this.handleChange('application')}
              margin="normal"
              value={application}
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

DataInput.defaultProps = {
  resource: {
    id: '-1',
    category: '',
    model: '',
    company: '',
    location: '',
    faculty: '',
    description: '',
    rules: '',
    available: false,
    date: Date.now(),
    incentive: '',
    mobile: false,
    application: ''
  }
}

DataInput.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withStyles(styles)(withMobileDialog()(DataInput));