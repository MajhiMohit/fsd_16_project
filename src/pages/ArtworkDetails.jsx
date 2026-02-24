import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft, Heart, ShoppingCart, Star, Eye, MapPin,
    Calendar, Ruler, Palette, User, Share2, Check
} from "lucide-react";
import { ARTWORKS, REVIEWS } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import ArtworkCard from "../components/ArtworkCard";

const StarRow = ({ rating, onChange }) =>
    [1, 2, 3, 4, 5].map((s) => (
        <Star
            key={s}
            size={20}
            fill={s <= rating ? "var(--gold)" : "none"}
            stroke={s <= rating ? "var(--gold)" : "var(--text-muted)"}
            style={{ cursor: onChange ? "pointer" : "default" }}
            onClick={() => onChange && onChange(s)}
        />
    ));

const ArtworkDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user, toggleWishlist, isWishlisted, addPurchase } = useAuth();

    const artwork = ARTWORKS.find((a) => a.id === Number(id));
    const artworkReviews = REVIEWS.filter((r) => r.artworkId === Number(id));
    const related = ARTWORKS.filter((a) => a.category === artwork?.category && a.id !== artwork?.id).slice(0, 3);

    const [purchased, setPurchased] = useState(false);
    const [purchaseModal, setPurchaseModal] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [localReviews, setLocalReviews] = useState(artworkReviews);
    const [activeTab, setActiveTab] = useState("details");
    const [shared, setShared] = useState(false);

    if (!artwork) {
        return (
            <div className="page-wrapper flex-center" style={{ minHeight: "80vh" }}>
                <div className="text-center">
                    <h2>Artwork not found</h2>
                    <Link to="/gallery" className="btn btn-outline mt-3">
                        Back to Gallery
                    </Link>
                </div>
            </div>
        );
    }

    const wishlisted = isWishlisted(artwork.id);

    const handlePurchase = () => {
        if (!isAuthenticated) { navigate("/login"); return; }
        setPurchaseModal(true);
    };

    const confirmPurchase = () => {
        addPurchase(artwork);
        setPurchased(true);
        setPurchaseModal(false);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
    };

    const submitReview = () => {
        if (!reviewText.trim() || !isAuthenticated) return;
        const newReview = {
            id: Date.now(),
            artworkId: artwork.id,
            userId: user.id,
            userName: user.name,
            rating: reviewRating,
            comment: reviewText,
            date: new Date().toISOString().split("T")[0],
        };
        setLocalReviews((prev) => [newReview, ...prev]);
        setReviewText("");
        setReviewRating(5);
    };

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
                {/* Back */}
                <motion.button
                    className="btn btn-ghost btn-sm mb-4"
                    onClick={() => navigate(-1)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <ArrowLeft size={16} /> Back
                </motion.button>

                {/* Main Layout */}
                <div className="artwork-detail-grid">
                    {/* Left — Image */}
                    <motion.div
                        className="artwork-detail-image-col"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="artwork-detail-image-wrapper">
                            <img src={artwork.image} alt={artwork.title} className="artwork-detail-image" />
                            <div className="artwork-detail-badges">
                                {artwork.featured && <span className="badge badge-gold">Featured</span>}
                                {artwork.sold && <span className="badge badge-red">Sold</span>}
                            </div>
                        </div>
                        <div className="artwork-detail-image-meta">
                            <span className="text-xs text-muted flex gap-1">
                                <Eye size={14} /> {artwork.views.toLocaleString()} views
                            </span>
                            <div className="flex gap-1" style={{ alignItems: "center" }}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={13} fill={s <= Math.round(artwork.rating) ? "var(--gold)" : "none"} stroke={s <= Math.round(artwork.rating) ? "var(--gold)" : "var(--text-muted)"} />
                                ))}
                                <span className="text-xs text-muted">{artwork.rating} ({artwork.reviews} reviews)</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Info */}
                    <motion.div
                        className="artwork-detail-info"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <div className="flex gap-1 mb-2">
                            <span className="badge badge-gold">{artwork.category}</span>
                            <span className="badge badge-purple">{artwork.era}</span>
                        </div>

                        <h1 className="artwork-detail-title">{artwork.title}</h1>
                        <p className="artwork-detail-artist">
                            <User size={15} /> by <span className="text-gold">{artwork.artist}</span>
                        </p>

                        <div className="gold-divider gold-divider-left mt-3 mb-3" />
                        <div className="artwork-detail-price-row">
                            <div>
                                <p className="text-xs text-muted mb-1 font-mono" style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}>Price</p>
                                {artwork.sold ? (
                                    <span className="detail-price sold">Sold</span>
                                ) : (
                                    <span className="detail-price">₹{artwork.price.toLocaleString("en-IN")}</span>
                                )}
                            </div>
                            <div className="artwork-action-btns">
                                <button
                                    className={`btn btn-icon ${wishlisted ? "btn-danger" : "btn-ghost"}`}
                                    onClick={() => isAuthenticated ? toggleWishlist(artwork.id) : navigate("/login")}
                                    title="Wishlist"
                                >
                                    <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
                                </button>
                                <button className="btn btn-icon btn-ghost" onClick={handleShare} title="Share">
                                    {shared ? <Check size={18} /> : <Share2 size={18} />}
                                </button>
                            </div>
                        </div>


                        {/* Buy Button */}
                        {!artwork.sold && !purchased && (
                            <button className="btn btn-primary btn-lg w-full mt-3" onClick={handlePurchase}>
                                <ShoppingCart size={18} /> Purchase Artwork
                            </button>
                        )}
                        {purchased && (
                            <div className="alert alert-success mt-3">
                                ✅ You have successfully purchased this artwork!
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="detail-tabs mt-4">
                            {["details", "cultural", "reviews"].map((tab) => (
                                <button
                                    key={tab}
                                    className={`detail-tab ${activeTab === tab ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="detail-tab-content"
                        >
                            {activeTab === "details" && (
                                <>
                                    <p className="mb-3">{artwork.description}</p>
                                    <div className="detail-specs">
                                        {[
                                            { icon: <Palette size={15} />, label: "Medium", value: artwork.medium },
                                            { icon: <Ruler size={15} />, label: "Dimensions", value: artwork.dimensions },
                                            { icon: <Calendar size={15} />, label: "Year", value: artwork.year },
                                            { icon: <MapPin size={15} />, label: "Origin", value: artwork.origin },
                                        ].map((s) => (
                                            <div key={s.label} className="spec-row">
                                                <span className="spec-label flex gap-1">
                                                    {s.icon} {s.label}
                                                </span>
                                                <span className="spec-value">{s.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="tag-row mt-3">
                                        {artwork.tags.map((tag) => (
                                            <span key={tag} className="badge badge-purple">{tag}</span>
                                        ))}
                                    </div>
                                </>
                            )}

                            {activeTab === "cultural" && (
                                <div className="cultural-section">
                                    <p>{artwork.culturalSignificance}</p>
                                    <div className="cultural-highlight mt-3">
                                        <span className="text-gold">🌍 Origin:</span> {artwork.origin}
                                    </div>
                                </div>
                            )}

                            {activeTab === "reviews" && (
                                <div>
                                    {/* Write Review */}
                                    {isAuthenticated && (
                                        <div className="review-form mb-3">
                                            <p className="input-label">Your Rating</p>
                                            <div className="stars mb-2">
                                                <StarRow rating={reviewRating} onChange={setReviewRating} />
                                            </div>
                                            <textarea
                                                placeholder="Write your thoughts…"
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                                className="input-field"
                                                rows={3}
                                                style={{ resize: "vertical" }}
                                            />
                                            <button className="btn btn-primary btn-sm mt-2" onClick={submitReview}>
                                                Post Review
                                            </button>
                                        </div>
                                    )}

                                    {/* Reviews List */}
                                    {localReviews.length === 0 ? (
                                        <p className="text-muted text-sm">No reviews yet. Be the first!</p>
                                    ) : (
                                        localReviews.map((r) => (
                                            <div key={r.id} className="review-card">
                                                <div className="review-header">
                                                    <span className="review-author">{r.userName}</span>
                                                    <div className="stars">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star key={s} size={12} fill={s <= r.rating ? "var(--gold)" : "none"} stroke={s <= r.rating ? "var(--gold)" : "var(--text-muted)"} />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-muted">{r.date}</span>
                                                </div>
                                                <p className="review-comment">{r.comment}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Related Artworks */}
                {related.length > 0 && (
                    <section className="mt-4">
                        <h2 className="section-title italic mb-3">Related Artworks</h2>
                        <div className="gallery-grid">
                            {related.map((a) => <ArtworkCard key={a.id} artwork={a} />)}
                        </div>
                    </section>
                )}

                {/* Purchase Modal */}
                {purchaseModal && (
                    <div className="overlay" onClick={() => setPurchaseModal(false)}>
                        <motion.div
                            className="modal glass-card"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="font-display mb-2">Confirm Purchase</h3>
                            <div className="gold-divider gold-divider-left mb-3" />
                            <div className="modal-artwork-preview">
                                <img src={artwork.image} alt={artwork.title} />
                                <div>
                                    <p style={{ fontWeight: 600 }}>{artwork.title}</p>
                                    <p className="text-sm text-muted">by {artwork.artist}</p>

                                </div>
                            </div>
                            <p className="text-sm mt-3 mb-3">
                                By proceeding, you agree to our terms of sale. Payment is processed securely.
                            </p>
                            <div className="flex gap-2">
                                <button className="btn btn-primary flex-1" onClick={confirmPurchase}>
                                    Confirm Purchase
                                </button>
                                <button className="btn btn-ghost flex-1" onClick={() => setPurchaseModal(false)}>
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtworkDetails;
