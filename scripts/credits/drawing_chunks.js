"use strict";
//
//    Drawing Credits Chunks
//
//This draws the chunks of the credits.
//

//If set to true it shows a red outline for each chunk drawn in the credits.
let show_chunks = false;

let draw_chunk = function(chunk_index, canvas){
	credits_canvas_chunks[chunk_index] = canvas;
	
	let context = canvas.getContext("2d");
	
	context.clearRect(0, 0, credits_screen_width, credit_chunk_size);
	
	if(Array.isArray(credits_chunk_data[chunk_index])){
		for(let graphic of credits_chunk_data[chunk_index]){
			graphic.draw_function(context, graphic);
		}
	}
	
	if(show_chunks === true){
		draw_chunk_borders(context);
	}
};

let draw_chunk_borders = function(context){
	context.fillStyle = "rgba(255, 0, 0, 1)";
	context.fillRect(0, 0, credits_screen_width, 1);
	context.fillRect(0, 0, 1, credit_chunk_size);
	context.fillRect(credits_screen_width - 1, 0, 1, credit_chunk_size);
	context.fillRect(0, credit_chunk_size - 1, credits_screen_width, 1);
};


//  Functions Drawing In Chunks  //

let draw_chunk_function_opening = function(context, graphic){
	context.save();
	context.translate(0, graphic.position);
	
	context.fillStyle = "rgba(255, 255, 255, 1)";
	
	context.font = "48px serif";
	context.fillText(graphic.details.title, (credits_screen_width / 2), 48);
	context.font = "24px serif";
	context.fillText(graphic.details.sub_title, (credits_screen_width / 2), 48+58);
	
	context.restore();
};

let draw_chunk_function_ending = function(context, graphic){
	//Do nothing :)
};

let draw_chunk_function_section_start = function(context, graphic){
	context.save();
	context.translate(0, graphic.position);
	
	context.fillStyle = "rgba(255, 255, 255, 1)";
	context.font = "24px serif";
	context.fillText(graphic.details.text, (credits_screen_width / 2), 26);
	
	context.restore();
};

let draw_chunk_function_sub_name = function(context, graphic){
	context.save();
	context.translate(0, graphic.position);
	
	context.fillStyle = "rgba(255, 255, 255, 0.2)";
	context.beginPath();
	context.moveTo(95, 2);
	context.lineTo(656, 2);
	context.lineTo(634, 48);
	context.lineTo(73, 48);
	context.lineTo(95, 2);
	context.fill();
	
	context.fillStyle = "rgba(255, 255, 255, 1)";
	context.font = "46px serif";
	context.fillText(graphic.details.name, (credits_screen_width / 2), 37);
	
	context.restore();
};
