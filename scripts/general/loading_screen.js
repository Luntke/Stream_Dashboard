"use strict";
//
//    Loading Screen
//
//Handles opening and closing the loading screen, as well as showing error
//messages and moving the progress bar.
//

let page_still_loading = true;

let close_loading_screen = function(){
	page_still_loading = false;
	loading_screen_node.style.top = "-100%";
	loading_screen_node.style.opacity = "0.0";
	loading_screen_node.style.pointerEvents = "none";
};

let show_loading_error = function(){
	loading_screen_node.className = "loading_error";
};

let set_loading_progress = function(progress){
	if(loading_screen_node.className === "loading_error"){
		return;
	}
	
	if(progress > 1){
		progress = 1;
	}
	
	loading_screen_progress_node.style.top = ((0 + (-150)) * progress) + "px";
	loading_screen_progress_node.style.left = ((-100) * (1 - progress)) + "%";
};
