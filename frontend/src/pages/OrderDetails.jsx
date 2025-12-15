import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    useEffect(() => {
        if (!order) return;

        const updateStatus = () => {
            const now = new Date().getTime();
            const expected = new Date(order.expectedDeliveryAt).getTime();
            const diff = expected - now;

            if (diff > 0) {
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                setStatusMessage(`Delivery in ${minutes}m ${seconds}s`);
            } else {
                setStatusMessage('Order Delivered! 🎉');
            }
        };

        const interval = setInterval(updateStatus, 1000);
        updateStatus(); // Initial call

        return () => clearInterval(interval);
    }, [order]);

    if (loading) return <div className="text-center py-20 text-xl font-bold text-amber-800">Loading Order...</div>;
    if (!order) return <div className="text-center py-20 text-xl font-bold text-red-600">Order not found</div>;

    return (
        <div className="min-h-screen bg-orange-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/orders" className="bg-white p-2 rounded-full shadow hover:bg-gray-50 text-gray-600">
                        ←
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Order <span className="text-amber-700 text-lg md:text-2xl">#{order._id}</span>
                    </h1>
                </div>

                {/* Tracking Card */}
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span>🚚</span> Delivery Status
                    </h2>

                    <div className="text-center mb-6">
                        <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent animate-pulse">
                            {statusMessage}
                        </p>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
                        <div
                            className={`h-full transition-all duration-1000 ${statusMessage.includes('Delivered') ? 'bg-green-500' : 'bg-amber-500'
                                }`}
                            style={{
                                width: statusMessage.includes('Delivered') ? '100%' : '55%',
                            }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wide">
                        <span>Processing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Shipping Info */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-amber-800 mb-4 border-b border-orange-100 pb-2">
                            Shipping Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Name</span>
                                <span className="font-semibold text-gray-800 text-right">{order.user.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Email</span>
                                <span className="font-semibold text-gray-800 text-right">{order.user.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Address</span>
                                <span className="font-semibold text-gray-800 text-right max-w-[200px]">
                                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-amber-800 mb-4 border-b border-orange-100 pb-2">
                            Payment Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Method</span>
                                <span className="font-semibold text-gray-800">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Status</span>
                                {order.isPaid ? (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                        Paid at {new Date(order.paidAt).toLocaleTimeString()}
                                    </span>
                                ) : (
                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                                        Not Paid
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-between pt-4 border-t border-gray-100 mt-2">
                                <span className="text-gray-800 font-bold text-lg">Total Amount</span>
                                <span className="text-amber-700 font-bold text-xl">${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-xl shadow-md p-6 mt-8">
                    <h3 className="text-lg font-bold text-amber-800 mb-4 border-b border-orange-100 pb-2">
                        Order Items
                    </h3>
                    <div className="divide-y divide-gray-100">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="py-4 flex justify-between items-center">
                                <div className="font-medium text-gray-800">
                                    {item.name} <span className="text-gray-400 text-sm ml-2">x {item.qty}</span>
                                </div>
                                <div className="font-bold text-gray-700">
                                    ${(item.qty * item.price).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
