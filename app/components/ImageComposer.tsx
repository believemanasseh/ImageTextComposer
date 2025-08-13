"use client";

import { Stage, Layer, Image as KonvaImage } from "react-konva";

type ImageComposerProps = {
  imgElement: HTMLImageElement;
  zoom: number;
};

export default function ImageComposer(ImageComposerProps: ImageComposerProps) {
  return (
    <Stage
      width={
        ImageComposerProps.imgElement.naturalWidth * ImageComposerProps.zoom
      }
      height={
        ImageComposerProps.imgElement.naturalHeight * ImageComposerProps.zoom
      }
      scale={{ x: ImageComposerProps.zoom, y: ImageComposerProps.zoom }}
    >
      <Layer>
        <KonvaImage
          image={ImageComposerProps.imgElement}
          x={0}
          y={0}
          width={ImageComposerProps.imgElement.naturalWidth}
          height={ImageComposerProps.imgElement.naturalHeight}
          draggable
        />
      </Layer>
    </Stage>
  );
}
