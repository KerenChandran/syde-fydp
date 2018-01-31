import * as SearchConstants from './constants';

const initialState = {
  resources: {
    searchText: '',
    category: '',
    company: '',
    mobile: '',
    model: ''
  }
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SearchConstants.SUBMIT_RESOURCE_SEARCH: {
      const { resources } = state;
      const updatedResources = {
        ...resources,
        ...payload.search
      }
      return {
        ...state,
        resources: updatedResources
      };
    }
    case SearchConstants.RESET_SEARCH: {
      return initialState;
    }
    default:
      return state;
  }
}