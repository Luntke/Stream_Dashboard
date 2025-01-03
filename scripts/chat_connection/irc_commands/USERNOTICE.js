"use strict";
//
//    USERNOTICE
//
//The IRC Command received for various reasons. The "msg-id" tag defines what
//kind of usernotice it is. The values we care about are "sub", "resub",
//"subgift", "submysterygift", and "raid".
//

let overwrite_user_to_anonymous = function(irc_line){
	irc_line.tags["user-id"] = "274598607";
	irc_line.tags["login"] = "ananonymousgifter";
	irc_line.tags["display-name"] = "AnAnonymousGifter";
};

irc_commands["USERNOTICE"] = function(irc_line){
	decode_tags(irc_line);
	//[debug_start]
	console.log(irc_line);
	//[debug_end]
	
	let event_type = irc_line.tags["msg-id"];
	
	if(event_type === "sub"
	|| event_type === "resub"){
		handle_chat_subscription(irc_line);
		return;
	}
	
	if(event_type === "subgift"){
		handle_chat_giftsub(irc_line);
		return;
	}
	if(event_type === "anonsubgift"){
		overwrite_user_to_anonymous(irc_line);
		handle_chat_giftsub(irc_line);
		return;
	}
	
	if(event_type === "submysterygift"){
		handle_chat_communitygift(irc_line);
		return;
	}
	if(event_type === "anonsubmysterygift"){
		overwrite_user_to_anonymous(irc_line);
		handle_chat_communitygift(irc_line);
		return;
	}
	
	if(event_type === "raid"){
		handle_chat_raid(irc_line);
		return;
	}
};
