const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"provide name"]
    },
    email:{
        type:String,
        requred:[true,"Provide email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"provide password"]
    },
    profile_pic:{
        type:String,
        default:""
    }
},{
    timestamps:true//when this user was created we require in the chat 
})
const userModel=mongoose.model('User',userSchema)//User is the name of the collection created in the database
module.exports=userModel