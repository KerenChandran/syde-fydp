export const resourceSearch = state => state.search.resources;
export const resourceFilters = state => {
  const { searchText, ...others } = state.search.resources
  return others;
};