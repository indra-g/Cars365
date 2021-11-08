var time = $("h5.time").html();
var slicedtime = time.slice(0, 12);
var countDownDate = new Date(time).getTime();
var x = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  $("h5.time").html(
    "Auction will end in: " +
      days +
      "d " +
      hours +
      "h " +
      minutes +
      "m " +
      seconds +
      "s (i.e on " +
      slicedtime +
      ")"
  );
  if (distance < 0) {
    clearInterval(x);
    $("h5.time").html("Auction is about to end");
  }
  $("h5.time").css("visibility", "visible");
}, 1000);
