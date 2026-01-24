const Product = require("../models/Product");



exports.seedProduct = async () => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Product seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
