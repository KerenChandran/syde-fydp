import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { searchActions, searchSelectors } from '../modules/search';

import SearchBar from '../components/Search';

class Search extends Component {
  render() {
    const { search, submitSearch } = this.props;
    const { searchText, ...filters } = search;
    return (
      <SearchBar submitSearch={submitSearch} searchText={searchText} filters={filters} />
    );
  }
}

const mapStateToProps = state => ({
  search: searchSelectors.search(state)
});

const mapDispatchToProps = dispatch => ({
  submitSearch: bindActionCreators(searchActions.submitSearch, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);