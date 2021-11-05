var mongoose = require("mongoose");
var cardetails = new mongoose.Schema({
    name: String,
    carcompany: String,
    carname: String,
    sellingprice: Number,
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
})
module.exports = new mongoose.model("cardetail", cardetails);