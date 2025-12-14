import { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [sweets, setSweets] = useState([
        { _id: '1', name: 'Chocolate Cake', category: 'Cakes', price: 25, quantity: 15, image: null },
        { _id: '2', name: 'Strawberry Tart', category: 'Tarts', price: 18, quantity: 22, image: null },
        { _id: '3', name: 'Macarons Mix', category: 'Cookies', price: 12, quantity: 30, image: null },
        { _id: '4', name: 'Cheesecake', category: 'Cakes', price: 28, quantity: 10, image: null },
        { _id: '5', name: 'Chocolate Truffles', category: 'Candies', price: 15, quantity: 45, image: null },
    ]);
    const [form, setForm] = useState({ name: '', category: '', price: '', quantity: '' });
    const [image, setImage] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [stats, setStats] = useState({});

    useEffect(() => {
        const totalValue = sweets.reduce((sum, s) => sum + (s.price * s.quantity), 0);
        const lowStock = sweets.filter(s => s.quantity < 10).length;
        setStats({ totalItems: sweets.length, totalValue, lowStock });
    }, [sweets]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            setSweets(sweets.map(s => s._id === editingId ? { ...form, _id: editingId, image } : s));
            setEditingId(null);
        } else {
            setSweets([...sweets, { ...form, _id: Date.now().toString(), image }]);
        }
        setForm({ name: '', category: '', price: '', quantity: '' });
        setImage(null);
    };

    const handleEdit = (sweet) => {
        setForm(sweet);
        setEditingId(sweet._id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            setSweets(sweets.filter(s => s._id !== id));
        }
    };

    const handleRestock = (id) => {
        const amount = prompt("Enter amount to restock:");
        if (amount) {
            setSweets(sweets.map(s => s._id === id ? { ...s, quantity: parseInt(s.quantity) + parseInt(amount) } : s));
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d4c4 100%)', padding: '2rem' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', color: '#8b4513', marginBottom: '0.5rem', fontWeight: 'bold' }}>🍰 Admin Dashboard</h1>
                    <p style={{ color: '#a0522d', fontSize: '1rem' }}>Manage your sweet shop inventory</p>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Items</p>
                        <h3 style={{ fontSize: '2rem', color: '#d4a574', margin: '0' }}>{stats.totalItems || 0}</h3>
                    </div>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Inventory Value</p>
                        <h3 style={{ fontSize: '2rem', color: '#d4a574', margin: '0' }}>${stats.totalValue || 0}</h3>
                    </div>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Low Stock Items</p>
                        <h3 style={{ fontSize: '2rem', color: '#d4a574', margin: '0' }}>{stats.lowStock || 0}</h3>
                    </div>
                </div>

                {/* Form Section */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '3rem' }}>
                    <h2 style={{ color: '#8b4513', marginTop: '0', marginBottom: '1.5rem' }}>{editingId ? '✏️ Edit Sweet' : '➕ Add New Sweet'}</h2>
                    <div onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            <input
                                placeholder="Sweet Name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                                style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e8d4c4', fontSize: '1rem' }}
                            />
                            <input
                                placeholder="Category (e.g., Cakes, Cookies)"
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                required
                                style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e8d4c4', fontSize: '1rem' }}
                            />
                            <input
                                type="number"
                                placeholder="Price ($)"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                required
                                style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e8d4c4', fontSize: '1rem' }}
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={form.quantity}
                                onChange={e => setForm({ ...form, quantity: e.target.value })}
                                required
                                style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e8d4c4', fontSize: '1rem' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                type="file"
                                onChange={e => setImage(e.target.files[0])}
                                style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e8d4c4', width: '100%', fontSize: '1rem' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handleSubmit}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: 'linear-gradient(135deg, #d4a574 0%, #c49563 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 12px rgba(212, 165, 116, 0.3)'
                                }}
                            >
                                {editingId ? '✓ Update' : '✓ Add Sweet'}
                            </button>
                            {editingId && (
                                <button
                                    onClick={() => { setEditingId(null); setForm({ name: '', category: '', price: '', quantity: '' }); setImage(null); }}
                                    style={{
                                        padding: '0.75rem 2rem',
                                        background: '#e8d4c4',
                                        color: '#8b4513',
                                        border: '2px solid #d4a574',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ✕ Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sweets List */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#8b4513', marginTop: '0', marginBottom: '1.5rem' }}>📦 Inventory ({sweets.length})</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '3px solid #e8d4c4', background: '#f9f5f0' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8b4513', fontWeight: 'bold' }}>Sweet</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8b4513', fontWeight: 'bold' }}>Category</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8b4513', fontWeight: 'bold' }}>Price</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8b4513', fontWeight: 'bold' }}>Stock</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8b4513', fontWeight: 'bold' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sweets.map(sweet => (
                                    <tr key={sweet._id} style={{ borderBottom: '1px solid #e8d4c4', transition: 'background 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f9f5f0'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '1rem', color: '#333' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {sweet.image && <img src={sweet.image} alt={sweet.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />}
                                                <span style={{ fontWeight: 'bold' }}>{sweet.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#666' }}>{sweet.category}</td>
                                        <td style={{ padding: '1rem', color: '#d4a574', fontWeight: 'bold' }}>${sweet.price}</td>
                                        <td style={{ padding: '1rem', color: sweet.quantity < 10 ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>
                                            {sweet.quantity} {sweet.quantity < 10 && '⚠️'}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <button onClick={() => handleEdit(sweet)} style={{ padding: '0.5rem 1rem', background: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>Edit</button>
                                                <button onClick={() => handleDelete(sweet._id)} style={{ padding: '0.5rem 1rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>Delete</button>
                                                <button onClick={() => handleRestock(sweet._id)} style={{ padding: '0.5rem 1rem', background: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>Restock</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;