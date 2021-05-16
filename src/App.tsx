import React from 'react';
import { CustomTable } from './components/Table';

import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <Router>
      <Switch>
          <Route path="/table">
            <CustomTable />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/">
            <CustomTable />
          </Route>
      </Switch>
    </Router>
  );
}

export default App;
