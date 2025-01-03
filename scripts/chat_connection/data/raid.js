"use strict";
//
//    Raid
//
//Handles raid IRC lines.
//

let handle_chat_raid = function(irc_line){
	let data_object = {};
	
	data_object.time = chat.get_time(irc_line);
	data_object.type = "raid";
	data_object.raider = chat.get_display_name(
		irc_line.tags["display-name"],
		irc_line.tags["login"]
	);
	data_object.viewer_count = Number(irc_line.tags["msg-param-viewerCount"]);
	
	//[debug_start]
	console.log("incoming raid", data_object);
	//[debug_end]
	data.add(data_object);
};
