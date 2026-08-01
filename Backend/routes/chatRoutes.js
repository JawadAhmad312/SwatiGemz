import express from "express";
import { body, param, validationResult } from "express-validator";
import { isAdmin, requireAuthentication } from "../middleware/admin.js";
import ChatConversation from "../models/chatConversation.js";
import { getIO } from "../sockets/socket.js";

const router = express.Router();

const messageValidation = body("text")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("Message must be 1-1000 characters");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  next();
};

const serializeConversation = (conversation) => ({
  _id: conversation._id,
  customerId: conversation.customerId,
  customerName: conversation.customerName,
  status: conversation.status,
  messages: conversation.messages,
  lastMessageAt: conversation.lastMessageAt,
  createdAt: conversation.createdAt,
  updatedAt: conversation.updatedAt,
  unreadAdminCount: conversation.messages.filter(
    (message) => message.sender === "customer" && !message.readByAdmin
  ).length,
  unreadCustomerCount: conversation.messages.filter(
    (message) => message.sender === "admin" && !message.readByCustomer
  ).length,
});

const findOrCreateConversation = async (customerId, customerName) => {
  const name = customerName?.trim() || "Customer";

  return ChatConversation.findOneAndUpdate(
    { customerId },
    {
      $setOnInsert: {
        customerId,
      },
      $set: {
        customerName: name,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );
};

router.get("/customer", async (req, res) => {
  const customerId = req.query.customerId || req.user?.id || req.user?._id?.toString();

  if (!customerId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const conversation = await ChatConversation.findOne({
    customerId,
  });

  res.json({
    success: true,
    conversation: conversation ? serializeConversation(conversation) : null,
  });
});

router.post(
  "/customer/message",
  [messageValidation],
  handleValidation,
  async (req, res) => {
    try {
      const customerId = req.body.customerId || req.user?.id || req.user?._id?.toString();
      const customerName = req.body.customerName || req.user?.username || "Customer";
      const { text } = req.body;

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const conversation = await findOrCreateConversation(
        customerId,
        customerName
      );

      conversation.messages.push({
        sender: "customer",
        text,
        readByCustomer: true,
      });
      conversation.lastMessageAt = new Date();
      await conversation.save();

      const serialized = serializeConversation(conversation);
      const io = getIO();
      io?.to("admins").emit("chatConversationUpdated", serialized);
      io?.to(`chat:${conversation._id}`).emit("chatConversationUpdated", serialized);

      res.status(201).json({
        success: true,
        conversation: serialized,
      });
    } catch (error) {
      console.error("Customer chat message failed:", error);
      res.status(500).json({
        success: false,
        message: "Unable to send chat message",
      });
    }
  }
);

router.get("/admin/conversations", isAdmin, async (req, res) => {
  const conversations = await ChatConversation.find()
    .sort({ lastMessageAt: -1 })
    .limit(100);

  res.json({
    success: true,
    conversations: conversations.map(serializeConversation),
  });
});

router.post(
  "/admin/:conversationId/message",
  [
    isAdmin,
    param("conversationId").isMongoId().withMessage("Invalid conversation id"),
    messageValidation,
  ],
  handleValidation,
  async (req, res) => {
    const conversation = await ChatConversation.findById(
      req.params.conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    conversation.messages.push({
      sender: "admin",
      text: req.body.text,
      readByAdmin: true,
    });
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const serialized = serializeConversation(conversation);
    const io = getIO();
    io?.to("admins").emit("chatConversationUpdated", serialized);
    io?.to(`chat:${conversation._id}`).emit("chatConversationUpdated", serialized);

    res.status(201).json({
      success: true,
      conversation: serialized,
    });
  }
);

router.put(
  "/admin/:conversationId/read",
  [
    isAdmin,
    param("conversationId").isMongoId().withMessage("Invalid conversation id"),
  ],
  handleValidation,
  async (req, res) => {
    const conversation = await ChatConversation.findById(
      req.params.conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    conversation.messages.forEach((message) => {
      if (message.sender === "customer") {
        message.readByAdmin = true;
      }
    });
    await conversation.save();

    res.json({
      success: true,
      conversation: serializeConversation(conversation),
    });
  }
);

export default router;
