const createHttpError = require("http-errors");
const {
  createConversation,
  doesConversationExist,
  getUserConversations,
  populateConversation,
} = require("../services/conversation.service.js");
const { findUser } = require("../services/user.service.js");
const { MessageModel } = require("../models/index.js");

exports.create_open_conversation = async (req, res, next) => {
  try {
    const sender_id = req.user.userId;
    const { receiver_id } = req.body;
    if (!receiver_id) {
      console.log("receiver_id is required");
      throw createHttpError.BadGateway("Something went wrong ");
    }
    const existedConversation = await doesConversationExist(
      sender_id,
      receiver_id
    );

    if (existedConversation) {
      res.json(existedConversation);
    } else {
      let reciever_user = await findUser(receiver_id);
      let convoData = {
        name: reciever_user.name,
        picture: reciever_user.picture,
        isGroup: false,
        users: [sender_id, receiver_id],
      };

      const newConvo = await createConversation(convoData);
      const populatedConvo = await populateConversation(
        newConvo._id,
        "users",
        "-password"
      );
      res.status(200).json(populatedConvo);
    }
  } catch (error) {
    next(error);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const conversations = await getUserConversations(user_id);
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

exports.createGroup = async (req, res, next) => {
  const { name, users } = req.body;
  //add current user to users
  users.push(req.user.userId);
  if (!name || !users) {
    throw createHttpError.BadRequest("Please fill all fields.");
  }
  if (users.length < 2) {
    throw createHttpError.BadRequest(
      "Atleast 2 users are required to start a group chat."
    );
  }
  let convoData = {
    name,
    users,
    isGroup: true,
    admin: req.user.userId,
    picture: process.env.DEFAULT_GROUP_PICTURE,
  };
  try {
    const newConvo = await createConversation(convoData);
    const populatedConvo = await populateConversation(
      newConvo._id,
      "users admin",
      "-password"
    );
    res.status(200).json(populatedConvo);
  } catch (error) {
    next(error);
  }
};

// seen feature
exports.markMessagesAsSeen = async(req,res,next) => {
  try{
    const user_id = req.user.userId;
    const convo_id =req.params.convo_id;

    if(!user_id || !convo_id){
      console.log('Please add userId and convoId in req.body');
      return res.sendStatus(400);
    }

    await MessageModel.updateMany(
      { conversation: convo_id, seenBy: { $ne: user_id } },
      { $push: { seenBy: user_id } }
    );
    res.status(200).json({ message: "Messages marked as seen" });
  }catch(err){
    next(err)
  }
}
