import { createContext } from "react";
import { TextLayer } from "./types";

export const LayersContext = createContext<
  [TextLayer[], (layers: TextLayer[]) => void]
>([[], () => {}]);

export const TextContext = createContext<
  [string | undefined, (newText: string) => void]
>([undefined, () => {}]);

export const ExportContext = createContext<
  [boolean, (isExporting: boolean) => void]
>([false, () => {}]);
