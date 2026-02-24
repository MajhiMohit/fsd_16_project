import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Info, X, ZoomIn } from "lucide-react";
import { ARTWORKS } from "../data/mockData";
import { Link } from "react-router-dom";

const GALLERY_ROOMS = [
    {
        id: 1,
        name: "The Grand Hall",
        description: "A majestic entrance hall featuring the gallery's most celebrated masterpieces.",
        bg: "linear-gradient(135deg, #091824 0%, #0f2d42 40%, #091824 100%)",
        artworkIds: [1, 4],
        ambiance: "#2d8daf",
    },
    {
        id: 2,
        name: "The Sculpture Garden",
        description: "An open garden space housing three-dimensional works in bronze, stone, and mixed media.",
        bg: "linear-gradient(135deg, #091a1f 0%, #0d2a30 40%, #091a1f 100%)",
        artworkIds: [7, 6],
        ambiance: "#2d9e8e",
    },
    {
        id: 3,
        name: "The Modern Wing",
        description: "A sleek, minimal space celebrating contemporary digital and mixed-media expression.",
        bg: "linear-gradient(135deg, #0d0f1f 0%, #141828 40%, #0d0f1f 100%)",
        artworkIds: [3, 5, 8],
        ambiance: "#5c7ea0",
    },
    {
        id: 4,
        name: "Nature & Landscape",
        description: "Immerse yourself in serene landscapes from Himalayan peaks to African deserts.",
        bg: "linear-gradient(135deg, #091520 0%, #0e2030 40%, #091520 100%)",
        artworkIds: [2, 6],
        ambiance: "#2d8daf",
    },
];

