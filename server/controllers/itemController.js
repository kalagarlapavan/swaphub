import mongoose from 'mongoose';
import Item from '../models/Item.js';
import { mockItems, mockUsers } from '../seedData.js';

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res) => {
  try {
    const { title, description, category, condition, images } = req.body;

    if (!title || !description || !category || !condition) {
      return res.status(400).json({ message: 'Please provide title, description, category, and condition' });
    }

    const item = await Item.create({
      title,
      description,
      category,
      condition,
      images: images || [],
      owner: req.user._id,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Create item error:', error.message);
    res.status(500).json({ message: 'Server Error: Failed to list item' });
  }
};

// @desc    Get all items (browse, search, filter)
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res) => {
  try {
    const { search, category, owner } = req.query;

    // Fallback: If DB is offline, serve mock items
    if (mongoose.connection.readyState !== 1) {
      let items = mockItems.map((item) => {
        const ownerInfo = mockUsers.find((u) => u._id === item.owner);
        return {
          ...item,
          owner: ownerInfo
            ? {
                _id: ownerInfo._id,
                name: ownerInfo.name,
                avatar: ownerInfo.avatar,
                location: ownerInfo.location,
              }
            : null,
        };
      });

      if (search) {
        items = items.filter((i) =>
          i.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (category && category !== 'All') {
        items = items.filter((i) => i.category === category);
      }

      if (owner) {
        items = items.filter((i) => i.owner && i.owner._id === owner);
      }

      return res.json(items);
    }

    const query = { status: { $ne: 'Swapped' } };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (owner) {
      query.owner = owner;
    }

    const items = await Item.find(query)
      .populate('owner', 'name avatar location')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Get items error:', error.message);
    res.status(500).json({ message: 'Server Error: Failed to fetch items' });
  }
};

// @desc    Get single item details
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res) => {
  try {
    // Fallback: If DB is offline, serve mock item details
    if (mongoose.connection.readyState !== 1) {
      const item = mockItems.find((i) => i._id === req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      const ownerInfo = mockUsers.find((u) => u._id === item.owner);
      return res.json({
        ...item,
        owner: ownerInfo
          ? {
              _id: ownerInfo._id,
              name: ownerInfo.name,
              email: ownerInfo.email,
              avatar: ownerInfo.avatar,
              location: ownerInfo.location,
            }
          : null,
      });
    }

    const item = await Item.findById(req.params.id).populate('owner', 'name email avatar location');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get item by id error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server Error: Failed to fetch item' });
  }
};

// @desc    Update item details
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req, res) => {
  try {
    const { title, description, category, condition, images, status } = req.body;

    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Verify user owns the item
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this item' });
    }

    item.title = title || item.title;
    item.description = description || item.description;
    item.category = category || item.category;
    item.condition = condition || item.condition;
    item.images = images || item.images;
    item.status = status || item.status;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error('Update item error:', error.message);
    res.status(500).json({ message: 'Server Error: Failed to update item' });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Verify user owns the item
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Item.deleteOne({ _id: item._id });
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error('Delete item error:', error.message);
    res.status(500).json({ message: 'Server Error: Failed to delete item' });
  }
};
