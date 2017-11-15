import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';

import CloseIcon from 'material-ui-icons/Close';
import SearchIcon from 'material-ui-icons/Search';

const styles = theme =>  ({
  wrapper: {
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    marginRight: 16,
    borderRadius: 2,
    width: '100%',
    display: 'flex'
  },
  wrapperFocus: {
    border: '1px solid rgba(0,0,0,0.12)',
    background: 'rgba(255,255,255,1)',
    boxShadow: '0 1px 1px rgba(0,0,0,0.24)'
  },
  search: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none'
  },
  input: {
    font: 'inherit',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 9}px ${theme.spacing.unit}px ${theme
      .spacing.unit * 9}px`,
    border: 0,
    flex: '1 1 auto',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0, // Reset for Safari
    color: 'inherit',
    '&:focus': {
      outline: 0,
    }
  }
});

class Search extends Component {
  state = {
    search: {
      searchText: '',
      available: null,
      location: null,
      faculty: null
    },
    focus: false
  };

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      this.handleSearch();
    }
  }

  handleSearch = () => {
    this.props.submitSearch(this.state.search);
  }

  handleFocus = () => {
    this.setState({ focus: !this.state.focus });
  }

  handleChange = name => event => {
    const newSearch = {
      ...this.state.search,
      [name]: event.target.value
    }
    this.setState({ search: newSearch });
  }

  handleClear = () => {
    this.setState({
      search: {
        searchText: '',
        available: null,
        location: null,
        faculty: null
      }
    })
  }

  render() {
    const { classes } = this.props;
    const { searchText } = this.state.search;

    return (
      <div className={cx(classes.wrapper, {
        [classes.wrapperFocus]: this.state.focus
      })}>
        <Tooltip title="Search" placement="bottom">
          <IconButton className={classes.search} onClick={this.handleSearch}>
            <SearchIcon />
          </IconButton>
        </Tooltip>
        <input
          className={classes.input}
          onBlur={this.handleFocus}
          onChange={this.handleChange('searchText')}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          placeholder="Search Resources"
          value={searchText}
        />
        { searchText.length > 0 ?
          <Tooltip title="Clear search" placement="bottom">
            <IconButton onClick={this.handleClear}>
              <CloseIcon />
            </IconButton>
          </Tooltip> : null }
      </div>
    );
  }
}

Search.propTypes = {
  submitSearch: PropTypes.func
}

Search.defaultProps = {
  submitSearch: () => {}
};

export default withStyles(styles)(Search);