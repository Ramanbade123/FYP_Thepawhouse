import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MailOpen, Trash2, Eye, X, RefreshCw,
  Search, MessageSquare, Clock, CheckCircle,
  AlertCircle, ChevronLeft, ChevronRight, Reply
} from 'lucide-react';

const API = 'http://localhost:5000/api';
const token = () => localStorage.getItem('token');

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

const StatusBadge = ({ status }) => {
  const styles = {
    unread:  'bg-red-100 text-red-700',
    read:    'bg-gray-100 text-gray-600',
    replied: 'bg-[#008737]/10 text-[#008737]',
  };
  const icons = {
    unread:  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />,
    read:    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />,
    replied: <CheckCircle className="h-3 w-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ── Detail Modal ──────────────────────────────────────────────────────────────
const MessageModal = ({ msg, onClose, onStatusChange, onDelete }) => {
  const [note, setNote] = useState(msg.adminNote || '');
  const [saving, setSaving] = useState(false);

  const saveNote = async () => {
    setSaving(true);
    await onStatusChange(msg._id, 'replied', note);
    setSaving(false);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#063630] to-[#085558] p-5 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">{msg.subject}</h3>
                <p className="text-white/60 text-xs mt-0.5">{msg.name} · {msg.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
              <X className="h-4 w-4 text-white" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Sender info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">From</p>
                <p className="text-sm font-semibold text-[#063630] mt-0.5">{msg.name}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                <p className="text-sm font-semibold text-[#063630] mt-0.5 truncate">{msg.email}</p>
              </div>
            </div>

            {/* Subject */}
            <div className="bg-[#008737]/5 border border-[#008737]/15 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Subject</p>
              <p className="text-sm font-semibold text-[#063630]">{msg.subject}</p>
            </div>

            {/* Message */}
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Message</p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>

            {/* Time */}
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {new Date(msg.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>

            {/* Admin note */}
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Admin Note (optional)</p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                placeholder="Add a private note about this message..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#063630] focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 outline-none resize-none transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={saveNote} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#008737] to-[#085558] text-white text-sm font-semibold hover:shadow-md transition-all disabled:opacity-60">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Reply className="h-4 w-4" />}
                Mark as Replied
              </button>
              <button onClick={() => onDelete(msg._id)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors border border-red-100">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminMessagesTab = () => {
  const [messages, setMessages]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [selected, setSelected]     = useState(null);
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilter]   = useState('all');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [stats, setStats]           = useState({ total: 0, unread: 0, read: 0, replied: 0 });

  const fetchMessages = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filterStatus !== 'all') params.set('status', filterStatus);
      const data = await apiFetch('GET', `/contact?${params}`);
      setMessages(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [page, filterStatus]);

  const fetchStats = useCallback(async () => {
    try {
      const [all, unread, replied] = await Promise.all([
        apiFetch('GET', '/contact?limit=1'),
        apiFetch('GET', '/contact?status=unread&limit=1'),
        apiFetch('GET', '/contact?status=replied&limit=1'),
      ]);
      const readCount = (all.total || 0) - (unread.total || 0) - (replied.total || 0);
      setStats({ total: all.total || 0, unread: unread.total || 0, read: Math.max(0, readCount), replied: replied.total || 0 });
    } catch (_) {}
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);
  useEffect(() => { fetchStats(); },   [fetchStats]);

  const handleOpen = async (msg) => {
    setSelected(msg);
    if (msg.status === 'unread') {
      try {
        await apiFetch('PUT', `/contact/${msg._id}/status`, { status: 'read' });
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, status: 'read' } : m));
        fetchStats();
      } catch (_) {}
    }
  };

  const handleStatusChange = async (id, status, adminNote) => {
    try {
      await apiFetch('PUT', `/contact/${id}/status`, { status, adminNote });
      setSelected(null);
      fetchMessages();
      fetchStats();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await apiFetch('DELETE', `/contact/${id}`);
      setSelected(null);
      fetchMessages();
      fetchStats();
    } catch (err) { alert(err.message); }
  };

  const filtered = messages.filter(m => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (m.name || '').toLowerCase().includes(q) ||
           (m.email || '').toLowerCase().includes(q) ||
           (m.subject || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#063630] to-[#085558] rounded-xl p-6 text-white flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <p className="text-white/70 mt-1">Messages sent from the Contact page</p>
        </div>
        <button onClick={() => { fetchMessages(); fetchStats(); }}
          className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total',   value: stats.total,   color: 'text-[#063630]', bg: 'bg-gray-50',   border: 'border-gray-200'  },
          { label: 'Unread',  value: stats.unread,  color: 'text-red-600',   bg: 'bg-red-50',    border: 'border-red-100'   },
          { label: 'Read',    value: stats.read,    color: 'text-gray-600',  bg: 'bg-gray-50',   border: 'border-gray-200'  },
          { label: 'Replied', value: stats.replied, color: 'text-[#008737]', bg: 'bg-green-50',  border: 'border-green-100' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, subject..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 outline-none transition-all" />
        </div>
        <select value={filterStatus} onChange={e => { setFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#008737] outline-none text-gray-700 bg-white">
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
        {(filterStatus !== 'all' || search) && (
          <button onClick={() => { setFilter('all'); setSearch(''); setPage(1); }}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#008737]/30 border-t-[#008737] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
            <p className="text-red-600 font-medium">{error}</p>
            <button onClick={fetchMessages} className="mt-3 text-sm text-[#008737] hover:underline">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No messages found</p>
            <p className="text-gray-400 text-sm mt-1">Messages from the contact form will appear here</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {filtered.map((msg, i) => (
                <motion.div key={msg._id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors cursor-pointer ${msg.status === 'unread' ? 'bg-[#008737]/3' : ''}`}
                  onClick={() => handleOpen(msg)}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.status === 'unread' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    {msg.status === 'unread'
                      ? <Mail className="h-5 w-5 text-red-500" />
                      : <MailOpen className="h-5 w-5 text-gray-400" />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold truncate ${msg.status === 'unread' ? 'text-[#063630]' : 'text-gray-700'}`}>
                        {msg.name}
                      </p>
                      <span className="text-gray-300 text-xs">·</span>
                      <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                    </div>
                    <p className={`text-sm truncate mt-0.5 ${msg.status === 'unread' ? 'font-medium text-[#063630]' : 'text-gray-500'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{msg.message}</p>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <StatusBadge status={msg.status} />
                    <p className="text-xs text-gray-400">
                      {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleOpen(msg)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#063630]/5 hover:bg-[#063630]/10 text-[#063630] transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(msg._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                <p className="text-sm text-gray-500">
                  Showing {((page - 1) * 15) + 1}–{Math.min(page * 15, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40 hover:border-[#008737] hover:text-[#008737] transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-700">{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40 hover:border-[#008737] hover:text-[#008737] transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <MessageModal
          msg={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminMessagesTab;