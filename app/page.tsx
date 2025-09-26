"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Input, Popover, Slider, Tooltip } from "antd";
import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import toastr from "toastr";
import type Konva from "konva";
import ImageComposer from "./components/ImageComposer";
import ExportButton from "./components/ExportButton";
import UndoRedoControls from "./components/UndoRedoControls";
import LayerList from "./components/LayerList";
import type { TextLayer, TransformEvent } from "./types";
import { LayersContext, TextContext, ExportContext } from "./contexts";

export default function Home() {
  const [text, setText] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(0.75);
  const [layers, setLayers] = useState<TextLayer[]>([]);
  const [redoStack, setRedoStack] = useState<TextLayer[]>([]);
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    if (imageUrl) {
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => setImgElement(img);
    }
  }, [imageUrl]);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  const handleImageUpload = () => {
    document.getElementById("imageUpload")?.click();
  };

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

  const handleTextChange = (id: number, text: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) => (layer.id === id ? { ...layer, text } : layer))
    );
  };

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

  const handleTransform = useCallback(
    (e: TransformEvent, textRef: React.RefObject<Konva.Text | null>) => {
      const node = textRef.current;
      if (node) {
        const scaleX = node.scaleX();
        const newWidth = node.width() * scaleX;
        node.setAttrs({
          width: newWidth,
          scaleX: 1,
        });
      }
    },
    []
  );

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
      <LayersContext value={[layers, setLayers]}>
        <ExportContext value={[isExporting, setIsExporting]}>
          {isDesktop ? (
            <main className="pt-10 flex items-center justify-center h-screen bg-[#f5f6fa]">
              {!imgElement ? (
                <div className="flex flex-col gap-5 items-center justify-center w-[960px] m-auto p-5  rounded-lg shadow-md bg-[whitesmoke]">
                  <h1 className="text-2xl text-[#222]">Image Text Composer</h1>
                  <p className="text-gray-500">
                    Upload a PNG image and overlay it with fully customisable
                    text.
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
                            x: 600,
                            y: 400,
                            fontFamily: "Kavivanar",
                            fontSize: 30,
                            fontStyle: "normal",
                            align: "left",
                            opacity: 0.75,
                            fill: "black",
                            draggable: true,
                            width: 200,
                            onDblClick: handleTextDblClick,
                            onDblTap: handleTextDblClick,
                            onTransform: handleTransform,
                            visible: true,
                            textRef: React.createRef<Konva.Text>(),
                            trRef: React.createRef<Konva.Transformer>(),
                            isEditing: false,
                            setIsEditing: setIsEditing,
                            handleTextChange: handleTextChange,
                            isOpen: false,
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
                      <div className="flex flex-row gap-2">
                        <UndoRedoControls
                          onRedo={handleRedo}
                          onUndo={handleUndo}
                        />
                        <Button
                          type="primary"
                          danger
                          onClick={() => setLayers([])}
                        >
                          Reset
                        </Button>
                      </div>
                      <Popover
                        content={namePopoverContent}
                        trigger="click"
                        open={editingName}
                        onOpenChange={setEditingName}
                        placement="bottom"
                      >
                        <h1
                          className="text-[#222] flex items-center gap-2 cursor-pointer"
                          onClick={handleEditName}
                        >
                          {imageName || "Untitled Image"}
                          <Tooltip title="Click to edit image name">
                            <Button
                              icon={
                                <ExclamationCircleOutlined
                                  style={{ fontSize: "25px" }}
                                />
                              }
                              onClick={handleEditName}
                            />
                          </Tooltip>
                        </h1>
                      </Popover>
                      <ExportButton stageRef={stageRef} imageName={imageName} />
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
                      <ImageComposer
                        stageRef={stageRef}
                        imgElement={imgElement}
                        zoom={zoom}
                      />
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
          ) : (
            <main className="flex flex-col justify-center items-center h-screen p-6">
              <h2 className="text-lg font-semibold">Desktop only</h2>
              <p className="text-sm text-gray-500">
                This editor is designed for desktop. Please open on a larger
                screen.
              </p>
            </main>
          )}
        </ExportContext>
      </LayersContext>
    </TextContext>
  );
}
