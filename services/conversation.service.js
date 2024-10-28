const createHttpError = require("http-errors");
const { ConversationModel, UserModel, MessageModel } = require("../models/index");

exports.doesConversationExist = async (sender_id, receiver_id) => {
  let convo = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: sender_id } } },
      { users: { $elemMatch: { $eq: receiver_id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!convo) {
    throw createHttpError.BadRequest("Something went wrong");
  }

  convo = await UserModel.populate(convo, {
    path: "latestMessage.sender",
    select: "name email picture status",
  });

  return convo[0];
};

exports.createConversation = async (data) => {
  const newConvo = await ConversationModel.create(data);
  if (!newConvo)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  return newConvo;
};

exports.populateConversation = async (
  id,
  fieldToPopulate,
  fieldsToRemove
) => {
  const populatedConvo = await ConversationModel.findOne({ _id: id }).populate(
    fieldToPopulate,
    fieldsToRemove
  );
  if (!populatedConvo)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  return populatedConvo;
};
exports.getUserConversations = async (user_id) => {
  let conversations;

  try {
    // Step 1: Fetch all conversations the user is a part of
    let results = await ConversationModel.find({
      users: { $elemMatch: { $eq: user_id } }, // Fetch conversations where the user is part of
    })
      .populate("users", "-password")        
      .populate("admin", "-password")        
      .populate("latestMessage")             
      .sort({ updatedAt: -1 })               
      .exec();                               

    // Step 2: Populate the latest message sender details
    results = await UserModel.populate(results, {
      path: "latestMessage.sender",
      select: "name email picture status",
    });

    // Step 3: Count unseen messages for each conversation
    for (let i = 0; i < results.length; i++) {
      let conversation = results[i].toObject(); // Convert Mongoose document to plain JS object

      const unseenMessageCount = await MessageModel.countDocuments({
        conversation: conversation._id,
        seenBy: { $ne: user_id },
        sender: { $ne: user_id }, // Count messages where user is not in seenBy array
      });

      conversation.unseenMessageCount = unseenMessageCount; // Add unseen message count to conversation
      // Reassign the updated conversation object to the results array
      results[i] = conversation;
    }

    conversations = results;
    return conversations;
  } catch (err) {
    throw createHttpError.BadRequest("Oops...Something went wrong in getUserConversations!");
  }
};




exports.updateLatestMessage = async (convo_id, msg) => {
  const updatedConvo = await ConversationModel.findByIdAndUpdate(convo_id, {
    latestMessage: msg,
  });
  if (!updatedConvo)
    throw createHttpError.BadRequest("Oops...Something went wrong !");

  return updatedConvo;
};
