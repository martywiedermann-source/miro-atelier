export const siteConfig = {
  pages: {
    works:     { enabled: true  },
    about:     { enabled: true  },
    events:    { enabled: false },
    contact:   { enabled: true  },
    impressum: { enabled: true  },
  },
  hero: {
    autoPlay: true,
    interval: 5000,
  },
  gallery: {
    showEmptyWorks: false,
  },
} as const;
