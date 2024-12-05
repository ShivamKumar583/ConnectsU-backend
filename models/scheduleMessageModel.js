const mongoose =  require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const ScheduledMessageModel = mongoose.Schema(
  {
    sender: {
      type: ObjectId,
      ref: "UserModel",
      require:true
    },
    message: {
      type: String, 
      trim: true,
      require:true
    },


    conversation: {
      type: ObjectId,
      ref: "ConversationModel",
    },
    files: [],

    // schedule message feature
    scheduledAt: {
      type: Date,
      default: null, // Null for immediate messages
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "sent"],
      default: "pending",
    },

  },
  {
    collection: "scheduledMessages",
    timestamps: true,
  }
);

module.exports =mongoose.model("ScheduledMessageModel", ScheduledMessageModel);

