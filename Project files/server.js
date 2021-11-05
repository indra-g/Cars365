const express = require("express");
const app = express();
var mongoose = require("mongoose");
var multer = require("multer");
var fs = require("fs");
var path = require("path");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
var carDetailsModel = require(__dirname + "/models/cardetails.js");
var rentCarDetailsModel = require(__dirname + "/models/rentcardetails.js");
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
  carDetailsModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      items.sort(() => Math.random() - 0.5);
      res.render("home", { stylesheet: "css/styles.css", items: items });
    }
  });
});

app.get("/buycar", function (req, res) {
  res.render("buyCar", { stylesheet: "css/styles_buy_car.css" });
});

app.get("/sellcar", function (req, res) {
  res.render("sellCar", { stylesheet: "css/styles_sell_car.css", status: "" });
});

app.get("/auctioncar", function (req, res) {
  res.render("auctionCar", { stylesheet: "css/styles_auction.css" });
});

app.get("/rentcar", function (req, res) {
  rentCarDetailsModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      items.sort(() => Math.random() - 0.5);
      res.render("rentCar", {
        stylesheet: "css/styles_rent.css",
        items: items,
      });
    }
  });
});

app.get("/giveacarforrent", function (req, res) {
  res.render("giveACarForRent", {
    stylesheet: "css/styles_give_car_for_rent.css",
    status: "",
  });
});

app.post("/upload", upload.array("images", 4), (req, res, next) => {
  var obj = {
    name: req.body.firstname,
    carcompany: req.body.company,
    carname: req.body.carname,
    sellingprice: req.body.sellingprice,
    totalkmdriven: req.body.totalkmdriven,
    mobilenumber: req.body.mobilenumber,
    location: req.body.location,
    purpose: "forselling",
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
  carDetailsModel.create(obj, (err, item) => {
    if (err) {
      res.render("sellCar", {
        status: "Unable to upload at the moment please try again later",
        stylesheet: "css/styles_give_car_for_rent.css",
      });
    } else {
      res.render("sellCar", {
        status: "Successfully Uploaded 🔥",
        stylesheet: "css/styles_give_car_for_rent.css",
      });
    }
  });
});

app.post("/rentupload", upload.array("images", 4), (req, res, next) => {
  var obj = {
    name: req.body.firstname,
    carname: req.body.carname,
    rentingprice: req.body.sellingprice,
    totalkmdriven: req.body.totalkmdriven,
    mobilenumber: req.body.mobilenumber,
    location: req.body.location,
    purpose: "forrenting",
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
  rentCarDetailsModel.create(obj, (err, item) => {
    if (err) {
      res.render("sellCar", {
        status: "Unable to upload at the moment please try again later",
        stylesheet: "css/styles_sell_car.css",
      });
    } else {
      res.render("giveACarForRent", {
        status: "Successfully Uploaded 🔥",
        stylesheet: "css/styles_sell_car.css",
      });
    }
  });
});

app.listen("4040", function () {
  console.log("Server is up and running on port 4040 🔥");
});
