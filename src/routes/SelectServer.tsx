import * as React from 'react';
import { AppState } from '../AppState';

interface Props {
  appState: AppState;
}

interface State {
  serverUrl: string;
}

export default class SelectServer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      serverUrl: '',
    };
  }

  render() {
    return (
      <div>
        <h1>MtG Life Tracker</h1>
        <div className="form-group">
          <label>Server URL</label>
          <input 
            type="text" 
            className="form-control" 
            id="serverUrl" 
            placeholder="Enter server URL"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              this.setState({serverUrl: e.target.value});
            }}
            value={this.state.serverUrl}
          />
        </div>
        <button 
          type="submit"
          className="btn btn-primary" 
          onClick={() => {
            this.props.appState.loginCallback(this.state.serverUrl);
          }}
        >
          Set Server
        </button>
      </div>
    );
  }
}