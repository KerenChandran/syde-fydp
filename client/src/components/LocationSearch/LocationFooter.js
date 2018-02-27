import React from 'react';
import googleLogo from './powered_by_google_default.png';

export default () => (
  <div className="location__dropdown-footer">
    <div>
      <img src={googleLogo} className="location__dropdown-footer-image" />
    </div>
  </div>
);