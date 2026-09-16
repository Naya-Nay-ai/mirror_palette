"use client";

import { useId, useState, type ReactNode } from "react";
import {
  SILHOUETTE_FRAME,
  type SilhouetteAsset,
} from "@/lib/silhouette-assets";

/** SVG-native image/mask keeps artwork aligned with the existing SVG layers. */
export function SilhouetteAssetLayer({
  asset,
  color,
  children,
  clipPath,
}: {
  asset?: SilhouetteAsset;
  color: string;
  children: ReactNode;
  /** Optional garment-specific visibility boundary, in shared SVG coordinates. */
  clipPath?: string;
}) {
  const id = useId();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!asset || failedSrc === asset.src) return <>{children}</>;

  const frame = asset.frame ?? SILHOUETTE_FRAME;
  const artwork = (
    <image
      href={asset.src}
      {...frame}
      preserveAspectRatio="xMidYMid meet"
      onError={() => setFailedSrc(asset.src)}
    />
  );

  return (
    <g
      data-silhouette-asset={asset.src}
      clipPath={clipPath || asset.cutoutPath ? `url(#${id}-opening)` : undefined}
    >
      {(clipPath || asset.cutoutPath) && (
        <defs>
          <clipPath id={`${id}-opening`} clipPathUnits="userSpaceOnUse">
            <path
              clipRule="evenodd"
              d={`${clipPath ?? `M${frame.x} ${frame.y} h${frame.width} v${frame.height} h${-frame.width}Z`} ${asset.cutoutPath ?? ""}`}
            />
          </clipPath>
        </defs>
      )}
      {asset.mode === "mask" ? (
        <>
          <defs>
            <mask
              id={id}
              {...frame}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
              style={{ maskType: "alpha" }}
            >
              {artwork}
            </mask>
          </defs>
          <rect {...frame} fill={color} mask={`url(#${id})`} />
        </>
      ) : (
        artwork
      )}
      {asset.detailsSrc && (
        <image
          href={asset.detailsSrc}
          {...frame}
          preserveAspectRatio="xMidYMid meet"
          onError={() => setFailedSrc(asset.src)}
        />
      )}
    </g>
  );
}
