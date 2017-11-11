import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux'

import './index.css';
import Router from './router';
import store from './store';
import registerServiceWorker from './registerServiceWorker';

const history = createBrowserHistory();
const storeInstance = store();

ReactDOM.render(
  <Provider store={storeInstance}>
    <Router history={history} />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
