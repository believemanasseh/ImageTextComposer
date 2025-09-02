import { KonvaEventObject } from "konva/lib/Node";
import { Text } from "konva/lib/shapes/Text";
import { Transformer } from "konva/lib/shapes/Transformer";

export type TextLayer = {
  id: number;
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
  textRef: React.RefObject<Text> | null;
};

export type TransformEventTarget = {
  width: () => number;
  scaleX: () => number;
  setAttrs: (attrs: { width: number; scaleX: number }) => void;
};

export type TransformEvent = {
  target: TransformEventTarget;
};
