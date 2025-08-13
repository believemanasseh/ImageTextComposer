"use client";

import { Stage, Layer, Image as KonvaImage } from "react-konva";

type ImageComposerProps = {
  imgElement: HTMLImageElement;
};

export default function ImageComposer(ImageComposerProps: ImageComposerProps) {
  return (
    <Stage width={800} height={600}>
      <Layer>
        <KonvaImage
          image={ImageComposerProps.imgElement}
          x={0}
          y={0}
          width={800}
          height={600}
        />
      </Layer>
    </Stage>
  );
}
