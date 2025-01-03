"use strict";
//
//    Communitygift
//
//Handles communitygift IRC lines.
//

let handle_chat_communitygift = function(irc_line){
	let data_object = {};
	
	data_object.time = chat.get_time(irc_line);
	data_object.type = "communitygift";
	data_object.payer = chat.get_display_name(
		irc_line.tags["display-name"],
		irc_line.tags["login"]
	);
	data_object.gift_count = Number(irc_line.tags["msg-param-mass-gift-count"]);
	if(irc_line.tags["msg-param-sub-plan"] === "3000"){
		data_object.tier = 3;
	} else if(irc_line.tags["msg-param-sub-plan"] === "2000"){
		data_object.tier = 2;
	} else {
		data_object.tier = 1;
	}
	
	//[debug_start]
	console.log("incoming communitygift", data_object);
	//[debug_end]
	data.add(data_object);
};
