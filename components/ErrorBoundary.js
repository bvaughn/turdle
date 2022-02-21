import { Component } from "react";
import Icon from "./Icon";
import { localStorageRemoveItem } from "../utils/localStorage";
import {
  LOCAL_STORAGE_SETTINGS,
  LOCAL_STORAGE_KEY_GAME_STATS,
} from "../constants";
import styles from "./ErrorBoundary.module.css";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };

    this._resetLocalStorage = this._resetLocalStorage.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { children, Fallback } = this.props;

    if (error) {
      return (
        <Fallback>
          <div className={styles.Error} data-testname="ErrorBoundary">
            <div className={styles.Paragrah}>
              <h1>Something went wrong</h1>
              <div className={styles.ErrorMessage}>{error.message}</div>
            </div>

            <div className={styles.Paragrah}>
              This sometimes indicates a corrupt user session.
            </div>

            <div className={styles.Paragrah}>
              You can reset session data by clicking below.
            </div>

            <button
              className={styles.Button}
              data-testname="DeleteSessionDataButton"
              onClick={this._resetLocalStorage}
            >
              Delete session data{" "}
              <Icon className={styles.ButtonIcon} type="delete" />
            </button>
          </div>
        </Fallback>
      );
    } else {
      return children;
    }
  }

  _resetLocalStorage() {
    localStorageRemoveItem(LOCAL_STORAGE_SETTINGS);
    localStorageRemoveItem(LOCAL_STORAGE_KEY_GAME_STATS);

    this.setState({ error: null });
  }
}
