import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, DollarSign, Users, FileText, ExternalLink } from 'lucide-react';
import api from '../services/api';

const SyndicateHub = () => {
    const [syndicates, setSyndicates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSyndicates = async () => {
            try {
                const response = await api.get('/core/syndicates/');
                setSyndicates(response.data);
            } catch (err) {
                console.error('Error fetching syndicates:', err);
                setError('Failed to load investment syndicates.');
            } finally {
                setLoading(false);
            }
        };
        fetchSyndicates();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-sangam-emerald border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium">Scanning Investment Hub...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
            <div className="bg-white p-8 rounded-3xl border border-red-100 text-center max-w-sm">
                <p className="text-gray-500 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="text-sangam-emerald font-bold">Retry</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <header className="max-w-6xl mx-auto mb-12">
                <h1 className="text-4xl font-bold text-sangam-slate mb-2">Syndicate Hub</h1>
                <p className="text-lg text-gray-500">Fractional investment and community-backed growth.</p>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {syndicates.map((s) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-sangam-slate">{s.title}</h3>
                                <p className="text-sm text-gray-400">Lead: {s.founder_name}</p>
                            </div>
                            <div className="p-3 bg-emerald-50 text-sangam-emerald rounded-2xl">
                                <PieChart size={24} />
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm mb-8 line-clamp-3">{s.description}</p>

                        <div className="space-y-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-bold text-sangam-slate">${s.current_funding} committed</span>
                                <span className="text-gray-400">of ${s.funding_goal} goal</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${s.progress}%` }}
                                    className="bg-sangam-emerald h-full rounded-full"
                                ></motion.div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
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
                                <button className="bg-sangam-slate text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                                    Commit Capital
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {syndicates.length === 0 && (
                    <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                        <h3 className="text-xl font-bold text-gray-400">No active syndicates</h3>
                        <p className="text-gray-500">New investment opportunities will appear here soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SyndicateHub;
