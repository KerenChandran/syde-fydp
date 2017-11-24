import React, { Component } from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox';
import TextField from 'material-ui/TextField';

import './index.css';

class LocationSearchBox extends Component {
  state = {
    location: '',
  };

  onSearchBoxMounted = (ref) => {
    this.searchBox = ref;
  }

  onPlacesChanged = () => {
    const places = this.searchBox.getPlaces();
    if (places == null) {
      return;
    }
    this.props.updateLocation({
      placeId: places[0].place_id,
      name: places[0].name,
      lat: places[0].geometry.location.lat(),
      lng: places[0].geometry.location.lng()
    });
  }

  // onLocationChange = (event) => {
  //   this.setState({
  //     location: event.target.value
  //   });
  //   this.onPlacesChanged();
  // }

  render() {
    const { bounds, location } = this.props;
    return (
      <div data-standalone-searchbox="">
        <StandaloneSearchBox
          ref={this.onSearchBoxMounted}
          bounds={bounds}
          onPlacesChanged={this.onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Location"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
            }}
          />
        </StandaloneSearchBox>
      </div>
    );
  }
}

LocationSearchBox.defaultProps = {
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div style={{ height: `100%` }} />
}

export default LocationSearchBox;

/*
  <TextField
            fullWidth
            label="Location"
            onChange={this.onLocationChange}
            value={location}
          />
  

*/