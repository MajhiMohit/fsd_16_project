import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { EXHIBITIONS, ARTWORKS } from "../data/mockData";
import { ArrowRight, Calendar } from "lucide-react";

const Exhibitions = () => {
    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
                <motion.div className="text-center mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="section-eyebrow">Curated Collections</p>
                    <h1 className="section-title italic">Current Exhibitions</h1>
                    <div className="gold-divider" />
                </motion.div>

                <div className="flex-col gap-3">
                    {EXHIBITIONS.map((ex, i) => {
                        const artworks = ARTWORKS.filter((a) => ex.artworkIds.includes(a.id));
                        return (
                            <motion.div
                                key={ex.id}
                                className="exhibition-detail-card glass-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15 }}
                            >
                                <div className="exhibition-detail-image">
                                    <img src={ex.coverImage} alt={ex.title} />
                                    {ex.featured && <span className="badge badge-gold exhibition-featured-badge">Featured</span>}
                                </div>
                                <div className="exhibition-detail-content">
                                    <span className="badge badge-gold mb-2">{ex.theme}</span>
                                    <h2 className="font-display" style={{ fontSize: "1.8rem" }}>{ex.title}</h2>
                                    <p className="text-sm text-muted mb-1">Curated by <span className="text-gold">{ex.curator}</span></p>
                                    <div className="flex gap-1 mb-3" style={{ alignItems: "center" }}>
                                        <Calendar size={14} style={{ color: "var(--text-muted)" }} />
                                        <span className="text-xs text-muted">
                                            {new Date(ex.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })} –{" "}
                                            {new Date(ex.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                        </span>
                                    </div>
                                    <p className="text-sm mb-3">{ex.description}</p>

                                    <div className="exhibition-artworks-row">
                                        {artworks.slice(0, 4).map((a) => (
                                            <Link key={a.id} to={`/artwork/${a.id}`} className="exhibition-artwork-thumb" title={a.title}>
                                                <img src={a.image} alt={a.title} />
                                            </Link>
                                        ))}
                                        {artworks.length > 4 && (
                                            <span className="exhibition-artwork-more">+{artworks.length - 4}</span>
                                        )}
                                    </div>

                                    <Link to="/gallery" className="btn btn-outline btn-sm mt-3">
                                        Explore Artworks <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Exhibitions;
