"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface GalleryLightboxProps {
  open: boolean;
  index: number;
  slides: { src: string; alt?: string }[];
  onClose: () => void;
}

export default function GalleryLightbox({
  open,
  index,
  slides,
  onClose,
}: GalleryLightboxProps) {
  if (!open) return null;

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Zoom]}
    />
  );
}
