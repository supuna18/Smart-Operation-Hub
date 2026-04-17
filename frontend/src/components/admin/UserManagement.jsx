import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import AddUserModal from './AddUserModal';
import { Search, UserPlus, Trash2, ChevronDown, AlertCircle } from 'lucide-react';

/* ─── Brand tokens (matches About Us / AdminDashboard) ─── */
const GOLD = '#FACC15';
const DARK = '#262626';

const ROLE_CONFIG = {
  ADMIN:      { label: 'Admin',      color: DARK,      bg: `${GOLD}25`,      border: `${GOLD}60`      },
  STUDENT:    { label: 'Student',    color: '#166534',  bg: '#f0fdf4',        border: '#86efac'         },
  LECTURER:   { label: 'Lecturer',   color: '#92400e',  bg: '#fffbeb',        border: '#fcd34d'         },
  TECHNICIAN: { label: 'Technician', color: '#1e40af',  bg: '#eff6ff',        border: '#93c5fd'         },
};

const UserManagement = () => {
  const [users, setUsers]             = useState([]);
  const [searchTerm, setSearchTerm]   = useState('');
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [isAddModalOpen, setIsAdd]    = useState(false);
  const [deletingId, setDeletingId]   = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch {
      setError('Unable to load user data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateUserRole = async (id, role) => {
    try {
      const res = await api.patch(`/users/${id}/role`, { role });
      setUsers(users.map(u => u.id === id ? res.data : u));
    } catch { alert('Failed to update role.'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch { alert('Failed to delete user.'); }
    finally { setDeletingId(null); }
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ── Loading state ── */
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', background: '#fff', borderRadius: 20, border: '1px solid rgba(38,38,38,0.07)' }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        border: `3px solid ${GOLD}40`, borderTopColor: GOLD,
        animation: 'spin 0.8s linear infinite', marginBottom: 16,
      }} />
      <p style={{ margin: 0, fontWeight: 700, color: '#9ca3af', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Loading Records…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  /* ── Error state ── */
  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 26px', background: '#fef2f2', borderRadius: 16, border: '1px solid #fecaca' }}>
      <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
      <p style={{ margin: 0, fontWeight: 600, color: '#dc2626', fontSize: 14 }}>{error}</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 380 }}>
          <Search size={15} color="#9ca3af" style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search users by name or email…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 42px',
              border: `1.5px solid #e5e7eb`, borderRadius: 12,
              fontSize: 13, fontFamily: "'Poppins', sans-serif", fontWeight: 500,
              color: DARK, background: '#fff', outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px ${GOLD}25`; }}
            onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Count pill + Add button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            padding: '6px 14px', borderRadius: 99,
            background: `${GOLD}15`, border: `1px solid ${GOLD}40`,
            fontSize: 12, fontWeight: 700, color: DARK,
          }}>
            {filtered.length} user{filtered.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setIsAdd(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '11px 20px',
              background: DARK, border: 'none', borderRadius: 12,
              cursor: 'pointer', color: GOLD,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700, fontSize: 13,
              boxShadow: `0 4px 14px ${DARK}30`,
              transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
              outline: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${DARK}40`; }}
            onMouseLeave={e => { e.currentTarget.style.background = DARK; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 14px ${DARK}30`; }}
          >
            <UserPlus size={15} />
            Add User
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(38,38,38,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Poppins', sans-serif" }}>
          <thead>
            <tr style={{ background: '#fafaf8' }}>
              {['User', 'Email', 'Role', 'Actions'].map((h, i) => (
                <th key={h} style={{
                  padding: '15px 24px',
                  textAlign: i === 3 ? 'right' : 'left',
                  fontSize: 10, fontWeight: 800,
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderBottom: `2px solid ${GOLD}25`,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '60px 24px', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontWeight: 700, color: '#9ca3af', fontSize: 14 }}>No users match your search.</p>
                  <p style={{ margin: '6px 0 0', fontWeight: 500, color: '#d1d5db', fontSize: 12 }}>Try a different keyword.</p>
                </td>
              </tr>
            ) : (
              filtered.map((user, idx) => {
                const cfg = ROLE_CONFIG[user.role] || { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' };
                return (
                  <tr
                    key={user.id}
                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f3f4f6' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = `${GOLD}08`}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Avatar + Name */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                          background: user.role === 'ADMIN' ? GOLD : `${GOLD}20`,
                          border: `2px solid ${user.role === 'ADMIN' ? GOLD : `${GOLD}40`}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: 14,
                          color: user.role === 'ADMIN' ? DARK : DARK,
                        }}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 14, color: DARK }}>{user.username}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '16px 24px', fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
                      {user.email}
                    </td>

                    {/* Role selector */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                        <select
                          value={user.role}
                          onChange={e => updateUserRole(user.id, e.target.value)}
                          style={{
                            appearance: 'none',
                            padding: '5px 30px 5px 12px',
                            borderRadius: 99,
                            border: `1.5px solid ${cfg.border}`,
                            background: cfg.bg,
                            color: cfg.color,
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 700, fontSize: 11,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="STUDENT">Student</option>
                          <option value="LECTURER">Lecturer</option>
                          <option value="TECHNICIAN">Technician</option>
                        </select>
                        <ChevronDown size={11} color={cfg.color} style={{ position: 'absolute', right: 10, pointerEvents: 'none' }} />
                      </div>
                    </td>

                    {/* Delete */}
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button
                        onClick={() => deleteUser(user.id)}
                        disabled={deletingId === user.id}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '7px 13px',
                          background: 'transparent',
                          border: '1.5px solid #fee2e2',
                          borderRadius: 10, cursor: deletingId === user.id ? 'not-allowed' : 'pointer',
                          color: '#ef4444', fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600, fontSize: 12,
                          transition: 'all 0.18s', outline: 'none',
                          opacity: deletingId === user.id ? 0.6 : 1,
                        }}
                        onMouseEnter={e => { if (deletingId !== user.id) { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fca5a5'; } }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#fee2e2'; }}
                      >
                        <Trash2 size={13} />
                        {deletingId === user.id ? 'Removing…' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Table footer */}
        {filtered.length > 0 && (
          <div style={{ padding: '12px 24px', background: '#fafaf8', borderTop: `1px solid ${GOLD}25`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>
              Showing <strong style={{ color: DARK }}>{filtered.length}</strong> of <strong style={{ color: DARK }}>{users.length}</strong> users
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: `${DARK}60`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SmartSync User Registry
            </span>
          </div>
        )}
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAdd(false)}
        onUserAdded={u => setUsers([...users, u])}
      />
    </div>
  );
};

export default UserManagement;