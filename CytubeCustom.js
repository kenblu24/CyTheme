//$('head').append("<link rel='stylesheet' href='http://zhuortho.tk/s/yepi.css' type='text/css' />");
//$('head').append("<link rel='stylesheet' href='https://dl.dropboxusercontent.com/u/8444244/ChanCSS/chancss.css' type='text/css' />");
/*
Thanks to: Kuer, Xaekai

*/
console.log("ranscript");
//move site and channel descriptors
$("#controlsrow").after($("#motdrow"));//move channel description (motd) below controls
$("#controlsrow").after($("#announcements"));//move cytube announcements below controls
$(".container-fluid").append($("#footer"));//move footer into mainpage element

//move chat elements
$("#mainpage").prepend($("#chatwrap"));//move chat element outside left container
$("#userlist").prepend($("#chatheader"));//move chat header(user toggles) to userlist
$("#chatheader").after( "<div id='connected'></div>");//create div to contain user count
$("#connected").append($("#usercount"));//move user count into previously created div
//$("#connected").append( "<span id='connectedText'>&nbsp Connected</span>" );//add "Connected" after user count
$("#chatwrap").append($("#userlisttoggle"));//move user count to chat wrap element

$("#main").after("<div id='videoinfo' class='section'></div>");//create box to contain video title, description, and playlist options.
$("#main").after($("#drinkbarwrap"));
$("#videoinfo").append("<div class='textheader'></div><div id='videoinfohead'><span id='addedbyTEXT'>Queued by <span id='addedby'></span></span><div id='headbottom'><div id='headright'><div id='ss7time' title='--:--'>0:00</div><div id='videolength'></div><div id='progbar'></div></div></div></div><div id='videoopts'></div>");
$(".textheader").append($("#currenttitle")); //move video title below video player
$("#headbottom").append("<button id='addmedia' title='Add Media' class='headbtn headbtnleft'></button>")
$("#headbottom").append($("#newpollbtn"));
$("#newpollbtn").addClass("headbtn headbtnleft");

$("#headbottom").append($("#mediarefresh"));
$("#headbottom").append($("#voteskip"));
$("#voteskip").addClass("headbtn");
$("#mediarefresh").addClass("headbtn");

$("#videoinfo").after($("#rightpane"));
$("#rightpane-inner").prepend("<div id='mediabuttons'></div>");
$("#rightpane-inner").addClass("section");

$("#mediabuttons").append($("#showmediaurl"));
$("#mediabuttons").append($("#showcustomembed"));
$("#mediabuttons").append($("#showsearch"));

$("#rightpane").after("<div id='queuecontainer' class='section'><button id='pldropdown' title='Playlist Options'></button><div class='textheader'><p id='upnext' class='sectionheader'>Up Next</p></div></div>");
$("#queuecontainer").append($("#queue"));
$("#upnext").append($("#plmeta"));



_time = {raw: 0, ofs: 0, paused: false};
currentmedia = {istemp: false, location: 0, uid: 0, id: 0, seconds: 0, length: 0};
playlistinfo = {length: 0};
issplit = false;

if (typeof(_changeMediaVIDEBLU) == 'undefined') { _changeMediaVIDEBLU = Callbacks.changeMedia; }
if (typeof(_playlistVIDEBLU) == 'undefined') { _playlistVIDEBLU = Callbacks.playlist; }
if (typeof(_queueVIDEBLU) == 'undefined') { _queueVIDEBLU = Callbacks.queue; }
if (typeof(_mediaupdateVIDEBLU) == 'undefined') { _mediaUpdateVIDEBLU = Callbacks.mediaUpdate; }

Callbacks.queue = function(data) {
	_queueVIDEBLU(data);
	console.log("Called Callbacks.queue")
	console.log(data);
}

Callbacks.playlist = function(data) {
	console.log("Called Callbacks.playlist");
	console.log(data);
	_playlistVIDEBLU(data);
	requeue(data);
	globaLplaylistdata = data;
	playlistinfo.length = data.length;
}

