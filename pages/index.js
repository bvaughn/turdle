import Head from "next/head";
import Grid from "../components/Grid";
import Keyboard from "../components/Keyboard";
import styles from "../styles/Home.module.css";
import useGameState from "../hooks/useGameState";
import useTargetWord from "../hooks/useTargetWord";

export default function Home() {
  const targetWord = useTargetWord();
  const { addPendingGuess, deletePendingGuess, state, submitPendingGuesses } =
    useGameState(targetWord);

  return (
    <div className={styles.Home}>
      <Head>
        <title>TURDle</title>
        <meta name="description" content="A game about poop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.Header}>
        <a
          href="https://github.com/bvaughn/turdle"
          rel="noreferrer"
          target="_blank"
        >
          <span className={styles.Turd}>TURD</span>le 💩
        </a>
      </header>

      <main className={styles.Main}>
        <Grid state={state} />
      </main>

      <footer className={styles.Footer}>
        <Keyboard
          addPendingGuess={addPendingGuess}
          deletePendingGuess={deletePendingGuess}
          state={state}
          submitPendingGuesses={submitPendingGuesses}
        />
      </footer>
    </div>
  );
}
