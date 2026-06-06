export interface ArtEvent {
  id: string;
  title: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  endDate?: string;
  description: string;
  image?: string;
  type: "solo" | "group" | "speaking";
  upcoming: boolean;
  visible?: boolean;
  link?: string;
}

export const events: ArtEvent[] = [
  {
    id: "galerie-rubrecht-wiesbaden",
    title: "Ausstellung Galerie Rubrecht",
    venue: "Galerie Rubrecht",
    city: "Wiesbaden",
    country: "Deutschland",
    date: "XXXX-01-01",
    type: "solo",
    upcoming: false,
    visible: true,
    description: "",
  },
];
