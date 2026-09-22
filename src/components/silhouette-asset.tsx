"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
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
  onReadyChange,
}: {
  asset?: SilhouetteAsset;
  color: string;
  children: ReactNode;
  /** Optional garment-specific visibility boundary, in shared SVG coordinates. */
  clipPath?: string;
  /** True only when both artwork layers are loaded and no fallback is active. */
  onReadyChange?: (src: string, ready: boolean) => void;
}) {
  const id = useId();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [loadedDetailsSrc, setLoadedDetailsSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!asset || !onReadyChange) return;
    // SVG image load may precede hydration. Cached probes also cover that case.
    const sources = [asset.src, ...(asset.detailsSrc ? [asset.detailsSrc] : [])];
    const probes = sources.map((src, index) => {
      const image = new Image();
      image.onload = () => (index === 0 ? setLoadedSrc : setLoadedDetailsSrc)(src);
      image.onerror = () => {
        setFailedSrc(asset.src);
        onReadyChange(asset.src, false);
      };
      image.src = src;
      return image;
    });
    return () => {
      for (const image of probes) image.onload = image.onerror = null;
    };
  }, [asset, onReadyChange]);
  const ready =
    !!asset && failedSrc !== asset.src && loadedSrc === asset.src &&
    (!asset.detailsSrc || loadedDetailsSrc === asset.detailsSrc);
  useEffect(() => {
    if (asset) onReadyChange?.(asset.src, ready);
  }, [asset, ready, onReadyChange]);
  if (!asset || failedSrc === asset.src) return <>{children}</>;

  const src = asset.src;
  function fail() {
    setFailedSrc(src);
    onReadyChange?.(src, false);
  }

  const frame = asset.frame ?? SILHOUETTE_FRAME;
  const artwork = (
    <image
      href={asset.src}
      {...frame}
      preserveAspectRatio="xMidYMid meet"
      onLoad={onReadyChange ? () => setLoadedSrc(src) : undefined}
      onError={fail}
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
          onLoad={onReadyChange ? () => setLoadedDetailsSrc(asset.detailsSrc ?? null) : undefined}
          onError={fail}
        />
      )}
    </g>
  );
}
