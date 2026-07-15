import express from "express";
import mongoose from "mongoose";

import Stone from "../models/stone.js";

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

const collectFilesByField = (files = []) =>
  files.reduce((accumulator, file) => {
    if (!file?.fieldname) {
      return accumulator;
    }

    if (!accumulator[file.fieldname]) {
      accumulator[file.fieldname] = [];
    }

    accumulator[file.fieldname].push(file);
    return accumulator;
  }, {});

/* =========================================
   GET ALL STONES
========================================= */

router.get("/", async (req, res) => {
 try {
    const data = await Stone.find({});
    res.json(data); // send data to frontend
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

/* =========================================
   GET SINGLE STONE
========================================= */

router.get("/:id", async (req, res) => {

  try {
    const { id } = req.params;
    // ✅ validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const product = await Stone.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
});

/* =========================================
   CREATE STONE
========================================= */

router.post("/",
 isAdmin,
 upload.any(),
  async (req, res) => {
    try {
      const filesByField = collectFilesByField(req.files);
      const mainImageFile =
        filesByField.image?.[0] ||
        filesByField.mainImage?.[0] ||
        filesByField.mainimages?.[0];
      const extraImageFiles = [
        ...(filesByField.images || []),
        ...(filesByField.otherImages || []),
      ];

      if (!mainImageFile) {
        return res.status(400).json({
          success: false,
          error: "Main image is required",
        });
      }

      const uploadBuffer = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "gemstone" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      // MAIN IMAGE
      const mainUpload = await uploadBuffer(mainImageFile.buffer);

      // MULTIPLE IMAGES
      let extraImages = [];
      if (extraImageFiles.length > 0) {
        for (let file of extraImageFiles) {
          const uploaded = await uploadBuffer(file.buffer);
          extraImages.push(uploaded.secure_url);
        }
      }

      const stone = new Stone({
        name: req.body.name,
        price: Number(req.body.price),
        category: req.body.category,
        weight: Number(req.body.weight),
        shape: req.body.shape,
        stockquantity: Number(req.body.stockquantity),
        description: req.body.description,

        image: mainUpload.secure_url,
        images: extraImages
      });

      await stone.save();

      res.json({ success: true, stone });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* =========================================
   UPDATE STONE
========================================= */

router.put(

  "/:id",

  isAdmin,

  upload.any(),

  async (req, res) => {

    try {
      const filesByField = collectFilesByField(req.files);
      const mainImageFile =
        filesByField.image?.[0] ||
        filesByField.mainImage?.[0] ||
        filesByField.mainimages?.[0];
      const extraImageFiles = [
        ...(filesByField.images || []),
        ...(filesByField.otherImages || []),
      ];

      const { id } = req.params;

      /* CLOUDINARY */

      const uploadBuffer = (buffer) =>

        new Promise((resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(

              {
                folder: "gemstone"
              },

              (err, result) =>

                err

                  ? reject(err)

                  : resolve(result)
            );

          streamifier
            .createReadStream(buffer)
            .pipe(stream);
        });

      /* OLD ITEM */

      const oldItem =
        await Stone.findById(id);

      if (!oldItem) {

        return res.status(404).json({

          success: false,

          message:
            "Stone Not Found"
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

      if (extraImageFiles.length > 0) {

        for (let file of extraImageFiles) {

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

      if (mainImageFile) {

        const uploadedMain =
          await uploadBuffer(
            mainImageFile.buffer
          );

        mainImage =
          uploadedMain.secure_url;
      }

      /* IF USER REMOVED MAIN IMAGE */

      if (

        !mainImageFile &&

        !req.body.image

      ) {

        mainImage = "";
      }

      /* AUTO SELECT ONLY
         WHEN MAIN IMAGE EMPTY */

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
        await Stone.findByIdAndUpdate(

          id,

          {

            name:
              req.body.name,

            price:
              Number(
                req.body.price
              ),

            category:
              req.body.category,

            weight:
              Number(
                req.body.weight
              ),

            shape:
              req.body.shape,

            stockquantity:
              Number(
                req.body.stockquantity
              ),

            description:
              req.body.description,

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

        success: false,

        error:
          err.message
      });
    }
  }
);

/* =========================================
   DELETE STONE
========================================= */

router.delete("/:id", isAdmin, async (req, res) => {
   try {
    const deleted = await Stone.findByIdAndDelete(req.params.id);
    res.json({ success: true, deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
