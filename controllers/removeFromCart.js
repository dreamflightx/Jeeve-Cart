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
  