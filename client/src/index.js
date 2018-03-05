import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import './css/bootstrap-flat.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-widgets/dist/css/react-widgets.css';

import Router from './router';
import store from './store';
import registerServiceWorker from './registerServiceWorker';

const storeInstance = store();
const theme = createMuiTheme();

ReactDOM.render(
  <Provider store={storeInstance}>
    <MuiThemeProvider theme={theme}>
      <Router />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
