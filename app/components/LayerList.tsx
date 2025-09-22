"use client";

import React, { useContext, useState } from "react";
import CustomisationModal from "./CustomisationModal";
import { LayersContext } from "../contexts";

export default function LayerList() {
  const [layers, setLayers] = useContext(LayersContext);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <div>
      <h2 className="font-bold mb-2">Layers</h2>
      <ul className="leading-[2]">
        {layers.map((layer, index) => (
          <React.Fragment key={index}>
            <li className="cursor-pointer" onClick={handleClick}>
              {layer.text}
            </li>
            <CustomisationModal layer={layer} open={open} setOpen={setOpen} />
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}
