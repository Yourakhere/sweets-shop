import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)',
            color: 'white',
            padding: '0',
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            position: 'sticky',
            top: '0',
            zIndex: '1000'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem'
            }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'transform 0.3s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <span style={{ fontSize: '2rem' }}>🍰</span>
                        <span>Sweet Paradise</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem'
                }}>
                    <Link to="/cart" style={{ textDecoration: 'none', color: 'white', position: 'relative' }}>
                        <span>🛒 Cart</span>
                        {cartItems.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '-15px',
                                background: 'red',
                                color: 'white',
                                borderRadius: '50%',
                                padding: '2px 6px',
                                fontSize: '0.8rem'
                            }}>
                                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <>
                            <Link to="/orders" style={{ textDecoration: 'none', color: 'white' }}>
                                📦 My Orders
                            </Link>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(255,255,255,0.1)',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>👤</span>
                                <span>{user.name}</span>
                            </div>

                            {user.isAdmin && (
                                <Link to="/admin">
                                    <button style={{
                                        background: '#d4a574',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}>
                                        ⚙️ Admin Panel
                                    </button>
                                </Link>
                            )}

                            <button onClick={handleLogout} style={{
                                background: 'transparent',
                                color: 'white',
                                border: '2px solid white',
                                padding: '0.5rem 1.2rem',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}>
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button style={{
                                    background: 'transparent',
                                    color: 'white',
                                    border: '2px solid white',
                                    padding: '0.5rem 1.2rem',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}>
                                    🔓 Login
                                </button>
                            </Link>
                            <Link to="/register">
                                <button style={{
                                    background: '#d4a574',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}>
                                    📝 Register
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;