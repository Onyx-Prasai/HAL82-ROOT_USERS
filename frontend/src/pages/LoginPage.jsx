import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';
import api from '../services/api';
import logo from '../assets/logo.png';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            if (isLogin) {
                if (!formData.username || !formData.password) {
                    setError('Please enter username and password');
                    setLoading(false);
                    return;
                }
                
                const response = await api.post('/users/login/', {
                    username: formData.username,
                    password: formData.password
                });
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                window.location.href = '/dashboard';
            } else {
                if (!formData.username || !formData.email || !formData.password) {
                    setError('Please fill in all fields');
                    setLoading(false);
                    return;
                }
                
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
            
            let errorMessage = 'Authentication failed. Please check your credentials.';
            
            if (error.response) {
                // Server responded with error status
                if (error.response.data) {
                    // Check for specific error messages from backend
                    if (typeof error.response.data === 'object') {
                        // Check for common error field names
                        if (error.response.data.detail) {
                            errorMessage = error.response.data.detail;
                        } else if (error.response.data.error) {
                            errorMessage = error.response.data.error;
                        } else if (error.response.data.message) {
                            errorMessage = error.response.data.message;
                        } else if (error.response.data.non_field_errors) {
                            errorMessage = error.response.data.non_field_errors[0];
                        } else if (error.response.data.username) {
                            errorMessage = `Username: ${error.response.data.username}`;
                        } else if (error.response.data.email) {
                            errorMessage = `Email: ${error.response.data.email}`;
                        } else if (error.response.data.password) {
                            errorMessage = `Password: ${error.response.data.password}`;
                        }
                    }
                }
                
                if (error.response.status === 401) {
                    errorMessage = 'Invalid username or password';
                } else if (error.response.status === 400) {
                    errorMessage = errorMessage || 'Invalid input. Please check your information';
                }
            } else if (error.request) {
                // Request made but no response
                errorMessage = 'Unable to connect to server. Please check if the backend is running.';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-surface-base selection:bg-sangam-emerald/30 overflow-hidden transition-colors duration-300">
            {/* Left Side: Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-surface-border bg-surface-card">
                <div className="absolute inset-0 bg-gradient-to-br from-surface-base to-surface-card dark:from-sangam-slate dark:to-black opacity-80"></div>

                <div className="relative z-10 w-full flex flex-col items-center justify-center p-12 text-surface-text">
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

                    <p className="text-xl text-surface-text-muted text-center max-w-md leading-relaxed">
                        The Confluence of Visionaries. Empowering Nepal's next generation of entrepreneurs, investors, and experts.
                    </p>

                    <div className="mt-12 grid grid-cols-3 gap-8 text-center">
                        <div>
                            <p className="text-3xl font-bold text-sangam-emerald">500+</p>
                            <p className="text-sm text-surface-text-muted font-medium tracking-widest uppercase">Startups</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-sangam-emerald">$10M+</p>
                            <p className="text-sm text-surface-text-muted font-medium tracking-widest uppercase">Invested</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-sangam-emerald">1.2K</p>
                            <p className="text-sm text-surface-text-muted font-medium tracking-widest uppercase">Matches</p>
                        </div>
                    </div>
                </div>

                {/* Ambient Glows */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-sangam-emerald opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-sangam-emerald opacity-10 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-base relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md space-y-8 z-10"
                >
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-surface-text tracking-tight">
                            {isLogin ? 'Welcome Back' : 'Join the Ecosystem'}
                        </h2>
                        <p className="mt-2 text-surface-text-muted">
                            {isLogin ? 'Enter your details to access your dashboard' : 'Create an account to start your journey'}
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-text-muted mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-surface-text focus:ring-2 focus:ring-sangam-emerald focus:border-transparent transition-all outline-none placeholder:text-surface-text-muted/50"
                                    placeholder="john_doe"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-surface-text-muted mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-surface-text focus:ring-2 focus:ring-sangam-emerald focus:border-transparent transition-all outline-none placeholder:text-surface-text-muted/50"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-surface-text-muted mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-surface-text focus:ring-2 focus:ring-sangam-emerald focus:border-transparent transition-all outline-none placeholder:text-surface-text-muted/50"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sangam-emerald text-surface-card py-4 rounded-xl font-black flex items-center justify-center space-x-2 hover:bg-sangam-emerald-light transition-colors shadow-lg shadow-sangam-emerald/20 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}</span>
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="text-center border-t border-surface-border pt-8">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm font-bold text-sangam-emerald hover:text-sangam-emerald-light transition-colors uppercase tracking-widest"
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
