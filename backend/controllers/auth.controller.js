import bcryptjs from "bcryptjs";
import crypto from "crypto";


import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sender } from "../mailtrap/mailtrap.config.js";
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";


export const signup = async (req, res) => {
    const{email, password, name} = req.body;
    try {
        if(!email || !password || !name){
            throw new Error("All fields are required");
        }
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({success: false, message: "User already exists"});
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            email,
            password: hashedPassword, 
            name,
            verificationToken,
            verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000 //24 hours
        });
        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id)
        await sendVerificationEmail(user.email, verificationToken);


        res.status(201).json({
            success: true, 
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            },
        });


    }catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}

export const verifyEmail = async(req,res) => {
    // 6 9 6 9 6 9 // a verification code
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpireAt: {$gt: Date.now()}
        })

        if(!user){
            return res.status(400).json({success: false, message: "Invalid verification code"});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user : {
                ...user._doc,
                password: undefined,
            },
        })

    } catch (error) {
        console.log("error in verifyEmail", error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: "User not found"});
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({success: false, message: "Invalid password"});
        }

        generateTokenAndSetCookie(res, user._id);
        
        user.lastlogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        console.log("Error in login", error);
        res.status(400).json({success: false, message: error.message});
    }
}
export const logout = async (req, res) => {
    res.clearCookie("token", { path: '/' });

    res.status(200).json({success: true, message: "Logged out successfully"});
}

export const forgotPassword = async (req, res) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: "User not found"});
        }

        //Generate reset password token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpireAt = Date.now() + 15 * 60 * 1000; //15 minutes

        user.verificationTokenExpireAt = resetPasswordExpireAt;

        await user.save();

        //send reset password email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Password reset email sent successfully",
        })
    } catch (error) {
        console.log("Error in forgotPassword", error);
        res.status(400).json({success: false, message: error.message});
    }
}