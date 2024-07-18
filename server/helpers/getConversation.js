const { conversationModel, messageModel } = require('../models/Conversation');
const getConversation=async(currentUserId)=>{
    if(currentUserId)
        {
            const currentUserConversation=await conversationModel.find({
                "$or":[
                    {sender:currentUserId},
                    {receiver:currentUserId}
                ]
            }).sort({updateAt:-1}).populate('messages').populate('sender').populate('receiver')
    
    
            const conversation=currentUserConversation.map((conv)=>{
                const count=conv.messages.reduce((prev,curr)=> prev + curr.seen ? 0 :1,0)
             return {
                    _id:conv._id,
                    sender:conv.sender,
                    receiver:conv.receiver,
                    unseenMsg:count,
                    lastMsg:conv.messages[conv.messages.length - 1]
    
    
    
                }
            })
          return conversation
        }


}

module.exports=getConversation