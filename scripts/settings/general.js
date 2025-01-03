"use strict";
//
//    Settings
//
//Handles the general settings stuff.
//

let settings = {};

settings.values = {};

settings.default = {
	minimum_bits: 250,
	minimum_bits_shown: true,
	data_shown_once: false,
	important: {
		communitygifts: 5,
		raid_viewer_count: 5,
		bits: 5000
	}
};

settings.reset_to_default = function(){
	//Copying properties from one element to another, but creating a new object
	//if a value is an object, as we don't want the used settings share an
	//object with the default settings. We only do this 1 layer deep though.
	for(let property in settings.default){
		if(is_object(settings.default[property])){
			if(!is_object(settings.values[property])){
				settings.values[property] = {};
			}
			
			Object.assign(settings.values[property], settings.default[property]);
		} else {
			settings.values[property] = settings.default[property];
		}
	}
	
	storage.set("settings", settings.values);
};


settings.apply_settings_functions = {};

//Used to apply titles to the two panels depending on the "data_shown_once"
//setting.
settings.panel_titles = {
	true: {
		left: "Important",
		right: "Unimportant"
	},
	false: {
		left: "Important",
		right: "Everything"
	}
};

//Applies the panel titles depending on the "data_shown_once" setting.
settings.set_panel_titles = function(){
	let value = Boolean(settings.values["data_shown_once"]);
	panel_left_headline.innerText = settings.panel_titles[value].left;
	panel_right_headline.innerText = settings.panel_titles[value].right;
};

settings.set_display_styles = function(data_object, shown_once){
	if(shown_once === true){
		if(data_object.is_important === true){
			data_object.node_normal.style.display = "none";
			data_object.node_important.style.display = "block";
		} else {
			data_object.node_normal.style.display = null;
			data_object.node_important.style.display = "none";
		}
	} else {
		if(data_object.is_important === true){
			data_object.node_normal.style.display = null;
			data_object.node_important.style.display = "block";
		} else {
			data_object.node_normal.style.display = null;
			data_object.node_important.style.display = "none";
		}
	}
};

//  Load Settings  //

(function(){
	let storage_settings = storage.get("settings");
	
	if(!is_object(storage_settings)){
		settings.reset_to_default();
	} else {
		settings.values = storage_settings;
		
		if(settings.values.important["raid_viewer_count"] === 0){
			settings.values.important["raid_viewer_count"] = settings.default.important.raid_viewer_count;
		}
	}
})();

settings.set_panel_titles();
