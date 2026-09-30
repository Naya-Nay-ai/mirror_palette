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
  /** Garment opening in the shared SVG coordinates; clips fill and fixed linework together. */
  cutoutPath?: string;
  /** Visible body beneath this garment: hide covered shoulders/arms, retain neck and legs. */
  mannequinClipPath?: string;
  /** Override only for cropped artwork; default is the shared 360 × 580 canvas. */
  frame?: typeof SILHOUETTE_FRAME;
};

export type PantsBodyOcclusion = {
  /** All coordinates are after placement, in the shared 360 × 580 canvas. */
  waistY: number;
  /** Right-to-left hem boundary, bridging the gap between the legs. */
  hem: readonly [
    readonly [number, number],
    readonly [number, number],
    ...(readonly [number, number])[],
  ];
};

type BottomSilhouetteAsset = SilhouetteAsset &
  (
    | { kind: "pants"; bodyOcclusion: PantsBodyOcclusion }
    | { kind: "skirt"; bodyOcclusion?: never }
  );

type ShoeSilhouetteAsset = SilhouetteAsset & {
  /** Part of the shoe in front of the foot; the complete shoe sits behind it. */
  frontClipPath: string;
};

type SilhouetteAssets = {
  mannequin?: SilhouetteAsset;
} & {
  [K in Category]: Partial<
    Record<
      Look[K]["shape"],
      K extends "bottom" ? BottomSilhouetteAsset
        : K extends "shoes" ? ShoeSilhouetteAsset : SilhouetteAsset
    >
  >;
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
    knit: {
      mode: "mask",
      src: "/silhouettes/top/knit-mask.png",
      detailsSrc: "/silhouettes/top/knit-lines.png",
    },
    tee: {
      mode: "mask",
      src: "/silhouettes/top/tee-mask.png",
      detailsSrc: "/silhouettes/top/tee-lines.png",
    },
    blouse: {
      mode: "mask",
      src: "/silhouettes/top/blouse-mask.png",
      detailsSrc: "/silhouettes/top/blouse-lines.png",
      cutoutPath:
        "M170.31 90.65 L189.69 90.65 L191.97 96.73 L197.1 98.63 C199.57 111.74 193.68 127.13 180 139.1 C166.32 127.13 160.43 111.74 162.9 98.63 L168.03 96.73Z",
      // The source body's shoulders/arms extend beyond the fitted garment artwork.
      // Keep the body inside the bodice; blouse-aligned hands are drawn at the cuffs.
      mannequinClipPath:
        "M160 54 H200 V140 H216 V235 L226 270 V320 H360 V580 H0 V320 H134 V270 L144 235 V140 H160Z",
    },
  },
  bottom: {
    straight: {
      kind: "pants",
      bodyOcclusion: {
        waistY: 190,
        hem: [[210, 503], [150, 503]],
      },
      mode: "mask",
      src: "/silhouettes/bottom/straight-mask.png",
      detailsSrc: "/silhouettes/bottom/straight-lines.png",
    },
    wide: {
      kind: "pants",
      bodyOcclusion: {
        waistY: 190,
        // Actual cloth hem, not the frame edge (which includes transparent padding).
        hem: [
          [214, 466.7], [205, 466.7], [194, 465],
          [166, 465], [155, 466.7], [146, 466.7],
        ],
      },
      mode: "mask",
      src: "/silhouettes/bottom/widepants-mask.png",
      detailsSrc: "/silhouettes/bottom/widepants-lines.png",
      frame: { x: 70, y: 184, width: 220, height: 300 },
    },
    skirt: {
      kind: "skirt",
      mode: "mask",
      src: "/silhouettes/bottom/skirt-mask.png",
      detailsSrc: "/silhouettes/bottom/skirt-lines.png",
      // Waist sits beneath the untucked top; the long hem stays inside the mirror.
      frame: { x: 69.71, y: 147.5, width: 220.57, height: 355.41 },
    },
  },
  shoes: {
    boots: {
      frontClipPath: "M0 484 H360 V580 H0Z",
      mode: "mask",
      src: "/silhouettes/shoes/boots-mask.png",
      detailsSrc: "/silhouettes/shoes/boots-lines.png",
      frame: { x: 128, y: 450, width: 104, height: 129.95 },
    },
    sneakers: {
      frontClipPath: "M0 508 H360 V580 H0Z",
      mode: "mask",
      src: "/silhouettes/shoes/sneakers-mask.png",
      detailsSrc: "/silhouettes/shoes/sneakers-lines.png",
      frame: { x: 123, y: 485, width: 114, height: 76 },
    },
    pumps: {
      // The heel rim goes behind the ankle; both sidewalls and toes remain visible.
      frontClipPath:
        "M0 0H360V580H0Z M153 497 C153 509 152 521 151 531 L150 535 C157 529 164 529 171 535 L170 531 C169 520 169 509 169 497Z M191 497 C191 509 191 520 190 531 L189 535 C196 529 203 529 210 535 L209 531 C208 521 207 509 207 497Z",
      mode: "mask",
      src: "/silhouettes/shoes/pumps-mask.png",
      detailsSrc: "/silhouettes/shoes/pumps-lines.png",
    },
  },
};
