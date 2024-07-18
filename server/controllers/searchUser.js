const userModel=require('../models/User')

async function searchUser(req,res){
    try {
        const {search}=req.body
        const query=new RegExp(search,"i","g")//new expression where case is insensitive andd "g" it is for all the occurence 
        const user=await userModel.find({
            "$or":[//this line indicates that either name or email should be matched with the search query  
                {name:query},
                {email:query}
            ]
        }).select('-password')
        return res.json({
            success:true,
            data:user,
            message:"all user"
        })

    } catch (error) {
        console.log(error,"error in he search user sectiont")
    }
}
module.exports=searchUser