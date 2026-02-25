import { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Plus, Trash2, Edit3, TrendingUp, Eye, DollarSign, Star, X, Check, Upload, Link } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ARTWORKS } from "../data/mockData";

const SIDEBAR_ITEMS = [
    { key: "overview", label: "Overview", icon: <TrendingUp size={18} /> },
    { key: "artworks", label: "My Artworks", icon: <Image size={18} /> },
    { key: "upload", label: "Upload Artwork", icon: <Plus size={18} /> },
    { key: "sales", label: "Sales", icon: <DollarSign size={18} /> },
];

const INITIAL_FORM = {
    title: "", price: "", category: "Oil Painting", era: "Contemporary",
    medium: "", dimensions: "", description: "", culturalSignificance: "",
    origin: "", tags: "",
};

const ArtistDashboard = () => {
    const { user } = useAuth();
    const [active, setActive] = useState("overview");
    const [artworks, setArtworks] = useState(ARTWORKS.filter((a) => a.artist === user.name));
    const [form, setForm] = useState(INITIAL_FORM);
    const [editId, setEditId] = useState(null);
    const [saved, setSaved] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [toast, setToast] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const [imageTab, setImageTab] = useState("upload");
    const fileInputRef = useRef(null);

    const showToast = (msg) => {
        setToast({ msg });
        setTimeout(() => setToast(null), 3000);
    };

    const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleImageFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
            setImageUrl("");
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => { setImagePreview(null); setImageUrl(""); };

    const handleSave = (e) => {
        e.preventDefault();
        if (!form.title || !form.price) return;

        if (editId) {
            setArtworks((prev) =>
                prev.map((a) =>
                    a.id === editId ? { ...a, ...form, price: Number(form.price) } : a
                )
            );
            setEditId(null);
        } else {
            const newArtwork = {
                id: Date.now(),
                ...form,
                price: Number(form.price),
                artist: user.name,
                artistId: user.id,
                rating: 0,
                reviews: 0,
                featured: false,
                sold: false,
                views: 0,
                image: imagePreview || imageUrl || "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=800&q=80",
                tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
                year: new Date().getFullYear(),
            };
            setArtworks((prev) => [newArtwork, ...prev]);
        }
        setForm(INITIAL_FORM);
        clearImage();
        setSaved(true);
        showToast(editId ? "Artwork updated successfully! ✅" : "Artwork uploaded successfully! 🎉");
        setTimeout(() => { setSaved(false); setActive("artworks"); }, 1500);
    };

    const startEdit = (artwork) => {
        setForm({
            title: artwork.title,
            price: artwork.price,
            category: artwork.category,
            era: artwork.era,
            medium: artwork.medium || "",
            dimensions: artwork.dimensions || "",
            description: artwork.description || "",
            culturalSignificance: artwork.culturalSignificance || "",
            origin: artwork.origin || "",
            tags: (artwork.tags || []).join(", "),
        });
        setEditId(artwork.id);
        setActive("upload");
    };

    const handleDelete = (id) => {
        setArtworks((prev) => prev.filter((a) => a.id !== id));
        setDeleteConfirm(null);
    };

    const totalViews = artworks.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalRevenue = artworks.filter((a) => a.sold).reduce((sum, a) => sum + a.price, 0);
    const avgRating = artworks.length
        ? (artworks.reduce((s, a) => s + a.rating, 0) / artworks.length).toFixed(1)
        : "—";

    return (
        <div className="page-wrapper dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-user">

                    <div>
                        <p className="sidebar-user-name">{user.name}</p>
                        <span className="badge badge-purple">Artist</span>
                    </div>
                </div>
                <div className="gold-divider mb-3 mt-3" style={{ marginLeft: 0, width: "100%" }} />
                {SIDEBAR_ITEMS.map((item) => (
                    <button
                        key={item.key}
                        className={`sidebar-nav-item ${active === item.key ? "active" : ""}`}
                        onClick={() => { setActive(item.key); if (item.key !== "upload") { setEditId(null); setForm(INITIAL_FORM); } }}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}
            </aside>

            {/* Main */}
            <main className="dashboard-main">
                <motion.div key={active} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                    {active === "overview" && (
                        <div>
                            <div className="dashboard-header">
                                <div>
                                    <h2 className="font-display">Artist Dashboard</h2>
                                    <p className="text-muted text-sm">Your portfolio & performance</p>
                                </div>
                            </div>
                            <div className="grid-4 mb-4">
                                {[
                                    { label: "Artworks", value: artworks.length, icon: <Image size={22} />, color: "var(--gold)" },
                                    { label: "Total Views", value: totalViews.toLocaleString(), icon: <Eye size={22} />, color: "var(--accent-teal)" },

                                    { label: "Avg Rating", value: avgRating, icon: <Star size={22} />, color: "var(--gold)" },
                                ].map((s, i) => (
                                    <motion.div key={s.label} className="stat-card-dashboard glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                                        <div className="stat-dash-icon" style={{ color: s.color, background: `${s.color}18` }}>{s.icon}</div>
                                        <div className="stat-dash-value">{s.value}</div>
                                        <div className="stat-dash-label">{s.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="glass-card" style={{ padding: "1.5rem" }}>
                                <h3 className="font-display mb-3">Your Latest Artworks</h3>
                                <div className="gallery-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
                                    {artworks.slice(0, 4).map((a) => (
                                        <div key={a.id} className="card" style={{ overflow: "hidden" }}>
                                            <img src={a.image} alt={a.title} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                                            <div style={{ padding: "0.75rem" }}>
                                                <p className="text-sm" style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</p>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {active === "artworks" && (
                        <div>
                            <div className="dashboard-header">
                                <h2 className="font-display">My Artworks</h2>
                                <button className="btn btn-primary btn-sm" onClick={() => setActive("upload")}>
                                    <Plus size={16} /> New Artwork
                                </button>
                            </div>
                            {artworks.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">🎨</div>
                                    <h3>No artworks yet</h3>
                                    <p>Upload your first artwork to showcase it.</p>
                                    <button className="btn btn-outline mt-2" onClick={() => setActive("upload")}>Upload Now</button>
                                </div>
                            ) : (
                                <div className="glass-card" style={{ overflow: "auto" }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr><th>Artwork</th><th>Category</th><th>Price</th><th>Status</th><th>Views</th><th>Actions</th></tr>
                                        </thead>
                                        <tbody>
                                            {artworks.map((a) => (
                                                <tr key={a.id}>
                                                    <td>
                                                        <div className="flex gap-1" style={{ alignItems: "center" }}>
                                                            <img src={a.image} alt={a.title} className="table-avatar" style={{ borderRadius: "4px" }} />
                                                            <span>{a.title}</span>
                                                        </div>
                                                    </td>
                                                    <td>{a.category}</td>

                                                    <td><span className={`badge ${a.sold ? "badge-red" : "badge-green"}`}>{a.sold ? "Sold" : "Available"}</span></td>
                                                    <td>{(a.views || 0).toLocaleString()}</td>
                                                    <td>
                                                        <div className="flex gap-1">
                                                            <button className="btn btn-ghost btn-sm btn-icon" onClick={() => startEdit(a)} title="Edit"><Edit3 size={14} /></button>
                                                            <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteConfirm(a.id)} title="Delete"><Trash2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {active === "upload" && (
                        <div>
                            <div className="dashboard-header">
                                <h2 className="font-display">{editId ? "Edit Artwork" : "Upload New Artwork"}</h2>
                            </div>
                            <div className="glass-card" style={{ padding: "2rem", maxWidth: 700 }}>
                                <form onSubmit={handleSave}>

                                    {/* ── Image Upload Box ── */}
                                    <div className="form-group">
                                        <label className="input-label">Artwork Image</label>

                                        {/* Tab switcher */}
                                        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                                            <button type="button"
                                                onClick={() => setImageTab("upload")}
                                                style={{
                                                    padding: "0.35rem 1rem", borderRadius: "999px", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                                                    background: imageTab === "upload" ? "var(--gold)" : "var(--surface-2)",
                                                    color: imageTab === "upload" ? "#111" : "var(--text-muted)",
                                                    transition: "all 0.2s"
                                                }}>
                                                <Upload size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />Upload File
                                            </button>
                                            <button type="button"
                                                onClick={() => setImageTab("url")}
                                                style={{
                                                    padding: "0.35rem 1rem", borderRadius: "999px", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                                                    background: imageTab === "url" ? "var(--gold)" : "var(--surface-2)",
                                                    color: imageTab === "url" ? "#111" : "var(--text-muted)",
                                                    transition: "all 0.2s"
                                                }}>
                                                <Link size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />Image URL
                                            </button>
                                        </div>

                                        {imageTab === "upload" ? (
                                            /* ─ Drag & Drop / Browse zone ─ */
                                            <div
                                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                                onDragLeave={() => setDragOver(false)}
                                                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageFile(e.dataTransfer.files[0]); }}
                                                onClick={() => !imagePreview && fileInputRef.current?.click()}
                                                style={{
                                                    border: `2px dashed ${dragOver ? "var(--gold)" : "var(--border)"}`,
                                                    borderRadius: "12px",
                                                    background: dragOver ? "rgba(212,175,55,0.07)" : "var(--surface-2)",
                                                    cursor: imagePreview ? "default" : "pointer",
                                                    minHeight: "160px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    position: "relative",
                                                    overflow: "hidden",
                                                    transition: "border-color 0.2s, background 0.2s"
                                                }}
                                            >
                                                {imagePreview ? (
                                                    <>
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); clearImage(); }}
                                                            style={{
                                                                position: "absolute", top: 8, right: 8,
                                                                background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%",
                                                                width: 28, height: 28, display: "flex", alignItems: "center",
                                                                justifyContent: "center", cursor: "pointer", color: "#fff"
                                                            }}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                                            style={{
                                                                position: "absolute", bottom: 8, right: 8,
                                                                background: "var(--gold)", border: "none", borderRadius: "8px",
                                                                padding: "0.3rem 0.7rem", cursor: "pointer", color: "#111",
                                                                fontSize: "0.75rem", fontWeight: 700
                                                            }}
                                                        >
                                                            Change
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                                                        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🖼️</div>
                                                        <p style={{ fontWeight: 600, marginBottom: "0.3rem" }}>Drag & drop your image here</p>
                                                        <p style={{ fontSize: "0.8rem" }}>or <span style={{ color: "var(--gold)", textDecoration: "underline" }}>click to browse</span></p>
                                                        <p style={{ fontSize: "0.72rem", marginTop: "0.4rem" }}>PNG, JPG, WEBP • Max 10 MB</p>
                                                    </div>
                                                )}
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: "none" }}
                                                    onChange={(e) => handleImageFile(e.target.files[0])}
                                                />
                                            </div>
                                        ) : (
                                            /* ─ URL input + preview ─ */
                                            <div>
                                                <input
                                                    className="input-field"
                                                    placeholder="https://example.com/artwork.jpg"
                                                    value={imageUrl}
                                                    onChange={(e) => { setImageUrl(e.target.value); setImagePreview(null); }}
                                                />
                                                {imageUrl && (
                                                    <div style={{ marginTop: "0.75rem", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                                        <img
                                                            src={imageUrl}
                                                            alt="URL Preview"
                                                            onError={(e) => { e.target.style.display = "none"; }}
                                                            onLoad={(e) => { e.target.style.display = "block"; }}
                                                            style={{ width: "100%", maxHeight: "200px", objectFit: "cover", display: "block" }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {/* ── End Image Upload Box ── */}

                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="input-label">Title *</label>
                                            <input className="input-field" placeholder="Artwork title" value={form.title} onChange={update("title")} required />
                                        </div>

                                        <div className="form-group">
                                            <label className="input-label">Category</label>
                                            <select className="input-field" value={form.category} onChange={update("category")}>
                                                {["Oil Painting", "Watercolor", "Digital Art", "Photography", "Sculpture", "Mixed Media"].map((c) => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="input-label">Era</label>
                                            <select className="input-field" value={form.era} onChange={update("era")}>
                                                {["Classical", "Modern", "Contemporary"].map((e) => <option key={e}>{e}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="input-label">Medium</label>
                                            <input className="input-field" placeholder="e.g. Oil on Canvas" value={form.medium} onChange={update("medium")} />
                                        </div>
                                        <div className="form-group">
                                            <label className="input-label">Dimensions</label>
                                            <input className="input-field" placeholder="e.g. 80 × 60 cm" value={form.dimensions} onChange={update("dimensions")} />
                                        </div>
                                        <div className="form-group">
                                            <label className="input-label">Origin</label>
                                            <input className="input-field" placeholder="City, Country" value={form.origin} onChange={update("origin")} />
                                        </div>
                                        <div className="form-group">
                                            <label className="input-label">Tags (comma-separated)</label>
                                            <input className="input-field" placeholder="Abstract, Gold, Nature" value={form.tags} onChange={update("tags")} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Description</label>
                                        <textarea className="input-field" rows={4} placeholder="Describe your artwork…" value={form.description} onChange={update("description")} style={{ resize: "vertical" }} />
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Cultural Significance</label>
                                        <textarea className="input-field" rows={3} placeholder="Cultural or historical context…" value={form.culturalSignificance} onChange={update("culturalSignificance")} style={{ resize: "vertical" }} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="btn btn-primary">
                                            {saved ? <><Check size={16} /> Saved!</> : <>{editId ? "Update Artwork" : "Upload Artwork"}</>}
                                        </button>
                                        <button type="button" className="btn btn-ghost" onClick={() => { setForm(INITIAL_FORM); setEditId(null); clearImage(); setActive("artworks"); }}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {active === "sales" && (
                        <div>
                            <div className="dashboard-header"><h2 className="font-display">Sales Overview</h2></div>
                            <div className="glass-card" style={{ padding: "2rem", overflowX: "auto" }}>
                                {artworks.filter((a) => a.sold).length === 0 ? (
                                    <p className="text-muted">No sales yet. Keep showcasing your art!</p>
                                ) : (
                                    <table className="data-table">
                                        <thead><tr><th>Artwork</th><th>Price</th><th>Year</th><th>Status</th></tr></thead>
                                        <tbody>
                                            {artworks.filter((a) => a.sold).map((a) => (
                                                <tr key={a.id}>
                                                    <td>{a.title}</td>

                                                    <td>{a.year}</td>
                                                    <td><span className="badge badge-green">Sold</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <div className="overlay" onClick={() => setDeleteConfirm(null)}>
                        <motion.div className="modal glass-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                            <h3 className="font-display mb-2">Delete Artwork?</h3>
                            <p className="text-sm mb-3">This action cannot be undone.</p>
                            <div className="flex gap-2">
                                <button className="btn btn-danger flex-1" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                                <button className="btn btn-ghost flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Toast Popup (via Portal → renders on body, escapes grid stacking context) ── */}
            {ReactDOM.createPortal(
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            key="toast"
                            initial={{ opacity: 0, y: -30, scale: 0.92 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.92 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            style={{
                                position: "fixed",
                                top: "24px",
                                right: "28px",
                                zIndex: 9999,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                background: "linear-gradient(135deg, #101820 0%, #0d1f2d 100%)",
                                border: "1.5px solid var(--gold)",
                                borderRadius: "14px",
                                padding: "1rem 1.4rem",
                                minWidth: "300px",
                                boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(45,141,175,0.2)",
                                color: "#fff",
                                overflow: "hidden",
                            }}
                        >
                            {/* Icon circle */}
                            <div style={{
                                width: 42, height: 42, borderRadius: "50%",
                                background: "rgba(45,141,175,0.18)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "1.4rem", flexShrink: 0,
                                border: "1px solid rgba(45,141,175,0.3)"
                            }}>
                                🎉
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.2rem", color: "var(--gold-light)" }}>
                                    Success!
                                </p>
                                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>
                                    {toast.msg}
                                </p>
                            </div>
                            <button
                                onClick={() => setToast(null)}
                                style={{
                                    background: "none", border: "none", cursor: "pointer",
                                    color: "var(--text-muted)", padding: "2px", display: "flex",
                                    alignItems: "center", transition: "color 0.2s", flexShrink: 0
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                            >
                                <X size={16} />
                            </button>
                            {/* Shrinking gold progress bar */}
                            <motion.div
                                initial={{ scaleX: 1 }}
                                animate={{ scaleX: 0 }}
                                transition={{ duration: 3, ease: "linear" }}
                                style={{
                                    position: "absolute",
                                    bottom: 0, left: 0,
                                    height: "3px",
                                    width: "100%",
                                    background: "var(--gold)",
                                    transformOrigin: "left",
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default ArtistDashboard;
