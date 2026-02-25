import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard, ShoppingBag, Heart, Compass,
    Eye, Star, TrendingUp, ExternalLink, Play, Map
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ARTWORKS, EXHIBITIONS } from "../data/mockData";

const SIDEBAR_ITEMS = [
    { key: "overview", label: "My Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "browse", label: "Browse Artworks", icon: <Compass size={18} /> },
    { key: "tours", label: "Virtual Tours", icon: <Map size={18} /> },
    { key: "purchases", label: "My Purchases", icon: <ShoppingBag size={18} /> },
    { key: "wishlist", label: "My Wishlist", icon: <Heart size={18} /> },
];

const VisitorDashboard = () => {
    const { user, purchases, wishlist, isWishlisted } = useAuth();
    const [active, setActive] = useState("overview");
    const navigate = useNavigate();

    const wishlisted = ARTWORKS.filter((a) => wishlist.includes(a.id));
    const availableArtworks = ARTWORKS.filter((a) => !a.sold);
    const featuredArtworks = ARTWORKS.filter((a) => a.featured);

    return (
        <div className="page-wrapper dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-user">
                    <div>
                        <p className="sidebar-user-name">{user.name}</p>
                        <span className="badge badge-gold">Visitor</span>
                    </div>
                </div>
                <div className="gold-divider mb-3 mt-3" style={{ marginLeft: 0, width: "100%" }} />
                {SIDEBAR_ITEMS.map((item) => (
                    <button
                        key={item.key}
                        className={`sidebar-nav-item ${active === item.key ? "active" : ""}`}
                        onClick={() => setActive(item.key)}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >

                    {/* ── OVERVIEW ── */}
                    {active === "overview" && (
                        <div>
                            <div className="dashboard-header">
                                <div>
                                    <h2 className="font-display">Visitor Dashboard</h2>
                                    <p className="text-muted text-sm">Browse artworks, join virtual tours &amp; track your collection</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid-4 mb-4">
                                {[
                                    { label: "Artworks Available", value: availableArtworks.length, icon: <Eye size={22} />, color: "var(--gold)" },
                                    { label: "My Purchases", value: purchases.length, icon: <ShoppingBag size={22} />, color: "var(--accent-teal)" },
                                    { label: "Wishlist Items", value: wishlisted.length, icon: <Heart size={22} />, color: "var(--accent-purple)" },
                                    { label: "Live Exhibitions", value: EXHIBITIONS.length, icon: <TrendingUp size={22} />, color: "var(--accent-red)" },
                                ].map((s, i) => (
                                    <motion.div
                                        key={s.label}
                                        className="stat-card-dashboard glass-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                    >
                                        <div className="stat-dash-icon" style={{ color: s.color, background: `${s.color}18` }}>
                                            {s.icon}
                                        </div>
                                        <div className="stat-dash-value">{s.value}</div>
                                        <div className="stat-dash-label">{s.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Featured Artworks */}
                            <div className="glass-card mb-4" style={{ padding: "1.5rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                    <h3 className="font-display">Featured Artworks</h3>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setActive("browse")}>View All →</button>
                                </div>
                                <div className="gallery-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
                                    {featuredArtworks.slice(0, 4).map((a) => (
                                        <motion.div key={a.id} className="card" style={{ overflow: "hidden" }} whileHover={{ y: -4 }}>
                                            <img src={a.image} alt={a.title} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                                            <div style={{ padding: "0.75rem" }}>
                                                <p className="text-sm" style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</p>
                                                <p className="text-xs text-muted">{a.artist}</p>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                                                    <span style={{ color: "var(--gold)", fontSize: "0.8rem", fontWeight: 700 }}>${a.price}</span>
                                                    <Link to={`/artwork/${a.id}`} className="btn btn-ghost btn-sm" style={{ padding: "0.2rem 0.5rem" }}>
                                                        <ExternalLink size={12} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Current Exhibitions */}
                            <div className="glass-card" style={{ padding: "1.5rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                    <h3 className="font-display">Current Exhibitions</h3>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setActive("tours")}>Explore Tours →</button>
                                </div>
                                <div className="activity-list">
                                    {EXHIBITIONS.map((ex) => (
                                        <div key={ex.id} className="activity-item">
                                            <img src={ex.coverImage} alt={ex.title} style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)", objectFit: "cover" }} />
                                            <div style={{ flex: 1 }}>
                                                <p className="text-sm" style={{ fontWeight: 600 }}>{ex.title}</p>
                                                <p className="text-xs text-muted">{ex.theme} · {ex.artworkIds.length} artworks</p>
                                            </div>
                                            <span className={`badge ${ex.featured ? "badge-gold" : "badge-green"}`}>{ex.featured ? "Featured" : "Active"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── BROWSE ARTWORKS ── */}
                    {active === "browse" && (
                        <div>
                            <div className="dashboard-header">
                                <h2 className="font-display">Browse &amp; Explore Artworks</h2>
                                <Link to="/gallery" className="btn btn-primary btn-sm">
                                    <Compass size={16} /> Open Full Gallery
                                </Link>
                            </div>

                            {/* Summary Row */}
                            <div className="grid-3 mb-4">
                                {[
                                    { label: "Total Artworks", value: ARTWORKS.length },
                                    { label: "Available to Buy", value: availableArtworks.length },
                                    { label: "Sold", value: ARTWORKS.filter(a => a.sold).length },
                                ].map((s) => (
                                    <div key={s.label} className="stat-card-dashboard glass-card">
                                        <div className="stat-dash-value">{s.value}</div>
                                        <div className="stat-dash-label">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="glass-card" style={{ overflow: "auto" }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Artwork</th>
                                            <th>Artist</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Rating</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ARTWORKS.map((a) => (
                                            <tr key={a.id}>
                                                <td>
                                                    <div className="flex gap-1" style={{ alignItems: "center" }}>
                                                        <img src={a.image} alt={a.title} className="table-avatar" style={{ borderRadius: "4px" }} />
                                                        <span>{a.title}</span>
                                                    </div>
                                                </td>
                                                <td>{a.artist}</td>
                                                <td>{a.category}</td>
                                                <td style={{ color: "var(--gold)", fontWeight: 600 }}>${a.price}</td>
                                                <td>
                                                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                                        <Star size={12} style={{ color: "var(--gold)" }} fill="var(--gold)" />
                                                        {a.rating}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${a.sold ? "badge-red" : "badge-green"}`}>
                                                        {a.sold ? "Sold" : "Available"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link to={`/artwork/${a.id}`} className="btn btn-ghost btn-sm btn-icon">
                                                        <ExternalLink size={14} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── VIRTUAL TOURS ── */}
                    {active === "tours" && (
                        <div>
                            <div className="dashboard-header">
                                <div>
                                    <h2 className="font-display">Virtual Tours &amp; Exhibitions</h2>
                                    <p className="text-muted text-sm">Immersive art experiences from around the world</p>
                                </div>
                                <Link to="/virtual-tour" className="btn btn-primary btn-sm">
                                    <Play size={16} /> Start Full Tour
                                </Link>
                            </div>

                            <div className="grid-3 mb-4">
                                {[
                                    { label: "Live Exhibitions", value: EXHIBITIONS.length },
                                    { label: "Featured Shows", value: EXHIBITIONS.filter(e => e.featured).length },
                                    { label: "Artworks on View", value: [...new Set(EXHIBITIONS.flatMap(e => e.artworkIds))].length },
                                ].map((s, i) => (
                                    <motion.div key={s.label} className="stat-card-dashboard glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                        <div className="stat-dash-value">{s.value}</div>
                                        <div className="stat-dash-label">{s.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="grid-2">
                                {EXHIBITIONS.map((ex, i) => (
                                    <motion.div
                                        key={ex.id}
                                        className="glass-card"
                                        style={{ overflow: "hidden" }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ y: -4 }}
                                    >
                                        <div style={{ position: "relative" }}>
                                            <img src={ex.coverImage} alt={ex.title} style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }} />
                                            <div style={{
                                                position: "absolute", inset: 0,
                                                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
                                            }} />
                                            {ex.featured && (
                                                <span className="badge badge-gold" style={{ position: "absolute", top: 12, right: 12 }}>⭐ Featured</span>
                                            )}
                                            {/* Tour play button overlay */}
                                            <Link
                                                to="/virtual-tour"
                                                style={{
                                                    position: "absolute", top: "50%", left: "50%",
                                                    transform: "translate(-50%,-50%)",
                                                    width: 52, height: 52, borderRadius: "50%",
                                                    background: "rgba(212,175,55,0.85)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    border: "2px solid rgba(255,255,255,0.4)",
                                                    color: "#111",
                                                    transition: "transform 0.2s",
                                                }}
                                            >
                                                <Play size={20} fill="#111" />
                                            </Link>
                                        </div>
                                        <div style={{ padding: "1.25rem" }}>
                                            <span className="badge badge-gold mb-2">{ex.theme}</span>
                                            <h3 className="font-display mt-1">{ex.title}</h3>
                                            <p className="text-xs text-muted mt-1">{ex.artworkIds.length} artworks · Curator: {ex.curator}</p>
                                            <p className="text-sm mt-2" style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
                                                {ex.description.slice(0, 100)}…
                                            </p>
                                            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                                                <Link to="/virtual-tour" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                                                    <Play size={14} /> Enter Tour
                                                </Link>
                                                <Link to="/exhibitions" className="btn btn-ghost btn-sm">
                                                    Details
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── PURCHASES ── */}
                    {active === "purchases" && (
                        <div>
                            <div className="dashboard-header">
                                <h2 className="font-display">My Purchases</h2>
                                <Link to="/gallery" className="btn btn-outline btn-sm">
                                    <ShoppingBag size={16} /> Shop More
                                </Link>
                            </div>

                            {purchases.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">🛍️</div>
                                    <h3>No purchases yet</h3>
                                    <p>Explore the gallery and acquire your first original artwork.</p>
                                    <Link to="/gallery" className="btn btn-outline mt-2">Browse Gallery</Link>
                                </div>
                            ) : (
                                <>
                                    {/* Purchase stats */}
                                    <div className="grid-3 mb-4">
                                        {[
                                            { label: "Total Acquired", value: purchases.length },
                                            { label: "Total Spent", value: `$${purchases.reduce((s, p) => s + p.price, 0).toLocaleString()}` },
                                            { label: "Latest Acquisition", value: purchases.length > 0 ? new Date(purchases[purchases.length - 1].purchasedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—" },
                                        ].map((s) => (
                                            <div key={s.label} className="stat-card-dashboard glass-card">
                                                <div className="stat-dash-value">{s.value}</div>
                                                <div className="stat-dash-label">{s.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="glass-card" style={{ overflow: "auto" }}>
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Artwork</th>
                                                    <th>Artist</th>
                                                    <th>Category</th>
                                                    <th>Price</th>
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
                                                        <td style={{ color: "var(--gold)", fontWeight: 600 }}>${p.price}</td>
                                                        <td className="text-muted text-xs">
                                                            {new Date(p.purchasedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                                        </td>
                                                        <td>
                                                            <Link to={`/artwork/${p.id}`} className="btn btn-ghost btn-sm btn-icon">
                                                                <ExternalLink size={14} />
                                                            </Link>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ── WISHLIST ── */}
                    {active === "wishlist" && (
                        <div>
                            <div className="dashboard-header">
                                <h2 className="font-display">My Wishlist</h2>
                                <Link to="/wishlist" className="btn btn-outline btn-sm">
                                    <Heart size={16} /> Full Wishlist
                                </Link>
                            </div>

                            {wishlisted.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">❤️</div>
                                    <h3>Your wishlist is empty</h3>
                                    <p>Browse artworks and heart the ones you love.</p>
                                    <button className="btn btn-outline mt-2" onClick={() => setActive("browse")}>Browse Artworks</button>
                                </div>
                            ) : (
                                <div className="gallery-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
                                    {wishlisted.map((a, i) => (
                                        <motion.div
                                            key={a.id}
                                            className="card"
                                            style={{ overflow: "hidden" }}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.07 }}
                                            whileHover={{ y: -5 }}
                                        >
                                            <img src={a.image} alt={a.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                                            <div style={{ padding: "0.9rem" }}>
                                                <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem" }}>{a.title}</p>
                                                <p className="text-xs text-muted">{a.artist}</p>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                                                    <span style={{ color: "var(--gold)", fontWeight: 700 }}>${a.price}</span>
                                                    <Link to={`/artwork/${a.id}`} className="btn btn-primary btn-sm" style={{ padding: "0.3rem 0.7rem" }}>
                                                        View
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </motion.div>
            </main>
        </div>
    );
};

export default VisitorDashboard;
