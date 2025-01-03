"use strict";
//
//    Add Data
//
//Handles adding incoming data objects to the page.
//

data.add = function(details, insertion_index=undefined){
	if(data.considered_online !== true){
		data.offline_queue.push(details);
		return;
	}
	
	if(!data.object_creation_functions.hasOwnProperty(details.type)
	|| typeof data.object_creation_functions[details.type] !== "function"){
		return;
	}
	
	if(typeof insertion_index !== "number"){
		insertion_index = undefined;
	}
	
	
	let data_object = data.object_creation_functions[details.type](details);
	
	if(data_object === null){
		return;
	}
	
	data_object.details = details;
	
	//If it is non-displayed data.
	if(!is_object(data_object.node_normal)){
		if(insertion_index === undefined){
			insertion_index = get_insert_index(data_object, data.non_displayed_data);
			
			if(insertion_index < 0){
				return;
			}
		}
		statistics.add(data_object);
		
		data.non_displayed_data.splice(insertion_index, 0, data_object);
		
		return;
	}
	
	if(insertion_index === undefined){
		insertion_index = get_insert_index(data_object, data.displayed_data);
		
		if(insertion_index < 0){
			return;
		}
	}
	statistics.add(data_object);
	
	data.displayed_data.splice(insertion_index, 0, data_object);
	all_infos_node.insertBefore(data_object.node_normal, all_infos_node.firstChild);
	
	settings.apply_settings_to_new_object(data_object);
	important_infos_node.insertBefore(data_object.node_important, important_infos_node.firstChild);
	
	
	//  Add Animation  //
	
	//16 is the marginBottom value in pixel.
	let initial_offset = -(data_object.node_normal.getBoundingClientRect().height + 16);
	
	data_object.node_normal.style.marginTop = initial_offset + "px";
	data_object.node_normal.style.opacity = 0.0;
	data_object.node_important.style.marginTop = initial_offset + "px";
	data_object.node_important.style.opacity = 0.0;
	
	//Force browser reflow calculation.
	data_object.node_normal.offsetWidth;
	
	data_object.node_normal.className += " slide_in";
	data_object.node_important.className += " slide_in";
	data_object.node_normal.style.marginTop = null;
	data_object.node_important.style.marginTop = null;
	data_object.node_normal.style.opacity = null;
	data_object.node_important.style.opacity = null;
	
	if(data_object.is_below_minimum === true){
		data_object.node_normal.setAttribute("data-below-minimum", "1");
		data_object.node_important.setAttribute("data-below-minimum", "1");
	}
};
