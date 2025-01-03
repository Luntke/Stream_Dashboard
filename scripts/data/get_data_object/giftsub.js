"use strict";
//
//    Data Object Giftsub
//
//Creates a giftsub data object.
//

data.object_creation_functions["giftsub"] = function(details){
	let object = {};
	
	object.time = details.time;
	object.type = details.type;
	object.payer = details.payer;
	object.receiver = details.receiver;
	object.gifted_month_count = details.gifted_month_count;
	
	return object;
};
