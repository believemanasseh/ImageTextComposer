"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
  Transformer as TransformerComponent,
} from "react-konva";
import { TransformEvent } from "../types";
import TextEditor from "./TextEditor";
import { Text } from "konva/lib/shapes/Text";
import { KonvaEventObject } from "konva/lib/Node";
import { Transformer } from "konva/lib/shapes/Transformer";

type ImageComposerProps = {
  imgElement: HTMLImageElement;
  zoom: number;
  text: string;
  setText: (text: string) => void;
};

export default function ImageComposer(props: ImageComposerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [textWidth, setTextWidth] = useState(200);
  const textRef = useRef<Text>(null);
  const trRef = useRef<Transformer>(null);

  useEffect(() => {
    if (trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
    }
  }, [isEditing]);

  const handleTextDblClick = useCallback((evt: KonvaEventObject<Event>) => {
    setIsEditing(true);
  }, []);

  const handleTextChange = useCallback(
    (newText: string) => {
      props.setText(newText);
    },
    [props]
  );

  const handleTransform = useCallback((e: TransformEvent) => {
    const node = e.target as Text;
    const scaleX = node.scaleX();
    const newWidth = node.width() * scaleX;
    node.setAttrs({
      width: newWidth,
      scaleX: 1,
    });
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
          x={0}
          y={0}
          width={props.imgElement.naturalWidth}
          height={props.imgElement.naturalHeight}
        />

        <KonvaText
          ref={textRef}
          text={props.text}
          x={50}
          y={80}
          fontSize={20}
          draggable
          width={textWidth}
          onDblClick={handleTextDblClick}
          onDblTap={handleTextDblClick}
          onTransform={handleTransform}
          visible={!isEditing}
        />
        {isEditing && (
          <TextEditor
            textNode={textRef.current}
            onChange={handleTextChange}
            onClose={() => setIsEditing(false)}
          />
        )}
        {!isEditing && (
          <TransformerComponent
            ref={trRef}
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
