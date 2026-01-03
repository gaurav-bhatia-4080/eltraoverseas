import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Vlogs from "./pages/Vlogs";
import VlogDetail from "./pages/VlogDetail";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Certificates from "./pages/Certificates";
import Admin from "./pages/Admin";
import Gallery from "./pages/Gallery";
import ScrollManager from "./components/ScrollManager";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollManager />
          <FloatingWhatsApp />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vlogs" element={<Vlogs />} />
            <Route path="/vlogs/:slug" element={<VlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
