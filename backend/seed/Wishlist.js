const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");


exports.seedWishlist = async () => {
  try {
   
    await Wishlist.deleteMany({});
    console.log("Old wishlist cleared");

    
    const validWishlistItems = [];

    for (const item of wishlistItem) {
      const productExists = await Product.findById(item.product);
      if (productExists) {
        validWishlistItems.push(item);
      }
    }

   
    if (validWishlistItems.length > 0) {
      await Wishlist.insertMany(validWishlistItems);
    }

    console.log(
      `Wishlist seeded successfully (${validWishlistItems.length} items)`
    );
  } catch (error) {
    console.error("Wishlist seed error:", error);
  }
};
