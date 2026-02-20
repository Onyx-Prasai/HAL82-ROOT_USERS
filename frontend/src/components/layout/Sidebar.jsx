import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Shield, LogOut, LayoutDashboard, Settings, UserPlus, LogIn, Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

const Sidebar = ({ isOpen, onClose }) => {
    const { darkMode, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);
    const isAuthenticated = !!localStorage.getItem('access_token');

    useEffect(() => {
        if (isOpen && isAuthenticated) {
            fetchProfile();
        }
    }, [isOpen, isAuthenticated]);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile/');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-80 bg-surface-card shadow-2xl z-[70] p-6 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-surface-text">Drishti</h3>
                            <button onClick={onClose} className="p-2 hover:bg-surface-base rounded-full transition-colors">
                                <X size={24} className="text-surface-text-muted" />
                            </button>
                        </div>

                        {/* Profile Section */}
                        {isAuthenticated && user ? (
                            <div className="mb-8 p-4 bg-surface-base rounded-3xl border border-surface-border">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-sangam-emerald rounded-2xl flex items-center justify-center text-white font-bold text-xl uppercase">
                                        {user.username[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-surface-text">{user.username}</p>
                                        <span className="text-[10px] bg-sangam-emerald/10 text-sangam-emerald px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                            {user.persona}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-sangam-emerald">
                                    <Award size={16} />
                                    <span className="text-sm font-bold">Karma: {user.karma_score}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-8 p-4 bg-surface-base rounded-3xl border border-dashed border-surface-border text-center">
                                <p className="text-sm text-surface-text-muted mb-4">Join the forge to start your journey</p>
                                <div className="flex gap-2">
                                    <button onClick={() => window.location.href = '/login'} className="flex-1 py-2 bg-sangam-emerald text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-sangam-emerald-dark transition-colors shadow-sm">
                                        <LogIn size={14} /> Login
                                    </button>
                                    <button onClick={() => window.location.href = '/login'} className="flex-1 py-2 border border-surface-border text-surface-text text-xs font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-surface-base transition-colors">
                                        <UserPlus size={14} /> Signup
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex-1 space-y-2">
                            {isAuthenticated && (
                                <>
                                    <button onClick={() => { onClose(); window.location.href = '/dashboard'; }} className="w-full flex items-center space-x-3 p-3 hover:bg-surface-base rounded-2xl transition-colors text-surface-text font-medium">
                                        <LayoutDashboard size={20} className="text-sangam-emerald" />
                                        <span>My Dashboard</span>
                                    </button>
                                    <button className="w-full flex items-center space-x-3 p-3 hover:bg-surface-base rounded-2xl transition-colors text-surface-text font-medium">
                                        <Settings size={20} className="text-sangam-emerald" />
                                        <span>Settings</span>
                                    </button>
                                    <button
                                        onClick={() => { onClose(); window.location.href = '/security'; }}
                                        className="w-full flex items-center space-x-3 p-3 hover:bg-surface-base rounded-3xl transition-colors text-surface-text font-medium group"
                                    >
                                        <div className="p-2 bg-sangam-emerald/10 text-sangam-emerald rounded-xl group-hover:bg-sangam-emerald group-hover:text-white transition-colors">
                                            <Shield size={20} />
                                        </div>
                                        <span>Security Hub</span>
                                    </button>
                                </>
                            )}

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="w-full flex justify-between items-center p-3 hover:bg-surface-base rounded-2xl transition-colors text-surface-text font-medium"
                            >
                                <div className="flex items-center space-x-3">
                                    {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-blue-500" />}
                                    <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
                                </div>
                                <div className={`w-10 h-5 rounded-full p-1 transition-colors ${darkMode ? 'bg-sangam-emerald' : 'bg-surface-border'}`}>
                                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </button>
                        </div>

                        {/* Footer */}
                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="mt-auto flex items-center justify-center space-x-2 p-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all font-bold"
                            >
                                <LogOut size={20} />
                                <span>Sign Out</span>
                            </button>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;
