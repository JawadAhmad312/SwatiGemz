import express from "express";
import mongoose from "mongoose";

import WomenCategory from "../models/womencategory.js";

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
   GET ALL WOMEN CATEGORY
========================================= */

router.get("/", async (req, res) => {

  try {

    const data =
      await WomenCategory.find({});

    res.json(data);

  } catch (err) {

    res.status(500).json({

      success: false,

      message:
        "Error Fetching Data",

      err
    });
  }
});

/* =========================================
   GET SINGLE WOMEN CATEGORY
========================================= */

router.get("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid ID"
      });
    }

    const item =
      await WomenCategory.findById(id);

    if (!item) {

      return res.status(404).json({

        success: false,

        message:
          "Category Not Found"
      });
    }

    res.json(item);

  } catch (err) {

    res.status(500).json({

      success: false,

      message:
        "Error Fetching Item",

      err
    });
  }
});

/* =========================================
   CREATE WOMEN CATEGORY
========================================= */

router.post(

  "/",

  isAdmin,

  upload.fields([

    {
      name: "mainimages",
      maxCount: 1
    },

    {
      name: "otherImages",
      maxCount: 10
    }

  ]),

  async (req, res) => {

    try {

      /* MAIN IMAGE */

      let mainImage = "";

      if (req.files?.mainimages) {

        const uploadedMain =
          await uploadBuffer(
            req.files.mainimages[0].buffer
          );

        mainImage =
          uploadedMain.secure_url;
      }

      /* OTHER IMAGES */

      let otherImages = [];

      if (req.files?.otherImages) {

        for (
          let file of req.files.otherImages
        ) {

          const uploaded =
            await uploadBuffer(
              file.buffer
            );

          otherImages.push(
            uploaded.secure_url
          );
        }
      }

      /* DETAILS */

      let details = {};

      if (req.body.details) {

        details =

          typeof req.body.details ===
          "string"

            ? JSON.parse(
                req.body.details
              )

            : req.body.details;
      }

      /* CREATE */

      const newCategory =
        new WomenCategory({

          title:
            req.body.title,

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

          soldOut:
            Number(
              req.body.stockquantity
            ) <= 0,

          mainimages:
            mainImage,

          otherImages,

          details
        });

      await newCategory.save();

      res.status(201).json({

        success: true,

        message:
          "Women Category Added",

        data:
          newCategory
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message:
          "Error Adding Category",

        err
      });
    }
  }
);

/* =========================================
   UPDATE WOMEN CATEGORY
========================================= */

router.put(

  "/:id",

  isAdmin,

  upload.fields([

    {
      name: "mainimages",
      maxCount: 1
    },

    {
      name: "otherImages",
      maxCount: 10
    }

  ]),

  async (req, res) => {

    try {

      const { id } = req.params;

      /* OLD PRODUCT */

      const oldProduct =
        await WomenCategory.findById(id);

      if (!oldProduct) {

        return res.status(404).json({

          success: false,

          message:
            "Category Not Found"
        });
      }

      /* DETAILS */

      let details = {};

      if (req.body.details) {

        details =

          typeof req.body.details ===
          "string"

            ? JSON.parse(
                req.body.details
              )

            : req.body.details;
      }

      /* EXISTING OTHER IMAGES */

      let existingImages =
        req.body.existingImages || [];

      if (
        typeof existingImages ===
        "string"
      ) {

        existingImages =
          JSON.parse(
            existingImages
          );
      }

      /* NEW OTHER IMAGES */

      let newImages = [];

      if (req.files?.otherImages) {

        for (
          let file of req.files.otherImages
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
        oldProduct.mainimages;

      /* NEW MAIN IMAGE */

      if (req.files?.mainimages) {

        const uploadedMain =
          await uploadBuffer(
            req.files.mainimages[0].buffer
          );

        mainImage =
          uploadedMain.secure_url;
      }

      /* FIX MAIN IMAGE ISSUE */

      if (

        !req.files?.mainimages &&

        !req.body.mainimages

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
        await WomenCategory.findByIdAndUpdate(

          id,

          {

            title:
              req.body.title,

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

            soldOut:
              Number(
                req.body.stockquantity
              ) <= 0,

            mainimages:
              mainImage,

            otherImages:
              cleanedImages,

            details
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

        message:
          "Error Updating Category",

        err
      });
    }
  }
);

/* =========================================
   DELETE WOMEN CATEGORY
========================================= */

router.delete("/:id", isAdmin, async (req, res) => {

  try {

    const deleted =
      await WomenCategory.findByIdAndDelete(
        req.params.id
      );

    if (!deleted) {

      return res.status(404).json({

        success: false,

        message:
          "Category Not Found"
      });
    }

    res.json({

      success: true,

      message:
        "Deleted Successfully"
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message:
        "Error Deleting Category",

      err
    });
  }
});

export default router;
