"use strict";
//
//    Apply Settings To New Object
//
//Applies all settings to the specified newly created data object.
//

//Cloning nodes does not attach the event listeners of the original node on the
//cloned node. This attaches all necessary event listeners.
let get_cloned_data_object_node = function(original_node){
	let cloned_node = original_node.cloneNode(true);
	readd_tooltip_event_listeners(cloned_node);
	
	return cloned_node;
};

settings.apply_settings_to_new_object = function(data_object){
	data_object.node_important = get_cloned_data_object_node(data_object.node_normal);
	data_object.is_important = data.is_important(data_object);
	
	settings.set_display_styles(data_object, settings.values["data_shown_once"]);
	
	
	if(data_object.type !== "cheer"){
		return;
	}
	
	if(data_object.amount < settings.values["minimum_bits"]){
		data_object.is_below_minimum = true;
		data_object.node_normal.setAttribute("data-below-minimum", "1");
	} else {
		data_object.is_below_minimum = false;
		data_object.node_normal.setAttribute("data-below-minimum", "0");
	}
};
