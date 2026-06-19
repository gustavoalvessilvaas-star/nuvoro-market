"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/lib/constants";

type BrandLogoProps = {
  href?: string;
  compact?: boolean;
  inverted?: boolean;
  onClick?: () => void;
};

export function BrandLogo({ href = "/", compact = false, inverted = false, onClick }: BrandLogoProps) {
  const [assetIndex, setAssetIndex] = useState(0);
  const assets = ["/nuvoro-logo.png", "/brand/nuvoro-logo.png", "/brand/nuvoro-logo.svg"];
  const src = assets[assetIndex];
  const showAsset = assetIndex < assets.length;

  const content = (
    <>
      {showAsset ? (
        <Image
          src={src}
          alt={`${siteConfig.name} logo`}
          width={1236}
          height={204}
          className={`${compact ? "h-9 w-auto max-w-[150px]" : "h-11 w-auto max-w-[210px]"} object-contain ${inverted ? "rounded-2xl bg-white px-3 py-2" : ""}`}
          onError={() => setAssetIndex((current) => current + 1)}
        />
      ) : (
        <span className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-aqua via-blue to-violet text-base font-black text-white shadow-glow">
            N
          </span>
          {!compact ? (
            <span className="leading-tight">
              <span className={`block text-base font-black ${inverted ? "text-white" : "text-ink"}`}>{siteConfig.name}</span>
              <span className={`hidden text-xs font-bold sm:block ${inverted ? "text-white/60" : "text-ink/50"}`}>Smart Everyday Essentials</span>
            </span>
          ) : null}
        </span>
      )}
    </>
  );

  return (
    <Link href={href} className="inline-flex items-center" onClick={onClick} aria-label={`${siteConfig.name} home`}>
      {content}
    </Link>
  );
}
