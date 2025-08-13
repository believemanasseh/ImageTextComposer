"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Button, Slider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import toastr from "toastr";

const DynamicImageComposer = dynamic(
  () => import("./components/ImageComposer"),
  { ssr: false }
);

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);

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
    <main className="pt-10 flex items-center justify-center min-h-screen">
      {!imgElement ? (
        <div className="flex flex-col gap-5 w-[960px] m-auto p-5 items-center justify-center rounded-lg shadow-md bg-[whitesmoke]">
          <h1 className="text-2xl">Image Text Composer</h1>
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
        <div className="flex flex-col items-center justify-center w-full h-full">
          {/* Zoom control */}
          <div className="mb-4 flex items-center gap-4">
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

          <div
            style={{
              width: "80vw",
              height: "80vh",
              overflow: "hidden",
              border: "1px solid #eee",
              background: "whitesmoke",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DynamicImageComposer imgElement={imgElement} zoom={zoom} />
          </div>
        </div>
      )}
    </main>
  );
}
