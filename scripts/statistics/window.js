"use strict";
//
//    Settings Window
//
//Handles the settings window.
//

statistics.get_statistic_element = function(details){
	let container = document.createElement("div");
	
	let text = document.createElement("span");
	text.innerText = (details.label + " ");
	
	let number = document.createElement("span");
	number.innerText = details.number;
	number.className = details.class;
	
	//Adds a no break space to the end of a statistic.
	let text_node = document.createTextNode("\u00A0");
	
	container.appendChild(text);
	container.appendChild(number);
	container.appendChild(text_node);
	
	return container;
};

statistics.window_create_function = function(details){
	let window_node = details.window_node;
	let title_node = details.title_node;
	let content_node = details.content_node;
	
	window_node.setAttribute("data-window-type", details.window_type);
	
	let statistics_container = document.createElement("div");
	statistics_container.className = "statistics";
	
	
	//  Title  //
	
	title_node.innerText = "Statistics";
	
	
	//  General  //
	
	//Cheer Count
	statistics_container.appendChild(statistics.get_statistic_element({
		label: "Total Cheers:",
		number: statistics.data.cheer_count,
		class: "cheer_count_number"
	}));
	
	//Subscriptions
	statistics_container.appendChild(statistics.get_statistic_element({
		label: "Subscriptions:",
		number: statistics.data.subscriptions,
		class: "subscription_number"
	}));
	
	//Total Bits
	statistics_container.appendChild(statistics.get_statistic_element({
		label: "Total Bits:",
		number: get_bits_to_dollars(statistics.data.total_bits),
		class: "total_bits_number"
	}));
	
	//Giftsubs
	statistics_container.appendChild(statistics.get_statistic_element({
		label: "Giftsubs:",
		number: statistics.data.giftsubs,
		class: "giftsubs_number"
	}));
	
	content_node.appendChild(statistics_container);
};

statistics.header_button.onclick = function(event){
	let window_object = windows.create("statistics", statistics.window_create_function, {
		relative_position: {
			x: event.clientX,
			y: event.clientY
		},
		title_close_function: function(){
			statistics.is_window_opened = false;
			statistics.window_content_node = null;
		}
	});
	
	if(window_object !== false){
		statistics.is_window_opened = true;
		statistics.window_content_node = window_object.content_node;
	}
};
