"use strict";
//
//    Get Form Data
//
//Returns the form data of the settings form.
//

settings.get_form_data = function(){
	let window_node = document.querySelector("div[data-window-type='settings']");
	
	if(window_node === null){
		return null;
	}
	
	let data = {};
	
	data["minimum_bits"] = document.querySelector("input[data-settings-input='minimum_bits']").value;
	data["minimum_bits_shown"] = document.querySelector("input[data-settings-input='minimum_bits_shown']").checked;
	data["data_shown_once"] = document.querySelector("input[data-settings-input='data_shown_once']").checked;
	
	data["important_bits"] = document.querySelector("input[data-settings-input='important_bits']").value;
	data["important_communitygifts"] = document.querySelector("input[data-settings-input='important_communitygifts']").value;
	data["important_raid_viewer_count"] = document.querySelector("input[data-settings-input='important_raid_viewer_count']").value;
	
	//Returns the new value string if it is a valiid number above 0, otherwise
	//it returns 0 or the old value.
	let get_number_value = function(new_value, old_value){
		if(new_value.length === 0){
			return old_value;
		}
		
		let number = Number(new_value);
		
		if(number !== number){
			return old_value;
		}
		
		return Math.max(0, number);
	};
	
	data["minimum_bits"] = get_number_value(data["minimum_bits"], settings.values["minimum_bits"]);
	
	data["important_bits"] = get_number_value(data["important_bits"], settings.values.important["bits"]);
	
	data["important_communitygifts"] = get_number_value(data["important_communitygifts"], settings.values.important["communitygifts"]);
	
	data["important_raid_viewer_count"] = get_number_value(data["important_raid_viewer_count"], settings.values.important["raid_viewer_count"]);
	
	if(data["minimum_bits"] > data["important_bits"]){
		data["important_bits"] = data["minimum_bits"];
	}
	
	return data;
};
