import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import AddUserModal from './AddUserModal';
import { Search, UserPlus, Trash2, ChevronDown, AlertCircle, RefreshCw } from 'lucide-react';

/* ── Brand tokens ── */
const G = '#FACC15';
const D = '#262626';
const W = '#FFFFFF';

const ROLE_CFG = {
  ADMIN:      { color: D,        bg: `${G}28`,  border: `${G}70`  },
  STUDENT:    { color: '#166534', bg: '#f0fdf4', border: '#86efac' },
  LECTURER:   { color: '#92400e', bg: '#fffbeb', border: '#fcd34d' },
  TECHNICIAN: { color: '#1e40af', bg: '#eff6ff', border: '#93c5fd' },
};

/* ── Responsive CSS ── */
const CSS = `
  .um-wrap { font-family: 'Poppins', sans-serif; }

  /* Toolbar */
  .um-toolbar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }
  @media (min-width: 580px) {
    .um-toolbar { flex-direction: row; align-items: center; }
  }

  /* Search */
  .um-search-wrap { position: relative; flex: 1; }
  .um-search {
    width: 100%; padding: 11px 14px 11px 40px;
    border: 1.5px solid #e5e7eb; border-radius: 11px;
    font-size: 13px; font-family: 'Poppins', sans-serif;
    font-weight: 500; color: ${D}; background: ${W};
    outline: none; transition: border-color .2s, box-shadow .2s;
    box-sizing: border-box;
  }
  .um-search:focus { border-color: ${G}; box-shadow: 0 0 0 3px ${G}25; }

  /* Add button */
  .um-add-btn {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 11px 18px; background: ${D}; border: none; border-radius: 11px;
    cursor: pointer; color: ${G};
    font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 13px;
    box-shadow: 0 4px 12px rgba(38,38,38,.25);
    transition: transform .18s, box-shadow .18s, background .18s;
    outline: none; white-space: nowrap; width: 100%;
  }
  .um-add-btn:hover { background: #1a1a1a; transform: translateY(-2px); box-shadow: 0 6px 18px rgba(38,38,38,.35); }
  @media (min-width: 580px) { .um-add-btn { width: auto; } }

  /* Count pill */
  .um-count {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 13px; border-radius: 99px;
    background: ${G}1A; border: 1px solid ${G}45;
    font-size: 11.5px; font-weight: 700; color: ${D};
    white-space: nowrap; flex-shrink: 0;
  }

  /* TABLE — hidden on mobile, shown on md+ */
  .um-table-card { display: none; }
  @media (min-width: 768px) { .um-table-card { display: block; } }

  /* CARD LIST — shown on mobile, hidden on md+ */
  .um-card-list { display: flex; flex-direction: column; gap: 10px; }
  @media (min-width: 768px) { .um-card-list { display: none; } }

  /* User card (mobile) */
  .um-user-card {
    background: ${W}; border-radius: 14px; padding: 14px 16px;
    border: 1px solid rgba(38,38,38,.07);
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    transition: box-shadow .18s, transform .18s;
  }
  .um-user-card:hover { box-shadow: 0 5px 18px rgba(0,0,0,.09); transform: translateY(-2px); }

  /* Table */
  .um-table { width: 100%; border-collapse: collapse; font-family: 'Poppins', sans-serif; }
  .um-th {
    padding: 13px 20px; font-size: 10px; font-weight: 800;
    color: #9ca3af; text-transform: uppercase; letter-spacing: .1em;
    background: #fafaf8; border-bottom: 2px solid ${G}22;
  }
  .um-th:last-child { text-align: right; }
  .um-tr { transition: background .15s; border-bottom: 1px solid #f3f4f6; }
  .um-tr:last-child { border-bottom: none; }
  .um-tr:hover { background: ${G}08; }
  .um-td { padding: 15px 20px; }

  /* Role select */
  .role-select {
    appearance: none; padding: 5px 28px 5px 11px;
    border-radius: 99px; border: 1.5px solid;
    font-family: 'Poppins', sans-serif;
    font-weight: 700; font-size: 11px; letter-spacing: .05em;
    text-transform: uppercase; cursor: pointer; outline: none;
  }

  /* Delete btn */
  .del-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; background: transparent;
    border: 1.5px solid #fee2e2; border-radius: 9px;
    cursor: pointer; color: #ef4444;
    font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 11.5px;
    transition: all .18s; outline: none;
  }
  .del-btn:hover { background: #fef2f2; border-color: #fca5a5; }
  .del-btn:disabled { opacity: .55; cursor: not-allowed; }

  /* Table footer */
  .um-footer {
    padding: 11px 20px; background: #fafaf8;
    border-top: 1px solid ${G}22;
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 6px;
  }

  /* Loading spinner */
  @keyframes um-spin { to { transform: rotate(360deg); } }
  .um-spinner {
    width: 38px; height: 38px; border-radius: 50%;
    border: 3px solid ${G}35; border-top-color: ${G};
    animation: um-spin .75s linear infinite; margin: 0 auto 14px;
  }

  /* Empty state */
  .um-empty-state {
    display: flex; flex-direction: column; align-items: center;
    padding: 50px 20px; text-align: center;
  }
`;

/* ── Role select wrapper (with chevron overlay) ── */
const RoleSelect = ({ value, onChange }) => {
  const cfg = ROLE_CFG[value] || { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' };
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="role-select"
        style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
      >
        <option value="ADMIN">Admin</option>
        <option value="STUDENT">Student</option>
        <option value="LECTURER">Lecturer</option>
        <option value="TECHNICIAN">Technician</option>
      </select>
      <ChevronDown size={10} color={cfg.color} style={{ position: 'absolute', right: 9, pointerEvents: 'none', flexShrink: 0 }} />
    </div>
  );
};

