import { createContext } from "react";
import { TextLayer } from "./types";

export const LayersContext = createContext<TextLayer[]>([]);
export const TextContext = createContext<
  [string | undefined, (newText: string) => void]
>([undefined, () => {}]);
