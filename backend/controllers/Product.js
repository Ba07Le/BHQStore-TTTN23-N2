const Product = require("../models/Product");
 
exports.create = async (req, res) => {
  try {
    const data = { ...req.body };
 
    data.price = Number(data.price);
    data.stockQuantity = Number(data.stockQuantity);
 
    if (!req.files?.thumbnail?.[0]) {
      return res.status(400).json({ message: "Cần có thumbnail sản phẩm" });
    }
    data.thumbnail = `/uploads/products/${req.files.thumbnail[0].filename}`;
 
    if (!req.files?.images?.length) {
      return res.status(400).json({ message: "Cần có hình ảnh sản phẩm" });
    }

    data.images = req.files.images.map(
      (file) => `/uploads/products/${file.filename}`
    );

    const created = new Product(data);
    await created.save();

    res.status(201).json(created);
  } catch (error) {
    console.log("LỖI TẠO SẢN PHẨM:", error);
    return res
      .status(500)
      .json({ message: "Lỗi khi thêm sản phẩm, vui lòng thử lại sau." });
  }
};




 
exports.getAll = async (req, res) => {
  try {
    const filter = {};
    const sort = {};
    let skip = 0;
    let limit = 0;

    if (req.query.search) {
  filter.title = { $regex: req.query.search, $options: "i" };
}



    if (req.query.brand) {
      filter.brand = { $in: req.query.brand };
    }

    if (req.query.category) {
      filter.category = { $in: req.query.category };
    }

    if (req.query.user) {
      filter["isDeleted"] = false;
    }

    if (req.query.sort) {
      sort[req.query.sort] = req.query.order
        ? req.query.order === "asc"
          ? 1
          : -1
        : 1;
    }

    if (req.query.page && req.query.limit) {
      const pageSize = req.query.limit;
      const page = req.query.page;

      skip = pageSize * (page - 1);
      limit = pageSize;
    }

    const totalDocs = await Product.find(filter)
      .sort(sort)
      .populate("brand")
      .countDocuments()
      .exec();

    const results = await Product.find(filter)
      .sort(sort)
      .populate("brand")
      .skip(skip)
      .limit(limit)
      .exec();

    res.set("X-Total-Count", totalDocs);
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Không thể tải sản phẩm, vui lòng thử lại sau." });
  }
};
 
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findById(id)
      .populate("brand")
      .populate("category");
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Không thể lấy thông tin chi tiết sản phẩm, vui lòng thử lại sau.",
    });
  }
};
 
exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };
 
    if (req.files?.thumbnail?.length) {
      updateData.thumbnail = `/uploads/products/${req.files.thumbnail[0].filename}`;
    } else if (req.body.oldThumbnail) {
      updateData.thumbnail = req.body.oldThumbnail;
    }
 
    let images = [];

    if (req.body.oldImages) {
      images = Array.isArray(req.body.oldImages)
        ? req.body.oldImages
        : [req.body.oldImages];
    }

    if (req.files?.images?.length) {
      const newImages = req.files.images.map(
        (file) => `/uploads/products/${file.filename}`
      );
      images = [...images, ...newImages];
    }

    updateData.images = images;

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("updateById error:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật sản phẩm, vui lòng thử lại sau." });
  }
};


exports.undeleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const unDeleted = await Product.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    ).populate("brand");

    res.status(200).json(unDeleted);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi khi khôi phục sản phẩm, vui lòng thử lại sau.",
    });
  }
};
 
exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    ).populate("brand");

    res.status(200).json(deleted);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Không thể xóa sản phẩm, vui lòng thử lại sau.",
    });
  }
};
