"use client";

import React, { useEffect, useContext } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Transformer,
} from "react-konva";
import TextEditor from "./TextEditor";
import { LayersContext } from "../contexts";

type ImageComposerProps = {
  imgElement: HTMLImageElement;
  zoom: number;
};

export default function ImageComposer(props: ImageComposerProps) {
  const layers = useContext(LayersContext);

  useEffect(() => {
    layers.map((layer) => {
      if (layer.trRef.current && layer.textRef.current) {
        layer.trRef.current.nodes([layer.textRef.current]);
      }
    });
  }, [layers]);

  // const handleDragEnd = (evt: Konva.KonvaEventObject<DragEvent>) => {
  //   const { x, y } = evt.target.attrs;
  //   setPosition([x, y]);
  // };

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
        {layers.map((layer, index) => (
          <React.Fragment key={index}>
            <Text
              ref={layer.textRef}
              text={layer.text}
              x={layer.x}
              y={layer.y}
              fontSize={layer.fontSize}
              fontStyle={layer.fontStyle}
              align={layer.align}
              opacity={layer.opacity}
              fill={layer.fill}
              draggable
              width={layer.width}
              onDblClick={(e) => layer.onDblClick(e, layer.id)}
              onDblTap={(e) => layer.onDblClick(e, layer.id)}
              onTransform={layer.onTransform}
              // onDragEnd={handleDragEnd}
              visible={!layer.isEditing}
            />

            {layer.isEditing && layer.textRef.current && (
              <TextEditor
                textNode={layer.textRef.current}
                onChange={(newText: string) =>
                  layer.handleTextChange(layer.id, newText)
                }
                onClose={() => layer.setIsEditing(layer.id, false)}
              />
            )}
            {!layer.isEditing && (
              <Transformer
                ref={layer.trRef}
                visible={!layer.text ? layer.isEditing : !layer.isEditing}
                enabledAnchors={["middle-left", "middle-right"]}
                boundBoxFunc={(oldBox, newBox) => ({
                  ...newBox,
                  width: Math.max(30, newBox.width),
                })}
              />
            )}
          </React.Fragment>
        ))}
      </Layer>
    </Stage>
  );
}
