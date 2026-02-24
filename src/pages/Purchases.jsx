import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Purchases = () => {
    const { purchases, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="page-wrapper flex-center" style={{ minHeight: "80vh" }}>
                <div className="text-center">
                    <h2 className="font-display mb-2">Sign in to view your purchases</h2>
                    <Link to="/login" className="btn btn-primary mt-3">Sign In</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
                <motion.div className="text-center mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="section-eyebrow">Purchase History</p>
                    <h1 className="section-title italic">My Acquisitions</h1>
                    <div className="gold-divider" />
                </motion.div>

                {purchases.length === 0 ? (
                    <div className="empty-state">
                        <ShoppingBag size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
                        <h3>No purchases yet</h3>
                        <p>Explore the gallery and acquire your first original artwork.</p>
                        <Link to="/gallery" className="btn btn-outline mt-3">Browse Gallery</Link>
                    </div>
                ) : (
                    <div className="glass-card" style={{ overflow: "auto" }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Artwork</th>
                                    <th>Artist</th>
                                    <th>Category</th>

                                    <th>Acquired</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map((p, i) => (
                                    <motion.tr key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                                        <td>
                                            <div className="flex gap-1" style={{ alignItems: "center" }}>
                                                <img src={p.image} alt={p.title} className="table-avatar" style={{ borderRadius: "4px" }} />
                                                <span>{p.title}</span>
                                            </div>
                                        </td>
                                        <td>{p.artist}</td>
                                        <td>{p.category}</td>

                                        <td className="text-muted text-xs">
                                            {new Date(p.purchasedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                        </td>
                                        <td>
                                            <Link to={`/artwork/${p.id}`} className="btn btn-ghost btn-sm">
                                                <ExternalLink size={14} />
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Purchases;
