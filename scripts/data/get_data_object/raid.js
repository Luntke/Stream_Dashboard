"use strict";
//
//    Data Object Raid
//
//Creates a raid data object.
//

data.object_creation_functions["raid"] = function(details){
	let object = {};
	
	object.time = details.time;
	object.type = details.type;
	object.raider = details.raider;
	object.viewer_count = details.viewer_count;
	
	//  Node  //
	
	//<div class="raid">
	//	<div class="raid_top_bar">
	//		<div class="raid_viewer_count">[number] Raid Viewer(s)</div>
	//		<div class="raid_time">[displayed time]</div>
	//	</div>
	//	<div class="raid_content">[user name]</div>
	//</div>
	
	let raid_node = document.createElement("div");
	raid_node.className = "raid";
	
	
	let raid_top_bar_node = document.createElement("div");
	raid_top_bar_node.className = "raid_top_bar";
	
	let raid_viewer_count_node = document.createElement("div");
	raid_viewer_count_node.className = "raid_viewer_count";
	raid_viewer_count_node.innerText = (get_decimal_formatted_number(object.viewer_count) + " Raid Viewer");
	if(object.viewer_count !== 1){
		raid_viewer_count_node.innerText += "s";
	}
	
	
	let raid_time_node = document.createElement("div");
	raid_time_node.className = "raid_time";
	raid_time_node.innerText = get_displayed_time(object.time);
	
	
	let raid_content_node = document.createElement("div");
	raid_content_node.className = "raid_content";
	raid_content_node.innerText = object.raider;
	
	//  Appending Nodes  //
	
	raid_node.appendChild(raid_top_bar_node);
		raid_top_bar_node.appendChild(raid_viewer_count_node);
		raid_top_bar_node.appendChild(raid_time_node);
	raid_node.appendChild(raid_content_node);
	
	object.node_normal = raid_node;
	
	return object;
};
