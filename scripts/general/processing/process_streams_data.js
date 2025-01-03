"use strict";
//
//    Process Streams Data
//
//Processes and stores past streams data of the channel for recovery purposes.
//

//Each element has these properties:
//    "start_time"
//    "duration"
//    "thumbnail_url"
//    "title"
//    "index"
let past_streams = [];

//The stream object of the stream that we consider as live as defined by the
//value of "restore.minimum_stream_distance".
let currently_running_stream = null;


let process_streams_data = function(data){
	let past_stream_index = past_streams.length - 1;
	
	for(let stream of data){
		let object = {};
		
		object.start_time = (new Date(stream.created_at)).getTime();
		
		if(object.start_time >= restore.minimum_restore_time){
			object.duration = get_parsed_time(stream.duration);
			object.thumbnail_url = stream.thumbnail_url;
			object.title = stream.title;
			
			//Overwrite the last added stream with this one if the last one
			//started too close to the end of the current one, detecting both
			//streams as coming from the same stream.
			if(past_stream_index >= 0
			&& (past_streams[past_stream_index].start_time - (object.start_time + object.duration)) < restore.minimum_stream_distance){
				let last_object = past_streams[past_stream_index];
				
				object.duration = ((last_object.start_time - object.start_time) + last_object.duration);
				past_streams[past_stream_index] = object;
			} else {
				past_streams.push(object);
				past_stream_index += 1;
			}
		}
	}
	
	//  Check For Live Stream  //
	
	if(page_still_loading !== true
	|| past_streams.length === 0){
		return;
	}
	
	let current_time = get_time();
	//[debug_start]
	//Fake an ongoing or past stream.
	//current_time = past_streams[0].start_time + past_streams[0].duration + 1*60*60*1000;
	//[debug_end]
	
	if((current_time - (past_streams[0].start_time + past_streams[0].duration)) < restore.minimum_stream_distance){
		currently_running_stream = past_streams[0];
		past_streams.splice(0, 1);
	}
};
