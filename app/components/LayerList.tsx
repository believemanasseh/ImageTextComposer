"use client";

import { TextLayer } from "../types";

type LayerListProps = { layers: TextLayer[] };

export default function LayerList(props: LayerListProps) {
  return (
    <div>
      <h2 className="font-bold mb-2">Layers</h2>
      <ul>
        <li>Image Layer</li>
        {props.layers.map((layer, index) => (
          <li key={index}>{layer.text}</li>
        ))}
      </ul>
    </div>
  );
}
