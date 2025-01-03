"use strict";
//
//    JOIN
//
//The IRC Command received when joining a channel. This is only sent to about
//ourself when not requesting the membership capability.
//

irc_commands["JOIN"] = function(irc_line){
	if(bot.connected === true){
		return;
	}
	
	bot.connected = true;
	bot.retry_count = 0;
	bot.reconnect_time = 0;
	bot.update_status_display();
	
	console.warn(get_time(), "Joined the Twitch channel");
	
	data.on_bot_connected();
};
