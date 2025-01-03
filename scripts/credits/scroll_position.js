"use strict";
//
//    Credit Scroll Position
//
//Handles the scroll position.
//


//  Start, Stop, Reset Credit Scroll  //

let start_scrolling_credits = function(){
	if(credits_are_scrolling !== true && credits_effective_speed !== 0){
		credits_are_scrolling = true;
		
		scroll_start_time = window.performance.now();
		
		credit_scroll_function();
	}
};

let stop_scrolling_credits = function(){
	credits_are_scrolling = false;
};

let reset_credits_scroll = function(){
	credits_pause_button_click();
	
	scroll_start_time = window.performance.now();
	scroll_start_positon = 0;
	
	draw_credits_frame(scroll_start_positon);
	update_credit_progress_bar(scroll_start_positon);
};


//  Set Scroll Position  //

let set_scroll_to_current_position = function(){
	if(credits_are_scrolling === true){
		if(credits_effective_speed === 0){
			scroll_start_time = window.performance.now();
			return;
		}
		
		let time_now = window.performance.now();
		
		scroll_start_positon = get_scroll_position(time_now);
		scroll_start_time = time_now;
		
		if(scroll_start_positon < 0){
			scroll_start_positon = 0;
		} else if(scroll_start_positon > total_scroll_distance){
			scroll_start_positon = total_scroll_distance;
		}
		
		draw_credits_frame(scroll_start_positon);
		update_credit_progress_bar(scroll_start_positon);
	}
};


//  Animation Functions  //

let credit_scroll_animation_function = function(frame_origin_time){
	debug_origin_time = frame_origin_time;
	if(credits_are_scrolling === true){
		if(credits_effective_speed === 0){
			credit_scroll_function();
			return;
		}
		
		let new_position = get_scroll_position(frame_origin_time);
		
		if(new_position < 0){
			scroll_start_positon = 0;
			//draw_credits_frame(scroll_start_positon);
			//update_credit_progress_bar(scroll_start_positon);
			//console.log("Position smaller than 0", new_position);
			//credits_pause_button_click();
			//return;
		} else if(new_position > total_scroll_distance){
			scroll_start_positon = total_scroll_distance;
			draw_credits_frame(scroll_start_positon);
			update_credit_progress_bar(scroll_start_positon);
			
			credits_pause_button_click();
			return;
		}
		
		
		draw_credits_frame(new_position);
		update_credit_progress_bar(new_position);
		credit_scroll_function();
	}
};

let credit_scroll_function = function(){
	window.requestAnimationFrame(credit_scroll_animation_function);
};
