import React from 'react';
import ReactDOM from 'react-dom';

// Importing RIF UI stylesheet which cointains bootstrap css already
import 'rifui/css/extra.css';
import 'rifui/css/style.css';
import 'style.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
