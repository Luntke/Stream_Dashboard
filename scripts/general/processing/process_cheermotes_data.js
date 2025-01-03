"use strict";
//
//    Process Cheermotes Data
//
//Processes cheermotes data and puts it in use in formatting cheer messages.
//

let process_cheermotes_data = function(data){
	let lowercase_names = [];
	
	
	//  Creating Cheermote Objects  //
	
	for(let cheermote of data){
		//  Choose Used Image  //
		
		let background_type = "dark";
		if(!cheermote.backgrounds.includes(background_type)){
			background_type = cheermote.backgrounds[0];
		}
		
		let state = "static";
		if(!cheermote.states.includes(state)){
			state = cheermote.states[0];
		}
		
		let scale = "1";
		if(!cheermote.scales.includes(scale)){
			scale = cheermote.scales[0];
		}
		
		//  Creating Object  //
		
		let object = {};
		object.name = cheermote.prefix;
		let lowercase_name = object.name.toLowerCase();
		lowercase_names.push(lowercase_name);
		
		object.tiers = [];
		
		for(let tier_type of cheermote.tiers){
			object.tiers.push({
				color: tier_type.color,
				min_bits: tier_type.min_bits,
				image_url: tier_type.images[background_type][state][scale]
			});
		}
		
		cheering.cheermotes[cheering.cheermotes_prefix + lowercase_name] = object;
	}
	
	
	//  Special Promotion Cheer  //
	
	//Adding the special promotion cheers which are not included in the API. The
	//"bonus" cheermote should not be added to the regex, as it behaves
	//differently than any other cheermote and doesn't affect the "bits" tag,
	//but the actual cheer value.
	
	lowercase_names.push("bleedpurple");
	lowercase_names.push("subway");
	lowercase_names.push("terminator");
	lowercase_names.push("hunterscheer");
	//Not adding "bonus", see above.
	
	let colors = ["#979797", "#9c3ee8", "#1db2a5", "#0099fe", "#f43021"];
	let tiers =  [        1,       100,      1000,      5000,     10000];
	let special_cheermotes = [
		"BleedPurple",
		"Subway",
		"Terminator",
		"HuntersCheer",
		"bonus"
	];
	
	for(let sponsored_action of special_cheermotes){
		let action = sponsored_action.toLowerCase();
		let name = sponsored_action;
		
		let tier_array = [];
		
		for(let i = 0;i < tiers.length;i += 1){
			let color = colors[i];
			let tier = tiers[i];
			
			tier_array.push({
				color: color,
				min_bits: tier,
				image_url: `https://d3aqoihi2n8ty8.cloudfront.net/sponsored-actions/${action}/dark/static/${tier}/1.png`
			});
		}
		
		cheering.cheermotes[cheering.cheermotes_prefix + action] = {
			"name": name,
			"tiers": tier_array
		};
	}
	
	
	//  Creating Cheermotes Regular Expression  //
	
	let regex_string = (
		"( |^)(" +
		
		get_emote_code_regex_string(lowercase_names) +
		
		")(\\d+)(?: |$)"
	);
	
	cheering.cheermotes_regex = new RegExp(regex_string, "g");
};
