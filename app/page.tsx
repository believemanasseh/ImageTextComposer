"use client";

import { useState } from "react";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);

  return (
    <main className="pt-10 flex items-center justify-center min-h-screen">
      {!image ? (
        <div className="flex flex-col gap-5 w-[960px] m-auto p-5 items-center justify-center rounded-lg shadow-md bg-[whitesmoke]">
          <h1 className="text-2xl">Image Text Composer</h1>
          <p className="text-gray-500">
            Upload a PNG image and overlay it with fully customisable text.
          </p>
          <Button type="primary" icon={<UploadOutlined />}>
            Upload your image
          </Button>
        </div>
      ) : (
        <div>TODO</div>
      )}
    </main>
  );
}
