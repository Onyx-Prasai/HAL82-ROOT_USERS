import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Heart, Zap, Bell, Calendar } from 'lucide-react';
import api from '../services/api';
import NepalMap from '../components/dashboard/NepalMap';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, userRes, bookingsRes] = await Promise.all([
                    api.get('/core/stats/'),
                    api.get('/users/profile/'),
                    api.get('/core/bookings/').catch(() => ({ data: [] }))
                ]);
                setStats(statsRes.data);
                setUser(userRes.data);
                setBookings(bookingsRes.data || []);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message || 'Failed to load ecosystem data');
            }
        };
        fetchData();
    }, []);

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-surface-base">
            <div className="bg-surface-card p-8 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-xl text-center max-w-sm">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold text-surface-text mb-2">Connection Issue</h3>
                <p className="text-surface-text-muted mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-sangam-emerald text-white py-3 rounded-xl font-bold hover:bg-sangam-emerald-dark transition-colors"
                >
                    Retry Connection
                </button>
            </div>
        </div>
    );

    if (!stats || !user) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-sangam-emerald border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium animate-pulse">Loading Ecosystem...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-surface-base transition-colors duration-300">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-surface-text">Namaste, {user.username}!</h2>
                        <p className="text-surface-text-muted">Here's what's happening in the confluence today.</p>
                    </div>
                </header>

                {/* Top Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Startups" value={stats.total_startups} trend="+12% this month" />
                    <StatCard title="Total Investment" value={stats.total_investment} trend="Growing" />
                    <StatCard title="Active Matches" value={stats.active_matches} trend="New today" />
                    <KarmaCard score={user.karma_score} />
                </div>

                {/* Interactive Map & Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <NepalMap hotspots={stats.hotspots} />
                        <div className="bg-surface-card rounded-3xl p-8 border border-surface-border shadow-sm">
                            <h3 className="text-xl font-bold mb-6 text-surface-text">Trending in Nepal</h3>
                            <div className="space-y-4">
                                <FeedItem title="New Startup Law" desc="Government of Nepal announces tax exemptions for tech exports." time="2h ago" tag="Policy" />
                                <FeedItem title="KTM AI Hub" desc="15 new 'Hacker' personas joined the Kathmandu innovation cluster." time="5h ago" tag="Growth" />
                                <FeedItem title="Agri-Tech Fund" desc="Global syndicate opening for high-altitude sustainable farming." time="1d ago" tag="Investment" />
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-8">
                        <div className="bg-sangam-emerald dark:bg-sangam-emerald/10 rounded-3xl p-8 text-white dark:text-sangam-emerald relative overflow-hidden shadow-lg shadow-sangam-emerald/20">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-4">Finding Your Jodi</h3>
                                <p className="opacity-80 text-sm mb-6">Based on your persona, we've found 3 potential co-founders for you.</p>
                                <button onClick={() => navigate('/matcher')} className="bg-white dark:bg-sangam-emerald text-sangam-emerald dark:text-white w-full py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">Start Discovery</button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        </div>

                        <div className="bg-surface-card rounded-3xl p-8 border border-surface-border shadow-sm transition-colors">
                            <h3 className="text-lg font-bold mb-4 text-surface-text">Upcoming consultations</h3>
                            {bookings.length === 0 ? (
                                <p className="text-sm text-surface-text-muted">No sessions booked. Visit the Marketplace to connect with experts.</p>
                            ) : (
                                <div className="space-y-3">
                                    {bookings.slice(0, 5).map((b) => (
                                        <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-base border border-surface-border">
                                            <span className="font-bold text-surface-text">{user?.id === b.expert ? b.client_username : b.expert_username}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${b.is_free_intro ? 'bg-sangam-emerald/10 text-sangam-emerald' : 'bg-surface-border text-surface-text-muted'}`}>
                                                {b.is_free_intro ? 'Free intro' : `$${b.amount}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button onClick={() => navigate('/marketplace')} className="mt-4 text-sangam-emerald font-bold text-sm hover:underline flex items-center gap-2">
                                <Calendar size={16} /> Visit Marketplace
                            </button>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active = false }) => (
    <button className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${active ? 'bg-sangam-emerald/10 text-sangam-emerald' : 'text-surface-text-muted hover:bg-surface-base'}`}>
        {icon}
        <span className="font-semibold hidden lg:block">{label}</span>
    </button>
);

const StatCard = ({ title, value, trend }) => (
    <div className="bg-surface-card p-6 rounded-3xl border border-surface-border shadow-sm">
        <p className="text-sm text-surface-text-muted font-medium">{title}</p>
        <h4 className="text-2xl font-bold text-surface-text my-2">{value}</h4>
        <p className="text-xs text-sangam-emerald font-semibold">{trend}</p>
    </div>
);

const KarmaCard = ({ score }) => (
    <div className="bg-surface-card p-6 rounded-3xl border border-surface-border shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 bg-sangam-emerald/10 rounded-2xl flex items-center justify-center text-sangam-emerald">
            <Heart fill="currentColor" size={24} />
        </div>
        <div>
            <p className="text-sm text-surface-text-muted font-medium">Karma Score</p>
            <h4 className="text-2xl font-bold text-surface-text">{score}</h4>
        </div>
    </div>
);

const FeedItem = ({ title, desc, time, tag }) => (
    <div className="flex items-start space-x-4 p-4 hover:bg-surface-base rounded-2xl transition-colors">
        <div className="w-2 bg-sangam-emerald h-12 rounded-full mt-1"></div>
        <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
                <h5 className="font-bold text-surface-text">{title}</h5>
                <span className="text-[10px] bg-surface-base px-2 py-0.5 rounded-full text-surface-text-muted uppercase font-bold">{tag}</span>
            </div>
            <p className="text-sm text-surface-text-muted line-clamp-1">{desc}</p>
            <p className="text-[10px] text-surface-text-muted/60 mt-2">{time}</p>
        </div>
    </div>
);

export default Dashboard;