function requeue (data) {
	/*for (var i = 0; i <= data.length - 1; i++) {//find information of current video in playlist
		var e = data[i];
		if (e.media.id == currentmedia.id) {
			currentmedia.uid = e.uid;
			currentmedia.ispermanent = e.temp;
			currentmedia.location = i;
		}
	}*/
	var _playlist=[];
	$("#queue > .queue_entry").each(function(){
		var data = $(this).data();
		var addedby = $(this).attr("title").match(/: (\w+)$/)[1];
		_playlist.push({ uid: data.uid, media: data.media, temp: data.temp });
	});
}

//function changeMedia2(){
	Callbacks.changeMedia = function(data) {
		_changeMediaVIDEBLU(data);
		$("#currenttitle").text(data.title);
		$("#ss7time").attr("title", data.duration);
		currentmedia.length = data.duration;
		currentmedia.id = data.id;
		currentmedia.seconds = data.seconds;
		console.log("Loaded Video");
		console.log(data);
	}
//}
//changeMedia2()

//function mediaUpdate2() {
	Callbacks.mediaUpdate = function(data) {
		_mediaUpdateVIDEBLU(data);
		_time.paused = data.paused;
		_time.raw = Math.max(data.currentTime, 0);
		_time.ofs = _time.raw - (new Date()).getTime()/1000;
	}
//}
//mediaUpdate2();


/*function replacekuerscript() { //This function is optional, but you must un-comment "changeMedia2()" above before removing this function.
	var i = 0;
	do {
		changeMedia2();
		setTimeout(changeMedia2, 1000);
		//console.log("did it " + i)
		i++;
	}
	while (Callbacks.changeMedia !== changeMedia2 && i < 500);//repeat(200) until Kuer's script overwrites my function, overwrite it again.
}
replacekuerscript()*/


//Code Author: Kuer
/*Callbacks.changeMedia = function(data) {
    _changeMedia(data);
    $("#currenttitle").text(data.title);
    console.log(data);
}*/

//Code Author: Xaekai
/*function playlist(){ 
	var _playlist=[];
	$("#queue > .queue_entry").each(function(){
		var data = $(this).data();
		_playlist.push({ uid: data.uid, media: data.media, temp: data.temp });
		console.log(data);
		console.log($(this))
	});
	return _playlist;
}*/

//Massive thanks to ss7 for Video Time Display code.
setvideotime = function() {
	var t = _time.paused ? _time.raw : (new Date()).getTime()/1000 + _time.ofs; //
	var percenttime = Math.round(t * 160 / currentmedia.seconds);
	if (percenttime > 160) {percenttime = 0}	
	$("#progbar").css("width", percenttime + "px");
	setTimeout(setvideotime, 1000*(Math.round(t)+1 - t)); //Update time every second
	t = Math.round(t);
	var s = t % 60; t = Math.floor(t/60);
	var m = t % 60;
	var h = Math.floor(t/60);
	if (s < 10) { s = '0'+s; }//9:9:9 -> 9:9:09
	if (m < 10) { m = '0'+m; }//9:9:09 -> 9:09:09
	if (h < 10) { h = '0'+h; }//9:09:09 -> 09:09:09
	if (currentmedia.seconds > 3598) {$('#ss7time').text(h+':'+m+':'+s);}//if media is longer than an hour
	else if (h == 0) {$('#ss7time').text(m+':'+s);}//if less than an hour do not display hour metric
	else if (currentmedia.length == "--:--") {$('#ss7time').text("Live")}// if "--:--" is length, set duration to "Live"
}
setvideotime();

$("#addmedia").click(function(){
	if ($("#rightpane").css('display') == 'none'){
		var i = 0;
		$("#mediabuttons button").each(function() {
			if ($(this).css("display") == "none") {return true;}
			i++
		});
		if (i = 0) {$("#addfromurl").show().addClass('jqshow')}

	}
	elseif () {
		$("#addfromurl").hide().removeClass('jqshow')
		$("#rightpane").slideToggle(200);
	}
});