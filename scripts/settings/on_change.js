"use strict";
//
//    On Change
//
//Handles applying changes to the settings.
//

settings.on_change = function(){
	let new_data = settings.get_form_data();
	
	let new_settings = {
		minimum_bits: new_data["minimum_bits"],
		minimum_bits_shown: new_data["minimum_bits_shown"],
		data_shown_once: new_data["data_shown_once"],
		important: {
			communitygifts: new_data["important_communitygifts"],
			raid_viewer_count: new_data["important_raid_viewer_count"],
			bits: new_data["important_bits"]
		}
	};
	
	
	if(new_data["minimum_bits"] !== settings.values["minimum_bits"]){
		settings.apply_minimum_bits(new_data["minimum_bits"]);
		
		for(let window_type in restore.restored_data_objects){
			settings.apply_settings_to_restore_objects(window_type, new_data["minimum_bits"]);
		}
	}
	
	if(new_data["minimum_bits_shown"] !== settings.values["minimum_bits_shown"]){
		settings.apply_minimum_bits_shown(new_data["minimum_bits_shown"]);
	}
	
	if(new_data["important_communitygifts"] !== settings.values.important["important_communitygifts"]
	|| new_data["important_raid_viewer_count"] !== settings.values.important["important_raid_viewer_count"]
	|| new_data["important_bits"] !== settings.values.important["important_bits"]
	){
		settings.values = new_settings;
		settings.apply_important();
		settings.apply_data_shown_once(new_data["data_shown_once"]);
	} else if(new_data["data_shown_once"] !== settings.values["data_shown_once"]){
		settings.values = new_settings;
		settings.apply_data_shown_once(new_data["data_shown_once"]);
	} else {
		settings.values = new_settings;
	}
	
	//  Finish  //
	
	storage.set("settings", settings.values);
};
