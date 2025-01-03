"use strict";
//
//    Formatting Message
//
//Formats the message text of a cheer, such that:
//    - Emotes are shown as images
//    - Links are clickable
//    - Cheermotes are shown as images with the cheer amount being colored
//

let cheering = {};


//  Variables  //

//Prefix used for properties in the cheering.cheermotes object.
cheering.cheermotes_prefix = "cheer_";

//Data is set after fetching it from Twitch.
cheering.cheermotes = {
	//[prefix] + [lowercase name] : {
	//    name: [cheermote name]
	//    tiers: [
	//        {color: [...], min_bits [...], image_url [...]}
	//        ...
	//    ]
	//}
};

//Regex is created after fetching data from Twitch.
cheering.cheermotes_regex = null;

//Matches hyperlinks. A hyperlink has to start with "http://" or "https://" and
//end with a whitespace character or go on until the end of the string. It does
//not have to start with a whitespace character or start at the first character
//of the string, as some people leave away a space character before the link by
//accident. Some people append a punctuation character to the end of a link. We
//don't want that to be part of the link, although such a character can be part
//of the actual link.
cheering.hyperlink_regex = /(https?:\/\/.+?)([\.,;\?!\'\"\(\)\[\]\{\}]*?(?:\s|$))/g;


//  Functions  //

cheering.get_cheer_tier = function(amount){
	if(amount < 100){
		return 1;
	}
	if(amount < 1000){
		return 2;
	}
	if(amount < 5000){
		return 3;
	}
	if(amount < 10000){
		return 4;
	}
	return 5;
};

//A cheer chat message can contain several cheermotes that add up to the total
//cheering amount of that message. A cheermote is written as the lowercase
//cheermote name plus the amount as a number. This function returns the cheer
//amount of a single cheermote given the number as a string. As the cheermote
//amount is somehow allowed to start with a 0, if the user writes it out as
//such, this function also ignores the leading zeroes. Some browsers falsely
//interpret a number with a leading zero as base 8, which could lead to
//incorrect parsing of a cheermote like "cheer0100" as being of value 64.
cheering.get_fixed_cheer_amount = function(string){
	let index = 0;
	
	while(string.charAt(index) === "0"){
		index++;
	}
	
	return Number(string.substring(index));
};

//Takes an emote ID and returns the URL to load it as an image.
//URL: https://static-cdn.jtvnw.net/emoticons/v1/[emote ID]/[scale]
cheering.get_emote_url = function(emote_id){
	return ("https://static-cdn.jtvnw.net/emoticons/v1/" + emote_id + "/1.0");
};

//Takes the message, "emotes" tag and "bits" tag values and returns the message
//as a formatted node.
cheering.get_formatted_message = function(message, emotes, cheer_amount, object){
	return cheering.format_message(
		message,
		cheering.parse_message(
			message,
			emotes,
			cheer_amount,
			object
		)
	);
};

//Parses a message and returns an array of objects describing what and how to
//format the message.
cheering.parse_message = function(message, emotes, cheer_amount, object){
	//An array of all objects describing what and how to format parts of the
	//message. Before it is returned it is sorted by the start value. Start and
	//end values are both inclusive and won't overlap with another object.
	//
	//Each element is an object with the following properties: {
	//    "start"
	//    "end"
	//    "type"
	//    ...[type specific properties]
	//}
	let formatting_objects = [];
	
	//The message is required in lower case to parse cheermotes.
	let lower_case_message = message.toLowerCase();
	
	
	//  Emotes  //
	
	//Parses the "emotes" tag and adds found emotes to the formatting objects.
	//Example emotes value:
	//    "1279975:0-9/1279921:11-23,36-48,50-62/1279994:25-34"
	
	if(emotes.length > 0){
		let positions_per_emote = emotes.split("/");
		
		//Parses each emote part for emote ID and positions.
		for(let emote of positions_per_emote){
			let index = emote.indexOf(":");
			let emote_id = emote.substring(0, index);
			let position_ranges = emote.substring(index + 1).split(",");
			let emote_url = cheering.get_emote_url(emote_id);
			
			for(let range of position_ranges){
				let [start, end] = range.split("-");
				
				formatting_objects.push({
					start: Number(start),
					end: Number(end),
					type: "emote",
					
					image_url: emote_url
				});
			}
		}
	}
	
	
	//  Cheers  //
	
	if(cheer_amount > 0){
		cheering.cheermotes_regex.lastIndex = 0;
		let cheermote_data;
		//Because a cheer message can contain cheermotes beyond what was
		//actually cheered this keeps track of the found cheer amount. If, for
		//some reason, someone seems to have more bits in their cheermotes than
		//they cheered we will not display cheermotes.
		let found_cheer_total = 0;
		
		while((cheermote_data = cheering.cheermotes_regex.exec(lower_case_message))){
			let amount = cheering.get_fixed_cheer_amount(cheermote_data[3]);
			found_cheer_total += amount;
			let name = cheermote_data[2];
			
			formatting_objects.push({
				start: (cheermote_data.index + cheermote_data[1].length),
				end: (cheermote_data.index + cheermote_data[1].length + cheermote_data[2].length + cheermote_data[3].length - 1),
				type: "cheermote",
				
				name: name,
				amount: amount
			});
			
			//Reusing the last whitespace character for the next cheermote.
			cheering.cheermotes_regex.lastIndex -= 1;
		}
		
		//[debug_start]
		if(found_cheer_total !== cheer_amount){
			console.log("The cheer amount of this messages does not match with what we parsed:", {
				message: lower_case_message
			});
		}
		//[debug_end]
	}
	
	
	//  Special Promotion Cheer  //
	
	//Promotion cheermotes add a variable amount of extra value to the message.
	//How much can be parsed from the "bonus" cheermote.
	
	if(cheer_amount > 0){
		let promotion_regex = new RegExp("( |^)((?:bonus))0*([1-9][0-9]*)(?: |$)");
		let cheermote_data = promotion_regex.exec(lower_case_message);
		
		if(cheermote_data !== null){
			let amount = cheering.get_fixed_cheer_amount(cheermote_data[3]);
			let name = cheermote_data[2];
			
			formatting_objects.push({
				start: (cheermote_data.index + cheermote_data[1].length),
				end: (cheermote_data.index + cheermote_data[1].length + cheermote_data[2].length + cheermote_data[3].length - 1),
				type: "cheermote",
				
				name: name,
				amount: amount
			});
			
			//Increase the actual cheer amount, because the bonus is not
			//included in the tag.
			object.amount += amount;
		}
	}
	
	
	//  Hyperlinks  //
	
	if(message.includes("http")){
		cheering.hyperlink_regex.lastIndex = 0;
		let link_data;
		
		while((link_data = cheering.hyperlink_regex.exec(message))){
			formatting_objects.push({
				start: link_data.index,
				end: (link_data.index + link_data[1].length - 1),
				type: "hyperlink",
				
				url: link_data[1]
			});
		}
	}
	
	
	//  BTTV Emotes  //
	
	let has_bttv_emotes = false;
	
	if(bttv.emotes_regex !== null){
		bttv.emotes_regex.lastIndex = 0;
		let emote_data;
		
		while((emote_data = bttv.emotes_regex.exec(message))){
			has_bttv_emotes = true;
			let emote_code = emote_data[2];
			
			formatting_objects.push({
				start: (emote_data.index + emote_data[1].length),
				end: (emote_data.index + emote_data[1].length + emote_data[2].length - 1),
				type: "bttv_emote",
				
				code: emote_code,
				overlap: false
			});
			
			//Reusing the last whitespace character for the next BTTV emote.
			bttv.emotes_regex.lastIndex -= 1;
		}
	}
	
	
	//  FFZ Emotes  //
	
	if(ffz.emotes_regex !== null){
		ffz.emotes_regex.lastIndex = 0;
		let emote_data;
		
		while((emote_data = ffz.emotes_regex.exec(message))){
			let emote_code = emote_data[2];
			
			formatting_objects.push({
				start: (emote_data.index + emote_data[1].length),
				end: (emote_data.index + emote_data[1].length + emote_data[2].length - 1),
				type: "ffz_emote",
				
				code: emote_code
			});
			
			//Reusing the last whitespace character for the next FFZ emote.
			ffz.emotes_regex.lastIndex -= 1;
		}
	}
	
	
	//  Twitter Emoji  //
	
	formatting_objects.push(
		...get_emojis(message)
	);
	
	
	
	//  Remove Overlapping Formatting  //
	
	if(formatting_objects.length > 0){
		//Sort the objects by their starting position.
		formatting_objects.sort(function(a, b){
			return (a.start - b.start);
		});
		
		
		let previous_end_index = formatting_objects[0].end;
		
		for(let i = 1;i < formatting_objects.length;i += 1){
			if(formatting_objects[i].start <= previous_end_index){
				formatting_objects.splice(i, 1);
				i -= 1;
				continue;
			}
			
			previous_end_index = formatting_objects[i].end;
		}
	}
	
	
	//  Mark BTTV Overlap Emotes  //
	
	if(has_bttv_emotes === true){
		for(let i = 1;i < formatting_objects.length;i += 1){
			let current = formatting_objects[i];
			
			if(current.type === "bttv_emote"
			&& bttv.overlap_emotes.includes(current.code)){
				let previous = formatting_objects[i - 1];
				
				if(previous.type === "cheermote"
				|| previous.type === "hyperlink"){
					continue;
				}
				if(current.code === "IceCube"
				&& previous.code === "IceCube"){
					current.overlap = null;
					continue;
				}
				if(current.code === "SoSnowy"
				&& previous.code === "SoSnowy"){
					current.overlap = null;
					continue;
				}
				
				current.overlap = true;
			}
		}
	}
	
	
	//  Return  //
	
	return formatting_objects;
};

//Takes the message and corresponding formatting objects and returns the message
//as a formatted node.
cheering.format_message = (function(){
	//  Functions  //
	
	let add_text = function(end_index){
		let span = document.createElement("span");
		span.innerText = message.substring(index, end_index);
		
		container.appendChild(span);
	};
	
	let add_object = function(object){
		if(object_creation_functions.hasOwnProperty(object.type)){
			object_creation_functions[object.type](object);
		}
	};
	
	let object_creation_functions = {};
	
	object_creation_functions["emote"] = function(object){
		let img_parent = document.createElement("div");
		img_parent.className = "cheer_image_parent";
		let img = get_img_node();
		
		let emote_name = message.substring(object.start, (object.end + 1));
		img.alt = emote_name;
		img.src = object.image_url;
		set_tooltip(img, emote_name);
		
		img_parent.appendChild(img);
		container.appendChild(img_parent);
	};
	
	object_creation_functions["cheermote"] = function(object){
		let parent = document.createElement("span");
		parent.className = "cheermote";
		
		let cheermote = cheering.cheermotes[cheering.cheermotes_prefix + object.name];
		
		let tier = cheermote.tiers.length - 1;
		
		for(let i = 1;i < cheermote.tiers.length;i += 1){
			if(object.amount < cheermote.tiers[i].min_bits){
				tier = i - 1;
				break;
			}
		}
		
		//  Image  //
		
		let img_parent = document.createElement("div");
		img_parent.className = "cheer_image_parent";
		let img = get_img_node();
		//The space at the end prevents copying a cheer message from being a
		//cheer when pasted and send in a Twitch chat. This is the same way that
		//Twitch does it. Instead of copying "Cheer100 hey" it results in the
		//text "Cheer 100 hey".
		img.alt = cheermote.name + " ";
		img.src = cheermote.tiers[tier].image_url;
		set_tooltip(img, cheermote.name);
		
		//  Text  //
		
		let span = document.createElement("span");
		span.className = "cheermote_text";
		span.innerText = object.amount;
		span.style.color = cheermote.tiers[tier].color;
		
		//  Append  //
		
		img_parent.appendChild(img);
		parent.appendChild(img_parent);
		parent.appendChild(span);
		container.appendChild(parent);
	};
	
	object_creation_functions["hyperlink"] = function(object){
		let parent = document.createElement("span");
		let a = get_link_node({
			href: object.url,
			text: object.url
		});
		
		parent.appendChild(a);
		container.appendChild(parent);
	};
	
	object_creation_functions["bttv_emote"] = function(object){
		let img_parent = document.createElement("div");
		img_parent.className = "cheer_image_parent";
		let img = get_img_node();
		
		let emote_name = object.code;
		let data = bttv.code_to_data[emote_name];
		let tooltip_title;
		
		if(data.is_global === true){
			tooltip_title = (
				emote_name + "\n" +
				"BTTV Global Emote"
			);
		} else {
			tooltip_title = (
				emote_name + "\n" +
				"BTTV Channel Emote"
			);
		}
		
		img.alt = emote_name;
		img.src = data.url;
		set_tooltip(img, tooltip_title);
		
		if(object.overlap === true){
			img_parent.classList.add("bttv_overlap_" + object.code);
			
			if(bttv.large_emotes.includes(object.code)){
				//Overlap emotes get higher resolution.
				img.src = data.url.replace("/1x", "/2x");
			}
		} else if(object.overlap === null){
			img_parent.classList.add("bttv_hide");
		}
		
		img_parent.appendChild(img);
		container.appendChild(img_parent);
	};
	
	object_creation_functions["ffz_emote"] = function(object){
		let img_parent = document.createElement("div");
		img_parent.className = "cheer_image_parent";
		let img = get_img_node();
		
		let emote_name = object.code;
		let data = ffz.code_to_data[emote_name];
		let tooltip_title;
		
		if(data.is_global === true){
			tooltip_title = (
				emote_name + "\n" +
				"FFZ Global Emote"
			);
		} else {
			tooltip_title = (
				emote_name + "\n" +
				"FFZ Channel Emote"
			);
		}
		
		img.alt = emote_name;
		img.src = data.url;
		set_tooltip(img, tooltip_title);
		
		img_parent.appendChild(img);
		container.appendChild(img_parent);
	};
	
	object_creation_functions["emoji"] = function(object){
		let img_parent = document.createElement("div");
		img_parent.classList.add(
			"cheer_image_parent",
			"twitter_emoji"
		);
		let img = get_img_node();
		
		let tooltip_title = (
			`Twitter Emoji of ${object.alt}`
		);
		
		img.alt = object.alt;
		img.src = `https://twemoji.maxcdn.com/v/13.0.1/72x72/${object.icon}.png`;
		set_tooltip(
			img,
			`Twitter Emoji of ${object.alt}`
		);
		
		img_parent.appendChild(img);
		container.appendChild(img_parent);
	};
	
	
	//  Shared Variables  //
	
	//Non-inclusive index in the message up until which we have processed the
	//message. Used to split the message between text and formatting object.
	let index;
	let message;
	let formatting_objects;
	let container;
	
	
	//  Return  //
	
	return function(_message, _formatting_objects){
		//  Share Variables  //
		
		index = 0;
		message = _message;
		formatting_objects = _formatting_objects;
		container = document.createElement("div");
		
		//  Process Message  //
		
		for(let object of formatting_objects){
			if(object.start !== index){
				add_text(object.start);
			}
			
			add_object(object);
			
			index = object.end + 1;
		}
		
		if(index <= (message.length - 1)){
			add_text(message.length);
		}
		
		//  Return  //
		
		let _container = container;
		index = undefined;
		message = undefined;
		formatting_objects = undefined;
		container = undefined;
		
		return _container;
	};
})();
