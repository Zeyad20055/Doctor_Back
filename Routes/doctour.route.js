const express = require("express");
const router = express.Router();
const Doctour = require("../module/Doctor.module.js");
const multer = require("multer");
//  const User = require("../module/User.module.js");
// const  jwt  = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});




const upload = multer({ storage: storage })



//===========================================



router.post("/adddoctours",upload.single("image"), async (req, res) => {
  try {
    const { name, specialization, description, experienceYears  ,} = req.body;
    const image = req.file ? req.file.filename : null
    if (!name || !specialization || !image || !description || !experienceYears  ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newDoctour = await Doctour.create({
      name,
      specialization,
      description,
      experienceYears,
      image:req.file?.filename
    });
    const saveDoctour = await newDoctour.save();
    return res.status(201).json({message:"Doctour registered successfully", doctour: saveDoctour });
    res.status(201).json(saveDoctour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/alldoctours", async (req, res) => {
    try{
const doctors  = await Doctour.find()
return res.status(200).json({massage:"All Doctours fetched successfully",doctors})

    }catch(error){
        res.status(500).json({message: error.message})
    }    
  
})



router.get("/:id", async (req, res) => {
    try{
        const doctor = await Doctour.findById(req.params.id) //  التفاصيل بتاع الدكتور
if(!doctor) return res.status(404).json({message:"Doctor not found"})
//  return res.status(200).json({message:"Doctor fetched successfully",doctor})
 res.status(200).json(doctor)

    }catch(error){
        res.status(500).json({message: error.message})
    }
})


//===========================================


module.exports = router;
