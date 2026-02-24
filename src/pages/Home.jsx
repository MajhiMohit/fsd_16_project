import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import ArtworkCard from "../components/ArtworkCard";
import { ARTWORKS, EXHIBITIONS } from "../data/mockData";

// Stagger animation variants
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};



const Home = () => {
    const featuredArtworks = ARTWORKS.filter((a) => a.featured);
    const featuredExhibitions = EXHIBITIONS.filter((e) => e.featured);

    return (
        <div className="page-wrapper">
            {/* ─── HERO ────────────────────────────────────────── */}
            <section className="home-hero">
                {/* Animated background blobs */}
                <div className="home-hero-blob blob-1" />
                <div className="home-hero-blob blob-2" />
                <div className="home-hero-blob blob-3" />

                <div className="container home-hero-content">
                    <motion.p
                        className="section-eyebrow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Welcome to the Future of Art
                    </motion.p>

                    <motion.h1
                        className="home-hero-title"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                    >
                        Art<span className="home-hero-italic">Gallery</span>
                    </motion.h1>

                    <motion.div
                        className="gold-divider"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        style={{ transformOrigin: "left" }}
                    />

                    <motion.p
                        className="home-hero-subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.55 }}
                    >
                        A premium virtual museum celebrating the world's finest artworks.
                        <br />Explore, collect, and experience art from anywhere.
                    </motion.p>

                    <motion.div
                        className="flex gap-2 home-hero-cta"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                    >
                        <Link to="/gallery" className="btn btn-primary btn-lg">
                            Browse Gallery <ArrowRight size={18} />
                        </Link>
                        <Link to="/virtual-tour" className="btn btn-ghost btn-lg">
                            <Play size={18} /> Virtual Tour
                        </Link>
                    </motion.div>
                </div>
            </section>


            {/* ─── FEATURED ARTWORKS ───────────────────────────── */}
            <section className="section">
                <div className="container">
                    <motion.div
                        className="text-center mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="section-eyebrow">Curated Selection</p>
                        <h2 className="section-title italic">Featured Artworks</h2>
                        <div className="gold-divider" />
                    </motion.div>

                    <motion.div
                        className="home-artworks-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {featuredArtworks.map((artwork) => (
                            <motion.div key={artwork.id} variants={itemVariants}>
                                <ArtworkCard artwork={artwork} />
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="text-center mt-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <Link to="/gallery" className="btn btn-outline btn-lg">
                            Explore Full Gallery <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>


            {/* ─── EXHIBITIONS ─────────────────────────────────── */}
            <section className="section">
                <div className="container">
                    <motion.div
                        className="flex-between mb-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div>
                            <p className="section-eyebrow">Currently Showing</p>
                            <h2 className="section-title italic">Exhibitions</h2>
                        </div>
                        <Link to="/exhibitions" className="btn btn-ghost">
                            All Exhibitions <ArrowRight size={16} />
                        </Link>
                    </motion.div>

                    <div className="exhibitions-grid">
                        {featuredExhibitions.map((ex, i) => (
                            <motion.div
                                key={ex.id}
                                className="exhibition-card card"
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                                whileHover={{ y: -6 }}
                            >
                                <div className="exhibition-image-wrapper">
                                    <img src={ex.coverImage} alt={ex.title} className="exhibition-image" />
                                    <div className="exhibition-image-overlay" />
                                </div>
                                <div className="exhibition-content">
                                    <span className="badge badge-gold mb-2">{ex.theme}</span>
                                    <h3 className="exhibition-title">{ex.title}</h3>
                                    <p className="exhibition-desc">
                                        {ex.description.slice(0, 100)}…
                                    </p>
                                    <div className="exhibition-meta">
                                        <span className="text-xs text-muted">
                                            {new Date(ex.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                                            {new Date(ex.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </span>
                                        <Link to="/exhibitions" className="btn btn-ghost btn-sm">
                                            Explore <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA SECTION ─────────────────────────────────── */}
            <section className="cta-section">
                <div className="container text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="section-eyebrow">Join Us</p>
                        <h2 className="cta-title">Begin Your Journey in the World of Art</h2>
                        <p className="cta-subtitle">
                            Create your free account to save favourites, access virtual tours, and purchase original artwork.
                        </p>
                        <div className="flex-center gap-2 mt-4">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Create Account <ArrowRight size={18} />
                            </Link>
                            <Link to="/gallery" className="btn btn-outline btn-lg">
                                Browse Gallery
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
