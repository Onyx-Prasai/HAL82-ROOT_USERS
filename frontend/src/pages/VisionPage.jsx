import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Layers, Globe, Zap, CheckCircle } from 'lucide-react';

const VisionPage = () => {
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);

    return (
        <div className="bg-surface-base text-surface-text transition-colors duration-300">
            {/* Step 1: The Problem (The "Island" effect) */}
            <section className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <motion.div style={{ y: y1 }} className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-sangam-emerald rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-sangam-emerald rounded-full blur-3xl"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center max-w-3xl"
                >
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-sangam-emerald mb-4">The Problem</h2>
                    <h3 className="text-5xl lg:text-7xl font-bold mb-8 tracking-tighter">The "Island" Effect</h3>
                    <p className="text-xl text-surface-text-muted leading-relaxed">
                        Brilliant minds in Nepal are working in isolation. Like scattered islands, our potential is vast but disconnected. No confluence, no synergy, no scale.
                    </p>
                </motion.div>
            </section>

            {/* Step 2: The Solution (The 3 Pillars) */}
            <section className="min-h-screen flex flex-col items-center justify-center bg-surface-base text-surface-text p-8">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <Pillar
                        icon={<Layers size={40} />}
                        title="Confluence"
                        desc="Merging founders, investors, and experts into a single, high-velocity stream."
                    />
                    <Pillar
                        icon={<Zap size={40} />}
                        title="Pulse"
                        desc="Transparent, data-driven growth tracking that builds radical trust."
                    />
                    <Pillar
                        icon={<Globe size={40} />}
                        title="Scale"
                        desc="Bridging local innovation with global capital and markets."
                    />
                </div>
            </section>

            {/* Step 3: The Impact */}
            <section className="min-h-screen flex flex-col items-center justify-center p-8 bg-surface-base text-surface-text">
                <h3 className="text-4xl font-bold mb-16">History of Growth</h3>
                <div className="max-w-4xl w-full relative">
                    <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-surface-border"></div>
                    <TimelineItem year="2024" event="SANGAM Alpha launched in Kathmandu." side="left" />
                    <TimelineItem year="2025" event="First $1M syndicate closed for Agri-Tech." side="right" />
                    <TimelineItem year="2026" event="500+ startups verified via Nagarik App." side="left" />
                    <TimelineItem year="Today" event="Scaling Nepal to the World." side="right" />
                </div>
            </section>

            <footer className="py-20 bg-surface-base text-center">
                <h2 className="text-3xl font-bold mb-8">Ready to join the confluence?</h2>
                <button className="bg-sangam-emerald text-white px-10 py-4 rounded-2xl font-bold text-xl hover:bg-sangam-emerald-dark transition-all">
                    Get Started
                </button>
            </footer>
        </div>
    );
};

const Pillar = ({ icon, title, desc }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="p-10 bg-surface-card rounded-3xl border border-surface-border hover:shadow-xl transition-all"
    >
        <div className="text-sangam-emerald mb-6">{icon}</div>
        <h4 className="text-2xl font-bold mb-4">{title}</h4>
        <p className="text-surface-text-muted leading-relaxed">{desc}</p>
    </motion.div>
);

const TimelineItem = ({ year, event, side }) => (
    <motion.div
        initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        className={`flex items-center mb-12 w-full ${side === 'left' ? 'flex-row-reverse' : ''}`}
    >
        <div className="w-1/2"></div>
        <div className="w-4 h-4 rounded-full bg-sangam-emerald shadow-lg shadow-sangam-emerald/20 relative z-10"></div>
        <div className={`w-1/2 p-6 ${side === 'left' ? 'text-right' : 'text-left'}`}>
            <span className="text-sangam-emerald font-black text-xl">{year}</span>
            <p className="text-lg font-bold text-surface-text mt-1">{event}</p>
        </div>
    </motion.div>
);

export default VisionPage;
