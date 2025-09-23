import React, { useContext, useState } from "react";
import { Modal } from "antd";
import {
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
} from "@ant-design/icons";
import { LayersContext } from "../contexts";
import { TextLayer } from "../types";

type ModalProps = {
  layer: TextLayer;
  open: boolean;
};

export default function CustomisationModal(props: ModalProps) {
  const [layers, setLayers] = useContext(LayersContext);
  const [alignment, setAlignment] = useState({
    left: true,
    center: false,
    right: false,
  });

  const handleCancel = (id: number) => {
    setLayers(
      layers.map((layer) =>
        layer.id === id ? { ...layer, isOpen: false } : layer
      )
    );
  };

  const handleAlignmentClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const label = (e.currentTarget as HTMLSpanElement).getAttribute("label");
    if (label === "center") {
      setAlignment({ left: false, center: true, right: false });
    } else if (label === "left") {
      setAlignment({ left: true, center: false, right: false });
    } else if (label === "right") {
      setAlignment({ left: false, center: false, right: true });
    }
  };

  return (
    <Modal
      open={props.open}
      onCancel={() => handleCancel(props.layer.id)}
      footer={null}
    >
      <h1 className="text-center text-lg font-semibold">{props.layer.text}</h1>
      <div className="flex flex-col gap-4 mt-4">
        <label className="flex flex-col">
          Font Size:
          <input
            type="number"
            value={props.layer.fontSize}
            onChange={(e) =>
              setLayers(
                layers.map((l) =>
                  l.id === props.layer.id
                    ? { ...l, fontSize: Number(e.target.value) }
                    : l
                )
              )
            }
            className="border border-gray-300 rounded px-2 py-1 mt-1"
          />
        </label>
        <label className="flex flex-col">
          Font Style:
          <select
            value={props.layer.fontStyle}
            onChange={(e) =>
              setLayers(
                layers.map((l) =>
                  l.id === props.layer.id
                    ? { ...l, fontStyle: e.target.value }
                    : l
                )
              )
            }
            className="border border-gray-300 rounded px-2 py-1 mt-1"
          >
            <option value="normal">Normal</option>
            <option value="italic">Italic</option>
            <option value="bold">Bold</option>
            <option value="italic bold">Italic Bold</option>
          </select>
        </label>
        <div className="flex flex-row gap-7">
          <label className="flex flex-col">
            Color:
            <input
              type="color"
              value={props.layer.fill}
              onChange={(e) =>
                setLayers(
                  layers.map((l) =>
                    l.id === props.layer.id ? { ...l, fill: e.target.value } : l
                  )
                )
              }
              className="w-16 h-8 p-0 border-0 mt-1"
            />
          </label>
          <label className="flex flex-col gap-2">
            Alignment:
            <div className="flex flex-row gap-4 items-center">
              <AlignLeftOutlined
                label="left"
                onClick={(e) => {
                  handleAlignmentClick(e);
                  setLayers(
                    layers.map((l) =>
                      l.id === props.layer.id ? { ...l, align: "left" } : l
                    )
                  );
                }}
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  backgroundColor: alignment.left ? "lightgray" : "transparent",
                  padding: "2px",
                  borderRadius: "4px",
                }}
              />
              <AlignCenterOutlined
                label="center"
                onClick={(e) => {
                  handleAlignmentClick(e);
                  setLayers(
                    layers.map((l) =>
                      l.id === props.layer.id ? { ...l, align: "center" } : l
                    )
                  );
                }}
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  backgroundColor: alignment.center
                    ? "lightgray"
                    : "transparent",
                  padding: "2px",
                  borderRadius: "4px",
                }}
              />
              <AlignRightOutlined
                label="right"
                onClick={(e) => {
                  handleAlignmentClick(e);
                  setLayers(
                    layers.map((l) =>
                      l.id === props.layer.id ? { ...l, align: "right" } : l
                    )
                  );
                }}
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  backgroundColor: alignment.right
                    ? "lightgray"
                    : "transparent",
                  padding: "2px",
                  borderRadius: "4px",
                }}
              />
            </div>
          </label>
          <label className="flex flex-col">
            Opacity:
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={props.layer.opacity}
              onChange={(e) =>
                setLayers(
                  layers.map((l) =>
                    l.id === props.layer.id
                      ? { ...l, opacity: Number(e.target.value) }
                      : l
                  )
                )
              }
              className="border border-gray-300 rounded px-2 py-1 mt-1 w-16"
            />
          </label>
        </div>
      </div>
    </Modal>
  );
}
