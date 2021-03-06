import { createSelector } from 'reselect';
import { currentUserId } from '../users/selectors';
import { resourceSearch } from '../search/selectors';

export const resources = state => state.resources.resources;
export const filteredResources = createSelector(resources, resourceSearch, (resources, search) => {
  const { searchText, category, company, mobile, model } = search;
  if ((searchText === '' || searchText === null) &&
      category === '' &&
      company === '' &&
      mobile === '' &&
      model === '') {
    return resources;
  }

  const lowerSearchText = searchText.toLowerCase();
  const lowerCategoryText = category.toLowerCase();
  const lowerCompanyText = company.toLowerCase();
  const lowerModelText = model.toLowerCase();
  const mobileValue = mobile === 'true';

  return resources.filter(resource => {
    const searchTextCheck = (lowerSearchText === '' || lowerSearchText === null) ||
                            resource.category.toLowerCase().indexOf(lowerSearchText) > -1 ||
                            resource.company.toLowerCase().indexOf(lowerSearchText) > -1 ||
                            resource.model.toLowerCase().indexOf(lowerSearchText) > -1;

    const categoryCheck = (lowerCategoryText === '' || lowerCategoryText === null) ||
                          resource.category.toLowerCase().indexOf(lowerCategoryText) > -1;
    
    const companyCheck = (lowerCompanyText === '' || lowerCompanyText === null) ||
                          resource.company.toLowerCase().indexOf(lowerCompanyText) > -1;
    
    const mobileCheck = mobile === '' || resource.mobile == mobileValue;

    const modelCheck = (lowerModelText === '' || lowerModelText === null) ||
                          resource.model.toLowerCase().indexOf(lowerModelText) > -1;

    return searchTextCheck && categoryCheck && companyCheck && mobileCheck && modelCheck;
  });
});

export const userResources = (resources, userId) => (
  resources.filter(resource => resource.ownerid === userId)
);
export const currentUserResources = createSelector(filteredResources, currentUserId, userResources);

export const getResource = (state, id) => {
  if (id == null) {
    return {};
  }
  let allResources = resources(state);
  return allResources.find((resource) => resource.resource_id == id);
}

export const showBulkImport = state => state.resources.showBulkImport;
export const showDataImport = state => state.resources.showDataImport;
export const showDetailsResource = state => state.resources.showDetailsResource;

export const resourceOwnedByCurrentUser = (state, id) => {
  const resource = getResource(state, id);
  if (resource) {
    return resource.ownerid === currentUserId(state)
  }
};

export const getFiles = state => state.resources.files;
export const getImages = state => state.resources.images;

export const getResourceFiles = (state, id) => state.resources.files[id] || [];
export const getResourceImages = (state, id) => state.resources.images[id] || [];

export const getNewResource = state => state.resources.newResource;