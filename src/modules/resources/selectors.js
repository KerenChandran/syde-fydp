import { createSelector } from 'reselect';
import { currentUserId } from '../users/selectors';
import { search } from '../search/selectors';

export const resources = state => state.resources.resources.slice(0, 50);
export const filteredResources = createSelector(resources, search, (resources, search) => {
  const { searchText, available, mobile, incentive, fees, feesRange } = search;
  if ((searchText === '' || searchText === null) &&
      available === null &&
      mobile === null &&
      incentive === null &&
      fees === null) {
    return resources;
  }

  const operator = {
    '=': (x, y) => x == y,
    '<=': (x, y) => x <= y,
    '>=': (x, y) => x >= y 
  };

  return resources.filter(resource => {
    const searchTextCheck = (searchText === '' || searchText === null) ||
                            resource.category.indexOf(searchText) > -1 ||
                            resource.company.indexOf(searchText) > -1 ||
                            resource.model.indexOf(searchText) > -1 ||
                            resource.location.indexOf(searchText) > -1;
    
    const availableCheck = available === null || resource.available === available;
    const mobileCheck = mobile === null || resource.mobile === mobile;
    const incentiveCheck = incentive === null || resource.incentive === incentive;
    const feesCheck = fees === null || (incentive === 'User Fees' && operator[feesRange](resource.fine, fees));

    return searchTextCheck && availableCheck && mobileCheck && incentiveCheck && feesCheck;
  });
})

export const userResources = (resources, userId) => (
  resources.filter(resource => resource.ownerId === userId)
);
export const currentUserResources = createSelector(filteredResources, currentUserId, userResources);

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
