import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye, Star, Tag } from "lucide-react";
import { useAuth } from "../context/AuthContext";

/**
 * ArtworkCard — reusable card component for gallery grid
 * @param {Object} artwork - The artwork data object
 * @param {boolean} compact - Renders a smaller version if true
 */
const ArtworkCard = ({ artwork, compact = false }) => {
    const { isAuthenticated, toggleWishlist, isWishlisted } = useAuth();
    const wishlisted = isWishlisted(artwork.id);

    const handleWishlist = (e) => {
        e.preventDefault();
        if (isAuthenticated) toggleWishlist(artwork.id);
    };

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="artwork-card"
        >
            <Link to={`/artwork/${artwork.id}`} style={{ display: "block" }}>
                {/* Image */}
                <div className="artwork-image-wrapper">
                    <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="artwork-image"
                        loading="lazy"
                    />

                    {/* Overlay on hover */}
                    <div className="artwork-overlay">
                        <div className="artwork-overlay-actions">
                            <button className="overlay-action-btn">
                                <Eye size={16} />
                                View
                            </button>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="artwork-badges">
                        {artwork.featured && <span className="badge badge-gold">Featured</span>}
                        {artwork.sold && <span className="badge badge-red">Sold</span>}
                    </div>

                    {/* Wishlist */}
                    <button
                        className={`wishlist-btn ${wishlisted ? "active" : ""}`}
                        onClick={handleWishlist}
                        title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Content */}
                <div className="artwork-content">
                    <div className="artwork-meta">
                        <span className="artwork-category">{artwork.category}</span>
                        <span className="artwork-era">{artwork.era}</span>
                    </div>

                    <h3 className="artwork-title">{artwork.title}</h3>

                    {!compact && (
                        <p className="artwork-artist">by {artwork.artist}</p>
                    )}

                    <div className="artwork-footer">
                        <div className="artwork-rating">
                            <Star size={12} fill="currentColor" style={{ color: "var(--gold)" }} />
                            <span>{artwork.rating}</span>
                            <span className="text-muted">({artwork.reviews})</span>
                        </div>
                        <div className="artwork-price">
                            {artwork.sold ? (
                                <span className="price-sold">Sold</span>
                            ) : (
                                <>
                                    <Tag size={12} />
                                    <span>₹{artwork.price.toLocaleString("en-IN")}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ArtworkCard;
