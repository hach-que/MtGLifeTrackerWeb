import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import 'reactstrap';
import * as ls from 'local-storage';
import LifeTracker from './routes/LifeTracker';
import SelectServer from './routes/SelectServer';
import { AppState } from './AppState';
import { Route } from 'react-router';

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      serverUrl: ls.get('serverUrl') as string | undefined,
      loginCallback: (serverUrl: string) => {
        this.handleLogin(serverUrl);
      }
    };
  }

  handleLogin(serverUrl: string) {
    ls.set('serverUrl', serverUrl);
    this.setState({
      serverUrl: serverUrl
    });
  }

  render() {
    let mainRoute = (
      <Route
        exact={true}
        path="/"
        render={() => {
          return <SelectServer appState={this.state} />;
        }}
      />
    );
    if (this.state.serverUrl !== undefined &&
        this.state.serverUrl !== null &&
        this.state.serverUrl !== '') {
      mainRoute = (
        <Route
          exact={true}
          path="/"
          render={() => {
            return <LifeTracker appState={this.state} />;
          }}
        />
      );
    }

    return (
      <div>
        <div className="container">
          {mainRoute}
        </div>
      </div>
    );
  }
}

export default App;
