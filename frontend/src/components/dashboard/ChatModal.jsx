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
    const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsScheme}://${window.location.host}/ws/chat/${receiver.id}/`;
    const ws = new window.WebSocket(wsUrl);
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, {
        sender: data.sender_id,
        receiver: data.receiver_id,
        content: data.message,
        timestamp: data.timestamp,
      }]);
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
    if (!input.trim() || !socket) return;
    setSending(true);
    socket.send(JSON.stringify({ message: input }));
    setInput('');
    setSending(false);
    // Mark as read after sending
    await api.post(`/core/chat/mark-as-read/${receiver.id}/`);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSend(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col h-[70vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-bold text-lg">{receiver.username}</div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === receiver.id ? 'items-start' : 'items-end'}`}
              >
                <div className={`px-3 py-2 rounded-lg max-w-xs text-sm ${msg.sender === receiver.id ? 'bg-white text-gray-800 border' : 'bg-sangam-emerald text-white'}`}>
                  {msg.content}
                </div>
                <span className="text-xs text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
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
