"use strict";
//
//    Data Shown Once
//
//Applies the setting "data_shown_once" to all data objects and the panel
//titles.
//

settings.apply_data_shown_once = function(new_value){
	for(let data_object of data.displayed_data){
		settings.set_display_styles(data_object, new_value);
	}
	
	settings.set_panel_titles();
};
