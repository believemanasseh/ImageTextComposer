"use client";

import { useRef, useEffect, Fragment } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Transformer,
  Text as KonvaText,
} from "react-konva";
import { TextLayer } from "../types";
import TextEditor from "./TextEditor";
import { Text } from "konva/lib/shapes/Text";
import { Transformer as TransformerShape } from "konva/lib/shapes/Transformer";

type ImageComposerProps = {
  imgElement: HTMLImageElement;
  zoom: number;
  layers: TextLayer[];
  isEditing: boolean;
  setIsEditing: (x: boolean) => void;
  handleTextChange: (newText: string) => void;
  textRef: React.RefObject<Text>;
  trRef: React.RefObject<TransformerShape>;
};

export default function ImageComposer(props: ImageComposerProps) {
  const stageRef = useRef(null);

  useEffect(() => {
    if (!props.trRef || !props.textRef) return;
    if (props.trRef.current && props.textRef.current) {
      props.trRef.current.nodes([props.textRef.current]);
    }
  }, [props]);

  return (
    <Stage
      ref={stageRef}
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
          draggable
        />
        {props.layers.map((layer, i) => (
          <Fragment key={i}>
            <KonvaText
              text={layer.text}
              x={layer.x}
              y={layer.y}
              fontSize={layer.fontSize}
              draggable
              width={layer.width}
              onDblClick={layer.onDblClick}
              onDblTap={layer.onDblTap}
              onTransform={layer.onTransform}
              visible={layer.visible}
            />
            {props.isEditing && props.textRef.current && (
              <TextEditor
                textNode={props.textRef.current}
                onChange={props.handleTextChange}
                onClose={() => props.setIsEditing(false)}
              />
            )}
            {!props.isEditing && (
              <Transformer
                ref={props.trRef}
                enabledAnchors={["middle-left", "middle-right"]}
                boundBoxFunc={(oldBox, newBox) => ({
                  ...newBox,
                  width: Math.max(30, newBox.width),
                })}
              />
            )}
          </Fragment>
        ))}
      </Layer>
    </Stage>
  );
}
