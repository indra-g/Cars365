const express = require("express");
const app = express();
var mongoose = require("mongoose");
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var _ = require("lodash");
require('dotenv/config');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
var carDetailsModel = require(__dirname + "/models/cardetails.js");
var rentCarDetailsModel = require(__dirname + "/models/rentcardetails.js");
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
nummitemforbuy = {
  name: "**",
  carcompany: "**",
  carname: "**",
  sellingprice: "**",
  predictedprice: "**",
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
var requestedid = "";
var requestedcity = "";
var status = "";
var startingbiddingprice = "";
var currentbiddingprice = "";
var company = "";
var mlocation = "";
var mrequestedcarid = "";
app.get("/", function (req, res) {
  carDetailsModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      if (items.length < 3) {
        res.render("home", { stylesheet: "css/styles.css", items: [] });
      } else {
        items.sort(() => Math.random() - 0.5);
        items.length = 3;
        res.render("home", { stylesheet: "css/styles.css", items: items });
      }
    }
  });
});

app.get("/buycar", function (req, res) {
  res.render("buyCar1", { stylesheet: "css/styles_buy_car.css" });
});

app.get("/sellcar", function (req, res) {
  res.render("sellCar", { stylesheet: "css/styles_sell_car.css", status: "" });
});

app.get("/auctioncar", function (req, res) {
  auctionCarDetailsModel.findById(
    "6187e6e3eaebc767a0e11586",
    function (err, theitem) {
      auctioncardetail = theitem;
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred", err);
      } else {
        currentbiddingprice = theitem.currentbidprice;
        startingbiddingprice = theitem.startingbidprice;
        res.render("auctionCar", {
          stylesheet: "css/styles_auction.css",
          item: theitem,
          status: status,
        });
        status = "";
      }
    }
  );
});

