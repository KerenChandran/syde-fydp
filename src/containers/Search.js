import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { searchActions, searchSelectors } from '../modules/search';

import SearchBar from '../components/Search';

class Search extends Component {
  render() {
    const { filters, submitSearch } = this.props;
    return (
      <SearchBar submitSearch={submitSearch} filters={filters} />
    );
  }
}

const mapStateToProps = state => ({
  filters: searchSelectors.filters(state)
});

const mapDispatchToProps = dispatch => ({
  submitSearch: bindActionCreators(searchActions.submitSearch, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);