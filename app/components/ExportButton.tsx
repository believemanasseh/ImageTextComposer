"use client";

import { Button } from "antd";
import { ExportOutlined } from "@ant-design/icons";

export default function ExportButton() {
  const handleExport = () => {
    alert("Export as PNG!");
  };

  return (
    <Button
      className="bg-blue-500 text-white rounded"
      onClick={handleExport}
      icon={<ExportOutlined />}
    >
      Export PNG
    </Button>
  );
}
