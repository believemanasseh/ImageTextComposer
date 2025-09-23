"use client";

import React, { useEffect, useContext } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Transformer,
} from "react-konva";
import Konva from "konva";
import TextEditor from "./TextEditor";
import { LayersContext } from "../contexts";

type ImageComposerProps = {
  imgElement: HTMLImageElement;
  zoom: number;
};

export default function ImageComposer(props: ImageComposerProps) {
  const [layers, setLayers] = useContext(LayersContext);

  useEffect(() => {
    layers.map((layer) => {
      if (layer.trRef.current && layer.textRef.current) {
        layer.trRef.current.nodes([layer.textRef.current]);
      }
    });
  }, [layers]);

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
              onDblClick={() =>
                requestAnimationFrame(() =>
                  setLayers(
                    layers.map((l) =>
                      layer.id === l.id ? { ...l, isEditing: true } : l
                    )
                  )
                )
              }
              onDblTap={() =>
                requestAnimationFrame(() =>
                  setLayers(
                    layers.map((l) =>
                      layer.id === l.id ? { ...l, isEditing: true } : l
                    )
                  )
                )
              }
              onTransform={(e) => layer.onTransform(e, layer.textRef)}
              onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
                const { x, y } = e.target.attrs;
                setLayers(
                  layers.map((l) => (l.id === layer.id ? { ...l, x, y } : l))
                );
              }}
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
