import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './pages/main/Main';
import Home from './pages/home/Home';
import { FirebaseDatabaseProvider } from '@react-firebase/database';
import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAp9j7bZz1OXvO8ZJElH36pKarkLQdOg-o',
  authDomain: 'inf3995-100.firebaseapp.com',
  databaseURL: 'https://inf3995-100-default-rtdb.firebaseio.com',
  projectId: 'inf3995-100',
  storageBucket: 'inf3995-100.appspot.com',
  messagingSenderId: '749259130279',
  appId: '1:749259130279:web:69ae347d4cdfa89418e282',
};

ReactDOM.render(
  <React.StrictMode>
    <FirebaseDatabaseProvider firebase={firebase} {...firebaseConfig}>
      <Router>
        <Switch>
          <Route path="/explore/:mapId">
            <Main />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </FirebaseDatabaseProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
