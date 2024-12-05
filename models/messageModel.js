const mongoose =  require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: ObjectId,
      ref: "UserModel",
    },
    message: {
      type: String, 
      trim: true,
    },

    // reactions feature
    reactions:[
      {
        user:{
          type:ObjectId,
          ref:"UserModel",
          required:true,
        },
        reaction:{
          type:String
        }
      }
    ],
    conversation: {
      type: ObjectId,
      ref: "ConversationModel",
    },
    files: [],

    // seen feature
    seenBy: [
      {
        type: ObjectId,
        ref: "UserModel",
      }
    ],

    // schedule message feature
    scheduledAt: {
      type: Date,
      default: null, // Null for immediate messages
    },
    isScheduled: {
      type: Boolean,
      default: false, // False if it's not a scheduled message
    },

  },
  {
    collection: "messages",
    timestamps: true,
  }
);

module.exports =mongoose.model("MessageModel", messageSchema);

