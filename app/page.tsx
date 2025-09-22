"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Input, Popover, Slider } from "antd";
import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import toastr from "toastr";
import Konva from "konva";
import ExportButton from "./components/ExportButton";
import UndoRedoControls from "./components/UndoRedoControls";
import LayerList from "./components/LayerList";
import { TextLayer, TransformEvent } from "./types";
import { LayersContext, TextContext } from "./contexts";

const DynamicImageComposer = dynamic(
  () => import("./components/ImageComposer"),
  { ssr: false }
);

export default function Home() {
  const [text, setText] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(0.75);
  const [layers, setLayers] = useState<TextLayer[]>([]);
  const [redoStack, setRedoStack] = useState<TextLayer[]>([]);
  const textRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const handleManualUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files as FileList;
    const file = files[0];

    if (file) {
      if (file.type !== "image/png") {
        toastr.error("Only PNG files are allowed.");
        return;
      }
      setImageUrl(URL.createObjectURL(file));
      setImageName(file.name.slice(0, -4)); // Remove .png extension
      toastr.success(`Image "${file.name}" uploaded successfully`);
    }
  };

  useEffect(() => {
    if (imageUrl) {
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => setImgElement(img);
    }
  }, [imageUrl]);

  function handleImageUpload() {
    document.getElementById("imageUpload")?.click();
  }

  const handleEditName = () => {
    setEditingName(true);
    setTempName(imageName);
  };

  const handleSaveName = () => {
    setEditingName(false);
    setImageName(tempName);
    setTempName("");
  };

  const handleUndo = () => {
    if (layers.length === 0) return;
    const newLayers = layers.slice(0, -1);
    const removedLayer = layers[layers.length - 1];
    setLayers(newLayers);
    setRedoStack([...redoStack, removedLayer]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const restoredLayer = redoStack[redoStack.length - 1];
    setLayers([...layers, restoredLayer]);
    setRedoStack(redoStack.slice(0, -1));
  };

  const handleTextChange = useCallback((id: number, newText: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === id ? { ...layer, text: newText } : layer
      )
    );
  }, []);

  const setIsEditing = (id: number, isEditing: boolean) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === id ? { ...layer, isEditing } : layer
      )
    );
  };

  const handleTextDblClick = useCallback(
    (evt: Konva.KonvaEventObject<Event>, id: number) => {
      requestAnimationFrame(() =>
        setLayers((prevLayers) =>
          prevLayers.map((layer) =>
            layer.id === id ? { ...layer, isEditing: true } : layer
          )
        )
      );
    },
    []
  );

  const handleTransform = useCallback((e: TransformEvent) => {
    const node = textRef.current;
    if (node) {
      const scaleX = node.scaleX();
      const newWidth = node.width() * scaleX;
      node.setAttrs({
        width: newWidth,
        scaleX: 1,
      });
    }
  }, []);

  const namePopoverContent = (
    <div className="flex flex-col gap-2">
      <Input
        value={tempName}
        onChange={(e) => setTempName(e.target.value)}
        autoFocus
      />
      <Button type="primary" size="small" onClick={handleSaveName}>
        Save
      </Button>
    </div>
  );

  return (
    <TextContext value={[text, setText]}>
      <LayersContext value={layers}>
        <main className="pt-10 flex items-center justify-center min-h-screen bg-[#f5f6fa]">
          {!imgElement ? (
            <div className="flex flex-col gap-5 w-[960px] m-auto p-5 items-center justify-center rounded-lg shadow-md bg-[whitesmoke]">
              <h1 className="text-2xl text-[#222]">Image Text Composer</h1>
              <p className="text-gray-500">
                Upload a PNG image and overlay it with fully customisable text.
              </p>
              <Button
                type="primary"
                onClick={handleImageUpload}
                icon={<UploadOutlined />}
              >
                Upload your image
              </Button>
              <input
                id="imageUpload"
                type="file"
                onChange={handleManualUpload}
                className="hidden"
                accept=".png"
              />
            </div>
          ) : (
            <div className="flex flex-row justify-center w-full h-full gap-2">
              <aside className="w-64 p-4 bg-white border-r border-[#e5e7eb] flex flex-col gap-4">
                <Button
                  type="primary"
                  onClick={() => {
                    setLayers([
                      ...layers,
                      {
                        id: Date.now(),
                        text: "New Text",
                        x: 50,
                        y: 50,
                        fontSize: 20,
                        fontStyle: "italic",
                        align: "left",
                        opacity: 0.75,
                        fill: "black",
                        draggable: true,
                        width: 200,
                        onDblClick: handleTextDblClick,
                        onDblTap: handleTextDblClick,
                        onTransform: handleTransform,
                        visible: true,
                        textRef: textRef,
                        trRef: trRef,
                        isEditing: false,
                        setIsEditing: setIsEditing,
                        handleTextChange: handleTextChange,
                      },
                    ]);
                  }}
                  block
                >
                  Add Text
                </Button>
                <LayerList />
              </aside>
              <section>
                <div className="flex items-center justify-between border-b border-[#e5e7eb] gap-4">
                  <UndoRedoControls onRedo={handleRedo} onUndo={handleUndo} />
                  <Popover
                    content={namePopoverContent}
                    trigger="click"
                    open={editingName}
                    onOpenChange={setEditingName}
                    placement="bottom"
                  >
                    <h1 className="text-[#222] flex items-center gap-2 cursor-pointer">
                      {imageName || "Untitled Image"}
                      <Button
                        icon={
                          <ExclamationCircleOutlined
                            style={{ fontSize: "25px" }}
                          />
                        }
                        onClick={handleEditName}
                      />
                    </h1>
                  </Popover>
                  <ExportButton />
                </div>

                <div
                  style={{
                    width: "80vw",
                    height: "80vh",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DynamicImageComposer imgElement={imgElement} zoom={zoom} />
                </div>

                {/* Zoom control */}
                <div className="mt-4 flex items-center justify-center gap-4">
                  <label htmlFor="zoom-slider">Zoom:</label>
                  <Slider
                    id="zoom-slider"
                    min={0.1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={setZoom}
                    style={{ width: 200 }}
                  />
                  <span>{(zoom * 100).toFixed(0)}%</span>
                </div>
              </section>
            </div>
          )}
        </main>
      </LayersContext>
    </TextContext>
  );
}
