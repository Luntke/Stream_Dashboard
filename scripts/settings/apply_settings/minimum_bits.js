"use strict";
//
//    Minimum Bits
//
//Applies the setting "minimum_bits" to all data objects.
//

settings.apply_minimum_bits = function(new_value){
	for(let data_object of data.displayed_data){
		if(data_object.amount < new_value){
			data_object.is_below_minimum = true;
			data_object.node_normal.setAttribute("data-below-minimum", "1");
		} else {
			data_object.is_below_minimum = false;
			data_object.node_normal.setAttribute("data-below-minimum", "0");
		}
	}
};
