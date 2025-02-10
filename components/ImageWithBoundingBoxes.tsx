import { useEffect, useRef, useState } from "react";
import { Box, Modal, Button, Text, Code, ScrollArea } from "@mantine/core";

interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  label?: string;
  description?: Record<string, any>; // JSON object
}

interface ImageWithBoundingBoxesProps {
  imageUrl: string;
  boxes: BoundingBox[];
}

export function ImageWithBoundingBoxes({ imageUrl, boxes }: ImageWithBoundingBoxesProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState({ scaleX: 1, scaleY: 1 });
  const [selectedBox, setSelectedBox] = useState<BoundingBox | null>(null);

  useEffect(() => {
    const updateScale = () => {
      if (imgRef.current) {
        const { naturalWidth, naturalHeight, clientWidth, clientHeight } = imgRef.current;
        setScale({
          scaleX: clientWidth / naturalWidth,
          scaleY: clientHeight / naturalHeight,
        });
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <Box style={{ position: "relative", display: "inline-block" }}>
      {/* Image */}
      <img ref={imgRef} src={imageUrl} alt="Processed" style={{ maxWidth: "100%", height: "auto" }} />

      {/* Bounding Boxes */}
      {boxes.map((box, index) => {
        const width = (box.maxX - box.minX) * scale.scaleX;
        const height = (box.maxY - box.minY) * scale.scaleY;
        const left = box.minX * scale.scaleX;
        const top = box.minY * scale.scaleY;

        return (
          <Box
            key={index}
            onClick={() => setSelectedBox(box)}
            style={{
              position: "absolute",
              left: `${left}px`,
              top: `${top}px`,
              width: `${width}px`,
              height: `${height}px`,
              border: "2px solid red",
              backgroundColor: "rgba(255, 0, 0, 0.2)", // Semi-transparent
              cursor: "pointer",
            }}
          />
        );
      })}

      {/* Modal for Selected Box */}
      <Modal
        opened={!!selectedBox}
        onClose={() => setSelectedBox(null)}
        title={selectedBox?.label || "Bounding Box Details"}
        centered
      >
        <ScrollArea h={300}>
          <Code block>{JSON.stringify(selectedBox?.description, null, 2)}</Code>
        </ScrollArea>
      </Modal>
    </Box>
  );
}
