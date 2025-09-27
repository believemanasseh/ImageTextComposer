import React, { useContext, useState } from "react";
import { Modal, Spin } from "antd";
import useSWR from "swr";
import {
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
} from "@ant-design/icons";
import { LayersContext } from "../contexts";
import { FontItem, TextLayer } from "../types";

type ModalProps = {
  layer: TextLayer;
  open: boolean;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const loadedFonts: Record<string, boolean> = {};

const measureFont = (
  fontName: string,
  fallbackFont: string,
  fontStyle = "normal",
  fontWeight = "400"
) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const sampleText = "The quick brown fox 0123456789";
    ctx.font = `${fontStyle} ${fontWeight} 16px '${fontName}', ${fallbackFont}`;
    return ctx.measureText(sampleText).width;
  }
};

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const loadFont = async (
  fontName: string,
  fontStyle = "normal",
  fontWeight = "400"
) => {
  if (loadedFonts[fontName]) return;

  const hasFontsLoadSupport = !!(document.fonts && document.fonts.load);
  const arialWidth = measureFont("Arial", "Arial", fontStyle, fontWeight);

  if (hasFontsLoadSupport) {
    try {
      await document.fonts.load(
        `${fontStyle} ${fontWeight} 16px '${fontName}'`
      );
      const newWidth = measureFont(fontName, "Arial", fontStyle, fontWeight);
      const shouldTrustChanges = arialWidth !== newWidth;
      if (shouldTrustChanges) {
        await delay(60);
        loadedFonts[fontName] = true;
        return;
      }
    } catch (e) {
      console.error(e);
    }
  }

  const timesWidth = measureFont("Times", "Times", fontStyle, fontWeight);
  const lastWidth = measureFont(fontName, "Arial", fontStyle, fontWeight);
  const waitTime = 60;
  const timeout = 6000;
  const attemptsNumber = Math.ceil(timeout / waitTime);
  for (let i = 0; i < attemptsNumber; i++) {
    const newWidthArial = measureFont(fontName, "Arial", fontStyle, fontWeight);
    const newWidthTimes = measureFont(fontName, "Times", fontStyle, fontWeight);
    const somethingChanged =
      newWidthArial !== lastWidth ||
      newWidthArial !== arialWidth ||
      newWidthTimes !== timesWidth;
    if (somethingChanged) {
      await delay(60);
      loadedFonts[fontName] = true;
      return;
    }
    await delay(waitTime);
  }
  console.warn(`Timeout for loading font "${fontName}".`);
};

export default function CustomisationModal(props: ModalProps) {
  const { data, isLoading } = useSWR("/api/fonts", fetcher);
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
      width={600}
    >
      <h1 className="text-center text-lg font-semibold">{props.layer.text}</h1>
      <div className="flex flex-col gap-4 mt-4">
        <label className="flex flex-col">
          Font Family:
          <select
            value={props.layer.fontFamily}
            onChange={(e) => {
              // Load the font using a stylesheet link
              const fontLink = document.createElement("link");
              fontLink.href = `https://fonts.googleapis.com/css2?family=${e.target.value}&display=swap`;
              fontLink.rel = "stylesheet";
              document.head.appendChild(fontLink);
              loadFont(e.target.value, "normal", "400");
              setLayers(
                layers.map((l) =>
                  l.id === props.layer.id
                    ? { ...l, fontFamily: e.target.value }
                    : l
                )
              );
            }}
            className="border border-gray-300 rounded px-2 py-1 mt-1"
          >
            {isLoading ? (
              <Spin />
            ) : (
              data.items.map((obj: FontItem, index: number) => {
                if (obj.family === "Aref Ruqaa Ink") {
                  return (
                    <React.Fragment key={index}>
                      <option value={obj.family}>{obj.family}</option>
                      <option value="Arial">Arial</option>
                    </React.Fragment>
                  );
                }
                return (
                  <option key={index} value={obj.family}>
                    {obj.family}
                  </option>
                );
              })
            )}
          </select>
        </label>
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
          <label className="flex flex-col">
            Line Height:
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={props.layer.lineHeight}
              onChange={(e) =>
                setLayers(
                  layers.map((l) =>
                    l.id === props.layer.id
                      ? { ...l, lineHeight: Number(e.target.value) }
                      : l
                  )
                )
              }
              className="border border-gray-300 rounded px-2 py-1 mt-1 w-16"
            />
          </label>
          <label className="flex flex-col">
            Letter Spacing:
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              value={props.layer.letterSpacing}
              onChange={(e) =>
                setLayers(
                  layers.map((l) =>
                    l.id === props.layer.id
                      ? { ...l, letterSpacing: Number(e.target.value) }
                      : l
                  )
                )
              }
              className="border border-gray-300 rounded px-2 py-1 mt-1 w-16"
            />
          </label>
        </div>
        <div className="flex flex-row gap-5">
          <label className="flex flex-col">
            <button
              onClick={() => {
                const index = layers.findIndex(
                  (layer) => layer.id === props.layer.id
                );
                if (index > 0) {
                  const newLayers = [...layers];
                  const [movedLayer] = newLayers.splice(index, 1);
                  newLayers.splice(index - 1, 0, movedLayer);
                  setLayers(newLayers);
                }
              }}
              className="border border-gray-300 hover:bg-blue-500 hover:text-white rounded w-[100px] mt-7"
            >
              Move up
            </button>
          </label>
          <label className="flex flex-col">
            <button
              onClick={() => {
                const index = layers.findIndex(
                  (layer) => layer.id === props.layer.id
                );
                if (index >= 0 && index < layers.length - 1) {
                  const newLayers = [...layers];
                  const [movedLayer] = newLayers.splice(index, 1);
                  newLayers.splice(index + 1, 0, movedLayer);
                  setLayers(newLayers);
                }
              }}
              className="border border-gray-300 hover:bg-blue-500 hover:text-white rounded w-[100px] mt-7"
            >
              Move down
            </button>
          </label>
        </div>
      </div>
    </Modal>
  );
}
