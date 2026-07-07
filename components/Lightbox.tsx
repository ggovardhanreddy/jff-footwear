"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface LightboxProps {
  open: boolean;
  close: () => void;
  slides: { src: string; alt?: string }[];
  index?: number;
  onView?: (index: number) => void;
}

export default function LightboxComponent({
  open,
  close,
  slides,
  index = 0,
  onView,
}: LightboxProps) {
  return (
    <Lightbox
      open={open}
      close={close}
      index={index}
      slides={slides}
      plugins={[Zoom]}
      zoom={{ maxZoomPixelRatio: 3 }}
      on={{
        view: onView ? ({ index: i }) => onView(i) : undefined,
      }}
    />
  );
}
