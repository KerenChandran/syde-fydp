import { createSelector } from 'reselect';
import { currentUserId } from '../users/selectors';

export const resources = (state) => state.resources.resources.slice(0, 50);
export const userResources = (resources, userId) => (
  resources.filter(resource => resource.ownerId === userId)
);
export const currentUserResources = createSelector(resources, currentUserId, userResources);

export const editResourceId = state => state.resources.editResourceId;
export const getEditResource = createSelector(resources, editResourceId, (resources, editResourceId) => (
  resources.filter((resource) => resource.id === editResourceId)[0]
));

export const detailResourceId = state => state.resources.detailResourceId;
export const getDetailResource = createSelector(resources, detailResourceId, (resources, detailResourceId) => (
  resources.filter((resource) => resource.id === detailResourceId)[0]
));

export const showBulkImport = state => state.resources.showBulkImport;
export const showDataImport = state => state.resources.showDataImport;
export const showDetailsResource = state => state.resources.showDetailsResource;
