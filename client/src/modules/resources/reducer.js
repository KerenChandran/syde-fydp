import * as ResourceConstants from './constants';

const initialState = {
  resources: [],
  files: {},
  images: {},
  showBulkImport: false,
  newResource: {}
};

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case ResourceConstants.ADD_BULK_IMPORT: {
      let { resources, ...others } = state;
      let newResources = [
        ...resources,
        ...payload.resources
      ];
      return {
        resources: newResources,
        ...others
      };
    }

    case ResourceConstants.ADD_DATA_IMPORT: {
      let { resources, ...others } = state;
      let newResources = [
        ...resources,
        {
          ...payload.resource
        }
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
        return false;
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

    case ResourceConstants.FETCH_RESOURCES: {
      return {
        ...state,
        resources: [
          ...payload.resources.resource_data
        ]
      };
    }
    
    case ResourceConstants.FETCH_RESOURCE: {
      const { resources } = state;
      if (!resources.length) {
        return {
          ...state,
          resources: [
            ...payload.resource.resource_data,
          ]
        }
      }

      let idx = -1;
      const res = payload.resource.resource_data[0];

      resources.find((resource, index) => {
        if (resource.resource_id === res.resource_id) {
          idx = index;
          return true;
        }
        return false;
      });

      const newResources = [
        ...resources.slice(0, idx),
        res,
        ...resources.slice(idx + 1)
      ];

      return {
        ...state,
        resources: newResources
      };
    }

    case ResourceConstants.FETCH_RESOURCE_FILES: {
      return {
        ...state,
        files: {
          ...state.files,
          [payload.resource_id]: payload.file_data.file
        },
        images: {
          ...state.images,
          [payload.resource_id]: payload.file_data.resource
        }
      };
    }

    case ResourceConstants.CLEAR_RESOURCES: {
      return {
        ...state,
        resources: []
        files: {},
        images: {}
      }
    }

    case ResourceConstants.SAVE_NEW_RESOURCE: {
      return {
        ...state,
        newResource: payload.resource
      };
    }

    default:
      return state;
  }
}
