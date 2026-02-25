import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Palette, Mail, Lock, ArrowRight, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
    { role: "Admin", email: "mohit@gmail.com", password: "gallery@123", color: "badge-red" },
    { role: "Artist", email: "artist@gallery.com", password: "artist123", color: "badge-purple" },
    { role: "Curator", email: "curator@gallery.com", password: "curator123", color: "badge-green" },
    { role: "Visitor", email: "visitor@gallery.com", password: "visitor123", color: "badge-gold" },
];

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const ROLE_MAP = {
        admin: "/admin",
        artist: "/artist",
        curator: "/curator",
        visitor: "/visitor",
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600)); // simulate latency
        const result = login(email, password);
        setLoading(false);
        if (result.success) {
            navigate(ROLE_MAP[result.role] || "/");
        } else {
            setError(result.message);
        }
    };

    const fillDemo = (account) => {
        setEmail(account.email);
        setPassword(account.password);
        setError("");
    };

    return (
        <div className="auth-page page-wrapper">
            {/* Background Art */}
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
                    {/* Header */}
                    <div className="auth-header">
                        <Link to="/" className="navbar-logo" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
                            <Palette size={22} strokeWidth={1.5} />
                            <span className="logo-text">Art<span className="italic">Gallery</span></span>
                        </Link>
                        <h2 className="auth-title">Welcome Back</h2>
                        <p className="auth-subtitle">Sign in to your account to continue</p>
                    </div>

                    {/* Demo Role Pills */}
                    <div className="demo-accounts">
                        <p className="text-xs text-muted mb-2" style={{ textAlign: "center" }}>Quick Login (Demo)</p>
                        <div className="demo-pills">
                            {DEMO_ACCOUNTS.map((acc) => (
                                <button
                                    key={acc.role}
                                    className={`badge ${acc.color}`}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => fillDemo(acc)}
                                >
                                    {acc.role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="alert alert-error">{error}</div>}

                        <div className="form-group">
                            <label className="input-label">Email Address</label>
                            <div className="input-icon-wrapper">
                                <Mail size={16} className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field input-with-icon"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="input-label">Password</label>
                            <div className="input-icon-wrapper">
                                <Lock size={16} className="input-icon" />
                                <input
                                    type={showPw ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field input-with-icon input-with-toggle"
                                    required
                                />
                                <button
                                    type="button"
                                    className="input-toggle"
                                    onClick={() => setShowPw(!showPw)}
                                >
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                            ) : (
                                <>Sign In <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-gold">
                            Create one free
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
