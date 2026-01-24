const Order = require("../models/Order");
const fs = require("fs");



exports.seedOrder = async () => {
  try {
    await Order.deleteMany({}); 
    await Order.insertMany(orders);
    console.log("Order seeded successfully");
  } catch (error) {
    console.log(error);
  }
};