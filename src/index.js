import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.css';
import Router from './router';
import store from './store';
import registerServiceWorker from './registerServiceWorker';

const storeInstance = store();

ReactDOM.render(
  <Provider store={storeInstance}>
    <Router />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