app.get("/rentcar", function (req, res) {
  requestedcity = "allcities";
  rentCarDetailsModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      if (requestedid == "") {
        if (items.length == 0) {
          res.render("rentCar", {
            stylesheet: "css/styles_rent.css",
            items: items,
            cityname: "All Cities",
            displayitem: nullitem,
          });
        } else {
          res.render("rentCar", {
            stylesheet: "css/styles_rent.css",
            items: items,
            cityname: "All Cities",
            displayitem: items[0],
          });
        }
      } else {
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
      if (items.length == 0) {
        res.render("rentCar", {
          stylesheet: "css/styles_rent.css",
          items: [],
          cityname: location,
          displayitem: nullitem,
        });
      } else {
        if (requestedid == "") {
          res.render("rentCar", {
            stylesheet: "css/styles_rent.css",
            items: items,
            cityname: items[0].location,
            displayitem: nullitem,
          });
        } else {
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
    case "buycaralllocations":
      mlocation = "All Cities";
      buycardetails("All Cities", company, res, mrequestedcarid);
      break;
    case "buycarbang":
      mlocation = "Bangalore";
      buycardetails("Bangalore", company, res, mrequestedcarid);
      break;
    case "buycarhyderabad":
      mlocation = "Hyderabad";
      buycardetails("Hyderabad", company, res, mrequestedcarid);
      break;
    case "buycarchennai":
      mlocation = "Chennai";
      buycardetails("Chennai", company, res, mrequestedcarid);
      break;
    case "buycarthiruvananthapuram":
      mlocation = "Thiruvananthapuram";
      buycardetails("Thiruvananthapuram", company, res, mrequestedcarid);
      break;
    case "buycarmumbai":
      mlocation = "Mumbai";
      buycardetails("Mumbai", company, res, mrequestedcarid);
      break;
  }
});

function buycardetails(location, company, res, requesteddetailid) {
  if (requesteddetailid == "") {
    if (location == "All Cities") {
      if (company == "AllCompanies") {
        carDetailsModel.find({}, (err, items) => {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred", err);
          } else {
            if (items.length == 0) {
              res.render("buyCar2", {
                stylesheet: "css/styles_buy_car.css",
                items: items,
                displaylocation: "All Cities",
                displayitem: nummitemforbuy,
              });
            } else {
              res.render("buyCar2", {
                stylesheet: "css/styles_buy_car.css",
                items: items,
                displaylocation: "All Cities",
                displayitem: items[0],
              });
            }
          }
        });
      } else {
        carDetailsModel.find({ carcompany: company }, (err, items) => {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred", err);
          } else {
            if (items.length == 0) {
              res.render("buyCar2", {
                stylesheet: "css/styles_buy_car.css",
                items: items,
                displaylocation: "All Cities",
                displayitem: nummitemforbuy,
              });
            } else {
              res.render("buyCar2", {
                stylesheet: "css/styles_buy_car.css",
                items: items,
                displaylocation: "All Cities",
                displayitem: items[0],
              });
            }
          }
        });
      }
    } else {
      if (company == "AllCompanies") {
        carDetailsModel.find({ location: location }, (err, items) => {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred", err);
          } else {
            if (items.length == 0) {
              res.render("buyCar2", {
                stylesheet: "css/styles_buy_car.css",
                items: items,
                displaylocation: location,
                displayitem: nummitemforbuy,
              });
            } else {
              res.render("buyCar2", {
                stylesheet: "css/styles_buy_car.css",
                items: items,
                displaylocation: location,
                displayitem: items[0],
              });
            }
          }
        });
      } else {
        carDetailsModel.find(
          { carcompany: company, location: location },
          (err, items) => {
            if (err) {
              console.log(err);
              res.status(500).send("An error occurred", err);
            } else {
              if (items.length == 0) {
                res.render("buyCar2", {
                  stylesheet: "css/styles_buy_car.css",
                  items: items,
                  displaylocation: location,
                  displayitem: nummitemforbuy,
                });
              } else {
                res.render("buyCar2", {
                  stylesheet: "css/styles_buy_car.css",
                  items: items,
                  displaylocation: location,
                  displayitem: items[0],
                });
              }
            }
          }
        );
      }
    }
  } else {
    if (location == "All Cities") {
      if (company == "AllCompanies") {
        carDetailsModel.find({}, (err, items) => {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred", err);
          } else {
            carDetailsModel.findById(requesteddetailid, function (err, item) {
              res.render("buyCar2", {
                stylesheet: "css/styles_buy_car.css",
                items: items,
                displaylocation: location,
                displayitem: item,
              });
            });
          }
        });
      } else {
        carDetailsModel.find({ carcompany: company }, (err, items) => {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred", err);
          } else {
            carDetailsModel.findById(requesteddetailid, function (err, item) {
              res.render("buyCar2", {
                stylesheet: "css/styles_buy_car.css",
                items: items,
                displaylocation: location,
                displayitem: item,
              });
            });
          }
        });
      }
    } else {
      if (company == "AllCompanies") {
        carDetailsModel.find({ location: location }, (err, items) => {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred", err);
          } else {
            carDetailsModel.findById(requesteddetailid, function (err, item) {
              res.render("buyCar2", {
                stylesheet: "css/styles_buy_car.css",
                items: items,
                displaylocation: location,
                displayitem: item,
              });
            });
          }
        });
      } else {
        carDetailsModel.find(
          { carcompany: company, location: location },
          (err, items) => {
            if (err) {
              console.log(err);
              res.status(500).send("An error occurred", err);
            } else {
              carDetailsModel.findById(requesteddetailid, function (err, item) {
                res.render("buyCar2", {
                  stylesheet: "css/styles_buy_car.css",
                  items: items,
                  displaylocation: location,
                  displayitem: item,
                });
              });
            }
          }
        );
      }
    }
  }
}
app.post("/buycargetdetails", function (req, res) {
  const requestedcarid = req.body.elementid;
  mrequestedcarid = requestedcarid;
  buycardetails(mlocation, company, res, requestedcarid);
});

app.post("/updatecompany", function (req, res) {
  const companyname = req.body.companyname;
  company = companyname;
  mlocation = "All Cities";
  buycardetails(mlocation, company, res, mrequestedcarid);
});

app.post("/uploadauction", function (req, res) {
  const name = req.body.name;
  const number = req.body.mobilenumber;
  const price = req.body.price;
  if (currentbiddingprice == "" || currentbiddingprice < price) {
    if (startingbiddingprice < price) {
      auctionCarDetailsModel.findByIdAndUpdate(
        "6187e6e3eaebc767a0e11586",
        {
          currentbidername: name,
          currentbidermobilenumber: number,
          currentbidprice: price,
        },
        function (err, result) {
          if (err) {
            console.log(err);
          } else {
            status = "Succesfully Updated your request 🔥";
          }
        }
      );
    } else {
      status = "Please Enter the value greater then Starting bidding price";
    }
  } else if (currentbiddingprice > price) {
    status = "Please Enter the value greater then current bidding price";
  }
  res.redirect("/auctioncar");
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
    predictedprice: "",
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
        stylesheet: "css/styles_sell_car.css",
      });
    } else {
      res.render("sellCar", {
        status: "Successfully Uploaded 🔥",
        stylesheet: "css/styles_sell_car.css",
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
        stylesheet: "css/styles_give_car_for_rent.css",
      });
    } else {
      res.render("giveACarForRent", {
        status: "Successfully Uploaded 🔥",
        stylesheet: "css/styles_give_car_for_rent.css",
      });
    }
  });
});

app.listen(process.env.Port, function () {
  console.log("Server is up and running on port 4040 🔥");
});
