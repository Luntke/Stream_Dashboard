"use strict";
//
//    Subscription
//
//Handles subscription IRC lines.
//

let handle_chat_subscription = function(irc_line){
	let data_object = {};
	
	data_object.time = chat.get_time(irc_line);
	data_object.type = "subscription";
	data_object.receiver = chat.get_display_name(
		irc_line.tags["display-name"],
		irc_line.tags["login"]
	);
	
	//[debug_start]
	console.log("incoming subscription", data_object);
	//[debug_end]
	data.add(data_object);
};
