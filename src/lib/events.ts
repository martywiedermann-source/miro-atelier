export interface ArtEvent {
  id: string;
  title: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  endDate?: string;
  description: string;
  image: string;
  type: "solo" | "group" | "speaking";
  upcoming: boolean;
  link?: string;
}

// PLACEHOLDER: Replace with actual events data
export const events: ArtEvent[] = [
  {
    id: "1",
    title: "Form & Void — Solo Exhibition",
    venue: "Galerie Koenig",
    city: "Berlin",
    country: "Germany",
    date: "2025-09-15",
    endDate: "2025-11-30",
    description: "A comprehensive solo exhibition featuring new large-scale works exploring the tension between material presence and conceptual absence.",
    image: "/images/gallery/artwork-1.jpg",
    type: "solo",
    upcoming: true,
  },
  {
    id: "2",
    title: "The Art of Creative Leadership",
    venue: "TEDx Vienna",
    city: "Vienna",
    country: "Austria",
    date: "2025-10-22",
    description: "Keynote address on how artistic thinking can transform leadership and innovation in the modern world.",
    image: "/images/gallery/artwork-3.jpg",
    type: "speaking",
    upcoming: true,
  },
  {
    id: "3",
    title: "Convergence — Group Show",
    venue: "Whitechapel Gallery",
    city: "London",
    country: "United Kingdom",
    date: "2026-01-10",
    endDate: "2026-03-15",
    description: "A group exhibition bringing together contemporary European artists working at the intersection of painting and installation.",
    image: "/images/gallery/artwork-4.jpg",
    type: "group",
    upcoming: true,
  },
  {
    id: "4",
    title: "Nocturnes — Solo Exhibition",
    venue: "Museum für Moderne Kunst",
    city: "Frankfurt",
    country: "Germany",
    date: "2024-03-01",
    endDate: "2024-06-15",
    description: "A critically acclaimed exhibition of the Nocturne series, featuring 12 large-scale paintings.",
    image: "/images/gallery/artwork-1.jpg",
    type: "solo",
    upcoming: false,
  },
  {
    id: "5",
    title: "Beyond the Canvas",
    venue: "Art Basel",
    city: "Basel",
    country: "Switzerland",
    date: "2023-06-15",
    endDate: "2023-06-18",
    description: "Represented by Galerie Koenig at Art Basel, presenting a curated selection of recent works.",
    image: "/images/gallery/artwork-6.jpg",
    type: "group",
    upcoming: false,
  },
  {
    id: "6",
    title: "Silence & Structure",
    venue: "Kunsthalle Wien",
    city: "Vienna",
    country: "Austria",
    date: "2023-01-20",
    endDate: "2023-04-30",
    description: "Solo exhibition exploring the relationship between architectural space and painterly gesture.",
    image: "/images/gallery/artwork-5.jpg",
    type: "solo",
    upcoming: false,
  },
  {
    id: "7",
    title: "New European Painting",
    venue: "Centre Pompidou",
    city: "Paris",
    country: "France",
    date: "2022-09-01",
    endDate: "2022-12-20",
    description: "Group exhibition surveying the new wave of European abstract painting.",
    image: "/images/gallery/artwork-3.jpg",
    type: "group",
    upcoming: false,
  },
  {
    id: "8",
    title: "Creativity in Crisis",
    venue: "World Economic Forum — Side Event",
    city: "Davos",
    country: "Switzerland",
    date: "2022-05-23",
    description: "Panel discussion and keynote on the role of art and creativity during times of global uncertainty.",
    image: "/images/gallery/artwork-2.jpg",
    type: "speaking",
    upcoming: false,
  },
];
