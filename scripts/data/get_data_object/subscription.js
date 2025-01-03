"use strict";
//
//    Data Object Subscription
//
//Creates a subscription data object.
//

data.object_creation_functions["subscription"] = function(details){
	let object = {};
	
	object.time = details.time;
	object.type = details.type;
	object.receiver = details.receiver;
	
	return object;
};
