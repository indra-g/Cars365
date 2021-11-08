var time = document.getElementsByClassName("time")[0].innerHTML
var countDownDate = new Date(time).getTime();
var x = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementsByClassName("time")[0].innerHTML =
    "Auction will end in: " +
    days +
    "d " +
    hours +
    "h " +
    minutes +
    "m " +
    seconds +
    "s (i.e, on "+time+")";
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("time")[0].innerHTML = "Auction is about to end";
  }
  document.getElementsByClassName("time")[0].style.visibility = "visible";
}, 1000);