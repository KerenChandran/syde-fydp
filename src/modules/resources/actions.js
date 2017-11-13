import { createAction } from 'redux-actions';
import * as ResourceConstants from './constants';

// Create Form Actions
export const toggleBulkImportForm = createAction(ResourceConstants.TOGGLE_BULK_IMPORT_FORM);
export const toggleDataImportForm = createAction(ResourceConstants.TOGGLE_DATA_IMPORT_FORM);

// Add to Database
export const addBulkImport = createAction(ResourceConstants.ADD_BULK_IMPORT);
export const addDataImport = createAction(ResourceConstants.ADD_DATA_IMPORT);

export const setEditResource = createAction(ResourceConstants.SET_EDIT_RESOURCE);
export const deleteResource = createAction(ResourceConstants.DELETE_RESOURCE)