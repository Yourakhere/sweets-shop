import { useState, useEffect } from 'react';
import { api } from '../api';

const Admin = () => {
    const [sweets, setSweets] = useState([]);
    const [form, setForm] = useState({ name: '', category: '', price: '', quantity: '' });
    const [image, setImage] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const fetchSweets = async () => {
        const { data } = await api.get('/sweets');
        setSweets(data);
    };

    useEffect(() => { fetchSweets(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('category', form.category);
            formData.append('price', form.price);
            formData.append('quantity', form.quantity);
            if (image) {
                formData.append('image', image);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (editingId) {
                await api.put(`/sweets/${editingId}`, formData, config);
            } else {
                await api.post('/sweets', formData, config);
            }
            setForm({ name: '', category: '', price: '', quantity: '' });
            setImage(null);
            setEditingId(null);
            fetchSweets();
        } catch (error) {
            console.error(error);
            alert('Operation failed');
        }
    };

    const handleEdit = (sweet) => {
        setForm({ name: sweet.name, category: sweet.category, price: sweet.price, quantity: sweet.quantity });
        setEditingId(sweet._id);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            await api.delete(`/sweets/${id}`);
            fetchSweets();
        }
    };

    const handleRestock = async (id) => {
        const amount = prompt("Enter amount to restock:");
        if (amount) {
            await api.post(`/sweets/${id}/restock`, { amount });
            fetchSweets();
        }
    }

    return (
        <div className="admin-panel">
            <h1>Admin Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
                <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
                <input type="file" onChange={e => setImage(e.target.files[0])} />
                <button type="submit">{editingId ? 'Update' : 'Add'} Sweet</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', category: '', price: '', quantity: '' }); setImage(null); }}>Cancel</button>}
            </form>

            <ul>
                {sweets.map(sweet => (
                    <li key={sweet._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {sweet.image && <img src={sweet.image} alt={sweet.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />}
                        <span>{sweet.name} - ${sweet.price} - Stock: {sweet.quantity}</span>
                        <button onClick={() => handleEdit(sweet)}>Edit</button>
                        <button onClick={() => handleDelete(sweet._id)}>Delete</button>
                        <button onClick={() => handleRestock(sweet._id)}>Restock</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default Admin;
