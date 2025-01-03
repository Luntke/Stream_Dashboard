"use strict";
//
//    Canvas Handling
//
//Manages the use of canvases to draw the credits with.
//

//A chunk size of 300 means that 3-4 chunks are drawn every frame because that
//many fit into the credit screen height of 720. It seems to be a good fit
//between drawing too many chunks and having too large chunks that have to be
//drawn in some frames.
let credit_chunk_size = 300 * credits_scaling;

//The maximum number of chunks that can be drawn at the same time. When drawing
//a new chunk either a new canvas is created or an old one is reused if this
//number of canvases is reached.
let maximum_canvas_chunks = Math.ceil(credits_screen_height / (credit_chunk_size / credits_scaling)) + 1;

//Contains drawn canvases of chunks.
let credits_canvas_chunks = {};
let credits_canvas_count = 0;

//Contains data used to draw chunks.
let credits_chunk_data = [];


let get_credits_chunk = function(chunk_index, first_chunk, last_chunk){
	if(credits_canvas_chunks.hasOwnProperty(chunk_index)){
		return credits_canvas_chunks[chunk_index];
	}
	
	let canvas = get_recycled_canvas(first_chunk, last_chunk);
	if(canvas === undefined){
		console.log(chunk_index, first_chunk, last_chunk);
	}
	draw_chunk(chunk_index, canvas);
	
	return canvas;
};

let get_recycled_canvas = function(first_chunk, last_chunk){
	if(credits_canvas_count < maximum_canvas_chunks){
		return get_new_canvas();
	}
	
	for(let chunk_index in credits_canvas_chunks){
		if(Number(chunk_index) < first_chunk
		|| Number(chunk_index) >= last_chunk){
			let old_canvas = credits_canvas_chunks[chunk_index];
			delete credits_canvas_chunks[chunk_index];
			return old_canvas;
		}
	}
};

let get_new_canvas = function(){
	let canvas = document.createElement("canvas");
	canvas.width = credits_screen_width * credits_scaling;
	canvas.height = credit_chunk_size * credits_scaling;
	
	let context = canvas.getContext("2d");
	context.font = (46 * credits_scaling) + "px serif";
	context.textAlign = "center";
	context.fillStyle = "#ffffff";
	context.scale(credits_scaling, credits_scaling);
	
	credits_canvas_count += 1;
	
	return canvas;
};
