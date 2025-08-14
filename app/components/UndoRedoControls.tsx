"use client";
import { UndoOutlined, RedoOutlined } from "@ant-design/icons";
import { Button } from "antd";

type UndoRedoControlsProps = {
  onUndo: () => void;
  onRedo: () => void;
};

export default function UndoRedoControls(props: UndoRedoControlsProps) {
  return (
    <div className="flex gap-2 mb-2">
      <Button
        className="px-2 py-1 bg-gray-200 rounded"
        icon={<UndoOutlined />}
        onClick={props.onUndo}
      >
        Undo
      </Button>
      <Button
        className="px-2 py-1 bg-gray-200 rounded"
        icon={<RedoOutlined />}
        onClick={props.onRedo}
      >
        Redo
      </Button>
    </div>
  );
}
