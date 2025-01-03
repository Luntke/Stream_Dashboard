"use strict";
//
//    Important Settings
//
//Applies the settings that define what is and isn't considered important.
//

settings.apply_important = function(){
	for(let data_object of data.displayed_data){
		data_object.is_important = data.is_important(data_object);
	}
};
