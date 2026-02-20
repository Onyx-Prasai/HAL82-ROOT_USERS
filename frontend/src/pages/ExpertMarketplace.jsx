import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Calendar, Filter, Search } from 'lucide-react';
import api from '../services/api';

const ExpertMarketplace = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const response = await api.get('/core/experts/');
                setExperts(response.data);
            } catch (err) {
                console.error('Error fetching experts:', err);
                setError('Failed to load expert profiles.');
            } finally {
                setLoading(false);
            }
        };
        fetchExperts();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface-base transition-colors duration-300">
            <div className="w-12 h-12 border-4 border-sangam-emerald border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-surface-text-muted font-medium tracking-widest">CONNECTING TO THE GUILD...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-surface-base p-8 transition-colors duration-300">
            <div className="bg-surface-card p-8 rounded-3xl border border-surface-border text-center max-w-sm">
                <p className="text-surface-text-muted mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="text-sangam-emerald font-bold">Retry</button>
            </div>
        </div>
    );

    const filteredExperts = experts.filter(e =>
        e.specialization.toLowerCase().includes(search.toLowerCase()) ||
        e.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-surface-base p-8 transition-colors duration-300">
            <header className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-4xl font-bold text-surface-text mb-2">Expert Marketplace [THEME-TEST]</h1>
                    <p className="text-lg text-surface-text-muted">Connect with vetted CAs, Lawyers, and Designers.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by skill..."
                            className="pl-10 pr-4 py-3 bg-surface-card border border-surface-border rounded-xl focus:ring-2 focus:ring-sangam-emerald outline-none w-64 shadow-sm text-surface-text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-surface-card border border-surface-border rounded-xl hover:bg-surface-base shadow-sm text-surface-text"><Filter size={20} /></button>
                </div>
            </header>

            <div className="max-w-6xl mx-auto space-y-6">
                {filteredExperts.map((e) => (
                    <motion.div
                        key={e.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="surface-card rounded-3xl p-6 hover:shadow-md flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-surface-base rounded-2xl flex items-center justify-center text-surface-text relative">
                                <span className="text-xl font-bold">{e.username.charAt(0)}</span>
                                {e.is_vetted && (
                                    <div className="absolute -top-2 -right-2 bg-sangam-emerald text-white p-1 rounded-full border-2 border-surface-card">
                                        <ShieldCheck size={12} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="text-lg font-bold text-surface-text">{e.username}</h3>
                                    <div className="flex items-center text-amber-500 text-sm">
                                        <Star fill="currentColor" size={14} />
                                        <span className="ml-1 font-bold">{e.rating}</span>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-sangam-emerald uppercase tracking-widest">{e.specialization}</p>
                                <p className="text-xs text-surface-text-muted mt-2 max-w-md line-clamp-1">{e.bio}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-8">
                            <div className="text-right">
                                <p className="text-xs text-surface-text-muted font-bold uppercase">Rate</p>
                                <p className="text-xl font-bold text-surface-text">${e.hourly_rate}<span className="text-xs text-surface-text-muted">/hr</span></p>
                            </div>
                            <button className="bg-sangam-emerald text-white px-8 py-3 rounded-xl font-bold hover:bg-sangam-emerald-dark transition-colors flex items-center space-x-2 shadow-lg shadow-sangam-emerald/20">
                                <Calendar size={18} />
                                <span>Book Session</span>
                            </button>
                        </div>
                    </motion.div>
                ))}

                {filteredExperts.length === 0 && (
                    <div className="py-20 text-center">
                        <h3 className="text-xl font-bold text-surface-text-muted">No experts found</h3>
                        <p className="text-surface-text-muted">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpertMarketplace;
