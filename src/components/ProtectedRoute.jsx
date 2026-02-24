import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — wraps routes that require authentication and/or specific roles.
 * @param {string[]} roles - Array of allowed roles. Empty means any authenticated user.
 * @param {string} redirectTo - Where to send unauthenticated users.
 */
const ProtectedRoute = ({ children, roles = [], redirectTo = "/login" }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: "100vh" }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    if (roles.length > 0 && !roles.includes(user?.role)) {
        // Authenticated but wrong role — redirect to their appropriate dashboard
        const dashboardMap = {
            admin: "/admin",
            artist: "/artist",
            curator: "/curator",
            visitor: "/gallery",
        };
        return <Navigate to={dashboardMap[user?.role] || "/"} replace />;
    }

    return children;
};

export default ProtectedRoute;
