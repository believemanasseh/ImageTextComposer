"use client";

import { useContext } from "react";
import type Konva from "konva";
import { Button } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { ExportContext } from "../contexts";

type ExportButtonProps = {
  stageRef?: React.RefObject<Konva.Stage | null>;
  imageName: string;
};

export default function ExportButton(props: ExportButtonProps) {
  const [isExporting, setIsExporting] = useContext(ExportContext);

  const handleExport = () => {
    if (!props.stageRef?.current) return;

    setIsExporting(true);

    requestAnimationFrame(() => {
      const dataURL = props.stageRef!.current!.toDataURL();

      const link = document.createElement("a");
      link.download = `${props.imageName}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // reset exporting state on next frame to restore UI
      requestAnimationFrame(() => setIsExporting(false));
    });
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
