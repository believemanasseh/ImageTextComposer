import { KonvaEventObject } from "konva/lib/Node";

export type TextLayer = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  draggable: boolean;
  width: number;
  onDblClick: (evt: KonvaEventObject<Event>) => void;
  onDblTap: (evt: KonvaEventObject<Event>) => void;
  onTransform: (e: TransformEvent) => void;
  visible: boolean;
};

export type TransformEventTarget = {
  width: () => number;
  scaleX: () => number;
  setAttrs: (attrs: { width: number; scaleX: number }) => void;
};

export type TransformEvent = {
  target: TransformEventTarget;
};
