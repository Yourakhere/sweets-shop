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
        <div className="order-history-page">
            <h1>My Orders</h1>
            {loading ? (
                <div>Loading...</div>
            ) : orders.length === 0 ? (
                <div>No orders found.</div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>{order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? new Date(order.paidAt).toLocaleDateString() : 'No'}</td>
                                <td>
                                    {(order.isDelivered || new Date() > new Date(order.expectedDeliveryAt))
                                        ? 'Delivered'
                                        : 'In Transit'}
                                </td>
                                <td>
                                    <Link to={`/order/${order._id}`}>
                                        <button className='btn-sm'>Details</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderHistory;
