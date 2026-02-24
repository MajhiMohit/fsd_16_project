import { createContext, useContext, useState, useEffect } from "react";
import { USERS } from "../data/mockData";

// ─────────────────────────────────────────────
// Auth Context
// ─────────────────────────────────────────────
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);
    const [purchases, setPurchases] = useState([]);

    // Persist session across page refreshes
    useEffect(() => {
        const storedUser = localStorage.getItem("gallery_user");
        const storedWishlist = localStorage.getItem("gallery_wishlist");
        const storedPurchases = localStorage.getItem("gallery_purchases");
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
        if (storedPurchases) setPurchases(JSON.parse(storedPurchases));
        setLoading(false);
    }, []);

    // Login — matches against mock USERS array
    const login = (email, password) => {
        const found = USERS.find(
            (u) => u.email === email && u.password === password
        );
        if (found) {
            setUser(found);
            localStorage.setItem("gallery_user", JSON.stringify(found));
            return { success: true, role: found.role };
        }
        return { success: false, message: "Invalid email or password." };
    };

    // Logout — clear state and storage
    const logout = () => {
        setUser(null);
        localStorage.removeItem("gallery_user");
    };

    // Wishlist helpers
    const toggleWishlist = (artworkId) => {
        setWishlist((prev) => {
            const updated = prev.includes(artworkId)
                ? prev.filter((id) => id !== artworkId)
                : [...prev, artworkId];
            localStorage.setItem("gallery_wishlist", JSON.stringify(updated));
            return updated;
        });
    };

    const isWishlisted = (artworkId) => wishlist.includes(artworkId);

    // Purchase helpers
    const addPurchase = (artwork) => {
        setPurchases((prev) => {
            const updated = [...prev, { ...artwork, purchasedAt: new Date().toISOString() }];
            localStorage.setItem("gallery_purchases", JSON.stringify(updated));
            return updated;
        });
    };

    // Role helpers
    const isAdmin = user?.role === "admin";
    const isArtist = user?.role === "artist";
    const isCurator = user?.role === "curator";
    const isVisitor = user?.role === "visitor";
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                wishlist,
                toggleWishlist,
                isWishlisted,
                purchases,
                addPurchase,
                isAdmin,
                isArtist,
                isCurator,
                isVisitor,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for convenient usage
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

export default AuthContext;
