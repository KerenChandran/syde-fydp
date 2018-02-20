import React, { Component } from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox';
import { FormControl } from 'react-bootstrap';


import './index.css';

class LocationSearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  onSearchBoxMounted = (ref) => {
    this.searchBox = ref;
  }

  onPlacesChanged = () => {
    const places = this.searchBox.getPlaces();
    if (places == null) {
      return;
    }
    this.props.onChange({
      placeId: places[0].place_id,
      name: places[0].name,
      latitude: places[0].geometry.location.lat(),
      longitude: places[0].geometry.location.lng()
    });
  }

  render() {
    const { bounds, value } = this.props;
    const location = typeof value === "object" ? value.formatted_address : value; // TODO: Remove once location format has been finalized

    return (
      <div data-standalone-searchbox="">
        <StandaloneSearchBox
          ref={this.onSearchBoxMounted}
          bounds={bounds}
          onPlacesChanged={this.onPlacesChanged}
        >
          <FormControl type="text" placeholder="Location" value={location}/>
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