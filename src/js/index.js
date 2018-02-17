import 'whatwg-fetch';
import { polyfill as promisePolyfill } from 'es6-promise';

import React from 'react';
import ReactDOM from 'react-dom';

import '../scss/index.scss';

import App from './App';
import * as firebase from 'firebase';

// const config = {
//   apiKey: process.env.FIREBASE.apiKey,
//   authDomain: process.env.FIREBASE.authDomain,
//   databaseURL: process.env.FIREBASE.databaseURL,
//   projectId: process.env.FIREBASE.projectId,
//   storageBucket: process.env.FIREBASE.storageBucket,
//   messagingSenderId: process.env.FIREBASE.messagingSenderId
// };
// firebase.initializeApp(config);

promisePolyfill();

const element = document.getElementById('content');
ReactDOM.render(<App />, element);

document.body.classList.remove('loading');
