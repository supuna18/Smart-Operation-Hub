import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:8081/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      console.error('Login Error:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Please check if the backend is running on port 8081.');
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
      const response = await axios.post('http://localhost:8081/api/auth/google', {
        token: credentialResponse.credential,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FACC15] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 -right-20 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-16 h-16 bg-[#FACC15] rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-yellow-500/20 mb-4"
          >
            <Lock className="w-8 h-8 text-[#262626]" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Please enter your details to sign in</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLocalLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
            <div className="relative group">
              <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#FACC15] transition-colors" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:border-[#FACC15] focus:ring-4 focus:ring-[#FACC15]/10 transition-all font-medium"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <a href="#" className="text-sm text-yellow-600 font-semibold hover:text-yellow-700 transition-colors">Forgot password?</a>
            </div>
            <div className="relative group">
              <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#FACC15] transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl py-3 pl-12 pr-12 outline-none focus:bg-white focus:border-[#FACC15] focus:ring-4 focus:ring-[#FACC15]/10 transition-all font-medium"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#262626] text-[#FACC15] rounded-xl py-3.5 font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gray-200 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-[1px] bg-gray-200 flex-1"></div>
          <span className="text-gray-400 text-sm font-medium">Or continue with</span>
          <div className="h-[1px] bg-gray-200 flex-1"></div>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Sign-In failed')}
            useOneTap
            shape="pill"
            theme="filled_blue"
            size="large"
            text="continue_with"
            width="100%"
          />
        </div>

        <p className="text-center mt-8 text-gray-600 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-yellow-600 font-bold hover:underline decoration-2 underline-offset-4">
            Sign up now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
