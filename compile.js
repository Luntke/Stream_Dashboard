"use strict";
//
//    Compile
//
//Compiles the files into a single JavaScript and CSS file, which will have to
//be minified. See "./minifying.txt" for information about how to do that. The
//files will be saved under "../scripts_v[version].js" and
//"../styles_v[version].css". If those files and their ".min" variants already
//exist this will throw an error, as an unchanged version may cause cache
//related issues.
//


//  Variables  //

let version = 165;

//The order of some of these JavaScript files relative to others matters.
let script_files = [
"./scripts/general/processing/decode_recovery_data.js",
"./scripts/general/processing/decode_tags.js",
"./scripts/general/processing/emotes_unicode_fix.js",
"./scripts/general/processing/formatting_message.js",
"./scripts/general/processing/get_emojis.js",
"./scripts/general/processing/load_bttv_emotes.js",
"./scripts/general/processing/load_ffz_emotes.js",
"./scripts/general/processing/process_cheermotes_data.js",
"./scripts/general/processing/process_streams_data.js",
"./scripts/general/base64.js",
"./scripts/general/functions.js",
"./scripts/general/get_emote_code_regex_string.js",
"./scripts/general/loading_screen.js",
"./scripts/general/resume_scroll.js",
"./scripts/general/savey.js",
"./scripts/general/storage.js",
"./scripts/general/svg_animations.js",
"./scripts/general/tooltip.js",
"./scripts/general/variables.js",
"./scripts/general/window.js",


"./scripts/chat_connection/bot.js",
"./scripts/chat_connection/functions.js",
"./scripts/chat_connection/irc_commands/JOIN.js",
"./scripts/chat_connection/irc_commands/PRIVMSG.js",
"./scripts/chat_connection/irc_commands/USERNOTICE.js",
"./scripts/chat_connection/data/cheer.js",
"./scripts/chat_connection/data/communitygift.js",
"./scripts/chat_connection/data/giftsub.js",
"./scripts/chat_connection/data/raid.js",
"./scripts/chat_connection/data/subscription.js",

"./scripts/about/window.js",

"./scripts/credits/general.js",
"./scripts/credits/build_credits.js",
"./scripts/credits/canvas_handling.js",
"./scripts/credits/controls.js",
"./scripts/credits/drawing_chunks.js",
"./scripts/credits/drawing_frames.js",
"./scripts/credits/scroll_position.js",
"./scripts/credits/window.js",

"./scripts/data/general.js",
"./scripts/data/add.js",
"./scripts/data/is_important.js",
"./scripts/data/offline_queue.js",
"./scripts/data/get_data_object/cheer.js",
"./scripts/data/get_data_object/communitygift.js",
"./scripts/data/get_data_object/giftsub.js",
"./scripts/data/get_data_object/raid.js",
"./scripts/data/get_data_object/subscription.js",

"./scripts/restore/general.js",
"./scripts/restore/functions.js",
"./scripts/restore/restore_data_window.js",
"./scripts/restore/window.js",

"./scripts/settings/general.js",
"./scripts/settings/apply_settings_to_new_object.js",
"./scripts/settings/apply_settings_to_restore_objects.js",
"./scripts/settings/get_form_data.js",
"./scripts/settings/on_change.js",
"./scripts/settings/window.js",
"./scripts/settings/apply_settings/data_shown_once.js",
"./scripts/settings/apply_settings/important.js",
"./scripts/settings/apply_settings/minimum_bits_shown.js",
"./scripts/settings/apply_settings/minimum_bits.js",

"./scripts/statistics/general.js",
"./scripts/statistics/add.js",
"./scripts/statistics/window.js",

"./scripts/api/get_bttv_emotes.js",
"./scripts/api/get_cheermotes.js",
"./scripts/api/get_ffz_emotes.js",
"./scripts/api/get_recent_streams.js",
"./scripts/api/get_recovery_data.js",


"./scripts/main.js"
];

let style_files = [
"./styles/credits/window.css",
"./styles/data/cheer.css",
"./styles/data/communitygift_and_raid.css",
"./styles/data/containers.css",
"./styles/general/bttv.css",
"./styles/general/layout_detail.css",
"./styles/general/layout_general.css",
"./styles/general/loading_screen.css",
"./styles/general/media.css",
"./styles/general/online_status.css",
"./styles/general/tooltip.css",
"./styles/general/twitter_emoji.css",
"./styles/general/window.css",
"./styles/restore/window.css",
"./styles/statistics/window.css",
"./styles/settings/window.css"
];


//  Compiling Variables  //

const fs = require("fs");

let remove_debug_regex = /\/\/\[debug_start\](.*?)\/\/\[debug_end\]/gs;
let remove_strict_regex = /\"use strict\";/g;

//Takes a script string and returns it with debug code removed and a single
//"use strict"; expression, at the start.
let get_cleaned_up_script = function(text){
	let strict_text = "\"use strict\";\n";
	
	text = text.replace(remove_debug_regex, "");
	
	text = text.replace(remove_strict_regex, "");
	
	return (strict_text + text);
};

let scripts_file_path = ("./scripts_v" + version + ".js");
let scripts_min_file_path = ("./scripts_v" + version + ".min.js");
let styles_file_path = ("./styles_v" + version + ".css");
let styles_min_file_path = ("./styles_v" + version + ".min.css");


//  Check For Existing Files  //

let errors = [];

if(fs.existsSync(scripts_file_path)){
	errors.push("The scripts file version " + version + " is already in use.");
}
if(fs.existsSync(scripts_min_file_path)){
	errors.push("The scripts minified file version " + version + " is already in use.");
}
if(fs.existsSync(styles_file_path)){
	errors.push("The styles file version " + version + " is already in use.");
}
if(fs.existsSync(styles_min_file_path)){
	errors.push("The styles minified file version " + version + " is already in use.");
}

if(errors.length > 0){
	for(let error of errors){
		console.log(error);
	}
	console.log("\nIncrease the version number to fix this issue.");
	
	process.exitCode = 1;
	return;
}


//  Compiling  //

//Scripts

let scripts_text = "";

for(let file_name of script_files){
	scripts_text += fs.readFileSync(file_name, {
		encoding: "utf8"
	});
}

let scripts_cleaned_text = get_cleaned_up_script(scripts_text);

fs.writeFile(scripts_file_path, scripts_cleaned_text, function(error){
	if(error){
		throw error;
	} else {
		console.log("Saved the scripts file.");
	}
});

//Styles

let style_text = "";

for(let file_name of style_files){
	style_text += fs.readFileSync(file_name, {
		encoding: "utf8"
	});
}

fs.writeFile(styles_file_path, style_text, function(error){
	if(error){
		throw error;
	} else {
		console.log("Saved the styles file.");
	}
});

//Empty minified versions

fs.writeFile(scripts_min_file_path, "", function(error){
	if(error){
		throw error;
	} else {
		console.log("Created the empty scripts minified file.");
	}
});

fs.writeFile(styles_min_file_path, "", function(error){
	if(error){
		throw error;
	} else {
		console.log("Created the empty styles minified file.");
	}
});
