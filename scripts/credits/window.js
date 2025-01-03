"use strict";
//
//    Credit Window
//
//Handles opening credit windows.
//

let credit_nodes = {
	timeline: null,
	timeline_canvas: null,
	timeline_context: null,
	play_button: null
};

let credits_sub_data = null;

credits.credits_button_on_click = function(){
	let window_type = this.getAttribute("data-window-type");
	
	if(window_type === null){
		open_credits_window({
			stream_events: data.non_displayed_data,
			stream_object: null
		});
		return;
	}
	
	if(restore.restored_data_objects.hasOwnProperty(window_type)){
		let stream_object = past_streams.find(function(element){
			return (window_type.endsWith("_" + element.start_time));
		});
		
		if(stream_object !== null){
			open_credits_window({
				stream_events: restore.restored_data_objects[window_type],
				stream_object: stream_object
			});
			return;
		}
		
		console.error("Error opening credits");
		return;
	}
	
	console.error("Error opening credits");
};

credits.header_button.onclick = credits.credits_button_on_click;


let open_credits_window = function(details){
	if(credit_nodes.timeline !== null){
		let existing_windows = document.querySelectorAll(".credits_window");
		
		if(existing_windows !== null){
			for(let element of existing_windows){
				windows.close(element.getAttribute("data-window-type"));
			}
		}
		
		close_credits_window();
	}
	
	let stream_events = details.stream_events;
	let stream_object = details.stream_object;
	
	//  Load Subscriber Data  //
	
	let sub_types = [
		"subscription",
		"giftsub"
	];
	
	credits_sub_data = [];
	
	for(let element of stream_events){
		if(sub_types.includes(element.type)){
			credits_sub_data.push(element);
		}
	}
	
	
	//  Create Window  //
	
	let window_type_name;
	
	if(stream_object === null){
		window_type_name = "credits_null";
	} else {
		window_type_name = ("credits_" + stream_object.start_time);
	}
	
	let body_data = document.body.getBoundingClientRect();
	
	let window_object = windows.create(window_type_name, credits.window_create_function, {
		relative_position: {
			x: 0,
			y: body_data.height
		},
		title_close_function: close_credits_window
	});
};

let close_credits_window = function(){
	credits_canvas = null;
	credits_context = null;
	
	credits_are_scrolling = false;
	
	credits_sub_data = null;
	credits_chunk_data.length = 0;
	credits_have_been_build = false;
	credits_canvas_chunks = {};
	credits_canvas_count = 0;
	
	credit_nodes.timeline = null;
	credit_nodes.timeline_canvas = null;
	credit_nodes.timeline_context = null;
	credit_nodes.play_button = null;
	
	scroll_start_time = window.performance.now();
	scroll_start_positon = 0;
};

credits.window_create_function = function(details){
	let window_node = details.window_node;
	let title_node = details.title_node;
	let content_node = details.content_node;
	
	window_node.setAttribute("data-window-type", details.window_type);
	window_node.classList.add("credits_window");
	
	//  Title  //
	
	title_node.innerText = "Credits";
	
	
	//  Content  //
	
	credits_canvas = document.createElement("canvas");
	credits_canvas.classList.add("credits_canvas");
	
	let timeline = document.createElement("input");
	timeline.classList.add("credits_timeline");
	timeline.oninput = credit_timeline_oninput;
	
	let timeline_canvas = document.createElement("canvas");
	timeline_canvas.classList.add("credits_timeline_canvas");
	
	let play_button = document.createElement("div");
	play_button.innerText = "Play";
	play_button.classList.add("credits_play_button");
	play_button.onclick = play_button_onclick;
	
	content_node.appendChild(credits_canvas);
	content_node.appendChild(timeline_canvas);
	content_node.appendChild(timeline);
	content_node.appendChild(play_button);
	
	credit_nodes.timeline = timeline;
	credit_nodes.timeline_canvas = timeline_canvas;
	credit_nodes.timeline_context = timeline_canvas.getContext("2d");
	credit_nodes.play_button = play_button;
	
	//  Handle Credits  //
	
	build_credits();
	
	credits_speed = ((total_scroll_distance / credit_name_height) / credits_default_run_time);
	set_credits_effective_speed();
	
	//Draw first frame.
	draw_credits_frame(scroll_start_positon);
};
