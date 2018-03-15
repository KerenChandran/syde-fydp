export const getRequestIncentive = state => state.request.incentive;
export const getRequests = state => state.request.requests;

export const getResourceRequests = state => {
  const { resources: {resources} , request: {requests} } = state;
  return requests.map(request => {
    const resource = resources.find(resource => resource.resource_id === request.resource_id);
    return {
      ...resource,
      ...request
    };
  });
}
export const getRequest = (state, id) => {
  const request = state.request.requests.find(request => request.id == id);
  const resource = state.resources.resources.find(resource => resource.resource_id == request.resource_id);

  return {
    ...resource,
    ...request
  };
}

export const getRequestTotal = state => state.request.fee_total;