import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-orange-50 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-amber-800 mb-8 flex items-center gap-3">
                    <span>📦</span> My Orders
                </h1>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-10 text-center">
                        <p className="text-xl text-gray-600 mb-4">You haven't placed any orders yet.</p>
                        <Link to="/" className="text-amber-600 font-bold hover:underline">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-amber-100 text-amber-900">
                                    <tr>
                                        <th className="p-4 font-bold border-b border-amber-200">ID</th>
                                        <th className="p-4 font-bold border-b border-amber-200">Date</th>
                                        <th className="p-4 font-bold border-b border-amber-200">Total</th>
                                        <th className="p-4 font-bold border-b border-amber-200">Paid</th>
                                        <th className="p-4 font-bold border-b border-amber-200">Status</th>
                                        <th className="p-4 font-bold border-b border-amber-200">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-orange-50 transition-colors">
                                            <td className="p-4 text-sm font-mono text-gray-600">
                                                {order._id.substring(0, 10)}...
                                            </td>
                                            <td className="p-4 text-gray-700">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 font-bold text-amber-800">
                                                ${order.totalPrice.toFixed(2)}
                                            </td>
                                            <td className="p-4">
                                                {order.isPaid ? (
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                                                        Paid
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                                                        Not Paid
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {(order.isDelivered || new Date() > new Date(order.expectedDeliveryAt))
                                                    ? <span className="text-green-600 font-bold flex items-center gap-1">✓ Delivered</span>
                                                    : <span className="text-blue-600 font-bold flex items-center gap-1">🚚 In Transit</span>}
                                            </td>
                                            <td className="p-4">
                                                <Link to={`/order/${order._id}`}>
                                                    <button className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-3 py-1 rounded-lg font-bold text-sm transition-colors">
                                                        Details
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
