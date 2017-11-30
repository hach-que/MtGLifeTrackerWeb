import * as React from 'react';

interface Props {
  playerNumber: string;
  readonly: boolean;
  value: number;
  increment(): void;
  decrement(): void;
}

interface State { }

export class LifeCounter extends React.Component<Props, State> {
  render() {
    return (
      <div className="input-group input-group-lg">
        <span className="input-group-addon" id="sizing-addon1">P{this.props.playerNumber}</span>
        <input
          type="number"
          className="form-control"
          disabled={this.props.readonly}
          value={this.props.value}
        />
        <span className="input-group-btn">
          <button
            className="btn btn-lg btn-success"
            onClick={this.props.increment}
            disabled={this.props.readonly}
          >
            +
          </button>
          <button
            className="btn btn-lg btn-danger"
            onClick={this.props.decrement}
            disabled={this.props.readonly}
          >
            -
          </button>
        </span>
      </div>
    );
  }
}