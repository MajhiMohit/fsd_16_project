import { Link } from "react-router-dom";
import { Palette, Instagram, Twitter, Youtube, Mail, ArrowRight } from "lucide-react";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-brand">
                        <div className="navbar-logo" style={{ marginBottom: "1rem" }}>
                            <Palette size={22} strokeWidth={1.5} />
                            <span className="logo-text">Art<span className="italic">Gallery</span></span>
                        </div>
                        <p style={{ fontSize: "0.875rem", lineHeight: 1.8 }}>
                            A premium virtual gallery celebrating the world's finest artworks.
                            Curated for collectors, admirers, and artists alike.
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="social-icon"><Instagram size={18} /></a>
                            <a href="#" className="social-icon"><Twitter size={18} /></a>
                            <a href="#" className="social-icon"><Youtube size={18} /></a>
                            <a href="#" className="social-icon"><Mail size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="footer-heading">Explore</h4>
                        <ul className="footer-links">
                            {[
                                { label: "Gallery", to: "/gallery" },
                                { label: "Exhibitions", to: "/exhibitions" },
                                { label: "Virtual Tour", to: "/virtual-tour" },
                                { label: "Artists", to: "/gallery" },
                            ].map((l) => (
                                <li key={l.to}>
                                    <Link to={l.to} className="footer-link">
                                        <ArrowRight size={12} />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="footer-heading">Account</h4>
                        <ul className="footer-links">
                            {[
                                { label: "Sign In", to: "/login" },
                                { label: "Register", to: "/register" },
                                { label: "Wishlist", to: "/wishlist" },
                                { label: "Purchases", to: "/purchases" },
                            ].map((l) => (
                                <li key={l.to}>
                                    <Link to={l.to} className="footer-link">
                                        <ArrowRight size={12} />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="footer-heading">Newsletter</h4>
                        <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>
                            Stay updated on new collections and exclusive exhibitions.
                        </p>
                        <div className="newsletter-form">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="input-field newsletter-input"
                            />
                            <button className="btn btn-primary btn-sm newsletter-btn">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <div className="gold-divider" style={{ marginBottom: "2rem" }} />
                    <div className="flex-between" style={{ flexWrap: "wrap", gap: "1rem" }}>
                        <p className="text-xs text-muted">
                            © {new Date().getFullYear()} ArtGallery. All rights reserved.
                        </p>
                        <div className="flex gap-2">
                            {["Privacy Policy", "Terms of Service", "Accessibility"].map((item) => (
                                <a key={item} href="#" className="text-xs text-muted footer-legal-link">
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
