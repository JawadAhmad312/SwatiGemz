import express from "express";
import mongoose from "mongoose";

import WomenRing from "../models/womenring.js";

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
   GET ALL WOMEN RINGS
========================================= */

router.get("/", async (req, res) => {

  try {

    const data =
      await WomenRing.find({});

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
   GET SINGLE WOMEN RING
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
      await WomenRing.findById(id);

    if (!product) {

      return res.status(404).json({

        message:
          "Not found"
      });
    }

    res.json(product);

  } catch (err) {

    res.status(500).json({

      message:
        "Error fetching product",

      err
    });
  }
});

/* =========================================
   CREATE WOMEN RING
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
        new WomenRing({

          name:
            req.body.name,

          price:
            Number(
              req.body.price
            ),

          description:
            req.body.description,

          category:
            "WomenRing",

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
   UPDATE WOMEN RING
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
      maxCount: 5
    }

  ]),

  async (req, res) => {

    try {

      const { id } = req.params;

      /* OLD PRODUCT */

      const oldProduct =
        await WomenRing.findById(id);

      if (!oldProduct) {

        return res.status(404).json({

          success: false,

          message:
            "Product Not Found"
        });
      }

      /* EXISTING IMAGES */

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

      /* FIX MAIN IMAGE ISSUE */

      if (

        !req.files?.image &&

        !req.body.image

      ) {

        mainImage = "";
      }

      /* AUTO SELECT */

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
        await WomenRing.findByIdAndUpdate(

          id,

          {

            name:
              req.body.name,

            price:
              Number(
                req.body.price
              ),

            description:
              req.body.description,

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

        updated
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
   DELETE WOMEN RING
========================================= */

router.delete("/:id", isAdmin, async (req, res) => {

  try {

    const { id } = req.params;

    const deleted =
      await WomenRing.findByIdAndDelete(id);

    if (!deleted) {

      return res.status(404).json({

        message:
          "Product not found"
      });
    }

    res.json({

      success: true,

      message:
        "Deleted successfully"
    });

  } catch (err) {

    res.status(500).json({

      message:
        "Delete error",

      err
    });
  }
});

export default router;
