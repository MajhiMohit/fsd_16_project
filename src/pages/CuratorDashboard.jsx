import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, PlusCircle, Sparkles, Edit3, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ARTWORKS, EXHIBITIONS } from "../data/mockData";

const SIDEBAR_ITEMS = [
    { key: "overview", label: "Overview", icon: <BookOpen size={18} /> },
    { key: "exhibitions", label: "Exhibitions", icon: <Sparkles size={18} /> },
    { key: "create", label: "Create Exhibition", icon: <PlusCircle size={18} /> },
    { key: "annotations", label: "Annotations", icon: <Edit3 size={18} /> },
];

const INITIAL_FORM = { title: "", theme: "", description: "", artworkIds: [], startDate: "", endDate: "" };

const CuratorDashboard = () => {
    const { user } = useAuth();
    const [active, setActive] = useState("overview");
    const [exhibitions, setExhibitions] = useState(EXHIBITIONS);
    const [form, setForm] = useState(INITIAL_FORM);
    const [saved, setSaved] = useState(false);
    const [annotations, setAnnotations] = useState({});
    const [annotationText, setAnnotationText] = useState("");
    const [selectedArtwork, setSelectedArtwork] = useState(null);

    const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const toggleArtwork = (id) => {
        setForm((f) => ({
            ...f,
            artworkIds: f.artworkIds.includes(id)
                ? f.artworkIds.filter((a) => a !== id)
                : [...f.artworkIds, id],
        }));
    };

    const handleCreate = (e) => {
        e.preventDefault();
        const newEx = {
            id: Date.now(),
            ...form,
            curator: user.name,
            curatorId: user.id,
            coverImage: ARTWORKS.find((a) => form.artworkIds.includes(a.id))?.image ||
                "https://images.unsplash.com/photo-1578926288207-a90a5366a1e4?w=800&q=80",
            featured: false,
        };
        setExhibitions((prev) => [newEx, ...prev]);
        setForm(INITIAL_FORM);
        setSaved(true);
        setTimeout(() => { setSaved(false); setActive("exhibitions"); }, 1200);
    };

    const saveAnnotation = () => {
        if (!selectedArtwork || !annotationText.trim()) return;
        setAnnotations((prev) => ({
            ...prev,
            [selectedArtwork]: [...(prev[selectedArtwork] || []), { text: annotationText, date: new Date().toLocaleDateString() }],
        }));
        setAnnotationText("");
    };

    return (
        <div className="page-wrapper dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-user">

                    <div>
                        <p className="sidebar-user-name">{user.name}</p>
                        <span className="badge badge-green">Curator</span>
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

            <main className="dashboard-main">
                <motion.div key={active} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                    {active === "overview" && (
                        <div>
                            <div className="dashboard-header">
                                <div>
                                    <h2 className="font-display">Curator Dashboard</h2>
                                    <p className="text-muted text-sm">Manage exhibitions & insights</p>
                                </div>
                            </div>
                            <div className="grid-3 mb-4">
                                {[
                                    { label: "Exhibitions", value: exhibitions.length },
                                    { label: "Featured", value: exhibitions.filter((e) => e.featured).length },
                                    { label: "Artworks Curated", value: [...new Set(exhibitions.flatMap((e) => e.artworkIds))].length },
                                ].map((s, i) => (
                                    <motion.div key={s.label} className="stat-card-dashboard glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                        <div className="stat-dash-value">{s.value}</div>
                                        <div className="stat-dash-label">{s.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="glass-card" style={{ padding: "1.5rem" }}>
                                <h3 className="font-display mb-3">Your Exhibitions</h3>
                                {exhibitions.map((ex) => (
                                    <div key={ex.id} className="activity-item">
                                        <img src={ex.coverImage} alt={ex.title} style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)", objectFit: "cover" }} />
                                        <div style={{ flex: 1 }}>
                                            <p className="text-sm" style={{ fontWeight: 600 }}>{ex.title}</p>
                                            <p className="text-xs text-muted">{ex.theme} · {ex.artworkIds.length} artworks</p>
                                        </div>
                                        <span className="badge badge-gold">{ex.featured ? "Featured" : "Active"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {active === "exhibitions" && (
                        <div>
                            <div className="dashboard-header">
                                <h2 className="font-display">All Exhibitions</h2>
                                <button className="btn btn-primary btn-sm" onClick={() => setActive("create")}>
                                    <PlusCircle size={16} /> New Exhibition
                                </button>
                            </div>
                            <div className="grid-2">
                                {exhibitions.map((ex) => (
                                    <motion.div key={ex.id} className="exhibition-card card" whileHover={{ y: -4 }}>
                                        <div className="exhibition-image-wrapper" style={{ height: 160 }}>
                                            <img src={ex.coverImage} alt={ex.title} className="exhibition-image" />
                                        </div>
                                        <div className="exhibition-content">
                                            <span className="badge badge-gold mb-2">{ex.theme}</span>
                                            <h3 className="exhibition-title">{ex.title}</h3>
                                            <p className="text-xs text-muted mt-1">
                                                {ex.artworkIds.length} artworks · {ex.startDate} to {ex.endDate}
                                            </p>
                                            <p className="exhibition-desc mt-1">{ex.description.slice(0, 80)}…</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {active === "create" && (
                        <div>
                            <div className="dashboard-header">
                                <h2 className="font-display">Create Exhibition</h2>
                            </div>
                            <div className="glass-card" style={{ padding: "2rem", maxWidth: 700 }}>
                                {saved && <div className="alert alert-success mb-3">✅ Exhibition created!</div>}
                                <form onSubmit={handleCreate}>
                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="input-label">Title *</label>
                                            <input className="input-field" placeholder="Exhibition name" value={form.title} onChange={update("title")} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="input-label">Theme *</label>
                                            <input className="input-field" placeholder="e.g. Cultural Heritage" value={form.theme} onChange={update("theme")} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="input-label">Start Date</label>
                                            <input className="input-field" type="date" value={form.startDate} onChange={update("startDate")} />
                                        </div>
                                        <div className="form-group">
                                            <label className="input-label">End Date</label>
                                            <input className="input-field" type="date" value={form.endDate} onChange={update("endDate")} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Description</label>
                                        <textarea className="input-field" rows={3} placeholder="Exhibition description…" value={form.description} onChange={update("description")} style={{ resize: "vertical" }} />
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Select Artworks</label>
                                        <div className="artwork-selector">
                                            {ARTWORKS.map((a) => (
                                                <button
                                                    key={a.id}
                                                    type="button"
                                                    className={`artwork-select-item ${form.artworkIds.includes(a.id) ? "selected" : ""}`}
                                                    onClick={() => toggleArtwork(a.id)}
                                                >
                                                    <img src={a.image} alt={a.title} />
                                                    <span className="text-xs">{a.title}</span>
                                                    {form.artworkIds.includes(a.id) && <Check size={14} className="select-check" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="btn btn-primary">Create Exhibition</button>
                                        <button type="button" className="btn btn-ghost" onClick={() => { setForm(INITIAL_FORM); setActive("exhibitions"); }}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {active === "annotations" && (
                        <div>
                            <div className="dashboard-header">
                                <h2 className="font-display">Expert Annotations</h2>
                            </div>
                            <div className="glass-card" style={{ padding: "2rem", maxWidth: 700 }}>
                                <div className="form-group">
                                    <label className="input-label">Select Artwork</label>
                                    <select className="input-field" value={selectedArtwork || ""} onChange={(e) => setSelectedArtwork(Number(e.target.value))}>
                                        <option value="">— Choose artwork —</option>
                                        {ARTWORKS.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Annotation / Insight</label>
                                    <textarea
                                        className="input-field"
                                        rows={4}
                                        placeholder="Add your expert commentary or insight…"
                                        value={annotationText}
                                        onChange={(e) => setAnnotationText(e.target.value)}
                                        style={{ resize: "vertical" }}
                                    />
                                </div>
                                <button className="btn btn-primary" onClick={saveAnnotation}>
                                    Save Annotation
                                </button>

                                {/* Existing Annotations */}
                                {Object.entries(annotations).map(([artId, notes]) => {
                                    const art = ARTWORKS.find((a) => a.id === Number(artId));
                                    return (
                                        <div key={artId} className="mt-3">
                                            <p className="text-gold text-sm mb-1">{art?.title || "Unknown"}</p>
                                            {notes.map((n, i) => (
                                                <div key={i} className="review-card">
                                                    <p className="text-sm">{n.text}</p>
                                                    <p className="text-xs text-muted">{n.date}</p>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default CuratorDashboard;
