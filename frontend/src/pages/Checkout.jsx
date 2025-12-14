import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../api';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, shippingAddress, saveShippingAddress, savePaymentMethod, paymentMethod, clearCart } = useCart();

    const [step, setStep] = useState(1);
    const [addressData, setAddressData] = useState(shippingAddress || { address: '', city: '', postalCode: '', country: '' });
    const [payment, setPayment] = useState(paymentMethod || 'Cards');
    const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success

    const submitAddress = (e) => {
        e.preventDefault();
        saveShippingAddress(addressData);
        setStep(2);
    };

    const submitPayment = (e) => {
        e.preventDefault();
        savePaymentMethod(payment);
        setStep(3);
    };

    const placeOrderHandler = async () => {
        setPaymentStatus('processing');

        // Simulate payment delay
        setTimeout(async () => {
            setPaymentStatus('success');

            // Wait a bit to show success message then place order
            setTimeout(async () => {
                try {
                    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

                    const orderData = {
                        orderItems: cartItems,
                        shippingAddress: addressData,
                        paymentMethod: payment,
                        totalPrice: Number(totalPrice),
                    };

                    const { data } = await api.post('/orders', orderData);

                    clearCart();
                    // Redirect to the new order's details/tracking page
                    navigate(`/order/${data._id}`);
                } catch (error) {
                    console.error("Order creation failed", error);
                    alert("Failed to place order");
                    setPaymentStatus('idle');
                }
            }, 1000);
        }, 1500);
    };

    return (
        <div className="checkout-container">
            <div className="checkout-steps">
                <div className={step >= 1 ? 'active' : ''}>Shipping</div>
                <div className={step >= 2 ? 'active' : ''}>Payment</div>
                <div className={step >= 3 ? 'active' : ''}>Place Order</div>
            </div>

            {step === 1 && (
                <form onSubmit={submitAddress} className="checkout-form">
                    <h2>Shipping Address</h2>
                    <input
                        type="text"
                        placeholder="Address"
                        value={addressData.address}
                        required
                        onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="City"
                        value={addressData.city}
                        required
                        onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Postal Code"
                        value={addressData.postalCode}
                        required
                        onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        value={addressData.country}
                        required
                        onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                    />
                    <button type="submit">Continue</button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={submitPayment} className="checkout-form">
                    <h2>Payment Method</h2>
                    <div className="payment-option">
                        <input
                            type="radio"
                            id="Stripe"
                            label="Stripe"
                            name="paymentMethod"
                            value="Stripe"
                            checked={payment === 'Stripe'}
                            onChange={(e) => setPayment(e.target.value)}
                        />
                        <label htmlFor="Stripe">Stripe / Credit Card</label>
                    </div>
                    <div className="payment-option">
                        <input
                            type="radio"
                            id="PayPal"
                            label="PayPal"
                            name="paymentMethod"
                            value="PayPal"
                            checked={payment === 'PayPal'}
                            onChange={(e) => setPayment(e.target.value)}
                        />
                        <label htmlFor="PayPal">PayPal</label>
                    </div>
                    <button type="submit">Continue</button>
                    <button type="button" onClick={() => setStep(1)} className="back-btn">Back</button>
                </form>
            )}

            {step === 3 && (
                <div className="place-order-preview">
                    {paymentStatus === 'success' ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#27ae60' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                            <h2>Payment Successful!</h2>
                            <p>Placing your order...</p>
                        </div>
                    ) : (
                        <>
                            <h2>Order Summary</h2>
                            <div className="summary-section">
                                <strong>Shipping:</strong>
                                <p>{addressData.address}, {addressData.city}, {addressData.postalCode}, {addressData.country}</p>
                            </div>
                            <div className="summary-section">
                                <strong>Payment Method:</strong>
                                <p>{payment}</p>
                            </div>
                            <div className="summary-section">
                                <strong>Order Items:</strong>
                                {cartItems.map((item, index) => (
                                    <div key={index} className="summary-item">
                                        {item.name} x {item.qty} = {item.qty * item.price}
                                    </div>
                                ))}
                            </div>
                            <div className="total-create">
                                <h3>Total: {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</h3>
                                <button
                                    onClick={placeOrderHandler}
                                    disabled={paymentStatus === 'processing'}
                                >
                                    {paymentStatus === 'processing' ? 'Processing...' : 'Pay & Place Order'}
                                </button>
                            </div>
                            <button type="button" onClick={() => setStep(2)} className="back-btn" disabled={paymentStatus === 'processing'}>Back</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Checkout;
