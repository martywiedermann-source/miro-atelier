import { artworks, type Artwork } from "./artworks";
import { events as staticEvents, type ArtEvent } from "./events";
import { useConfig, type NewArtwork } from "@/contexts/ConfigContext";

function newArtworkToArtwork(n: NewArtwork): Artwork {
  return {
    id: n.id,
    title: n.title,
    year: n.year,
    medium: n.medium,
    dimensions: n.dimensions,
    category: n.category,
    images: n.images,
    image: n.images[0] ?? "",
    description: n.description,
    status: n.status,
    visible: n.visible,
  };
}

export function useVisibleArtworks(): Artwork[] {
  const { effectiveOverride } = useConfig();
  const overrides = effectiveOverride.artworks ?? {};

  const staticVisible = artworks.filter((a) => {
    const o = overrides[a.id];
    if (o?.visible === false) return false;
    if (o?.visible === true) return true;
    return a.visible !== false;
  });

  const newVisible = (effectiveOverride.newArtworks ?? [])
    .filter((n) => n.visible !== false)
    .map(newArtworkToArtwork);

  return [...staticVisible, ...newVisible];
}

export function useVisibleImages(artwork: Artwork): string[] {
  const { effectiveOverride } = useConfig();
  const o = effectiveOverride.artworks?.[artwork.id];
  const hidden = new Set([
    ...(artwork.hiddenImages ?? []),
    ...(o?.hiddenImages ?? []),
  ]);
  const order = o?.imageOrder;
  const base = artwork.images.length ? artwork.images : artwork.image ? [artwork.image] : [];
  const ordered = order
    ? [...order.filter((p) => base.includes(p)), ...base.filter((p) => !order.includes(p))]
    : base;
  return ordered.filter((src) => !hidden.has(src));
}

export function useArtworkMeta(artwork: Artwork) {
  const { effectiveOverride } = useConfig();
  const o = effectiveOverride.artworks?.[artwork.id];
  return {
    title: o?.title ?? artwork.title,
    year: o?.year !== undefined ? o.year : artwork.year,
    medium: o?.medium ?? artwork.medium,
    dimensions: o?.dimensions ?? artwork.dimensions,
    description: o?.description ?? artwork.description,
    category: o?.category ?? artwork.category,
    seoTitle: o?.seoTitle,
    seoDescription: o?.seoDescription,
  };
}

export function useEffectiveEvents(): ArtEvent[] {
  const { effectiveOverride } = useConfig();
  const evs = effectiveOverride.events ?? staticEvents;
  return evs.filter((e) => e.visible !== false);
}
