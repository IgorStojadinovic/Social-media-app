import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import User from "../models/User.js";


/* REGISTER USER */
export const register = async (req,res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            ocuppation
        } = req.body;

        //Encrypt password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        //Create new user
        const newUser = newUser({
            firstName,
            lastName,
            email,
            passwordHash,
            picturePath,
            friends,
            location,
            ocuppation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000)
        });

        //Save new user
        const savedUser = await newUser.save();

        //K.O. Ready to fly
        res.status(201).json(savedUser);
        
    } catch (error) {
        res.send(500).json({error: error.message});
    }
}

/* LOGINING IN */
export const login = async (req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email:email});

        if(!user) {
            return res.status(400).json({msg: "User does not exist."})
        }
        
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch) {
            return res.status(400).json({msg: "Invalid credentials"});
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

        //Delete the password before sending the json
        delete user.password;

        res.status(200).json({token,user})

    } catch (error) {
        res.send(500).json({error: error.message});
    }
}