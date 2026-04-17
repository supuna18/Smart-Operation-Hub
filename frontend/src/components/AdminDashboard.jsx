import React, { useState } from 'react';
import { getUser, clearAuth } from '../utils/auth';
import UserManagement from './admin/UserManagement';
import {
  Users, Building2, Wrench, BookOpen,
  LayoutDashboard, ChevronRight, ShieldCheck,
  Bell, Settings, LogOut, TrendingUp, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─── Brand tokens (matches About Us page) ─── */
const GOLD   = '#FACC15';
const DARK   = '#262626';
const WHITE  = '#FFFFFF';

const TABS = [
  { id: 'overview',    label: 'Overview',    icon: LayoutDashboard },
  { id: 'users',       label: 'Users',        icon: Users },
  { id: 'facilities',  label: 'Facilities',   icon: Building2 },
  { id: 'resources',   label: 'Resources',    icon: BookOpen },
  { id: 'maintenance', label: 'Maintenance',  icon: Wrench },
];

const STATS = [
  { label: 'Total Users',      value: '1,284', change: '+12%', up: true,  icon: Users    },
  { label: 'Facilities',       value: '48',    change: '+3%',  up: true,  icon: Building2 },
  { label: 'Active Resources', value: '326',   change: '+8%',  up: true,  icon: BookOpen  },
  { label: 'Open Tickets',     value: '17',    change: '-5%',  up: false, icon: Wrench   },
];

/* ─── Inline style helpers ─── */
const S = {
  sidebar: (open) => ({
    width: open ? 260 : 80,
    transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
    background: DARK,
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowX: 'hidden',
    flexShrink: 0,
    zIndex: 10,
    borderRight: `1px solid rgba(250,204,21,0.12)`,
  }),
  navBtn: (active, open) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    padding: open ? '12px 18px' : '12px',
    justifyContent: open ? 'flex-start' : 'center',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    marginBottom: 4,
    transition: 'all 0.2s ease',
    background: active ? `${GOLD}18` : 'transparent',
    color: active ? GOLD : 'rgba(255,255,255,0.5)',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: active ? 700 : 500,
    fontSize: 14,
    position: 'relative',
    outline: 'none',
    whiteSpace: 'nowrap',
  }),
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const currentUser = getUser();

  const handleLogout = () => { clearAuth(); navigate('/login'); };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: '100vh', background: '#FAFAF8', display: 'flex' }}>

      {/* ════════════════ SIDEBAR ════════════════ */}
      <aside style={S.sidebar(sidebarOpen)}>

        {/* Logo */}
        <div style={{ padding: '26px 18px 20px', borderBottom: '1px solid rgba(250,204,21,0.1)' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: 0 }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: GOLD,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 14px ${GOLD}55`,
            }}>
              <ShieldCheck size={20} color={DARK} strokeWidth={2.5} />
            </div>
            {sidebarOpen && (
              <span style={{ color: WHITE, fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
                Smart<span style={{ color: GOLD }}>Sync</span> Admin
              </span>
            )}
          </button>
        </div>

        {/* Label */}
        {sidebarOpen && (
          <div style={{ padding: '18px 20px 6px' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              Navigation
            </span>
          </div>
        )}

        {/* Nav */}
        <nav style={{ padding: '4px 12px', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={S.navBtn(active, sidebarOpen)}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = WHITE; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}
              >
                {active && (
                  <span style={{ position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 3, background: GOLD, borderRadius: 99 }} />
                )}
                <Icon size={20} strokeWidth={active ? 2.5 : 2} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom user card + logout */}
        <div style={{ padding: '14px 12px 20px', borderTop: '1px solid rgba(250,204,21,0.1)' }}>
          {/* Avatar row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: sidebarOpen ? '12px 14px' : '12px',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            marginBottom: 8,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: GOLD,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, color: DARK,
            }}>
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, color: WHITE, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.username}
                </p>
                <p style={{ margin: 0, color: `${GOLD}99`, fontSize: 11, fontWeight: 600 }}>Administrator</p>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: sidebarOpen ? '11px 14px' : '11px',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.15)',
              borderRadius: 12, cursor: 'pointer',
              color: '#f87171', fontFamily: "'Poppins', sans-serif",
              fontWeight: 600, fontSize: 13, transition: 'all 0.2s', outline: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.16)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          >
            <LogOut size={17} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ════════════════ MAIN AREA ════════════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top header */}
        <header style={{
          padding: '18px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(38,38,38,0.08)',
          position: 'sticky', top: 0, zIndex: 5,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: DARK, letterSpacing: '-0.4px' }}>
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Gold accent badge */}
            <span style={{
              padding: '6px 14px', borderRadius: 99,
              background: `${GOLD}20`, border: `1px solid ${GOLD}50`,
              color: DARK, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              ● Live
            </span>
            <button style={{ padding: 9, background: WHITE, border: '1px solid #e5e7eb', borderRadius: 10, cursor: 'pointer', display: 'flex' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.background = WHITE}
            >
              <Bell size={17} color="#6b7280" />
            </button>
            <button style={{ padding: 9, background: WHITE, border: '1px solid #e5e7eb', borderRadius: 10, cursor: 'pointer', display: 'flex' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.background = WHITE}
            >
              <Settings size={17} color="#6b7280" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div>
              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 18, marginBottom: 28 }}>
                {STATS.map(({ label, value, change, up, icon: Icon }, i) => (
                  <div
                    key={label}
                    style={{
                      background: WHITE, borderRadius: 20,
                      padding: '24px 26px',
                      border: '1px solid rgba(38,38,38,0.07)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.09)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 14,
                        background: i === 0 ? GOLD : `${GOLD}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={20} color={i === 0 ? DARK : DARK} strokeWidth={2} />
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: up ? '#16a34a' : '#dc2626',
                        background: up ? '#f0fdf4' : '#fef2f2',
                        padding: '4px 10px', borderRadius: 99,
                      }}>
                        {change}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: DARK, letterSpacing: '-1px' }}>{value}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Activity + Quick Actions row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>

                {/* Recent Activity */}
                <div style={{ background: WHITE, borderRadius: 20, padding: '26px', border: '1px solid rgba(38,38,38,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 4, height: 20, background: GOLD, borderRadius: 99 }} />
                      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: DARK }}>Recent Activity</h2>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: DARK, cursor: 'pointer', borderBottom: `1.5px solid ${GOLD}` }}>
                      View all
                    </span>
                  </div>
                  {[
                    { action: 'New user registered',        detail: 'anna.silva@campus.edu',     time: '2 min ago',  dot: GOLD },
                    { action: 'Facility booking approved',  detail: 'Lab B — Floor 3',           time: '18 min ago', dot: DARK },
                    { action: 'Resource flagged for review',detail: 'CS301 Lecture Notes',       time: '45 min ago', dot: GOLD },
                    { action: 'Maintenance ticket opened',  detail: 'Projector fault — Hall A',  time: '1 hr ago',   dot: '#ef4444' },
                    { action: 'User role updated',          detail: 'john.doe → LECTURER',       time: '2 hr ago',   dot: DARK },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingBottom: 16, marginBottom: 16, borderBottom: i < 4 ? '1px solid #f3f4f6' : 'none' }}>
                      <div style={{ width: 9, height: 9, borderRadius: '50%', background: item.dot, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: DARK }}>{item.action}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{item.detail}</p>
                      </div>
                      <span style={{ fontSize: 11, color: '#d1d5db', fontWeight: 500, whiteSpace: 'nowrap' }}>{item.time}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Actions — Gold/Dark theme matching About CTA sections */}
                <div style={{ background: DARK, borderRadius: 20, padding: '26px', border: `1px solid ${GOLD}20` }}>
                  {/* Grid overlay decoration */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 20, overflow: 'hidden', pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(rgba(250,204,21,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.07) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }} />
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                      <div style={{ width: 4, height: 20, background: GOLD, borderRadius: 99 }} />
                      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: WHITE }}>Quick Actions</h2>
                    </div>
                    {[
                      { label: 'Manage Users',         sub: 'Add, edit or remove users',   tab: 'users',       icon: Users     },
                      { label: 'View Facilities',      sub: 'Bookings & availability',      tab: 'facilities',  icon: Building2 },
                      { label: 'Review Resources',     sub: 'Approve or flag content',      tab: 'resources',   icon: BookOpen  },
                      { label: 'Maintenance Tickets',  sub: 'Open incidents & faults',      tab: 'maintenance', icon: Wrench    },
                    ].map(({ label, sub, tab, icon: Icon }) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          width: '100%', background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(250,204,21,0.12)',
                          borderRadius: 14, padding: '13px 15px', marginBottom: 10,
                          cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.2s ease',
                          fontFamily: "'Poppins', sans-serif",
                          outline: 'none',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${GOLD}18`; e.currentTarget.style.borderColor = `${GOLD}40`; e.currentTarget.style.transform = 'translateX(4px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(250,204,21,0.12)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${GOLD}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={17} color={GOLD} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: WHITE }}>{label}</p>
                          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{sub}</p>
                        </div>
                        <ChevronRight size={15} color={`${GOLD}80`} />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom wide stats strip — matches About's #FACC15 strip */}
              <div style={{
                marginTop: 18, borderRadius: 20, overflow: 'hidden',
                background: GOLD, padding: '28px 32px',
                display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.08,
                  backgroundImage: 'repeating-linear-gradient(45deg, #262626 0, #262626 1px, transparent 0, transparent 50%)',
                  backgroundSize: '20px 20px',
                }} />
                {[
                  { value: '12', label: 'Admins Online',    icon: ShieldCheck },
                  { value: '98%', label: 'System Uptime',   icon: TrendingUp  },
                  { value: '47',  label: 'Pending Actions', icon: AlertCircle },
                  { value: '24/7', label: 'Monitoring',     icon: Bell        },
                ].map(({ value, label, icon: Icon }, i) => (
                  <div key={label} style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 8px', borderRight: i < 3 ? `1px solid ${DARK}20` : 'none' }}>
                    <Icon size={20} color={DARK} style={{ marginBottom: 8, opacity: 0.6 }} />
                    <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: DARK, letterSpacing: '-1px' }}>{value}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 700, color: `${DARK}70`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── USERS TAB ── */}
          {activeTab === 'users' && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 99, background: `${GOLD}20`, border: `1px solid ${GOLD}50`, marginBottom: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, display: 'inline-block' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: DARK, textTransform: 'uppercase', letterSpacing: '0.12em' }}>User Management</span>
                </div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: DARK }}>System Users</h2>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Manage accounts, roles, and permissions across the platform</p>
              </div>
              <UserManagement />
            </div>
          )}

          {/* ── PLACEHOLDER TABS ── */}
          {['facilities', 'resources', 'maintenance'].includes(activeTab) && (() => {
            const tab = TABS.find(t => t.id === activeTab);
            const Icon = tab?.icon;
            return (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '80px 40px', background: WHITE, borderRadius: 24,
                border: `2px dashed ${GOLD}40`, textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 20,
                  background: `${GOLD}15`,
                  border: `2px solid ${GOLD}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
                }}>
                  {Icon && <Icon size={30} color={DARK} />}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 99, background: `${GOLD}15`, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: DARK, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{tab?.label}</span>
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, color: DARK }}>{tab?.label} Module</h3>
                <p style={{ margin: 0, fontSize: 14, color: '#9ca3af', fontWeight: 500, maxWidth: 320, lineHeight: 1.7 }}>
                  This section is under development and will be available in the next release.
                </p>
              </div>
            );
          })()}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;