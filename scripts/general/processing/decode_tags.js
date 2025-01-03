"use strict";
//
//    Decode Tags
//
//Takes an IRC line and writes the decoded data as an object from the "raw_tags"
//property to the "tags" property.
//

let decode_tags;

(function(){
	//  Character Encoding  //
	
	let escape_value_to_character = {
		"\\:": ";",
		"\\s": " ",
		"\\\\": "\\",
		"\\r": "\r",
		"\\n": "\n",
	};
	
	let decode_regex = /\\(?::|s|\\|r|n)/g;
	
	let decode_characters = function(string){
		return string.replace(decode_regex, function(character){
			return escape_value_to_character[character];
		});
	};
	
	//  Calculate Tags  //
	
	decode_tags = function(irc_line){
		if(typeof irc_line.tags === "object"){
			return;
		}
		
		let raw = irc_line.raw_tags.substring(1);
		
		irc_line.tags = {};
		
		let split = raw.split(";");
		let index;
		let tag_name;
		let tag_value;
		
		for(let tag_part of split){
			//The first equal sign separates the tag name from the tag value.
			//Because the equal sign is not escaped further appearances are part
			//of the tag value.
			index = tag_part.indexOf("=");
			
			if(index >= 0){
				tag_name = decode_characters(tag_part.substring(0, index));
				tag_value = decode_characters(tag_part.substring(index + 1));
				
				irc_line.tags[tag_name] = tag_value;
			}
		}
	};
	
})();
