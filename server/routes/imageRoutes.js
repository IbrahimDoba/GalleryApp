const multer = require("multer");

const router = require("express").Router();

//import image model
const imageModel = require("../model/imageSchema");

//set up multer storage
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
// `${Date.now()}-${file.originalname}`
// set up multer upload
const upload = multer({ storage: Storage }).single("testimage");

// first router to upload an image with its info
router.post("/upload", async (req, res) => {
  const  base64  = req.body.base64;
  const  imgTitle  = req.body.imgTitle;
  try {
    await imageModel.create({ image: base64, title: imgTitle });
    res.send({ status: " uploaded ok" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
});
// second router to get all images
router.get("/upload", async (req,res) => {
  try {
    const allImages = await imageModel.find({})
    res.status(200).json(allImages) 
  } catch (err) {
    console.log(err)
  }
})

// delete image from DB
router.delete("/upload/:id", async (req, res) => {
  try {
    const deleteImage = await imageModel.findByIdAndDelete(req.params.id)
    res.status(200).json("deleted suncess")
  } catch (err) {
    res.json(err);
  }
});


// export router
module.exports = router;
