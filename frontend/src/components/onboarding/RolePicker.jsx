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
        { id: 'FOUNDER', title: 'Founder', desc: 'Building the next big thing', icon: <User size={32} /> },
        { id: 'INVESTOR', title: 'Investor', desc: 'Backing revolutionary ideas', icon: <Briefcase size={32} /> },
        { id: 'EXPERT', title: 'Expert', desc: 'Sharing specialized knowledge', icon: <Microscope size={32} /> },
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
        <div className="min-h-screen flex items-center justify-center bg-surface-base p-8 transition-colors duration-300">
            <div className="w-full max-w-4xl">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col gap-12"
                        >
                            <div className="text-center">
                                <h1 className="text-5xl md:text-7xl font-black text-surface-text tracking-tight mb-4">Pick Your Role</h1>
                                <p className="text-xl text-surface-text-muted">How do you fit into the SANGAM ecosystem?</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelection({ ...selection, role: role.id })}
                                        className={`p-10 rounded-3xl border-2 text-left transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] ${selection.role === role.id
                                            ? 'border-sangam-emerald bg-sangam-emerald/10 shadow-xl shadow-sangam-emerald/10'
                                            : 'border-surface-border bg-surface-card hover:border-surface-text-muted/30'
                                            }`}
                                    >
                                        <div className={`mb-8 p-4 rounded-2xl inline-block ${selection.role === role.id ? 'bg-sangam-emerald text-white' : 'bg-surface-base text-surface-text-muted'}`}>
                                            {role.icon}
                                        </div>
                                        <h3 className="font-black text-2xl text-surface-text mb-2">{role.title}</h3>
                                        <p className="text-surface-text-muted leading-relaxed font-medium">{role.desc}</p>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleNext}
                                className="w-full bg-sangam-emerald text-white py-6 px-8 rounded-2xl font-black text-xl flex items-center justify-center space-x-3 hover:bg-sangam-emerald-dark transition-all shadow-xl shadow-sangam-emerald/20 group"
                            >
                                <span>Continue</span>
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && selection.role === 'FOUNDER' && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col gap-12"
                        >
                            <div className="text-center">
                                <h1 className="text-5xl md:text-7xl font-black text-surface-text tracking-tight mb-4">What's Your Persona?</h1>
                                <p className="text-xl text-surface-text-muted">Every founder has a unique superpower.</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                {personas.map((persona) => (
                                    <button
                                        key={persona.id}
                                        onClick={() => setSelection({ ...selection, persona: persona.id })}
                                        className={`p-8 rounded-3xl border-2 text-left flex items-center justify-between transition-all hover:shadow-xl hover:scale-[1.01] ${selection.persona === persona.id
                                            ? 'border-sangam-emerald bg-sangam-emerald/10 shadow-lg shadow-sangam-emerald/5'
                                            : 'border-surface-border bg-surface-card hover:border-surface-text-muted/30'
                                            }`}
                                    >
                                        <div>
                                            <h3 className="font-black text-2xl text-surface-text mb-1">{persona.title}</h3>
                                            <p className="text-lg text-surface-text-muted font-medium">{persona.desc}</p>
                                        </div>
                                        {selection.persona === persona.id && (
                                            <div className="bg-sangam-emerald text-white p-2 rounded-full">
                                                <CheckCircle size={32} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-6">
                                <button onClick={handleBack} className="flex-1 border-2 border-surface-border py-5 px-8 rounded-2xl font-black text-xl text-surface-text-muted hover:bg-surface-card transition-all">Back</button>
                                <button onClick={handleNext} className="flex-[2] bg-sangam-emerald text-white py-5 px-8 rounded-2xl font-black text-xl hover:bg-sangam-emerald-dark transition-all shadow-xl shadow-sangam-emerald/20">Continue</button>
                            </div>
                        </motion.div>
                    )}

                    {(step === 3 || (step === 2 && selection.role !== 'FOUNDER')) && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col gap-12"
                        >
                            <div className="text-center">
                                <h1 className="text-5xl md:text-7xl font-black text-surface-text tracking-tight mb-4">Final Details</h1>
                                <p className="text-xl text-surface-text-muted">Help us verify and personalize your experience.</p>
                            </div>
                            <div className="flex flex-col gap-8">
                                <div className="space-y-3">
                                    <label className="block text-sm font-black text-surface-text-muted uppercase tracking-widest pl-2">Nagarik App ID or LinkedIn</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-5 rounded-2xl bg-surface-card border-2 border-surface-border text-surface-text outline-none focus:ring-4 focus:ring-sangam-emerald/20 focus:border-sangam-emerald transition-all text-lg font-medium"
                                        value={selection.nagarik_id}
                                        onChange={(e) => setSelection({ ...selection, nagarik_id: e.target.value })}
                                        placeholder="ID or Profile Link"
                                    />
                                </div>
                                {selection.role === 'FOUNDER' && (
                                    <div className="space-y-4">
                                        <label className="block text-sm font-black text-surface-text-muted uppercase tracking-widest pl-2">Startup Stage</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {stages.map((stage) => (
                                                <button
                                                    key={stage}
                                                    onClick={() => setSelection({ ...selection, startup_stage: stage })}
                                                    className={`py-5 rounded-2xl border-2 font-black text-lg transition-all ${selection.startup_stage === stage
                                                        ? 'bg-sangam-emerald text-white border-sangam-emerald shadow-lg shadow-sangam-emerald/20'
                                                        : 'bg-surface-card text-surface-text-muted border-surface-border hover:border-surface-text-muted/30'
                                                        }`}
                                                >
                                                    {stage}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-6">
                                <button onClick={handleBack} className="flex-1 border-2 border-surface-border py-5 px-8 rounded-2xl font-black text-xl text-surface-text-muted hover:bg-surface-card transition-all">Back</button>
                                <button onClick={handleSubmit} className="flex-[2] bg-sangam-emerald text-white py-5 px-8 rounded-2xl font-black text-xl hover:bg-sangam-emerald-dark transition-all shadow-xl shadow-sangam-emerald/20">Complete Onboarding</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RolePicker;
