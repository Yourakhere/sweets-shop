import React, { useEffect, useState } from 'react';
import { api } from '../api';

const Admin = () => {
    const [sweets, setSweets] = useState([]);
    const [editingSweet, setEditingSweet] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '', description: '', image: '' });

    const fetchSweets = async () => {
        try {
            const { data } = await api.get('/sweets');
            setSweets(data);
        } catch (error) {
            console.error('Error fetching sweets', error);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sweet?')) {
            try {
                await api.delete(`/sweets/${id}`);
                fetchSweets();
            } catch (error) {
                console.error('Error deleting sweet', error);
            }
        }
    };

    const handleEdit = (sweet) => {
        setEditingSweet(sweet);
        setFormData({
            name: sweet.name,
            category: sweet.category,
            price: sweet.price,
            quantity: sweet.quantity,
            description: sweet.description || '',
            image: sweet.image || ''
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSweet) {
                await api.put(`/sweets/${editingSweet._id}`, formData);
            } else {
                await api.post('/sweets', formData);
            }
            setShowForm(false);
            setEditingSweet(null);
            setFormData({ name: '', category: '', price: '', quantity: '', description: '', image: '' });
            fetchSweets();
        } catch (error) {
            console.error('Error saving sweet', error);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
                        <span>⚙️</span> Admin Dashboard
                    </h1>
                    <button
                        onClick={() => {
                            setEditingSweet(null);
                            setFormData({ name: '', category: '', price: '', quantity: '', description: '', image: '' });
                            setShowForm(!showForm);
                        }}
                        className={`px-6 py-3 rounded-xl font-bold text-white shadow-md transition-all duration-300 flex items-center gap-2 ${showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {showForm ? '✖ Cancel' : '➕ Add New Sweet'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white p-8 rounded-2xl shadow-xl mb-12 border-2 border-orange-100">
                        <h2 className="text-2xl font-bold text-amber-800 mb-6 pb-2 border-b border-orange-100">
                            {editingSweet ? '✏️ Edit Sweet' : '🍬 Add New Sweet'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Name</label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
                                    placeholder="Sweet Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Category</label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
                                    placeholder="Category (e.g. Cake, Cookie)"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Quantity</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
                                    placeholder="0"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 font-bold mb-2">Image URL</label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 font-bold mb-2">Description</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-lg border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors h-24 resize-none"
                                    placeholder="Describe this delicious sweet..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button type="submit" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                                    {editingSweet ? '💾 Save Changes' : '✨ Add Sweet'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-amber-100 text-amber-900">
                                <tr>
                                    <th className="p-4 font-bold border-b border-amber-200">Image</th>
                                    <th className="p-4 font-bold border-b border-amber-200">Name</th>
                                    <th className="p-4 font-bold border-b border-amber-200">Category</th>
                                    <th className="p-4 font-bold border-b border-amber-200">Price</th>
                                    <th className="p-4 font-bold border-b border-amber-200">Stock</th>
                                    <th className="p-4 font-bold border-b border-amber-200 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sweets.map(sweet => (
                                    <tr key={sweet._id} className="hover:bg-orange-50 transition-colors group">
                                        <td className="p-4">
                                            <div className="w-16 h-16 rounded-lg bg-orange-100 flex items-center justify-center overflow-hidden shadow-sm">
                                                {sweet.image && sweet.image.startsWith('http') ? (
                                                    <img src={sweet.image} alt={sweet.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl">🍬</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">{sweet.name}</td>
                                        <td className="p-4 text-gray-600">
                                            <span className="bg-orange-100 text-amber-800 text-xs px-2 py-1 rounded-full">{sweet.category}</span>
                                        </td>
                                        <td className="p-4 font-bold text-amber-700">{sweet.price}</td>
                                        <td className="p-4">
                                            <span className={`font-bold px-3 py-1 rounded-full text-xs ${sweet.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {sweet.quantity} in stock
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(sweet)}
                                                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sweet._id)}
                                                    className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
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


export default Admin;
