import { useEffect } from "react";

const SITE_NAME = "Miroslav Wiedermann";

export function usePageTitle(pageTitle?: string) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME;
  }, [pageTitle]);
}

export function useJsonLd(id: string, data: object) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
    return () => { document.getElementById(id)?.remove(); };
  }, [id]);
}
