"use strict";
//
//    Get BTTV Emotes
//
//Fetches global or channel BTTV emote data and returns an object or null on
//error. If there are no BTTV emotes for a channel it also counts as an error
//due to the BTTV API.
//

let get_global_bttv_emotes = async function(){
	try {
		let url = "https://jerma.org/api/bttv_global_backup.json";
		let response = await fetch(url, {
			method: "GET",
			mode: "cors",
			credentials: "omit",
			cache: "no-cache",
			redirect: "follow",
			referrerPolicy: "no-referrer"
		});
		
		if(response.status !== 200){
			return null;
		}
		
		let data = await response.json();
		
		return data;
	} catch(error){
		console.error(error);
	}
	
	return null;
};

let get_channel_bttv_emotes = async function(){
	try {
		let url = "https://jerma.org/api/bttv_channel_backup.json";
		let response = await fetch(url, {
			method: "GET",
			mode: "cors",
			credentials: "omit",
			cache: "no-cache",
			redirect: "follow",
			referrerPolicy: "no-referrer"
		});
		
		if(response.status !== 200){
			return null;
		}
		
		let data = await response.json();
		
		return data;
	} catch(error){
		console.error(error);
	}
	
	return null;
};
