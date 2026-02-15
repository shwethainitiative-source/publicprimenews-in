import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import About from "./pages/About";
import CategoryPage from "./pages/CategoryPage";
import JobsPage from "./pages/JobsPage";
import GalleryPage from "./pages/GalleryPage";
import FeedbackPage from "./pages/FeedbackPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageNews from "./pages/admin/ManageNews";
import ManageVideos from "./pages/admin/ManageVideos";
import ManageQuotes from "./pages/admin/ManageQuotes";
import ManageAds from "./pages/admin/ManageAds";
import ManageCategories from "./pages/admin/ManageCategories";
import AdminSettings from "./pages/admin/AdminSettings";
import ManageJobs from "./pages/admin/ManageJobs";
import ManageGallery from "./pages/admin/ManageGallery";
import ManageFeedback from "./pages/admin/ManageFeedback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="news" element={<ManageNews />} />
                <Route path="videos" element={<ManageVideos />} />
                <Route path="quotes" element={<ManageQuotes />} />
                <Route path="ads" element={<ManageAds />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="jobs" element={<ManageJobs />} />
                <Route path="gallery" element={<ManageGallery />} />
                <Route path="feedback" element={<ManageFeedback />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
