import { createSelector } from 'reselect';
import { currentUserId } from '../users/selectors';

export const resources = (state) => state.resources.resources;
export const userResources = (resources, userId) => (
  resources.filter(resource => resource.ownerId === userId)
);
export const currentUserResources = createSelector(resources, currentUserId, userResources);

export const editResourceId = state => state.resources.editResourceId;
export const getEditResource = createSelector(resources, editResourceId, (resources, editResourceId) => (
  resources.filter((resource, index) => index === editResourceId)[0]
));

export const showBulkImport = state => state.resources.showBulkImport;
export const showDataImport = state => state.resources.showDataImport;
