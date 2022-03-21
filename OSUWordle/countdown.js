var midnight = new Date();
midnight.setHours(24);
midnight.setMinutes(0);
midnight.setSeconds(0);
midnight.setMilliseconds(0);

var x = setInterval(function() {
    
    var now = new Date().getTime();
    var distance = midnight - now;

    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
})