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

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <div className="order-details-page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <h1>Order {order._id}</h1>

            <div className="tracking-status" style={{ padding: '20px', background: '#f0f0f0', margin: '20px 0', borderRadius: '8px', textAlign: 'center' }}>
                <h2>Status: {statusMessage}</h2>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: statusMessage.includes('Delivered') ? '100%' : '50%',
                            height: '10px',
                            background: statusMessage.includes('Delivered') ? 'green' : 'orange',
                            transition: 'width 1s'
                        }}
                    ></div>
                </div>
            </div>

            <div className="order-info">
                <h3>Shipping</h3>
                <p>
                    <strong>Name: </strong> {order.user.name} <br />
                    <strong>Email: </strong> {order.user.email} <br />
                    <strong>Address: </strong>
                    {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>

                <h3>Payment Method</h3>
                <p>
                    <strong>Method: </strong> {order.paymentMethod} <br />
                    <strong>Status: </strong> {order.isPaid ? `Paid at ${order.paidAt}` : 'Not Paid'}
                </p>

                <h3>Order Items</h3>
                <div className="order-items-list">
                    {order.orderItems.map((item, index) => (
                        <div key={index} className="order-item">
                            {item.name} x {item.qty} = {item.qty * item.price}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
