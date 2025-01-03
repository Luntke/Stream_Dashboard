"use strict";
//
//    Chat Bot
//
//This handles reading the chat.
//

let bot = {
	channel: channel.toLowerCase(),
	user_name: "",
	
	socket: null,
	should_run: false,
	try_to_reconnect: true,
	connected: false,
	reconnect_time: 0,
	reset_reconnect_time: 0,
	retry_count: 0,
	retry_times: [
		0,
		0.3,
		1,
		2,
		4,
		7,
		10,
		13,
		16,
		20
	],
	get_next_reconnect_time: function(){
		bot.retry_count++;
		
		if(bot.retry_count > bot.retry_times.length){
			return bot.retry_times[bot.retry_times.length - 1];
		}
		
		return bot.retry_times[bot.retry_count - 1];
	},
	socket_onopen: function(){
		console.warn(get_time(), "Socket opened");
		
		//Not requesting the membership capability, as we don't need that and it
		//would interfere with the JOIN and PART IRC commands.
		bot.socket.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
		
		bot.user_name = "justinfan" + (Math.floor(1 + Math.random() * 1000000));
		bot.socket.send("NICK " + bot.user_name);
		
		bot.socket.send("JOIN #" + bot.channel);
	},
	socket_onclose: function(){
		console.warn(get_time(), "Socket closed");
		
		bot.socket = null;
		bot.connected = false;
		bot.update_status_display();
		last_message_time = get_time();
		
		if(bot.should_run === true
		&& bot.try_to_reconnect === true){
			console.warn(get_time(), "Trying to reconnect");
			let wait_time = bot.reconnect_time;
			
			bot.reconnect_time = bot.get_next_reconnect_time();
			
			window.setTimeout(bot.start_bot, wait_time * 1000);
		}
		
		if(typeof data.on_bot_disconnected === "function"){
			data.on_bot_disconnected();
			data.on_bot_disconnected = null;
		}
	},
	start_bot: function(){
		if(bot.socket === null){
			bot.should_run = true;
			
			if(window.navigator.onLine === true){
				console.warn(get_time(), "Starting bot");
				bot.socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
				
				bot.socket.onopen = bot.socket_onopen;
				bot.socket.onclose = bot.socket_onclose;
				bot.socket.onmessage = handle_irc_message;
				
				bot.reconnect_time = bot.reset_reconnect_time;
				
				last_message_time = get_time();
			}
		}
	},
	stop_bot: function(){
		bot.should_run = false;
		
		if(bot.socket !== null){
			console.warn(get_time(), "Stopping bot");
			bot.socket.close();
			last_message_time = get_time();
		}
	},
	update_status_display: function(){
		if(bot.connected === true){
			online_status_text.className = "online";
			online_status_icon.className = "online";
		} else {
			online_status_text.className = "offline";
			online_status_icon.className = "offline";
		}
	}
};


bot.update_status_display();

let start_bot = bot.start_bot;
let stop_bot = bot.stop_bot;

const PING = "PING";
const PONG = "PONG";

let line_split_regex = /\r\n/g;

//Handles all incoming IRC messages. A PING is handled, all other messages are
//given to "parse_irc_line", line by line.
let handle_irc_message = function(event){
	let irc_message = event.data;
	last_message_time = get_time();
	
	//  Handling Special Cases  //
	
	//A ping is always a single line message, and as any line ending with \r\n.
	if(irc_message.startsWith(PING)){
		bot.socket.send(PONG);
		return;
	} else if(irc_message.startsWith(PONG)){
		return;
	}
	
	//  Pasing Each IRC Line  //
	
	//Each IRC command has to end with \r\n and can therefore be used to split
	//up a message into lines.
	line_split_regex.lastIndex = 0;
	let lines = irc_message.split(line_split_regex);
	
	for(let line of lines){
		if(line.length > 0){
			parse_irc_line(line);
		}
	}
};


//
//  Disconnect Check
//

//If there hasn't been a new IRC message for one minute we send a PING which
//should get us a PONG message. If there hasn't been a new IRC message for three
//minutes a disconnect is detected and a reconnect initiated.

let last_message_time = get_time();

let disconnect_test_interval_time = (3 * 60 * 1000);
let silence_until_disconnect = (6 * 60 * 1000);

let schedule_disconnect_test;
let reset_connection_timeout;

