export const search = state => state.search;
export const filters = state => {
  const { searchText, ...others } = state.search;
  return others;
}