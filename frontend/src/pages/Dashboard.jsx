import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Heart, Zap, Bell, Search, Settings } from 'lucide-react';
import api from '../services/api';
import NepalMap from '../components/dashboard/NepalMap';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, userRes] = await Promise.all([
                    api.get('/core/stats/'),
                    api.get('/users/profile/')
                ]);
                setStats(statsRes.data);
                setUser(userRes.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message || 'Failed to load ecosystem data');
            }
        };
        fetchData();
    }, []);

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
            <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-xl text-center max-w-sm">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold text-sangam-slate mb-2">Connection Issue</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-sangam-slate text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
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
        <div className="min-h-screen bg-slate-50">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-sangam-slate">Namaste, {user.username}!</h2>
                        <p className="text-gray-500">Here's what's happening in the confluence today.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="text" placeholder="Search ecosystem..." className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-sangam-emerald outline-none" />
                        </div>
                        <button className="p-2 bg-white border border-slate-100 rounded-xl hover:bg-slate-50"><Settings size={20} /></button>
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
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-bold mb-6">Trending in Nepal</h3>
                            <div className="space-y-4">
                                <FeedItem title="New Startup Law" desc="Government of Nepal announces tax exemptions for tech exports." time="2h ago" tag="Policy" />
                                <FeedItem title="KTM AI Hub" desc="15 new 'Hacker' personas joined the Kathmandu innovation cluster." time="5h ago" tag="Growth" />
                                <FeedItem title="Agri-Tech Fund" desc="Global syndicate opening for high-altitude sustainable farming." time="1d ago" tag="Investment" />
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-8">
                        <div className="bg-sangam-slate rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-4">Finding Your Jodi</h3>
                                <p className="text-gray-400 text-sm mb-6">Based on your persona, we've found 3 potential co-founders for you.</p>
                                <button className="bg-sangam-emerald w-full py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">Start Discovery</button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sangam-emerald opacity-10 rounded-full blur-2xl"></div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold mb-4">Upcoming consultations</h3>
                            <p className="text-sm text-gray-500">No sessions booked. Visit the Marketplace to connect with experts.</p>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active = false }) => (
    <button className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${active ? 'bg-emerald-50 text-sangam-emerald' : 'text-gray-500 hover:bg-slate-50'}`}>
        {icon}
        <span className="font-semibold hidden lg:block">{label}</span>
    </button>
);

const StatCard = ({ title, value, trend }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h4 className="text-2xl font-bold text-sangam-slate my-2">{value}</h4>
        <p className="text-xs text-sangam-emerald font-semibold">{trend}</p>
    </div>
);

const KarmaCard = ({ score }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-sangam-emerald">
            <Heart fill="currentColor" size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">Karma Score</p>
            <h4 className="text-2xl font-bold text-sangam-slate">{score}</h4>
        </div>
    </div>
);

const FeedItem = ({ title, desc, time, tag }) => (
    <div className="flex items-start space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
        <div className="w-2 bg-sangam-emerald h-12 rounded-full mt-1"></div>
        <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
                <h5 className="font-bold text-sangam-slate">{title}</h5>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-gray-500 uppercase font-bold">{tag}</span>
            </div>
            <p className="text-sm text-gray-500 line-clamp-1">{desc}</p>
            <p className="text-[10px] text-gray-400 mt-2">{time}</p>
        </div>
    </div>
);

export default Dashboard;
