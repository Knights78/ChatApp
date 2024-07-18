const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")
const userModel = require("../models/User")

async function updateUserDetails(request,response){
   // console.log("Cookies received: ", request.cookies);
    try {
        const token = request.cookies.token || ""
       // console.log(token+" received")

        const user = await getUserDetailsFromToken(token)

        const { name, profile_pic } = request.body

        const updateUser = await userModel.updateOne({ _id : user._id },{
            name,
            profile_pic
        })

        const userInfomation = await userModel.findById(user._id)

        return response.json({
            message : "user update successfully",
            data : userInfomation,
            success : true
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = updateUserDetails
