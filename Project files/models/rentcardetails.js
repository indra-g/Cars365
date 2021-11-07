var mongoose = require("mongoose");
var rentcardetails = new mongoose.Schema({
  name: String,
  carname: String,
  rentingprice: Number,
  totalkmdriven: Number,
  mobilenumber: Number,
  location: String,
  purpose: String,
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
module.exports = new mongoose.model("rentcardetails", rentcardetails);
