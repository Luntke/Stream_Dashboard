"use strict";
//
//    Credit General
//
//This handles general credits matters.
//

let credits = {};


//Jerma's outro has a movie theater screen which can fit 360p movies very well,
//but leaves some space on the side. Using 729 by 384 we can make sure the
//whole area is covered and it is easy to position on the outro.
let credits_screen_width = 729;
let credits_screen_height = 384;

let credits_canvas = null;
let credits_context = null;

credits.header_button = document.querySelector(".header_button.credits_button");


//  General Credits Values  //

//The total length the credits can be scrolled. It is the total credits height
//minus the credit screen height.
let total_scroll_distance;

//If the credits are scrolling or not.
let credits_are_scrolling = false;

//Values above 1 will draw the credits in higher resolution than 720p by the
//given factor. It's kind of useless because we already draw 720p on a 360p
//display.
let credits_scaling = 1;

//  Credit Scrolling Positon  //

//If the credits are scrolling this is the time which they started and the
//position it was at when starting. The current position is extrapolated with
//these values for framerate independent positioning.
let scroll_start_time = 0;
let scroll_start_positon = 0;

let credits_default_run_time = (120 * 1000);

//A reversal of the scroll direction. 1 is down and -1 is the reverse, going up.
let credits_direction = 1;
//The credit scroll speed in seconds per credit name height.
let credits_speed = 1.25;
//The height of credit names.
let credit_name_height = 50;
//The effective scrolling speed of the credits. It is calculated by the function
//"set_credits_effective_speed" on changes to the credit direction or speed.
let credits_effective_speed;


//  General Functions  //

//Sets the effective scrolling speed of pixel per second on changes to the
//credits speed or credits direction.
let set_credits_effective_speed = function(){
	/*
	if(credits_speed === 0){
		credits_effective_speed = 0;
	} else {
		credits_effective_speed = (credits_direction * (credit_name_height / credits_speed));
	}
	*/
	credits_effective_speed = (total_scroll_distance / credits_default_run_time);
};

//Returns an estimate of the scroll position of the credits. Note that the
//returned value can be out of bounds.
let get_scroll_position = function(time_now){
	if(credits_effective_speed === 0
	|| credits_are_scrolling === false){
		return scroll_start_positon;
	}
	
	if(typeof time_now !== "number"){
		time_now = window.performance.now();
	}
	
	return Math.floor(scroll_start_positon + credits_effective_speed * (time_now - scroll_start_time));
};
