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
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%)' }}>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #d4a574 0%, #c49563 100%)',
                color: 'white',
                padding: '4rem 2rem',
                textAlign: 'center',
                marginBottom: '3rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ fontSize: '3.5rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>🍰 Sweet Paradise</h1>
                <p style={{ fontSize: '1.3rem', margin: '0', opacity: 0.95 }}>Delicious handcrafted sweets delivered to your door</p>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 3rem' }}>
                {/* Filters Section */}
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    marginBottom: '3rem'
                }}>
                    <h2 style={{ color: '#8b4513', marginTop: '0', marginBottom: '1.5rem', fontSize: '1.5rem' }}>🔍 Find Your Favorite</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Search</label>
                            <input
                                placeholder="Search sweet name..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '2px solid #e8d4c4',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '2px solid #e8d4c4',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">All</option>
                                {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Min Price</label>
                            <input
                                type="number"
                                placeholder="Min..."
                                value={minPrice}
                                onChange={e => setMinPrice(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '2px solid #e8d4c4',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Max Price</label>
                            <input
                                type="number"
                                placeholder="Max..."
                                value={maxPrice}
                                onChange={e => setMaxPrice(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '2px solid #e8d4c4',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    {filtered.length > 0 && (
                        <p style={{ color: '#d4a574', fontWeight: 'bold', margin: '0' }}>
                            Found {filtered.length} sweet{filtered.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#8b4513' }}>Loading delicious sweets...</div>
                ) : (
                    /* Products Grid */
                    filtered.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                            {filtered.map(sweet => (
                                <div
                                    key={sweet._id}
                                    style={{
                                        background: 'white',
                                        borderRadius: '15px',
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                                    }}
                                >
                                    {/* Image */}
                                    <div style={{
                                        background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d4c4 100%)',
                                        height: '200px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '80px',
                                        overflow: 'hidden'
                                    }}>
                                        {sweet.image.startsWith('http') ? <img src={sweet.image} alt={sweet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : sweet.image}
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: '1.5rem' }}>
                                        <h3 style={{ color: '#8b4513', margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            {sweet.name}
                                        </h3>

                                        <p style={{ color: '#a0522d', margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>
                                            📂 {sweet.category}
                                        </p>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                            <span style={{ color: '#ffc107', fontSize: '0.9rem' }}>★</span>
                                            <span style={{ color: '#666', fontSize: '0.9rem' }}>4.8 (Average)</span>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                            <span style={{ fontSize: '1.8rem', color: '#d4a574', fontWeight: 'bold' }}>{sweet.price}</span>
                                            {sweet.quantity > 0 ? (
                                                <span style={{ fontSize: '0.85rem', color: '#27ae60', fontWeight: 'bold', background: '#e8f5e9', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
                                                    ✓ In Stock
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: '0.85rem', color: '#e74c3c', fontWeight: 'bold', background: '#faddd1', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handlePurchase(sweet)}
                                            disabled={sweet.quantity === 0}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                marginTop: '1rem',
                                                background: sweet.quantity === 0 ? '#ccc' : 'linear-gradient(135deg, #d4a574 0%, #c49563 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                cursor: sweet.quantity === 0 ? 'not-allowed' : 'pointer',
                                                transition: 'opacity 0.3s',
                                                opacity: sweet.quantity === 0 ? 0.6 : 1
                                            }}
                                            onMouseEnter={(e) => {
                                                if (sweet.quantity > 0) e.target.style.opacity = '0.9';
                                            }}
                                            onMouseLeave={(e) => {
                                                if (sweet.quantity > 0) e.target.style.opacity = '1';
                                            }}
                                        >
                                            {sweet.quantity === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            background: 'white',
                            borderRadius: '15px',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
                        }}>
                            <p style={{ fontSize: '2rem', color: '#8b4513', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>No sweets found 😞</p>
                            <p style={{ color: '#a0522d', margin: '0' }}>Try adjusting your filters to find what you're looking for</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Home;