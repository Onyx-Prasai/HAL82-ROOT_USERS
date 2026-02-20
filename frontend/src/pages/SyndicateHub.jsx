import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, DollarSign, Users, FileText, ExternalLink, Filter, Search, X } from 'lucide-react';
import api from '../services/api';
import TagSelector from '../components/common/TagSelector';

const SyndicateHub = () => {
    const [syndicates, setSyndicates] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [filtering, setFiltering] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await api.get('/users/interest-tags/');
                setAvailableTags(res.data.tags || []);
            } catch {
                setAvailableTags(['Agriculture', 'Tech', 'FinTech', 'Health', 'Education', 'Manufacturing', 'AI', 'Sustainability', 'General']);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const fetchSyndicates = async () => {
            if (!initialLoading) setFiltering(true);
            try {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (selectedTags.length) params.append('tags', selectedTags.join(','));
                const url = params.toString() ? `/core/syndicates/?${params}` : '/core/syndicates/';
                const response = await api.get(url);
                setSyndicates(response.data || []);
            } catch (err) {
                console.error('Error fetching syndicates:', err);
                setError('Failed to load investment syndicates.');
            } finally {
                setInitialLoading(false);
                setFiltering(false);
            }
        };
        const debounce = setTimeout(fetchSyndicates, 300);
        return () => clearTimeout(debounce);
    }, [search, selectedTags]);

    if (initialLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface-base transition-colors duration-300">
            <div className="w-12 h-12 border-4 border-sangam-emerald border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-surface-text-muted font-medium">Scanning Investment Hub...</p>
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

    const hasFilters = selectedTags.length > 0;
    const clearFilters = () => setSelectedTags([]);

    return (
        <div className="min-h-screen bg-surface-base p-8 transition-colors duration-300">
            <header className="max-w-6xl mx-auto mb-12 flex flex-col space-y-6">
                <div>
                    <h1 className="text-4xl font-bold text-surface-text mb-2">Syndicate Hub</h1>
                    <p className="text-lg text-surface-text-muted">Fractional investment and community-backed growth.</p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title, description, or founder..."
                            className="w-full pl-10 pr-4 py-3 bg-surface-card border border-surface-border rounded-xl focus:ring-2 focus:ring-sangam-emerald outline-none text-surface-text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`md:ml-4 p-3 rounded-xl font-bold flex items-center space-x-2 transition-all ${
                            showFilters || hasFilters ? 'bg-sangam-emerald text-white shadow-lg shadow-sangam-emerald/20' : 'bg-surface-card border border-surface-border text-surface-text hover:bg-surface-base'
                        }`}
                    >
                        <Filter size={20} />
                        <span>Filters {selectedTags.length > 0 ? `(${selectedTags.length})` : ''}</span>
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
                                <div className="flex justify-between items-center">
                                    <h3 className="font-black text-surface-text">Filter by Interest Tags</h3>
                                    {hasFilters && (
                                        <button onClick={clearFilters} className="text-sm text-sangam-emerald font-bold hover:underline">
                                            Clear all
                                        </button>
                                    )}
                                </div>
                                <TagSelector selectedTags={selectedTags} onTagsChange={setSelectedTags} tags={availableTags} required={false} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {hasFilters && (
                    <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                            <motion.div
                                key={tag}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center space-x-2 bg-sangam-emerald/10 border border-sangam-emerald rounded-full px-4 py-2"
                            >
                                <span className="text-sm font-bold text-sangam-emerald">{tag}</span>
                                <button onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))} className="text-sangam-emerald hover:text-sangam-emerald-dark">
                                    <X size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </header>

            <div className="max-w-6xl mx-auto">
                {filtering && (
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center gap-2 text-surface-text-muted text-sm">
                            <div className="w-4 h-4 border-2 border-sangam-emerald border-t-transparent rounded-full animate-spin"></div>
                            Updating results...
                        </div>
                    </div>
                )}
            </div>

            <div className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 ${filtering ? 'opacity-50 pointer-events-none' : ''}`}>
                {syndicates.map((s) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="surface-card rounded-3xl p-8 hover:shadow-lg transition-all"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-surface-text">{s.title}</h3>
                                <p className="text-sm text-surface-text-muted">Lead: {s.founder_name}</p>
                            </div>
                            <div className="p-3 bg-emerald-50 text-sangam-emerald rounded-2xl">
                                <PieChart size={24} />
                            </div>
                        </div>

                        <p className="text-surface-text-muted text-sm mb-6 line-clamp-3">{s.description}</p>

                        {(s.interest_tags || []).length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-6">
                                {s.interest_tags.slice(0, 4).map((tag) => (
                                    <span key={tag} className="text-[10px] bg-surface-base text-surface-text-muted px-2 py-1 rounded-lg font-medium border border-surface-border">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-bold text-surface-text">${s.current_funding} committed</span>
                                <span className="text-surface-text-muted">of ${s.funding_goal} goal</span>
                            </div>
                            <div className="w-full bg-surface-base h-3 rounded-full overflow-hidden border border-surface-border">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${s.progress}%` }}
                                    className="bg-sangam-emerald h-full rounded-full"
                                ></motion.div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-surface-border">
                                <a
                                    href={`http://127.0.0.1:8000/api/core/statutes/${s.id}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-sm font-bold text-sangam-emerald hover:underline"
                                >
                                    <FileText size={18} />
                                    <span>View Smart-Statute</span>
                                    <ExternalLink size={14} />
                                </a>
                                <button className="bg-sangam-emerald text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-sangam-emerald-dark transition-colors shadow-lg shadow-sangam-emerald/20">
                                    Commit Capital
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {syndicates.length === 0 && (
                    <div className="col-span-full py-20 bg-surface-card rounded-3xl border border-dashed border-surface-border text-center">
                        <h3 className="text-xl font-bold text-surface-text-muted">No active syndicates</h3>
                        <p className="text-surface-text-muted">New investment opportunities will appear here soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SyndicateHub;
