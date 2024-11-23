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
  