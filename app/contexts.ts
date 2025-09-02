import { createContext } from "react";
import { TextLayer } from "./types";

export const LayersContext = createContext<TextLayer[]>([]);
