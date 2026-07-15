const Gemstone = require("../models/Gemstone");
const Collection = require("../models/Collection");


// GET PRODUCTS BY COLLECTION

const getGemstonesByCollection = async (req, res) => {
  try {
    const { slug } = req.params;

    // FILTERS

    const {
      sort,
      availability,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    // FIND COLLECTION

    const collection = await Collection.findOne({
      slug,
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    // QUERY OBJECT

    let query = {
      collection: collection._id,
    };

    // AVAILABILITY FILTER

    if (availability === "in-stock") {
      query.stock = { $gt: 0 };
    }

    if (availability === "sold-out") {
      query.stock = 0;
    }

    // PRICE FILTER

    if (minPrice || maxPrice) {
      query.salePrice = {};

      if (minPrice) {
        query.salePrice.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.salePrice.$lte = Number(maxPrice);
      }
    }

    // SORTING

    let sortOption = {};

    switch (sort) {
      case "price-low-high":
        sortOption.salePrice = 1;
        break;

      case "price-high-low":
        sortOption.salePrice = -1;
        break;

      case "a-z":
        sortOption.name = 1;
        break;

      case "z-a":
        sortOption.name = -1;
        break;

      default:
        sortOption.createdAt = -1;
    }

    // PAGINATION

    const skip = (page - 1) * limit;

    // PRODUCTS

    const gemstones = await Gemstone.find(query)
      .populate("collection")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // TOTAL PRODUCTS

    const totalProducts = await Gemstone.countDocuments(query);

    res.status(200).json({
      success: true,

      currentPage: Number(page),

      totalPages: Math.ceil(totalProducts / limit),

      totalProducts,

      gemstones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET SINGLE GEMSTONE

const getSingleGemstone = async (req, res) => {
  try {
    const { slug } = req.params;

    const gemstone = await Gemstone.findOne({
      slug,
    }).populate("collection");

    if (!gemstone) {
      return res.status(404).json({
        success: false,
        message: "Gemstone not found",
      });
    }

    res.status(200).json({
      success: true,
      gemstone,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getGemstonesByCollection,
  getSingleGemstone,
};