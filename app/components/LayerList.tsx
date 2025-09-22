"use client";

import { useContext } from "react";
import { LayersContext } from "../contexts";

export default function LayerList() {
  const layers = useContext(LayersContext);

  return (
    <div>
      <h2 className="font-bold mb-2">Layers</h2>
      <ul className="leading-[2]">
        <li className="cursor-pointer">Image Layer</li>
        {layers.map((layer, index) => (
          <li className="cursor-pointer" key={index}>
            {layer.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
