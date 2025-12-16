import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../api';

const Home = () => {
    const { addToCart } = useCart();
    const [sweets, setSweets] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSweets = async () => {
            try {
                const { data } = await api.get('/sweets');
                setSweets(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching sweets", error);
                setLoading(false);
            }
        };
        fetchSweets();
    }, []);

    const filtered = sweets.filter(sweet => {
        const matchesSearch = sweet.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !category || sweet.category === category;
        const matchesMinPrice = !minPrice || sweet.price >= parseInt(minPrice);
        const matchesMaxPrice = !maxPrice || sweet.price <= parseInt(maxPrice);
        return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    const categories = ['All', ...new Set(sweets.map(s => s.category))];

    const handlePurchase = (sweet) => {
        addToCart({
            product: sweet._id,
            name: sweet.name,
            image: sweet.image,
            price: sweet.price,
            qty: 1
        });
        alert(`✓ ${sweet.name} added to cart! 🛒`);
    };

    return (
        <div className="min-h-screen bg-orange-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-amber-700 to-amber-900 text-white py-16 px-4 text-center shadow-lg mb-12">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">🍰 Sweet Paradise</h1>
                <p className="text-lg md:text-2xl opacity-90 max-w-2xl mx-auto">Delicious handcrafted sweets delivered right to your door</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Filters Section */}
                <div className="bg-white p-6 rounded-2xl shadow-md mb-12 transform hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-2xl font-bold text-amber-800 mb-6 flex items-center gap-2">
                        <span>🔍</span> Find Your Favorite
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-2">Search</label>
                            <input
                                placeholder="Search sweet name..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-2">Category</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-orange-100 focus:border-amber-500 focus:outline-none cursor-pointer bg-white"
                            >
                                <option value="">All Categories</option>
                                {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-2">Min Price</label>
                            <input
                                type="number"
                                placeholder="Min..."
                                value={minPrice}
                                onChange={e => setMinPrice(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-2">Max Price</label>
                            <input
                                type="number"
                                placeholder="Max..."
                                value={maxPrice}
                                onChange={e => setMaxPrice(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {filtered.length > 0 && (
                        <p className="text-amber-600 font-bold border-t border-orange-100 pt-4">
                            Found {filtered.length} sweet{filtered.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600 mx-auto mb-4"></div>
                        <p className="text-2xl text-amber-800 font-semibold">Loading delicious sweets...</p>
                    </div>
                ) : (
                    /* Products Grid */
                    filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filtered.map(sweet => (
                                <div
                                    key={sweet._id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col"
                                >
                                    {/* Image */}
                                    <div className="h-56 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center relative overflow-hidden">
                                        {sweet.image && sweet.image.startsWith('http') ? (
                                            <img
                                                src={sweet.image}
                                                alt={sweet.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <span className="text-8xl select-none filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
                                                {sweet.image || '🍬'}
                                            </span>
                                        )}
                                        {/* Badge if low stock usually goes here, but specific logic wasn't in original */}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-800 leading-tight">
                                                {sweet.name}
                                            </h3>
                                            <span className="bg-orange-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                                                {sweet.category}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-yellow-400">★</span>
                                            <span className="text-gray-500 text-sm">4.8 (Average)</span>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-3xl font-bold text-amber-600">
                                                    {sweet.price}
                                                </span>
                                                {sweet.quantity > 0 ? (
                                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                        In Stock
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handlePurchase(sweet)}
                                                disabled={sweet.quantity === 0}
                                                className={`w-full py-3 rounded-xl font-bold text-lg shadow-md transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2
                                                    ${sweet.quantity === 0
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 hover:shadow-lg'
                                                    }`}
                                            >
                                                {sweet.quantity === 0 ? 'Out of Stock' : (
                                                    <>
                                                        🛒 <span>Add to Cart</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-md p-12 text-center max-w-2xl mx-auto">
                            <span className="text-6xl mb-4 block">😞</span>
                            <h2 className="text-2xl font-bold text-amber-800 mb-2">No sweets found</h2>
                            <p className="text-amber-700">Try adjusting your filters to find what you're looking for</p>
                            <button
                                onClick={() => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); }}
                                className="mt-6 px-6 py-2 bg-orange-100 text-amber-800 font-bold rounded-lg hover:bg-orange-200 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};


export default Home;
