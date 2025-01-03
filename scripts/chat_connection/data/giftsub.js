"use strict";
//
//    Giftsub
//
//Handles giftsub IRC lines.
//

let handle_chat_giftsub = function(irc_line){
	let data_object = {};
	console.log(irc_line);
	data_object.time = chat.get_time(irc_line);
	data_object.type = "giftsub";
	data_object.payer = chat.get_display_name(
		irc_line.tags["display-name"],
		irc_line.tags["login"]
	);
	data_object.receiver = chat.get_display_name(
		irc_line.tags["msg-param-recipient-display-name"],
		irc_line.tags["msg-param-recipient-user-name"]
	);
	data_object.gifted_month_count = Number(irc_line.tags["msg-param-gift-months"]);
	
	if(Number.isNaN(data_object.gifted_month_count)
	|| data_object.gifted_month_count < 1
	|| data_object.gifted_month_count % 1 !== 0){
		data_object.gifted_month_count = 1;
	}
	
	//[debug_start]
	console.log("incoming giftsub", data_object);
	//[debug_end]
	data.add(data_object);
};
