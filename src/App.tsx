import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact={true} component={HomePage} />
            <Route path="/login" exact={true} component={LoginPage} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
