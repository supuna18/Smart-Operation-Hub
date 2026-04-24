import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { setAuthData } from '../utils/auth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocalLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8082/api/auth/login', formData);

      // ✅ Store auth data centrally
      setAuthData(response.data.token, response.data.user);

      // ✅ Role-based navigation
      if (response.data.user.role === 'Admin') {
        navigate('/AdminDashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('Login Error:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Please check if the backend is running on port 8082.');
      } else {
        setError(err.response?.data || 'Failed to login. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8082/api/auth/google', {
        token: credentialResponse.credential,
      });

      // ✅ Store auth data centrally
      setAuthData(response.data.token, response.data.user);

      // ✅ Role-based navigation
      if (response.data.user.role === 'Admin') {
        navigate('/AdminDashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FACC15] rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-20 -right-20 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl border rounded-2xl shadow-2xl p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FACC15] rounded-2xl mx-auto flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-[#262626]" />
          </div>
          <h2 className="text-3xl font-bold text-[#FACC15]">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Please enter your details</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLocalLogin} className="space-y-5">
          <div>
            <label className="text-sm font-semibold">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border rounded-xl py-3 pl-10 pr-4"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full border rounded-xl py-3 pl-10 pr-10"
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <Link to="/forgot-password" title='Forgot Password' className="text-sm font-semibold text-[#FACC15] hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-yellow-400 py-3 rounded-xl flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Sign-In failed')}
          />
        </div>

        <p className="text-center mt-6">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;