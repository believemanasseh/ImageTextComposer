"use client";

type LayerListProps = { layers: string[] };

export default function LayerList(props: LayerListProps) {
  return (
    <div>
      <h2 className="font-bold mb-2">Layers</h2>
      <ul>
        <li>Image Layer</li>
        {props.layers.map((layer, index) => (
          <li key={index} className="pl-4">
            {layer}
          </li>
        ))}
      </ul>
    </div>
  );
}
