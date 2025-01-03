"use strict";
//
//    Cheer
//
//Handles cheer IRC lines.
//

//This is the maximum amount of code units in a cheer message, after which the
//message is cut short to the closest code point. Twitch itself has a character
//limit of 500 code points per user chat message, which translates to between
//500 and 1000 JavaScript code units. This limit is above that of Twitch and
//therefore should not apply at this point.
let cheer_message_maximum_length = 4096;

let handle_chat_cheer = function(irc_line){
	let data_object = {};
	
	data_object.time = chat.get_time(irc_line);
	data_object.type = "cheer";
	data_object.user = chat.get_display_name(
		irc_line.tags["display-name"],
		get_user_name_from_irc_user(irc_line.irc_user)
	);
	data_object.amount = Number(irc_line.tags["bits"]);
	
	data_object.message = irc_line.message;
	data_object.emotes = irc_line.tags["emotes"];
	
	if(data_object.message.length > cheer_message_maximum_length){
		if((data_object.message.codePointAt(cheer_message_maximum_length - 1) > (2**16 - 1))){
			data_object.message = data_object.message.substring(0, cheer_message_maximum_length - 1);
		} else {
			data_object.message = data_object.message.substring(0, cheer_message_maximum_length);
		}
		
		data_object.emotes = "";
	}
	
	if(string_contains_utf_32(data_object.message)){
		data_object.emotes = unicode_to_index_emotes(data_object.message, data_object.emotes);
	}
	
	//[debug_start]
	console.log("incoming cheer", data_object);
	//[debug_end]
	data.add(data_object);
};
