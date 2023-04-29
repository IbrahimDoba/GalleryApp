// import mongoose to create new schemna
const mongoose = require("mongoose");

// create schema

const ImageSchema = new mongoose.Schema(
  {
    title:String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("imageProps", ImageSchema);
