/*
Thanks to: Kuer, Xaekai

*/
console.log("ranscript");

//add settings to user prefs modal
$("#useroptions .modal-header .nav.nav-tabs").append("<li class> <a href='#us-cytheme-controls' data-toggle='tab'>CyTheme Options</a></li>")
$("#useroptions .modal-body .tab-content").append("<div id='us-cytheme-controls' class='tab-pane'><h4>CyTheme Options</h4><form action='javascript:void(0)' class='form-horizontal'></form></div>")

//move site and channel descriptors
$("#controlsrow").after($("#motdrow"));//move channel description (motd) below controls
$("#controlsrow").after($("#announcements"));//move cytube announcements below controls
$(".container-fluid").append($("#footer"));//move footer into mainpage element

//move chat elements
$("#mainpage").prepend($("#chatwrap"));//move chat element outside left container
//$("#userlist").prepend($("#chatheader"));//move chat header(user toggles) to userlist
$("#userlist").prepend("<div id='connected'></div>");//create div to contain user count
$("#connected").append($("#usercount"));//move user count into previously created div
//$("#connected").append( "<span id='connectedText'>&nbsp Connected</span>" );//add "Connected" after user count
//$("#chatwrap").append($("#userlisttoggle"));//move user count to chat wrap element

$("#main").after("<div id='videoinfo' class='section'></div>");//create box to contain video title, description, and playlist options.
$("#main").after($("#drinkbarwrap"));
$("#videoinfo").append("<div class='textheader'></div><div id='videoinfohead'><span id='addedbyTEXT'>Queued by <span id='addedby'></span></span><div id='headbottom'><div id='headright'><div id='ss7time' title='--:--'>0:00</div><div id='videolength'></div><div id='progbar'></div></div></div></div><div id='videoopts'></div>");
$(".textheader").append($("#currenttitle")); //move video title below video player
$("#headbottom").append("<button id='addmedia' title='Add Media' class='headbtn headbtnleft'></button>");
$("#headbottom").append($("#newpollbtn"));
$("#newpollbtn").addClass("headbtn headbtnleft");
$("#headbottom").append("<button id='morebtn' title='More Actions' data-toggle='dropdown' class='headbtn headbtnleft'></button>");
$("#morebtn").after("<ul class='dropdown-menu'><li id='mediarefreshli'></li><li><button></button></li></ul>");
$("#mediarefreshli").append($("#mediarefresh"));
$("#mediarefresh").text("Refresh Video Player");

$("#headbottom").append($("#voteskip"));

$("#videoinfo").after($("#rightpane"));
$("#rightpane-inner").prepend("<div id='mediabuttons'></div>");
$("#rightpane-inner").addClass("section");

$("#mediabuttons").append($("#showmediaurl"), $("#showcustomembed"), $("#showsearch"), $("#showplaylistmanager"));

$("#rightpane").after("<div id='queuecontainer' class='section'><button id='pldropdown' data-toggle='dropdown' title='Playlist Options'></button><div class='textheader'><p id='upnext' class='sectionheader'>Up Next</p></div></div>");
$("#queuecontainer").append($("#queue"));
$("#upnext").append($("#plmeta"));
$("#pldropdown").after("<ul id='ploptions' class='dropdown-menu' role='menu'></ul>");
$("#ploptions").append($("#shuffleplaylist"), $("#clearplaylist"), $("#getplaylist"));
$("#pldropdown").after($("#qlockbtn"));

//$('head').append("<link rel='stylesheet' href='https://rawgit.com/kenblu24/CyTheme/master/chancss.css' />"); //Adds up-to-date css from github


_timeVIDEBLU = {raw: 0, ofs: 0, paused: false};//Define time object for ss7's video time display plugin
currentmedia = {istemp: false, location: 0, uid: 0, id: 0, seconds: 0, length: 0};
playlistinfo = {length: 0};
issplit = false;
var trnsdelay = 200;//Defines trnsdelay, transition time (in ms)

