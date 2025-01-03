"use strict";
//
//    Restore Data Window
//
//Handles the windows that display manually restored data from a past stream.
//

//Takes a promise that resolves to the restore data and displays it in the
//created window and a recovery_id that ensures only one window exists per same
//recovery.
restore.create_restore_window = function(data_promise, recovery_id, mouse_position, details){
	let window_exists = Boolean(document.querySelector(".window_title[data-window-type=recovery_id_" + recovery_id + "]"));
	let position;
	
	if(window_exists){
		position = mouse_position;
	} else {
		let scrollbar_width = get_scrollbar_dimensions().width;
		let panel_width = (window.innerWidth / 2);
		
		position = {
			x: ((1 * panel_width) + ((1/2) * (panel_width - scrollbar_width))),
			y: (32 + 92 + ((window.innerHeight - 92 - 778) / 2))
		};
	}
	
	
	let window_object = windows.create("recovery_id_" + recovery_id, restore.window_create_loading_function, {
		relative_position: position,
		title_close_function: restore.on_restore_window_close,
		details: details
	});
	
	if(window_object === false){
		return;
	}
	
	windows.close("restore");
	
	let content_node = window_object.content_node;
	
	data_promise.then(function(raw_data){
		if(raw_data.length > 0){
			sort_data_object_array(raw_data);
			remove_data_object_duplicates(raw_data);
			
			restore.fill_restore_window_data({
				window_object: window_object,
				data: raw_data,
				details: details
			});
		} else {
			let error_text = document.createElement("div");
			error_text.className = "restore_error_text";
			error_text.innerText = "My site does not have data on the stream. I am pretty upset about that :(";
			window_object.content_node.appendChild(error_text);
		}
	})
	.catch(function(error){
		console.error(error);
		
		let error_text = document.createElement("div");
		error_text.className = "restore_error_text";
		error_text.innerText = "There was an error loading the stream event data. Try a second time and it may work.";
		window_object.content_node.appendChild(error_text);
	});
};

restore.window_create_loading_function = function(details){
	let window_node = details.window_node;
	let title_node = details.title_node;
	let content_node = details.content_node;
	
	window_node.setAttribute("data-window-type", details.window_type);
	window_node.classList.add("restored_stream_window");
	restore.restored_data_objects[details.window_type] = [];
	
	//  Title  //
	
	title_node.innerText = "Restored Stream";
	
	
	//  General  //
	
	let container = document.createElement("div");
	container.className = "restore_loading_text";
	container.innerText = "Loading Stream Events...";
	content_node.appendChild(container);
	
	content_node.className += " restore_content";
};

restore.on_restore_window_close = function(details){
	let window_type = details.node.getAttribute("data-window-type");
	
	delete restore.restored_data_objects[window_type];
};

restore.fill_restore_window_data = function(details){
	let content_node = details.window_object.content_node;
	let window_type = details.window_object.window_node.getAttribute("data-window-type");
	
	if(!Array.isArray(restore.restored_data_objects[window_type])){
		restore.restored_data_objects[window_type] = [];
	}
	
	content_node.removeChild(content_node.querySelector(".restore_loading_text"));
	
	//  Restore Description  //
	
	let description_title = document.createElement("div");
	description_title.className = "restore_description_title";
	description_title.innerText = details.details.stream.title;
	
	let description_publish_time = document.createElement("div");
	description_publish_time.className = "restore_description_publish_time";
	description_publish_time.innerText = restore.get_days_ago(details.details.stream.start_time);
	
	let credits_button = document.createElement("div");
	credits_button.className = "credits_button";
	credits_button.innerText = "Credits";
	credits_button.setAttribute("data-window-type", window_type);
	credits_button.onclick = credits.credits_button_on_click;
	
	content_node.appendChild(description_title);
	content_node.appendChild(description_publish_time);
	content_node.appendChild(credits_button);
	
	//  Data Objects  //
	
	let scroll_container = document.createElement("div");
	scroll_container.className = "restore_scroll_container";
	
	let container = document.createElement("div");
	container.className = "data_container recovery_container";
	
	//In some cases the cheer amount given by Twitch is wrong and has to be
	//corrected. This is the amount of what has to be added to the statistics
	//to be correct.
	let bits_difference = 0;
	
	for(let data_object of details.data){
		let new_object = restore.add_data_object(data_object, container);
		
		if(new_object.type === "cheer"){
			bits_difference += (new_object.amount - data_object.amount);
		}
		
		restore.restored_data_objects[window_type].push(new_object);
	}
	
	//  Statistics  //
	
	let subscribers = 0;
	let giftsubs = 0;
	let cheers = 0;
	let total_bits = bits_difference;
	
	for(let data_object of details.data){
		if(data_object.type === "subscription"){
			subscribers += 1;
		} else if(data_object.type === "giftsub"){
			giftsubs += data_object.gifted_month_count;
		} else if(data_object.type === "cheer"){
			cheers += 1;
			total_bits += data_object.amount;
		}
	}
	
	
	let statistics_container = document.createElement("div");
	statistics_container.className = "restore_statistics";
	
	//Cheer Count
	statistics_container.appendChild(statistics.get_statistic_element({
		label: "Total Cheers:",
		number: cheers,
		class: "cheer_count_number"
	}));
	
	//Subscriptions
	statistics_container.appendChild(statistics.get_statistic_element({
		label: "Subscriptions:",
		number: subscribers,
		class: "subscription_number"
	}));
	
	//Total Bits
	statistics_container.appendChild(statistics.get_statistic_element({
		label: "Total Bits:",
		number: get_bits_to_dollars(total_bits),
		class: "total_bits_number"
	}));
	
	//Giftsubs
	statistics_container.appendChild(statistics.get_statistic_element({
		label: "Giftsubs:",
		number: giftsubs,
		class: "giftsubs_number"
	}));
	
	//  Append Nodes  //
	
	content_node.appendChild(statistics_container);
	content_node.appendChild(scroll_container);
	scroll_container.appendChild(container);
	
};

restore.add_data_object = function(details, parent){
	if(!data.object_creation_functions.hasOwnProperty(details.type)
	|| typeof data.object_creation_functions[details.type] !== "function"){
		return;
	}
	
	let data_object = data.object_creation_functions[details.type](details);
	
	if(data_object === null){
		return data_object;
	}
	
	//If it is non displayed data.
	if(!is_object(data_object.node_normal)){
		return data_object;
	}
	
	parent.insertBefore(data_object.node_normal, parent.firstChild);
	
	
	//  Apply Settings  //
	
	data_object.is_below_minimum = false;
	
	if(data_object.type === "cheer"){
		if(data_object.amount < settings.values["minimum_bits"]){
			data_object.is_below_minimum = true;
		} else {
			data_object.node_normal.setAttribute("data-below-minimum", "0");
		}
	}
	
	
	//  Add Animation  //
	
	//16 is the marginBottom value in pixel.
	let initial_offset = -(data_object.node_normal.getBoundingClientRect().height + 16);
	
	data_object.node_normal.style.marginTop = initial_offset + "px";
	data_object.node_normal.style.opacity = 0.0;
	
	//Force browser reflow calculation.
	data_object.node_normal.offsetWidth;
	
	data_object.node_normal.className += " slide_in";
	data_object.node_normal.style.marginTop = null;
	data_object.node_normal.style.opacity = null;
	
	if(data_object.is_below_minimum === true){
		data_object.node_normal.setAttribute("data-below-minimum", "1");
	}
	
	
	return data_object;
};
