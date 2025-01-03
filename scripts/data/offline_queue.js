"use strict";
//
//    Offline Queue
//
//Handles events related to the bot going online and offline.
//
//
//When the bot is considered offline no data should be added to the page. The
//bot is considered offline from the "chat_disconnect_time" and considered
//online when the bot is connected to the chat and the data recovery was
//resolved or rejected. When it is considered back online the queued data is
//added to the page.
//


//  Variables  //

//If the bot is considered online or offline.
data.considered_online = false;

//The earliest time in which the current disconnect happened. The default value
//is 20 minutes before the page opened, as the Twitch API caches responses and
//therefore may not document a started stream for a few minutes. The exact cache
//times are not documented and can change at any time depending on server load.
//20 minutes is an informed guess for a time safely higher than the cache time,
//making sure that a stream start is not missed.
//
//This may be extended if there was an error loading the stream data.
data.earliest_bot_disconnect = (get_time() - (20 * 60 * 1000));
data.earliest_bot_disconnect_stream_error = (get_time() - (12 * 60 * 60 * 1000));

//Queued data from the offline period. It may end up with duplicates, as
//recovery data is fetched when the bot has reconnected, giving it time to read
//in data from the IRC channel that ends up being included in the recovery data.
data.offline_queue = [];

//The delay between the bot reconnecting and fetching data from the recovery
//source. The source has a built-in time delay, so we need to compensate for
//that. This delay makes sure that our reconnected bot and the recovery source
//have an overlapping time window in their event collection.
data.fetch_time_delay = 300;

//Callback called when the bot has connected. It is even called if the variable
//"data.ignore_bot_connected" says it should be ignored. It is meant to be used
//in the start up process.
data.bot_connected_callback = null;

//If the "data.on_bot_connected" method should ignore being called. It is used
//in the loading process to wait for other data first.
data.ignore_bot_connected = true;


//  Functions  //

//Handles the event that the bot is disconnected from IRC.
data.on_bot_disconnected = function(){
	if(data.considered_online === true){
		data.considered_online = false;
		data.earliest_bot_disconnect = (get_time() - ((6 * 60 + 15) * 1000));
		data.offline_queue.length = 0;
	}
};

//Handles the event that the bot joined the IRC channel.
data.on_bot_connected = function(){
	if(typeof data.bot_connected_callback === "function"){
		data.bot_connected_callback(true);
	}
	
	if(data.ignore_bot_connected === true){
		return;
	}
	
	if(page_still_loading === true){
		let time_in_future = (get_time() + 24 * 60 * 60 * 1000);
		
		if(currently_running_stream === null){
			let time_from = data.earliest_bot_disconnect;
			
			window.setTimeout(function(){
				data.data_recovery({
					from: time_from,
					to: time_in_future
				}, false);
			}, data.fetch_time_delay);
		} else {
			let stream_to_recover = currently_running_stream;
			
			window.setTimeout(function(){
				data.data_recovery({
					from: stream_to_recover.start_time,
					to: time_in_future
				}, false);
			}, data.fetch_time_delay);
		}
		
		return;
	}
	
	
	let time_from = false;
	
	if(data.displayed_data.length > 0){
		let newest_data = data.displayed_data[data.displayed_data.length - 1];
		time_from = newest_data.time;
	}
	if(data.non_displayed_data.length > 0){
		let newest_data = data.non_displayed_data[data.non_displayed_data.length - 1];
		
		if(time_from === false
		|| newest_data.time > time_from){
			time_from = newest_data.time;
		}
	}
	
	if(time_from === false){
		time_from = data.earliest_bot_disconnect;
	}
	
	window.setTimeout(function(){
		data.data_recovery({
			from: time_from,
			//Time in the future to make sure we include the newest data.
			to: (get_time() + 24 * 60 * 60 * 1000)
		}, false);
	}, data.fetch_time_delay);
	
	return;
};

let merge_offline_queue = function(){
	let offline_queue = data.offline_queue;
	
	if(offline_queue.length === 0){
		return;
	}
	
	
	let displayed_data = data.displayed_data;
	let non_displayed_data = data.non_displayed_data;
	
	let queue_displayed = [];
	let queue_non_displayed = [];
	
	for(let element of offline_queue){
		if(data.is_displayed_type(element.type)){
			queue_displayed.push(element);
		} else {
			queue_non_displayed.push(element);
		}
	}
	
	data.offline_queue.length = 0;
	
	
	//  Display Data  //
	
	if(queue_displayed.length > 0){
		if(displayed_data.length === 0){
			for(let element of queue_displayed){
				data.add(element, displayed_data.length);
			}
		} else {
			let {unique_elements, insert_indeces} = get_insertion_data(
				queue_displayed,
				displayed_data
			);
			
			for(let i = 0;i < unique_elements.length;i += 1){
				data.add(unique_elements[i], insert_indeces[i]);
			}
		}
	}
	
	
	//  Non-Display Data  //
	
	if(queue_non_displayed.length > 0){
		if(non_displayed_data.length === 0){
			for(let element of queue_non_displayed){
				data.add(element, non_displayed_data.length);
			}
		} else {
			let {unique_elements, insert_indeces} = get_insertion_data(
				queue_non_displayed,
				non_displayed_data
			);
			
			for(let i = 0;i < unique_elements.length;i += 1){
				data.add(unique_elements[i], insert_indeces[i]);
			}
		}
	}
};


//Handles the promise that should resolve to recovery data.
data.data_recovery = function(time_object, is_stream){
	get_recovery_data(time_object, is_stream)
	.then(function(raw_recovery_data){
		//  Recover Data  //
		
		let recovery_data = decode_recovery_data(raw_recovery_data);
		
		
		//  Merge Data  //
		
		//Required before merging the offline queue.
		data.considered_online = true;
		
		data.offline_queue.push(...recovery_data);
		sort_data_object_array(data.offline_queue);
		remove_data_object_duplicates(data.offline_queue);
		merge_offline_queue();
		
		
		//  Finish  //
		
		if(typeof data.data_recovery_callback === "function"){
			data.data_recovery_callback(true);
		}
	})
	.catch(function(error){
		if(typeof data.data_recovery_callback === "function"){
			data.data_recovery_callback(false, error);
		} else {
			console.error(error);
			
			data.considered_online = true;
			
			for(let data_object of data.offline_queue){
				data.add(data_object);
			}
			
			data.offline_queue.length = 0;
		}
	});
};

//Callback called by "data.data_recovery" given a boolean indicating if
//loading was successful.
data.data_recovery_callback = null;
