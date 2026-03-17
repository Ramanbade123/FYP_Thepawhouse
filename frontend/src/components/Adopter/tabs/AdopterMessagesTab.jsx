import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Send, ChevronLeft, Dog, Clock, CheckCheck, Trash2 } from 'lucide-react';

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

const AdopterMessagesTab = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

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

  // Auto-open a conversation if redirected from DogDetailPage
  useEffect(() => {
    if (loadingConvos) return;
    const pendingId = localStorage.getItem('openConversation');
    if (!pendingId) return;
    localStorage.removeItem('openConversation');

    const found = conversations.find(c => c._id === pendingId);
    if (found) {
      openConvo(found);
    } else {
      // Conversation was just created — refetch list then open
      apiFetch('GET', '/messages').then(data => {
        const convos = data.data || [];
        setConversations(convos);
        const match = convos.find(c => c._id === pendingId);
        if (match) openConvo(match);
      }).catch(() => {});
    }
  }, [loadingConvos]);

  // Poll every 5s when a convo is open
  useEffect(() => {
    if (!activeConvo) return;
    pollRef.current = setInterval(() => fetchMessages(activeConvo._id), 5000);
    return () => clearInterval(pollRef.current);
  }, [activeConvo, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openConvo = (convo) => {
    setActiveConvo(convo);
    setMessages([]);
    fetchMessages(convo._id);
    setMobileView('chat');
    setConversations(prev =>
      prev.map(c => c._id === convo._id ? { ...c, unreadAdopter: 0 } : c)
    );
  };

  const handleSend = async () => {
    if (!newMsg.trim() || !activeConvo || sending) return;
    setSending(true);
    const optimistic = {
      _id: `temp-${Date.now()}`, text: newMsg.trim(),
      sender: { _id: user?._id || user?.id, name: user?.name },
      senderRole: 'adopter', createdAt: new Date().toISOString(),
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
          <h3 className="text-lg font-bold text-[#063630] mb-2">No conversations yet</h3>
          <p className="text-gray-500 text-sm">Click "Message Rehomer" on any dog's page to start chatting.</p>
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
            <div className="p-4 border-b border-gray-100">
              <p className="font-semibold text-[#063630]">Conversations</p>
            </div>
            <div className="overflow-y-auto flex-1">
              {loadingConvos ? (
                <div className="flex items-center justify-center h-24">
                  <div className="w-6 h-6 border-2 border-[#008737] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                conversations.map(convo => {
                  const isActive = activeConvo?._id === convo._id;
                  const rehomer  = convo.rehomer;
                  const pet      = convo.pet;
                  const unread   = convo.unreadAdopter || 0;
                  return (
                    <button key={convo._id} onClick={() => openConvo(convo)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${isActive ? 'bg-[#008737]/5 border-l-2 border-l-[#008737]' : ''}`}>
                      <Avatar name={rehomer?.name} url={rehomer?.profileImage} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="font-semibold text-[#063630] text-sm truncate">{rehomer?.name || 'Rehomer'}</p>
                          <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(convo.lastMessageAt)}</span>
                        </div>
                        {pet && (
                          <p className="text-xs text-[#008737] font-medium truncate mb-0.5">
                            <Dog className="h-3 w-3 inline mr-1" />{pet.name}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 truncate">{convo.lastMessage || 'No messages yet'}</p>
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
                <p className="text-sm">Select a conversation to start chatting</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => setMobileView('list')} className="md:hidden p-1 text-gray-500">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <Avatar name={activeConvo.rehomer?.name} url={activeConvo.rehomer?.profileImage} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#063630] text-sm">{activeConvo.rehomer?.name}</p>
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
                    <div className="text-center py-10 text-gray-400 text-sm">No messages yet. Say hello! 👋</div>
                  ) : (
                    messages.map(msg => {
                      const myId  = user?._id || user?.id;
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
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Conversation?</h3>
              <p className="text-gray-500 text-sm">
                This action cannot be undone. All messages in this conversation will be permanently removed for both you and the rehomer.
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-4 text-gray-600 font-medium hover:bg-gray-50 transition-colors border-r border-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="flex-1 py-4 text-red-600 font-bold hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdopterMessagesTab;