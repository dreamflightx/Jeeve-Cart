import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Assume `req.user` contains the authenticated user's data from JWT

  if (!productId || !quantity) {
    return res.status(400).json({ message: 'Product ID and quantity are required' });
  }

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ user: userId, items: [{ product: productId, quantity }] });
    } else {
      // Check if product already exists in the cart
      const existingItem = cart.items.find((item) => item.product.toString() === productId);

      if (existingItem) {
        // If product exists, update the quantity
        existingItem.quantity += quantity;
      } else {
        // If product does not exist, add a new item to the cart
        cart.items.push({ product: productId, quantity });
      }
    }

    // Save the cart
    await cart.save();

    return res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCart = async (req, res) => {
  const userId = req.user.id; // Assume `req.user` contains the authenticated user's data from JWT

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    return res.status(200).json({ message: 'Cart retrieved successfully', cart });
  } catch (error) {
    console.error('Error retrieving cart:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


//remove cart 
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item from cart
    const updatedItems = cart.items.filter((item) => item.product.toString() !== productId);
    cart.items = updatedItems;

    await cart.save();

    return res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

