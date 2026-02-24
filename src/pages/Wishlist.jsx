import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ExternalLink, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ARTWORKS } from "../data/mockData";
import ArtworkCard from "../components/ArtworkCard";

const Wishlist = () => {
    const { wishlist, toggleWishlist, isAuthenticated } = useAuth();
    const wishlisted = ARTWORKS.filter((a) => wishlist.includes(a.id));

    if (!isAuthenticated) {
        return (
            <div className="page-wrapper flex-center" style={{ minHeight: "80vh" }}>
                <div className="text-center">
                    <h2 className="font-display mb-2">Sign in to view your wishlist</h2>
                    <Link to="/login" className="btn btn-primary mt-3">Sign In</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
                <motion.div className="text-center mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="section-eyebrow">Saved Artworks</p>
                    <h1 className="section-title italic">My Wishlist</h1>
                    <div className="gold-divider" />
                </motion.div>

                {wishlisted.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><Heart size={48} style={{ color: "var(--text-muted)" }} /></div>
                        <h3>Your wishlist is empty</h3>
                        <p>Browse the gallery and save artworks you love.</p>
                        <Link to="/gallery" className="btn btn-outline mt-3">Browse Gallery</Link>
                    </div>
                ) : (
                    <>
                        <p className="text-muted text-sm mb-3">
                            {wishlisted.length} artwork{wishlisted.length !== 1 ? "s" : ""} saved
                        </p>
                        <div className="gallery-grid">
                            {wishlisted.map((artwork, i) => (
                                <motion.div key={artwork.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                                    <ArtworkCard artwork={artwork} />
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
