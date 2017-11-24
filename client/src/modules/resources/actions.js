import { createAction } from 'redux-actions';
import * as ResourceConstants from './constants';

// Create Form Actions
export const toggleBulkImportForm = createAction(ResourceConstants.TOGGLE_BULK_IMPORT_FORM);
export const toggleDataImportForm = createAction(ResourceConstants.TOGGLE_DATA_IMPORT_FORM);
export const toggleResourceDetail = createAction(ResourceConstants.TOGGLE_RESOURCE_DETAIL);

// Add to Database
export const addBulkResourceSuccess = createAction(ResourceConstants.ADD_BULK_IMPORT, resources => ({ resources }));
export const addResourceSuccess = createAction(ResourceConstants.ADD_DATA_IMPORT, resource => ({ resource }));
export const updateResource = createAction(ResourceConstants.UPDATE_DATA_IMPORT, resource => ({ resource }));

export const setEditResource = createAction(ResourceConstants.SET_EDIT_RESOURCE, id => ({ id }));
export const deleteResource = createAction(ResourceConstants.DELETE_RESOURCE, id => ({ id }));
export const setDetailResource = createAction(ResourceConstants.SET_DETAIL_RESOURCE, id => ({ id }));

export const fetchResourcesSuccess = createAction(ResourceConstants.FETCH_RESOURCES, resources => ({ resources }));

export const fetchResources = () => async dispatch => {
  try {
    let response = await fetch('http://localhost:3000/api/');
    let data = await response.json();
    return dispatch(fetchResourcesSuccess(data));
  } catch (error) {
    throw new Error(error);
  }
};

export const addDataImport = (resource) => async dispatch => {
  try {
    let response = await fetch('http://localhost:3000/api/resource_upload', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resource: resource })
    });
    let data = await response.json();
    resource.id = data.resource_id;
    return dispatch(addResourceSuccess(resource));
  } catch (error) {
    throw new Error(error);
  }
}

export const addBulkImport = (data) => async dispatch => {
  try {
    let formData = new FormData();
    formData.append('resources', data.file);
    formData.append('location', data.location);

    // console.log('data', data, formData);

    // console.log('json', );

    let response = await fetch('http://localhost:3000/api/bulk_resource_upload', {
      method: 'post',
      body: formData
    });
    let info = await response.json();
    return dispatch(addBulkResourceSuccess(info.resources));
  } catch (error) {
    throw new Error(error);
  }
}