import type { Category, Look } from "./wardrobe";

/** Coordinates shared by the built-in drawing and replacement artwork. */
export const SILHOUETTE_FRAME = { x: 0, y: 0, width: 360, height: 580 };

export type SilhouetteAsset = {
  /** Public URL, for example /silhouettes/top/blouse-mask.png. */
  src: string;
  /** Alpha mask receives the item's exact HEX; image keeps its original colors. */
  mode: "mask" | "image";
  /** Optional transparent linework / fixed-color details, aligned to src. */
  detailsSrc?: string;
  /** Override only for cropped artwork; default is the shared 360 × 580 canvas. */
  frame?: typeof SILHOUETTE_FRAME;
};

type SilhouetteAssets = {
  mannequin?: SilhouetteAsset;
} & {
  [K in Category]: Partial<Record<Look[K]["shape"], SilhouetteAsset>>;
};

/**
 * The only registration point for supervised artwork. An absent entry uses
 * the existing SVG. Item IDs and localStorage data remain unchanged.
 * Scope: My styling only; saved cards and choice thumbnails keep their art.
 */
export const SILHOUETTE_ASSETS: SilhouetteAssets = {
  mannequin: {
    mode: "image",
    src: "/silhouettes/mannequin.png",
    frame: { x: 31, y: 54, width: 298.22, height: 506.85 },
  },
  top: {
    blouse: {
      mode: "mask",
      src: "/silhouettes/top/blouse-mask.png",
      detailsSrc: "/silhouettes/top/blouse-lines.png",
      frame: { x: 86.14, y: 46, width: 187.72, height: 302.48 },
    },
  },
  bottom: {},
  shoes: {},
};
