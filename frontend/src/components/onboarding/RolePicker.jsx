import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Microscope, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const RolePicker = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [selection, setSelection] = useState({
        role: 'FOUNDER',
        persona: 'HACKER',
        startup_stage: 'IDEA',
        nagarik_id: '',
        linkedin_profile: '',
    });

    const roles = [
        { id: 'FOUNDER', title: 'Founder', desc: 'Building the next big thing', icon: <User size={24} /> },
        { id: 'INVESTOR', title: 'Investor', desc: 'Backing revolutionary ideas', icon: <Briefcase size={24} /> },
        { id: 'EXPERT', title: 'Expert', desc: 'Sharing specialized knowledge', icon: <Microscope size={24} /> },
    ];

    const personas = [
        { id: 'HACKER', title: 'Hacker', desc: 'The technical mastermind' },
        { id: 'HIPSTER', title: 'Hipster', desc: 'The design and UX visionary' },
        { id: 'HUSTLER', title: 'Hustler', desc: 'The business and sales engine' },
    ];

    const stages = ['IDEA', 'MVP', 'REVENUE'];

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        try {
            await api.patch('/users/profile/', selection);
            onComplete();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-surface-text">Pick Your Role</h2>
                            <p className="text-surface-text-muted">How do you fit into the SANGAM ecosystem?</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelection({ ...selection, role: role.id })}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all ${selection.role === role.id
                                        ? 'border-sangam-emerald bg-sangam-emerald/10 text-sangam-emerald'
                                        : 'border-surface-border bg-surface-card text-surface-text hover:border-surface-text-muted/30'
                                        }`}
                                >
                                    <div className={`mb-4 ${selection.role === role.id ? 'text-sangam-emerald' : 'text-surface-text-muted'}`}>
                                        {role.icon}
                                    </div>
                                    <h3 className="font-bold text-lg">{role.title}</h3>
                                    <p className="text-sm text-surface-text-muted">{role.desc}</p>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleNext}
                            className="w-full mt-8 bg-sangam-emerald text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-sangam-emerald-dark transition-colors"
                        >
                            <span>Continue</span>
                            <ArrowRight size={18} />
                        </button>
                    </motion.div>
                )}

                {step === 2 && selection.role === 'FOUNDER' && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-surface-text">What's Your Persona?</h2>
                            <p className="text-surface-text-muted">Every founder has a superpower.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {personas.map((persona) => (
                                <button
                                    key={persona.id}
                                    onClick={() => setSelection({ ...selection, persona: persona.id })}
                                    className={`p-6 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${selection.persona === persona.id
                                        ? 'border-sangam-emerald bg-sangam-emerald/10 text-sangam-emerald'
                                        : 'border-surface-border bg-surface-card text-surface-text hover:border-surface-text-muted/30'
                                        }`}
                                >
                                    <div>
                                        <h3 className="font-bold text-lg">{persona.title}</h3>
                                        <p className="text-sm text-surface-text-muted">{persona.desc}</p>
                                    </div>
                                    {selection.persona === persona.id && <CheckCircle className="text-sangam-emerald" />}
                                </button>
                            ))}
                        </div>
                        <div className="flex space-x-4 mt-8">
                            <button onClick={handleBack} className="flex-1 border border-slate-200 dark:border-slate-700 py-4 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Back</button>
                            <button onClick={handleNext} className="flex-[2] bg-sangam-slate dark:bg-sangam-emerald text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity">Continue</button>
                        </div>
                    </motion.div>
                )}

                {(step === 3 || (step === 2 && selection.role !== 'FOUNDER')) && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-surface-text">Final Details</h2>
                            <p className="text-surface-text-muted">Help us verify and personalize your experience.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-text-muted mb-1">Nagarik App ID or LinkedIn</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-surface-text outline-none focus:ring-2 focus:ring-sangam-emerald"
                                    value={selection.nagarik_id}
                                    onChange={(e) => setSelection({ ...selection, nagarik_id: e.target.value })}
                                    placeholder="ID or Profile Link"
                                />
                            </div>
                            {selection.role === 'FOUNDER' && (
                                <div>
                                    <label className="block text-sm font-medium text-surface-text-muted mb-1">Startup Stage</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {stages.map((stage) => (
                                            <button
                                                key={stage}
                                                onClick={() => setSelection({ ...selection, startup_stage: stage })}
                                                className={`py-2 rounded-lg border ${selection.startup_stage === stage ? 'bg-sangam-emerald text-white border-sangam-emerald' : 'bg-surface-card text-surface-text border-surface-border'
                                                    }`}
                                            >
                                                {stage}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-4 mt-8">
                            <button onClick={handleBack} className="flex-1 border border-surface-border py-4 rounded-xl font-semibold text-surface-text-muted hover:bg-surface-base transition-colors">Back</button>
                            <button onClick={handleSubmit} className="flex-[2] bg-sangam-emerald text-white py-4 rounded-xl font-semibold hover:bg-sangam-emerald-dark transition-colors">Complete Onboarding</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RolePicker;
