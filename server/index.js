const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const limit = 52428800
const app = express();

// use express.json to get data into json format
// increase limit of the req body to 10mb
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
console.log("limit file size: " + limit)


app.use(express.json());
const PORT = process.env.PORT || 4000;



// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb" }));

// use cors
app.use(cors({ origin: "https://silvergallery.netlify.app" }));

// import Routes
const ImageRoute = require("./routes/imageRoutes");

// connect to mongoose database
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use("/", ImageRoute);
// add port and connect to server
app.listen(PORT, () => console.log(`server connected ${PORT}`));
