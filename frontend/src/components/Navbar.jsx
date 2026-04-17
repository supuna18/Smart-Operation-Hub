import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, User as UserIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuth, getUser, isAdmin, isLoggedIn } from '../utils/auth';
import api from '../utils/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const user = getUser();
  const loggedIn = isLoggedIn();
  const admin = isAdmin();

  useEffect(() => {
    if (loggedIn && user?.id) {
      fetchNotifications();
      // Polling for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [loggedIn, user?.id]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/notifications/${user.id}`);
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
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services', isHash: true },
    { name: 'About', path: '/about' }
  ];

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-5 sticky top-0 bg-white/70 backdrop-blur-xl z-50 border-b border-gray-200/30 font-poppins transition-all">
      <Link to="/" className="text-2xl font-bold tracking-tight text-[#262626]">
        Smart<span className="text-[#FACC15]">Sync</span>
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-10 font-medium items-center">
        {navLinks.map((link) => {
          const isActive = currentPath === link.path || (link.isHash && location.hash === link.path.split('#')[1]);
          return (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`relative transition-colors ${isActive ? 'text-[#262626]' : 'text-[#262626]/60 hover:text-[#262626]'}`}
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
        {admin && (
          <Link 
            to="/AdminDashboard" 
            className={`relative transition-colors font-semibold ${currentPath === '/AdminDashboard' ? 'text-[#262626]' : 'text-[#262626]/60 hover:text-[#262626]'}`}
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
        <div className="flex items-center space-x-6">
          {!loggedIn ? (
            <>
              <Link to="/login" className="text-[#262626] font-semibold hover:text-[#FACC15] transition-colors">
                Login
              </Link>
              <Link to="/signup" className="bg-[#FACC15] text-[#262626] px-7 py-2.5 rounded-full font-bold shadow-lg shadow-[#FACC15]/20 hover:shadow-[#FACC15]/40 hover:-translate-y-0.5 transition-all">
                Get Started
              </Link>
            </>
          ) : (
            <>
              {/* Notification Bell */}
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

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-[60]"
                    >
                      <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-[#262626]">Notifications</h3>
                        <span className="text-xs text-gray-400">{unreadCount} unread</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-400 text-sm">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={() => markAsRead(n.id)}
                              className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-yellow-50/30' : ''}`}
                            >
                              <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                {n.message}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">{n.type}</span>
                                <span className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile Link */}
              <Link 
                to="/profile" 
                className="flex items-center gap-2 p-1.5 pr-4 hover:bg-gray-50 rounded-full transition-colors border border-transparent hover:border-gray-100"
              >
                <div className="w-8 h-8 bg-[#FACC15] rounded-full flex items-center justify-center font-bold text-[#262626] text-xs">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-[#262626] hidden lg:block">{user?.username}</span>
              </Link>


            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-[#262626] hover:bg-gray-100 p-2 rounded-lg transition-colors">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl flex flex-col p-6 md:hidden space-y-4"
          >
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className={`font-semibold p-4 rounded-2xl transition-all ${isActive ? 'bg-yellow-50 text-[#FACC15]' : 'text-[#262626] hover:bg-gray-50'}`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="flex flex-col space-y-3 pt-2">
              {!loggedIn ? (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-[#262626] text-center font-semibold p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="bg-[#FACC15] text-[#262626] px-6 py-3 rounded-xl font-bold shadow-md inline-flex justify-center w-full">
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  {admin && (
                    <Link to="/AdminDashboard" onClick={() => setIsOpen(false)} className="text-[#262626] text-center font-semibold p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                      Admin Dashboard
                    </Link>
                  )}

                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;