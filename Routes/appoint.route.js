const express = require("express");
const Appoint = require("../module/Appoint.module.js");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../auth/middleware.js");


router.post("/createappoint", auth, async (req, res) => {
    try {
        const { doctor, data, reason } = req.body;

        if (!doctor || !data || !reason) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const appoint = await Appoint.create({
            user: req.user._id,
            doctor,
            data,
            reason
        });

        return res.status(201).json({ message: "Appoint created successfully", appoint });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/myappointments", auth, async (req, res) => {
    try {
        const appointments = await Appoint.find({ user: req.user._id }).populate("doctor");
        res.status(200).json({ message: "Appointments retrieved successfully", appointments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post("/deleteappoint/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        const appoint = await Appoint.findOneAndDelete({ _id: id, user: req.user._id });

        if (!appoint) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment deleted successfully", appoint });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;