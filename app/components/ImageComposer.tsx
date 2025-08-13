"use client";

import { Stage, Layer, Image as KonvaImage } from "react-konva";

type ImageComposerProps = {
  imgElement: HTMLImageElement;
  zoom: number;
};

export default function ImageComposer(props: ImageComposerProps) {
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
          draggable
        />
      </Layer>
    </Stage>
  );
}
