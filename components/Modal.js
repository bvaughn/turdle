import { useRef } from "react";
import useModalDismissSignal from "../hooks/useModalDismissSignal";
import styles from "./Modal.module.css";

export default function Modal({ children, className, dismissModal, testName }) {
  const ref = useRef(null);

  useModalDismissSignal(ref, dismissModal, true);

  return (
    <div className={`${styles.Background} ${className || ""}`}>
      <div ref={ref} className={styles.Dialog} data-testname={testName}>
        {children}
      </div>
    </div>
  );
}
