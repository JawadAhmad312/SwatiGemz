const Collection = require("../models/Collection");


// GET ALL COLLECTIONS

const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find({
      active: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: collections.length,
      collections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET SINGLE COLLECTION BY SLUG

const getCollectionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const collection = await Collection.findOne({
      slug,
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllCollections,
  getCollectionBySlug,
};