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

function applySortMode(
  list: Artwork[],
  mode: string | undefined,
  customOrder: string[] | undefined
): Artwork[] {
  if (mode === "custom" && customOrder?.length) {
    const idx = new Map(customOrder.map((id, i) => [id, i]));
    return [...list].sort(
      (a, b) => (idx.get(a.id) ?? 9999) - (idx.get(b.id) ?? 9999)
    );
  }
  if (mode === "year-desc") {
    return [...list].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  }
  if (mode === "year-asc") {
    return [...list].sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
  }
  if (mode === "alpha") {
    return [...list].sort((a, b) => a.title.localeCompare(b.title, "de"));
  }
  return list;
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

  const combined = [...staticVisible, ...newVisible];
  return applySortMode(
    combined,
    effectiveOverride.artworkSort,
    effectiveOverride.artworkOrder
  );
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
  const visible = ordered.filter((src) => !hidden.has(src));

  // Move coverImage to front
  const cover = o?.coverImage;
  if (cover && visible.includes(cover) && visible[0] !== cover) {
    return [cover, ...visible.filter((s) => s !== cover)];
  }
  return visible;
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
    focalPoint: o?.focalPoint ?? "center center",
    coverImage: o?.coverImage,
  };
}

export function useEffectiveEvents(): ArtEvent[] {
  const { effectiveOverride } = useConfig();
  const evs = effectiveOverride.events?.length ? effectiveOverride.events : staticEvents;
  return evs.filter((e) => e.visible !== false);
}
