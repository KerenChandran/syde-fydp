import { createAction } from 'redux-actions';
import * as ResourceConstants from './constants';

// Create Form Actions
export const toggleBulkImportForm = createAction(ResourceConstants.TOGGLE_BULK_IMPORT_FORM);
export const toggleDataImportForm = createAction(ResourceConstants.TOGGLE_DATA_IMPORT_FORM);
export const toggleResourceDetail = createAction(ResourceConstants.TOGGLE_RESOURCE_DETAIL);

// Add to Database
export const addBulkImport = createAction(ResourceConstants.ADD_BULK_IMPORT);
export const addDataImport = createAction(ResourceConstants.ADD_DATA_IMPORT, resource => ({ resource }));
export const updateResource = createAction(ResourceConstants.UPDATE_DATA_IMPORT, resource => ({ resource }));

export const setEditResource = createAction(ResourceConstants.SET_EDIT_RESOURCE, id => ({ id }));
export const deleteResource = createAction(ResourceConstants.DELETE_RESOURCE, id => ({ id }));
export const setDetailResource = createAction(ResourceConstants.SET_DETAIL_RESOURCE, id => ({ id }));
