import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Plus, Info, Lock, Globe, ArrowUpRight, Gift, Star, Coins, CheckCircle } from 'lucide-react';
import api from '../services/api';

const SAMPLE_GRAPH_DATA = [
    { week_ending: 'Week 1', revenue: 12000, users: 150 },
    { week_ending: 'Week 2', revenue: 18000, users: 220 },
    { week_ending: 'Week 3', revenue: 25000, users: 310 },
    { week_ending: 'Week 4', revenue: 32000, users: 420 },
    { week_ending: 'Week 5', revenue: 28000, users: 380 },
    { week_ending: 'Week 6', revenue: 22000, users: 340 },
    { week_ending: 'Week 7', revenue: 19000, users: 290 },
    { week_ending: 'Week 8', revenue: 24000, users: 350 },
    { week_ending: 'Week 9', revenue: 31000, users: 450 },
    { week_ending: 'Week 10', revenue: 42000, users: 580 },
    { week_ending: 'Week 11', revenue: 55000, users: 720 },
    { week_ending: 'Week 12', revenue: 68000, users: 890 },
];

const DEFAULT_REDEEM_OFFERS = [
    { id: 'fb1', company_name: 'CloudNest Nepal', description: 'Cloud hosting for startups - premium tier at discounted rate.', discount_percent: 20, points_required: 50, interest_tags: ['Tech', 'AI'] },
    { id: 'fb2', company_name: 'DesignPro Studio', description: 'Professional UI/UX design services for your product.', discount_percent: 15, points_required: 40, interest_tags: ['Tech'] },
    { id: 'fb3', company_name: 'LegalEase Nepal', description: 'Startup legal incorporation and compliance services.', discount_percent: 25, points_required: 75, interest_tags: ['General'] },
    { id: 'fb4', company_name: 'MarketBoost', description: 'Digital marketing package for early-stage startups.', discount_percent: 30, points_required: 100, interest_tags: ['Tech', 'FinTech'] },
    { id: 'fb5', company_name: 'CoWork Valley', description: 'Co-working space membership in Kathmandu.', discount_percent: 25, points_required: 80, interest_tags: ['Tech'] },
    { id: 'fb6', company_name: 'PrintHub KTM', description: 'Business cards, brochures, and marketing materials.', discount_percent: 40, points_required: 30, interest_tags: ['General'] },
    { id: 'fb7', company_name: 'PayWise Nepal', description: 'Payment gateway integration for e-commerce and SaaS.', discount_percent: 20, points_required: 55, interest_tags: ['FinTech', 'Tech'] },
    { id: 'fb8', company_name: 'BrandCraft Nepal', description: 'Logo design and brand identity packages.', discount_percent: 35, points_required: 55, interest_tags: ['Tech', 'General'] },
];

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
    const [activeTab, setActiveTab] = useState('pulse');
    const [karmaBalance, setKarmaBalance] = useState({ earned: 0, spent: 0, balance: 0 });
    const [redeemOffers, setRedeemOffers] = useState([]);
    const [redemptionHistory, setRedemptionHistory] = useState([]);
    const [redeemLoading, setRedeemLoading] = useState(false);

    useEffect(() => {
        fetchSnapshots();
        fetchKarmaData();
        const today = new Date().getDay();
        setIsSunday(today === 0);
    }, []);

    const fetchKarmaData = async () => {
        try {
            const [balanceRes, offersRes, historyRes] = await Promise.all([
                api.get('/core/karma/balance/'),
                api.get('/core/redeem/offers/'),
                api.get('/core/redeem/history/'),
            ]);
            setKarmaBalance(balanceRes.data);
            const offers = offersRes.data || [];
            setRedeemOffers(offers.length ? offers : DEFAULT_REDEEM_OFFERS);
            setRedemptionHistory(historyRes.data || []);
        } catch (err) {
            console.error('Error fetching karma data:', err);
        }
    };

    const handleRedeem = async (offerId) => {
        setRedeemLoading(true);
        try {
            const res = await api.post(`/core/redeem/${offerId}/`);
            alert(res.data.message);
            fetchKarmaData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to redeem offer');
        } finally {
            setRedeemLoading(false);
        }
    };

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
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-surface-text mb-2">Growth Ledger</h1>
                    <p className="text-lg text-surface-text-muted">The Pulse of your Startup progress.</p>
                </div>
                {activeTab === 'pulse' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-sangam-emerald text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                    >
                        <Plus size={20} />
                        <span>Update Pulse</span>
                    </button>
                )}
            </header>

            {/* Tabs */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="flex space-x-2 bg-surface-card p-2 rounded-2xl border border-surface-border w-fit">
                    <button
                        onClick={() => setActiveTab('pulse')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'pulse' ? 'bg-sangam-emerald text-white shadow-lg' : 'text-surface-text-muted hover:text-surface-text'}`}
                    >
                        Pulse
                    </button>
                    <button
                        onClick={() => setActiveTab('redeem')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${activeTab === 'redeem' ? 'bg-sangam-emerald text-white shadow-lg' : 'text-surface-text-muted hover:text-surface-text'}`}
                    >
                        <Gift size={18} />
                        <span>Redeem Karma</span>
                    </button>
                </div>
            </div>

            {activeTab === 'pulse' && (
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Growth Trajectory Chart */}
                <div className="bg-surface-card rounded-3xl p-6 border border-surface-border">
                    <div className="flex items-center space-x-2 mb-4">
                        <Star className="text-sangam-emerald" size={20} />
                        <span className="text-sm font-bold text-surface-text">Growth Trajectory</span>
                        <span className="text-xs text-surface-text-muted">(Illustrative pattern: Growth → Dip → Recovery)</span>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={SAMPLE_GRAPH_DATA}>
                                <defs>
                                    <linearGradient id="sampleGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-surface-border)" />
                                <XAxis dataKey="week_ending" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--color-surface-text-muted)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--color-surface-text-muted)' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#sampleGrad)" name="Revenue ($)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Charts Section - show sample data when no snapshots */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ChartCard title="Revenue Growth" data={snapshots.length ? snapshots : SAMPLE_GRAPH_DATA} dataKey="revenue" color="#10B981" />
                    <ChartCard title="User Acquisition" data={snapshots.length ? snapshots : SAMPLE_GRAPH_DATA} dataKey="users" color="#1E293B" />
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
            )}

            {/* Redeem Tab */}
            {activeTab === 'redeem' && (
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Karma Balance Card */}
                <div className="bg-surface-card rounded-3xl p-8 border border-surface-border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-surface-text-muted text-sm font-medium mb-1">Your Karma Balance</p>
                            <h2 className="text-5xl font-black text-sangam-emerald">{karmaBalance.balance}</h2>
                            <p className="text-surface-text-muted text-sm mt-2">points available</p>
                        </div>
                        <div className="text-right space-y-2">
                            <div className="bg-sangam-emerald/10 rounded-xl px-4 py-2 border border-sangam-emerald/20">
                                <p className="text-xs text-surface-text-muted">Earned</p>
                                <p className="font-bold text-lg text-sangam-emerald">+{karmaBalance.earned}</p>
                            </div>
                            <div className="bg-surface-base rounded-xl px-4 py-2 border border-surface-border">
                                <p className="text-xs text-surface-text-muted">Redeemed</p>
                                <p className="font-bold text-lg text-surface-text">-{karmaBalance.spent}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-surface-border">
                        <p className="text-sm text-surface-text-muted">
                            <Coins size={14} className="inline mr-1 text-sangam-emerald" />
                            Earn karma by helping other founders, sharing expertise, and receiving positive feedback!
                        </p>
                    </div>
                </div>

                {/* How to Earn Section */}
                <div className="bg-surface-card rounded-3xl p-8 border border-surface-border">
                    <h3 className="text-xl font-bold text-surface-text mb-6">How to Earn Karma Points</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-sangam-emerald/5 rounded-2xl p-6 border border-sangam-emerald/20">
                            <div className="w-12 h-12 bg-sangam-emerald rounded-xl flex items-center justify-center mb-4">
                                <CheckCircle className="text-white" size={24} />
                            </div>
                            <h4 className="font-bold text-surface-text mb-2">Help Other Founders</h4>
                            <p className="text-sm text-surface-text-muted">Answer questions, provide mentorship, and share your expertise with the community.</p>
                            <p className="text-sangam-emerald font-bold mt-3">+10-50 points</p>
                        </div>
                        <div className="bg-sangam-emerald/5 rounded-2xl p-6 border border-sangam-emerald/20">
                            <div className="w-12 h-12 bg-sangam-emerald rounded-xl flex items-center justify-center mb-4">
                                <Star className="text-white" size={24} />
                            </div>
                            <h4 className="font-bold text-surface-text mb-2">Receive Positive Feedback</h4>
                            <p className="text-sm text-surface-text-muted">Get karma when others rate your interactions positively or recommend you.</p>
                            <p className="text-sangam-emerald font-bold mt-3">+5-25 points</p>
                        </div>
                        <div className="bg-sangam-emerald/5 rounded-2xl p-6 border border-sangam-emerald/20">
                            <div className="w-12 h-12 bg-sangam-emerald rounded-xl flex items-center justify-center mb-4">
                                <Gift className="text-white" size={24} />
                            </div>
                            <h4 className="font-bold text-surface-text mb-2">Complete Milestones</h4>
                            <p className="text-sm text-surface-text-muted">Earn bonus karma for completing profile, first session, and engagement milestones.</p>
                            <p className="text-sangam-emerald font-bold mt-3">+20-100 points</p>
                        </div>
                    </div>
                </div>

                {/* Available Offers */}
                <div className="bg-surface-card rounded-3xl p-8 border border-surface-border">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-surface-text">Redeem for Discounts</h3>
                        <span className="text-sm text-surface-text-muted">{redeemOffers.length} offers available</span>
                    </div>
                    {redeemOffers.length === 0 ? (
                        <div className="text-center py-12 text-surface-text-muted">
                            <Gift size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No offers available yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {redeemOffers.map((offer) => (
                                <div key={offer.id} className="border border-surface-border rounded-2xl p-6 hover:shadow-lg transition-all bg-surface-base">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="font-bold text-surface-text">{offer.company_name}</h4>
                                            <p className="text-2xl font-black text-sangam-emerald">{offer.discount_percent}% OFF</p>
                                        </div>
                                        <div className="bg-sangam-emerald/10 text-sangam-emerald px-3 py-1 rounded-full text-xs font-bold border border-sangam-emerald/20">
                                            {offer.points_required} pts
                                        </div>
                                    </div>
                                    <p className="text-sm text-surface-text-muted mb-4 line-clamp-2">{offer.description}</p>
                                    {offer.interest_tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {offer.interest_tags.slice(0, 3).map((tag, i) => (
                                                <span key={i} className="bg-surface-card text-surface-text-muted text-[10px] px-2 py-1 rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => typeof offer.id === 'number' && handleRedeem(offer.id)}
                                        disabled={redeemLoading || karmaBalance.balance < offer.points_required}
                                        className={`w-full py-3 rounded-xl font-bold transition-all ${karmaBalance.balance >= offer.points_required ? 'bg-sangam-emerald text-white hover:bg-emerald-600' : 'bg-surface-border text-surface-text-muted cursor-not-allowed'}`}
                                    >
                                        {karmaBalance.balance < offer.points_required ? `Need ${offer.points_required - karmaBalance.balance} more pts` : 'Redeem Now'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Redemption History */}
                {redemptionHistory.length > 0 && (
                    <div className="bg-surface-card rounded-3xl p-8 border border-surface-border">
                        <h3 className="text-xl font-bold text-surface-text mb-6">Your Redemption History</h3>
                        <div className="space-y-3">
                            {redemptionHistory.map((r) => (
                                <div key={r.id} className="flex items-center justify-between p-4 bg-surface-base rounded-xl">
                                    <div>
                                        <p className="font-bold text-surface-text">{r.offer_name}</p>
                                        <p className="text-sm text-surface-text-muted">{new Date(r.redeemed_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sangam-emerald">{r.discount_percent}% off</p>
                                        <p className="text-sm text-surface-text-muted">-{r.points_spent} pts</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            )}

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
