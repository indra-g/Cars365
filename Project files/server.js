const express = require("express");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");


app.get("/", function (req, res) {
    res.render("home", { stylesheet: "css/styles.css" });
})

app.get("/buycar", function (req, res) {
    res.render("buyCar", { stylesheet: "css/styles_buy_car.css" });
})

app.get("/sellcar", function (req, res) {
    res.render("sellCar", { stylesheet: "css/styles_sell_car.css" });
})

app.get("/auctioncar", function (req, res) {
    res.render("auctionCar", { stylesheet: "css/styles_auction.css" });
})

app.get("/rentcar", function (req, res) {
    res.render("rentCar", { stylesheet: "css/styles_rent.css" });
})

app.get("/giveacarforrent", function (req, res) {
    res.render("giveACarForRent", {
      stylesheet: "css/styles_give_car_for_rent.css",
    });
})

app.listen("4040", function () {
  console.log("Server is up and running on port 4040");
});
