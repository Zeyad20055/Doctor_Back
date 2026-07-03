const express = require("express");
const router = express.Router();
const Department = require("../module/Department.module.js");
const auth = require("../auth/middleware.js");
const multer = require("multer");
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
const upload = multer({ storage });

router.post(
  "/addDepartment",
  auth("admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!req.file) {
        return res.status(400).json({
          message: "Image is required",
        });
      }

      if (!name || !description) {
        return res.status(400).json({
          message: "Name and description are required",
        });
      }

      const newDepartment = await Department.create({
        name,
        description,
        image: req.file.filename,
      });

      res.status(201).json({
        message: "Department created successfully",
        department: newDepartment,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;