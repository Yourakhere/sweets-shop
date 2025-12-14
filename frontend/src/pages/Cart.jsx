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
        <div className="cart-page">
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    Your cart is empty <Link to="/">Go Back</Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.product} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <Link to={`/sweet/${item.product}`}>{item.name}</Link>
                                    <div className="cart-price">{item.price}</div>
                                </div>
                                <div className="cart-item-actions">
                                    <select
                                        value={item.qty}
                                        onChange={(e) => addToCart({ ...item, qty: Number(e.target.value) })}
                                    >
                                        {[...Array(10).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <button onClick={() => removeFromCart(item.product)}>
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                        <div className="total-price">{total}</div>
                        <button
                            type="button"
                            className="btn-checkout"
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed To Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
