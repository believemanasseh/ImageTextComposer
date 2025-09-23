import Konva from "konva";

export type TextLayer = {
  id: number;
  text: string;
  x: number;
  y: number;
  fontFamily: string;
  fontSize: number;
  fontStyle: string;
  align: string;
  opacity: number;
  fill: string;
  draggable: boolean;
  width: number;
  onDblClick: (evt: Konva.KonvaEventObject<Event>, id: number) => void;
  onDblTap: (evt: Konva.KonvaEventObject<Event>, id: number) => void;
  onTransform: (
    e: TransformEvent,
    textRef: React.RefObject<Konva.Text | null>
  ) => void;
  visible: boolean;
  textRef: React.RefObject<Konva.Text | null>;
  trRef: React.RefObject<Konva.Transformer | null>;
  isEditing: boolean;
  isOpen: boolean;
  setIsEditing: (id: number, isEditing: boolean) => void;
  handleTextChange: (id: number, text: string) => void;
};

export type TransformEventTarget = {
  width: () => number;
  scaleX: () => number;
  setAttrs: (attrs: { width: number; scaleX: number }) => void;
};

export type TransformEvent = {
  target: TransformEventTarget;
};

export type FontItem = {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: {
    regular: string;
    italic: string;
    "700": string;
    "700italic": string;
  };
  category: string;
  kind: string;
  menu: string;
};
