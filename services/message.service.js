
const createHttpError = require('http-errors')
const {MessageModel} = require('../models/index');


exports.createMessage = async(data) => {
    
    let newMessage = await MessageModel.create(data);
    if(!newMessage){
        throw createHttpError.BadRequest("Oops...Something went wrong !");
    }

    return newMessage;
}

exports.populateMessage = async(id) => {
    console.log(id);
    let msg = await MessageModel.findById(id)
                    .populate({
                        path:'sender',
                        select:'name picture',
                        model:'UserModel'
                    })
                    .populate({
                        path:'conversation',
                        select:"name picture isGroup users",
                        model:'ConversationModel',
                        populate:{
                           path:'users',
                           select:'name picture email status',
                           model:'UserModel' 
                        }
                    }) 
                    .populate({
                        // reactions feature
                        path:'reactions',
                        select:'reaction',
                        populate:{
                            path:'user',
                            select:'name picture',
                            model:'UserModel'
                        }
                    })
    if(!msg) throw createHttpError.BadRequest("Oops...Something went wrong !");

    return msg;
}

exports.getConvoMessages = async(convo_id) => {
    const messages = await MessageModel.find({conversation:convo_id})
                            .populate('sender' , 'name email picture status')
                            .populate('conversation');
    if(!messages) throw createHttpError.BadRequest("Oops...Something went wrong !");

    return messages;
}

// reactions feature
exports.updateMessageReaction = async (message_id, user_id, reaction) => {
    const message = await MessageModel.findById(message_id);

    if (!message) throw createHttpError.BadRequest("Oops...Something went wrong!");

    const existingReactionIndex = message.reactions.findIndex(
        (r) => r.user.toString() === user_id
    );

    if (existingReactionIndex !== -1) {
        message.reactions.splice(existingReactionIndex, 1);
    }

    message.reactions.unshift({ user: user_id, reaction });

    await message.save();
    
    return message;
}

// reactions feature


exports.removeReaction = async(message_id , user_id)=>{
    const message = await MessageModel.findById(message_id);

    if(!message) throw createHttpError.BadRequest("Oops...Something went wrong , message does not exist!");

    //mreove the reaction if it exists
    message.reactions = message.reactions.filter(
        (r) => r.user.toString() !==user_id
    )
    
    await message.save();
    return message;
<<<<<<< HEAD
}
=======
}
>>>>>>> recovery-branch
