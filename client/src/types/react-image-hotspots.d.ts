declare module '@jacobsdigitalfactory/react-image-hotspots' {
  import React from 'react';

  interface Hotspot {
    x: number;
    y: number;
    content: React.ReactNode;
  }

  interface ImageHotspotsProps {
    src: string;
    hotspots: Hotspot[];
    className?: string;
  }

  const ImageHotspots: React.FC<ImageHotspotsProps>;
  export default ImageHotspots;
}
