"use strict";
//
//    Tooltip
//
//Handles the tooltip for images. When moving your mouse above an emote or
//cheermote a small name tag pops up to show you its name. This is superior to
//the default tooltip of your browser as it shows up faster and fits better with
//the page theme. To work correctly, any scrollable parent of an image with a
//custom tooltip which has a
//


//  Variables  //

let tooltip_node = null;


//  Functions  //

let set_tooltip = function(node, string){
	if(typeof string !== "string"
	|| string.length === 0){
		return;
	}
	
	node.setAttribute("data-tooltip", string);
	node.onmouseenter = tooltip_onmouseenter;
	node.onmousemove = tooltip_onmousemove;
	node.onmouseleave = tooltip_onmouseleave;
};

let set_tooltip_scrollable_parent = function(scrollable_parent){
	scrollable_parent.addEventListener("scroll", tooltip_onscroll);
};

let remove_tooltip = function(){
	if(tooltip_node === null){
		return;
	}
	
	if(tooltip_node.parentElement){
		tooltip_node.parentElement.removeChild(tooltip_node);
	}
	
	tooltip_node = null;
};

//When HTML nodes are cloned the event listeners of the original node are not
//set on the cloned node. This detects elements which should have a tooltip and
//sets the required event listeners.
let readd_tooltip_event_listeners = function(cloned_node){
	let tooltip_nodes = cloned_node.querySelectorAll("[data-tooltip]");
	
	for(let node of tooltip_nodes){
		set_tooltip(node, node.getAttribute("data-tooltip"));
	}
};


//  Event Listeners  //

let tooltip_onmouseenter = function(){
	//  Remove Existing Tooltip  //
	
	remove_tooltip();
	
	//  Create Tooltip  //
	
	let tooltip = document.createElement("div");
	tooltip.innerText = this.getAttribute("data-tooltip");
	tooltip.classList.add("tooltip");
	tooltip.style.top = "0px";
	tooltip.style.left = "0px";
	document.body.appendChild(tooltip);
	
	tooltip_node = tooltip;
	
	//  Position Tooltip  //
	
	//We make sure the tooltip is centered above its corresponding image and
	//stays inside the current size of the document body. The tooltip may be
	//moved sideways or shown below the image to keep it inbounds. The bounding
	//client rect is the node's position in the viewport, not the body, which is
	//why we need the bounding data of the body as well and do scroll correction
	//to get the body position.
	
	let tooltip_image_distance = 4;
	
	let body_data = document.body.getBoundingClientRect();
	let image_data = this.getBoundingClientRect();
	let tooltip_data = tooltip.getBoundingClientRect();
	
	
	let tooltip_top = (
		image_data.top - body_data.top
		- tooltip_image_distance - tooltip_data.height
	);
	
	//Move the tooltip below the image if there isn't enough space above it.
	if(tooltip_top < 0){
		tooltip_top = (
			image_data.top - body_data.top
			+ image_data.height + tooltip_image_distance
		);
	}
	
	
	let tooltip_left = (
		image_data.left - body_data.left + (image_data.width / 2)
		- (tooltip_data.width / 2)
	);
	
	if((tooltip_left + tooltip_data.width) > body_data.width){
		tooltip_left = (body_data.width - tooltip_data.width);
	}
	if(tooltip_left < 0){
		tooltip_left = 0;
	}
	
	
	tooltip.style.top = (tooltip_top + "px");
	tooltip.style.left = (tooltip_left + "px");
};

let tooltip_onmousemove = function(){
	if(tooltip_node === null){
		tooltip_onmouseenter.call(this);
	}
};

let tooltip_onmouseleave = function(){
	remove_tooltip();
};

window.addEventListener("scroll", remove_tooltip, {
	capture: true
});
