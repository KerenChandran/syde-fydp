import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import rootReducer from './modules/reducer';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import './css/bootstrap-flat.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-widgets/dist/css/react-widgets.css';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.css';

import Router from './router';
import registerServiceWorker from './registerServiceWorker';

const history = createHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const storeInstance = createStore(rootReducer, {}, composeEnhancers(
  applyMiddleware(thunk, routerMiddleware(history))
));

const theme = createMuiTheme();

ReactDOM.render(
  <Provider store={storeInstance}>
    <MuiThemeProvider theme={theme}>
      <Router history={history}/>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
