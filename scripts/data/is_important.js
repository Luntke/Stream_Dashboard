"use strict";
//
//    Is Important
//
//Returns a boolean indicating if a given data object is important to be shown.
//

data.is_important = (function(){
	//  Functions  //
	
	let check_functions = {};
	
	check_functions["cheer"] = function(data_object){
		if(settings.values.important["bits"] <= data_object.amount){
			return true;
		}
		
		return false;
	};
	
	check_functions["communitygift"] = function(data_object){
		if(settings.values.important["communitygifts"] <= data_object.gift_count){
			return true;
		}
		
		return false;
	};
	
	check_functions["raid"] = function(data_object){
		if(settings.values.important["raid_viewer_count"] <= data_object.viewer_count){
			return true;
		}
		
		return false;
	};
	
	//  Return  //
	
	return function(data_object){
		if(check_functions.hasOwnProperty(data_object.type)){
			return check_functions[data_object.type](data_object);
		}
		
		return undefined;
	};
})();
