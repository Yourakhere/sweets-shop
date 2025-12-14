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
        <div className="max-w-7xl mx-auto p-6 bg-orange-50 min-h-screen">
            {/* Header */}
            <div className="text-center mb-10 p-8 text-white rounded-xl shadow-lg" style={{
                background: 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)'
            }}>
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-lg opacity-90">Manage your sweet inventory</p>
            </div>

            {/* Form Container */}
            <div className="bg-white p-8 rounded-xl shadow-md mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-4" style={{
                    borderColor: '#8b4513'
                }}>
                    {editingId ? 'Edit Sweet' : 'Add New Sweet'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="mb-2 font-semibold text-gray-700 text-sm">Name</label>
                            <input 
                                placeholder="Sweet name" 
                                value={form.name} 
                                onChange={e => setForm({ ...form, name: e.target.value })} 
                                required 
                                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                                style={{
                                    borderColor: 'focus' ? '#8b4513' : undefined
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#8b4513'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-2 font-semibold text-gray-700 text-sm">Category</label>
                            <input 
                                placeholder="e.g., Chocolate, Candy" 
                                value={form.category} 
                                onChange={e => setForm({ ...form, category: e.target.value })} 
                                required 
                                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                                onFocus={(e) => e.target.style.borderColor = '#8b4513'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="mb-2 font-semibold text-gray-700 text-sm">Price </label>
                            <input 
                                type="number" 
                                step="0.01"
                                placeholder="0.00" 
                                value={form.price} 
                                onChange={e => setForm({ ...form, price: e.target.value })} 
                                required 
                                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                                onFocus={(e) => e.target.style.borderColor = '#8b4513'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-2 font-semibold text-gray-700 text-sm">Quantity</label>
                            <input 
                                type="number" 
                                placeholder="Stock quantity" 
                                value={form.quantity} 
                                onChange={e => setForm({ ...form, quantity: e.target.value })} 
                                required 
                                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                                onFocus={(e) => e.target.style.borderColor = '#8b4513'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold text-gray-700 text-sm">Image</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => setImage(e.target.files[0])} 
                            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition cursor-pointer"
                            onFocus={(e) => e.target.style.borderColor = '#8b4513'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="submit" 
                            className="px-6 py-3 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                            style={{
                                background: 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)'
                            }}
                        >
                            {editingId ? 'Update' : 'Add'} Sweet
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                                onClick={() => { 
                                    setEditingId(null); 
                                    setForm({ name: '', category: '', price: '', quantity: '' }); 
                                    setImage(null); 
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Inventory Container */}
            <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-4" style={{
                    borderColor: '#8b4513'
                }}>
                    Inventory ({sweets.length} items)
                </h2>
                
                <ul className="space-y-4">
                    {sweets.map(sweet => (
                        <li 
                            key={sweet._id} 
                            className="grid grid-cols-1 md:grid-cols-[80px_1fr_auto] gap-5 items-center p-5 border-2 border-gray-200 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            style={{
                                borderColor: '#e5e7eb'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8b4513'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                        >
                            {sweet.image && (
                                <img 
                                    src={sweet.image} 
                                    alt={sweet.name} 
                                    className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                                />
                            )}
                            
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{sweet.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{sweet.category}</p>
                                <div className="flex gap-4 items-center">
                                    <span className="text-2xl font-bold" style={{ color: '#8b4513' }}>
                                         {parseFloat(sweet.price).toFixed(2)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        sweet.quantity < 10 
                                            ? 'bg-red-100 text-red-700' 
                                            : 'bg-green-100 text-green-700'
                                    }`}>
                                        Stock: {sweet.quantity}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 md:flex-col">
                                <button 
                                    onClick={() => handleEdit(sweet)} 
                                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-md hover:shadow-lg"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleRestock(sweet._id)} 
                                    className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 hover:scale-105 transition-all shadow-md hover:shadow-lg"
                                >
                                    Restock
                                </button>
                                <button 
                                    onClick={() => handleDelete(sweet._id)} 
                                    className="px-4 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 hover:scale-105 transition-all shadow-md hover:shadow-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Admin;