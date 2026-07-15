import express from "express";

import slugify from "slugify";

import GemCollection from "../models/Collection.js";

import Gemstone from "../models/Gemstone.js";

import upload from "../upload.js";

import cloudinary from "../cloudinary.js";

import streamifier from "streamifier";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

/* =========================================
   CLOUDINARY BUFFER
========================================= */

const uploadBuffer = (buffer) => {

  return new Promise((resolve, reject) => {

    const stream =
      cloudinary.uploader.upload_stream(

        {
          folder: "collections",
        },

        (err, result) => {

          if (err)
            reject(err);

          else
            resolve(result);
        }
      );

    streamifier
      .createReadStream(buffer)
      .pipe(stream);
  });
};

/* =========================================
   GET ALL COLLECTIONS
========================================= */

router.get("/", async (req, res) => {

  try {

    /* COLLECTIONS */

    const collections =
      await GemCollection.find()

        .sort({
          createdAt: -1
        });

    /* GEMSTONES */

    const gemstones =
      await Gemstone.find({})

        .populate(
          "gemCollection"
        );

    /* FINAL COLLECTIONS */

    const updatedCollections =

      collections.map(
        (collection) => {

          /* COUNT PRODUCTS */

          const totalProducts =

            gemstones.filter(

              (item) =>

                item.gemCollection &&

                item.gemCollection._id
                  .toString()

                ===

                collection._id
                  .toString()

            ).length;

          return {

            ...collection._doc,

            totalProducts
          };
        }
      );

    res.status(200).json({

      success: true,

      total:
        updatedCollections.length,

      collections:
        updatedCollections
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message:
        err.message
    });
  }
});

/* =========================================
   GET SINGLE COLLECTION BY ID
========================================= */

router.get("/admin/:id", isAdmin, async (req, res) => {

  try {

    const collection =
      await GemCollection.findById(
        req.params.id
      );

    if (!collection) {

      return res.status(404).json({

        success: false,

        message:
          "Collection not found",
      });
    }

    res.status(200).json({

      success: true,

      collection,
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message:
        err.message,
    });
  }
});

/* =========================================
   GET SINGLE COLLECTION BY SLUG
========================================= */

router.get("/:slug", async (req, res) => {

  try {

    const { slug } = req.params;

    const collection =
      await GemCollection.findOne({

        slug
      });

    if (!collection) {

      return res.status(404).json({

        success: false,

        message:
          "Collection not found"
      });
    }

    res.status(200).json({

      success: true,

      collection
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message:
        err.message
    });
  }
});

/* =========================================
   CREATE COLLECTION
========================================= */

router.post(

  "/admin/create",

  isAdmin,

  upload.single("image"),

  async (req, res) => {

    try {

      /* MAIN IMAGE */

      const mainUpload =
        await uploadBuffer(
          req.file.buffer
        );

      /* CREATE COLLECTION */

      const collection =
        new GemCollection({

          name:
            req.body.name,

          description:
            req.body.description,

          active:
            req.body.active ===
            "true",

          image:
            mainUpload.secure_url,

          slug:
            slugify(
              req.body.name,
              {
                lower: true,
                strict: true,
              }
            ),
        });

      await collection.save();

      res.status(201).json({

        success: true,

        collection,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message:
          err.message,
      });
    }
  }
);

/* =========================================
   UPDATE COLLECTION
========================================= */

router.put(

  "/admin/update/:id",

  isAdmin,

  upload.single("image"),

  async (req, res) => {

    try {

      /* FIND COLLECTION */

      const collection =
        await GemCollection.findById(
          req.params.id
        );

      if (!collection) {

        return res.status(404).json({

          success: false,

          message:
            "Collection not found",
        });
      }

      /* IMAGE */

      let imageUrl =
        collection.image;

      /* NEW IMAGE */

      if (req.file) {

        const uploaded =
          await uploadBuffer(
            req.file.buffer
          );

        imageUrl =
          uploaded.secure_url;
      }

      /* UPDATE */

      const updatedCollection =
        await GemCollection.findByIdAndUpdate(

          req.params.id,

          {

            name:
              req.body.name,

            description:
              req.body.description,

            active:
              req.body.active ===
              "true",

            image:
              imageUrl,

            slug:
              slugify(
                req.body.name,
                {
                  lower: true,
                  strict: true,
                }
              ),
          },

          {
            new: true,

            runValidators: true
          }
        );

      res.status(200).json({

        success: true,

        collection:
          updatedCollection,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message:
          err.message,
      });
    }
  }
);

/* =========================================
   DELETE COLLECTION
========================================= */

router.delete(

  "/admin/delete/:id",

  isAdmin,

  async (req, res) => {

    try {

      await GemCollection.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({

        success: true,

        message:
          "Collection deleted",
      });

    } catch (err) {

      res.status(500).json({

        success: false,

        message:
          err.message,
      });
    }
  }
);

export default router;
