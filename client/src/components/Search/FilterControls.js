import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Subheader from 'material-ui/List/ListSubheader';
import Input, { InputAdornment } from 'material-ui/Input';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

import Close from 'material-ui-icons/Close';

const styles = () => ({
  root: {
    padding: 15
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 0
  }
})

class FilterControls extends Component {
  constructor(props) {
    super(props);
    const { available, mobile, incentive, fees, feesRange } = props.filters;
    this.state = {
      available,
      mobile,
      incentive,
      fees,
      feesRange
    };
  }

  handleChange = name => event => (
    this.setState({ [name]: event.target.value })
  )

  handleReset = () => (
    this.setState({
      available: null,
      mobile: null,
      incentive: null,
      fees: null
    })
  )

  handleSubmit = () => (
    this.props.submitSearch(this.state)
  )

  render() {
    const { available, mobile, incentive, fees, feesRange } = this.state;
    const { classes, handleClose } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.close}>
          <IconButton onClick={handleClose}><Close /></IconButton>
        </div>
        <Grid container alignContent="center" alignItems="center">
          <Grid item xs={3}>
            <Subheader>Available</Subheader>
          </Grid>
          <Grid item xs={6}>
            <Select
              fullWidth
              displayEmpty
              onChange={this.handleChange('available')}
              value={available}
            >
              <MenuItem value={null}>Any</MenuItem>
              <MenuItem value={true}>True</MenuItem>
              <MenuItem value={false}>False</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid container alignContent="center" alignItems="center">
          <Grid item xs={3}>
            <Subheader>Mobility</Subheader>
          </Grid>
          <Grid item xs={6}>
            <Select
                fullWidth
                displayEmpty
                onChange={this.handleChange('mobile')}
                value={mobile}
              >
                <MenuItem value={null}>Any</MenuItem>
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
          </Grid>
        </Grid>
        <Grid container alignContent="center" alignItems="center">
          <Grid item xs={3}>
            <Subheader>Incentive Type</Subheader>
          </Grid>
          <Grid item xs={6}>
            <Select
                fullWidth
                displayEmpty
                onChange={this.handleChange('incentive')}
                value={incentive}
              >
                <MenuItem value={null}>Any</MenuItem>
                <MenuItem value={'User Fees'}>User Fees</MenuItem>
                <MenuItem value={'Co-Publishing'}>Co-Publishing</MenuItem>
              </Select>
          </Grid>
        </Grid>
        { incentive === 'User Fees' ? 
          <Grid container alignContent="center" alignItems="center">
            <Grid item xs={3}>
              <Subheader>User Fees</Subheader>
            </Grid>
            <Grid item xs={1}>
              <Select
                onChange={this.handleChange('feesRange')}
                value={feesRange}
              >
                <MenuItem value={'='}>=</MenuItem>
                <MenuItem value={'>='}>{'>='}</MenuItem>
                <MenuItem value={'<= '}>{'<='}</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <Input
                startAdornment={<InputAdornment component='span' position="start">$</InputAdornment>}
                onChange={this.handleChange('fees')}
                value={fees}
              />
            </Grid>
          </Grid> : null
        }
        <Grid container alignContent="center" alignItems="center" justify="flex-end">
          <Grid item>
            <Button onClick={this.handleReset}>Reset</Button>
          </Grid>
          <Grid item>
            <Button raised color="primary" onClick={this.handleSubmit}>Search</Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

FilterControls.propTypes = {
  submitSearch: PropTypes.func
}

FilterControls.defaultProps = {
  filters: {
    available: null,
    mobile: null,
    incentive: null,
    fees: null,
    feesRange: '='
  },
  submitSearch: () => {}
}

export default withStyles(styles)(FilterControls);