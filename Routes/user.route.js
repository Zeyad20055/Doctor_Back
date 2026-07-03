const express = require("express");
const router = express.Router();
const User = require("../module/User.module.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role = "user" } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ message: "User already exists" });

        const newUser = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            role
        });

        const token = jwt.sign({ email, id: newUser._id, role: newUser.role }, process.env.SECRET_KEY, { expiresIn: "7d" });

        newUser.token = token;
        await newUser.save();

        return res.status(201).json({
            message: "User registered successfully",
            token,
            id: newUser._id,
            user: newUser,
            email: newUser.email,
            role: newUser.role
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Password is not correct" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "1w" }
        );

        user.token = token;
        await user.save();

        return res.status(201).json({
            message: "User logged in successfully",
            token,
            role: user.role
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;