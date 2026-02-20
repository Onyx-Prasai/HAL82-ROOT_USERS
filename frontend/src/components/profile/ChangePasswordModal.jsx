import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.new_password !== formData.confirm_password) {
            setStatus({ type: 'error', message: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await api.post('/users/change-password/', {
                old_password: formData.old_password,
                new_password: formData.new_password
            });
            setStatus({ type: 'success', message: 'Password updated successfully!' });
            setTimeout(() => {
                onClose();
                setFormData({ old_password: '', new_password: '', confirm_password: '' });
                setStatus({ type: '', message: '' });
            }, 2000);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.error || 'Failed to update password'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-3 text-sangam-emerald">
                                    <Shield size={24} />
                                    <h3 className="text-xl font-bold dark:text-white">Security</h3>
                                </div>
                                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-sangam-emerald/50 transition-all"
                                        value={formData.old_password}
                                        onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-sangam-emerald/50 transition-all"
                                        value={formData.new_password}
                                        onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-sangam-emerald/50 transition-all"
                                        value={formData.confirm_password}
                                        onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                    />
                                </div>

                                {status.message && (
                                    <div className={`flex items-center space-x-2 p-3 rounded-xl text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                        <span>{status.message}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-sangam-emerald text-white py-4 rounded-xl font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-900/10 disabled:opacity-50"
                                >
                                    {loading ? 'Updating...' : 'Change Password'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ChangePasswordModal;
