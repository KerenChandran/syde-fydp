import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, matchPath } from 'react-router';
import moment from 'moment';

import { searchActions, searchSelectors } from '../modules/search';
import { resourceActions } from '../modules/resources';

import SearchBar from '../components/Search';
import ResourceSearchFilters from '../components/ResourceSearchFilters';

const LABS = 'LABS';
const RESOURCES = 'RESOURCES';

class Search extends Component {
  state = {
    currentPath: RESOURCES
  }
  
  submitSearch = async (search) => {
    switch (this.state.currentPath) {
      case LABS: {
        return 'hi';
      }
      case RESOURCES: 
      default: {
        const { window_start, window_end, type, quantity, ...others } = search;
        if (window_start != null && window_end != null && quantity > 0) {
          await this.props.submitResourceAvailability({
            window_start: moment(window_start).format('YYYY-MM-DD'),
            window_end: moment(window_end).format('YYYY-MM-DD'),
            preferred_duration: {
              type,
              quantity
            }
          });
        } else {
          await this.props.fetchResources();
        }
        return this.props.submitResourceSearch(others);
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
    
    if (pathname !== '/resources/myresources' && pathname !== '/resources') {
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
  fetchResources: bindActionCreators(resourceActions.fetchResources, dispatch),
  submitResourceSearch: bindActionCreators(searchActions.submitResourceSearch, dispatch),
  submitResourceAvailability: bindActionCreators(resourceActions.fetchScheduleFilterResources, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search));