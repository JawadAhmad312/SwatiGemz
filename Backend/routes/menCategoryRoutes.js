import express from "express";
import mongoose from "mongoose";

import MenCategory from "../models/mencategory.js";

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
          folder: "gemstone",
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
   GET ALL MEN CATEGORY
========================================= */

router.get("/", async (req, res) => {

  try {

    const data =
      await MenCategory.find({});

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
   GET SINGLE MEN CATEGORY
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
      await MenCategory.findById(id);

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
   CREATE MEN CATEGORY
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

      const mainUpload =
        await uploadBuffer(
          req.files.mainimages[0].buffer
        );

      /* OTHER IMAGES */

      let extraImages = [];

      if (req.files.otherImages) {

        for (
          let file of req.files.otherImages
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

      /* DETAILS */

      let details = {};

      if (req.body.details) {

        details =
          JSON.parse(
            req.body.details
          );
      }

      /* CREATE */

      const newCategory =
        new MenCategory({

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
            mainUpload.secure_url,

          otherImages:
            extraImages,

          details,
        });

      await newCategory.save();

      res.status(201).json({

        success: true,

        data:
          newCategory,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message:
          "Error Adding Category",

        err,
      });
    }
  }
);

/* =========================================
   UPDATE MEN CATEGORY
========================================= */

router.put(

  "/:id",

  isAdmin,

  upload.fields([

    {
      name: "mainimages",
      maxCount: 1,
    },

    {
      name: "otherImages",
      maxCount: 10,
    },

  ]),

  async (req, res) => {

    try {

      const { id } = req.params;

      /* OLD PRODUCT */

      const oldProduct =
        await MenCategory.findById(id);

      if (!oldProduct) {

        return res.status(404).json({

          success: false,

          message:
            "Category Not Found",
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

      /* FINAL OTHER IMAGES */

      let finalImages = [

        ...existingImages,

        ...newImages,
      ];

      /* REMOVE MAIN IMAGE
         FROM OTHER IMAGES */

      finalImages =
        finalImages.filter(

          (img) =>

            img !== mainImage
        );

      /* AUTO FIX */

      if (

        !mainImage &&

        finalImages.length > 0

      ) {

        mainImage =
          finalImages[0];

        finalImages =
          finalImages.filter(

            (img) =>

              img !== mainImage
          );
      }

      /* UPDATE */

      const updated =
        await MenCategory.findByIdAndUpdate(

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
              finalImages,

            details,
          },

          {

            new: true,

            runValidators: true,
          }
        );

      res.json({

        success: true,

        message:
          "Updated Successfully",

        data:
          updated,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message:
          "Error Updating Category",

        err,
      });
    }
  }
);

/* =========================================
   DELETE MEN CATEGORY
========================================= */

router.delete("/:id", isAdmin, async (req, res) => {

  try {

    await MenCategory.findByIdAndDelete(
      req.params.id
    );

    res.json({

      success: true,

      message:
        "Deleted Successfully",
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message:
        "Error Deleting Category",

      err,
    });
  }
});

export default router;
