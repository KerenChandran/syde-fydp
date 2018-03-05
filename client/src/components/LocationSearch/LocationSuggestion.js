import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faMapMarker } from '@fortawesome/fontawesome-free-solid';

export default ({ formattedSuggestion }) => (
  <div className="location__suggestion-item">
    <FontAwesomeIcon icon={faMapMarker} className="location__suggestion-icon" />
    <strong>{formattedSuggestion.mainText}</strong>{' '}
    <small className="text-muted">{formattedSuggestion.secondaryText}</small>
  </div>
);