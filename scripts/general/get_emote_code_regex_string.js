"use strict";
//
//    Get Emote Code Regex String
//
//Takes an array of emote codes and returns a string which can be used in the
//creation of a regular expression for those emotes. The emote codes have
//regular expression special characters escaped so that they don't trigger
//special meanings. The returned string may look something like this:
//    "(?:jermaOtto)|(?:\(ditto\))|(?:\:tf\:)"
//

let get_emote_code_regex_string = (function(){
	//  Variables  //
	
	//Matches any special character of regular expressions regardless of the
	//context.
	let special_characters = /[\\\.\*\+\?\(\)\{\}\[\]\<\>\$\|\^\=\!\:\,\-]/g;
	
	//  Return  //
	
	return function(emote_codes){
		return emote_codes.map(function(code){
			special_characters.lastIndex = 0;
			
			return (
				"(?:" +
				code.replace(special_characters, "\\$&") +
				")"
			);
		}).join("|");
	};
})();
