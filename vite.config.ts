import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { Connect } from "vite";

function devApiMock(): { name: string; configureServer: (s: { middlewares: Connect.Server }) => void } {
  return {
    name: "dev-api-mock",
    configureServer(server) {
      server.middlewares.use("/api/admin.php", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        const url = new URL(req.url ?? "", "http://localhost");
        const action = url.searchParams.get("action") ?? "";
        if (action === "check") return res.end(JSON.stringify({ ok: true, loggedIn: true }));
        if (action === "get_config") return res.end(JSON.stringify({ ok: true, config: { version: 1 } }));
        if (action === "list_images") return res.end(JSON.stringify({ ok: true, images: [] }));
        res.end(JSON.stringify({ ok: true }));
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), mode === "development" && devApiMock()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
