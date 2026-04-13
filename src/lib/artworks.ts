export interface Artwork {
  id: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  category: "painting" | "drawing" | "mixed-media" | "photography";
  image: string;
  description: string;
}

// PLACEHOLDER: Replace with actual artwork data
export const artworks: Artwork[] = [
  {
    id: "1",
    title: "Nocturne in Gold",
    year: 2024,
    medium: "Oil and gold leaf on canvas",
    dimensions: "180 × 140 cm",
    category: "painting",
    image: "/images/gallery/artwork-1.jpg", // REPLACE with actual artwork image
    description: "An exploration of tension between darkness and illumination, where gold leaf disrupts the painted surface to create moments of unexpected brilliance.",
  },
  {
    id: "2",
    title: "Study in Silence IV",
    year: 2024,
    medium: "Ink and charcoal on paper",
    dimensions: "76 × 56 cm",
    category: "drawing",
    image: "/images/gallery/artwork-2.jpg", // REPLACE with actual artwork image
    description: "Part of an ongoing series examining the weight of empty space. Gestural marks dissolve into silence, questioning the boundary between presence and absence.",
  },
  {
    id: "3",
    title: "Aurum Fragment",
    year: 2023,
    medium: "Mixed media on panel",
    dimensions: "200 × 160 cm",
    category: "mixed-media",
    image: "/images/gallery/artwork-3.jpg", // REPLACE with actual artwork image
    description: "Layered pigments and metallic elements create a geological narrative — a meditation on time, erosion, and the persistence of beauty.",
  },
  {
    id: "4",
    title: "Crimson Dissolution",
    year: 2023,
    medium: "Acrylic and pigment on canvas",
    dimensions: "200 × 200 cm",
    category: "painting",
    image: "/images/gallery/artwork-4.jpg", // REPLACE with actual artwork image
    description: "A visceral confrontation with color and emotion. Deep reds clash against dark voids, suggesting both violence and tenderness.",
  },
  {
    id: "5",
    title: "Architectures of Light",
    year: 2022,
    medium: "Fine art photography",
    dimensions: "120 × 80 cm",
    category: "photography",
    image: "/images/gallery/artwork-5.jpg", // REPLACE with actual artwork image
    description: "Capturing the interplay of light and architectural form, this photograph transforms mundane spaces into contemplative geometric compositions.",
  },
  {
    id: "6",
    title: "Terra Fluens",
    year: 2023,
    medium: "Oil on canvas",
    dimensions: "160 × 120 cm",
    category: "painting",
    image: "/images/gallery/artwork-6.jpg", // REPLACE with actual artwork image
    description: "Organic forms flow across the canvas like geological strata, blending earth tones with luminous gold to evoke landscapes both real and imagined.",
  },
  {
    id: "7",
    title: "Construct VII",
    year: 2022,
    medium: "Ink on paper",
    dimensions: "70 × 50 cm",
    category: "drawing",
    image: "/images/gallery/artwork-7.jpg", // REPLACE with actual artwork image
    description: "Precise architectural lines dissolve into organic forms, exploring the tension between rigid structure and natural entropy.",
  },
  {
    id: "8",
    title: "Kintsugi Meridian",
    year: 2024,
    medium: "Oil and gold leaf on canvas",
    dimensions: "220 × 180 cm",
    category: "painting",
    image: "/images/gallery/artwork-8.jpg", // REPLACE with actual artwork image
    description: "Inspired by the Japanese art of kintsugi, golden veins run through deep ultramarine, celebrating imperfection as beauty.",
  },
  {
    id: "9",
    title: "Void Study II",
    year: 2023,
    medium: "Fine art photography",
    dimensions: "100 × 100 cm",
    category: "photography",
    image: "/images/gallery/artwork-9.jpg", // REPLACE with actual artwork image
    description: "A contemplative study of architectural void and ambient light, reducing space to its essential geometric poetry.",
  },
  {
    id: "10",
    title: "Palimpsest",
    year: 2022,
    medium: "Mixed media collage on canvas",
    dimensions: "180 × 150 cm",
    category: "mixed-media",
    image: "/images/gallery/artwork-10.jpg", // REPLACE with actual artwork image
    description: "Layered fragments of paper, paint, and metallic foil form a visual palimpsest — traces of history written and rewritten on a single surface.",
  },
  {
    id: "11",
    title: "Dissolving Figure",
    year: 2024,
    medium: "Graphite and charcoal on paper",
    dimensions: "90 × 65 cm",
    category: "drawing",
    image: "/images/gallery/artwork-11.jpg", // REPLACE with actual artwork image
    description: "A human form emerges and dissolves simultaneously, captured in delicate graphite marks that question the permanence of physical presence.",
  },
  {
    id: "12",
    title: "Viridian Pulse",
    year: 2024,
    medium: "Acrylic on canvas",
    dimensions: "200 × 160 cm",
    category: "painting",
    image: "/images/gallery/artwork-12.jpg", // REPLACE with actual artwork image
    description: "Bold strokes of emerald and gold collide on a dark field, pulsating with raw energy and chromatic intensity.",
  },
];

export const categories = [
  { value: "all", label: "All Works" },
  { value: "painting", label: "Painting" },
  { value: "drawing", label: "Drawing" },
  { value: "mixed-media", label: "Mixed Media" },
  { value: "photography", label: "Photography" },
];
