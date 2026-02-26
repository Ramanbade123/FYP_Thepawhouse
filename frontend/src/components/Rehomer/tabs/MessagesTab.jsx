import { useState } from 'react';
import { MessageSquare, Send, Search } from 'lucide-react';

const MOCK_CONVERSATIONS = [
  { id: 1, name: 'John Doe',    avatar: 'J', lastMessage: 'Hi, I applied for Max. Is he still available?', time: '2h ago',   unread: 2, active: true  },
  { id: 2, name: 'Sarah Smith', avatar: 'S', lastMessage: 'Thank you for approving my application!',        time: '1d ago',   unread: 0, active: false },
  { id: 3, name: 'Mike Johnson',avatar: 'M', lastMessage: 'Can I schedule a meet with Bella?',              time: '2d ago',   unread: 1, active: false },
];

const MOCK_MESSAGES = {
  1: [
    { id: 1, from: 'them', text: 'Hi, I applied for Max. Is he still available?',     time: '10:32 AM' },
    { id: 2, from: 'me',   text: 'Yes, Max is still available! Your application is under review.', time: '10:45 AM' },
    { id: 3, from: 'them', text: 'Great! Can I come meet him this weekend?',           time: '10:47 AM' },
  ],
  2: [
    { id: 1, from: 'them', text: 'Thank you for approving my application!',           time: 'Yesterday' },
    { id: 2, from: 'me',   text: 'Congratulations! We\'ll be in touch for next steps.', time: 'Yesterday' },
  ],
  3: [
    { id: 1, from: 'them', text: 'Can I schedule a meet with Bella?',                 time: '2 days ago' },
  ],
};

const MessagesTab = ({ user }) => {
  const [activeConvo, setActiveConvo] = useState(1);
  const [newMessage, setNewMessage]   = useState('');
  const [messages, setMessages]       = useState(MOCK_MESSAGES);

  const send = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => ({
      ...prev,
      [activeConvo]: [
        ...(prev[activeConvo] || []),
        { id: Date.now(), from: 'me', text: newMessage.trim(), time: 'Just now' },
      ],
    }));
    setNewMessage('');
  };

  const convo = MOCK_CONVERSATIONS.find(c => c.id === activeConvo);
  const convoMessages = messages[activeConvo] || [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#063630]">Messages</h2>
        <p className="text-gray-500 mt-1">Communicate with potential adopters.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex h-[600px]">

        {/* ── Sidebar ── */}
        <div className="w-80 border-r border-gray-100 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#085558]" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {MOCK_CONVERSATIONS.map(c => (
              <button key={c.id} onClick={() => setActiveConvo(c.id)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                  activeConvo === c.id ? 'bg-[#085558]/5 border-l-2 border-l-[#085558]' : ''
                }`}>
                <div className="w-10 h-10 bg-gradient-to-br from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
                    <span className="text-xs text-gray-400">{c.time}</span>
                  </div>
                  <p className="text-gray-500 text-xs truncate mt-0.5">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 bg-[#008737] text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Chat area ── */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <div className="w-9 h-9 bg-gradient-to-br from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white font-bold text-sm">
              {convo?.avatar}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{convo?.name}</p>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {convoMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                  msg.from === 'me'
                    ? 'bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-white/60' : 'text-gray-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 flex gap-3">
            <input
              value={newMessage} onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#085558] text-sm"
            />
            <button onClick={send}
              className="px-4 py-2.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl hover:shadow-md transition-shadow"
              style={{ color: '#ffffff' }}>
              <Send className="h-4 w-4" style={{ color: '#ffffff' }} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-3">
        💬 Real-time messaging coming soon. Showing demo conversations.
      </p>
    </div>
  );
};

export default MessagesTab;