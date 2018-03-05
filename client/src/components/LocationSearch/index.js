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
          placeId,
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
      onChange: this.handleChange
    };
    
    const classes = {
      input: 'form-control',
      autocompleteContainer: 'location__autocomplete-container',
    };

    return (
      <PlacesAutocomplete
        inputProps={inputProps}
        classNames={classes}
        onSelect={this.handleSelect}
        renderSuggestion={LocationSuggestion}
        renderFooter={LocationFooter}
      />
    );
  }
}

export default LocationSearch;