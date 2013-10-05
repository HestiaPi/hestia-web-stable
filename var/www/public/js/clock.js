function showTime() {
	var todayutc = new Date();
	var utc = todayutc.getTime() + (todayutc.getTimezoneOffset() * 60000);
	var today = new Date(utc);
	
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	// add a zero in front of numbers<10
	h = checkTime(h);
	m = checkTime(m);
	s = checkTime(s);
	$("#clock").text(h + ":" + m + ":" + s);
	//$("#clock").text("UTC:"+todayutc);
	//$("#clock").text("Local:"+today);
	t = setTimeout('showTime()', 1000);
}
function checkTime(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}
$(document).ready(showTime());