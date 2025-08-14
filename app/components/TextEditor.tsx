import { Text } from "konva/lib/shapes/Text";
import { useEffect, useRef } from "react";
import { Html } from "react-konva-utils";

type TextEditorProps = {
  textNode: Text;
  onChange: (newText: string) => void;
  onClose: () => void;
};

const TextEditor = (props: TextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const stage = props.textNode.getStage();
    const textPosition = props.textNode.position();
    const stageBox = stage?.container().getBoundingClientRect();
    const areaPosition = {
      x: textPosition?.x,
      y: textPosition?.y,
    };

    // Match styles with the text node
    textarea.value = props.textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${
      props.textNode.width() - props.textNode.padding() * 2
    }px`;
    textarea.style.height = `${
      props.textNode.height() - props.textNode.padding() * 2 + 5
    }px`;
    textarea.style.fontSize = `${props.textNode.fontSize()}px`;
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = props.textNode.lineHeight().toString();
    textarea.style.fontFamily = props.textNode.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = props.textNode.align();
    textarea.style.color = props.textNode.fill().toString();

    const rotation = props.textNode.rotation();
    let transform = "";
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }
    textarea.style.transform = transform;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 3}px`;

    textarea.focus();

    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target !== textarea) {
        props.onChange(textarea.value);
        props.onClose();
      }
    };

    // Add event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        props.onChange(textarea.value);
        props.onClose();
      }
      if (e.key === "Escape") {
        props.onClose();
      }
    };

    const handleInput = () => {
      const scale = props.textNode.getAbsoluteScale().x;
      textarea.style.width = `${props.textNode.width() * scale}px`;
      textarea.style.height = "auto";
      textarea.style.height = `${
        textarea.scrollHeight + props.textNode.fontSize()
      }px`;
    };

    textarea.addEventListener("keydown", handleKeyDown);
    textarea.addEventListener("input", handleInput);
    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });

    return () => {
      textarea.removeEventListener("keydown", handleKeyDown);
      textarea.removeEventListener("input", handleInput);
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [props]);

  return (
    <Html>
      <textarea
        ref={textareaRef}
        style={{
          minHeight: "1em",
          position: "absolute",
        }}
      />
    </Html>
  );
};

export default TextEditor;
