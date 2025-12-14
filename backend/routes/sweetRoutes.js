import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import Sweet from '../models/Sweet.js';

const router = express.Router();

// @desc    Add a new sweet
// @route   POST /api/sweets
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;
        const image = req.file ? req.file.path : '';

        const sweet = new Sweet({
            name,
            category,
            price,
            quantity,
            image,
        });

        const createdSweet = await sweet.save();
        res.status(201).json(createdSweet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const sweets = await Sweet.find({});
        res.json(sweets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Search sweets
// @route   GET /api/sweets/search
// @access  Private
router.get('/search', protect, async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice } = req.query;
        let query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const sweets = await Sweet.find(query);
        res.json(sweets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a sweet (Admin)
// @route   PUT /api/sweets/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;
        const sweet = await Sweet.findById(req.params.id);

        if (sweet) {
            sweet.name = name || sweet.name;
            sweet.category = category || sweet.category;
            sweet.price = price || sweet.price;
            sweet.quantity = quantity !== undefined ? quantity : sweet.quantity;
            if (req.file) {
                sweet.image = req.file.path;
            }

            const updatedSweet = await sweet.save();
            res.json(updatedSweet);
        } else {
            res.status(404).json({ message: 'Sweet not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a sweet (Admin)
// @route   DELETE /api/sweets/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const sweet = await Sweet.findById(req.params.id);

        if (sweet) {
            await sweet.deleteOne();
            res.json({ message: 'Sweet removed' });
        } else {
            res.status(404).json({ message: 'Sweet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Purchase a sweet
// @route   POST /api/sweets/:id/purchase
// @access  Private
router.post('/:id/purchase', protect, async (req, res) => {
    try {
        const sweet = await Sweet.findById(req.params.id);

        if (sweet) {
            if (sweet.quantity > 0) {
                sweet.quantity -= 1;
                await sweet.save();
                res.json({ message: 'Purchase successful', sweet });
            } else {
                res.status(400).json({ message: 'Sweet is out of stock' });
            }
        } else {
            res.status(404).json({ message: 'Sweet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Restock a sweet (Admin)
// @route   POST /api/sweets/:id/restock
// @access  Private/Admin
router.post('/:id/restock', protect, admin, async (req, res) => {
    try {
        const { amount } = req.body;
        const sweet = await Sweet.findById(req.params.id);

        if (sweet) {
            sweet.quantity += Number(amount) || 1;
            await sweet.save();
            res.json({ message: 'Restock successful', sweet });
        } else {
            res.status(404).json({ message: 'Sweet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
