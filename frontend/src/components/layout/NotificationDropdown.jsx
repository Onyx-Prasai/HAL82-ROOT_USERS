import React, { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import api from '../../services/api';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const fetchNotifications = async () => {
        try {
            const [listRes, countRes] = await Promise.all([
                api.get('/core/notifications/'),
                api.get('/core/notifications/unread-count/')
            ]);
            setNotifications(listRes.data || []);
            setUnreadCount(countRes.data?.count ?? 0);
        } catch (err) {
            console.error('Error fetching notifications', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.post(`/core/notifications/${id}/read/`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await api.post('/core/notifications/read-all/');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="relative flex items-center justify-center p-2 rounded-full hover:bg-surface-base transition-colors text-surface-text"
            >
                <Bell size={22} className="stroke-[2.5px]" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-surface-card border border-surface-border rounded-2xl shadow-xl z-50">
                    <div className="flex items-center justify-between p-4 border-b border-surface-border">
                        <h3 className="font-bold text-surface-text">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-sangam-emerald font-bold hover:underline">
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="divide-y divide-surface-border">
                        {notifications.length === 0 ? (
                            <p className="p-6 text-surface-text-muted text-sm text-center">No notifications yet</p>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.read && markAsRead(n.id)}
                                    className={`p-4 hover:bg-surface-base cursor-pointer transition-colors ${!n.read ? 'bg-sangam-emerald/5' : ''}`}
                                >
                                    <p className={`font-bold text-sm ${!n.read ? 'text-surface-text' : 'text-surface-text-muted'}`}>{n.title}</p>
                                    <p className="text-xs text-surface-text-muted mt-1">{n.message}</p>
                                    <p className="text-[10px] text-surface-text-muted/70 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
