var wMsg = [
  "here's a tasty reward just for you (>_<)-#",
	"have a waffle (>_<)-#",
	"puppies aren't just for christmas, they are forever. on the other hand, waffles are for now!! om nom nom nom nom (>_<)-#",
	"nice to eat you, waffle? (>_<)-#",
	"if promises are waffles and waffles are promises, does that mean that promises are just for the moment in which they are consumed? #-(>_<)-#",
	"waffle waffle waffle waffle waffle, yeah! (>_<)-#",
	"great things come to those who wa-- ooo a waffle! (>_<)-#",
	"a waffley waffle just for waffling on, you waffle! (>_<)-#",
];

String.prototype.equalsIgnoreCase = function(other) { 
  	return typeof other !== 'string' ? false : this.toLowerCase() === other.toLowerCase();
};

ccm = Class.extend({
	init: function() {
        	Models.chat.chatCommand = this.customChatCommand;
        	ChatModel.chatCommand   = this.customChatCommand;
     	},
     	getUser: function(data) {
         	data = data.trim();
         	if (data.substr(0,1) == '@') {
              		data = data.substr(1);
         	}
         	var users = API.getUsers();
         	for (var i in users) {
              		if (users[i].username.equalsIgnoreCase(data) || users[i].id.equalsIgnoreCase(data)) {
                  		return users[i];
              		}
         	}
         	return null;
     	},
     	getUserInfo: function(data) {
        	var user = this.getUser(data);
         	if (user == null) {
                        log('cannot find user');
                }
         	else {
                        log('user ID: "' + user.id + '"');
                }
	 },
         addUserInfo: function(data) {
                var user = this.getUser(data);
                if (user == null) {
                        log('cannot find user');
                }
                else {
                        API.moderateAddDJ(user.id);
                }
        },
        rmUserInfo: function(data) {
                var user = this.getUser(data);
                if (user == null) {
                        log('cannot find user');
                }
                else {
                        API.moderateRemoveDJ(user.id);
                }
        },
        wUserInfo: function(data) {
                var user = this.getUser(data);
                if (user == null) {
                        log('cannot find user');
                }
                else {
                        API.sendChat('@' + user.username + ' ' + wMsg[Math.floor(Math.random() * wMsg.length)]);
                }
        },
	customChatCommand: function(a) {
		var b;
	 	if ("/commands" == a) {
	   		return log('<span><strong>Extra Commands:</strong></br>/ca &nbsp; Change Avatar</br>/op &nbsp; Show Track ID</br>/id @username &nbsp; Show User ID</br>/add @username &nbsp; Add User To Booth/Waitlist</br>/rm @username &nbsp; Remove User From Booth/Waitlist</br>/w @username &nbsp; Send Special Message</br>/strobe off &nbsp; Deactivate Strobes</span>'), !0;
	 	}        
	 	if ("/ca" == a) {
	   		return Models.user.changeAvatar("halloween" + prompt("Enter Avatar Number:\r\r01 - Male Vampire\r02 - Female Vampire\r03 - Male Frankenstein\r04 - Female Frankenstein\r05 - Male Skeleton\r06 - Female Skeleton\r07 - Male Mummy\r08 - Female Mummy\r09 - Male Ghost\r10 - Male Werewolf\r11 - Pumpkin Man\r12 - Female Werewolf\r13 - Male Zombie", "01")), !0;
		}
	        if ("/op" == a) {
	   		return log('<span>Song: ' + API.getMedia().author + " - " + API.getMedia().title + '"</span></br><span>song ID: "' + API.getMedia().id + '"</span>'), !0;
		}
	        if (0 == a.indexOf('/id ')) {
	   		return cc.getUserInfo(a.substr(4)), !0;
		}
                if (0 == a.indexOf('/add ')) {
                        return cc.addUserInfo(a.substr(5)), !0;
                }
                if (0 == a.indexOf('/rm ')) {
                        return cc.rmUserInfo(a.substr(4)), !0
                }
                if (0 == a.indexOf('/w ')) {
                        return cc.wUserInfo(a.substr(3)), !0
                }
	        if ("/strobe off" == a) {
			log('<span>strobes deactivated!</span>'); 
			return RoomUser.audience.strobeMode(false), !0;
	  	};
	  	if ("/skip" == a) {
			lock = new RoomPropsService(document.location.href.split('/')[3],true,true,1,5);
			API.moderateForceSkip();
			unlock = new RoomPropsService(document.location.href.split('/')[3],false,true,1,5); 
			return log('User skipped!'), !0;
	  	};
		if ("/help" == a) return a = {type: "update"}, a.message =Lang.chat.help, this.receive(a), !0;
		if ("/users" == a) return UserListOverlay.show(), !0;
            	if ("/hd on" == a) return Playback.setHD(!0), !0;
            	if ("/hd off" == a) return Playback.setHD(!1), !0;
            	if ("/chat big" == a) return this.expand(), !0;
            	if ("/chat small" == a) return this.collapse(), !0;
            	if ("/afk" == a) return Models.user.changeStatus(1), !0;
            	if ("/back" == a) return Models.user.changeStatus(0), !0;
            	if (0 == a.indexOf("/ts ")) return b = a.split(" ").pop(), DB.settings.chatTS = "12" == b ? 12 : "24" == b ? 24 : !1, this.dispatchEvent("timestampUpdate", {
                    	value: DB.settings.chatTS
                    }),
            	DB.saveSettings(), !0;
            	if (0 == a.indexOf("/cap ")) {
                	if (a = parseInt(a.split(" ").pop()), 0 < a && 201 > a) return RoomUser.audience.gridData.avatarCap = a, RoomUser.redraw(), DB.settings.avatarcap = a, DB.saveSettings(), log(Lang.messages.cap.split("%COUNT%").join("" + a)), !0
            	} else {
                	if ("/cleanup" == a) return DB.reset(), Dialog.alert(Lang.alerts.updateMessage, $.proxy(Utils.forceRefresh, Utils), Lang.alerts.update, !0), !0;
                	if ("/stream on" == a) DB.settings.streamDisabled = !1, DB.saveSettings(), Playback.media && Playback.play(Playback.media,
                        	Playback.mediaStartTime), b = "Video/audio streaming enabled.";
                	else if ("/stream off" == a) DB.settings.streamDisabled = !0, DB.saveSettings(), Playback.stop(), b = "<strong>Video/audio streaming has been stopped.</strong> Type <em>/stream on</em> to enable again.";
               		else {
                    		if ("/clear" == a) return this.dispatchEvent("chatClear"), _gaq.push(["_trackEvent", "Chat", "Clear", Models.room.data.id]), !0;
                    		Models.room.ambassadors[Models.user.data.id] ? "/fixbooth" == a && (new ModerationBoothCleanupService, b = "Fixing Booth") : Models.room.admins[Models.user.data.id] &&
                        		("/fixbooth" == a ? (new ModerationBoothCleanupService, b = "Fixing Booth") : 0 == a.indexOf("/audience ") ? (a = parseInt(a.split(" ").pop()), 0 < a ? (RoomUser.testAddAvatar(a), b = "Adding " + a + " fake avatars to audience") : (RoomUser.clear(), RoomUser.setAudience(Models.room.getAudience()), RoomUser.setDJs(Models.room.getDJs()), b = "Cleared fake avatars from audience")) : 0 == a.indexOf("/ping ") ? (DB.settings.showPings = "/ping on" == a ? !0 : !1, DB.saveSettings(), b = "Ping messages are " + (DB.settings.showPings ? "on" : "off")) : 0 == a.indexOf("/speed ") &&
                        		(b = parseInt(a.split(" ").pop()), animSpeed = 0 < b ? b : 83, b = "Setting animation speed to " + animSpeed))
                	}
            	}
		return b ? (a = {
			type: "system"
		}, a.message = b, this.receive(a), !0) : !1
	},
});

var cc = new ccm();
