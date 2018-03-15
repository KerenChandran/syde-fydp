/* global google */
import React, { Component } from 'react';
import PlacesAutocomplete, { geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';

import LocationSuggestion from './LocationSuggestion';
import LocationFooter from './LocationFooter';

import './index.css';

class LocationSearch extends Component {
  handleChange = name => {
    this.props.onChange({ name })
  }
  
  handleSelect = (address, placeId) => {
    geocodeByPlaceId(placeId)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        this.props.onChange({
          placeid: placeId,
          latitude: lat,
          longitude: lng,
          name: address
        })
      })
      .catch(error => console.error(error));
  }

  render() {
    const { location } = this.props;
    const inputProps = {
      value: location ? location.name : '',
      onChange: this.handleChange,
      required: true
    };
    
    const classes = {
      input: 'form-control',
      autocompleteContainer: 'location__autocomplete-container',
    };

    const options = {
      location: new google.maps.LatLng(43.467998128, -80.537331184),
      radius: 2000,
      types: ['address']
    };

    return (
      <PlacesAutocomplete
        inputProps={inputProps}
        classNames={classes}
        onSelect={this.handleSelect}
        renderSuggestion={LocationSuggestion}
        renderFooter={LocationFooter}
        options={options}
      />
    );
  }
}

export default LocationSearch;