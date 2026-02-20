import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Eye, FileText, User, ChevronRight, CheckCircle, AlertCircle, Trash2, Key } from 'lucide-react';
import api from '../services/api';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';

const SecurityPage = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', first_name: '', last_name: '', province: 'NONE', phone_number: '', bio: '', linkedin_profile: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile/');
            setUser(response.data);
            setFormData({
                username: response.data.username || '',
                email: response.data.email || '',
                first_name: response.data.first_name || '',
                last_name: response.data.last_name || '',
                province: response.data.province || 'NONE',
                phone_number: response.data.phone_number || '',
                bio: response.data.bio || '',
                linkedin_profile: response.data.linkedin_profile || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        try {
            await api.patch('/users/profile/', formData);
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
            fetchProfile();
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to update profile.' });
        }
    };

    const tabs = [
        { id: 'account', label: 'Profile', icon: <User size={20} /> },
        { id: 'security', label: 'Security', icon: <Lock size={20} /> },
        { id: 'privacy', label: 'Privacy', icon: <Eye size={20} /> },
        { id: 'reports', label: 'Reports', icon: <FileText size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-surface-base pt-8 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 text-center lg:text-left">
                    <h1 className="text-4xl font-black text-surface-text tracking-tight flex items-center justify-center lg:justify-start gap-4">
                        <div className="p-3 bg-sangam-emerald/10 text-sangam-emerald rounded-2xl">
                            <Shield size={32} />
                        </div>
                        Security Hub
                    </h1>
                    <p className="mt-2 text-surface-text-muted">Manage your identity, security settings, and ecosystem reports.</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Navigation Rail */}
                    <aside className="lg:w-64 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold ${activeTab === tab.id
                                    ? 'bg-sangam-emerald text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-surface-card text-surface-text-muted hover:bg-surface-base'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </div>
                                <ChevronRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
                            </button>
                        ))}
                    </aside>

                    {/* Content Area */}
                    <main className="flex-1 bg-surface-card rounded-3xl p-8 border border-surface-border shadow-sm relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'account' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-surface-text mb-2">Profile Information</h3>
                                            <p className="text-sm text-surface-text-muted">Update your account details and how you're seen in the forge.</p>
                                        </div>
                                        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-surface-text-muted uppercase tracking-widest mb-1 pl-1">First Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-3 rounded-xl bg-surface-base border border-surface-border text-surface-text outline-none focus:ring-2 focus:ring-sangam-emerald/50"
                                                        value={formData.first_name}
                                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-surface-text-muted uppercase tracking-widest mb-1 pl-1">Last Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-3 rounded-xl bg-surface-base border border-surface-border text-surface-text outline-none focus:ring-2 focus:ring-sangam-emerald/50"
                                                        value={formData.last_name}
                                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-surface-text-muted uppercase tracking-widest mb-1 pl-1">Username</label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    className="w-full p-3 rounded-xl bg-surface-base/50 border border-surface-border text-surface-text-muted cursor-not-allowed opacity-60"
                                                    value={formData.username}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-surface-text-muted uppercase tracking-widest mb-1 pl-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    className="w-full p-3 rounded-xl bg-surface-base border border-surface-border text-surface-text outline-none focus:ring-2 focus:ring-sangam-emerald/50"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-surface-text-muted uppercase tracking-widest mb-1 pl-1">Province</label>
                                                    <select
                                                        className="w-full p-3 rounded-xl bg-surface-base border border-surface-border text-surface-text outline-none focus:ring-2 focus:ring-sangam-emerald/50 appearance-none"
                                                        value={formData.province}
                                                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                                    >
                                                        <option value="NONE">Select Province</option>
                                                        <option value="KOSHI">Koshi</option>
                                                        <option value="MADHESH">Madhesh</option>
                                                        <option value="BAGMATI">Bagmati</option>
                                                        <option value="GANDAKI">Gandaki</option>
                                                        <option value="LUMBINI">Lumbini</option>
                                                        <option value="KARNALI">Karnali</option>
                                                        <option value="SUDURPASHCHIM">Sudurpashchim</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-surface-text-muted uppercase tracking-widest mb-1 pl-1">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        className="w-full p-3 rounded-xl bg-surface-base border border-surface-border text-surface-text outline-none focus:ring-2 focus:ring-sangam-emerald/50"
                                                        placeholder="+977-98XXXXXXXX"
                                                        value={formData.phone_number}
                                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-surface-text-muted uppercase tracking-widest mb-1 pl-1">LinkedIn Profile</label>
                                                <input
                                                    type="url"
                                                    className="w-full p-3 rounded-xl bg-surface-base border border-surface-border text-surface-text outline-none focus:ring-2 focus:ring-sangam-emerald/50"
                                                    placeholder="https://linkedin.com/in/username"
                                                    value={formData.linkedin_profile}
                                                    onChange={(e) => setFormData({ ...formData, linkedin_profile: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-surface-text-muted uppercase tracking-widest mb-1 pl-1">Bio</label>
                                                <textarea
                                                    className="w-full p-3 rounded-xl bg-surface-base border border-surface-border text-surface-text outline-none focus:ring-2 focus:ring-sangam-emerald/50 h-32 resize-none"
                                                    placeholder="Tell the ecosystem about your mission..."
                                                    value={formData.bio}
                                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                />
                                            </div>
                                            <button className="bg-sangam-emerald text-white px-8 py-3 rounded-xl font-bold hover:bg-sangam-emerald-dark transition-colors shadow-lg shadow-sangam-emerald/20">
                                                Save Changes
                                            </button>
                                        </form>
                                        {status.message && (
                                            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                                <span>{status.message}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-surface-text mb-2">Security Settings</h3>
                                            <p className="text-sm text-surface-text-muted">Keep your account protected with advanced security options.</p>
                                        </div>
                                        <div className="divide-y divide-surface-border">
                                            <div className="py-6 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-xl">
                                                        <Key size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-surface-text">Account Password</p>
                                                        <p className="text-xs text-surface-text-muted">Manage your security barrier</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setIsPasswordModalOpen(true)}
                                                    className="px-6 py-2 border border-surface-border rounded-xl font-bold text-surface-text hover:bg-surface-base transition-colors"
                                                >
                                                    Modify
                                                </button>
                                            </div>
                                            <div className="py-6 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl">
                                                        <Shield size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-surface-text">Two-Factor Authentication</p>
                                                        <p className="text-xs text-surface-text-muted">Add an extra layer of security</p>
                                                    </div>
                                                </div>
                                                <button className="px-6 py-2 bg-surface-base rounded-xl font-bold text-surface-text-muted cursor-not-allowed">
                                                    Coming Soon
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'privacy' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-surface-text mb-2">Privacy Controls</h3>
                                            <p className="text-sm text-surface-text-muted">Control who can see your profile and data participation.</p>
                                        </div>
                                        <div className="space-y-6">
                                            <PrivacyToggle title="Public Profile" desc="Allow other visionaries to find you in the directory." active={true} />
                                            <PrivacyToggle title="Ecosystem Sharing" desc="Anonymously share Karma trends to help Nepal's Growth Ledger." active={true} />
                                            <PrivacyToggle title="Direct Messaging" desc="Allow matched co-founders to message you directly." active={false} />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reports' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-surface-text mb-2">Ecosystem Reports</h3>
                                            <p className="text-sm text-surface-text-muted">Access your historical data, participation logs, and growth reports.</p>
                                        </div>
                                        <div className="p-12 border-2 border-dashed border-surface-border rounded-3xl text-center">
                                            <FileText size={48} className="mx-auto text-surface-text-muted opacity-20 mb-4" />
                                            <p className="text-surface-text-muted font-medium">No reports generated yet.</p>
                                            <p className="text-[10px] text-surface-text-muted mt-1 uppercase tracking-widest font-bold">REPORTS ARE CREATED SUNDAY NIGHTS</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sangam-emerald opacity-[0.03] rounded-full blur-3xl -mr-32 -mt-32"></div>
                    </main>
                </div>
            </div>

            <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
        </div>
    );
};

const PrivacyToggle = ({ title, desc, active }) => {
    const [enabled, setEnabled] = useState(active);
    return (
        <div className="flex items-center justify-between">
            <div className="max-w-xs">
                <p className="font-bold text-surface-text">{title}</p>
                <p className="text-xs text-surface-text-muted">{desc}</p>
            </div>
            <button
                onClick={() => setEnabled(!enabled)}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex ${enabled ? 'bg-sangam-emerald justify-end' : 'bg-surface-border justify-start'}`}
            >
                <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
        </div>
    );
};

export default SecurityPage;
