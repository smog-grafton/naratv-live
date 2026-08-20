'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send, User } from 'lucide-react';
import { addChatMessage, ChatMessage, getChatMessages, getStoredToken } from '@/services/home';

export default function ChatTab({ broadcastId }: { broadcastId: number | string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = getStoredToken();

  useEffect(() => { getChatMessages(broadcastId).then(setMessages).catch((err) => setError(err instanceof Error ? err.message : 'Chat could not be loaded.')); }, [broadcastId]);
  useEffect(() => { if (!isPaused) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [isPaused, messages]);

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newMessage.trim() || !token) return;
    addChatMessage(broadcastId, newMessage.trim(), token).then((message) => { setMessages((current) => [...current, message]); setNewMessage(''); }).catch((err) => setError(err instanceof Error ? err.message : 'Message could not be sent.'));
  };

  return (
    <div className="relative flex h-[500px] flex-col rounded-sm border border-white/5 bg-[#07111F]">
      <div className="flex items-center justify-between border-b border-white/5 bg-[#0F1B2D] p-4"><h3 className="text-sm font-bold uppercase tracking-wider text-white">Live Chat</h3><span className="text-xs font-bold uppercase text-gray-400"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-600" />Live</span></div>
      {error && <p className="border-b border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">{error}</p>}
      <div className="flex-1 space-y-4 overflow-y-auto p-4" onScroll={(event) => { const target = event.currentTarget; setIsPaused(target.scrollHeight - target.scrollTop - target.clientHeight >= 10); }}>
        {messages.length === 0 && !error ? <p className="text-sm text-gray-500">No live messages yet.</p> : messages.map((message) => <div key={message.id} className="flex items-start gap-3 text-sm"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white"><User className="h-3 w-3" /></div><div className="leading-snug"><div className="flex items-baseline gap-2"><span className="font-bold text-gray-300">{message.user?.name || 'NaraTV viewer'}</span><span className="font-mono text-[10px] text-gray-600">{message.created_at ? new Date(message.created_at).toLocaleTimeString() : ''}</span></div><p className="break-words text-gray-300">{message.body}</p></div></div>)}
        <div ref={messagesEndRef} />
      </div>
      {token ? <form onSubmit={handleSend} className="flex gap-2 border-t border-white/5 bg-[#0F1B2D] p-3"><input type="text" placeholder="Chat publicly..." value={newMessage} onChange={(event) => setNewMessage(event.target.value)} className="flex-1 rounded-sm border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-[#45E3FF] focus:outline-none" /><button type="submit" disabled={!newMessage.trim()} className="flex items-center justify-center rounded-sm bg-[#45E3FF] px-4 py-2 text-black disabled:bg-white/10 disabled:text-gray-500"><Send className="h-4 w-4" /></button></form> : <p className="border-t border-white/5 bg-[#0F1B2D] p-3 text-center text-xs text-gray-400">Sign in to connect to live chat.</p>}
    </div>
  );
}
