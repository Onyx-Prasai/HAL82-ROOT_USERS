import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShieldCheck, Calendar, Filter, Search, X } from 'lucide-react';
import api from '../services/api';
import TagSelector from '../components/common/TagSelector';

const ExpertMarketplace = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch experts with filtering
                let url = '/core/experts/';
                const params = new URLSearchParams();
                
                if (selectedTags.length > 0) {
                    params.append('tags', selectedTags.join(','));
                }
                if (search) {
                    params.append('search', search);
                }
                
                if (params.toString()) {
                    url += '?' + params.toString();
                }

                const response = await api.get(url);
                setExperts(response.data);
            } catch (err) {
                console.error('Error fetching experts:', err);
                setError('Failed to load expert profiles.');
            } finally {
                setLoading(false);
            }
        };

        const fetchTags = async () => {
            try {
                const response = await api.get('/users/interest-tags/');
                setAvailableTags(response.data.tags);
            } catch (error) {
                console.error('Error fetching tags:', error);
                setAvailableTags(['Agriculture', 'Tech', 'FinTech', 'Health', 'Education', 'Manufacturing', 'AI', 'Sustainability', 'General']);
            }
        };

        fetchData();
        if (availableTags.length === 0) {
            fetchTags();
        }
    }, [selectedTags, search]);

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

    return (
        <div className="min-h-screen bg-surface-base p-8 transition-colors duration-300">
            <header className="max-w-6xl mx-auto mb-12 flex flex-col space-y-6">
                <div>
                    <h1 className="text-4xl font-bold text-surface-text mb-2">Expert Marketplace</h1>
                    <p className="text-lg text-surface-text-muted">Connect with vetted experts based on your shared interests.</p>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, specialization, or bio..."
                            className="w-full pl-10 pr-4 py-3 bg-surface-card border border-surface-border rounded-xl focus:ring-2 focus:ring-sangam-emerald outline-none shadow-sm text-surface-text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`md:ml-4 p-3 rounded-xl font-bold flex items-center space-x-2 transition-all ${
                            showFilters || selectedTags.length > 0
                                ? 'bg-sangam-emerald text-white shadow-lg shadow-sangam-emerald/20'
                                : 'bg-surface-card border border-surface-border text-surface-text hover:bg-surface-base'
                        }`}
                    >
                        <Filter size={20} />
                        <span>Filters {selectedTags.length > 0 && `(${selectedTags.length})`}</span>
                    </button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-black text-surface-text">Filter by Interest Tags</h3>
                                    {selectedTags.length > 0 && (
                                        <button
                                            onClick={() => setSelectedTags([])}
                                            className="text-sm text-sangam-emerald font-bold hover:underline"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                                <TagSelector
                                    selectedTags={selectedTags}
                                    onTagsChange={setSelectedTags}
                                    tags={availableTags}
                                    required={false}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                            <motion.div
                                key={tag}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center space-x-2 bg-sangam-emerald/10 border border-sangam-emerald rounded-full px-4 py-2"
                            >
                                <span className="text-sm font-bold text-sangam-emerald">{tag}</span>
                                <button
                                    onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                                    className="text-sangam-emerald hover:text-sangam-emerald-dark"
                                >
                                    <X size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </header>

            <div className="max-w-6xl mx-auto space-y-6">
                {experts.map((e) => (
                    <motion.div
                        key={e.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="surface-card rounded-3xl p-6 hover:shadow-md flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
                    >
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-surface-base rounded-2xl flex items-center justify-center text-surface-text relative flex-shrink-0">
                                <span className="text-xl font-bold">{e.username.charAt(0)}</span>
                                {e.is_vetted && (
                                    <div className="absolute -top-2 -right-2 bg-sangam-emerald text-white p-1 rounded-full border-2 border-surface-card">
                                        <ShieldCheck size={12} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="text-lg font-bold text-surface-text">{e.username}</h3>
                                    <div className="flex items-center text-amber-500 text-sm">
                                        <Star fill="currentColor" size={14} />
                                        <span className="ml-1 font-bold">{e.rating}</span>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-sangam-emerald uppercase tracking-widest">{e.specialization}</p>
                                <p className="text-xs text-surface-text-muted mt-2 max-w-md line-clamp-2">{e.bio}</p>
                                {e.interest_tags && e.interest_tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {e.interest_tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                                    selectedTags.includes(tag)
                                                        ? 'bg-sangam-emerald text-white'
                                                        : 'bg-surface-base text-sangam-emerald border border-sangam-emerald/30'
                                                }`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 md:space-x-8">
                            <div className="text-right">
                                <p className="text-xs text-surface-text-muted font-bold uppercase">Rate</p>
                                <p className="text-xl font-bold text-surface-text">${e.hourly_rate}<span className="text-xs text-surface-text-muted">/hr</span></p>
                            </div>
                            <button className="bg-sangam-emerald text-white px-6 md:px-8 py-3 rounded-xl font-bold hover:bg-sangam-emerald-dark transition-colors flex items-center space-x-2 shadow-lg shadow-sangam-emerald/20 flex-shrink-0">
                                <Calendar size={18} />
                                <span className="hidden md:inline">Book Session</span>
                            </button>
                        </div>
                    </motion.div>
                ))}

                {experts.length === 0 && (
                    <div className="py-20 text-center">
                        <h3 className="text-xl font-bold text-surface-text-muted">No experts found</h3>
                        <p className="text-surface-text-muted">
                            {selectedTags.length > 0 || search 
                                ? 'Try adjusting your filters or search terms.'
                                : 'Start exploring experts by adding filters or searching.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpertMarketplace;
