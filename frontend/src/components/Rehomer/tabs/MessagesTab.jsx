import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Send, ChevronLeft, Dog, Clock, CheckCheck, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from '../../Shared/ConfirmDeleteModal';

const API      = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');
const token    = () => localStorage.getItem('token');

const apiFetch = async (method, url, body = null) => {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

const imgSrc = (url) => {
  if (!url || url === 'default-profile.jpg') return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

const Avatar = ({ name, url, size = 'md' }) => {
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  return (
    <div className={`${sz} rounded-full bg-gradient-to-r from-[#085558] to-[#008737] flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden`}>
      {imgSrc(url)
        ? <img src={imgSrc(url)} alt={name} className="w-full h-full object-cover" />
        : name?.charAt(0)?.toUpperCase() || '?'}
    </div>
  );
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString();
};

const MessagesTab = ({ user }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConvo,   setActiveConvo]   = useState(null);
  const [messages,      setMessages]      = useState([]);
  const [newMsg,        setNewMsg]        = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMsgs,   setLoadingMsgs]  = useState(false);
  const [sending,       setSending]       = useState(false);
  const [mobileView,    setMobileView]    = useState('list');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const bottomRef = useRef(null);
  const pollRef   = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await apiFetch('GET', '/messages');
      setConversations(data.data || []);
    } catch {}
    finally { setLoadingConvos(false); }
  }, []);

  const fetchMessages = useCallback(async (convoId) => {
    if (!convoId) return;
    setLoadingMsgs(true);
    try {
      const data = await apiFetch('GET', `/messages/${convoId}/messages`);
      setMessages(data.data || []);
    } catch {}
    finally { setLoadingMsgs(false); }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    if (!activeConvo) return;
    pollRef.current = setInterval(() => {
      fetchMessages(activeConvo._id);
      fetchConversations();
    }, 5000);
    return () => clearInterval(pollRef.current);
  }, [activeConvo, fetchMessages, fetchConversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const openConvo = (convo) => {
    setActiveConvo(convo);
    setMessages([]);
    fetchMessages(convo._id);
    setMobileView('chat');
    setConversations(prev =>
      prev.map(c => c._id === convo._id ? { ...c, unreadRehomer: 0 } : c)
    );
  };

  const handleSend = async () => {
    if (!newMsg.trim() || !activeConvo || sending) return;
    setSending(true);
    const uid = user?._id || user?.id;
    const optimistic = {
      _id: `temp-${Date.now()}`, text: newMsg.trim(),
      sender: { _id: uid, name: user?.name },
      senderRole: 'rehomer', createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    const msgText = newMsg.trim();
    setNewMsg('');
    try {
      await apiFetch('POST', `/messages/${activeConvo._id}/messages`, { text: msgText });
      fetchMessages(activeConvo._id);
      fetchConversations();
    } catch { setMessages(prev => prev.filter(m => m._id !== optimistic._id)); }
    finally { setSending(false); }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!activeConvo) return;
    try {
      await apiFetch('DELETE', `/messages/${activeConvo._id}`);
      setActiveConvo(null);
      setMessages([]);
      setMobileView('list');
      setShowDeleteConfirm(false);
      fetchConversations();
    } catch (err) {
      alert(err.message || 'Failed to delete conversation');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!loadingConvos && conversations.length === 0) {
    return (
      <div>

        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-[#008737]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-[#008737]" />
          </div>
          <h3 className="text-lg font-bold text-[#063630] mb-2">No messages yet</h3>
          <p className="text-gray-500 text-sm">When adopters message you about your dogs, they'll appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div>


      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: '70vh', minHeight: 480 }}>
        <div className="flex h-full">

          {/* Conversation list */}
          <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col flex-shrink-0 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <p className="font-semibold text-[#063630]">Inbox</p>
              {conversations.reduce((sum, c) => sum + (c.unreadRehomer || 0), 0) > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {conversations.reduce((sum, c) => sum + (c.unreadRehomer || 0), 0)}
                </span>
              )}
            </div>
            <div className="overflow-y-auto flex-1">
              {loadingConvos ? (
                <div className="flex items-center justify-center h-24">
                  <div className="w-6 h-6 border-2 border-[#008737] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                conversations.map(convo => {
                  const isActive = activeConvo?._id === convo._id;
                  const adopter  = convo.adopter;
                  const pet      = convo.pet;
                  const unread   = convo.unreadRehomer || 0;
                  return (
                    <button key={convo._id} onClick={() => openConvo(convo)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${isActive ? 'bg-[#008737]/5 border-l-2 border-l-[#008737]' : ''}`}>
                      <Avatar name={adopter?.name} url={adopter?.profileImage} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className={`text-sm truncate ${unread > 0 ? 'font-bold text-[#063630]' : 'font-semibold text-[#063630]'}`}>{adopter?.name || 'Adopter'}</p>
                          <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(convo.lastMessageAt)}</span>
                        </div>
                        {pet && (
                          <p className="text-xs text-[#008737] font-medium truncate mb-0.5">
                            <Dog className="h-3 w-3 inline mr-1" />{pet.name}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className={`text-xs truncate ${unread > 0 ? 'text-[#063630] font-medium' : 'text-gray-500'}`}>{convo.lastMessage || 'No messages yet'}</p>
                          {unread > 0 && (
                            <span className="bg-[#008737] text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0">{unread}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat panel */}
          <div className={`flex-1 flex flex-col ${mobileView === 'list' && !activeConvo ? 'hidden md:flex' : 'flex'}`}>
            {!activeConvo ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm">Select a conversation</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => setMobileView('list')} className="md:hidden p-1 text-gray-500">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <Avatar name={activeConvo.adopter?.name} url={activeConvo.adopter?.profileImage} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#063630] text-sm">{activeConvo.adopter?.name}</p>
                      {activeConvo.pet && (
                        <p className="text-xs text-[#008737] font-medium truncate">
                          About: {activeConvo.pet.name}{activeConvo.pet.breed ? ` · ${activeConvo.pet.breed}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <button onClick={handleDeleteClick} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2" title="Delete conversation">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMsgs ? (
                    <div className="flex items-center justify-center h-24">
                      <div className="w-6 h-6 border-2 border-[#008737] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">No messages yet.</div>
                  ) : (
                    messages.map(msg => {
                      const myId   = user?._id || user?.id;
                      const isMine = msg.sender?._id === myId || msg.sender === myId;
                      return (
                        <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                          {!isMine && <Avatar name={msg.sender?.name} url={msg.sender?.profileImage} size="sm" />}
                          <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-xs lg:max-w-md ${
                              isMine ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-br-sm' : 'bg-gray-100 text-[#063630] rounded-bl-sm'
                            }`} style={isMine ? { color: '#fff' } : {}}>
                              {msg.text}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-400">{timeAgo(msg.createdAt)}</span>
                              {isMine && msg.readAt && <CheckCheck className="h-3 w-3 text-[#008737]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                  <div className="flex items-end gap-2">
                    <textarea value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={handleKeyDown}
                      placeholder="Type a message... (Enter to send)" rows={1} maxLength={1000}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008737] resize-none bg-white" />
                    <button onClick={handleSend} disabled={!newMsg.trim() || sending}
                      className="p-3 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-xl hover:shadow-md transition-all disabled:opacity-50 flex-shrink-0"
                      style={{ color: '#fff' }}>
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Conversation?"
        message="This action cannot be undone. All messages in this conversation will be permanently removed for both you and the adopter."
      />
    </div>
  );
};

export default MessagesTab;