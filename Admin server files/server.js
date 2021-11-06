const express = require("express");
const app = express();
var mongoose = require("mongoose");
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
var auctionCarDetailsModel = require(__dirname +
  "/models/auctioncardetails.js");
mongoose.connect("mongodb://localhost:27017/Cars365DB", function () {
  console.log("Succesfully connected to database 🔥");
});
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });

app.get("/", function (req, res) {
  res.render("auctioncaradmin", { status: "" });
});

app.post("/upload", upload.array("images", 4), function (req, res, next) {
  const auctioncardata = {
    carname: req.body.carname,
    startingbidprice: req.body.startingbiddingprice,
    currentbidprice: "",
    daysleft: req.body.numberofdays,
    carownername: req.body.firstname,
    location: req.body.location,
    totalkmdriven: req.body.totalkmdriven,
    currentbidername: "",
    currentbidermobilenumber: "",
    fueltype: req.body.fueltype,
    eng: req.body.engine,
    pow: req.body.power,
    img1: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.files[0].filename)
      ),
      contentType: "image/png",
    },
    img2: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.files[1].filename)
      ),
      contentType: "image/png",
    },
    img3: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.files[2].filename)
      ),
      contentType: "image/png",
    },
    img4: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.files[3].filename)
      ),
      contentType: "image/png",
    },
  };
  auctionCarDetailsModel.replaceOne({_id: "618671f5d44d2e9f44b2e06a"}, auctioncardata, (err, item) => {
    if (err) {
      res.render("auctioncaradmin", {
        status: "Unable to upload at the moment please try again later",
      });
    } else {
      res.render("auctioncaradmin", {
        status: "Successfully Uploaded 🔥",
      });
    }
  });
});

app.listen(5050, function () {
  console.log("Server is up and running on port 5050");
});
