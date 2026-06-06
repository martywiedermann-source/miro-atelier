import { usePageTitle } from "@/lib/seo";
import { Printer, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const SELECTED_WORKS = [
  {
    id: "gelber-schatten",
    title: "Gelber Schatten",
    medium: "Filz, Acryl",
    dimensions: "165 × 125 cm",
    year: 2007,
    image: "/images/gallery/gelber-schatten/_mg_3137.jpg",
  },
  {
    id: "mahlwerk",
    title: "Mahlwerk",
    medium: "Filz, Acryl",
    dimensions: "180 × 180 cm",
    year: 2009,
    image: "/images/gallery/mahlwerk/bild0394.jpg",
  },
  {
    id: "entscheidung",
    title: "Entscheidung",
    medium: "Filz auf Leinwand",
    dimensions: "130 × 115 cm",
    year: 2012,
    image: "/images/gallery/entscheidung/dsc00534.jpg",
  },
  {
    id: "bewegte-tiefe-1",
    title: "Bewegte Tiefe 1",
    medium: "Filz, Acryl",
    dimensions: "—",
    year: 2015,
    image: "/images/gallery/bewegte-tiefe-1/bewegte-tiefe-1.jpg",
  },
  {
    id: "domino",
    title: "Domino",
    medium: "Filz, Acryl",
    dimensions: "120 × 80 cm",
    year: null,
    image: "/images/gallery/domino/domino-1.jpg",
  },
  {
    id: "paradigma",
    title: "Paradigma",
    medium: "Installation",
    dimensions: "—",
    year: null,
    image: "/images/gallery/paradigma/front-annsicht.jpg",
  },
];

const VITA = [
  { year: "1964", text: "Geboren in Eger (Cheb), Tschechien" },
  { year: "1994", text: "Beginn der freischaffenden Tätigkeit. Konzeptionelle Messebauten für Cebit, Anuga, Musikmesse Frankfurt" },
  { year: "1996", text: "15. Internationale Biennale Kortrijk, Belgien" },
  { year: "1997", text: "Konzeptionelles Projekt für das Max Planck Institut, Jena" },
  { year: "1999", text: "Einzelausstellung Herrnhaag (Lichtenburg) — TV-Bericht hr3" },
  { year: "2000", text: "Aufnahme in »kunstWerk – Aktuelle Positionen der Bildenden Kunst«. Gruppenausstellungen KunsWerk Holzhausenschlösschen und BBK Galerie Frankfurt" },
  { year: "2002", text: "Einzelausstellung Galerie Frech Alzenau — TV-Bericht. Großprojekt Wiesbaden" },
  { year: "2007", text: "Atelier Gelnhausen Hailer. Gastmitglied Künstlerbund Simplicius, Hanau" },
  { year: "2009", text: "Einzelausstellung artRIUM Bruchköbel" },
  { year: "2010", text: "Galerie Bronto u. Wiesel, Wiesbaden" },
];

const Press = () => {
  usePageTitle("Pressemappe");

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Print / Nav bar — hidden when printing */}
      <div className="print:hidden border-b border-black/10 px-6 py-3 flex items-center justify-between">
        <Link
          to="/about"
          className="font-mono text-xs uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors"
        >
          ← ateliermiro.de
        </Link>
        <div className="flex items-center gap-4">
          <a
            href="https://www.ateliermiro.de"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors flex items-center gap-1.5"
          >
            <ExternalLink size={12} />
            Website
          </a>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] bg-black text-white px-4 py-2 hover:bg-black/80 transition-colors"
          >
            <Printer size={13} />
            Drucken / PDF
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-16 print:py-8 print:px-0">

        {/* Header */}
        <div className="border-b border-black pb-10 mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-black/40 mb-3">
            Pressemappe · Portfolio · {new Date().getFullYear()}
          </p>
          <h1 className="text-5xl font-light tracking-tight mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Miroslav Wiedermann
          </h1>
          <p className="text-lg text-black/50 font-light" style={{ fontFamily: "Georgia, serif" }}>
            Bildender Künstler · Relief · Objekt · Installation
          </p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/30 mb-1">Atelier</p>
              <p className="text-black/70">Gelnhausen, Hessen</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/30 mb-1">Kontakt</p>
              <p className="text-black/70">miro@ateliermiro.de</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/30 mb-1">Telefon</p>
              <p className="text-black/70">+49 175 5933703</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/30 mb-1">Website</p>
              <p className="text-black/70">ateliermiro.de</p>
            </div>
          </div>
        </div>

        {/* Statement */}
        <section className="mb-14">
          <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-black/30 mb-5">Künstlerstatement</p>
          <div className="grid md:grid-cols-2 gap-8 text-[15px] leading-relaxed text-black/75" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              Miroslav Wiedermann arbeitet seit Anfang der 1990er Jahre als freischaffender Künstler. Sein Weg zum Filz führte ihn über das Studium an der Werkkunstschule Flensburg zu einer eigenständigen Relieftechnik, die Malerei und Skulptur verbindet.
            </p>
            <p>
              Durch präzises Schneiden und Schichten des Materials entstehen Oberflächen, die sich mit Lichteinfall und Betrachterperspektive verändern. „Allein der Gedanke, mich einordnen zu wollen, ist mir unendlich fremd" — Wiedermann ordnet seine Werke als Objekte und Installationen ein, ohne sich einer Schule zu verpflichten.
            </p>
          </div>
        </section>

        {/* Selected Works */}
        <section className="mb-14">
          <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-black/30 mb-5">Ausgewählte Werke</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SELECTED_WORKS.map((w) => (
              <div key={w.id}>
                <div className="aspect-square bg-black/5 overflow-hidden mb-2">
                  <img
                    src={w.image}
                    alt={w.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="font-medium text-sm text-black leading-tight">{w.title}</p>
                <p className="text-xs text-black/50 mt-0.5">{w.medium} · {w.dimensions}{w.year ? ` · ${w.year}` : ""}</p>
              </div>
            ))}
          </div>
          <p className="font-mono text-[9px] text-black/30 mt-4 tracking-[0.2em] uppercase">
            Vollständige Werkübersicht: ateliermiro.de/works — Preise auf Anfrage
          </p>
        </section>

        {/* Vita */}
        <section className="mb-14">
          <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-black/30 mb-5">Vita</p>
          <div className="space-y-3">
            {VITA.map((v) => (
              <div key={v.year} className="grid grid-cols-[4rem_1fr] gap-4 text-sm">
                <span className="font-mono text-black/40 pt-px">{v.year}</span>
                <span className="text-black/75">{v.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Press text */}
        <section className="mb-14 border-t border-black/10 pt-12">
          <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-black/30 mb-2">Pressetext</p>
          <p className="font-mono text-[9px] text-black/30 mb-8 tracking-[0.2em] uppercase">
            Galerie Rubrecht Contemporary · Wiesbaden · 2004
          </p>
          <div className="space-y-5 text-[15px] leading-[1.9] text-black/75" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              Maler? Bildhauer? Miroslav Wiedermann schüttelt den Kopf, beginnt zu lächeln. „Allein der Gedanke, mich einordnen zu wollen, ist mir unendlich fremd." Für Wiedermann sind die Übergänge fließend. Er ordnet seine Werke gerne in Objekt und Installation ein — und doch trägt seine Herangehensweise unübersehbar sowohl bildhauerische wie malerische Züge.
            </p>
            <p>
              Da sind kantig-prägnante, klar begrenzte, untereinander geschwisterlich ähnliche Volumina — als Individuum ausgesprochen winzig, dafür jedoch stets gleich im Kollektiv daherkommend. Und da sind Farben: mal streng monochrom, mal tonig abgestuft, mal im harten Komplementärkontrast. Aufgetragene Farben erscheinen als Formen ebenso wie der Werkstoff Filz als formtragendes Element.
            </p>
          </div>
          <p className="text-xs text-black/30 mt-6">© Text Dr. Roland Held</p>
        </section>

        {/* Footer */}
        <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-start gap-4 text-xs text-black/30">
          <div>
            <p>Miroslav Wiedermann · Gelnhausen, Hessen · Deutschland</p>
            <p>miro@ateliermiro.de · +49 175 5933703</p>
          </div>
          <div className="text-right print:text-left">
            <p>ateliermiro.de</p>
            <p>Pressemappe {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Press;
