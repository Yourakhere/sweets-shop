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
        <div className="min-h-screen bg-orange-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 p-8 text-white rounded-xl shadow-lg" style={{
                    background: 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)'
                }}>
                    <h1 className="text-4xl font-bold mb-2">Checkout</h1>
                    <p className="text-lg opacity-90">Complete your order</p>
                </div>

                {/* Progress Steps */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center relative">
                        {/* Progress Line */}
                        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
                            <div 
                                className="h-full transition-all duration-500"
                                style={{
                                    width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
                                    background: 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)'
                                }}
                            />
                        </div>

                        {/* Step 1 */}
                        <div className="flex flex-col items-center relative">
                            <div 
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                                    step >= 1 ? 'text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                                }`}
                                style={{
                                    background: step >= 1 ? 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)' : undefined
                                }}
                            >
                                {step > 1 ? '✓' : '1'}
                            </div>
                            <span className={`mt-2 text-sm font-semibold ${step >= 1 ? 'text-gray-800' : 'text-gray-400'}`}>
                                Shipping
                            </span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center relative">
                            <div 
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                                    step >= 2 ? 'text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                                }`}
                                style={{
                                    background: step >= 2 ? 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)' : undefined
                                }}
                            >
                                {step > 2 ? '✓' : '2'}
                            </div>
                            <span className={`mt-2 text-sm font-semibold ${step >= 2 ? 'text-gray-800' : 'text-gray-400'}`}>
                                Payment
                            </span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center relative">
                            <div 
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                                    step >= 3 ? 'text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                                }`}
                                style={{
                                    background: step >= 3 ? 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)' : undefined
                                }}
                            >
                                3
                            </div>
                            <span className={`mt-2 text-sm font-semibold ${step >= 3 ? 'text-gray-800' : 'text-gray-400'}`}>
                                Place Order
                            </span>
                        </div>
                    </div>
                </div>

                {/* Step 1: Shipping Address */}
                {step === 1 && (
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-4" style={{
                            borderColor: '#8b4513'
                        }}>
                            Shipping Address
                        </h2>
                        <form onSubmit={submitAddress} className="space-y-6">
                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold text-gray-700 text-sm">Address</label>
                                <input
                                    type="text"
                                    placeholder="Enter your street address"
                                    value={addressData.address}
                                    required
                                    onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                                    onFocus={(e) => e.target.style.borderColor = '#8b4513'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="mb-2 font-semibold text-gray-700 text-sm">City</label>
                                    <input
                                        type="text"
                                        placeholder="Enter city"
                                        value={addressData.city}
                                        required
                                        onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                                        onFocus={(e) => e.target.style.borderColor = '#8b4513'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-2 font-semibold text-gray-700 text-sm">Postal Code</label>
                                    <input
                                        type="text"
                                        placeholder="Enter postal code"
                                        value={addressData.postalCode}
                                        required
                                        onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                                        onFocus={(e) => e.target.style.borderColor = '#8b4513'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold text-gray-700 text-sm">Country</label>
                                <input
                                    type="text"
                                    placeholder="Enter country"
                                    value={addressData.country}
                                    required
                                    onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                                    onFocus={(e) => e.target.style.borderColor = '#8b4513'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full px-6 py-4 text-white font-bold text-lg rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                style={{
                                    background: 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)'
                                }}
                            >
                                Continue to Payment
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Payment Method */}
                {step === 2 && (
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-4" style={{
                            borderColor: '#8b4513'
                        }}>
                            Payment Method
                        </h2>
                        <form onSubmit={submitPayment} className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:shadow-md transition-all cursor-pointer"
                                    style={{
                                        borderColor: payment === 'Stripe' ? '#8b4513' : '#d1d5db',
                                        backgroundColor: payment === 'Stripe' ? '#fff7ed' : 'white'
                                    }}
                                    onClick={() => setPayment('Stripe')}
                                >
                                    <input
                                        type="radio"
                                        id="Stripe"
                                        name="paymentMethod"
                                        value="Stripe"
                                        checked={payment === 'Stripe'}
                                        onChange={(e) => setPayment(e.target.value)}
                                        className="w-5 h-5 cursor-pointer"
                                        style={{
                                            accentColor: '#8b4513'
                                        }}
                                    />
                                    <label htmlFor="Stripe" className="ml-4 text-lg font-semibold text-gray-800 cursor-pointer flex-1">
                                        Stripe / Credit Card
                                    </label>
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>

                                <div className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:shadow-md transition-all cursor-pointer"
                                    style={{
                                        borderColor: payment === 'PayPal' ? '#8b4513' : '#d1d5db',
                                        backgroundColor: payment === 'PayPal' ? '#fff7ed' : 'white'
                                    }}
                                    onClick={() => setPayment('PayPal')}
                                >
                                    <input
                                        type="radio"
                                        id="PayPal"
                                        name="paymentMethod"
                                        value="PayPal"
                                        checked={payment === 'PayPal'}
                                        onChange={(e) => setPayment(e.target.value)}
                                        className="w-5 h-5 cursor-pointer"
                                        style={{
                                            accentColor: '#8b4513'
                                        }}
                                    />
                                    <label htmlFor="PayPal" className="ml-4 text-lg font-semibold text-gray-800 cursor-pointer flex-1">
                                        PayPal
                                    </label>
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    type="submit" 
                                    className="flex-1 px-6 py-4 text-white font-bold text-lg rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                    style={{
                                        background: 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)'
                                    }}
                                >
                                    Continue to Review
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setStep(1)} 
                                    className="px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Back
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Step 3: Order Review & Place Order */}
                {step === 3 && (
                    <div className="bg-white rounded-xl shadow-md p-8">
                        {paymentStatus === 'success' ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-white text-5xl shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                    }}
                                >
                                    ✓
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-3">Payment Successful!</h2>
                                <p className="text-lg text-gray-600 mb-6">Creating your order...</p>
                                <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200"
                                        style={{
                                            borderTopColor: '#8b4513'
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-4" style={{
                                    borderColor: '#8b4513'
                                }}>
                                    Order Summary
                                </h2>

                                {/* Shipping Info */}
                                <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5" style={{ color: '#8b4513' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Shipping Address
                                    </h3>
                                    <p className="text-gray-700 ml-7">
                                        {addressData.address}, {addressData.city}, {addressData.postalCode}, {addressData.country}
                                    </p>
                                </div>

                                {/* Payment Method */}
                                <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5" style={{ color: '#8b4513' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Payment Method
                                    </h3>
                                    <p className="text-gray-700 ml-7">{payment}</p>
                                </div>

                                {/* Order Items */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" style={{ color: '#8b4513' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Order Items
                                    </h3>
                                    <div className="space-y-3 ml-7">
                                        {cartItems.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="font-semibold text-gray-800">{item.name}</span>
                                                <span className="text-gray-600">
                                                    {item.qty} × ₹{parseFloat(item.price).toFixed(2)} = 
                                                    <span className="font-bold ml-2" style={{ color: '#8b4513' }}>
                                                        ₹{(item.qty * item.price).toFixed(2)}
                                                    </span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="border-t-2 border-gray-200 pt-6 mb-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-bold text-gray-800">Total:</h3>
                                        <span className="text-4xl font-bold" style={{ color: '#8b4513' }}>
                                            ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={placeOrderHandler}
                                        disabled={paymentStatus === 'processing'}
                                        className="flex-1 px-6 py-4 text-white font-bold text-lg rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                                        style={{
                                            background: paymentStatus === 'processing' 
                                                ? '#9ca3af' 
                                                : 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)'
                                        }}
                                    >
                                        {paymentStatus === 'processing' ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                                Processing Payment...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Pay & Place Order
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setStep(2)} 
                                        disabled={paymentStatus === 'processing'}
                                        className="px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Back
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;