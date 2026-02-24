import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, Grid3X3, LayoutList } from "lucide-react";
import ArtworkCard from "../components/ArtworkCard";
import { ARTWORKS, CATEGORIES, ERAS } from "../data/mockData";

const Gallery = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [era, setEra] = useState("All");

    const [sortBy, setSortBy] = useState("featured");
    const [layout, setLayout] = useState("grid");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const filtered = useMemo(() => {
        return ARTWORKS.filter((a) => {
            const matchesSearch =
                a.title.toLowerCase().includes(search.toLowerCase()) ||
                a.artist.toLowerCase().includes(search.toLowerCase()) ||
                a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
            const matchesCategory = category === "All" || a.category === category;
            const matchesEra = era === "All" || a.era === era;
            return matchesSearch && matchesCategory && matchesEra;
        }).sort((a, b) => {
            if (sortBy === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
            if (sortBy === "rating") return b.rating - a.rating;
            if (sortBy === "newest") return b.year - a.year;
            return 0;
        });
    }, [search, category, era, sortBy]);

    const clearFilters = () => {
        setSearch("");
        setCategory("All");
        setEra("All");
        setSortBy("featured");
    };

    const hasFilters = search || category !== "All" || era !== "All";

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
                {/* Page Header */}
                <motion.div
                    className="text-center mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="section-eyebrow">Browse & Discover</p>
                    <h1 className="section-title italic">The Gallery</h1>
                    <div className="gold-divider" />
                </motion.div>

                {/* Search & Controls Bar */}
                <motion.div
                    className="gallery-controls"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {/* Search */}
                    <div className="search-wrapper">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search artworks, artists, tags…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field search-input"
                        />
                        {search && (
                            <button className="search-clear" onClick={() => setSearch("")}>
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Right Controls */}
                    <div className="gallery-control-right">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input-field sort-select"
                        >
                            <option value="featured">Featured</option>
                            <option value="newest">Newest</option>
                            <option value="rating">Top Rated</option>
                        </select>

                        <button
                            className={`btn btn-ghost btn-icon ${filtersOpen ? "active-filter" : ""}`}
                            onClick={() => setFiltersOpen(!filtersOpen)}
                            title="Filters"
                        >
                            <SlidersHorizontal size={18} />
                        </button>

                        <div className="layout-toggle">
                            <button
                                className={`layout-btn ${layout === "grid" ? "active" : ""}`}
                                onClick={() => setLayout("grid")}
                            >
                                <Grid3X3 size={16} />
                            </button>
                            <button
                                className={`layout-btn ${layout === "list" ? "active" : ""}`}
                                onClick={() => setLayout("list")}
                            >
                                <LayoutList size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Filter Panel */}
                {filtersOpen && (
                    <motion.div
                        className="filter-panel glass-card"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="filter-grid">
                            {/* Category */}
                            <div>
                                <label className="input-label">Category</label>
                                <div className="filter-chips">
                                    {CATEGORIES.map((c) => (
                                        <button
                                            key={c}
                                            className={`filter-chip ${category === c ? "active" : ""}`}
                                            onClick={() => setCategory(c)}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Era */}
                            <div>
                                <label className="input-label">Era</label>
                                <div className="filter-chips">
                                    {ERAS.map((e) => (
                                        <button
                                            key={e}
                                            className={`filter-chip ${era === e ? "active" : ""}`}
                                            onClick={() => setEra(e)}
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {hasFilters && (
                            <button className="btn btn-ghost btn-sm mt-2" onClick={clearFilters}>
                                <X size={14} /> Clear All Filters
                            </button>
                        )}
                    </motion.div>
                )}

                {/* Results Count */}
                <div className="gallery-results-bar">
                    <p className="text-sm text-muted">
                        Showing <span className="text-gold">{filtered.length}</span> artwork{filtered.length !== 1 ? "s" : ""}
                        {hasFilters && " · Filters applied"}
                    </p>
                    {hasFilters && (
                        <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                            <X size={12} /> Reset
                        </button>
                    )}
                </div>

                {/* Artwork Grid */}
                {filtered.length === 0 ? (
                    <motion.div
                        className="empty-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="empty-icon">🖼️</div>
                        <h3>No artworks found</h3>
                        <p>Try adjusting your search or filters.</p>
                        <button className="btn btn-outline mt-2" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        className={layout === "grid" ? "gallery-grid" : "gallery-list"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {filtered.map((artwork, i) => (
                            <motion.div
                                key={artwork.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                            >
                                <ArtworkCard artwork={artwork} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
