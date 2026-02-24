import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Palette, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { USERS } from "../data/mockData";

const ROLES = ["visitor", "artist", "curator", "admin"];

const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "visitor" });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.name.trim()) return setError("Please enter your full name.");
        if (form.password.length < 6) return setError("Password must be at least 6 characters.");
        if (form.password !== form.confirm) return setError("Passwords do not match.");
        if (USERS.some((u) => u.email === form.email)) return setError("That email is already registered. Sign in instead.");

        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));

        // Register by adding to in-memory list and auto-login
        const newUser = {
            id: USERS.length + 1,
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
            avatar: `https://i.pravatar.cc/150?u=${form.email}`,
        };
        USERS.push(newUser);

        const result = login(form.email, form.password);
        setLoading(false);
        if (result.success) {
            const ROLE_MAP = { admin: "/admin", artist: "/artist", curator: "/curator", visitor: "/gallery" };
            navigate(ROLE_MAP[result.role] || "/");
        }
    };

    return (
        <div className="auth-page page-wrapper">
            <div className="auth-bg">
                <img
                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80"
                    alt=""
                    className="auth-bg-img"
                />
                <div className="auth-bg-overlay" />
            </div>

            <div className="container auth-container">
                <motion.div
                    className="auth-card glass-card"
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                    <div className="auth-header">
                        <Link to="/" className="navbar-logo" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
                            <Palette size={22} strokeWidth={1.5} />
                            <span className="logo-text">Art<span className="italic">Gallery</span></span>
                        </Link>
                        <h2 className="auth-title">Create Your Account</h2>
                        <p className="auth-subtitle">Join the world's finest virtual gallery</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="alert alert-error">{error}</div>}

                        {/* Full Name */}
                        <div className="form-group">
                            <label className="input-label">Full Name</label>
                            <div className="input-icon-wrapper">
                                <User size={16} className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    value={form.name}
                                    onChange={update("name")}
                                    className="input-field input-with-icon"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label className="input-label">Email Address</label>
                            <div className="input-icon-wrapper">
                                <Mail size={16} className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={update("email")}
                                    className="input-field input-with-icon"
                                    required
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div className="form-group">
                            <label className="input-label">I am a…</label>
                            <div className="role-picker">
                                {ROLES.map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        className={`role-pill ${form.role === r ? "active" : ""}`}
                                        onClick={() => setForm((f) => ({ ...f, role: r }))}
                                    >
                                        {r.charAt(0).toUpperCase() + r.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="input-label">Password</label>
                            <div className="input-icon-wrapper">
                                <Lock size={16} className="input-icon" />
                                <input
                                    type={showPw ? "text" : "password"}
                                    placeholder="Minimum 6 characters"
                                    value={form.password}
                                    onChange={update("password")}
                                    className="input-field input-with-icon input-with-toggle"
                                    required
                                />
                                <button type="button" className="input-toggle" onClick={() => setShowPw(!showPw)}>
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm */}
                        <div className="form-group">
                            <label className="input-label">Confirm Password</label>
                            <div className="input-icon-wrapper">
                                <Lock size={16} className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="Repeat your password"
                                    value={form.confirm}
                                    onChange={update("confirm")}
                                    className="input-field input-with-icon"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                            {loading ? (
                                <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                            ) : (
                                <>Create Account <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login" className="text-gold">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
