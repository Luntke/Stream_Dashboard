"use strict";
//
//    Settings Window
//
//Handles the settings window.
//

settings.get_input_element = function(details){
	let container = document.createElement("div");
	let label = document.createElement("label");
	
	let text = document.createElement("span");
	text.innerText = details.text;
	
	let input = document.createElement("input");
	input.type = "text";
	input.className = "input_number";
	input.value = details.input_value;
	input.setAttribute("data-settings-input", details.name);
	
	label.appendChild(text);
	label.appendChild(input);
	container.appendChild(label);
	
	return container;
};

settings.get_checkbox_element = function(details){
	let label = document.createElement("label");
	let container = document.createElement("div");
	
	let text = document.createElement("span");
	text.innerText = details.text;
	
	let input = document.createElement("input");
	input.type = "checkbox";
	input.className = "input_checkbox";
	input.checked = details.checked;
	input.setAttribute("data-settings-input", details.name);
	
	label.appendChild(text);
	label.appendChild(input);
	container.appendChild(label);
	
	return container;
};

settings.window_create_function = function(details){
	let window_node = details.window_node;
	let title_node = details.title_node;
	let content_node = details.content_node;
	
	window_node.setAttribute("data-window-type", details.window_type);
	
	//  Title  //
	
	title_node.innerText = "Settings";
	
	
	//  General  //
	
	let title_general = document.createElement("div");
	title_general.className = "settings_subtitle";
	title_general.innerText = "General";
	
	let general_container = document.createElement("div");
	general_container.className = "settings_content_container";
	
	content_node.appendChild(title_general);
	content_node.appendChild(general_container);
	
	//Minimum Bits
	general_container.appendChild(settings.get_input_element({
		text: "Minimum bits",
		input_value: settings.values["minimum_bits"],
		name: "minimum_bits"
	}));
	
	//Minimum Bits Shown
	general_container.appendChild(settings.get_checkbox_element({
		text: "Show bits below minimum",
		checked: settings.values["minimum_bits_shown"],
		name: "minimum_bits_shown"
	}));
	
	//Show Data Only Once
	general_container.appendChild(settings.get_checkbox_element({
		text: "Hide important data from right panel",
		checked: settings.values["data_shown_once"],
		name: "data_shown_once"
	}));
	
	
	//  Important  //
	
	let title_important = document.createElement("div");
	title_important.className = "settings_subtitle";
	title_important.innerText = "Important";
	
	let important_container = document.createElement("div");
	important_container.className = "settings_content_container";
	
	content_node.appendChild(title_important);
	content_node.appendChild(important_container);
	
	let important_description = document.createElement("div");
	important_description.innerText = "What events should be considered important enough to be shown in the left panel.";
	important_description.className = "settings_description";
	important_container.appendChild(important_description);
	
	//Bits
	important_container.appendChild(settings.get_input_element({
		text: "Important bits",
		input_value: settings.values.important["bits"],
		name: "important_bits"
	}));
	
	//Communitygifts
	important_container.appendChild(settings.get_input_element({
		text: "Important community gifts",
		input_value: settings.values.important["communitygifts"],
		name: "important_communitygifts"
	}));
	
	//Raid Viewer Count
	important_container.appendChild(settings.get_input_element({
		text: "Important raid viewers",
		input_value: settings.values.important["raid_viewer_count"],
		name: "important_raid_viewer_count"
	}));
	
	
	//[debug_start]
	//let submit_container = document.createElement("div");
	//submit_container.className = "submit_container";
	
	//let submit_button = document.createElement("input");
	//submit_button.type = "button";
	//submit_button.value = "Save";
	//submit_button.onclick = function(){
	//    console.log("you tried to submit something");
	//};
	
	//submit_container.appendChild(submit_button);
	//content_node.appendChild(submit_container);
	//[debug_end]
	
	let submit_container = document.createElement("div");
	submit_container.className = "submit_container";
	submit_container.style.marginBottom = "10px";
	
	let submit_text = document.createElement("span");
	submit_text.innerText = "Close the window to apply changes.";
	
	submit_container.appendChild(submit_text);
	content_node.appendChild(submit_container);
};

settings_svg.onclick = function(event){
	windows.create("settings", settings.window_create_function, {
		relative_position: {
			x: event.clientX,
			y: event.clientY
		},
		title_close_function: settings.on_change
	});
};
