"use strict";
//
//    Load BTTV Emotes
//
//Loads and processes BTTV emote data.
//

let bttv = {
	//Replaced by a regular expression object.
	emotes_regex: null,
	//Filled with objects for every BTTV emote.
	//[emote code]: {
	//    url: [String]
	//        The URL to the scale 1 emote version.
	//    is_global: [Boolean]
	//        A boolean indicating if the BTTV emote is a global emote.
	//}
	code_to_data: {},
	//These BTTV emotes get special CSS properties to overlap previous emotes.
	//Due to the difference in the HTML tree structure of this page compared to
	//Twitch I need to add a bit of JavaScript to emulate the same effect. The
	//Rules go like this:
	//    0. Get a list of all the formatting blocks. This includes emotes,
	//       cheermotes, hyperlinks, BTTV emotes, FFZ emotes and Twitter emoji.
	//    1. For every BTTV emote, check if it is on the list of overlap emotes.
	//       If it is, then it gets the overlap properties only if there is a
	//       previous formatting block and the previous formatting block is not
	//       a hyperlink or cheermote.
	//    2. A BTTV emote can't get overlap properties if it is an IceCube emote
	//       and the previous formatting block is an IceCube emote or it is a
	//       SoSnowy emote and the previous formatting block is a SoSnowy emote.
	overlap_emotes: [
		"IceCube",
		"SoSnowy",
		"SantaHat",
		"TopHat",
		"CandyCane",
		"ReinDeer",
		"cvHazmat",
		"cvMask"
	],
	//Large emotes are
	large_emotes: [
		"cvHazmat",
		"cvMask"
	]
};


let load_bttv_emotes = async function(){
	//  Functions  //
	
	let is_valid_template = function(template){
		if(typeof template === "string"
		&& template.includes("{{id}}")
		&& template.includes("{{image}}")){
			return true;
		}
		
		return false;
	};
	
	let get_url_from_template = function(template, id){
		let url = (
			template
			.replace("{{id}}", id)
			.replace("{{image}}", "1x")
		);
		
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
		if(!is_valid_template(data.urlTemplate)){
			return;
		}
		if(!Array.isArray(data.emotes)){
			return;
		}
		
		
		for(let emote of data.emotes){
			if(emote === null
			|| typeof emote !== "object"){
				continue;
			}
			
			let emote_code = emote.code;
			
			if(typeof emote_code !== "string"
			|| emote_code.length === 0){
				continue;
			}
			if(typeof emote.id !== "string"
			|| emote.id.length === 0){
				continue;
			}
			
			
			emote_codes.push(emote_code);
			
			bttv.code_to_data[emote_code] = {
				url: get_url_from_template(
					data.urlTemplate,
					emote.id
				),
				is_global: is_global
			};
		}
	};
	
	
	//  Loading  //
	
	let [
		global_data,
		channel_data
	] = await Promise.all([
		get_global_bttv_emotes(),
		get_channel_bttv_emotes()
	]);
	
	
	//  Processing  //
	
	let emote_codes = [];
	
	process_response_data(global_data, true);
	process_response_data(channel_data, false);
	
	
	//  Creating Regular Expression  //
	
	//If there are no BTTV emotes cancel creating a regular expression for it.
	if(emote_codes.length === 0){
		return;
	}
	
	
	let regex_string = (
		"( |^)(" +
		
		get_emote_code_regex_string(emote_codes) +
		
		")(?: |$)"
	);
	
	bttv.emotes_regex = new RegExp(regex_string, "g");
};
