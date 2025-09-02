"use client";

import { TextLayer } from "../types";

type LayerListProps = { layers: TextLayer[] };

export default function LayerList(props: LayerListProps) {
  return (
    <div>
      <h2 className="font-bold mb-2">Layers</h2>
      <ul className="leading-[2]">
        <li className="cursor-pointer">Image Layer</li>
        {props.layers.map((layer, index) => (
          <li className="cursor-pointer" key={index}>
            {layer.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
