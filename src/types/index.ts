export type GalleryMode = "scattered" | "prism" | "fragment";

interface SanityImageAsset {
  _ref: string;
  _type: "reference";
}

interface SanityImage {
  _type: "image";
  asset: SanityImageAsset;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface Painting {
  _id: string;
  title: string;
  image: SanityImage;
  imageUrl?: string;
  description: string;
  year: string;
  medium: string;
  size: string;
}
