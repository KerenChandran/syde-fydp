import data from './data_modified.json';
import * as ResourceConstants from './constants';

const initialState = {
  resources: data.resources,
  showDataImport: false,
  showBulkImport: false,
  editResourceId: null,
  detailResourceId: null,
  showDetailsResource: false
};

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case ResourceConstants.ADD_BULK_IMPORT: {
      let { resources, ...others } = state;
      let newResources = [
        ...resources,
        ...payload
      ];
      return {
        resources: newResources,
        ...others
      };
    }

    case ResourceConstants.ADD_DATA_IMPORT: {
      let { resources, ...others } = state;
      payload.resource.id = resources.length;
      let newResources = [
        ...resources,
        payload.resource
      ];
      return {
        resources: newResources,
        ...others
      };
    }

    case ResourceConstants.UPDATE_DATA_IMPORT: {
      let { resources, ...others } = state;
      let foundIndex = -1;

      resources.find((resource, index) => {
        if (resource.id === payload.resource.id) {
          foundIndex = index;
          return true;
        }
      });

      let newResources = [
        ...resources.slice(0, foundIndex),
        payload.resource,
        ...resources.slice(foundIndex + 1)
      ];

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
      const newResources = resources.filter((resource) => resource.id !== payload.id);
      return {
        resources: newResources,
        ...others
      };
    }

    case ResourceConstants.SET_EDIT_RESOURCE: {
      return {
        ...state,
        showDataImport: true,
        editResourceId: payload.id
      };
    }

    case ResourceConstants.TOGGLE_RESOURCE_DETAIL: {
      return {
        ...state,
        showDetailsResource: !state.showDetailsResource
      }
    }

    case ResourceConstants.SET_DETAIL_RESOURCE: {
      return {
        ...state,
        showDetailsResource: true,
        detailResourceId: payload.id
      }
    }

    default:
      return state;
  }
}