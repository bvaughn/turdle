import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import CopyConfirmationModal from "../components/CopyConfirmationModal";
import EndGameModal from "../components/EndGameModal";
import ErrorBoundary from "../components/ErrorBoundary";
import HelpModal from "../components/HelpModal";
import HistoryModal from "../components/HistoryModal";
import Icon from "../components/Icon";
import Keyboard from "../components/Keyboard";
import SettingsModal from "../components/SettingsModal";
import useGameState from "../hooks/useGameState";
import { copyTextToClipboard } from "../utils/copy";
import { gameStateToCopyString } from "../utils/game";
import useLocalStorage from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY_GAME_STATS } from "../constants";
import styles from "../styles/Home.module.css";

const TITLE = "Turdle";
const DESCRIPTION = "A game about poop";
const URL = "https://turdle.app";
const OG_IMAGE_URL = `${URL}/ogimage.png`;

export async function getServerSideProps({ query }) {
  let wordList = null;
  if (query.wordList) {
    wordList = query.wordList.split(",");
  }

  let wordLength = null;
  if (query.wordLength) {
    wordLength = parseInt(query.wordLength);
  }

  return {
    props: {
      initialWordLength: wordLength,
      initialWordList: wordList,
    },
  };
}

export default function App(props) {
  return (
    <ErrorBoundary Fallback={Fallback}>
      <Home {...props} />
    </ErrorBoundary>
  );
}

