import React, { useState, useRef, useEffect } from 'react';
import { getUser, clearAuth } from '../utils/auth';
import UserManagement from './admin/UserManagement';
import ResourceManagement from './resources/ResourceManagement';
import {
  Users, Building2, Wrench, BookOpen, LayoutDashboard,
  ChevronRight, ShieldCheck, Bell, Settings, LogOut,
  TrendingUp, AlertCircle, Menu, X, ChevronLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TicketApprovalHub from './TicketApprovalHub';

/* ── Brand tokens ── */
const G = '#FACC15';   // Gold
const D = '#2d3436';   // Professional Dark Gray (Lighter than Footer #262626)
const W = '#FFFFFF';   // White

const TABS = [
  { id: 'overview',    label: 'Overview',    icon: LayoutDashboard },
  { id: 'users',       label: 'Users',        icon: Users           },
  { id: 'facilities',  label: 'Facilities',   icon: Building2       },
  { id: 'resources',   label: 'Resources',    icon: BookOpen        },
  { id: 'tickets',     label: 'Tickets',      icon: Wrench          },
];

const STATS = [
  { label: 'Total Users',      value: '1,284', change: '+12%', up: true,  icon: Users     },
  { label: 'Facilities',       value: '48',    change: '+3%',  up: true,  icon: Building2 },
  { label: 'Active Resources', value: '326',   change: '+8%',  up: true,  icon: BookOpen  },
  { label: 'Open Tickets',     value: '17',    change: '-5%',  up: false, icon: Wrench    },
];

const STRIP = [
  { value: '12',   label: 'Admins Online',   icon: ShieldCheck },
  { value: '98%',  label: 'System Uptime',   icon: TrendingUp  },
  { value: '47',   label: 'Pending Actions', icon: AlertCircle },
  { value: '24/7', label: 'Monitoring',      icon: Bell        },
];

const QUICK = [
  { label: 'Manage Users',        sub: 'Add, edit or remove users',  tab: 'users',       icon: Users     },
  { label: 'View Facilities',     sub: 'Bookings & availability',     tab: 'facilities',  icon: Building2 },
  { label: 'Review Resources',    sub: 'Approve or flag content',     tab: 'resources',   icon: BookOpen  },
  { label: 'Maintenance Tickets', sub: 'Open incidents & faults',     tab: 'tickets',     icon: Wrench    },
];

/* ── Responsive CSS ── */
const CSS = `
  .adm-wrap{
    display:flex;
    font-family:'Poppins',sans-serif;
    background:#FAFAF8;
    height:calc(100vh - 73px);
    overflow:hidden;
  }
  .adm-main{
    flex:1;
    display:flex;
    flex-direction:column;
    min-width:0;
    overflow-y:auto;
    scroll-behavior:smooth;
  }

  /* ── SIDEBAR (default = desktop) ── */
  .adm-sb{
    flex-shrink:0;
    background:${D};
    display:flex;
    flex-direction:column;
    border-right:1px solid rgba(250,204,21,.12);
    z-index:40;
    transition:width .4s cubic-bezier(0.4, 0, 0.2, 1), transform .4s ease, opacity .3s ease;
    will-change: width, transform, opacity;
    width:260px;
    height: 100%;
    align-self:flex-start;
    overflow-y:auto;
  }
  .adm-sb.collapsed{width:80px;}
  .adm-sb.hidden-sb{width:0; opacity: 0; border-right: none;}

  /* ── MOBILE (≤ 900px): slide-over drawer ── */
  @media(max-width:900px){
    .adm-sb{
      position:fixed;
      top:0;
      left:0;
      height:100vh;
      width:260px!important;
      transform:translateX(-100%);
      z-index:200;
      opacity: 1!important;
    }
    .adm-sb.sb-open{transform:translateX(0);}
    .adm-sb.hidden-sb{width:260px!important; opacity: 1!important;}
    .adm-overlay.active{display:block;}
    .desktop-only{display:none!important;}
    .mobile-only{display:flex!important;}
    .adm-tabs-bar{display:flex!important;}
  }

  /* ── DESKTOP (> 900px): sticky sidebar ── */
  @media(min-width:901px){
    .adm-sb{
      position:relative;
      transform:none!important;
    }
    .adm-overlay{display:none!important;}
    .mobile-only{display:none!important;}
    .desktop-only{display:flex!important;}
    .adm-tabs-bar{display:none!important;}
  }

  /* Overlay backdrop */
  .adm-overlay{
    display:none;
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.55);
    z-index:150;
  }

  /* ── Mobile horizontal tab bar ── */
  .adm-tabs-bar{
    display:none;
    overflow-x:auto;
    gap:8px;
    padding:10px 14px;
    background:${D};
    border-bottom:1px solid rgba(250,204,21,.15);
    scrollbar-width:none;
    flex-shrink:0;
    align-items:center;
  }
  .adm-tabs-bar::-webkit-scrollbar{display:none;}

  /* Content padding — responsive */
  .adm-content{flex:1;padding:14px;}
  @media(min-width:480px){.adm-content{padding:18px;}}
  @media(min-width:640px){.adm-content{padding:22px;}}
  @media(min-width:901px){.adm-content{padding:26px 30px;}}

  /* Stats grid: 2-col mobile → 4-col desktop */
  .stats-grid{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:12px;
    margin-bottom:16px;
  }
  @media(min-width:480px){.stats-grid{gap:14px;}}
  @media(min-width:901px){.stats-grid{grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:22px;}}

  /* Custom scrollbar for professional look */
  .adm-main::-webkit-scrollbar {
    width: 6px;
  }
  .adm-main::-webkit-scrollbar-track {
    background: transparent;
  }
  .adm-main::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.05);
    border-radius: 10px;
  }
  .adm-main::-webkit-scrollbar-thumb:hover {
    background: rgba(0,0,0,0.1);
  }

  /* Overview bottom row */
  .overview-row{display:grid;grid-template-columns:1fr;gap:16px;margin-bottom:16px;}
  @media(min-width:901px){.overview-row{grid-template-columns:1fr 298px;}}

  /* Gold strip */
  .strip-grid{display:grid;grid-template-columns:repeat(2,1fr);}
  @media(min-width:901px){.strip-grid{grid-template-columns:repeat(4,1fr);}}
  .strip-cell{border-right:1px solid rgba(38,38,38,.14);border-bottom:1px solid rgba(38,38,38,.14);}
  .strip-cell:nth-child(2n){border-right:none;}
  .strip-cell:nth-child(n+3){border-bottom:none;}
  @media(min-width:901px){
    .strip-cell{border-bottom:none;border-right:1px solid rgba(38,38,38,.14);}
    .strip-cell:last-child{border-right:none;}
    .strip-cell:nth-child(2n){border-right:1px solid rgba(38,38,38,.14);}
    .strip-cell:last-child{border-right:none;}
  }

  /* Micro-interactions */
  .stat-card{transition:transform .2s,box-shadow .2s;cursor:default;}
  .stat-card:hover{transform:translateY(-4px);box-shadow:0 10px 28px rgba(0,0,0,.1)!important;}
  .nav-btn{transition:all .2s ease; display: flex; align-items: center;}
  .nav-btn:hover{background:rgba(255,255,255,.07)!important;color:#fff!important;}
  .quick-btn{transition:all .18s ease;}
  .quick-btn:hover{background:rgba(250,204,21,.13)!important;border-color:rgba(250,204,21,.35)!important;transform:translateX(4px);}
  .tab-pill{transition:all .18s ease;}
  .tab-pill:hover{opacity:.9;}
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab]         = useState('overview');
  const [sbCollapsed, setSbCollapsed]     = useState(false);
  const [sbHidden, setSbHidden]           = useState(false);
  const [sbMobileOpen, setSbMobileOpen]   = useState(false);
  const [addTrigger, setAddTrigger]       = useState(0);
  
  const mainRef     = useRef(null);
  const navigate    = useNavigate();
  const currentUser = getUser();

  // Smooth scroll to top on tab change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const logout = () => { clearAuth(); navigate('/login'); };
  const goTab  = (id) => { 
    setActiveTab(id); 
    setSbMobileOpen(false);
  };

  return (
    <>
      <style>{CSS}</style>

      {/* Mobile overlay */}
      <div
        className={`adm-overlay ${sbMobileOpen ? 'active' : ''}`}
        onClick={() => setSbMobileOpen(false)}
      />

      <div className="adm-wrap">

        {/* ══════════════ SIDEBAR ══════════════ */}
        <aside className={`adm-sb ${sbCollapsed ? 'collapsed' : ''} ${sbHidden ? 'hidden-sb' : ''} ${sbMobileOpen ? 'sb-open' : ''}`}>

          {/* Logo row */}
          <div style={{ padding: '22px 16px 18px', borderBottom: '1px solid rgba(250,204,21,.1)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 12px ${G}55` }}>
                  <ShieldCheck size={18} color={D} strokeWidth={2.5} />
                </div>
                {!sbCollapsed && (
                  <span style={{ 
                    color: W, 
                    fontWeight: 800, 
                    fontSize: 14.5, 
                    letterSpacing: '-0.3px', 
                    whiteSpace: 'nowrap',
                    opacity: 1,
                    transform: 'translateX(0)',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                  }}>
                    Smart<span style={{ color: G }}>Sync</span> Admin
                  </span>
                )}
              </div>

              {/* Desktop collapse/hide controls */}
              <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button 
                  onClick={() => setSbCollapsed(p => !p)}
                  title={sbCollapsed ? "Expand" : "Collapse"}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.35)', padding: 4, borderRadius: 7, display: 'flex' }}>
                  {sbCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                </button>
                <button 
                  onClick={() => setSbHidden(true)}
                  title="Hide Sidebar"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.35)', padding: 4, borderRadius: 7, display: 'flex' }}>
                  <X size={15} />
                </button>
              </div>

              {/* Mobile close button */}
              <button className="mobile-only"
                onClick={() => setSbMobileOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.45)', padding: 4 }}>
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Section label */}
          {!sbCollapsed && (
            <div style={{ padding: '14px 18px 4px', flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>
                Navigation
              </span>
            </div>
          )}

          {/* Nav links */}
          <nav style={{ padding: '4px 10px', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            {TABS.map(({ id, label, icon: Icon }) => {
              const on = activeTab === id;
              return (
                <button key={id} className="nav-btn"
                  onClick={() => goTab(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 0,
                    width: '100%', padding: '11px 12px',
                    borderRadius: 10, border: 'none', cursor: 'pointer',
                    marginBottom: 3, background: on ? `${G}1A` : 'transparent',
                    color: on ? G : 'rgba(255,255,255,.48)',
                    fontFamily: "'Poppins',sans-serif", fontWeight: on ? 700 : 500,
                    fontSize: 13.5, position: 'relative', outline: 'none',
                    whiteSpace: 'nowrap', textAlign: 'left',
                    overflow: 'hidden'
                  }}>
                  {on && <span style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: G, borderRadius: 99 }} />}
                  <div style={{ width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} strokeWidth={on ? 2.5 : 1.8} />
                  </div>
                  {!sbCollapsed && (
                    <span style={{ 
                      opacity: 1, 
                      transform: 'translateX(0)',
                      transition: 'opacity 0.2s ease, transform 0.2s ease',
                      marginLeft: 4
                    }}>
                      {label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User card + logout */}
          <div style={{ padding: '12px 10px 18px', borderTop: '1px solid rgba(250,204,21,.08)', flexShrink: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 0,
              padding: '10px 12px',
              borderRadius: 10, background: 'rgba(255,255,255,.04)', marginBottom: 8,
              overflow: 'hidden'
            }}>
              <div style={{ width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: D }}>
                  {currentUser?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
              {!sbCollapsed && (
                <div style={{ 
                  overflow: 'hidden', 
                  flex: 1,
                  opacity: 1,
                  transform: 'translateX(0)',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  marginLeft: 4
                }}>
                  <p style={{ margin: 0, color: W, fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentUser?.username}
                  </p>
                  <p style={{ margin: 0, color: `${G}AA`, fontSize: 10.5, fontWeight: 600 }}>Administrator</p>
                </div>
              )}
            </div>
            <button onClick={logout}
              style={{
                display: 'flex', alignItems: 'center', gap: 0,
                width: '100%', padding: '10px 12px',
                background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.15)',
                borderRadius: 10, cursor: 'pointer', color: '#f87171',
                fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13,
                transition: 'background .18s, padding .3s ease', outline: 'none',
                overflow: 'hidden'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,.08)'}
            >
              <div style={{ width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LogOut size={16} />
              </div>
              {!sbCollapsed && (
                <span style={{ 
                  opacity: 1, 
                  transform: 'translateX(0)',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  marginLeft: 4,
                  whiteSpace: 'nowrap'
                }}>
                  Logout
                </span>
              )}
            </button>
          </div>
        </aside>

        {/* ══════════════ MAIN AREA ══════════════ */}
        <div className="adm-main" ref={mainRef}>

          {/* Top header */}
          <header style={{
            padding: '14px 18px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', background: 'rgba(255,255,255,.94)',
            backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(38,38,38,.08)',
            position: 'sticky', top: 0, zIndex: 30, flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Sidebar toggle - ALWAYS visible on mobile, visible on desktop if sidebar is hidden */}
              <button className={sbHidden ? "" : "mobile-only"}
                onClick={() => {
                  if (window.innerWidth <= 900) setSbMobileOpen(true);
                  else setSbHidden(false);
                }}
                title="Expand Sidebar"
                style={{ padding: '7px', background: W, border: '1px solid #e5e7eb', borderRadius: 9, cursor: 'pointer', outline: 'none', flexShrink: 0, display: 'flex' }}>
                <Menu size={17} color={D} />
              </button>
              <div>
                <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: D, letterSpacing: '-0.3px' }}>
                  {TABS.find(t => t.id === activeTab)?.label}
                </h1>
                <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {activeTab === 'resources' && (
                <button
                  onClick={() => setAddTrigger(p => p + 1)}
                  style={{
                    padding: '7px 14px',
                    background: D,
                    border: 'none',
                    borderRadius: 9,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: G,
                    fontFamily: "'Poppins',sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                  onMouseLeave={e => e.currentTarget.style.background = D}
                >
                  <BookOpen size={14} strokeWidth={2.5} />
                  Add Resource
                </button>
              )}
              <span style={{ padding: '5px 11px', borderRadius: 99, background: `${G}20`, border: `1px solid ${G}45`, color: D, fontSize: 10.5, fontWeight: 700 }}>
                ● Live
              </span>
              {[Bell, Settings].map((Icon, i) => (
                <button key={i}
                  style={{ padding: 7, background: W, border: '1px solid #e5e7eb', borderRadius: 9, cursor: 'pointer', display: 'flex', outline: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = W}>
                  <Icon size={15} color="#6b7280" />
                </button>
              ))}
            </div>
          </header>

          {/* Mobile tab bar */}
          <div className="adm-tabs-bar">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} className="tab-pill"
                onClick={() => setActiveTab(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 99, border: 'none',
                  cursor: 'pointer', flexShrink: 0, outline: 'none',
                  background: activeTab === id ? G : 'rgba(255,255,255,.08)',
                  color: activeTab === id ? D : 'rgba(255,255,255,.6)',
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: activeTab === id ? 700 : 500, fontSize: 12,
                }}>
                <Icon size={13} strokeWidth={activeTab === id ? 2.5 : 2} />
                {label}
              </button>
            ))}
          </div>

          {/* ── Page Content ── */}
          <div className="adm-content">

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <>
                {/* Stat cards */}
                <div className="stats-grid">
                  {STATS.map(({ label, value, change, up, icon: Icon }, i) => (
                    <div key={label} className="stat-card" style={{
                      background: W, borderRadius: 16, padding: '18px 20px',
                      border: '1px solid rgba(38,38,38,.07)',
                      boxShadow: '0 2px 10px rgba(0,0,0,.04)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 11, background: i === 0 ? G : `${G}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={18} color={D} strokeWidth={2} />
                        </div>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: up ? '#15803d' : '#dc2626', background: up ? '#f0fdf4' : '#fef2f2', padding: '3px 9px', borderRadius: 99 }}>
                          {change}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: D, letterSpacing: '-0.5px' }}>{value}</p>
                      <p style={{ margin: '3px 0 0', fontSize: 10.5, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Activity + Quick actions */}
                <div className="overview-row">

                  {/* Recent Activity */}
                  <div style={{ background: W, borderRadius: 16, padding: '20px 22px', border: '1px solid rgba(38,38,38,.07)', boxShadow: '0 2px 10px rgba(0,0,0,.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 3.5, height: 17, background: G, borderRadius: 99 }} />
                        <h2 style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: D }}>Recent Activity</h2>
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: D, cursor: 'pointer', borderBottom: `1.5px solid ${G}` }}>View all</span>
                    </div>
                    {[
                      { action: 'New user registered',         detail: 'anna.silva@campus.edu',    time: '2 min ago',  dot: G         },
                      { action: 'Facility booking approved',   detail: 'Lab B — Floor 3',          time: '18 min ago', dot: D         },
                      { action: 'Resource flagged for review', detail: 'CS301 Lecture Notes',      time: '45 min ago', dot: G         },
                      { action: 'Maintenance ticket opened',   detail: 'Projector fault — Hall A', time: '1 hr ago',   dot: '#ef4444' },
                      { action: 'User role updated',           detail: 'john.doe → LECTURER',      time: '2 hr ago',   dot: D         },
                    ].map((item, i, arr) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, paddingBottom: 13, marginBottom: 13, borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.dot, marginTop: 5, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5, color: D, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.action}</p>
                          <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#9ca3af', fontWeight: 500 }}>{item.detail}</p>
                        </div>
                        <span style={{ fontSize: 10.5, color: '#d1d5db', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>{item.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div style={{ background: D, borderRadius: 16, padding: '20px 20px', border: `1px solid ${G}18`, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(250,204,21,.05) 1px, transparent 1px), linear-gradient(90deg,rgba(250,204,21,.05) 1px,transparent 1px)`, backgroundSize: '26px 26px', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
                        <div style={{ width: 3.5, height: 17, background: G, borderRadius: 99 }} />
                        <h2 style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: W }}>Quick Actions</h2>
                      </div>
                      {QUICK.map(({ label, sub, tab, icon: Icon }) => (
                        <button key={tab} className="quick-btn"
                          onClick={() => goTab(tab)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 11,
                            width: '100%', background: 'rgba(255,255,255,.05)',
                            border: '1px solid rgba(250,204,21,.13)',
                            borderRadius: 11, padding: '11px 13px', marginBottom: 8,
                            cursor: 'pointer', textAlign: 'left',
                            fontFamily: "'Poppins',sans-serif", outline: 'none',
                          }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${G}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={15} color={G} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5, color: W }}>{label}</p>
                            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,.38)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</p>
                          </div>
                          <ChevronRight size={13} color={`${G}70`} style={{ flexShrink: 0 }} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gold stats strip */}
                <div style={{ borderRadius: 16, overflow: 'hidden', background: G, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: .07, backgroundImage: 'repeating-linear-gradient(45deg,#262626 0,#262626 1px,transparent 0,transparent 50%)', backgroundSize: '18px 18px' }} />
                  <div className="strip-grid" style={{ position: 'relative', zIndex: 1 }}>
                    {STRIP.map(({ value, label, icon: Icon }, i) => (
                      <div key={label} className="strip-cell" style={{ textAlign: 'center', padding: '20px 8px' }}>
                        <Icon size={17} color={D} style={{ opacity: .55, marginBottom: 6, display: 'block', margin: '0 auto 6px' }} />
                        <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: D, letterSpacing: '-1px', lineHeight: 1 }}>{value}</p>
                        <p style={{ margin: '5px 0 0', fontSize: 9.5, fontWeight: 700, color: `${D}65`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── USERS ── */}
            {activeTab === 'users' && (
              <div>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 99, background: `${G}20`, border: `1px solid ${G}45`, marginBottom: 8 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: G, display: 'inline-block' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: D, textTransform: 'uppercase', letterSpacing: '0.12em' }}>User Management</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: D }}>System Users</h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#9ca3af', fontWeight: 500 }}>Manage accounts, roles, and permissions</p>
                </div>
                <UserManagement />
              </div>
            )}

            {activeTab === 'tickets' && (
              <div>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 99, background: `${G}20`, border: `1px solid ${G}45`, marginBottom: 8 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: G, display: 'inline-block' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: D, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Incident Management</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: D }}>Maintenance Ticketing</h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#9ca3af', fontWeight: 500 }}>Review and manage campus infrastructure issues</p>
                </div>
                <TicketApprovalHub isEmbedded={true} />
              </div>
            )}

            {activeTab === 'resources' && (
              <div>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 99, background: `${G}20`, border: `1px solid ${G}45`, marginBottom: 8 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: G, display: 'inline-block' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: D, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Resource Management</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: D }}>Facilities & Assets</h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#9ca3af', fontWeight: 500 }}>Register and manage campus resources</p>
                </div>
                <ResourceManagement isEmbedded={true} onAddTrigger={addTrigger} />
              </div>
            )}

            {/* ── EMPTY TABS ── */}
            {['facilities'].includes(activeTab) && (() => {
              const tab = TABS.find(t => t.id === activeTab);
              const Icon = tab?.icon;
              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: W, borderRadius: 20, border: `2px dashed ${G}35`, textAlign: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: 16, background: `${G}15`, border: `2px solid ${G}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    {Icon && <Icon size={26} color={D} />}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 99, background: `${G}15`, marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: D, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{tab?.label}</span>
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: D }}>{tab?.label} Module</h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#9ca3af', fontWeight: 500, maxWidth: 290, lineHeight: 1.7 }}>
                    This section is under development and will be available in the next release.
                  </p>
                </div>
              );
            })()}

          </div>{/* adm-content */}
        </div>{/* adm-main */}
      </div>{/* adm-wrap */}
    </>
  );
};

export default AdminDashboard;