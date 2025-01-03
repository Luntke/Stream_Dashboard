"use strict";
//
//    Functions
//
//Contains chat related functions.
//


let chat = {};

//Latin display names can contain A to Z, a to z, 0 to 9, underscores and
//spaces. It used to be possible to add spaces to the sides, which we can trim
//off because they add nothing. Twitch may give some users spaces in the middle.
//A display name has to be at least 1 character long. If none of these rules
//apply to the Twitch display name we have to use the available fallback user
//name to use as a Latin display name.
chat.get_display_name = (function(){
	let name_regex = /^[A-Za-z0-9_ ]+$/;
	
	return function(display_name, fallback_name){
		if(name_regex.test(display_name)){
			let trimmed_display_name = display_name.trim();
			
			if(trimmed_display_name.length > 0){
				return trimmed_display_name;
			}
		}
		
		return fallback_name;
	};
})();

chat.get_time = function(irc_line){
	return Number(irc_line.tags["tmi-sent-ts"]);
};

let string_contains_utf_32 = function(string){
	for(let character of string){
		if(character.length > 1){
			return true;
		}
	}
	
	return false;
};

//Takes the IRC user name and returns the parsed user name.
//    IRC user examples:
//        ":tmi.twitch.tv" -> twitch
//        ":lazy_luc.tmi.twitch.tv" -> lazy_luc
//        ":lazy_luc!lazy_luc@lazy_luc.tmi.twitch.tv" -> lazy_luc
let get_user_name_from_irc_user = function(irc_user){
	let tmi_index = irc_user.indexOf("tmi.twitch.tv");
	
	if(tmi_index === 1){
		return "twitch";
	}
	
	let at_index = irc_user.indexOf("@");
	
	if(at_index < 0){
		return irc_user.substring(1, (tmi_index - 1));
	}
	
	return irc_user.substring((at_index + 1), (tmi_index - 1));
};
