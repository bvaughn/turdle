import { useMemo } from "react";
import { getTargetWord } from "../utils/words";

export default function useDefaultWord() {
  return useMemo(() => getTargetWord(), []);
}
