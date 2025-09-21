"use client";

import { useRef, useEffect, useState, useCallback, useContext } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Transformer,
} from "react-konva";
import { TransformEvent } from "../types";
import TextEditor from "./TextEditor";
import Konva from "konva";
import { TextContext } from "../contexts";

type ImageComposerProps = {
  imgElement: HTMLImageElement;
  zoom: number;
};

export default function ImageComposer(props: ImageComposerProps) {
  const [text, setText] = useContext(TextContext);
  const [isEditing, setIsEditing] = useState(false);
  const [textWidth, setTextWidth] = useState(200);
  const [position, setPosition] = useState([50, 80]);
  const textRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
    }
  }, [isEditing]);

  const handleDragEnd = (evt: Konva.KonvaEventObject<DragEvent>) => {
    const { x, y } = evt.target.attrs;
    setPosition([x, y]);
  };

  const handleTextDblClick = useCallback(
    (evt: Konva.KonvaEventObject<Event>) => {
      requestAnimationFrame(() => setIsEditing(true));
    },
    []
  );

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const handleTransform = useCallback((e: TransformEvent) => {
    const node = textRef.current;
    if (node) {
      const scaleX = node.scaleX();
      const newWidth = node.width() * scaleX;
      node.setAttrs({
        width: newWidth,
        scaleX: 1,
      });
    }
  }, []);

  return (
    <Stage
      width={props.imgElement.naturalWidth * props.zoom}
      height={props.imgElement.naturalHeight * props.zoom}
      scale={{ x: props.zoom, y: props.zoom }}
    >
      <Layer>
        <KonvaImage
          image={props.imgElement}
          width={props.imgElement.naturalWidth}
          height={props.imgElement.naturalHeight}
        />
        <Text
          ref={textRef}
          text={text}
          x={position[0]}
          y={position[1]}
          fontSize={20}
          draggable
          width={textWidth}
          onDblClick={handleTextDblClick}
          onDblTap={handleTextDblClick}
          onTransform={handleTransform}
          onDragEnd={handleDragEnd}
          visible={!isEditing}
        />

        {isEditing && textRef.current && (
          <TextEditor
            textNode={textRef.current}
            onChange={handleTextChange}
            onClose={() => setIsEditing(false)}
          />
        )}
        {!isEditing && (
          <Transformer
            ref={trRef}
            visible={!text ? isEditing : !isEditing}
            enabledAnchors={["middle-left", "middle-right"]}
            boundBoxFunc={(oldBox, newBox) => ({
              ...newBox,
              width: Math.max(30, newBox.width),
            })}
          />
        )}
      </Layer>
    </Stage>
  );
}
