const userModel = require('../models/User.js');
const bcryptjs = require('bcryptjs');

async function Register(req, res) {
    try {
        const { name, email, password, profile_pic } = req.body;
      //  console.log(name, email, password);

        const checkEmail = await userModel.findOne({ email: email });
        if (checkEmail) {
            return res.json({
                message: "User already exists",
                error: true
            });
        }

        // Password hashing
        const salt = await bcryptjs.genSalt(10);
        const hashpass = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            profile_pic,
            password: hashpass
        };

        const user = new userModel(payload);
        const usersave = await user.save();
        return res.json({
            message: "Registration successful",
            data: usersave,
            success: true
        });

    } catch (error) {
        console.error("Error in Register:", error);
        return res.json({
            message: "Error occurred in register file",
            error: true
        });
    }
}

module.exports = Register;
