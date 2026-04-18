import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell } from 'lucide-react';
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

  const isAdminView = currentPath === '/AdminDashboard';

  // Fetch notifications
  useEffect(() => {
    if (loggedIn && user?.id) {
      fetchNotifications();
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
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const navLinks = admin ? [] : [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services', isHash: true },
    { name: 'About', path: '/about' },
    ...(loggedIn ? [{ name: 'Tickets', path: '/tickets' }] : [])
  ];

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-5 sticky top-0 bg-white/70 backdrop-blur-xl z-50 border-b border-gray-200/30 font-poppins transition-all">

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
                      className="absolute right-0 mt-3 w-80 bg-white border shadow-2xl rounded-2xl overflow-hidden z-[60]"
                    >
                      <div className="p-4 border-b flex justify-between">
                        <h3 className="font-bold">Notifications</h3>
                        <span className="text-xs text-gray-400">
                          {unreadCount} unread
                        </span>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-400">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markAsRead(n.id)}
                              className={`p-4 border-b cursor-pointer ${
                                !n.read ? 'bg-yellow-50' : ''
                              }`}
                            >
                              <p className={!n.read ? 'font-semibold' : ''}>
                                {n.message}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <Link to="/profile" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FACC15] rounded-full flex items-center justify-center text-xs font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:block font-semibold">
                  {user?.username}
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="font-semibold hover:text-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="absolute top-full left-0 w-full bg-white p-6 flex flex-col space-y-4 md:hidden">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}>
                {link.name}
              </Link>
            ))}

            {loggedIn && (
              <button onClick={handleLogout}>Logout</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;