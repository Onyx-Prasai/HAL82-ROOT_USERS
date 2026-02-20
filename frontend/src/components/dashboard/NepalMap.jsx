import React from 'react';
import { motion } from 'framer-motion';

const NepalMap = ({ hotspots = [] }) => {
    // Simplified SVG paths for the 7 provinces of Nepal (Proportional approximations)
    const provinces = [
        { id: 1, name: "Koshi", path: "M 320 180 L 380 160 L 400 220 L 350 250 Z", color: "#10B981" },
        { id: 2, name: "Madhesh", path: "M 280 230 L 350 250 L 340 280 L 270 260 Z", color: "#34D399" },
        { id: 3, name: "Bagmati", path: "M 240 160 L 320 180 L 280 230 L 220 210 Z", color: "#059669" },
        { id: 4, name: "Gandaki", path: "M 160 140 L 240 160 L 220 210 L 140 190 Z", color: "#10B981" },
        { id: 5, name: "Lumbini", path: "M 100 190 L 160 140 L 140 190 L 80 240 L 120 260 Z", color: "#34D399" },
        { id: 6, name: "Karnali", path: "M 60 100 L 160 140 L 100 190 L 40 150 Z", color: "#059669" },
        { id: 7, name: "Sudurpashchim", path: "M 10 120 L 60 100 L 40 150 L 20 160 Z", color: "#10B981" },
    ];

    return (
        <div className="relative w-full h-[400px] bg-surface-card rounded-3xl p-8 flex items-center justify-center overflow-hidden border border-surface-border shadow-sm transition-colors">
            <div className="absolute top-6 left-8">
                <h3 className="text-xl font-bold text-surface-text">Ecosystem Activity</h3>
                <p className="text-sm text-surface-text-muted">Regional hotspots in Nepal</p>
            </div>

            <svg viewBox="0 0 450 300" className="w-full h-full max-w-lg drop-shadow-2xl">
                {Array.isArray(hotspots) && provinces.map((p) => {
                    const stats = hotspots.find(h => h.province === p.id);
                    const opacity = stats ? Math.min(0.2 + (stats.activity / 50), 1) : 0.2;

                    return (
                        <motion.path
                            key={p.id}
                            d={p.path}
                            fill={p.color}
                            initial={{ opacity: 0 }}
                            animate={{ opacity }}
                            whileHover={{ scale: 1.05, filter: 'brightness(1.1)', opacity: 1, zIndex: 10 }}
                            className="cursor-pointer transition-all"
                        >
                            <title>{p.name}: {stats?.activity || 0} active nodes</title>
                        </motion.path>
                    );
                })}
            </svg>

            <div className="absolute bottom-6 right-8 flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-sangam-emerald"></div>
                    <span className="text-xs text-surface-text-muted">High Activity</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-sangam-emerald/20"></div>
                    <span className="text-xs text-surface-text-muted">Low Activity</span>
                </div>
            </div>
        </div>
    );
};

export default NepalMap;
