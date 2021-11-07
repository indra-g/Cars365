const express = require("express");
const app = express();
var mongoose = require("mongoose");
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
require("dotenv/config");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
var status = "";
var auctionCarDetailsModel = require(__dirname +
  "/models/auctioncardetails.js");
mongoose.connect(process.env.DB_Host, function () {
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

app.get("/updateauction", function (req, res) {
  res.render("auctioncaradmin", { status: "" });
});

app.get("/", function (req, res) {
  auctionCarDetailsModel.findById(
    "6187e6e3eaebc767a0e11586",
    function (err, item) {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred", err);
      } else {
        res.render("homepage", {
          item: item,
          status: status,
        });
        status = "";
      }
    }
  );
});

app.post("/updatedb", function (req, res) {
  const time = req.body.numberofdays;
  auctionCarDetailsModel.findByIdAndUpdate(
    "6187e6e3eaebc767a0e11586",
    {
      time: time,
    },
    function (err, result) {
      if (err) {
        status = "Unable to Update at the moment please try again later";
        res.redirect("/");
      } else {
        status = "Succesfully Updated 🔥";
        res.redirect("/");
      }
    }
  );
});

app.post("/upload", upload.array("images", 4), function (req, res, next) {
  const auctioncardata = {
    carname: req.body.carname,
    startingbidprice: req.body.startingbiddingprice,
    currentbidprice: "",
    time: req.body.numberofdays,
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
  auctionCarDetailsModel.replaceOne(
    { _id: "6187e6e3eaebc767a0e11586" },
    auctioncardata,
    (err, item) => {
      if (err) {
        res.render("auctioncaradmin", {
          status: "Unable to upload at the moment please try again later",
        });
      } else {
        res.render("auctioncaradmin", {
          status: "Successfully Uploaded 🔥",
        });
      }
    }
  );
});

app.listen(process.env.Port, function () {
  console.log("Server is up and running on port 5050");
});
