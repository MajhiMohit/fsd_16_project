import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Palette, Menu, X, Sun, Moon, User, Heart, LogOut,
    LayoutDashboard, ChevronDown, ShoppingBag
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ROLE_DASHBOARD = {
    admin: "/admin",
    artist: "/artist",
    curator: "/curator",
    visitor: "/gallery",
};

const Navbar = ({ theme, toggleTheme }) => {
    const { user, logout, isAuthenticated, wishlist } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate("/");
    };

    const navLinks = [
        { label: "Home", to: "/" },
        { label: "Gallery", to: "/gallery" },
        { label: "Exhibitions", to: "/exhibitions" },
        { label: "Virtual Tour", to: "/virtual-tour" },
    ];

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className={`navbar ${scrolled ? "scrolled" : ""}`}
        >
            <div className="container flex-between" style={{ height: "var(--navbar-height)" }}>
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <Palette size={22} strokeWidth={1.5} />
                    <span className="logo-text">Art<span className="italic">Gallery</span></span>
                </Link>

                {/* Desktop Nav Links */}
                <ul className="nav-links">
                    {navLinks.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Right Controls */}
                <div className="nav-actions">
                    {/* Theme Toggle */}
                    <button className="btn btn-icon btn-ghost" onClick={toggleTheme} title="Toggle theme">
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {isAuthenticated ? (
                        <>
                            {/* Wishlist */}
                            <Link to="/wishlist" className="btn btn-icon btn-ghost" style={{ position: "relative" }}>
                                <Heart size={18} />
                                {wishlist.length > 0 && (
                                    <span className="wishlist-badge">{wishlist.length}</span>
                                )}
                            </Link>

                            {/* User Dropdown */}
                            <div className="user-dropdown" onMouseLeave={() => setDropdownOpen(false)}>
                                <button
                                    className="user-trigger"
                                    onMouseEnter={() => setDropdownOpen(true)}
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <div className="user-avatar-placeholder"><User size={18} /></div>
                                    <span className="user-name hide-mobile">{user.name.split(" ")[0]}</span>
                                    <ChevronDown size={14} />
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                            transition={{ duration: 0.2 }}
                                            className="dropdown-menu"
                                        >
                                            <div className="dropdown-header">
                                                <p className="dropdown-name">{user.name}</p>
                                                <p className="dropdown-role badge badge-gold">{user.role}</p>
                                            </div>
                                            <div className="dropdown-divider" />
                                            <Link
                                                to={ROLE_DASHBOARD[user.role]}
                                                className="dropdown-item"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <LayoutDashboard size={16} />
                                                Dashboard
                                            </Link>
                                            {user.role === "visitor" && (
                                                <Link to="/purchases" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                                    <ShoppingBag size={16} />
                                                    My Purchases
                                                </Link>
                                            )}
                                            <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                                <User size={16} />
                                                Profile
                                            </Link>
                                            <div className="dropdown-divider" />
                                            <button className="dropdown-item danger" onClick={handleLogout}>
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-1">
                            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Join</Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button className="btn btn-icon btn-ghost mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mobile-menu"
                    >
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        {!isAuthenticated && (
                            <div className="flex gap-2 mt-2">
                                <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMobileOpen(false)} style={{ flex: 1, justifyContent: "center" }}>Sign In</Link>
                                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)} style={{ flex: 1, justifyContent: "center" }}>Join</Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