const VirtualTour = () => {
    const [currentRoom, setCurrentRoom] = useState(0);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [touring, setTouring] = useState(false);
    const [zoom, setZoom] = useState(false);

    const room = GALLERY_ROOMS[currentRoom];
    const roomArtworks = ARTWORKS.filter((a) => room.artworkIds.includes(a.id));

    const nextRoom = () => setCurrentRoom((i) => (i + 1) % GALLERY_ROOMS.length);
    const prevRoom = () => setCurrentRoom((i) => (i - 1 + GALLERY_ROOMS.length) % GALLERY_ROOMS.length);

    if (!touring) {
        return (
            <div className="page-wrapper">
                <section
                    className="tour-landing"
                    style={{ background: "var(--bg-secondary)" }}
                >
                    <div className="container text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <p className="section-eyebrow">Immersive Experience</p>
                            <h1 className="section-title italic" style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}>
                                Virtual Gallery Tour
                            </h1>
                            <div className="gold-divider" />
                            <p className="mt-3 mb-4" style={{ maxWidth: 600, margin: "1.5rem auto" }}>
                                Step inside ArtGallery from anywhere in the world. Navigate through our themed
                                rooms and discover each artwork up close.
                            </p>

                            <div className="tour-rooms-preview">
                                {GALLERY_ROOMS.map((r, i) => (
                                    <motion.div
                                        key={r.id}
                                        className="tour-room-card"
                                        style={{ background: r.bg, border: `1px solid ${r.ambiance}40` }}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1, duration: 0.5 }}
                                        whileHover={{ scale: 1.03, y: -4 }}
                                        onClick={() => { setCurrentRoom(i); setTouring(true); }}
                                    >
                                        <div className="tour-room-artworks">
                                            {ARTWORKS.filter((a) => r.artworkIds.includes(a.id)).slice(0, 2).map((a) => (
                                                <img key={a.id} src={a.image} alt={a.title} className="tour-room-thumb" />
                                            ))}
                                        </div>
                                        <div className="tour-room-info">
                                            <h3 style={{ color: r.ambiance }}>{r.name}</h3>
                                            <p className="text-xs text-muted">{r.artworkIds.length} artworks</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button
                                className="btn btn-primary btn-lg mt-4"
                                whileHover={{ scale: 1.05 }}
                                onClick={() => { setCurrentRoom(0); setTouring(true); }}
                            >
                                <Play size={20} /> Begin Tour
                            </motion.button>
                        </motion.div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div
            className="virtual-tour-room page-wrapper"
            style={{ minHeight: "100vh" }}>
            {/* Room Header */}
            <div className="container tour-room-header">
                <motion.div
                    key={currentRoom}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="section-eyebrow" style={{ color: room.ambiance }}>
                        Room {currentRoom + 1} of {GALLERY_ROOMS.length}
                    </p>
                    <h2 className="font-display" style={{ fontSize: "2rem" }}>{room.name}</h2>
                    <p className="text-sm text-muted" style={{ maxWidth: 500 }}>{room.description}</p>
                </motion.div>
                <button className="btn btn-ghost btn-sm" onClick={() => setTouring(false)}>
                    <X size={16} /> Exit Tour
                </button>
            </div>

            {/* Gallery Wall */}
            <div className="container tour-gallery-wall">
                {/* Wall Background */}
                <div className="gallery-wall" style={{ borderColor: `${room.ambiance}30` }}>
                    <div className="gallery-wall-top" style={{ background: `${room.ambiance}15` }} />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentRoom}
                            className="gallery-wall-artworks"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.6 }}
                        >
                            {roomArtworks.map((artwork, i) => (
                                <motion.div
                                    key={artwork.id}
                                    className="gallery-wall-item"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.15 }}
                                    onClick={() => setSelectedArtwork(artwork)}
                                    whileHover={{ scale: 1.03 }}
                                    style={{
                                        border: `3px solid ${room.ambiance}60`,
                                        boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px ${room.ambiance}20`,
                                    }}
                                >
                                    <img src={artwork.image} alt={artwork.title} className="gallery-wall-image" />
                                    <div className="gallery-wall-label">
                                        <p className="text-sm" style={{ fontFamily: "Cormorant Garamond, serif" }}>{artwork.title}</p>
                                        <p className="text-xs text-muted">{artwork.artist} · {artwork.year}</p>
                                    </div>
                                    <button className="gallery-info-btn" title="Info">
                                        <Info size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    <div className="gallery-wall-floor" style={{ background: `${room.ambiance}08` }} />
                </div>

                {/* Navigation */}
                <div className="tour-navigation">
                    <button className="tour-nav-btn" onClick={prevRoom}>
                        <ChevronLeft size={24} /> Previous Room
                    </button>

                    {/* Room Dots */}
                    <div className="hero-dots">
                        {GALLERY_ROOMS.map((_, i) => (
                            <button
                                key={i}
                                className={`hero-dot ${i === currentRoom ? "active" : ""}`}
                                onClick={() => setCurrentRoom(i)}
                                style={i === currentRoom ? { background: room.ambiance } : {}}
                            />
                        ))}
                    </div>

                    <button className="tour-nav-btn" onClick={nextRoom}>
                        Next Room <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Artwork Detail Panel */}
            <AnimatePresence>
                {selectedArtwork && (
                    <div className="overlay" onClick={() => setSelectedArtwork(null)}>
                        <motion.div
                            className="tour-artwork-panel glass-card"
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ duration: 0.4 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="modal-close" onClick={() => setSelectedArtwork(null)}>
                                <X size={18} />
                            </button>

                            <div className="tour-panel-grid">
                                <div style={{ position: "relative" }}>
                                    <img
                                        src={selectedArtwork.image}
                                        alt={selectedArtwork.title}
                                        className={`tour-panel-image ${zoom ? "zoomed" : ""}`}
                                        onClick={() => setZoom(!zoom)}
                                    />
                                    <button className="zoom-btn" onClick={() => setZoom(!zoom)}>
                                        <ZoomIn size={16} /> {zoom ? "Zoom Out" : "Zoom In"}
                                    </button>
                                </div>
                                <div className="tour-panel-info">
                                    <span className="badge badge-gold mb-2">{selectedArtwork.category}</span>
                                    <h2 className="font-display mb-1">{selectedArtwork.title}</h2>
                                    <p className="text-gold mb-2">by {selectedArtwork.artist}</p>
                                    <div className="gold-divider gold-divider-left mb-3" />
                                    <p className="text-sm mb-3">{selectedArtwork.description}</p>
                                    <div className="spec-row"><span className="spec-label">Era</span><span className="spec-value">{selectedArtwork.era}</span></div>
                                    <div className="spec-row"><span className="spec-label">Medium</span><span className="spec-value">{selectedArtwork.medium}</span></div>
                                    <div className="spec-row"><span className="spec-label">Origin</span><span className="spec-value">{selectedArtwork.origin}</span></div>

                                    <Link to={`/artwork/${selectedArtwork.id}`} className="btn btn-primary mt-3" onClick={() => setSelectedArtwork(null)}>
                                        View Full Details
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VirtualTour;
