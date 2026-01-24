const Review = require("../models/Review");



exports.seedReview = async () => {
  try {
    await Review.deleteMany({}); 
    await Review.insertMany(reviews);
    console.log("Review seeded successfully");
  } catch (error) {
    console.log(error);
  }
};