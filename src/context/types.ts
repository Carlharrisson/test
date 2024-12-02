import { GalleryMode, Painting } from "../types";

export interface GalleryContextType {
  displayMode: GalleryMode;
  setDisplayMode: (mode: GalleryMode) => void;
  paintings: Painting[];
  setPaintings: (paintings: Painting[]) => void;
  selectedPainting: Painting | null;
  setSelectedPainting: (painting: Painting | null) => void;
}
