import { useEffect, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { CSSProperties } from "react";

const itemStyle: CSSProperties = {
  transition: "all 150ms ease-in-out",
};

const itemStateStyles: {
  [key: string]: { [key: string]: { [key: string]: string } | string };
} = {
  idle: { ":hover": { background: "#f0f0f0" } },
  dragging: { filter: "grayscale(0.8)" },
  over: { transform: "scale(1.1) rotate(8deg)", filter: "brightness(1.15)" },
};

const ImagePreview = ({
  src,
  instanceId,
}: {
  src: string;
  instanceId: symbol;
}) => {
  const [state, setState] = useState("idle");

  useEffect(() => {
    const el = document.getElementById(src);
    if (!el) return;

    const dragHandlers = combine(
      draggable({
        element: el,
        getInitialData: () => ({ type: "grid-item", src, instanceId }),
        onDragStart: () => {
          setState("dragging");
        },
        onDrop: () => {
          setState("idle");
        },
      }),
      dropTargetForElements({
        element: el,
        getData: () => ({ src }),
        getIsSticky: () => true,
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId &&
          source.data.type === "grid-item" &&
          source.data.src !== src,
        onDragEnter: () => {
          setState("over");
        },
        onDragLeave: () => {
          setState("idle");
        },
        onDrop: () => {
          setState("idle");
        },
      })
    );

    return dragHandlers;
  }, [instanceId, src]);

  return (
    <img
      id={src}
      style={{
        ...itemStyle,
        ...itemStateStyles[state],
      }}
      src={src}
      alt=""
    />
  );
};

export default ImagePreview;
