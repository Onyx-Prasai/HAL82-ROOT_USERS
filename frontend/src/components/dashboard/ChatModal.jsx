import React, { useEffect, useRef, useState } from 'react';
import api from '../../services/api';

const ChatModal = ({ receiver, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/core/chat/history/${receiver.id}/`);
        setMessages(res.data);
      } catch (e) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [receiver.id]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const wsHost = '127.0.0.1:8000';
    const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsScheme}://${wsHost}/ws/chat/${receiver.id}/${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    const ws = new window.WebSocket(wsUrl);
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // Only add incoming messages from the other person; our own sent messages are added optimistically
      if (data.sender_id === receiver.id) {
        setMessages((prev) => [...prev, {
          id: data.id,
          sender: data.sender_id,
          receiver: data.receiver_id,
          content: data.message,
          timestamp: data.timestamp,
        }]);
      }
    };
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, [receiver.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !socket) return;
    setSending(true);
    // Show message immediately (optimistic update)
    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      sender: 0, // "me" – not receiver.id so it renders on the right
      receiver: receiver.id,
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setInput('');
    setSending(false);
    socket.send(JSON.stringify({ message: text }));
    try {
      await api.post(`/core/chat/mark-as-read/${receiver.id}/`);
    } catch (_) {}
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSend(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-md flex flex-col h-[70vh] border border-surface-border" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-surface-border">
          <div className="font-bold text-lg text-surface-text">{receiver.username}</div>
          <button onClick={onClose} className="text-surface-text-muted hover:text-surface-text text-2xl leading-none">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-surface-base">
          {loading ? (
            <div className="text-center text-surface-text-muted">Loading...</div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex flex-col ${msg.sender === receiver.id ? 'items-start' : 'items-end'}`}
              >
                <div className={`px-3 py-2 rounded-lg max-w-xs text-sm ${msg.sender === receiver.id ? 'bg-surface-card text-surface-text border border-surface-border' : 'bg-sangam-emerald text-white'}`}>
                  {msg.content}
                </div>
                <span className="text-xs text-surface-text-muted mt-1">{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="p-4 border-t border-surface-border flex gap-2">
          <input
            type="text"
            className="flex-1 border border-surface-border rounded-lg px-3 py-2 text-sm text-surface-text bg-surface-base focus:outline-none focus:ring-2 focus:ring-sangam-emerald"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={sending}
            required
          />
          <button type="submit" className="bg-sangam-emerald text-white px-4 py-2 rounded-lg font-bold" disabled={sending || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
