<<<<<<< HEAD
const { MessageModel } = require("../models/index.js");
=======
const { MessageModel, ScheduledMessageModel } = require("../models/index.js");
>>>>>>> recovery-branch
const { updateLatestMessage } = require("../services/conversation.service.js");
const {
  createMessage,
  getConvoMessages,
  populateMessage,
  updateMessageReaction,
  removeReaction,
} = require("../services/message.service.js");
<<<<<<< HEAD
=======
const translator = require("open-google-translator");
>>>>>>> recovery-branch

exports.sendMessage = async(req,res,next) => {
    try{
        const user_id = req.user.userId;
        const {message, convo_id, files} = req.body;

        if (!convo_id || (!message && !files)) {
            console.log("Please provider a conversation id and a message body")
            return res.sendStatus(400);
          }

          const msgData = {
            sender: user_id,
            message,
            conversation: convo_id,
            files: files || [],
          };
          
          let newMessage = await createMessage(msgData);
          let populatedMessage = await populateMessage(newMessage._id);
          await updateLatestMessage(convo_id,newMessage);
          res.json(populatedMessage);
    }catch(error){
        next(error);
    }
}

exports.getMessages = async (req, res, next) => {
    try {
      const convo_id = req.params.convo_id;
      if (!convo_id) {
        console.log("Please add a conversation id in params.");
        res.sendStatus(400);
      }
      const messages = await getConvoMessages(convo_id);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }; 

  // reactions feature
exports.addMessageReaction = async(req,res,next) =>{
  try{
    const {reaction} = req.body;
    const {message_id} = req.params;
    const user_id = req.user.userId;

    

    if(!message_id || !reaction){
      console.log('Please add messageId and reaction in req.body');
      return res.sendStatus(400);
    }
    
    let message = await updateMessageReaction(message_id , user_id,reaction);
    let populateReactedMessage = await populateMessage(message_id);

    populateReactedMessage.reactionSenderId = user_id;
    // console.log('populateReactedMessage.reactionSenderId' , populateReactedMessage.reactionSenderId);
    res.json(populateReactedMessage);
  }catch(error){
    next(error);
  }
}

  // reactions feature
exports.removeMessageReaction = async(req,res,next) =>{
  try{
    const {message_id} = req.params;
    const user_id = req.user.userId;

    if(!message_id){
      console.log('Please add messageId in req.body');
      return res.sendStatus(400);
    }

    let updatedMessage = await removeReaction(message_id , user_id);
    let populatedMessage = await populateMessage(message_id);

    res.json(populatedMessage);
    
  }catch(error){
    next(error);
  }
}

<<<<<<< HEAD
=======
// message translation
exports.translateMessage = async (req, res, next) => {
  try {
    const { message_id } = req.params;

    if (!message_id) {
      console.log('Please add messageId in req.params');
      return res.sendStatus(400);
    }

    const message = await MessageModel.findById(message_id);

    // Ensure the message exists
    if (!message) {
      console.log('Message not found');
      return res.sendStatus(404);
    }

    // Translate the message
    // translator.supportedLanguages();
    console.log(Object.keys(translator.supportedLanguages()));
    const result = await translator.TranslateLanguageData({
      listOfWordsToTranslate: [message.message],
      fromLanguage: "en",
      toLanguage: "hi",
    });

    // Send the translated result back as JSON
    res.json({ translatedMessage: result });
  } catch (error) {
    next(error);
  }
};


// schedule message feature
exports.scheduleMessage = async (req, res, next) => {
  try {
    const { sender ,message,conversation,scheduledAt,files } = req.body;
    console.log(sender);
    console.log(message);
    console.log(conversation);
    console.log(scheduledAt);
    
    if (!sender || !message || !conversation || !scheduledAt) {
      console.log('All fields are required in req.body');
      return res.sendStatus(400).json({ error: "All fields are required." });
    }

    // save schedules msg
    const scheduledMessage = await ScheduledMessageModel.create({
      sender,
      message,
      conversation,
      scheduledAt: new Date(scheduledAt), 
      files,
    });

    console.log(scheduledMessage);

    await scheduledMessage.save();
    res.status(201).json({ success: true, message: scheduledMessage });

  } catch (error) {
    next(error);
  }
};


>>>>>>> recovery-branch




