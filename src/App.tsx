import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Impressum from "./pages/Impressum";
import NotFound from "./pages/NotFound";
import { siteConfig } from "@/lib/siteConfig";
import { ConfigProvider } from "@/contexts/ConfigContext";
import Admin from "./pages/Admin";
import Datenschutz from "./pages/Datenschutz";
import Bildrechte from "./pages/Bildrechte";
import Press from "./pages/Press";

const queryClient = new QueryClient();

const { pages } = siteConfig;

const BARE_ROUTES = ["/press", "/admin"];

const Shell = () => {
  const { pathname } = useLocation();
  const bare = BARE_ROUTES.includes(pathname);
  return (
    <>
      {!bare && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={pages.works.enabled ? <Gallery /> : <Navigate to="/" replace />} />
          <Route path="/about" element={pages.about.enabled ? <About /> : <Navigate to="/" replace />} />
          <Route path="/events" element={pages.events.enabled ? <Events /> : <Navigate to="/" replace />} />
          <Route path="/contact" element={pages.contact.enabled ? <Contact /> : <Navigate to="/" replace />} />
          <Route path="/press" element={<Press />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/bildrechte" element={<Bildrechte />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      {!bare && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <ConfigProvider>
          <Shell />
        </ConfigProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
