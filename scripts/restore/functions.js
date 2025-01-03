"use strict";
//
//    Restore Functions
//
//Contains some functions used for restoring.
//


//  Event Handlers  //

restore.on_vod_click = function(event){
	let stream_time = Number(this.getAttribute("data-stream-time"));
	
	let stream_object = past_streams.find(function(element){
		return (element.start_time === stream_time);
	});
	
	if(stream_object){
		let data_promise = new Promise(function(resolve, reject){
			//Adding more range to the stream's time range. When pulling the start time
			//early we need to extend the duration twice to get the expected result due
			//to relative timing.
			let time_object = {
				from: (stream_object.start_time - restore.vod_time_extra_range),
				to: (stream_object.start_time + stream_object.duration + restore.vod_time_extra_range)
			};
			
			get_recovery_data(time_object, false)
			.then(function(data){
				resolve(decode_recovery_data(data));
			})
			.catch(function(error){
				reject(error);
			});
		});
		let recovery_id = ("mustard_" + stream_time);
		let position = {
			x: event.clientX,
			y: event.clientY
		};
		let details = {
			stream: stream_object
		};
		
		restore.create_restore_window(data_promise, recovery_id, position, details);
	}
};


//  General  //

//Takes a VOD duration time in milliseconds and returns a displayed time in
//"hours:minutes:seconds" format.
restore.get_display_duration = function(duration){
	duration = Math.ceil(duration / 1000);
	
	let hours = Math.floor(duration / 3600);
	let minutes = Math.floor(duration / 60) % 60;
	let seconds = duration % 60;
	
	let output = "";
	
	output += hours + ":";
	
	if(minutes < 10){
		output += "0";
	}
	output += minutes + ":";
	
	if(seconds < 10){
		output += "0";
	}
	output += seconds;
	
	return output;
};

//Takes a VOD start time and returns a string saying how many days it has been
//since the VOD was started. Example: "0 days ago"
restore.get_days_ago = function(start_time){
	let passed_time = (get_time() - start_time);
	let days = Math.floor(Math.max(0, passed_time / (24 * 60 * 60 * 1000)));
	
	if(days === 1){
		return (days + " day ago");
	}
	
	return (days + " days ago");
};
