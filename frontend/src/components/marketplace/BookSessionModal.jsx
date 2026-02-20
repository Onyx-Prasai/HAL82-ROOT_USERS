import React, { useEffect, useState } from 'react';
import { X, Mail, Phone } from 'lucide-react';
import api from '../../services/api';

const BookSessionModal = ({ expert, onClose }) => {
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState('intro'); // 'intro' | 'paid'
    const [amount, setAmount] = useState('');
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await api.get(`/core/experts/${expert.id}/contact/`);
                setContact(res.data);
                setAmount(res.data?.hourly_rate || '');
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load expert details.');
            } finally {
                setLoading(false);
            }
        };
        fetchContact();
    }, [expert.id]);

    const handleFreeIntro = async () => {
        try {
            const res = await api.post(`/core/bookings/create/${expert.id}/`, { amount: 0 });
            setBooking(res.data);
            setStep('success-free');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to book.');
        }
    };

    const handlePaidBooking = async () => {
        const amt = parseFloat(amount);
        if (isNaN(amt) || amt < 0) {
            setError('Enter a valid amount.');
            return;
        }
        try {
            const res = await api.post(`/core/bookings/create/${expert.id}/`, { amount: amt });
            setBooking(res.data);
            setStep('success-paid');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to book.');
        }
    };

    if (!expert) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-surface-border mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-surface-border">
                    <h3 className="font-bold text-lg text-surface-text">Book Session with {expert.username}</h3>
                    <button onClick={onClose} className="text-surface-text-muted hover:text-surface-text text-2xl leading-none">&times;</button>
                </div>

                <div className="p-6 space-y-4">
                    {loading ? (
                        <div className="text-center text-surface-text-muted py-8">Loading...</div>
                    ) : error ? (
                        <p className="text-red-500 text-sm">{error}</p>
                    ) : step === 'intro' ? (
                        <>
                            <p className="text-sm text-surface-text-muted">
                                Your first session is <strong className="text-sangam-emerald">free</strong>. You'll receive the expert's contact details to connect directly.
                            </p>
                            <div className="bg-surface-base rounded-xl p-4 space-y-2 border border-surface-border">
                                <p className="text-sm font-bold text-surface-text">{contact?.specialization}</p>
                                <p className="text-xs text-surface-text-muted">{contact?.bio}</p>
                                <p className="text-sm text-surface-text">${contact?.hourly_rate}/hr for paid sessions</p>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={handleFreeIntro}
                                    className="w-full bg-sangam-emerald text-white py-3 rounded-xl font-bold hover:bg-sangam-emerald-dark transition-colors"
                                >
                                    Book Free Intro Session
                                </button>
                                <button
                                    onClick={() => setStep('paid')}
                                    className="w-full border border-surface-border py-3 rounded-xl font-bold text-surface-text hover:bg-surface-base transition-colors"
                                >
                                    Skip to Paid Session
                                </button>
                            </div>
                        </>
                    ) : step === 'paid' ? (
                        <>
                            <p className="text-sm text-surface-text-muted">Book a paid session to work with this expert.</p>
                            <div>
                                <label className="block text-sm font-bold text-surface-text mb-2">Amount ($)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    className="w-full border border-surface-border rounded-lg px-3 py-2 text-surface-text bg-surface-base focus:outline-none focus:ring-2 focus:ring-sangam-emerald"
                                    placeholder={contact?.hourly_rate || '0'}
                                />
                            </div>
                            <button
                                onClick={handlePaidBooking}
                                className="w-full bg-sangam-emerald text-white py-3 rounded-xl font-bold hover:bg-sangam-emerald-dark transition-colors"
                            >
                                Book Paid Session
                            </button>
                            <button onClick={() => setStep('intro')} className="text-sm text-sangam-emerald font-bold hover:underline">
                                ← Back to free intro
                            </button>
                        </>
                    ) : step === 'success-free' ? (
                        <>
                            <p className="text-sangam-emerald font-bold">Free intro session booked!</p>
                            <p className="text-sm text-surface-text-muted">Here are the expert's contact details. Reach out to schedule your session.</p>
                            <div className="bg-surface-base rounded-xl p-4 space-y-3 border border-surface-border">
                                <div className="flex items-center gap-2">
                                    <Mail size={18} className="text-sangam-emerald flex-shrink-0" />
                                    <a href={`mailto:${contact?.email}`} className="text-sm text-sangam-emerald hover:underline break-all">{contact?.email}</a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={18} className="text-sangam-emerald flex-shrink-0" />
                                    <span className="text-sm text-surface-text">{contact?.phone_number || 'Not shared'}</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-full border border-surface-border py-3 rounded-xl font-bold text-surface-text hover:bg-surface-base transition-colors">
                                Done
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-sangam-emerald font-bold">Paid session booked!</p>
                            <p className="text-sm text-surface-text-muted">You can contact the expert to coordinate your session.</p>
                            <div className="bg-surface-base rounded-xl p-4 space-y-3 border border-surface-border">
                                <div className="flex items-center gap-2">
                                    <Mail size={18} className="text-sangam-emerald flex-shrink-0" />
                                    <a href={`mailto:${contact?.email}`} className="text-sm text-sangam-emerald hover:underline break-all">{contact?.email}</a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={18} className="text-sangam-emerald flex-shrink-0" />
                                    <span className="text-sm text-surface-text">{contact?.phone_number || 'Not shared'}</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-full border border-surface-border py-3 rounded-xl font-bold text-surface-text hover:bg-surface-base transition-colors">
                                Done
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookSessionModal;
