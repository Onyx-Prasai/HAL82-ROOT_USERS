import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, MessageSquare, Search, Filter, X } from 'lucide-react';
import api from '../services/api';
import ChatModal from '../components/dashboard/ChatModal';
import TagSelector from '../components/common/TagSelector';

const PERSONAS = ['HACKER', 'HIPSTER', 'HUSTLER'];
const STAGES = ['IDEA', 'MVP', 'REVENUE'];
const PROVINCES = ['KOSHI', 'MADHESH', 'BAGMATI', 'GANDAKI', 'LUMBINI', 'KARNALI', 'SUDURPASHCHIM'];

const JodiMatcher = () => {
    const [matches, setMatches] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [filtering, setFiltering] = useState(false);
    const [error, setError] = useState(null);
    const [chatReceiver, setChatReceiver] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedPersona, setSelectedPersona] = useState('');
    const [selectedStage, setSelectedStage] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
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
        const fetchMatches = async () => {
            if (!initialLoading) setFiltering(true);
            try {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (selectedTags.length) params.append('tags', selectedTags.join(','));
                if (selectedPersona) params.append('persona', selectedPersona);
                if (selectedStage) params.append('stage', selectedStage);
                if (selectedProvince) params.append('province', selectedProvince);
                const url = params.toString() ? `/users/discovery/?${params}` : '/users/discovery/';
                const response = await api.get(url);
                setMatches(response.data || []);
            } catch (err) {
                console.error('Error fetching discovery cards:', err);
                setError('Failed to find potential matches.');
            } finally {
                setInitialLoading(false);
                setFiltering(false);
            }
        };
        const debounce = setTimeout(fetchMatches, 300);
        return () => clearTimeout(debounce);
    }, [search, selectedTags, selectedPersona, selectedStage, selectedProvince]);

    const handleProposeTrial = async (match) => {
        try {
            await api.post(`/core/trial/propose/${match.id}/`, { message: '' });
            alert(`Proposal sent! ${match.username} will be notified.`);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to send proposal.');
        }
    };

    if (initialLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface-base text-surface-text-muted font-medium">
            <div className="w-12 h-12 border-4 border-sangam-emerald border-t-transparent rounded-full animate-spin mb-4"></div>
            Scanning the Confluence...
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-surface-base p-8">
            <div className="bg-surface-card p-8 rounded-3xl border border-surface-border text-center max-w-sm">
                <p className="text-surface-text-muted mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="text-sangam-emerald font-bold">Retry Connection</button>
            </div>
        </div>
    );

    const hasFilters = selectedTags.length > 0 || selectedPersona || selectedStage || selectedProvince;
    const clearFilters = () => {
        setSelectedTags([]);
        setSelectedPersona('');
        setSelectedStage('');
        setSelectedProvince('');
    };

    return (
        <div className="min-h-screen bg-surface-base p-8 transition-colors duration-300">
            <header className="max-w-6xl mx-auto mb-12 flex flex-col space-y-6">
                <div>
                    <h1 className="text-4xl font-bold text-surface-text mb-2">Jodi Matcher</h1>
                    <p className="text-lg text-surface-text-muted">AI-driven discovery for your perfect co-founder.</p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or bio..."
                            className="w-full pl-10 pr-4 py-3 bg-surface-card border border-surface-border rounded-xl focus:ring-2 focus:ring-sangam-emerald outline-none text-surface-text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-3 rounded-xl font-bold flex items-center space-x-2 transition-all ${
                            showFilters || hasFilters ? 'bg-sangam-emerald text-white shadow-lg shadow-sangam-emerald/20' : 'bg-surface-card border border-surface-border text-surface-text hover:bg-surface-base'
                        }`}
                    >
                        <Filter size={20} />
                        <span>Filters {hasFilters ? '(' + (selectedTags.length + (selectedPersona ? 1 : 0) + (selectedStage ? 1 : 0) + (selectedProvince ? 1 : 0)) + ')' : ''}</span>
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
                            <div className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-black text-surface-text">Filter by Category</h3>
                                    {hasFilters && (
                                        <button onClick={clearFilters} className="text-sm text-sangam-emerald font-bold hover:underline">
                                            Clear all
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-surface-text-muted mb-2">Interest Tags</p>
                                    <TagSelector selectedTags={selectedTags} onTagsChange={setSelectedTags} tags={availableTags} required={false} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-surface-text-muted mb-2">Persona</p>
                                    <div className="flex flex-wrap gap-2">
                                        {PERSONAS.map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setSelectedPersona(selectedPersona === p ? '' : p)}
                                                className={`px-4 py-2 rounded-xl font-bold text-sm ${selectedPersona === p ? 'bg-sangam-emerald text-white' : 'bg-surface-base border border-surface-border text-surface-text hover:bg-surface-base/80'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-surface-text-muted mb-2">Startup Stage</p>
                                    <div className="flex flex-wrap gap-2">
                                        {STAGES.map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSelectedStage(selectedStage === s ? '' : s)}
                                                className={`px-4 py-2 rounded-xl font-bold text-sm ${selectedStage === s ? 'bg-sangam-emerald text-white' : 'bg-surface-base border border-surface-border text-surface-text hover:bg-surface-base/80'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-surface-text-muted mb-2">Province</p>
                                    <div className="flex flex-wrap gap-2">
                                        {PROVINCES.map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setSelectedProvince(selectedProvince === p ? '' : p)}
                                                className={`px-4 py-2 rounded-xl font-bold text-sm ${selectedProvince === p ? 'bg-sangam-emerald text-white' : 'bg-surface-base border border-surface-border text-surface-text hover:bg-surface-base/80'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {hasFilters && (
                    <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                            <span key={tag} className="bg-sangam-emerald/10 border border-sangam-emerald rounded-full px-4 py-2 text-sm font-bold text-sangam-emerald flex items-center gap-2">
                                {tag}
                                <button onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}><X size={14} /></button>
                            </span>
                        ))}
                        {selectedPersona && (
                            <span className="bg-sangam-emerald/10 border border-sangam-emerald rounded-full px-4 py-2 text-sm font-bold text-sangam-emerald flex items-center gap-2">
                                Persona: {selectedPersona}
                                <button onClick={() => setSelectedPersona('')}><X size={14} /></button>
                            </span>
                        )}
                        {selectedStage && (
                            <span className="bg-sangam-emerald/10 border border-sangam-emerald rounded-full px-4 py-2 text-sm font-bold text-sangam-emerald flex items-center gap-2">
                                Stage: {selectedStage}
                                <button onClick={() => setSelectedStage('')}><X size={14} /></button>
                            </span>
                        )}
                        {selectedProvince && (
                            <span className="bg-sangam-emerald/10 border border-sangam-emerald rounded-full px-4 py-2 text-sm font-bold text-sangam-emerald flex items-center gap-2">
                                {selectedProvince}
                                <button onClick={() => setSelectedProvince('')}><X size={14} /></button>
                            </span>
                        )}
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

            <div className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${filtering ? 'opacity-50 pointer-events-none' : ''}`}>
                <AnimatePresence>
                    {matches.map((match, index) => (
                        <motion.div
                            key={match.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-surface-card rounded-3xl overflow-hidden border border-surface-border shadow-sm hover:shadow-xl transition-all group"
                        >
                            <div className="h-3 bg-sangam-emerald w-full"></div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 bg-surface-base rounded-2xl flex items-center justify-center text-surface-text">
                                        <User size={32} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] bg-sangam-emerald/10 text-sangam-emerald px-2 py-1 rounded-full font-bold uppercase tracking-wider mb-2">
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

                                <h3 className="text-xl font-bold text-surface-text mb-1">{match.username}</h3>
                                <p className="text-sm text-surface-text-muted mb-6 capitalize">{match.role.toLowerCase()} - Startup Stage: {match.startup_stage}</p>

                                <div className="space-y-4 mb-8">
                                    <p className="text-sm text-surface-text-muted line-clamp-2">{match.bio || "Visionary founder seeking complementary co-founder."}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(match.interest_tags || []).slice(0, 4).map((tag) => (
                                            <SkillBadge key={tag} name={tag} />
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setChatReceiver(match)}
                                        className="flex items-center justify-center space-x-2 py-3 rounded-xl border border-surface-border text-surface-text font-bold hover:bg-surface-base transition-colors"
                                    >
                                        <MessageSquare size={18} />
                                        <span>Chat</span>
                                    </button>
                                    <button
                                        onClick={() => handleProposeTrial(match)}
                                        className="bg-sangam-emerald text-white py-3 rounded-xl font-bold hover:bg-sangam-emerald-dark transition-colors shadow-lg shadow-sangam-emerald/20"
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
                        <div className="w-20 h-20 bg-surface-card rounded-3xl flex items-center justify-center mx-auto mb-6 text-surface-text-muted border border-surface-border">
                            <Search size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-surface-text">No matches found yet</h3>
                        <p className="text-surface-text-muted">Keep growing your profile, and we'll notify you when a perfect Jodi appears.</p>
                    </div>
                )}
            </div>

            {chatReceiver && (
                <ChatModal receiver={chatReceiver} onClose={() => setChatReceiver(null)} />
            )}
        </div>
    );
};

const SkillBadge = ({ name }) => (
    <span className="text-[10px] bg-surface-base text-surface-text-muted px-2 py-1 rounded-lg font-medium border border-surface-border">
        {name}
    </span>
);

export default JodiMatcher;
