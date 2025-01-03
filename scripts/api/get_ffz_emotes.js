"use strict";
//
//    Get FFZ Emotes
//
//Fetches global or channel FFZ emote data and returns an object or null on
//error. If there are no FFZ emotes for a channel it also counts as an error due
//to the FFZ API.
//

let get_global_ffz_emotes = async function(){
	try {
		let url = "https://api.frankerfacez.com/v1/room/__ffz_global";
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
		
		if(hasOwnProperty(data, "status")
		&& data.status !== 200){
			return null;
		}
		
		return data;
	} catch(error){
		console.error(error);
		return null;
	}
};

let get_channel_ffz_emotes = async function(){
	try {
		let url = `https://api.frankerfacez.com/v1/room/${channel}`;
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
		
		if(hasOwnProperty(data, "status")
		&& data.status !== 200){
			return null;
		}
		
		return data;
	} catch(error){
		console.error(error);
		return null;
	}
};
