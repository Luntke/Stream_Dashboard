"use strict";
//
//    Data Object Communitygift
//
//Creates a communitygift data object.
//

data.object_creation_functions["communitygift"] = function(details){
	let object = {};
	
	object.time = details.time;
	object.type = details.type;
	object.payer = details.payer;
	object.gift_count = details.gift_count;
	object.tier = details.tier;
	
	//  Node  //
	
	//<div class="communitygift">
	//    <div class="communitygift_top_bar">
	//        <div class="communitygift_gift_count">[number] Community Gifts</div>
	//        <div class="communitygift_time">[displayed time]</div>
	//    </div>
	//    <div class="communitygift_content">[user name]</div>
	//</div>
	
	let communitygift_node = document.createElement("div");
	communitygift_node.className = "communitygift";
	
	
	let communitygift_top_bar_node = document.createElement("div");
	communitygift_top_bar_node.className = "communitygift_top_bar";
	
	let communitygift_gift_count_node = document.createElement("div");
	communitygift_gift_count_node.className = "communitygift_gift_count";
	communitygift_gift_count_node.innerText = (get_decimal_formatted_number(object.gift_count) + " Community Gift");
	if(object.gift_count !== 1){
		communitygift_gift_count_node.innerText += "s";
	}
	if(object.tier !== 1){
		communitygift_gift_count_node.innerText += " Tier " + object.tier;
	}
	
	
	let communitygift_time_node = document.createElement("div");
	communitygift_time_node.className = "communitygift_time";
	communitygift_time_node.innerText = get_displayed_time(object.time);
	
	
	let communitygift_content_node = document.createElement("div");
	communitygift_content_node.className = "communitygift_content";
	communitygift_content_node.innerText = object.payer;
	
	//  Appending Nodes  //
	
	communitygift_node.appendChild(communitygift_top_bar_node);
		communitygift_top_bar_node.appendChild(communitygift_gift_count_node);
		communitygift_top_bar_node.appendChild(communitygift_time_node);
	communitygift_node.appendChild(communitygift_content_node);
	
	object.node_normal = communitygift_node;
	
	return object;
};