(function(){
	reset_connection_timeout = function(){
		last_message_time = get_time();
	};
	
	schedule_disconnect_test = function(){
		let time_now = get_time();
		let time_since_last_message = (time_now - last_message_time);
		
		//Ignore if we are not online.
		if(bot.try_to_reconnect === false
		|| bot.should_run === false
		|| bot.retry_count > 0){
			//console.log("Disconnect check does not apply right now");
			
			reset_connection_timeout();
			window.setTimeout(schedule_disconnect_test, disconnect_test_interval_time);
			return;
		}
		
		if(time_since_last_message < disconnect_test_interval_time){
			//console.log("Time since last message is below ping limit");
			
			window.setTimeout(schedule_disconnect_test, (disconnect_test_interval_time - time_since_last_message));
			return;
		}
		
		if(bot.socket === null
		&& bot.should_run === true){
			//console.log("Very strange that the bot isn't running, starting it again");
			
			reset_connection_timeout();
			window.setTimeout(schedule_disconnect_test, disconnect_test_interval_time);
			
			start_bot();
			return;
		}
		
		if(time_since_last_message < silence_until_disconnect){
			//console.log("Sending ping");
			bot.socket.send(PING);
			
			window.setTimeout(schedule_disconnect_test, disconnect_test_interval_time);
			return;
		}
		
		//console.log("Restarting bot");
		reset_connection_timeout();
		bot.socket.close();
		window.setTimeout(schedule_disconnect_test, disconnect_test_interval_time);
	};
})();

window.setTimeout(schedule_disconnect_test, disconnect_test_interval_time);


//
//    Connection Events
//

let on_online = function(){
	//console.log("online event");
	bot.try_to_reconnect = true;
	
	if(bot.should_run === true){
		start_bot();
	}
};

let on_offline = function(){
	//console.log("offline event");
	bot.try_to_reconnect = false;
	
	if(bot.socket !== null){
		bot.socket.close();
	}
};

window.addEventListener("online", on_online);
window.addEventListener("offline", on_offline);


//
//    Parse IRC Line
//

//Logs an error if there was an unexpected IRC line. This happens if the IRC
//line has an unexpected structure. It shouldn't actually happen.
let unexpected_irc_line = function(line){
	console.warn("Unexpected IRC line. Line:", line);
};

//Handles all lines from IRC messages besides PING. They are split into their
//parts and the created IRC line object is given to the IRC command handler.
let parse_irc_line = function(raw_line){
	//Example of an IRC line:
	//    @tags :irc_user command[ parameters]
	
	//IRC line object used in the handling of the line.
	let irc_line = {
		raw_tags: "",
		irc_user: undefined,
		command: undefined,
		parameters: false
	};
	
	//The current index starting at which everything has to be parsed yet.
	let parse_index = 0;
	
	//Index of the next space character.
	let next_space_index;
	
	
	//  Get Tags  //
	
	if(raw_line.charAt(parse_index) === "@"){
		next_space_index = raw_line.indexOf(" ", parse_index);
		
		if(next_space_index >= 0){
			irc_line.raw_tags = raw_line.substring(parse_index, next_space_index);
			parse_index = next_space_index + 1;
		} else {
			unexpected_irc_line(raw_line);
			return;
		}
	}
	
	//  Get IRC User  //
	
	next_space_index = raw_line.indexOf(" ", parse_index);
	
	if(next_space_index >= 0){
		irc_line.irc_user = raw_line.substring(parse_index, next_space_index);
		parse_index = next_space_index + 1;
	} else {
		unexpected_irc_line(raw_linee);
		return;
	}
	
	//  Get Command Part  //
	
	next_space_index = raw_line.indexOf(" ", parse_index);
	
	if(next_space_index >= 0){
		irc_line.command = raw_line.substring(parse_index, next_space_index);
		irc_line.parameters = raw_line.substring(next_space_index + 1);
	} else {
		irc_line.command = raw_line.substring(parse_index);
		irc_line.parameters = false;
	}
	
	
	//  Handle Command  //
	
	handle_irc_command(irc_line);
};

//Takes an IRC line object and gives it to the respective IRC command handler if
//one exists.
let handle_irc_command = function(irc_line){
	if(irc_commands.hasOwnProperty(irc_line.command)
	&& typeof irc_commands[irc_line.command] === "function"){
		irc_commands[irc_line.command](irc_line);
	}
};

//Container of all IRC command handlers. A handler is added by setting the
//property with the name of its handled command to that handler function.
let irc_commands = {};
