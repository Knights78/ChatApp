const mongoose=require('mongoose')
const messageSchema=new mongoose.Schema({
    text:{
        type:String,
        default:""
    },
    ImageUrl:{
        type:String,
        default:""
    },
    VideoUrl:{
         type:String,
        default:""
    },
    seen:{
        type:Boolean,
        default:false
    },
    msgByUserId:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})
const conversationSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'//refer the user table to get the information of the sender
    },
    receiver:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    },
    messages:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Message"
        }
    ]
},{
    timestamps:true
})

const messageModel=mongoose.model('Message',messageSchema)
const conversationModel=mongoose.model('Conversation',conversationSchema)

module.exports={conversationModel,messageModel}