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
import ScrollManager from "./components/ScrollManager";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollManager />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vlogs" element={<Vlogs />} />
            <Route path="/vlogs/:slug" element={<VlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/certificates" element={<Certificates />} />
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
