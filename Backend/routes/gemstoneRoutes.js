import express from "express";

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
   GET ALL GEMSTONES
========================================= */

router.get("/", async (req, res) => {

  try {

    const gemstones =
      await Gemstone.find()

        .populate(
          "gemCollection"
        )

        .sort({
          createdAt: -1,
        });

    res.status(200).json({

      success: true,

      total:
        gemstones.length,

      gemstones,
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
   GET SINGLE GEMSTONE
========================================= */

router.get("/:slug", async (req, res) => {

  try {

    const gemstone =
      await Gemstone.findOne({

        slug:
          req.params.slug,
      })

        .populate(
          "gemCollection"
        );

    if (!gemstone) {

      return res.status(404).json({

        success: false,

        message:
          "Gemstone not found",
      });
    }

    res.status(200).json({

      success: true,

      gemstone,
    });

  } catch (err) {

    console.log(err);

    res.status(400).json({

      success: false,

      message:
        err.message,
    });
  }
});

/* =========================================
   CREATE GEMSTONE
========================================= */

router.post(

  "/",

  isAdmin,

  upload.fields([

    {
      name: "image",
      maxCount: 1,
    },

    {
      name: "images",
      maxCount: 5,
    },

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

      /* CREATE GEMSTONE */

      const gemstone =
        new Gemstone({

          name:
            req.body.name,

          gemCollection:
            req.body.gemCollection,

          weight:
            Number(
              req.body.weight
            ),

          shape:
            req.body.shape,

          category:
            req.body.category,

          price:
            Number(
              req.body.price
            ),

          originalPrice:
            Number(
              req.body.originalPrice
            ),

          stockquantity:
            Number(
              req.body.stockquantity
            ),

          shortDescription:
            req.body.shortDescription,

          description:
            req.body.description,

          active:
            req.body.active ===
            "true",

          featured:
            req.body.featured ===
            "true",

          soldOut:
            Number(
              req.body.stockquantity
            ) <= 0,

          image:
            mainUpload.secure_url,

          images:
            extraImages,
        });

      await gemstone.save();

      res.status(201).json({

        success: true,

        gemstone,
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
   UPDATE GEMSTONE
========================================= */

router.put(

  "/:slug",

  isAdmin,

  upload.fields([

    {
      name: "image",
      maxCount: 1,
    },

    {
      name: "images",
      maxCount: 5,
    },

  ]),

  async (req, res) => {

    try {

      /* FIND GEMSTONE */

      const gemstone =
        await Gemstone.findOne({

          slug:
            req.params.slug,
        });

      if (!gemstone) {

        return res.status(404).json({

          success: false,

          message:
            "Gemstone not found",
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
          JSON.parse(
            existingImages
          );
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

        ...newImages,

      ].filter(img => img);

      /* MAIN IMAGE */

      let mainImage =
        gemstone.image;

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

      /* UPDATE OBJECT */

      const updateData = {

        ...req.body,

        image:
          mainImage,

        images:
          cleanedImages,
      };

      /* BOOLEAN FIX */

      updateData.active =
        req.body.active ===
        "true";

      updateData.featured =
        req.body.featured ===
        "true";

      /* NUMBER FIX */

      updateData.price =
        Number(
          req.body.price
        );

      updateData.weight =
        Number(
          req.body.weight
        );

      updateData.stockquantity =
        Number(
          req.body.stockquantity
        );

      /* SOLD OUT AUTO */

      updateData.soldOut =
        updateData.stockquantity <= 0;

      /* UPDATE GEMSTONE */

      const updatedGemstone =
        await Gemstone.findByIdAndUpdate(

          gemstone._id,

          updateData,

          {
            new: true,

            runValidators: true,
          }
        )

          .populate(
            "gemCollection"
          );

      res.status(200).json({

        success: true,

        gemstone:
          updatedGemstone,
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
   DELETE GEMSTONE
========================================= */

router.delete("/:id", isAdmin, async (req, res) => {

  try {

    await Gemstone.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({

      success: true,

      message:
        "Gemstone deleted",
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message:
        err.message,
    });
  }
});

export default router;
