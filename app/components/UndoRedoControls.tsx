"use client";
import { UndoOutlined, RedoOutlined } from "@ant-design/icons";
import { Button } from "antd";

export default function UndoRedoControls() {
  return (
    <div className="flex gap-2 mb-2">
      <Button className="px-2 py-1 bg-gray-200 rounded" icon={<UndoOutlined />}>
        Undo
      </Button>
      <Button className="px-2 py-1 bg-gray-200 rounded" icon={<RedoOutlined />}>
        Redo
      </Button>
    </div>
  );
}
