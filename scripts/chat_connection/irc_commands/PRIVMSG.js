"use strict";
//
//    PRIVMSG
//
//The IRC Command received when someone writes a message. This is relevant to
//parse cheer messages.
//

let message_cutoff_index = ("#"+channel.toLowerCase()+" :").length;

//The string that has to be anywhere in the message to start an action message.
const ACTION_START_PART = "\u0001ACTION ";
//The string that has to appear exactly once after the start part to make a
//valid action message.
const ACTION_END_PART = "\u0001";

let parse_privmsg = function(irc_line){
	//  Parsing Message  //
	
	let channel_index = irc_line.parameters.indexOf("#");
	let message_index = irc_line.parameters.indexOf(":");
	
	irc_line.channel = irc_line.parameters.substring(channel_index + 1, message_index - 1);
	irc_line.message = irc_line.parameters.substring(message_index + 1);
	
	delete irc_line.parameters;
	
	//
	//Checks if the IRC line is an action message. It sets the "is_action"
	//property of the IRC line to the boolean indicating if it is one and
	//corrects the message property.
	//
	
	//Default flag value.
	irc_line.is_action = false;
	
	//Finds the start part of an action message.
	let action_start_part_index = irc_line.message.indexOf(ACTION_START_PART);
	
	if(action_start_part_index >= 0){
		//Finds the end part of an action message.
		let action_end_part_index = irc_line.message.indexOf(ACTION_END_PART, action_start_part_index + ACTION_START_PART.length);
		
		if(action_end_part_index >= 0){
			//If there is a second endpart then it isn't an action message.
			
			let second_end_part_index = irc_line.message.indexOf(ACTION_END_PART, action_end_part_index + ACTION_END_PART.length);
			
			if(second_end_part_index < 0){
				irc_line.is_action = true;
				irc_line.message = irc_line.message.substring(
					action_start_part_index + ACTION_START_PART.length,
					action_end_part_index
				);
			}
		}
	}
};

irc_commands["PRIVMSG"] = (function(){
	let bits_regex = /(?:@|;)bits=/;
	
	return function(irc_line){
		if(bits_regex.test(irc_line.raw_tags) === true){
			decode_tags(irc_line);
			parse_privmsg(irc_line);
			
			handle_chat_cheer(irc_line);
		}
	};
})();
