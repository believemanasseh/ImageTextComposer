"use client";

import React, { useContext } from "react";
import CustomisationModal from "./CustomisationModal";
import { LayersContext } from "../contexts";

export default function LayerList() {
  const [layers, setLayers] = useContext(LayersContext);

  const handleClick = (id: number) => {
    setLayers(
      layers.map((layer) =>
        layer.id === id ? { ...layer, isOpen: true } : layer
      )
    );
  };

  return (
    <div>
      <h2 className="font-bold mb-2 text-center">Layers</h2>
      <ul className="leading-[2]">
        {layers.map((layer, index) => (
          <React.Fragment key={index}>
            <li
              className="cursor-pointer hover:bg-blue-500 hover:text-white hover:rounded-md px-2 my-2"
              onClick={() => handleClick(layer.id)}
            >
              {layer.text}
            </li>
            <CustomisationModal layer={layer} open={layer.isOpen} />
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}
