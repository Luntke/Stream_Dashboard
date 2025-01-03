"use strict";
//
//    Statistics Add
//
//Adds data to the statistics.
//

statistics.add = (function(){
	//  Variables  //
	
	let adding_functions = {};
	
	//  Functions  //
	
	adding_functions["cheer"] = function(data_object){
		statistics.data.cheer_count += 1;
		statistics.data.total_bits += data_object.amount;
		
		if(statistics.window_content_node !== null){
			let cheer_count_node = statistics.window_content_node.querySelector(".cheer_count_number");
			
			if(cheer_count_node !== null){
				cheer_count_node.innerText = statistics.data.cheer_count;
			}
			
			let total_bits_node = statistics.window_content_node.querySelector(".total_bits_number");
			
			if(total_bits_node !== null){
				total_bits_node.innerText = get_bits_to_dollars(statistics.data.total_bits);
			}
		}
	};
	
	adding_functions["subscription"] = function(data_object){
		statistics.data.subscriptions += 1;
		
		if(statistics.window_content_node !== null){
			let subscriptions_node = statistics.window_content_node.querySelector(".subscription_number");
			
			if(subscriptions_node !== null){
				subscriptions_node.innerText = statistics.data.subscriptions;
			}
		}
	};
	
	adding_functions["giftsub"] = function(data_object){
		statistics.data.giftsubs += data_object.gifted_month_count;
		
		if(statistics.window_content_node !== null){
			let giftsubs_node = statistics.window_content_node.querySelector(".giftsubs_number");
			
			if(giftsubs_node !== null){
				giftsubs_node.innerText = statistics.data.giftsubs;
			}
		}
	};
	
	//  Return  //
	
	return function(data_object){
		if(adding_functions.hasOwnProperty(data_object.type)
		&& typeof adding_functions[data_object.type] === "function"){
			adding_functions[data_object.type](data_object);
		}
	};
})();
