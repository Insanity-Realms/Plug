overPlayed = ["1:chV6DSBeI7k"];

function autoSkip() {
  if (overPlayed.indexOf(Models.room.data.media.id) > -1) {
		API.sendChat("/me Auto skip activated! Song overplayed!");
		setTimeout("new RoomPropsService(document.location.href.split('/')[3],true,true,1,5);", 250);
		setTimeout("new ModerationForceSkipService;", 500);
		setTimeout("new RoomPropsService(document.location.href.split('/')[3],false,true,1,5);", 750);
	}
	if (Models.room.data.media.duration > 421) {
		API.sendChat("/me Auto skip activated! song exceeds 7 minutes long.");
		setTimeout("new RoomPropsService(document.location.href.split('/')[3],true,true,1,5);", 250);
		setTimeout("new ModerationForceSkipService;", 500);
		setTimeout("new RoomPropsService(document.location.href.split('/')[3],false,true,1,5);", 750);
	}
}

function roomSkip() {
	var tv = Models.room.roomScore.negative + Models.room.roomScore.positive;
	var tvp = Models.room.roomScore.negative / tv;
	if(tvp >= 20) {
		new ModerationForceSkipService;
		API.sendChat("room voted to skip!");
	}
}
