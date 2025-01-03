"use strict";
//
//    Emotes Unicode Fix
//
//Received cheer messages from Twitch chat contain an "emotes" tag describing
//the type and position of emotes in the cheer message. The starting position
//values are set to the amount of Unicode code points that have come before the
//emote. Because the code used in this project treats one code unit as one code
//point and JavaScript uses UTF-16, some characters will take up 2 code units
//and therefore disagree with the actual amount of characters. To fix this, this
//function recalculates the position values of the "emotes" tag to UTF-16 code
//units.
//
//
//Example "emotes" tag value:
//    "1279975:0-9/1279921:11-23,36-48,50-62/1279994:25-34"
//

let unicode_to_index_emotes = function(message, emotes){
	if(emotes.length === 0){
		return emotes;
	}
	
	let emote_list = {};
	
	let emote_ids = emotes.split("/");
	
	for(let id_part of emote_ids){
		let [id, values_list] = id_part.split(":");
		
		emote_list[id] = [];
		let parts = values_list.split(",");
		
		for(let index of parts){
			let start_end = index.split("-");
			
			emote_list[id].push([
				start_end[0],
				start_end[1]
			]);
		}
	}
	
	
	let codepoint_to_index = [];
	
	let codepoint_position = 0;
	const MAX_CODE_VALUE = (1 << 16) - 1;
	
	for(let i = 0;i < message.length;i += 1, codepoint_position += 1){
		codepoint_to_index[codepoint_position] = i;
		
		if(message.codePointAt(i) > MAX_CODE_VALUE){
			//Jump over next index, which is part of the same codepoint
			i++;
		}
	}
	
	//Assuming that an emote doesn't end with a 2 unit codepoint.
	for(let id in emote_list){
		for(let index of emote_list[id]){
			index[0] = codepoint_to_index[index[0]];
			index[1] = codepoint_to_index[index[1]];
		}
	}
	
	//Putting it all back together.
	
	let ids = [];
	
	for(let id in emote_list){
		let indices = [];
		
		for(let index of emote_list[id]){
			indices.push(index.join("-"));
		}
		
		ids.push(id + ":" + indices.join(","));
	}
	
	return ids.join("/");
};
