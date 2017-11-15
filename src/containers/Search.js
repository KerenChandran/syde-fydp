import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { searchActions } from '../modules/search';

import SearchBar from '../components/Search';

class Search extends Component {
  render() {
    return (
      <SearchBar submitSearch={this.props.submitSearch} />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  submitSearch: bindActionCreators(searchActions.submitSearch, dispatch)
});

export default connect(null, mapDispatchToProps)(Search);