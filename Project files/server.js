const express = require("express");
const app = express();
var mongoose = require("mongoose");
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var ejs = require("ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
var requestedid = "";
var requestedcity = "";
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
      if (items.length < 3) {
        res.render("home", { stylesheet: "css/styles.css", items: [] });
        console.log(items.length);
      } else {
        items.sort(() => Math.random() - 0.5);
        items.length = 3;
        res.render("home", { stylesheet: "css/styles.css", items: items });
      }
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
  requestedcity="allcities"
  rentCarDetailsModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      if (requestedid == "") {
       res.render("rentCar", {
         stylesheet: "css/styles_rent.css",
         items: items,
         cityname: "All Cities",
         displayitem: items[0],
       }); 
      }
      else {
        rentCarDetailsModel.findById(requestedid, function (err, item) {
          res.render("rentCar", {
            stylesheet: "css/styles_rent.css",
            items: items,
            cityname: "All Cities",
            displayitem: item,
          });
        });
      }
    }
  });
});

app.get("/giveacarforrent", function (req, res) {
  res.render("giveACarForRent", {
    stylesheet: "css/styles_give_car_for_rent.css",
    status: "",
  });
});

function rentfindcity(location, res, requestedid) {
  rentCarDetailsModel.find({ location: location }, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      nullitem = {
        name: "**",
        carname: "**",
        rentingprice: "**",
        totalkmdriven: "**",
        mobilenumber: "**",
        location: "**",
        purpose: "**",
        img1: {
          data: "**",
          contentType: "**",
        },
        img2: {
          data: "**",
          contentType: "**",
        },
        img3: {
          data: "**",
          contentType: "**",
        },
        img4: {
          data: "**",
          contentType: "**",
        },
      };
      if (items.length == 0) {
        res.render("rentCar", {
          stylesheet: "css/styles_rent.css",
          items: [],
          cityname: location,
          displayitem: nullitem,
        });
      } else {
        requestedid = items[0]._id;
        rentCarDetailsModel.findById(requestedid, function (err, item) {
          res.render("rentCar", {
            stylesheet: "css/styles_rent.css",
            items: items,
            cityname: items[0].location,
            displayitem: item,
          });
        });
      }
    }
  });
}

app.get("/:cityname", function (req, res) {
  requestedcity = req.params.cityname;
  switch (requestedcity) {
    case "rentbangalore":
      rentfindcity("Bangalore", res, requestedid);
      break;
    case "renthyderabad":
      rentfindcity("Hyderabad", res, requestedid);
      break;
    case "rentchennai":
      rentfindcity("Chennai", res, requestedid);
      break;
    case "rentthiruvananthapuram":
      rentfindcity("Thiruvananthapuram", res, requestedid);
      break;
    case "rentmumbai":
      rentfindcity("Mumbai", res, requestedid);
      break;
  }
});

app.post("/getdetails", function (req, res) {
  requestedid = req.body.elementid;
  rentCarDetailsModel.find({ _id: requestedid }, function (err, items) {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      if (requestedcity == "allcities") {
        res.redirect("/rentcar");
      } else {
        res.redirect("/" + requestedcity);
      }
    }
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
