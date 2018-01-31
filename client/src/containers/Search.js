import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, matchPath } from 'react-router';
import { searchActions, searchSelectors } from '../modules/search';

import SearchBar from '../components/Search';
import ResourceSearchFilters from '../components/ResourceSearchFilters';
import { PageHeader } from 'react-bootstrap';

const LABS = 'LABS';
const RESOURCES = 'RESOURCES';

class Search extends Component {
  state = {
    currentPath: RESOURCES
  }
  
  submitSearch = (search) => {
    switch (this.state.currentPath) {
      case LABS: {
        return 'hi';
      }
      case RESOURCES: 
      default: {
        return this.props.submitResourceSearch(search);
      }
    }
  }

  currentParams = () => {
    const { resourceSearch } = this.props;
    let { searchText, ...filters } = resourceSearch;

    return {
      searchText,
      filters
    };
  }

  render() {
    const { resourceSearch, history } = this.props;
    let { searchText, ...filters } = resourceSearch;
    let { pathname } = history.location;

    console.log('matchPath', matchPath(pathname, {
      path: '/resources/myresources',
      exact: true,
      strict: false
    }));

    console.log('this.props', this.props);
    
    if (pathname.indexOf('new') > -1 || pathname.indexOf('edit') > -1) {
      return null;
    }

    return (
      <SearchBar submitSearch={this.submitSearch} searchText={searchText} filters={filters}>
        {
          this.state.currentPath === RESOURCES && <ResourceSearchFilters />
        }
      </SearchBar>
    );
  }
}

const mapStateToProps = state => ({
  resourceSearch: searchSelectors.resourceSearch(state)
});

const mapDispatchToProps = dispatch => ({
  submitResourceSearch: bindActionCreators(searchActions.submitResourceSearch, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search));