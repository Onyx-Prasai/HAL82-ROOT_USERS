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
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-sangam-emerald border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium tracking-widest uppercase animate-pulse">Reading the Pulse...</p>
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
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-sangam-slate mb-2">Growth Ledger</h1>
                    <p className="text-lg text-gray-500">The Pulse of your Startup progress.</p>
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
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold">Historical Snapshots</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-slate-50 px-4 py-2 rounded-xl">
                            <Info size={16} />
                            <span>Visibility toggle allows verified investors to see your pulse.</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-4 font-black">Week Ending</th>
                                    <th className="pb-4 font-black">Revenue</th>
                                    <th className="pb-4 font-black">Users</th>
                                    <th className="pb-4 font-black">Expenses</th>
                                    <th className="pb-4 font-black">Privacy</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {snapshots.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 font-bold text-sangam-slate">{s.week_ending}</td>
                                        <td className="py-4 font-medium text-sangam-emerald">${s.revenue}</td>
                                        <td className="py-4 font-medium">{s.users}</td>
                                        <td className="py-4 text-gray-400 font-medium">${s.expenses}</td>
                                        <td className="py-4">
                                            <button className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold ${s.is_public ? 'bg-emerald-50 text-sangam-emerald' : 'bg-slate-100 text-slate-400'}`}>
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
                            className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold mb-2">Sunday Pulse Update</h2>
                            <p className="text-gray-500 mb-8 border-b border-slate-100 pb-4">Input your 3 key numbers for this week.</p>

                            {!isSunday && (
                                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-6 flex items-start space-x-3">
                                    <Info className="text-amber-500 shrink-0" size={20} />
                                    <p className="text-xs text-amber-700">Protocol says: Updates are normally for Sundays. Since you're the Pilot, you can bypass this for today.</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Revenue ($)</label>
                                        <input type="number" required className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sangam-emerald outline-none" value={formData.revenue} onChange={(e) => setFormData({ ...formData, revenue: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Users</label>
                                        <input type="number" required className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sangam-emerald outline-none" value={formData.users} onChange={(e) => setFormData({ ...formData, users: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Expenses ($)</label>
                                    <input type="number" required className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sangam-emerald outline-none" value={formData.expenses} onChange={(e) => setFormData({ ...formData, expenses: e.target.value })} />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <div>
                                        <p className="text-sm font-bold">Public View</p>
                                        <p className="text-[10px] text-gray-500">Allow verified investors to see this snapshot</p>
                                    </div>
                                    <button type="button" onClick={() => setFormData({ ...formData, is_public: !formData.is_public })} className={`w-12 h-6 rounded-full transition-all relative ${formData.is_public ? 'bg-sangam-emerald' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.is_public ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-gray-500 font-bold">Cancel</button>
                                    <button type="submit" className="flex-[2] bg-sangam-slate text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors">Submit Snapshot</button>
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
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-sangam-slate">{title}</h3>
            <div className="bg-emerald-50 text-sangam-emerald p-2 rounded-lg">
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="week_ending" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
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
