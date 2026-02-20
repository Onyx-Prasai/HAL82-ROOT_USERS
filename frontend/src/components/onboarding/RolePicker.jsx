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
<<<<<<< HEAD
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
=======
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-8"
>>>>>>> 0f8de59bed2041a708d9c5eb6c73e6bf04c9c8a3
                        >
                            <div className="text-center">
                                <h2 className="text-5xl md:text-6xl font-bold mb-4">Pick Your Role</h2>
                                <p className="text-lg text-gray-500">How do you fit into the SANGAM ecosystem?</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelection({ ...selection, role: role.id })}
                                        className={`p-8 rounded-2xl border-2 text-left transition-all hover:shadow-lg ${selection.role === role.id
                                                ? 'border-sangam-emerald bg-emerald-50 shadow-md'
                                                : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className={`mb-6 text-3xl ${selection.role === role.id ? 'text-sangam-emerald' : 'text-gray-400'}`}>
                                            {role.icon}
                                        </div>
                                        <h3 className="font-bold text-xl mb-2">{role.title}</h3>
                                        <p className="text-base text-gray-500">{role.desc}</p>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleNext}
                                className="w-full bg-sangam-slate text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-all"
                            >
                                <span>Continue</span>
                                <ArrowRight size={20} />
                            </button>
                        </motion.div>
                    )}

<<<<<<< HEAD
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
=======
                    {step === 2 && selection.role === 'FOUNDER' && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="text-center">
                                <h2 className="text-5xl md:text-6xl font-bold mb-4">What's Your Persona?</h2>
                                <p className="text-lg text-gray-500">Every founder has a superpower.</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                {personas.map((persona) => (
                                    <button
                                        key={persona.id}
                                        onClick={() => setSelection({ ...selection, persona: persona.id })}
                                        className={`p-8 rounded-2xl border-2 text-left flex items-center justify-between transition-all hover:shadow-lg ${selection.persona === persona.id
                                                ? 'border-sangam-emerald bg-emerald-50 shadow-md'
                                                : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        <div>
                                            <h3 className="font-bold text-xl mb-1">{persona.title}</h3>
                                            <p className="text-base text-gray-500">{persona.desc}</p>
                                        </div>
                                        {selection.persona === persona.id && <CheckCircle className="text-sangam-emerald flex-shrink-0 ml-4" size={28} />}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handleBack} className="flex-1 border border-gray-200 py-4 px-6 rounded-xl font-semibold text-lg text-gray-600 hover:bg-gray-50 transition-all">Back</button>
                                <button onClick={handleNext} className="flex-[2] bg-sangam-slate text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-all">Continue</button>
                            </div>
                        </motion.div>
                    )}
>>>>>>> 0f8de59bed2041a708d9c5eb6c73e6bf04c9c8a3

                {(step === 3 || (step === 2 && selection.role !== 'FOUNDER')) && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col gap-8"
                    >
<<<<<<< HEAD
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-surface-text">Final Details</h2>
                            <p className="text-surface-text-muted">Help us verify and personalize your experience.</p>
=======
                        <div className="text-center">
                            <h2 className="text-5xl md:text-6xl font-bold mb-4">Final Details</h2>
                            <p className="text-lg text-gray-500">Help us verify and personalize your experience.</p>
>>>>>>> 0f8de59bed2041a708d9c5eb6c73e6bf04c9c8a3
                        </div>
                        <div className="flex flex-col gap-6">
                            <div>
<<<<<<< HEAD
                                <label className="block text-sm font-medium text-surface-text-muted mb-1">Nagarik App ID or LinkedIn</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-surface-text outline-none focus:ring-2 focus:ring-sangam-emerald"
=======
                                <label className="block text-base font-medium text-gray-700 mb-3">Nagarik App ID or LinkedIn</label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-sangam-emerald text-base"
>>>>>>> 0f8de59bed2041a708d9c5eb6c73e6bf04c9c8a3
                                    value={selection.nagarik_id}
                                    onChange={(e) => setSelection({ ...selection, nagarik_id: e.target.value })}
                                    placeholder="ID or Profile Link"
                                />
                            </div>
                            {selection.role === 'FOUNDER' && (
                                <div>
<<<<<<< HEAD
                                    <label className="block text-sm font-medium text-surface-text-muted mb-1">Startup Stage</label>
                                    <div className="grid grid-cols-3 gap-2">
=======
                                    <label className="block text-base font-medium text-gray-700 mb-3">Startup Stage</label>
                                    <div className="grid grid-cols-3 gap-4">
>>>>>>> 0f8de59bed2041a708d9c5eb6c73e6bf04c9c8a3
                                        {stages.map((stage) => (
                                            <button
                                                key={stage}
                                                onClick={() => setSelection({ ...selection, startup_stage: stage })}
<<<<<<< HEAD
                                                className={`py-2 rounded-lg border ${selection.startup_stage === stage ? 'bg-sangam-emerald text-white border-sangam-emerald' : 'bg-surface-card text-surface-text border-surface-border'
=======
                                                className={`py-3 px-4 rounded-lg border font-semibold text-base transition-all ${selection.startup_stage === stage ? 'bg-sangam-slate text-white border-sangam-slate' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
>>>>>>> 0f8de59bed2041a708d9c5eb6c73e6bf04c9c8a3
                                                    }`}
                                            >
                                                {stage}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
<<<<<<< HEAD
                        <div className="flex space-x-4 mt-8">
                            <button onClick={handleBack} className="flex-1 border border-surface-border py-4 rounded-xl font-semibold text-surface-text-muted hover:bg-surface-base transition-colors">Back</button>
                            <button onClick={handleSubmit} className="flex-[2] bg-sangam-emerald text-white py-4 rounded-xl font-semibold hover:bg-sangam-emerald-dark transition-colors">Complete Onboarding</button>
=======
                        <div className="flex gap-4">
                            <button onClick={handleBack} className="flex-1 border border-gray-200 py-4 px-6 rounded-xl font-semibold text-lg text-gray-600 hover:bg-gray-50 transition-all">Back</button>
                            <button onClick={handleSubmit} className="flex-[2] bg-sangam-emerald text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-all">Complete Onboarding</button>
>>>>>>> 0f8de59bed2041a708d9c5eb6c73e6bf04c9c8a3
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </div>
    );
};

export default RolePicker;
