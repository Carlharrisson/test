export type GalleryMode = "scattered" | "prism" | "fragment";

export interface Painting {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
  year: string;
  medium: string;
  size: string;
}
