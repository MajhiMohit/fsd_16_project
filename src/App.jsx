import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Styles
import "./App.css";

// Context
import { AuthProvider } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import ArtworkDetails from "./pages/ArtworkDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ArtistDashboard from "./pages/ArtistDashboard";
import CuratorDashboard from "./pages/CuratorDashboard";
import VirtualTour from "./pages/VirtualTour";
import Wishlist from "./pages/Wishlist";
import Purchases from "./pages/Purchases";
import Exhibitions from "./pages/Exhibitions";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Pages that should not show the footer
const NO_FOOTER_PATHS = ["/admin", "/artist", "/curator", "/virtual-tour"];

// Inner App wrapped in Router context
const AppInner = () => {
  const { pathname } = useLocation();
  const showFooter = !NO_FOOTER_PATHS.some((p) => pathname.startsWith(p));

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/artwork/:id" element={<ArtworkDetails />} />
          <Route path="/exhibitions" element={<Exhibitions />} />
          <Route path="/virtual-tour" element={<VirtualTour />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected — Visitor */}
          <Route path="/wishlist" element={
            <ProtectedRoute roles={["visitor", "admin", "artist", "curator"]}>
              <Wishlist />
            </ProtectedRoute>
          } />
          <Route path="/purchases" element={
            <ProtectedRoute roles={["visitor", "admin"]}>
              <Purchases />
            </ProtectedRoute>
          } />

          {/* Protected — Admin */}
          <Route path="/admin" element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Protected — Artist */}
          <Route path="/artist" element={
            <ProtectedRoute roles={["artist"]}>
              <ArtistDashboard />
            </ProtectedRoute>
          } />

          {/* Protected — Curator */}
          <Route path="/curator" element={
            <ProtectedRoute roles={["curator"]}>
              <CuratorDashboard />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="page-wrapper flex-center" style={{ minHeight: "80vh" }}>
              <div className="text-center">
                <h1 className="gradient-text" style={{ fontSize: "8rem", fontFamily: "Cormorant Garamond, serif" }}>404</h1>
                <h2 className="font-display mb-2">Page Not Found</h2>
                <p className="mb-4">The artwork you're looking for doesn't exist in our collection.</p>
                <a href="/" className="btn btn-primary">Return to Gallery</a>
              </div>
            </div>
          } />
        </Routes>
      </AnimatePresence>
      {showFooter && <Footer />}
    </>
  );
};

// Root App Component
const App = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("gallery_theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("gallery_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <AppInner />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
