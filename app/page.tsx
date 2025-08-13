"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Button, Slider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import toastr from "toastr";
import LayerList from "./components/LayerList";
import ExportButton from "./components/ExportButton";
import UndoRedoControls from "./components/UndoRedoControls";

const DynamicImageComposer = dynamic(
  () => import("./components/ImageComposer"),
  { ssr: false }
);

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState<string[]>([]);

  const handleManualUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files as FileList;
    const file = files[0];
    console.log(file, "filld", file.type);
    if (file) {
      if (file.type !== "image/png") {
        toastr.error("Only PNG files are allowed.");
        return;
      }
      setImageUrl(URL.createObjectURL(file));
      setImageName(file.name);
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

  return (
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
            <LayerList layers={layers} />
          </aside>
          <section>
            <div className="flex items-center justify-between border-b border-[#e5e7eb] gap-4">
              <UndoRedoControls />
              <h1>{imageName}</h1>
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
  );
}
