import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';
import api from '../services/api';
import logo from '../assets/logo.png';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const response = await api.post('/users/login/', {
                    username: formData.username,
                    password: formData.password
                });
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                window.location.href = '/dashboard';
            } else {
                await api.post('/users/register/', formData);
                const loginResponse = await api.post('/users/login/', {
                    username: formData.username,
                    password: formData.password
                });
                localStorage.setItem('access_token', loginResponse.data.access);
                localStorage.setItem('refresh_token', loginResponse.data.refresh);
                window.location.href = '/onboarding';
            }
        } catch (error) {
            console.error('Authentication error:', error);
            alert('Authentication failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex min-h-screen bg-sangam-slate selection:bg-sangam-emerald/30 overflow-hidden">
            {/* Left Side: Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-slate-800 bg-black">
                <div className="absolute inset-0 bg-gradient-to-br from-sangam-slate to-black opacity-80"></div>

                <div className="relative z-10 w-full flex flex-col items-center justify-center p-12 text-white">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <img src={logo} alt="SANGAM Logo" className="w-64 h-64 object-contain drop-shadow-2xl mix-blend-multiply filter brightness-110" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-5xl font-black mb-4 tracking-[0.2em] text-center"
                    >
                        SANGAM
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-200 text-center max-w-md leading-relaxed"
                    >
                        The Confluence of Visionaries. Empowering Nepal's next generation of entrepreneurs, investors, and experts.
                    </motion.p>

                    <div className="mt-12 grid grid-cols-3 gap-8 text-center">
                        <div>
                            <p className="text-3xl font-bold text-sangam-emerald">500+</p>
                            <p className="text-sm text-gray-500 font-medium tracking-widest uppercase">Startups</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-sangam-emerald">$10M+</p>
                            <p className="text-sm text-gray-500 font-medium tracking-widest uppercase">Invested</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-sangam-emerald">1.2K</p>
                            <p className="text-sm text-gray-500 font-medium tracking-widest uppercase">Matches</p>
                        </div>
                    </div>
                </div>

                {/* Ambient Glows */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-sangam-emerald opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-sangam-emerald opacity-10 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-sangam-slate relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md space-y-8 z-10"
                >
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            {isLogin ? 'Welcome Back' : 'Join the Ecosystem'}
                        </h2>
                        <p className="mt-2 text-gray-400">
                            {isLogin ? 'Enter your details to access your dashboard' : 'Create an account to start your journey'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white focus:ring-2 focus:ring-sangam-emerald focus:border-transparent transition-all outline-none placeholder:text-slate-600"
                                    placeholder="john_doe"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white focus:ring-2 focus:ring-sangam-emerald focus:border-transparent transition-all outline-none placeholder:text-slate-600"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white focus:ring-2 focus:ring-sangam-emerald focus:border-transparent transition-all outline-none placeholder:text-slate-600"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-sangam-emerald text-sangam-slate py-4 rounded-xl font-black flex items-center justify-center space-x-2 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/20 uppercase tracking-widest"
                        >
                            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="text-center border-t border-slate-800 pt-8">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm font-bold text-sangam-emerald hover:text-emerald-400 transition-colors uppercase tracking-widest"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </motion.div>

                {/* Background Decor */}
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-sangam-emerald opacity-5 rounded-full blur-[120px]"></div>
            </div>
        </div>
    );
};

export default LoginPage;
