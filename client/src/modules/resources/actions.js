import { createAction } from 'redux-actions';
import * as ResourceConstants from './constants';
import StaticRouter from 'react-router/StaticRouter';

// Create Form Actions
export const toggleBulkImportForm = createAction(ResourceConstants.TOGGLE_BULK_IMPORT_FORM);
export const toggleDataImportForm = createAction(ResourceConstants.TOGGLE_DATA_IMPORT_FORM);
export const toggleResourceDetail = createAction(ResourceConstants.TOGGLE_RESOURCE_DETAIL);

// Add to Database
export const addBulkResourceSuccess = createAction(ResourceConstants.ADD_BULK_IMPORT, resources => ({ resources }));
export const addResourceSuccess = createAction(ResourceConstants.ADD_DATA_IMPORT, resource => ({ resource }));
export const updateResourceSucesses = createAction(ResourceConstants.UPDATE_DATA_IMPORT, resource => ({ resource }));

export const setEditResource = createAction(ResourceConstants.SET_EDIT_RESOURCE, id => ({ id }));
export const deleteResource = createAction(ResourceConstants.DELETE_RESOURCE, id => ({ id }));
export const setDetailResource = createAction(ResourceConstants.SET_DETAIL_RESOURCE, id => ({ id }));

export const fetchResourcesSuccess = createAction(ResourceConstants.FETCH_RESOURCES, resources => ({ resources }));

export const fetchResources = () => async dispatch => {
  try {
    let response = await fetch('http://localhost:3000/api/get_resources', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resource_list: [] })
    });
    let data = await response.json();
    return dispatch(fetchResourcesSuccess(data));
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchResource = (id) => async dispatch => {
  try {
    let response = await fetch('http://localhost:3000/api/get_resources', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resource_list: [id] })
    });
    let data = await response.json();
    return dispatch(updateResourceSucesses(data));
  } catch (error) {
    throw new Error(error);
  }
};

export const addDataImport = (resource, history) => async dispatch => {
  try {
    let updateFlag = true;
    if (resource.resource_id === undefined) {
      delete resource['resource_id'];
      updateFlag = false;
    }
    let response = await fetch('http://localhost:3000/api/upload_resource', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resource: resource })
    });
    let data = await response.json();
    resource.resource_id = data.resource_id;
    if (updateFlag) {
      dispatch(updateResourceSucesses(resource));
      return history.push('/resources/');
    }
    dispatch(addResourceSuccess(resource));
    return history.push(`/resources/${data.resource_id}/availability`);
  } catch (error) {
    throw new Error(error);
  }
}

export const addBulkImport = (data) => async dispatch => {
  try {
    let formData = new FormData();
    formData.append('resources', data.file);
    formData.append('location', JSON.stringify(data.location));

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

export const initialAvailability = (availability) => async dispatch => {
  try {
    let response = await fetch('http://localhost:3000/api/submit_initial_availability', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(availability)
    });
    let data = await response.json();
  } catch (error) {
    throw new Error(error);
  }
}