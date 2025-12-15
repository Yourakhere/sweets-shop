import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, addToCart } = useCart();
    const navigate = useNavigate();
    const { user } = useAuth();

    const checkoutHandler = () => {
        if (user) {
            navigate('/checkout');
        } else {
            navigate('/login?redirect=checkout');
        }
    };

    const total = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

    return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div 
                    className="text-center mb-10 p-8 text-white rounded-xl shadow-lg"
                    style={{
                        background: 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)'
                    }}
                >
                    <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
                    <p className="text-lg opacity-90">Review your sweet selections</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow-md text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some delicious sweets to get started!</p>
                        <Link 
                            to="/"
                            className="inline-block px-8 py-3 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                            style={{
                                background: 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)'
                            }}
                        >
                            Browse Sweets
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div 
                                    key={item.product}
                                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-200"
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8b4513'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                >
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Image */}
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-full sm:w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                        
                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <Link 
                                                    to={`/sweet/${item.product}`}
                                                    className="text-xl font-bold text-gray-800 hover:opacity-70 transition-opacity"
                                                    style={{ color: '#8b4513' }}
                                                >
                                                    {item.name}
                                                </Link>
                                                <div className="mt-2 text-2xl font-bold" style={{ color: '#8b4513' }}>
                                                    ₹{parseFloat(item.price).toFixed(2)}
                                                </div>
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                                <div className="flex items-center gap-2">
                                                    <label className="text-sm font-semibold text-gray-700">Qty:</label>
                                                    <select
                                                        value={item.qty}
                                                        onChange={(e) => addToCart({ ...item, qty: Number(e.target.value) })}
                                                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 cursor-pointer font-semibold"
                                                        style={{
                                                            borderColor: '#d1d5db'
                                                        }}
                                                        onFocus={(e) => e.target.style.borderColor = '#8b4513'}
                                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                                    >
                                                        {[...Array(10).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => removeFromCart(item.product)}
                                                    className="px-4 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 hover:scale-105 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    <span>🗑️</span> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="lg:col-span-1">
                            <div 
                                className="bg-white p-8 rounded-xl shadow-md sticky top-6"
                                style={{
                                    border: '2px solid #e5e7eb'
                                }}
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-4" style={{
                                    borderColor: '#8b4513'
                                }}>
                                    Order Summary
                                </h2>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span className="font-semibold">Items:</span>
                                        <span className="font-bold">{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                                        <span className="text-xl font-bold text-gray-800">Subtotal:</span>
                                        <span className="text-3xl font-bold" style={{ color: '#8b4513' }}>
                                            ₹{total}
                                        </span>
                                    </div>
                                </div>
                                
                                <button
                                    type="button"
                                    className="w-full px-6 py-4 text-white font-bold text-lg rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        background: cartItems.length === 0 ? '#9ca3af' : 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)'
                                    }}
                                    disabled={cartItems.length === 0}
                                    onClick={checkoutHandler}
                                >
                                    Proceed To Checkout
                                </button>
                                
                                <Link 
                                    to="/"
                                    className="block mt-4 text-center text-gray-600 hover:text-gray-800 font-semibold transition-colors"
                                >
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;