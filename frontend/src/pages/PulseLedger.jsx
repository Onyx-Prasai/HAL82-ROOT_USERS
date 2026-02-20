import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Plus, Info, Lock, Globe, ArrowUpRight } from 'lucide-react';
import api from '../services/api';

const PulseLedger = () => {
    const [snapshots, setSnapshots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSunday, setIsSunday] = useState(false);
    const [formData, setFormData] = useState({
        week_ending: new Date().toISOString().split('T')[0],
        revenue: 0,
        users: 0,
        expenses: 0,
        is_public: false
    });

    useEffect(() => {
        fetchSnapshots();
        const today = new Date().getDay();
        setIsSunday(today === 0);
    }, []);

    const fetchSnapshots = async () => {
        try {
            const response = await api.get('/core/snapshots/');
            setSnapshots(response.data || []);
        } catch (err) {
            console.error('Error fetching snapshots:', err);
            setError('Failed to load growth snapshots.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/core/snapshots/', formData);
            setShowModal(false);
            fetchSnapshots();
        } catch (error) {
            console.error('Error saving snapshot:', error);
            alert('Failed to save data. You can only enter one snapshot per week.');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface-base">
            <div className="w-12 h-12 border-4 border-sangam-emerald border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-surface-text-muted font-medium tracking-widest uppercase animate-pulse">Reading the Pulse...</p>
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

    return (
        <div className="min-h-screen bg-surface-base p-8 transition-colors duration-300">
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-surface-text mb-2">Growth Ledger</h1>
                    <p className="text-lg text-surface-text-muted">The Pulse of your Startup progress.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-sangam-emerald text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                >
                    <Plus size={20} />
                    <span>Update Pulse</span>
                </button>
            </header>

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ChartCard title="Revenue Growth" data={snapshots} dataKey="revenue" color="#10B981" />
                    <ChartCard title="User Acquisition" data={snapshots} dataKey="users" color="#1E293B" />
                </div>

                {/* Data Table / Privacy Toggle */}
                <div className="bg-surface-card rounded-3xl p-8 border border-surface-border shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-surface-text">Historical Snapshots</h3>
                        <div className="flex items-center space-x-2 text-sm text-surface-text-muted bg-surface-base px-4 py-2 rounded-xl">
                            <Info size={16} />
                            <span>Visibility toggle allows verified investors to see your pulse.</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-surface-text-muted text-xs uppercase tracking-widest border-b border-surface-border">
                                    <th className="pb-4 font-black">Week Ending</th>
                                    <th className="pb-4 font-black">Revenue</th>
                                    <th className="pb-4 font-black">Users</th>
                                    <th className="pb-4 font-black">Expenses</th>
                                    <th className="pb-4 font-black">Privacy</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {snapshots.map((s) => (
                                    <tr key={s.id} className="hover:bg-surface-base transition-colors divide-y divide-surface-border">
                                        <td className="py-4 font-bold text-surface-text">{s.week_ending}</td>
                                        <td className="py-4 font-medium text-sangam-emerald">${s.revenue}</td>
                                        <td className="py-4 font-medium text-surface-text">{s.users}</td>
                                        <td className="py-4 text-surface-text-muted font-medium">${s.expenses}</td>
                                        <td className="py-4">
                                            <button className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold ${s.is_public ? 'bg-sangam-emerald/10 text-sangam-emerald' : 'bg-surface-base text-surface-text-muted'}`}>
                                                {s.is_public ? <Globe size={12} /> : <Lock size={12} />}
                                                <span>{s.is_public ? 'PUBLIC' : 'PRIVATE'}</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* KPI Input Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-sangam-slate/40 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-surface-card rounded-3xl p-8 shadow-2xl border border-surface-border text-surface-text"
                        >
                            <h2 className="text-2xl font-bold mb-2">Sunday Pulse Update</h2>
                            <p className="text-surface-text-muted mb-8 border-b border-surface-border pb-4">Input your 3 key numbers for this week.</p>

                            {!isSunday && (
                                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-6 flex items-start space-x-3">
                                    <Info className="text-amber-500 shrink-0" size={20} />
                                    <p className="text-xs text-amber-700">Protocol says: Updates are normally for Sundays. Since you're the Pilot, you can bypass this for today.</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-surface-text-muted uppercase tracking-widest mb-2">Revenue ($)</label>
                                        <input type="number" required className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-sangam-emerald outline-none text-surface-text" value={formData.revenue} onChange={(e) => setFormData({ ...formData, revenue: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-surface-text-muted uppercase tracking-widest mb-2">Total Users</label>
                                        <input type="number" required className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-sangam-emerald outline-none text-surface-text" value={formData.users} onChange={(e) => setFormData({ ...formData, users: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-surface-text-muted uppercase tracking-widest mb-2">Expenses ($)</label>
                                    <input type="number" required className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-sangam-emerald outline-none text-surface-text" value={formData.expenses} onChange={(e) => setFormData({ ...formData, expenses: e.target.value })} />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-surface-base rounded-2xl border border-surface-border">
                                    <div>
                                        <p className="text-sm font-bold">Public View</p>
                                        <p className="text-[10px] text-surface-text-muted">Allow verified investors to see this snapshot</p>
                                    </div>
                                    <button type="button" onClick={() => setFormData({ ...formData, is_public: !formData.is_public })} className={`w-12 h-6 rounded-full transition-all relative ${formData.is_public ? 'bg-sangam-emerald' : 'bg-surface-border'}`}>
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.is_public ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-surface-text-muted font-bold">Cancel</button>
                                    <button type="submit" className="flex-[2] bg-sangam-emerald text-white py-4 rounded-xl font-bold hover:bg-sangam-emerald-dark transition-colors shadow-lg shadow-sangam-emerald/20">Submit Snapshot</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ChartCard = ({ title, data, dataKey, color }) => (
    <div className="bg-surface-card p-8 rounded-3xl border border-surface-border shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-surface-text">{title}</h3>
            <div className="bg-sangam-emerald/10 text-sangam-emerald p-2 rounded-lg">
                <ArrowUpRight size={16} />
            </div>
        </div>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.1} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-surface-border)" />
                    <XAxis dataKey="week_ending" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-surface-text-muted)' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-surface-text-muted)' }} />
                    <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#grad-${dataKey})`} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default PulseLedger;
