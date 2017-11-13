import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import './index.css';
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
