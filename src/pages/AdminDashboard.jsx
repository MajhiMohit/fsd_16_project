import { useState } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard, Users, Image, Settings, BarChart3,
    TrendingUp, Eye, ShoppingBag, AlertCircle, CheckCircle2, FileText, Shield
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ARTWORKS, USERS, EXHIBITIONS } from "../data/mockData";

const SIDEBAR_ITEMS = [
    { key: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { key: "users", label: "User Roles", icon: <Shield size={18} /> },
    { key: "artworks", label: "Platform Content", icon: <FileText size={18} /> },
    { key: "exhibitions", label: "Exhibitions", icon: <BarChart3 size={18} /> },
    { key: "settings", label: "Gallery Settings", icon: <Settings size={18} /> },
];

const STATS = [
    { label: "Total Artworks", value: ARTWORKS.length, icon: <Image size={22} />, color: "var(--gold)" },
    { label: "Registered Users", value: USERS.length, icon: <Users size={22} />, color: "var(--accent-teal)" },
    { label: "Active Exhibitions", value: EXHIBITIONS.length, icon: <BarChart3 size={22} />, color: "var(--accent-purple)" },
    { label: "Total Sales", value: ARTWORKS.filter((a) => a.sold).length, icon: <ShoppingBag size={22} />, color: "var(--accent-red)" },
];

const AdminDashboard = () => {
    const { user } = useAuth();
    const [active, setActive] = useState("overview");
    const [roleMap, setRoleMap] = useState(
        Object.fromEntries(USERS.map((u) => [u.id, u.role]))
    );
    const [toast, setToast] = useState(null);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2800);
    };

    const handleRoleChange = (userId, newRole) => {
        setRoleMap((prev) => ({ ...prev, [userId]: newRole }));
    };

    const saveRoles = () => {
        showToast("User roles updated successfully! ✅");
    };
    return (
        <div className="page-wrapper dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-user">

                    <div>
                        <p className="sidebar-user-name">{user.name}</p>
                        <span className="badge badge-red">Admin</span>
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
                    {active === "overview" && (
                        <div>
                            <div className="dashboard-header">
                                <div>
                                    <h2 className="font-display">Admin Dashboard</h2>
                                    <p className="text-muted text-sm">Platform overview & management</p>
                                </div>
                            </div>

                            {/* Stat Cards */}
                            <div className="grid-4 mb-4">
                                {STATS.map((s, i) => (
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

                            {/* Charts mockup */}
                            <div className="grid-2 mb-4">
                                <div className="glass-card" style={{ padding: "1.5rem" }}>
                                    <h3 className="font-display mb-3">Monthly Views</h3>
                                    <div className="mock-chart">
                                        {[40, 60, 45, 80, 70, 95, 65, 85, 90, 75, 88, 100].map((h, i) => (
                                            <div key={i} className="chart-bar" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                    <div className="chart-labels">
                                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                                            <span key={m} className="text-xs text-muted">{m}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass-card" style={{ padding: "1.5rem" }}>
                                    <h3 className="font-display mb-3">Recent Activity</h3>
                                    <div className="activity-list">
                                        {[
                                            { text: "New artwork uploaded by Sofia Reyes", time: "2h ago", type: "success" },
                                            { text: "User Nina Patel registered", time: "5h ago", type: "info" },
                                            { text: "Exhibition 'Echoes' updated", time: "1d ago", type: "warning" },
                                            { text: "Artwork 'The Oracle' purchased", time: "1d ago", type: "success" },
                                            { text: "New review posted by James Curator", time: "2d ago", type: "info" },
                                        ].map((a, i) => (
                                            <div key={i} className="activity-item">
                                                <span style={{ color: a.type === "success" ? "var(--accent-teal)" : a.type === "warning" ? "var(--gold)" : "var(--accent-purple)" }}>
                                                    {a.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                                </span>
                                                <div>
                                                    <p className="text-sm">{a.text}</p>
                                                    <p className="text-xs text-muted">{a.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {active === "users" && (
                        <div>
                            <div className="dashboard-header">
                                <div>
                                    <h2 className="font-display">User Role Management</h2>
                                    <p className="text-muted text-sm">Assign and modify user roles across the platform</p>
                                </div>
                                <button className="btn btn-primary btn-sm" onClick={saveRoles}>
                                    <CheckCircle2 size={15} /> Save Changes
                                </button>
                            </div>
                            <div className="glass-card" style={{ overflow: "auto" }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Current Role</th>
                                            <th>Change Role</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {USERS.map((u) => (
                                            <tr key={u.id}>
                                                <td>
                                                    <div className="flex gap-1" style={{ alignItems: "center" }}>
                                                        <img src={u.avatar} alt={u.name} className="table-avatar" style={{ borderRadius: "50%" }} />
                                                        <span>{u.name}</span>
                                                    </div>
                                                </td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span className={`badge badge-${roleMap[u.id] === "admin" ? "red" : roleMap[u.id] === "artist" ? "purple" : roleMap[u.id] === "curator" ? "green" : "gold"}`}>
                                                        {roleMap[u.id]}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        className="input-field"
                                                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", width: "auto" }}
                                                        value={roleMap[u.id]}
                                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                    >
                                                        {["admin", "artist", "curator", "visitor"].map((r) => (
                                                            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td><span className="badge badge-green">Active</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {active === "artworks" && (
                        <div>
                            <div className="dashboard-header">
                                <div>
                                    <h2 className="font-display">Manage Platform Content</h2>
                                    <p className="text-muted text-sm">Review, approve, and moderate all artwork listings</p>
                                </div>
                            </div>
                            <div className="glass-card" style={{ overflow: "auto" }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Artwork</th>
                                            <th>Artist</th>
                                            <th>Category</th>

                                            <th>Status</th>
                                            <th>Views</th>
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

                                                <td>
                                                    <span className={`badge ${a.sold ? "badge-red" : "badge-green"}`}>
                                                        {a.sold ? "Sold" : "Available"}
                                                    </span>
                                                </td>
                                                <td className="text-muted">{a.views.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {active === "exhibitions" && (
                        <div>
                            <div className="dashboard-header">
                                <h2 className="font-display">Exhibitions</h2>
                            </div>
                            <div className="grid-3">
                                {EXHIBITIONS.map((ex) => (
                                    <div key={ex.id} className="glass-card" style={{ padding: "1.5rem" }}>
                                        <img src={ex.coverImage} alt={ex.title} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }} />
                                        <span className="badge badge-gold mb-2">{ex.theme}</span>
                                        <h4 className="font-display mt-1">{ex.title}</h4>
                                        <p className="text-xs text-muted mt-1">{ex.artworkIds.length} artworks · by {ex.curator}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {active === "settings" && (
                        <div>
                            <div className="dashboard-header">
                                <div>
                                    <h2 className="font-display">Gallery Settings</h2>
                                    <p className="text-muted text-sm">Configure platform-wide gallery settings</p>
                                </div>
                            </div>
                            <div className="glass-card" style={{ padding: "2rem", maxWidth: 600 }}>
                                <div className="form-group">
                                    <label className="input-label">Gallery Name</label>
                                    <input className="input-field" defaultValue="ArtGallery" />
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Contact Email</label>
                                    <input className="input-field" defaultValue="info@artgallery.com" />
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Max Artworks Per Artist</label>
                                    <input className="input-field" type="number" defaultValue="50" />
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Allow Public Visitor Registration</label>
                                    <select className="input-field">
                                        <option value="yes">Yes — open to everyone</option>
                                        <option value="invite">Invite only</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Featured Artworks Limit</label>
                                    <input className="input-field" type="number" defaultValue="8" />
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => showToast("Gallery settings saved! ✅")}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>

            {/* Toast notification */}
            {toast && (
                <div style={{
                    position: "fixed", top: 24, right: 28, zIndex: 9999,
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    background: "linear-gradient(135deg, #101820 0%, #0d1f2d 100%)",
                    border: "1.5px solid var(--gold)",
                    borderRadius: "14px",
                    padding: "1rem 1.4rem",
                    minWidth: "300px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
                    color: "#fff",
                    animation: "fadeInDown 0.3s ease",
                }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: "50%",
                        background: "rgba(45,141,175,0.18)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.2rem", flexShrink: 0,
                    }}>✅</div>
                    <div>
                        <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--gold-light)", marginBottom: "0.1rem" }}>Success!</p>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>{toast}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
