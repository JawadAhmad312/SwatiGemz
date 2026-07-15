import express from "express";
import mongoose from "mongoose";

import MenRing from "../models/menrings.js";

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
          folder: "gemstone"
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
   GET ALL MEN RINGS
========================================= */

router.get("/", async (req, res) => {

  try {

    const data =
      await MenRing.find({});

    res.json(data);

  } catch (err) {

    res.status(500).json({

      message:
        "Error Fetching data",

      err
    });
  }
});

/* =========================================
   GET SINGLE MEN RING
========================================= */

router.get("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({

        message:
          "Invalid ID"
      });
    }

    const product =
      await MenRing.findById(id);

    if (!product) {

      return res.status(404).json({

        message:
          "Product not found"
      });
    }

    res.json(product);

  } catch (error) {

    res.status(500).json({

      message:
        "Error fetching product",

      error
    });
  }
});

/* =========================================
   CREATE MEN RING
========================================= */

router.post(

  "/",

  isAdmin,

  upload.fields([

    {
      name: "image",
      maxCount: 1
    },

    {
      name: "images",
      maxCount: 5
    }

  ]),

  async (req, res) => {

    try {

      /* MAIN IMAGE */

      const mainUpload =
        await uploadBuffer(
          req.files.image[0].buffer
        );

      /* OTHER IMAGES */

      let extraImages = [];

      if (req.files.images) {

        for (
          let file of req.files.images
        ) {

          const uploaded =
            await uploadBuffer(
              file.buffer
            );

          extraImages.push(
            uploaded.secure_url
          );
        }
      }

      /* CREATE */

      const ring =
        new MenRing({

          name:
            req.body.name,

          price:
            Number(
              req.body.price
            ),

          description:
            req.body.description,

          category:
            "Ring",

          stockquantity:
            Number(
              req.body.stockquantity
            ),

          stoneWeight:
            Number(
              req.body.stoneWeight
            ),

          ringSize:
            Number(
              req.body.ringSize
            ),

          metal:
            String(
              req.body.metal
            ),

          weightUnit:
            req.body.weightUnit,

          isFeatured:
            req.body.isFeatured ===
            "true",

          image:
            mainUpload.secure_url,

          images:
            extraImages
        });

      await ring.save();

      res.json({

        success: true,

        ring
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        error:
          err.message
      });
    }
  }
);

/* =========================================
   UPDATE MEN RING
========================================= */

router.put(

  "/:id",

  isAdmin,

  upload.fields([

    {
      name: "image",
      maxCount: 1
    },

    {
      name: "images",
      maxCount: 10
    }

  ]),

  async (req, res) => {

    try {

      const { id } = req.params;

      /* OLD PRODUCT */

      const oldProduct =
        await MenRing.findById(id);

      if (!oldProduct) {

        return res.status(404).json({

          success: false,

          message:
            "Product Not Found"
        });
      }

      /* EXISTING OTHER IMAGES */

      let existingImages =
        req.body.existingImages || [];

      if (
        typeof existingImages ===
        "string"
      ) {

        existingImages =
          JSON.parse(existingImages);
      }

      /* NEW OTHER IMAGES */

      let newImages = [];

      if (req.files?.images) {

        for (
          let file of req.files.images
        ) {

          const uploaded =
            await uploadBuffer(
              file.buffer
            );

          newImages.push(
            uploaded.secure_url
          );
        }
      }

      /* FINAL OTHER IMAGES */

      const finalImages = [

        ...existingImages,

        ...newImages

      ].filter(img => img);

      /* MAIN IMAGE */

      let mainImage =
        oldProduct.image;

      /* NEW MAIN IMAGE */

      if (req.files?.image) {

        const uploadedMain =
          await uploadBuffer(
            req.files.image[0].buffer
          );

        mainImage =
          uploadedMain.secure_url;
      }

      /* MAIN IMAGE DELETE FIX */

      if (

        !req.files?.image &&

        !req.body.image

      ) {

        mainImage = "";
      }

      /* AUTO SELECT FIRST IMAGE */

      if (

        !mainImage &&

        finalImages.length > 0

      ) {

        mainImage =
          finalImages[0];
      }

      /* REMOVE MAIN IMAGE
         FROM OTHER IMAGES */

      const cleanedImages =

        finalImages.filter(

          img =>

            img !== mainImage
        );

      /* UPDATE */

      const updated =
        await MenRing.findByIdAndUpdate(

          id,

          {

            name:
              req.body.name,

            description:
              req.body.description,

            price:
              Number(
                req.body.price
              ),

            stockquantity:
              Number(
                req.body.stockquantity
              ),

            ringSize:
              Number(
                req.body.ringSize
              ),

            stoneWeight:
              Number(
                req.body.stoneWeight
              ),

            metal:
              req.body.metal,

            weightUnit:
              req.body.weightUnit,

            isFeatured:
              req.body.isFeatured ===
              "true",

            image:
              mainImage,

            images:
              cleanedImages
          },

          {

            new: true,

            runValidators: true
          }
        );

      res.json({

        success: true,

        message:
          "Updated Successfully",

        updated
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        error:
          err.message
      });
    }
  }
);

/* =========================================
   DELETE MEN RING
========================================= */

router.delete("/:id", isAdmin, async (req, res) => {

  try {

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({

        message:
          "Invalid ID"
      });
    }

    const deletedProduct =
      await MenRing.findByIdAndDelete(id);

    if (!deletedProduct) {

      return res.status(404).json({

        message:
          "Product not found"
      });
    }

    res.json({

      message:
        "Product deleted successfully ✅",

      deletedProduct
    });

  } catch (error) {

    res.status(500).json({

      message:
        "Error deleting product ❌",

      error
    });
  }
});

export default router;
