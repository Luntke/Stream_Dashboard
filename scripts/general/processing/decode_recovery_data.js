"use strict";
//
//    Decode Recovery Data
//
//Decodes the given recovery data and returns an array with the data objects.
//

let decode_recovery_data = (function(){
	//  Type Decoders  //
	
	let data_type_functions = {};
	
	//Subscription
	data_type_functions["s"] = function(object, data){
		object.type = "subscription";
		object.receiver = data[2];
	};
	
	//Giftsub
	data_type_functions["g"] = function(object, data){
		object.type = "giftsub";
		object.payer = data[2];
		object.receiver = data[3];
		object.gifted_month_count = Number(data[4]);
		
		if(Number.isNaN(data[4])
		|| data[4] < 1
		|| data[4] % 1 !== 0){
			object.gifted_month_count = 1;
		}
	};
	
	//Communitygift
	data_type_functions["c"] = function(object, data){
		object.type = "communitygift";
		object.payer = data[2];
		object.gift_count = Number(data[3]);
		object.tier = Number(data[4]);
	};
	
	//Cheer
	data_type_functions["b"] = function(object, data){
		object.type = "cheer";
		object.user = data[2];
		object.amount = Number(data[3]);
		object.emotes = data[4];
		object.message = decode_base64(data[5]);
	};
	
	//Raid
	data_type_functions["r"] = function(object, data){
		object.type = "raid";
		object.raider = data[2];
		object.viewer_count = Number(data[3]);
	};
	
	//  Return  //
	
	return function(data){
		let decoded_objects = [];
		
		let decoded_array;
		let time_offset = 0;
		
		for(let i = 0;i < data.length;i += 1){
			decoded_array = data[i].split(";");
			
			if(data_type_functions.hasOwnProperty(decoded_array[1])){
				let object = {};
				object.time = Number(decoded_array[0]) + time_offset;
				
				data_type_functions[decoded_array[1]](object, decoded_array);
				
				decoded_objects.push(object);
				time_offset = object.time;
			}
		}
		
		return decoded_objects;
	};
})();
