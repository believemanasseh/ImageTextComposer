"use client";

import { Stage, Layer, Image as KonvaImage } from "react-konva";

type ImageComposerProps = {
  imgElement: HTMLImageElement;
};

export default function ImageComposer(ImageComposerProps: ImageComposerProps) {
  return (
    <Stage
      width={ImageComposerProps.imgElement.naturalWidth}
      height={ImageComposerProps.imgElement.naturalHeight}
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
