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
        setIsOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
                        <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">🍰</span>
                        <span className="font-bold text-xl md:text-2xl tracking-wide">Sweet Paradise</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/cart" className="relative hover:text-orange-200 transition-colors flex items-center gap-1 font-medium">
                            <span className="text-xl">🛒</span>
                            <span>Cart</span>
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/orders" className="hover:text-orange-200 transition-colors font-medium">
                                    📦 My Orders
                                </Link>

                                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                                    <span className="text-lg">👤</span>
                                    <span className="font-semibold text-sm">{user.name}</span>
                                </div>

                                {user.isAdmin && (
                                    <Link to="/admin">
                                        <button className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                                            <span>⚙️</span> Admin
                                        </button>
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="border-2 border-white/50 hover:border-white hover:bg-white/10 px-4 py-2 rounded-lg font-bold transition-all"
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login">
                                    <button className="text-white hover:text-orange-200 font-bold transition-colors">
                                        🔓 Login
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <button className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                        📝 Register
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link to="/cart" className="relative mr-2">
                            <span className="text-2xl">🛒</span>
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={toggleMenu}
                            className="text-white focus:outline-none p-2 rounded-md hover:bg-amber-700"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`md:hidden bg-amber-800 border-t border-amber-700 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
                    }`}
            >
                <div className="px-4 space-y-4">
                    {user ? (
                        <>
                            <div className="flex items-center gap-3 text-orange-200 border-b border-amber-700 pb-3">
                                <span className="text-2xl bg-white/10 p-2 rounded-full">👤</span>
                                <div>
                                    <p className="text-sm font-medium opacity-75">Signed in as</p>
                                    <p className="font-bold text-lg">{user.name}</p>
                                </div>
                            </div>

                            <Link to="/orders" onClick={closeMenu} className="block text-lg hover:text-orange-200 py-2 border-b border-amber-700/50">
                                📦 My Orders
                            </Link>

                            {user.isAdmin && (
                                <Link to="/admin" onClick={closeMenu} className="block text-lg hover:text-orange-200 py-2 border-b border-amber-700/50">
                                    ⚙️ Admin Dashboard
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="w-full text-left text-lg text-red-200 hover:text-red-100 py-2 mt-2 font-semibold"
                            >
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <Link to="/login" onClick={closeMenu}>
                                <button className="w-full border-2 border-white/30 hover:bg-white/10 text-white py-3 rounded-lg font-bold">
                                    Login
                                </button>
                            </Link>
                            <Link to="/register" onClick={closeMenu}>
                                <button className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg font-bold shadow-md">
                                    Register
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;