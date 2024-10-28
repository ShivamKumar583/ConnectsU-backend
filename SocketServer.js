let onlineUsers = [];
exports.SocketServer = async(socket, io) => {
  //user joins or opens the application
  socket.on("join", (user) => {
    socket.join(user);
    //add joined user to online users
    if (!onlineUsers.some((u) => u.userId === user)) {
      onlineUsers.push({ userId: user, socketId: socket.id });
    }
    //send online users to frontend
    io.emit("get-online-users", onlineUsers); 

    //send socket id
    socket.emit("setup socket", socket.id);
    
  }); 

  //socket disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-online-users", onlineUsers);
  });

  //join a conversation room
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });

  //send and receive message
  socket.on("send message", (message) => {

    let conversation = message.conversation;
    if (!conversation?.users) return;
    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;

      console.log( 'userId------------->', user._id);
      socket.in(user._id).emit("receive message", message);

      // seen feature      
      io.to(user._id).emit('unseen message' , {
        conversationId:conversation._id,
        sender:message.sender._id,
      })

    });  
  });

  // reactions feature
  socket.on('send reaction' , (message) => {
    let conversation = message.conversation;
    if (!conversation?.users) return;
    conversation.users.forEach((user) => {
      if (user._id === message.reactionSender._id) return;

      console.log( 'userId------------->', user._id);
      socket.in(user._id).emit("receive reaction", message);

    });  
  })

  //  reaction feature
  socket.on('remove reaction' , (data) => {
    console.log(data);
    let conversation = data.conversation;
    if (!conversation?.users) return;

    conversation.users.forEach((user) => {
      if (user._id === data.reactionRemovedBy) return;

      console.log( 'userId------------->', user._id);
      socket.in(user._id).emit("receive remove reaction", {
        messageId:data.messageId,
         userId:data.reactionRemovedBy
      });
      console.log('done');
    }); 
  })

  // seen feature
  socket.on("mark messages as seen", ({ conversationId, userId }) => {
    // Mark messages in the conversation as seen by the user
    
    io.to(userId).emit("messages seen", {
      conversationId,
      userId,
    });

    // Emit unseen message count for all other users in the conversation
    const conversation = socket.adapter.rooms.get(conversationId);
    if (conversation) {
      conversation.forEach((socketId) => {
        if (onlineUsers.some((user) => user.socketId === socketId && user.userId !== userId)) {
          io.to(socketId).emit("update unseen count", {
            conversationId,
            userId,
          });
        }
      });
    }
  });

  //typing
  socket.on("typing", (conversation) => {
    socket.in(conversation).emit("typing", conversation);
  });
  socket.on("stop typing", (conversation) => {
    socket.in(conversation).emit("stop typing");
  });

  //call
  //---call user
  socket.on("call user", (data) => {
    let userId = data.userToCall;
    let userSocketId = onlineUsers.find((user) => user.userId === userId);
    console.log('user to call', userId);
    console.log('user to call socket id', userSocketId?.socketId);
    console.log('users' , onlineUsers);
  
    if (userSocketId) {  // Ensure user is online
      io.to(userSocketId.socketId).emit("call user", {
        signal: data.signal,
        from: data.from,
        name: data.name,
        picture: data.picture,
      });
    } else {
      console.log('User is not online');
    }
  });
  
  //---answer call
  socket.on("answer call", (data) => {
    console.log('accepted' , data.to);
    io.to(data.to).emit("call accepted", data.signal);
  });

  //---end call 
  socket.on("end call",(id) => {
    console.log('end call server' , id);
    
    socket.broadcast.emit('end call');
    // io.to(id).emit('end call');
  });
  
 
}
  