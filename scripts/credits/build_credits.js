"use strict";
//
//    Building Credits
//
//Builds the credit data.
//

let credits_have_been_build = false;

//Note: This function gets called when the initial bits and subs data has
//arrived to give a time that the credits would run. It isn't a problem though,
//as it takes single digit milliseconds to finish.
let build_credits = function(){
	credits_canvas.width = credits_screen_width * credits_scaling;
	credits_canvas.height = credits_screen_height * credits_scaling;
	credits_context = credits_canvas.getContext("2d");
	
	//Array containing all graphics drawn in the credits. These are converted to
	//chunk data that can easily be drawn on the fly. It is sorted by the
	//position it will be drawn at.
	//
	//Each element is an object similar to: {
	//    margin_top: [number >= 0],
	//    height: [number >= 0],
	//    margin_bottom: [number >= 0],
	//    details: {object},
	//    draw_function: [function]
	//}
	let credits_raw_graphics = [];
	
	
	//  Get Names  //
	
	let names = credits_sub_data.map(function(subscription){
		return subscription.receiver;
	});
	
	//Sorting names to make it easier for viewers to find their own name. It's
	//sorted in the way that makes most sense, so "name_2" comes before
	//"name_10" and "Name_8" comes in between.
	names.sort(new Intl.Collator("en-US", {
		sensitivity: "base",
		numeric: true
	}).compare);
	
	//Removing duplicate names. In rare cases Twitch sends a subscriber event
	//for the same user twice with a few millisecond difference. While the
	//statistics count them both (which may be a bad thing) the credits should
	//absolutely not show duplicates.
	for(let i = 1;i < names.length;i += 1){
		if(names[i] === names[i - 1]){
			names.splice(i, 1);
			i -= 1;
		}
	}
	
	
	//  Add Credit Opening  //
	
	credits_raw_graphics.push({
		margin_top: (credits_screen_height - 11),
		height: 120,
		margin_bottom: 0,
		details: {
			title: "CREDITS",
			sub_title: "Thanks for supporting the stream!"
		},
		draw_function: draw_chunk_function_opening,
		type: "opening"
	});
	
	
	//  Add Subs  //
	
	if(names.length > 0){
		credits_raw_graphics.push({
			margin_top: 26,
			height: 38,
			margin_bottom: 5,
			details: {
				text: "TONIGHT'S SUBS/RESUBS"
			},
			draw_function: draw_chunk_function_section_start,
			type: "section_start"
		});
		
		for(let name of names){
			credits_raw_graphics.push({
				margin_top: 0,
				height: 50,
				margin_bottom: 0,
				details: {
					name: name
				},
				draw_function: draw_chunk_function_sub_name,
				type: "sub_name"
			});
		}
	}
	
	
	//  Add Credit Ending  //
	
	credits_raw_graphics.push({
		margin_top: (credits_screen_height + 4),
		height: 0,
		margin_bottom: 0,
		details: {},
		draw_function: draw_chunk_function_ending,
		type: "ending"
	});
	
	
	//  Finish  //
	
	total_scroll_distance = calculate_chunk_data(credits_raw_graphics) - credits_screen_height;
	
	build_credit_progress_bar();
	
	credits_sub_data.length = 0;
};


let calculate_chunk_data = function(credits_raw_graphics){
	//Each element of credits_raw_graphics looks like: {
	//    margin_top: [number >= 0],
	//    height: [number >= 0],
	//    margin_bottom: [number >= 0],
	//    details: {object},
	//    draw_function: [function]
	//}
	
	let current_position = 0;
	let chunk_index;
	
	for(let graphic of credits_raw_graphics){
		current_position += graphic.margin_top;
		
		//The lowest chunk it has to be drawn in.
		let low_chunk_index = Math.floor(current_position / credit_chunk_size);
		//The first chunk it does not have to be drawn in anymore. For example
		//a graphic that starts at position 0 and has a height of 300 will not
		//have to be drawn in a chunk that starts at position 300.
		let high_chunk_index = Math.ceil((current_position + graphic.height) / credit_chunk_size);
		
		for(;low_chunk_index < high_chunk_index;low_chunk_index += 1){
			add_chunk_data(low_chunk_index, current_position - low_chunk_index*credit_chunk_size, graphic);
		}
		
		current_position += graphic.height + graphic.margin_bottom;
	}
	
	
	//  Return Total Height  //
	
	return current_position;
};


let add_chunk_data = function(chunk_index, position, graphic){
	if(credits_chunk_data.hasOwnProperty(chunk_index)){
		credits_chunk_data[chunk_index].push({
			position: position,
			details: graphic.details,
			draw_function: graphic.draw_function,
			type: graphic.type
		});
	} else {
		credits_chunk_data[chunk_index] = [{
			position: position,
			details: graphic.details,
			draw_function: graphic.draw_function,
			type: graphic.type
		}];
	}
};
