"use strict";
//
//    Load FFZ Emotes
//
//Loads and processes FFZ emote data.
//

let ffz = {
	//Replaced by a regular expression object.
	emotes_regex: null,
	//Filled with objects for every FFZ emote.
	//[emote code]: {
	//    url: [String]
	//        The URL to the scale 1 emote version.
	//    is_global: [Boolean]
	//        A boolean indicating if the FFZ emote is a global emote.
	//}
	code_to_data: {}
};


let load_ffz_emotes = async function(){
	//  Functions  //
	
	let get_url = function(url){
		if(url.startsWith("//")){
			return `https:${url}`;
		}
		
		return url;
	};
	
	let process_response_data = function(data, is_global){
		if(data === null
		|| typeof data !== "object"){
			return;
		}
		if(data.sets === null
		|| typeof data.sets !== "object"){
			return;
		}
		
		
		for(let set_id in data.sets){
			let set = data.sets[set_id];
			
			if(set === null
			|| typeof set !== "object"){
				continue;
			}
			if(!Array.isArray(set.emoticons)){
				continue;
			}
			
			for(let emote of set.emoticons){
				if(emote === null
				|| typeof emote !== "object"){
					continue;
				}
				
				let emote_code = emote.name;
				
				if(typeof emote_code !== "string"
				|| emote_code.length === 0){
					continue;
				}
				if(emote.urls === null
				|| typeof emote.urls !== "object"
				|| typeof emote.urls["1"] !== "string"
				|| emote.urls["1"].length === 0){
					continue;
				}
				
				
				emote_codes.push(emote_code);
				
				ffz.code_to_data[emote_code] = {
					url: get_url(emote.urls["1"]),
					is_global: is_global
				};
			}
		}
	};
	
	
	//  Loading  //
	
	let [
		global_data,
		channel_data
	] = await Promise.all([
		get_global_ffz_emotes(),
		get_channel_ffz_emotes()
	]);
	
	
	//  Processing  //
	
	let emote_codes = [];
	
	process_response_data(global_data, true);
	process_response_data(channel_data, false);
	
	
	//  Creating Regular Expression  //
	
	//If there are no FFZ emotes cancel creating a regular expression for it.
	if(emote_codes.length === 0){
		return;
	}
	
	
	let regex_string = (
		"( |^)(" +
		
		get_emote_code_regex_string(emote_codes) +
		
		")(?: |$)"
	);
	
	ffz.emotes_regex = new RegExp(regex_string, "g");
};
