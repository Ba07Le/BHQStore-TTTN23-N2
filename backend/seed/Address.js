const Address = require("../models/Address");


exports.seedAddress = async () => {
  try {
 
    const count = await Address.countDocuments();

    if (count > 0) {
      console.log("Address already exists. Skipping seed...");
      return;
    }

    await Address.insertMany(addresses);
    console.log("Address seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
