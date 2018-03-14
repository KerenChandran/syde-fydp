import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { compose, withProps, withStateHandlers } from 'recompose';

import IconButton from 'material-ui/IconButton';

import DetailsIcon from 'material-ui-icons/Details';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';

class LocationMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: props.resources
    }
  }

  handleDetails = id => () => {
    this.handleViewToggle(id);
    this.props.showDetailsForm(id);
  }

  handleEdit = id => () => {
    this.handleViewToggle(id);
    this.props.showEditForm(id);
  }

  handleDelete = id => () => {
    this.handleViewToggle(id);
    this.props.deleteResource(id);
  }

  handleViewToggle = id => () => {
    const { resources } = this.state;
    let index = -1;

    resources.find((resource, i) => {
      if (resource.id == id) {
        index = i;
        return true;
      }
      return false;
    });

    let updatedResource = { ...resources[index] };
    updatedResource.openMarker = true;

    this.setState({
      resources: [...resources.slice(0, index), updatedResource, ...resources.slice(index + 1)]
    })
  }

  render() {
    const { currentUserId } = this.props;
    const { resources } = this.state;
    return (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 43.4722949, lng: -80.5470497 }}
      >
        { resources.map(resource => {
          if (resource.location.lat == null) {
            return null;
          }

          const {
            id,
            category,
            company,
            model,
            incentive,
            fine,
            available,
            location: {
              lat,
              lng,
              name: locationName
            },
            ownerid
          } = resource;

          const fees = fine !== null ? `$${fine.toFixed(2)}` : fine;
          return (
            <Marker position={{ lat, lng }} onClick={this.handleViewToggle(id)}>
              { !resource.openMarker ? null : (
                <InfoWindow onCloseClick={this.handleViewToggle(id)}>
                  <div>
                    <h2>{`${category} - ${company} ${model}`}</h2>
                    <h4>{locationName}</h4>
                    <p>{`Incentive: ${incentive}`}</p>
                    { fees != null && <p>{`Fees: ${fees}`}</p>}
                    <p>{`Available: ${available}`}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                      { ownerid === currentUserId ? (
                        <div>
                          <IconButton aria-label="Edit" onClick={this.handleEdit(id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton aria-label="Delete" onClick={this.handleDelete(id)}>
                            <DeleteIcon />
                          </IconButton>
                        </div> ) : (
                          <IconButton aria-label="Details" onClick={this.handleDetails(id)}>
                            <DetailsIcon />
                          </IconButton>
                        )}
                    </div>
                  </div>
              </InfoWindow>
              )}
            </Marker>
          );
        })}
      </GoogleMap>
    )
  }
}

export default compose(
  withProps({
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: '500px' }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withGoogleMap
)(LocationMap);
