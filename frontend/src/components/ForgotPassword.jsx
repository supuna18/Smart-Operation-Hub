import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Key, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:8082/api/auth/forgot-password', { email });
            setMessage('OTP sent to your email.');
            setStep(2);
            setTimer(60); // 60 seconds resend timer
        } catch (err) {
            setError(err.response?.data || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length < 6) {
            setError('Please enter the full 6-digit OTP.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:8082/api/auth/verify-otp', { email, otp: otpString });
            setStep(3);
        } catch (err) {
            setError(err.response?.data || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:8082/api/auth/reset-password', {
                email,
                otp: otp.join(''),
                newPassword
            });
            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        if (timer > 0) return;
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:8082/api/auth/forgot-password', { email });
            setMessage('OTP resent successfully.');
            setTimer(60);
        } catch (err) {
            setError('Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FACC15] rounded-full blur-3xl opacity-20"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-30"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl border rounded-2xl shadow-2xl p-8 relative z-10"
            >
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-[#FACC15] rounded-2xl mx-auto flex items-center justify-center mb-4">
                        {step === 1 && <Mail className="w-8 h-8 text-[#262626]" />}
                        {step === 2 && <Key className="w-8 h-8 text-[#262626]" />}
                        {step === 3 && <Lock className="w-8 h-8 text-[#262626]" />}
                    </div>
                    <h2 className="text-3xl font-bold">
                        {step === 1 && 'Forgot Password'}
                        {step === 2 && 'Verify OTP'}
                        {step === 3 && 'Reset Password'}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {step === 1 && "Enter your email to receive a recovery code"}
                        {step === 2 && `We've sent a 6-digit code to ${email}`}
                        {step === 3 && "Create a new strong password for your account"}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                        <span>{error}</span>
                    </div>
                )}

                {message && !error && (
                    <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl text-sm border border-green-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{message}</span>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.form
                            key="step1"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onSubmit={handleEmailSubmit}
                            className="space-y-5"
                        >
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#FACC15] outline-none transition-all"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#262626] text-[#FACC15] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                    <>
                                        Send OTP <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.form
                            key="step2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onSubmit={handleOtpSubmit}
                            className="space-y-6"
                        >
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className="w-12 h-14 border-2 rounded-xl text-center text-xl font-bold focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-100 outline-none transition-all"
                                    />
                                ))}
                            </div>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={resendOtp}
                                    disabled={timer > 0 || loading}
                                    className="text-sm font-semibold text-gray-500 hover:text-[#262626] disabled:opacity-50"
                                >
                                    {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive code? Resend"}
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#262626] text-[#FACC15] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Verify Code"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-gray-500 text-sm font-semibold flex items-center justify-center gap-1 hover:text-[#262626]"
                            >
                                <ArrowLeft className="w-4 h-4" /> Change Email
                            </button>
                        </motion.form>
                    )}

                    {step === 3 && (
                        <motion.form
                            key="step3"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onSubmit={handlePasswordSubmit}
                            className="space-y-5"
                        >
                            <div>
                                <label className="text-sm font-semibold mb-2 block">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#FACC15] outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#FACC15] outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#262626] text-[#FACC15] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Reset Password"}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <p className="text-center mt-8 text-gray-500 text-sm">
                    Remember your password? <Link to="/login" className="text-[#262626] font-bold hover:underline">Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
