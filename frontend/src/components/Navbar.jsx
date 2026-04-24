import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuth, getUser, isAdmin, isLoggedIn, getToken } from '../utils/auth';
import api from '../utils/api';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const user = getUser();
  const loggedIn = isLoggedIn();
  const admin = isAdmin();

  const isAdminView = currentPath === '/AdminDashboard';

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/notifications/${user.email}`);
      setNotifications(response.data);
      const unread = response.data.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch(`/notifications/mark-all-read/${user.email}`);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'RESOURCE_APPROVED':
        return <div className="p-2 bg-green-100 text-green-600 rounded-full"><Bell size={16} /></div>;
      case 'RESOURCE_REJECTED':
        return <div className="p-2 bg-red-100 text-red-600 rounded-full"><Bell size={16} /></div>;
      case 'TICKET_RESOLVED':
        return <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Bell size={16} /></div>;
      default:
        return <div className="p-2 bg-yellow-100 text-[#FACC15] rounded-full"><Bell size={16} /></div>;
    }
  };

  // Fetch and Setup WebSocket for Real-time Notifications
  useEffect(() => {
    if (loggedIn && user?.email) {
      fetchNotifications();

      // Setup WebSocket
      const socket = new SockJS('http://localhost:8082/ws');
      const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          'Authorization': `Bearer ${getToken()}`
        },
        onConnect: () => {
          console.log('Connected to WebSocket');
          stompClient.subscribe('/user/queue/notifications', (message) => {
            const newNotif = JSON.parse(message.body);
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);
            setToast(newNotif.message);
            
            // Auto hide toast
            setTimeout(() => setToast(null), 6000);
          });
        },
        onStompError: (frame) => {
          console.error('STOMP error', frame);
        }
      });

      stompClient.activate();

      return () => {
        if (stompClient.active) {
          stompClient.deactivate();
        }
      };
    }
  }, [loggedIn, user?.email]);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const navLinks = admin ? [] : [
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Services', path: '/#services', isHash: true },
    { name: 'About', path: '/about' },
    ...(loggedIn ? [{ name: 'Tickets', path: '/tickets' }] : [])
  ];

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-5 sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-gray-200/50 font-poppins transition-all">

      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-tight text-[#262626]">
        Smart<span className="text-[#FACC15]">Sync</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-10 font-medium items-center">
        {!isAdminView && navLinks.map((link) => {
          const isActive =
            currentPath === link.path ||
            (link.isHash && location.hash === link.path.split('#')[1]);

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`relative transition-colors ${
                isActive
                  ? 'text-[#262626]'
                  : 'text-[#262626]/60 hover:text-[#262626]'
              }`}
            >
              {link.name}
              {isActive && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#FACC15] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}

        {/* Admin Dashboard */}
        {admin && (
          <Link
            to="/AdminDashboard"
            className={`relative transition-colors font-semibold ${
              currentPath === '/AdminDashboard'
                ? 'text-[#262626]'
                : 'text-[#262626]/60 hover:text-[#262626]'
            }`}
          >
            Admin Dashboard
            {currentPath === '/AdminDashboard' && (
              <motion.div
                layoutId="navUnderline"
                className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#FACC15] rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        )}

        {/* Auth Section */}
        <div className="flex items-center space-x-6">
          {!loggedIn ? (
            <>
              <Link
                to="/login"
                className="text-[#262626] font-semibold hover:text-[#FACC15] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-[#FACC15] text-[#262626] px-7 py-2.5 rounded-full font-bold shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors relative group"
                >
                  <Bell size={22} className={`transition-colors ${unreadCount > 0 ? 'text-[#FACC15]' : 'text-[#262626]'}`} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-[350px] bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl overflow-hidden z-[60]"
                    >
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                          <h3 className="font-bold text-gray-900">Notifications</h3>
                          <p className="text-[11px] text-gray-500 font-medium">{unreadCount} new alerts</p>
                        </div>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-[11px] font-bold text-[#FACC15] hover:text-[#eab308] transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-10 text-center flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                              <Bell size={20} className="text-gray-300" />
                            </div>
                            <p className="text-sm text-gray-400 font-medium">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markAsRead(n.id)}
                              className={`p-4 border-b border-gray-50 cursor-pointer transition-colors flex gap-4 hover:bg-gray-50/80 ${
                                !n.read ? 'bg-yellow-50/30' : ''
                              }`}
                            >
                              <div className="mt-0.5">
                                {getNotificationIcon(n.type)}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1.5 font-medium flex items-center gap-1">
                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  {timeAgo(n.createdAt)}
                                </p>
                              </div>
                              {!n.read && (
                                <div className="w-2 h-2 bg-[#FACC15] rounded-full mt-2 shadow-sm"></div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-3 border-t border-gray-100 bg-gray-50/30 text-center">
                        <button className="text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider">
                          View All Activity
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <Link to="/profile" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-gradient-to-tr from-[#FACC15] to-[#fde047] rounded-full flex items-center justify-center text-xs font-bold text-[#262626] shadow-sm group-hover:shadow-md transition-all">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs text-gray-400 font-medium leading-none mb-0.5">Welcome back,</p>
                  <p className="font-bold text-sm text-[#262626] leading-none">{user?.username}</p>
                </div>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="font-bold text-sm text-gray-400 hover:text-red-500 transition-colors ml-2"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden flex items-center gap-4">
        {loggedIn && (
           <div className="relative">
           <button
             onClick={() => setShowNotifications(!showNotifications)}
             className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
           >
             <Bell size={22} className="text-[#262626]" />
             {unreadCount > 0 && (
               <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                 {unreadCount}
               </span>
             )}
           </button>
         </div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="p-1">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b shadow-xl p-6 flex flex-col space-y-5 md:hidden z-40"
          >
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-lg font-semibold text-gray-800" onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            ))}

            {admin && (
              <Link to="/AdminDashboard" className="text-lg font-bold text-[#FACC15]" onClick={() => setIsOpen(false)}>
                Admin Dashboard
              </Link>
            )}

            {loggedIn ? (
              <div className="pt-4 border-t flex flex-col gap-4">
                <Link to="/profile" className="font-bold text-gray-800" onClick={() => setIsOpen(false)}>My Profile</Link>
                <button onClick={handleLogout} className="text-left font-bold text-red-500">Logout</button>
              </div>
            ) : (
              <div className="pt-4 border-t flex flex-col gap-4">
                <Link to="/login" className="font-bold text-gray-800" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/signup" className="bg-[#FACC15] text-[#262626] py-3 rounded-xl font-bold text-center" onClick={() => setIsOpen(false)}>Get Started</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[100] bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl p-5 rounded-2xl flex items-center gap-4 min-w-[320px] max-w-md"
          >
            <div className="bg-yellow-50 p-2.5 rounded-full shadow-inner">
              <Bell className="text-[#FACC15]" size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-[#FACC15] uppercase tracking-wider">New Update</p>
                <button 
                  onClick={() => setToast(null)}
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-snug">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;