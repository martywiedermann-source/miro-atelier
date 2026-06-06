import { artworks, type Artwork } from "./artworks";
import { events as staticEvents, type ArtEvent } from "./events";
import { useConfig } from "@/contexts/ConfigContext";

export function useVisibleArtworks(): Artwork[] {
  const { effectiveOverride } = useConfig();
  const overrides = effectiveOverride.artworks ?? {};
  return artworks.filter((a) => {
    const o = overrides[a.id];
    // Runtime override takes precedence over static flag
    if (o?.visible === false) return false;
    if (o?.visible === true) return true;
    return a.visible !== false;
  });
}

export function useVisibleImages(artwork: Artwork): string[] {
  const { effectiveOverride } = useConfig();
  const o = effectiveOverride.artworks?.[artwork.id];
  const hidden = new Set([
    ...(artwork.hiddenImages ?? []),
    ...(o?.hiddenImages ?? []),
  ]);
  const imgs = artwork.images.length
    ? artwork.images
    : artwork.image
    ? [artwork.image]
    : [];
  return imgs.filter((src) => !hidden.has(src));
}

export function useArtworkMeta(artwork: Artwork) {
  const { effectiveOverride } = useConfig();
  const o = effectiveOverride.artworks?.[artwork.id];
  return {
    title: o?.titleOverride ?? artwork.title,
    year: o?.yearOverride !== undefined ? o.yearOverride : artwork.year,
    dimensions: o?.dimensionsOverride ?? artwork.dimensions,
    medium: o?.mediumOverride ?? artwork.medium,
  };
}

export function useEffectiveEvents(): ArtEvent[] {
  const { effectiveOverride } = useConfig();
  // If override has an events array, it replaces the static array entirely
  const evs = effectiveOverride.events ?? staticEvents;
  return evs.filter((e) => e.visible !== false);
}
