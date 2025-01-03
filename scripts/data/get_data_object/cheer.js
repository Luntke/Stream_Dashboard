"use strict";
//
//    Data Object Cheer
//
//Creates a cheer data object.
//

data.object_creation_functions["cheer"] = function(details){
	let object = {};
	
	object.time = details.time;
	object.type = details.type;
	object.user = details.user;
	object.amount = details.amount;
	object.emotes = details.emotes;
	object.message = details.message;
	
	//  Node  //
	
	//<div class="cheer cheer_tier_[tier]">
	//    <div class="cheer_top_bar">
	//        <div class="cheer_amount">[amount in US dollars]</div>
	//        <div class="cheer_time">[displayed time]</div>
	//    </div>
	//    <div class="cheer_user_name_container">
	//        <div class="cheer_user_name">[user name]</div>
	//    </div>
	//    <div class="cheer_content">[message]</div>
	//</div>
	
	//Has to be first in case the special promotion cheer is used which changes
	//the cheer amount, as the actual amount isn't given in the "bits" tag.
	let cheer_content_node = cheering.get_formatted_message(object.message, object.emotes, object.amount, object);
	cheer_content_node.className = "cheer_content";
	
	
	let cheer_node = document.createElement("div");
	cheer_node.className = "cheer cheer_tier_" + cheering.get_cheer_tier(object.amount);
	
	
	let cheer_top_bar_node = document.createElement("div");
	cheer_top_bar_node.className = "cheer_top_bar";
	
	let cheer_amount_node = document.createElement("div");
	cheer_amount_node.className = "cheer_amount";
	cheer_amount_node.innerText = (get_bits_to_dollars(object.amount) + " ");
	
	let cheer_time_node = document.createElement("div");
	cheer_time_node.className = "cheer_time";
	cheer_time_node.innerText = (get_displayed_time(object.time) + " ");
	
	
	let cheer_user_name_container_node = document.createElement("div");
	cheer_user_name_container_node.className = "cheer_user_name_container";
	
	let cheer_user_name_node = document.createElement("div");
	cheer_user_name_node.className = "cheer_user_name";
	cheer_user_name_node.innerText = (object.user + " ");
	
	
	//  Appending Nodes  //
	
	cheer_node.appendChild(cheer_top_bar_node);
		cheer_top_bar_node.appendChild(cheer_amount_node);
		cheer_top_bar_node.appendChild(cheer_user_name_container_node);
			cheer_user_name_container_node.appendChild(cheer_user_name_node);
		cheer_top_bar_node.appendChild(cheer_time_node);
	cheer_node.appendChild(cheer_content_node);
	
	object.node_normal = cheer_node;
	
	return object;
};
