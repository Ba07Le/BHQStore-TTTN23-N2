const Cart = require("../models/Cart");
const Product = require("../models/Product");



exports.seedCart = async () => {
  try {
  
    await Cart.deleteMany({});
    console.log("Old cart cleared");

    
    const validCartItems = [];

    for (const item of cartItems) {
      const productExists = await Product.findById(item.product);
      if (productExists) {
        validCartItems.push(item);
      }
    }

    
    if (validCartItems.length > 0) {
      await Cart.insertMany(validCartItems);
    }

    console.log(
      `Cart seeded successfully (${validCartItems.length} items)`
    );
  } catch (error) {
    console.error("Cart seed error:", error);
  }
};
