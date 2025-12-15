import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthPages = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', isAdmin: false });
    const [error, setError] = useState('');

    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get redirect path from query string
    const redirect = new URLSearchParams(location.search).get('redirect') || '/';

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                if (!formData.email || !formData.password) {
                    setError('Please fill all fields');
                    return;
                }
                await login(formData.email, formData.password);
                navigate(redirect);
            } else {
                if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
                    setError('Please fill all fields');
                    return;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }
                // Register logic
                await register(formData.name, formData.email, formData.password, formData.isAdmin);
                alert('Registration Successful! Please login.');
                setIsLogin(true); // Switch to login view or auto-login
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-700 via-amber-600 to-amber-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">🍰</div>
                        <h2 className="text-3xl font-bold text-amber-800 mb-2">
                            {isLogin ? 'Welcome Back' : 'Join Sweet Paradise'}
                        </h2>
                        <p className="text-amber-700/80">
                            {isLogin ? 'Login to your account' : 'Create your account'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-start gap-3">
                            <span>⚠️</span>
                            <span className="font-semibold">{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field (Register Only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-amber-900 font-bold mb-2">
                                    👤 Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
                                />
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-amber-900 font-bold mb-2">
                                📧 Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-amber-900 font-bold mb-2">
                                🔐 Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Confirm Password (Register Only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-amber-900 font-bold mb-2">
                                    🔐 Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
                                />
                            </div>
                        )}

                        {/* Admin Checkbox (Register Only) */}
                        {!isLogin && (
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isAdmin"
                                        checked={formData.isAdmin}
                                        onChange={handleChange}
                                        className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                                    />
                                    <span className="font-bold text-amber-800">⚙️ Register as Admin</span>
                                </label>
                                <p className="text-sm text-amber-700/70 mt-2 ml-8">
                                    Admin accounts can manage inventory and products
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mt-4"
                        >
                            {isLogin ? '✓ Login' : '✓ Create Account'}
                        </button>
                    </form>

                    {/* Toggle Link */}
                    <div className="text-center mt-8 pt-6 border-t border-orange-100">
                        <p className="text-gray-600 mb-2">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        </p>
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setFormData({ name: '', email: '', password: '', confirmPassword: '', isAdmin: false });
                                setError('');
                            }}
                            className="text-amber-600 font-bold hover:text-amber-700 hover:underline text-lg"
                        >
                            {isLogin ? 'Register here' : 'Login here'}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-white/80 mt-6 text-sm">
                    <p>🍰 Sweet Paradise - Your favorite online sweet shop</p>
                </div>
            </div>
        </div>
    );
};

export default AuthPages;