function Home({ initialWordLength, initialWordList }) {
  const {
    addPendingGuess,
    deletePendingGuess,
    dismissModal,
    giveHint,
    loadPastGame,
    restart,
    saveSettings,
    state,
    submitPendingGuesses,
  } = useGameState({
    initialWordLength,
    initialWordList,
  });

  const modalContainerRef = useRef(null);

  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const dismissModals = () => {
    setShowCopyConfirmation(false);
    setShowHelp(false);
    setShowHistory(false);
    setShowSettings(false);
  };

  const showHelpModal = () => {
    setShowHelp(true);
  };

  const showHistoryModal = () => {
    setShowHistory(true);
  };

  const showSettingsModal = () => {
    setShowSettings(true);
  };

  const shareGame = () => {
    const textToCopy = gameStateToCopyString(state);
    copyTextToClipboard(textToCopy);
    setShowCopyConfirmation(true);
  };

  const { endGameStatus, isPastGame, wordList } = state;

  const hasMoreWordsToGuess = wordList.length > 0;

  const [gameStats] = useLocalStorage(LOCAL_STORAGE_KEY_GAME_STATS);
  const hasItemsInHistory =
    gameStats && gameStats.history && gameStats.history.length > 0;

  const startNewGame = () => {
    if (isPastGame) {
      restart();
    } else {
      // Save the current word for later if there's still guessing in progress.
      restart(!endGameStatus);
    }
  };

  return (
    <div className={styles.Home}>
      <Head>
        <title>{TITLE}</title>

        <meta name="title" content={TITLE} />
        <meta name="description" content={DESCRIPTION} />

        <link rel="icon" href="/favicons/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#915f38" />
        <meta name="theme-color" content="#ffffff" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE_URL} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={URL} />
        <meta property="twitter:title" content={TITLE} />
        <meta property="twitter:description" content={DESCRIPTION} />
        <meta property="twitter:image" content={OG_IMAGE_URL} />
      </Head>

      <header className={styles.Header}>
        <button
          className={styles.Button}
          data-testname="NewGameButton"
          disabled={!hasMoreWordsToGuess}
          onClick={startNewGame}
          title="Start new game"
        >
          <Icon className={styles.Icon} type="new" />
        </button>

        <button
          className={styles.Button}
          data-testname="HistoryButton"
          disabled={!hasItemsInHistory}
          onClick={showHistoryModal}
          title="View recent games"
        >
          <Icon className={styles.Icon} type="history" />
        </button>

        <button
          className={styles.Button}
          data-testname="ShareButton"
          disabled={!endGameStatus}
          onClick={shareGame}
          title="Share game"
        >
          <Icon className={styles.Icon} type="share" />
        </button>

        <section>
          <a
            className={styles.TitleLink}
            href="https://github.com/bvaughn/turdle"
            rel="noreferrer"
            target="_blank"
          >
            <span className={styles.Turd}>Turd</span>le 💩
          </a>
        </section>

        <button
          className={styles.Button}
          data-testname="SettingsButton"
          onClick={showSettingsModal}
          title="View game settings"
        >
          <Icon className={styles.Icon} type="settings" />
        </button>

        <button
          className={styles.Button}
          data-testname="HelpButton"
          onClick={showHelpModal}
          title="Help"
        >
          <Icon className={styles.Icon} type="help" />
        </button>

        <a
          className={styles.GitHubLink}
          href="https://github.com/bvaughn/turdle"
          rel="noreferrer"
          target="_blank"
          title="View source"
        >
          <GitHubIcon />
        </a>
      </header>

      <div className={styles.Layout} data-testname="Layout">
        <main className={styles.Main}>
          <Grid state={state} />
        </main>

        <footer className={styles.Footer}>
          <Keyboard
            addPendingGuess={addPendingGuess}
            deletePendingGuess={deletePendingGuess}
            giveHint={giveHint}
            modalContainerRef={modalContainerRef}
            restart={restart}
            state={state}
            submitPendingGuesses={submitPendingGuesses}
          />
        </footer>

        <div ref={modalContainerRef} className={styles.Modals}>
          <EndGameModal
            dismissModal={dismissModal}
            restart={restart}
            state={state}
          />

          {showHelp && <HelpModal dismissModal={dismissModals} />}
          {showHistory && (
            <HistoryModal
              dismissModal={dismissModals}
              loadPastGame={loadPastGame}
              state={state}
            />
          )}
          {showCopyConfirmation && (
            <CopyConfirmationModal dismissModal={dismissModals} />
          )}
          {showSettings && (
            <SettingsModal
              dismissModal={dismissModals}
              saveSettings={saveSettings}
              state={state}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Fallback({ children }) {
  return (
    <div className={styles.Home}>
      <header className={styles.Header}>
        <div />
        <div />
        <div />
        <section>
          <a
            className={styles.TitleLink}
            href="https://github.com/bvaughn/turdle"
            rel="noreferrer"
            target="_blank"
          >
            <span className={styles.Turd}>Turd</span>le 💩
          </a>
        </section>
        <div />
        <div />
        <a
          className={styles.GitHubLink}
          href="https://github.com/bvaughn/turdle"
          rel="noreferrer"
          target="_blank"
          title="View source"
        >
          <GitHubIcon />
        </a>
      </header>

      {children}
    </div>
  );
}

const ClientOnlyGrid = dynamic(
  import("../components/Grid")
    .then((Component) => Component)
    .catch((err) => console.log(err)),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

function Grid(props) {
  return <ClientOnlyGrid {...props} />;
}

const GitHubIcon = () => (
  <svg className={styles.GitHubIcon} viewBox="0 0 256 250">
    <path
      fill="currentColor"
      d="M128.00106,0 C57.3172926,0 0,57.3066942 0,128.00106 C0,184.555281 36.6761997,232.535542 87.534937,249.460899 C93.9320223,250.645779 96.280588,246.684165 96.280588,243.303333 C96.280588,240.251045 96.1618878,230.167899 96.106777,219.472176 C60.4967585,227.215235 52.9826207,204.369712 52.9826207,204.369712 C47.1599584,189.574598 38.770408,185.640538 38.770408,185.640538 C27.1568785,177.696113 39.6458206,177.859325 39.6458206,177.859325 C52.4993419,178.762293 59.267365,191.04987 59.267365,191.04987 C70.6837675,210.618423 89.2115753,204.961093 96.5158685,201.690482 C97.6647155,193.417512 100.981959,187.77078 104.642583,184.574357 C76.211799,181.33766 46.324819,170.362144 46.324819,121.315702 C46.324819,107.340889 51.3250588,95.9223682 59.5132437,86.9583937 C58.1842268,83.7344152 53.8029229,70.715562 60.7532354,53.0843636 C60.7532354,53.0843636 71.5019501,49.6441813 95.9626412,66.2049595 C106.172967,63.368876 117.123047,61.9465949 128.00106,61.8978432 C138.879073,61.9465949 149.837632,63.368876 160.067033,66.2049595 C184.49805,49.6441813 195.231926,53.0843636 195.231926,53.0843636 C202.199197,70.715562 197.815773,83.7344152 196.486756,86.9583937 C204.694018,95.9223682 209.660343,107.340889 209.660343,121.315702 C209.660343,170.478725 179.716133,181.303747 151.213281,184.472614 C155.80443,188.444828 159.895342,196.234518 159.895342,208.176593 C159.895342,225.303317 159.746968,239.087361 159.746968,243.303333 C159.746968,246.709601 162.05102,250.70089 168.53925,249.443941 C219.370432,232.499507 256,184.536204 256,128.00106 C256,57.3066942 198.691187,0 128.00106,0 Z M47.9405593,182.340212 C47.6586465,182.976105 46.6581745,183.166873 45.7467277,182.730227 C44.8183235,182.312656 44.2968914,181.445722 44.5978808,180.80771 C44.8734344,180.152739 45.876026,179.97045 46.8023103,180.409216 C47.7328342,180.826786 48.2627451,181.702199 47.9405593,182.340212 Z M54.2367892,187.958254 C53.6263318,188.524199 52.4329723,188.261363 51.6232682,187.366874 C50.7860088,186.474504 50.6291553,185.281144 51.2480912,184.70672 C51.8776254,184.140775 53.0349512,184.405731 53.8743302,185.298101 C54.7115892,186.201069 54.8748019,187.38595 54.2367892,187.958254 Z M58.5562413,195.146347 C57.7719732,195.691096 56.4895886,195.180261 55.6968417,194.042013 C54.9125733,192.903764 54.9125733,191.538713 55.713799,190.991845 C56.5086651,190.444977 57.7719732,190.936735 58.5753181,192.066505 C59.3574669,193.22383 59.3574669,194.58888 58.5562413,195.146347 Z M65.8613592,203.471174 C65.1597571,204.244846 63.6654083,204.03712 62.5716717,202.981538 C61.4524999,201.94927 61.1409122,200.484596 61.8446341,199.710926 C62.5547146,198.935137 64.0575422,199.15346 65.1597571,200.200564 C66.2704506,201.230712 66.6095936,202.705984 65.8613592,203.471174 Z M75.3025151,206.281542 C74.9930474,207.284134 73.553809,207.739857 72.1039724,207.313809 C70.6562556,206.875043 69.7087748,205.700761 70.0012857,204.687571 C70.302275,203.678621 71.7478721,203.20382 73.2083069,203.659543 C74.6539041,204.09619 75.6035048,205.261994 75.3025151,206.281542 Z M86.046947,207.473627 C86.0829806,208.529209 84.8535871,209.404622 83.3316829,209.4237 C81.8013,209.457614 80.563428,208.603398 80.5464708,207.564772 C80.5464708,206.498591 81.7483088,205.631657 83.2786917,205.606221 C84.8005962,205.576546 86.046947,206.424403 86.046947,207.473627 Z M96.6021471,207.069023 C96.7844366,208.099171 95.7267341,209.156872 94.215428,209.438785 C92.7295577,209.710099 91.3539086,209.074206 91.1652603,208.052538 C90.9808515,206.996955 92.0576306,205.939253 93.5413813,205.66582 C95.054807,205.402984 96.4092596,206.021919 96.6021471,207.069023 Z"
    />
  </svg>
);
