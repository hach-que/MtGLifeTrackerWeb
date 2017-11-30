export interface AppState {
  serverUrl?: string;
  loginCallback: (serverUrl: string) => void;
}