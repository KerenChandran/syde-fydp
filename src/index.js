import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import './index.css';
import Router from './router';
import registerServiceWorker from './registerServiceWorker';

const history = createBrowserHistory();

ReactDOM.render(
<Router history={history} />, document.getElementById('root'));
registerServiceWorker();
