import { useRef } from "react";
import useModalDismissSignal from "../hooks/useModalDismissSignal";
import styles from "./Modal.module.css";

export default function Modal({ children, dismissModal }) {
  const ref = useRef(null);

  useModalDismissSignal(ref, dismissModal, true);

  return (
    <div className={styles.Background}>
      <div ref={ref} className={styles.Dialog}>
        {children}
      </div>
    </div>
  );
}