/* ── Avatar ── */
const Avatar = ({ username, role }) => {
  const isAdmin = role === 'ADMIN';
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
      background: isAdmin ? G : `${G}22`,
      border: `2px solid ${isAdmin ? G : `${G}45`}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: 13, color: D,
    }}>
      {username?.charAt(0).toUpperCase()}
    </div>
  );
};

/* ══════════════════════════════════════════ */
const UserManagement = () => {
  const [users, setUsers]           = useState([]);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [modalOpen, setModalOpen]   = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch {
      setError('Unable to load user data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const updateRole = async (id, role) => {
    try {
      const res = await api.patch(`/users/${id}/role`, { role });
      setUsers(prev => prev.map(u => u.id === id ? res.data : u));
    } catch { alert('Failed to update role.'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Remove this user permanently?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch { alert('Failed to delete user.'); }
    finally { setDeletingId(null); }
  };

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Loading ── */
  if (loading) return (
    <div style={{ background: W, borderRadius: 16, padding: '60px 24px', textAlign: 'center', border: '1px solid rgba(38,38,38,.07)' }}>
      <div className="um-spinner" />
      <p style={{ margin: 0, fontWeight: 700, color: '#9ca3af', fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Loading records…
      </p>
      <style>{CSS}</style>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <>
      <style>{CSS}</style>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '18px 22px', background: '#fef2f2', borderRadius: 14, border: '1px solid #fecaca' }}>
        <AlertCircle size={19} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#dc2626', fontSize: 13.5 }}>{error}</p>
          <button onClick={load} style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 13px', background: W, border: '1px solid #fca5a5', borderRadius: 8, cursor: 'pointer', color: '#ef4444', fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 12, outline: 'none' }}>
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="um-wrap">

        {/* ── Toolbar ── */}
        <div className="um-toolbar">
          {/* Search */}
          <div className="um-search-wrap">
            <Search size={15} color="#9ca3af" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="um-search"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span className="um-count">
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: G, display: 'inline-block' }} />
              {filtered.length} user{filtered.length !== 1 ? 's' : ''}
            </span>
            <button className="um-add-btn" onClick={() => setModalOpen(true)}>
              <UserPlus size={15} />
              Add User
            </button>
          </div>
        </div>

        {/* ══════════ MOBILE: Card list ══════════ */}
        <div className="um-card-list">
          {filtered.length === 0 ? (
            <div className="um-empty-state" style={{ background: W, borderRadius: 16, border: '1px solid rgba(38,38,38,.07)' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#9ca3af', fontSize: 13.5 }}>No users found.</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#d1d5db', fontWeight: 500 }}>Try a different keyword.</p>
            </div>
          ) : (
            filtered.map(user => {
              const cfg = ROLE_CFG[user.role] || { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' };
              return (
                <div key={user.id} className="um-user-card">
                  {/* Top row: avatar + name + delete */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <Avatar username={user.username} role={user.role} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: D }}>{user.username}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#9ca3af', fontWeight: 500 }}>{user.email}</p>
                      </div>
                    </div>
                    <button
                      className="del-btn"
                      onClick={() => deleteUser(user.id)}
                      disabled={deletingId === user.id}
                    >
                      <Trash2 size={12} />
                      {deletingId === user.id ? '…' : 'Remove'}
                    </button>
                  </div>

                  {/* Bottom row: role */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Role</span>
                    <RoleSelect value={user.role} onChange={role => updateRole(user.id, role)} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ══════════ DESKTOP: Table ══════════ */}
        <div className="um-table-card" style={{ background: W, borderRadius: 18, border: '1px solid rgba(38,38,38,.07)', boxShadow: '0 2px 12px rgba(0,0,0,.04)', overflowX: 'auto' }}>
          <table className="um-table">
            <thead>
              <tr>
                {['User', 'Email', 'Role', 'Actions'].map((h, i) => (
                  <th key={h} className="um-th" style={{ textAlign: i === 3 ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="um-empty-state">
                      <p style={{ margin: 0, fontWeight: 700, color: '#9ca3af', fontSize: 13.5 }}>No users match your search.</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#d1d5db', fontWeight: 500 }}>Try a different keyword.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(user => (
                  <tr key={user.id} className="um-tr">
                    {/* Avatar + Name */}
                    <td className="um-td">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <Avatar username={user.username} role={user.role} />
                        <span style={{ fontWeight: 700, fontSize: 13.5, color: D }}>{user.username}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="um-td" style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="um-td">
                      <RoleSelect value={user.role} onChange={role => updateRole(user.id, role)} />
                    </td>

                    {/* Delete */}
                    <td className="um-td" style={{ textAlign: 'right' }}>
                      <button
                        className="del-btn"
                        onClick={() => deleteUser(user.id)}
                        disabled={deletingId === user.id}
                      >
                        <Trash2 size={12} />
                        {deletingId === user.id ? 'Removing…' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Table footer */}
          {filtered.length > 0 && (
            <div className="um-footer">
              <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>
                Showing <strong style={{ color: D }}>{filtered.length}</strong> of <strong style={{ color: D }}>{users.length}</strong> users
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: `${D}55`, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                SmartSync Registry
              </span>
            </div>
          )}
        </div>

      </div>

      <AddUserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUserAdded={u => setUsers(prev => [...prev, u])}
      />
    </>
  );
};

export default UserManagement;