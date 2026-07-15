import express from "express";
import mongoose from "mongoose";

import Earring from "../models/earring.js";

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
   GET ALL EARRINGS
========================================= */

router.get("/", async (req, res) => {

  try {

    const data =
      await Earring.find({

        isActive: true
      });

    res.json(data);

  } catch (err) {

    console.error(
      "EARRINGS API ERROR:",
      err
    );

    res.status(500).json({

      message:
        "Error Fetching data"
    });
  }
});

/* =========================================
   GET SINGLE EARRING
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
      await Earring.findById(id);

    if (!product) {

      return res.status(404).json({

        message:
          "Product not found"
      });
    }

    res.json(product);

  } catch (err) {

    console.error(
      "DETAIL API ERROR:",
      err
    );

    res.status(500).json({

      message:
        "Server error"
    });
  }
});

/* =========================================
   CREATE EARRING
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

      const earring =
        new Earring({

          name:
            req.body.name,

          price:
            Number(
              req.body.price
            ),

          currency:
            req.body.currency ||
            "PKR",

          description:
            req.body.description,

          metal:
            req.body.metal,

          stoneWeight:
            req.body.stoneWeight,

          category:
            "Earrings",

          stockquantity:
            Number(
              req.body.stockquantity
            ),

          availability:
            req.body.availability,

          isActive:
            req.body.isActive ===
            "true",

          image:
            mainUpload.secure_url,

          images:
            extraImages
        });

      await earring.save();

      res.json({

        success: true,

        earring
      });

    } catch (err) {

      console.log(
        "BACKEND ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message
      });
    }
  }
);

/* =========================================
   UPDATE EARRING
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

      /* OLD ITEM */

      const oldItem =
        await Earring.findById(id);

      if (!oldItem) {

        return res.status(404).json({

          message:
            "Earring not found"
        });
      }

      /* EXISTING IMAGES */

      let existingImages = [];

      if (req.body.existingImages) {

        existingImages =

          typeof req.body.existingImages ===
          "string"

            ? JSON.parse(
                req.body.existingImages
              )

            : req.body.existingImages;
      }

      /* NEW OTHER IMAGES */

      let newImages = [];

      if (

        req.files?.images &&

        req.files.images.length > 0

      ) {

        for (
          const file of req.files.images
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
        oldItem.image;

      /* NEW MAIN IMAGE */

      if (

        req.files?.image &&

        req.files.image.length > 0

      ) {

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
        await Earring.findByIdAndUpdate(

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

            metal:
              req.body.metal,

            stoneWeight:
              req.body.stoneWeight,

            stockquantity:
              Number(
                req.body.stockquantity
              ),

            availability:
              req.body.availability,

            isActive:
              req.body.isActive ===
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

      console.error(
        "EARRING UPDATE ERROR:",
        err
      );

      res.status(500).json({

        error:
          err.message
      });
    }
  }
);

/* =========================================
   DELETE EARRING
========================================= */

router.delete("/:id", isAdmin, async (req, res) => {

  try {

    const deleted =
      await Earring.findByIdAndDelete(
        req.params.id
      );

    if (!deleted) {

      return res.status(404).json({

        message:
          "Not found"
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
        "Delete error"
    });
  }
});

export default router;
