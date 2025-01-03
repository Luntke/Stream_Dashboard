"use strict";
//
//    Main
//
//Sets everything up to finish loading and make the page usable. The steps taken
//are in the following order:
//  0. Wait for the first drawn frame to ensure loading doesn't start in a
//     background tab, as that may be a waste of resources.
//  1. Give the loading screen back its transition, which may otherwise lead to
//     drawing errors beforehand.
//  2. Connect to Twitch Chat of the channel by the channel name.
//  3. Verify the Twitch channel exists under the given channel name by
//     retrieving the corresponding user ID. Can be skipped by hardcoding the
//     user ID as a response.
//  4. Two steps at once:
//     3.0 Load the recent VODs associated with the user ID.
//     3.1 Load the cheermotes available in the channel associated with the
//         user ID.
//  5. Recover stream events either from an ongoing stream or from the past few
//     minutes in case a stream just started and isn't reflected in the API data
//     yet.
//  6. Close the loading screen.
//

let start_loading_page = function(){
	loading_screen_node.className = "loading_screen_transition";
	
	//[debug_start]
	/*
	for(let i = 0;i < 500;i += 1){
		handle_irc_message({
			data: "@badges=staff/1,broadcaster/1,turbo/1;color=#008000;display-name=ronni" + i + ";emotes=;id=db25007f-7a18-43eb-9379-80131e44d633;login=ronni;mod=0;msg-id=resub;msg-param-cumulative-months=6;msg-param-streak-months=2;msg-param-should-share-streak=1;msg-param-sub-plan=Prime;msg-param-sub-plan-name=Prime;room-id=1337;subscriber=1;system-msg=ronni\shas\ssubscribed\sfor\s6\smonths!;tmi-sent-ts=" + i + ";turbo=1;user-id=1337;user-type=staff :tmi.twitch.tv USERNOTICE #dallas :Great stream -- keep it up!"
		});
	}
	*/
	//[debug_end]
	
	//  Prepare  //
	
	let things_to_load = 5;
	let things_loaded = 0;
	set_loading_progress(0.4 / things_to_load);
	
	let display_loading_progress = function(increase = 1){
		things_loaded += increase;
		set_loading_progress(things_loaded / things_to_load);
	};
	
	let handle_loading_error = function(error){
		show_loading_error();
		stop_bot();
		console.error(error);
	};
	
	insert_browser_specific_css();
	
	
	//  Fetch Data  //
	
	//User ID
	let twitch_promises = (function(){
		display_loading_progress();
		
		//Stream VODs
		let recent_streams_promise = get_recent_streams()
		.then(function(value){
			process_streams_data(value);
			
			display_loading_progress();
		});
		
		//Cheermotes
		let cheermotes_promise = get_cheermotes()
		.then(function(value){
			process_cheermotes_data(value);
			
			display_loading_progress();
		});
		
		return Promise.all([
			recent_streams_promise,
			cheermotes_promise
		]);
	})();
	
	let third_party_promises = (async function(){
		try {
			await Promise.all([
				load_bttv_emotes(),
				load_ffz_emotes()
			]);
		} catch(error){
			console.error(error);
			
			//Keep loading on error.
		}
	})();
	
	//Joining Chat
	let chat_promise = (new Promise(function(resolve, reject){
		data.bot_connected_callback = function(successfully_recovered){
			data.bot_connected_callback = null;
			
			if(successfully_recovered === true){
				display_loading_progress();
				resolve();
			} else {
				reject("Bot did not successfully connect to the IRC channel.");
			}
		};
		
		start_bot();
		//[debug_start]
		//window.setTimeout(function(){
		//    data.on_bot_connected();
		//}, 0.5 * 1000);
		//[debug_end]
	}));
	
	
	//  Finish When All Promises Done  //
	
	Promise.all([twitch_promises, third_party_promises, chat_promise])
	.then(function(){
		//After successfully finishing the loading process there is a forced
		//attempt to recover data regardless of the fetched recent stream data
		//as the Twitch API may not include a very recently started stream due
		//to caching.
		
		data.ignore_bot_connected = false;
		display_loading_progress(0.9);
		
		data.data_recovery_callback = function(success, error = undefined){
			if(success === true){
				display_loading_progress(0.1);
				close_loading_screen();
			} else {
				handle_loading_error(error);
			}
		};
		
		data.on_bot_connected();
	})
	.catch(handle_loading_error);
};


fix_page_url();
window.requestAnimationFrame(start_loading_page);
