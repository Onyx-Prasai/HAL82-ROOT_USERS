import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Star, ArrowRight, MessageSquare, Briefcase, Search } from 'lucide-react';
import api from '../services/api';

const JodiMatcher = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await api.get('/users/discovery/');
                setMatches(response.data || []);
            } catch (err) {
                console.error('Error fetching discovery cards:', err);
                setError('Failed to find potential matches.');
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    const handleProposeTrial = async (userId) => {
        alert(`Proposal sent! A 2-week digital cooperation agreement has been triggered for user ID: ${userId}`);
        // In a real app, this would call an API to create a trial record
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400 font-medium">
            <div className="w-12 h-12 border-4 border-sangam-emerald border-t-transparent rounded-full animate-spin mb-4"></div>
            Scanning the Confluence...
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
            <div className="bg-white p-8 rounded-3xl border border-red-100 text-center max-w-sm">
                <p className="text-gray-500 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="text-sangam-emerald font-bold">Retry Connection</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <header className="max-w-6xl mx-auto mb-12">
                <h1 className="text-4xl font-bold text-sangam-slate mb-2">Jodi Matcher</h1>
                <p className="text-lg text-gray-500">AI-driven discovery for your perfect co-founder.</p>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {matches.map((match, index) => (
                        <motion.div
                            key={match.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                        >
                            <div className="h-3 bg-sangam-emerald w-full"></div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-sangam-slate">
                                        <User size={32} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] bg-emerald-50 text-sangam-emerald px-2 py-1 rounded-full font-bold uppercase tracking-wider mb-2">
                                            {match.persona}
                                        </span>
                                        {match.linkedin_profile && (
                                            <div className="flex items-center space-x-1 text-sangam-emerald">
                                                <ShieldCheck size={14} />
                                                <span className="text-[10px] font-bold">VERIFIED</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-sangam-slate mb-1">{match.username}</h3>
                                <p className="text-sm text-gray-400 mb-6 capitalize">{match.role.toLowerCase()} - Startup Stage: {match.startup_stage}</p>

                                <div className="space-y-4 mb-8">
                                    <p className="text-sm text-gray-600 line-clamp-2">"Visionary looking to bridge the gap between AI and agriculture in rural Nepal."</p>
                                    <div className="flex flex-wrap gap-2">
                                        <SkillBadge name="Strategic Sales" />
                                        <SkillBadge name="Fundraising" />
                                        <SkillBadge name="Operations" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="flex items-center justify-center space-x-2 py-3 rounded-xl border border-slate-100 text-sangam-slate font-bold hover:bg-slate-50 transition-colors">
                                        <MessageSquare size={18} />
                                        <span>Chat</span>
                                    </button>
                                    <button
                                        onClick={() => handleProposeTrial(match.id)}
                                        className="bg-sangam-slate text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                                    >
                                        Propose Trial
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {matches.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <Search size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-sangam-slate">No matches found yet</h3>
                        <p className="text-gray-500">Keep growing your profile, and we'll notify you when a perfect Jodi appears.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const SkillBadge = ({ name }) => (
    <span className="text-[10px] bg-slate-50 text-gray-500 px-2 py-1 rounded-lg font-medium border border-slate-100">
        {name}
    </span>
);

export default JodiMatcher;
