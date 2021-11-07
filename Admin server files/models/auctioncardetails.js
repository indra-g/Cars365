var mongoose = require("mongoose");
var auctioncardetails = new mongoose.Schema({
  carname: String,
  startingbidprice: Number,
  currentbidprice: Number,
  daysleft: Number,
  carownername: String,
  location: String,
  totalkmdriven: Number,
  currentbidername: String,
  currentbidermobilenumber: Number,
  fueltype: String,
  eng: Number,
  pow: Number,
  img1: {
    data: Buffer,
    contentType: String,
  },
  img2: {
    data: Buffer,
    contentType: String,
  },
  img3: {
    data: Buffer,
    contentType: String,
  },
  img4: {
    data: Buffer,
    contentType: String,
  },
});
module.exports = new mongoose.model("auctioncardetails", auctioncardetails);
