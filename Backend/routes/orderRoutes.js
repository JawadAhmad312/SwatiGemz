import express from "express";

import Order from "../models/order.js";

import { getIO } from "../sockets/socket.js";
import MenRing from "../models/menrings.js";
import WomenRing from "../models/womenring.js";
import Necklace from "../models/necklaces.js";
import Earring from "../models/earring.js";
import Stone from "../models/stone.js";
import Gemstone from "../models/Gemstone.js";
import MenCategory from "../models/mencategory.js";
import WomenCategory from "../models/womencategory.js";
import GemCollection from "../models/Collection.js";
import { isAdmin } from "../middleware/admin.js";
const router = express.Router();

/* =========================================
   CREATE ORDER
========================================= */


router.post(

  "/create-order",

  async (req, res) => {

    try {
const orderNumber =
  `SG${Date.now().toString().slice(-8)}`;
     const order = await Order.create({

  orderNumber,

  items: req.body.items,

  subtotal: Number(req.body.subtotal),

  tax: Number(req.body.tax || 0),

  shipping: Number(req.body.shipping),

  total: Number(req.body.total),

  shippingAddress: req.body.shippingAddress,

  customerEmail:
    req.body.shippingAddress.email,

  paymentMethod:
    req.body.paymentMethod,

  orderStatus: "Pending",

});
      for (const item of req.body.items) {

        const models = [

          MenRing,
          WomenRing,
          Necklace,
          Earring,
          Stone,
          Gemstone,
          MenCategory,
          WomenCategory,
          GemCollection

        ];

        let updated = false;

        for (const Model of models) {

          const product =
            await Model.findById(
              item._id
            );

          if (product) {

            await Model.findByIdAndUpdate(

              item._id,

              {

                $inc: {

                  stockquantity:
                    -Number(
                      item.quantity || 1
                    )

                }

              }

            );

            console.log(
              `${product.name} stock updated`
            );

            updated = true;

            break;
          }
        }

        if (!updated) {

          console.log(
            "Product Not Found:",
            item._id
          );

        }

      }
      /* REALTIME NOTIFICATION */

      const io =
        getIO();

      if (io) {
        io.to("admins").emit(
          "newOrder",
          {
            customer:
              req.body?.shippingAddress?.firstName ||
              "Customer",
            total:
              req.body.total
          }
        );

        io.to("admins").emit(
          "productStockUpdated"
        );

        console.log(
          "Notification Sent"
        );
      }

      res.json({

        success: true,

        order
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
   GET ALL ORDERS
========================================= */

router.get("/", isAdmin, async (req, res) => {

  try {

    const orders =
      await Order.find()

        .sort({
          createdAt: -1
        });

    res.json({

      success: true,

      total:
        orders.length,

      orders
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      error:
        err.message
    });
  }
});

/* =========================================
   GET SINGLE ORDER
========================================= */

router.get("/:id", isAdmin, async (req, res) => {

  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {

      return res.status(404).json({

        success: false,

        message:
          "Order not found"
      });
    }

    res.json({

      success: true,

      order
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      error:
        err.message
    });
  }
});

/* =========================================
   UPDATE ORDER STATUS
========================================= */

router.put("/:id", isAdmin, async (req, res) => {

  try {

    const updated =
      await Order.findByIdAndUpdate(

        req.params.id,

        {

          orderStatus:
            req.body.orderStatus,

          paymentStatus:
            req.body.paymentStatus
        },

        {
          new: true,

          runValidators: true
        }
      );

    if (!updated) {

      return res.status(404).json({

        success: false,

        message:
          "Order not found"
      });
    }

    res.json({

      success: true,

      updated
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      error:
        err.message
    });
  }
});

/* =========================================
   DELETE ORDER
========================================= */

router.delete("/:id", isAdmin, async (req, res) => {

  try {

    const deleted =
      await Order.findByIdAndDelete(
        req.params.id
      );

    if (!deleted) {

      return res.status(404).json({

        success: false,

        message:
          "Order not found"
      });
    }

    res.json({

      success: true,

      message:
        "Order deleted successfully"
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      error:
        err.message
    });
  }
});
router.get(

  "/customer/:email",

  async (req, res) => {

    const orders =
      await Order.find({

        "shippingAddress.email":
          req.params.email

      });

    res.json({

      success: true,

      orders

    });

  }

);
router.get(

  "/track/:id",

  async (req, res) => {

    try {

      const order =

        await Order.findById(

          req.params.id

        );

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found"

        });

      }

      res.json({

        success: true,

        order

      });

    } catch (err) {

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }

);
export default router;
