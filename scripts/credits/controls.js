"use strict";
//
//    Credit Controls
//
//This handles every element related to the controls of the credits.
//


//  Progress Bar  //

let build_credit_progress_bar = function(){
	credit_nodes.timeline.type = "range";
	credit_nodes.timeline.step = "any";
	credit_nodes.timeline.value = 0;
	credit_nodes.timeline.min = 0;
	credit_nodes.timeline.max = total_scroll_distance;
	
	credit_nodes.timeline_canvas.width = 648;
	credit_nodes.timeline_canvas.height = 27;
	draw_credit_progress_canvas();
};

let update_credit_progress_bar = function(new_position){
	credit_nodes.timeline.value = new_position;
	draw_credit_progress_canvas();
};

let draw_credit_progress_canvas = function(){
	let context = credit_nodes.timeline_context;
	let new_position = credit_nodes.timeline.value;
	
	context.fillStyle = "#4fae73";
	context.fillRect(
		0, 0,
		648, 27
	);
	context.fillStyle = "#ffffff";
	context.fillRect(
		((648 - 51) * (new_position / total_scroll_distance)), 0,
		51, 27
	);
};

let credit_timeline_oninput = function(){
	scroll_start_time = window.performance.now();
	scroll_start_positon = Number(credit_nodes.timeline.value);
	draw_credit_progress_canvas();
	
	draw_credits_frame(scroll_start_positon);
};


//  Play And Pause Button  //

let play_button_onclick = function(){
	if(credits_are_scrolling === false){
		start_scrolling_credits();
		credit_nodes.play_button.innerText = "Pause";
	} else {
		set_scroll_to_current_position();
		stop_scrolling_credits();
		credit_nodes.play_button.innerText = "Play";
	}
};

let credits_pause_button_click = function(){
	if(credits_are_scrolling === true){
		play_button_onclick();
	}
};
