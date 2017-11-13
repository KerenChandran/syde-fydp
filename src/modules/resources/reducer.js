import data from './data.json';
import * as ResourceConstants from './constants';

const initialState = {
  resources: data.resources,
  showDataImport: false,
  showBulkImport: false,
  editResourceId: null
};

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case ResourceConstants.ADD_BULK_IMPORT: {
      let { resources, ...others } = state;
      let newResources = {
        ...resources,
        ...payload
      }
      return {
        resources: newResources,
        ...others
      };
    }

    case ResourceConstants.ADD_DATA_IMPORT: {
      let { resources, ...others } = state;
      let newResources = {
        ...resources,
        payload
      }
      return {
        resources: newResources,
        ...others
      };
    }

    case ResourceConstants.TOGGLE_DATA_IMPORT_FORM: {
      return {
        ...state,
        showDataImport: !state.showDataImport
      }
    }

    case ResourceConstants.TOGGLE_BULK_IMPORT_FORM: {
      return {
        ...state,
        showBulkImport: !state.showBulkImport
      }
    }

    case ResourceConstants.DELETE_RESOURCE: {
      const { resources, ...others } = state;
      const newResources = resources.filter((element, index) => index !== payload);
      return {
        resources: newResources,
        ...others
      };
    }

    case ResourceConstants.SET_EDIT_RESOURCE: {
      return {
        ...state,
        showDataImport: true,
        editResourceId: payload
      };
    }

    default:
      return state;
  }
}