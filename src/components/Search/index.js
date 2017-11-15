import React, { Component } from 'react';
import cx from 'classnames';

import { withStyles } from 'material-ui/styles';
import { fade } from 'material-ui/styles/colorManipulator';
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
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer'
  },
  input: {
    font: 'inherit',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px ${theme
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
    },
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
      this.props.submitSearch(this.state.search);
    }
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

  render() {
    const { classes } = this.props;
    const { searchText } = this.state;

    return (
      <div className={cx(classes.wrapper, {
        [classes.wrapperFocus]: this.state.focus
      })}>
        <button className={classes.search}>
          <SearchIcon />
        </button>
        <input
          className={classes.input}
          onBlur={this.handleFocus}
          onChange={this.handleChange('searchText')}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          placeholder="Search Resources"
          value={searchText}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Search);