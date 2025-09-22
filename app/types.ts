import Konva from "konva";

export type TextLayer = {
  id: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontStyle: string;
  align: string;
  opacity: number;
  fill: string;
  draggable: boolean;
  width: number;
  onDblClick: (evt: Konva.KonvaEventObject<Event>, id: number) => void;
  onDblTap: (evt: Konva.KonvaEventObject<Event>, id: number) => void;
  onTransform: (e: TransformEvent) => void;
  visible: boolean;
  textRef: React.RefObject<Konva.Text | null>;
  trRef: React.RefObject<Konva.Transformer | null>;
  isEditing: boolean;
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
