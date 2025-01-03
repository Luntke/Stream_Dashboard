"use strict";
//
//    Drawing Credits Frames
//
//This draws the frames of the credits.
//
//
//CSS transitions and animations run at 60fps, which doesn't look good on
//144Hz displays. Animating the DOM with JavaScript has no upper limit on
//fps, but has the same problems. Animations on the DOM are inefficient
//and they can't draw at sub-pixel accuracy, making it choppy at low speeds.
//The solution is using a canvas.
//
//To draw the credits on the canvas it caches chunks of the credits that are
//likely to be rendered again and then draws those chunks on every frame with
//no upper fps limit and sub-pixel movements for the smoothest animation possible.
//

let debug_frame_count = 0;
let debug_origin_time = 0;
let last_debug_origin_time = 0;

let draw_credits_frame = function(scroll_position){
	//Calculate the chunks to draw.
	
	let first_chunk = Math.floor(scroll_position / credit_chunk_size);
	let last_chunk = Math.ceil((scroll_position + credits_screen_height) / credit_chunk_size);
	
	credits_context.clearRect(0, 0, credits_canvas.width, credits_canvas.height);
	
	//Drawing the chunks
	for(let chunk_index = first_chunk;chunk_index < last_chunk;chunk_index += 1){
		let chunk = get_credits_chunk(chunk_index, first_chunk, last_chunk);
		
		credits_context.drawImage(chunk, 0, (chunk_index*credit_chunk_size - scroll_position) * credits_scaling);
	}
	
	//Debug. console.log()
	credits_context.font = "20px Georgia";
	credits_context.fillStyle = "#ffffff";
	//credits_context.fillText(debug_frame_count, 10, 50);
	//debug_frame_count += 1;
	//credits_context.fillText(Date.now(), 10, 120);
	//credits_context.fillText(debug_origin_time, 10, 190);
	//credits_context.fillText(scroll_position, 10, 260);
	
	credits_context.fillText((debug_origin_time - last_debug_origin_time), 10, 190);
	last_debug_origin_time = debug_origin_time;
};
