import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthPages = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', isAdmin: false });
    const [error, setError] = useState('');

    const { login, register } = useAuth(); // Assuming register method exists in context, if not I will need to verify
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
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #d4a574 0%, #c49563 50%, #b8915f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '500px'
            }}>
                {/* Form Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    padding: '3rem 2rem',
                    marginBottom: '2rem'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>🍰</h1>
                        <h2 style={{ color: '#8b4513', margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
                            {isLogin ? 'Welcome Back' : 'Join Sweet Paradise'}
                        </h2>
                        <p style={{ color: '#a0522d', margin: '0' }}>
                            {isLogin ? 'Login to your account' : 'Create your account'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            background: '#faddd1',
                            border: '2px solid #e74c3c',
                            color: '#c0392b',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            fontWeight: 'bold'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Name Field (Register Only) */}
                        {!isLogin && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', color: '#8b4513', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    👤 Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: '2px solid #e8d4c4',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box',
                                        transition: 'border-color 0.3s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#d4a574'}
                                    onBlur={(e) => e.target.style.borderColor = '#e8d4c4'}
                                />
                            </div>
                        )}

                        {/* Email Field */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: '#8b4513', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                📧 Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: '2px solid #e8d4c4',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#d4a574'}
                                onBlur={(e) => e.target.style.borderColor = '#e8d4c4'}
                            />
                        </div>

                        {/* Password Field */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: '#8b4513', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                🔐 Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: '2px solid #e8d4c4',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#d4a574'}
                                onBlur={(e) => e.target.style.borderColor = '#e8d4c4'}
                            />
                        </div>

                        {/* Confirm Password (Register Only) */}
                        {!isLogin && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', color: '#8b4513', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    🔐 Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: '2px solid #e8d4c4',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#d4a574'}
                                    onBlur={(e) => e.target.style.borderColor = '#e8d4c4'}
                                />
                            </div>
                        )}

                        {/* Admin Checkbox (Register Only) */}
                        {!isLogin && (
                            <div style={{
                                marginBottom: '1.5rem',
                                background: '#f9f5f0',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '2px solid #e8d4c4'
                            }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    color: '#8b4513',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    margin: '0'
                                }}>
                                    <input
                                        type="checkbox"
                                        name="isAdmin"
                                        checked={formData.isAdmin}
                                        onChange={handleChange}
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                            accentColor: '#d4a574'
                                        }}
                                    />
                                    <span>⚙️ Register as Admin</span>
                                </label>
                                <p style={{
                                    margin: '0.5rem 0 0 2rem',
                                    color: '#a0522d',
                                    fontSize: '0.9rem'
                                }}>
                                    Admin accounts can manage inventory and products
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'linear-gradient(135deg, #d4a574 0%, #c49563 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 15px rgba(212, 165, 116, 0.4)',
                                marginTop: '1rem'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(212, 165, 116, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(212, 165, 116, 0.4)';
                            }}
                        >
                            {isLogin ? '✓ Login' : '✓ Create Account'}
                        </button>
                    </form>

                    {/* Toggle Link */}
                    <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e8d4c4' }}>
                        <p style={{ color: '#666', margin: '0 0 0.5rem 0' }}>
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        </p>
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setFormData({ name: '', email: '', password: '', confirmPassword: '', isAdmin: false });
                                setError('');
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#d4a574',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            {isLogin ? 'Register here' : 'Login here'}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <p style={{ margin: '0', opacity: 0.9 }}>🍰 Sweet Paradise - Your favorite online sweet shop</p>
                </div>
            </div>
        </div>
    );
};

export default AuthPages;