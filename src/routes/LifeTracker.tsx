import * as React from 'react';
import { AppState } from '../AppState';
import * as request from 'request-promise-native';
import { LifeCounter } from '../components/LifeCounter';

interface Props {
  appState: AppState;
}

interface State {
  playerOne: number;
  playerTwo: number;
  playerThree: number;
  playerFour: number;
  playerOnePendingChanges: number;
  playerTwoPendingChanges: number;
  playerThreePendingChanges: number;
  playerFourPendingChanges: number;
  loading: boolean;
  readonly: boolean;
  error?: string;
}

interface TotalsSummary {
  player1: number;
  player2: number;
  player3: number;
  player4: number;
}

export default class LifeTracker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      playerOne: 0,
      playerTwo: 0,
      playerThree: 0,
      playerFour: 0,
      playerOnePendingChanges: 0,
      playerTwoPendingChanges: 0,
      playerThreePendingChanges: 0,
      playerFourPendingChanges: 0,
      loading: false,
      readonly: false,
      error: undefined,
    };
  }

  public componentWillMount() {
    this.doInitialLoad();
  }

  public doInitialLoad = async () => {
    this.setState({
      loading: true,
      readonly: true,
      error: undefined,
    });
    try {
      const result = await request(this.props.appState.serverUrl + '/totals.json');
      const resultParsed = JSON.parse(result) as TotalsSummary;
      this.setState({
        loading: false,
        readonly: false,
        playerOne: resultParsed.player1,
        playerTwo: resultParsed.player2,
        playerThree: resultParsed.player3,
        playerFour: resultParsed.player4,
      });
    } catch (err) {
      this.setState({
        loading: false,
        readonly: false,
        error: err.toString(),
      });
    }
  }

  public modify = async (player: number, change: number) => {
    this.setState({
      loading: true,
      error: undefined,
    });
    this.adjustPending(player, change);
    try {
      const result = await request(this.props.appState.serverUrl + '/set', {
        method: 'POST',
        body: {
          player: player,
          change: change,
          commander: 0,
        },
        json: true,
      }) as TotalsSummary;
      this.setState({
        loading: false,
        playerOne: result.player1,
        playerTwo: result.player2,
        playerThree: result.player3,
        playerFour: result.player4,
      });
      this.adjustPending(player, -change);
    } catch (err) {
      this.setState({
        loading: false,
        error: err.toString(),
      });
      this.adjustPending(player, -change);
    }
  }

  public render() {
    let loading: JSX.Element | null = null;
    let error: JSX.Element | null = null;
    if (this.state.loading) {
      loading = (
        <div className="mt-4">
          <i className="fa fa-spinner fa-spin" /> Loading from server...
        </div>
      );
    }
    if (this.state.error) {
      error = (
        <div className="alert alert-danger mt-4" role="alert">
          {this.state.error.split('\n').map((item, key) => {
            return <span key={key}>{item}<br/></span>;
          })}
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="col-12 col-lg-6 mb-4">
            <LifeCounter
              playerNumber="1"
              readonly={this.state.readonly}
              value={this.state.playerOne}
              increment={() => {
                this.modify(1, 1);
              }}
              decrement={() => {
                this.modify(1, -1);
              }}
            />
          </div>
          <div className="col-12 col-lg-6 mb-4">
            <LifeCounter
              playerNumber="2"
              readonly={this.state.readonly}
              value={this.state.playerTwo}
              increment={() => {
                this.modify(2, 1);
              }}
              decrement={() => {
                this.modify(2, -1);
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6 mb-4">
            <LifeCounter
              playerNumber="3"
              readonly={this.state.readonly}
              value={this.state.playerThree}
              increment={() => {
                this.modify(3, 1);
              }}
              decrement={() => {
                this.modify(3, -1);
              }}
            />
          </div>
          <div className="col-12 col-lg-6 mb-4">
            <LifeCounter
              playerNumber="4"
              readonly={this.state.readonly}
              value={this.state.playerFour}
              increment={() => {
                this.modify(4, 1);
              }}
              decrement={() => {
                this.modify(4, -1);
              }}
            />
          </div>
        </div>
        {error}
        {loading}
      </div>
    );
  }
  
  private adjustPending = (player: number, change: number) => {
    switch (player) {
      case 1:
        this.setState({
          playerOnePendingChanges: this.state.playerOnePendingChanges + change,
        });
        break;
      case 2:
        this.setState({
          playerTwoPendingChanges: this.state.playerTwoPendingChanges + change,
        });
        break;
      case 3:
        this.setState({
          playerThreePendingChanges: this.state.playerThreePendingChanges + change,
        });
        break;
      case 4:
        this.setState({
          playerFourPendingChanges: this.state.playerFourPendingChanges + change,
        });
        break;
      default:
        break;
    }
  }
}