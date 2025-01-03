"use strict";
//
//    Apply Settings To Restore Objects
//
//Applies the "minimum_bits" setting to all data objects of the specified
//stream. Other settings have no effect on restored stream data.
//

settings.apply_settings_to_restore_objects = function(window_type, new_value){
	let data_objects = restore.restored_data_objects[window_type];
	
	for(let data_object of data_objects){
		if(data_object.type !== "cheer"){
			continue;
		}
		
		if(data_object.amount < new_value){
			data_object.node_normal.setAttribute("data-below-minimum", "1");
		} else {
			data_object.node_normal.setAttribute("data-below-minimum", "0");
		}
	}
};