if (typeof(_changeMediaVIDEBLU) == 'undefined') { _changeMediaVIDEBLU = Callbacks.changeMedia; }//Creates global variable _changeMediaVIDEBLU and sets it equal to old changeMedia() in Callbacks.js
if (typeof(_playlistVIDEBLU) == 'undefined') { _playlistVIDEBLU = Callbacks.playlist; }
if (typeof(_queueVIDEBLU) == 'undefined') { _queueVIDEBLU = Callbacks.queue; }
if (typeof(_mediaupdateVIDEBLU) == 'undefined') { _mediaUpdateVIDEBLU = Callbacks.mediaUpdate; }

Callbacks.queue = function(data) {//currently for debugging purposes only. Doesn't do anything.
	_queueVIDEBLU(data);
	console.log("Called Callbacks.queue");
	console.log(data);
}

Callbacks.playlist = function(data) {//currently for debugging purposes only. Doesn't do anything.
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
		//var addedby = $(this).attr("title").match(/: (\w+)$/)[1];
		_playlist.push({ uid: data.uid, media: data.media, temp: data.temp });
	});
}

//function changeMedia2(){
	Callbacks.changeMedia = function(data) {//Adds to the old changeMedia() in Callbacks.js, which is called when the media changes.
		_changeMediaVIDEBLU(data);//call the old changeMedia() function stored.
		$("#currenttitle").text(data.title);//change the text of #currenttitle to data.title (gets rid of "Currently Playing: " in video title)
		$("#ss7time").attr("title", data.duration);//gets time of current video
		currentmedia.length = data.duration;
		currentmedia.id = data.id;
		currentmedia.seconds = data.seconds;
		var title = $("#queue .queue_active").attr("title");
		$("#addedby").text(title.match(/(?:Added by: ){1}(.*)/)[1]);
		console.log(data)
		console.log("^callbacks.changeMedia")
	}
//}
//changeMedia2()

//function mediaUpdate2() {
	Callbacks.mediaUpdate = function(data) {//Adds to the old mediaUpdate() in Callbacks.js, which is called every couple seconds.
		_mediaUpdateVIDEBLU(data);//call the old mediaUpdate function stored.
		_timeVIDEBLU.paused = data.paused;//stores data.paused in another variable. (Is video paused?)
		_timeVIDEBLU.raw = Math.max(data.currentTime, 0);//stores the current video time position as _timeVIDEBLU.raw, to be used in setvideotime()
		_timeVIDEBLU.ofs = _timeVIDEBLU.raw - (new Date()).getTime()/1000;//stores time offset, to keep the timer going between media updates
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
	var t = _timeVIDEBLU.paused ? _timeVIDEBLU.raw : (new Date()).getTime()/1000 + _timeVIDEBLU.ofs; //
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
	if ($("#rightpane").css('display') == 'none'){//if add media is hidden
		$("#mediabuttons button").each(function() {
			if ($(this).css("display") != "none") {
				if ($(this).hasClass("collapsed")){
					$(this).trigger("click");
				}
				return false;
			}//if button is clickable
		});
		$("#rightpane").slideDown(trnsdelay);
	}
	else {
		$("#rightpane").slideUp(trnsdelay);
	}
});

$("#morebtn").click(function(event){$("#headbottom .dropdown-menu").css("left", event.clientX - 50 + "px");});

/*
▄██████████████▄▐█▄▄▄▄█▌
██████▌▄▌▄▐▐▌███▌▀▀██▀▀
████▄█▌▄▌▄▐▐▌▀███▄▄█
▄▄▄▄▄██████████████▀
*/

//$('head').append("<link rel='stylesheet' href='https://cdn.rawgit.com/kenblu24/CyTheme/1be967c1774b4a51612fde8f3a451250a2a08019/base.css' />"); //Adds up-to-date css from github

//$('head').append("<link rel='stylesheet' href='https://cdn.rawgit.com/kenblu24/CyTheme/1be967c1774b4a51612fde8f3a451250a2a08019/cyborg.css' />"); //Adds up-to-date css from github
