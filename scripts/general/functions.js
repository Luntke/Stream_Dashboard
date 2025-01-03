"use strict";
//
//    Functions
//
//Collection of small general functions.
//


//Fixes the page URL containing a slash after the mustard, but retains query
//parameters.
let fix_page_url = function(){
	let fixed_url = ("/mustard" + window.location.search);
	window.history.replaceState({}, "", fixed_url);
};

//[debug_start]
fix_page_url = function(){
	//Don't fix the URL in debug mode.
};
//[debug_end]

//Returns the current time in milliseconds. Accuracy is worse than milliseconds.
//It is roughly the time of the server instead of the operating system, because
//the time given by the operating system can be way off and inconsistent.
let get_time = function(){
	return (performance.timing.navigationStart + performance.now() + client_time_offset);
};


//Returns a boolean indicating if the given value is an object.
let is_object = function(value){
	return (value === Object(value));
};

let hasOwnProperty = function(object, property){
	return Object.prototype.hasOwnProperty.call(object, property);
};

//Takes a bit amount and returns the value in US dollars as a formatted string.
let get_bits_to_dollars = function(amount){
	return (amount / 100).toLocaleString("en-US", {
		style: "currency",
		currency: "USD"
	});
};


//Returns the given number with decimal formatting, which adds commas and dots
//to numbers. For example a given number 10000.5 returns "10,000.50".
let get_decimal_formatted_number = function(number){
	return number.toLocaleString("en-US");
};


//Returns a new "img" HTML element with the "referrerpolicy" attribute set to
//"no-referrer".
let get_img_node = function(){
	let a = document.createElement("img");
	
	a.setAttribute("referrerpolicy", "no-referrer");
	
	return a;
};

//Takes an object with details about the link and returns an "a" HTML node which
//savely opens the URL without opener or referrer.
//The given object has to have these porperties:
//    href: [String]
//        The URL to link to.
//    text: [String]
//        The text of the link the user has to click on.
let get_link_node = function(details){
	let a = document.createElement("a");
	
	a.href = details.href;
	a.innerText = details.text;
	a.target = "_blank";
	a.rel = "noopener noreferrer";
	
	return a;
};

//This function has to be used as a tag for a tagged literal template. The
//expressions in that template literal can be either normal strings or objects.
//Objects have to have the "type" property set to a valid formatting object
//type.
//
//These are the available object types:
//    "link"
//        href: [String]
//            The URL to link to.
//        text: [String]
//            The text of the link the user has to click on.
//    "image"
//        src: [String]
//            The URL of the image.
//        title: [String]
//            The title and alternative text to use for the image.
let to_formatted_text_node = function(strings, ...expressions){
	//  Merging Data  //
	
	//Merging string and expression data like a zipper. Strings are always one
	//more than the expressions and are the first and last.
	
	let data = [];
	
	for(let i = 0;i < strings.length;i += 1){
		data.push(strings[i]);
		data.push(expressions[i]);
	}
	
	data.pop();
	
	//  Creating Formatting Text Node  //
	
	let node = document.createElement("span");
	
	for(let element of data){
		if(typeof element === "string"){
			let span = document.createElement("span");
			span.innerText = element;
			
			node.appendChild(span);
		} else if(typeof element === "object"){
			if(element.type === "link"){
				let a = get_link_node(element);
				
				node.appendChild(a);
			} else if(element.type === "image"){
				let img = get_img_node();
				img.src = element.src;
				img.alt = element.title;
				img.style.verticalAlign = "middle";
				
				set_tooltip(img, element.title);
				
				node.appendChild(img);
			}
		}
	}
	
	return node;
};

//  Get Displayed Time  //
//
//Handles converting unix time to the displayed time. The displayed time is
//absolute instead of relative, which means it does not have to be updated.
//Example time: 02:17
//
let get_displayed_time = function(unix_time){
	let date = new Date(unix_time);
	
	let hours = date.getHours();
	let minutes = date.getMinutes();
	
	return (
		((hours < 10) ? "0" + hours : hours)
		+ ":"
		+ ((minutes < 10) ? "0" + minutes : minutes)
	);
};


//  Get Parsed Time  //
//
//Parses and returns the time length of a VOD given by the Twitch API in
//milliseconds. Example values given by Twitch:
//    46h0m26s
//    7m5s
//    47s
//
let get_parsed_time = (function(){
	let time_regex = /(?:([0-9]+)h)?(?:([0-9]+)m)?(?:([0-9]+)s)?/;
	
	return function(time_string){
		let passed_seconds = 0;
		let results = time_regex.exec(time_string);
		
		if(results !== null){
			//Hours
			if(results[1] !== undefined){
				passed_seconds += Number(results[1]) * 60 * 60;
			}
			//Minutes
			if(results[2] !== undefined){
				passed_seconds += Number(results[2]) * 60;
			}
			//Seconds
			if(results[3] !== undefined){
				passed_seconds += Number(results[3]);
			}
		}
		
		return 1000 * passed_seconds;
	};
})();


//Calculates and then returns the width and height of a scrollbar in the current
//browser.
let get_scrollbar_dimensions = function(){
	let container = document.createElement("div");
	container.style.margin = "0px";
	container.style.borderWidth = "0px";
	container.style.padding = "0px";
	container.style.width = "1000px";
	container.style.height = "1000px";
	container.style.overflowX = "scroll";
	container.style.overflowY = "scroll";
	
	let child = document.createElement("div");
	child.style.margin = "0px";
	child.style.borderWidth = "0px";
	child.style.padding = "0px";
	child.style.width = "100%";
	child.style.height = "100%";
	
	container.appendChild(child);
	
	document.body.appendChild(container);
	let container_dimensions = container.getBoundingClientRect();
	let child_dimensions = child.getBoundingClientRect();
	document.body.removeChild(container);
	
	let scrollbar_width = (container_dimensions.width - child_dimensions.width);
	let scrollbar_height = (container_dimensions.height - child_dimensions.height);
	
	return {
		width: scrollbar_width,
		height: scrollbar_height
	};
};


//Inserts browser specific CSS into the page to handle drawing differences.
let insert_browser_specific_css = function(){
	let scrollbar_dimensions = get_scrollbar_dimensions();
	
	let style_node = document.createElement("style");
	document.head.appendChild(style_node);
	let style_sheet = style_node.sheet;
	
	style_sheet.insertRule(":root {--scrollbar-height: " + scrollbar_dimensions.height + "px!important;}", style_sheet.cssRules.length);
};
