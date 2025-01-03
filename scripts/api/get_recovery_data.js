"use strict";
//
//    Get Recovery Data
//
//Fetches data from a specified timeframe. It may not be complete or have any
//data at all, but it's better than nothing.
//

let get_recovery_data = function(object, is_stream){
	let time_from;
	let time_to;
	
	if(is_stream === true){
		time_from = (object.start_time - restore.chat_time_fuzziness);
		time_to = (object.start_time + object.duration + restore.chat_time_fuzziness);
	} else {
		time_from = (object.from - restore.chat_time_fuzziness);
		time_to = (object.to + restore.chat_time_fuzziness);
	}
	
	return new Promise(function(resolve, reject){
		//The from and to Unix times are inclusive.
		let url = ("https://jerma.org/api/recover_stream_events_v1.php?" +
			"from=" + encodeURIComponent(time_from) + "&" +
			"to=" + encodeURIComponent(time_to)
		);
		
		fetch(url, {
			method: "GET",
			mode: "cors",
			credentials: "omit",
			cache: "no-cache",
			redirect: "follow",
			referrerPolicy: "no-referrer"
		})
		.then(function(response){
			return response.json();
		})
		.then(function(information){
			resolve(information);
		})
		.catch(function(error){
			reject();
		});
	});
};
//[debug_start]
/*
get_recovery_data = function(object, is_stream){
	let time_from;
	let time_to;
	console.log(object);
	if(is_stream === true){
		time_from = (object.start_time - restore.chat_time_fuzziness);
		time_to = (object.start_time + object.duration + restore.chat_time_fuzziness);
	} else {
		time_from = object.from;
		time_to = object.to;
	}
	
	if(typeof time_from !== "number"
	|| typeof time_to !== "number"){
		throw new Error("Invalid arguments given for function \"get_recovery_data\".");
	}
	
	return new Promise(function(resolve, reject){
		window.setTimeout(function(){
			resolve(
		[
			"1550426755817;s;Lazy_Luc",
			"20000;s;Spreeo",
			"20000;s;IamMunkk",
			
			"20000;c;Lazy_Luc;1;2",
			"20000;g;Lazy_Luc;bet3",
			
			"20000;c;Lazy_Luc;100;1",
			"20000;g;Lazy_Luc;bet4",
			"20000;g;Lazy_Luc;bet5",
			"20000;g;Lazy_Luc;bet6",
			"20000;g;Lazy_Luc;bet7",
			"20000;g;Lazy_Luc;bet8",
			
			"20000;r;Etalyx;1",
			"20000;r;Etalyx;150648222",
			"20000;b;Lazy_Luc;2;;Y2hlZXIyIGhleQ==",
			"20000;b;Lazy_Luc;101;;Y2hlZXIxMDEgaGV5",
			"20000;b;Lazy_Luc;1001;;Y2hlZXIxMDAxIGhleQ==",
			"20000;b;Lazy_Luc;5001;;Y2hlZXI1MDAxIGhleQ==",
			"20000;b;Lazy_Luc;10001;;Y2hlZXIxMDAwMSBoZXk=",
			"20000;b;Lazy_Luc;100001;;Y2hlZXIxMDAwMDEgaGV5",
			"20000;b;Lazy_Luc;250;;Y2hlZXIyNTAgaGV5",
			"20000;b;Lazy_Luc;250;;Y2hlZXIyNTAgY2hlZXIyNTAgaGV5",
			"20000;b;Lazy_Luc;2000;;Y2hlZXIxMDAwIGNoZWVyNTAwIGNoZWVyNTAwIGhleSBodHRwczovL2dvb2dsZS5jb21odHRwczovL2dvb2dsZS5jb20gaHR0cHM6Ly9nb29nbGUuY29tIGFuZCBodHRwczovL2dvb2dsZS5jb20=",
			"9906;b;freudianweapon;319;1279975:9-18/1096265:20-28;Y2hlZXIzMTkgamVybWFIZWFydCBqZXJtYUpleDI="
		]
			);
		}, 0.5 * 1000);
	});
};
*/
//[debug_end]

//[debug_start]
/*

handle_irc_message({
	data: "@badges=broadcaster/1;bits=1;color=#1E90FF;display-name=Lazy_Luc;emotes=;id=31e2d815-db04-4b4a-bfce-058f8fc0a637;mod=0;room-id=84219088;subscriber=0;tmi-sent-ts=400;turbo=0;user-id=84219088;user-type= :lazy_luc!lazy_luc@lazy_luc.tmi.twitch.tv PRIVMSG #jerma985 :oh no, does this work?"
});

handle_irc_message({
	data: "@badges=broadcaster/1;bits=1;color=#1E90FF;display-name=Lazy_Luc;emotes=;id=31e2d815-db04-4b4a-bfce-058f8fc0a637;mod=0;room-id=84219088;subscriber=0;tmi-sent-ts=500;turbo=0;user-id=84219088;user-type= :lazy_luc!lazy_luc@lazy_luc.tmi.twitch.tv PRIVMSG #jerma985 :oh no, does this work?"
});

*/
//[debug_end]


//[debug_start]
get_recovery_data = (function(){
	//  Variables  //
	
	let counter = 0;
	let values = [];
	
	
	//  Test Data  //
	
	//When page first opens.
	//Final statistics:
	//    12 Subscriptions
	//    0 Giftsubs
	//    3 Cheers
	//    8 000 Bits
	values.push([
		0, ";s;Bet1",
		0, ";s;Bet2",
		0, ";s;Bet3",
		0, ";s;Bet4",
		0, ";s;Bet5",
		0, ";s;Bet6",
		0, ";s;Bet7",
		0, ";s;Bet8",
		0, ";s;Bet9",
		0, ";s;Bet10",
		100, ";s;Lazy_Luc",
		200, ";s;Spreeo",
		200, ";s;Spreeo",//Repeating
		
		400, ";b;Lazy_Luc;1000;;Y2hlZXIxMDAxIGhleQ==",
		400, ";b;Lazy_Luc;1000;;Y2hlZXIxMDAxIGhleQ==",//Repeating
		400, ";b;Lazy_Luc;2000;;Y2hlZXIxMDAxIGhleQ==",
		500, ";b;Spreeo;5000;;Y2hlZXIxMDAxIGhleQ==",
	]);
	
	//When reconnecting.
	//Final statistics:
	//    14 Subscriptions
	//    4 Giftsubs
	//    5 Cheers
	//    14 000 Bits
	values.push([
		100, ";s;Lazy_Luc",//Repeating
		300, ";s;Spreeo",
		300, ";s;IamMunkk",
		300, ";s;IamMunkk",//Repeating
		
		301, ";r;A_Lazy_Bot;1550",
		
		302, ";g;A_Lazy_Bot;Spreeo",
		303, ";g;A_Lazy_Bot;Lazy_Luc;3",
		
		300, ";b;Lazy_Luc;5000;;Y2hlZXIxMDAxIGhleQ==",
		400, ";b;Lazy_Luc;1000;;Y2hlZXIxMDAxIGhleQ==",//Repeating
		400, ";b;Spreeo;1000;;Y2hlZXIxMDAxIGhleQ==",
	]);
	
	
	//  Return  //
	
	return async function(){
		let value = values[counter];
		counter = ((counter + 1) % values.length);
		
		let output = [];
		let previous = 0;
		
		for(let i = 0;i < (value.length / 2);i += 1){
			let time = value[2 * i + 0];
			
			output.push(
				String(time - previous) + value[2 * i + 1]
			);
			
			previous = time;
		};
		console.log("input data", output);
		
		return output;
	};
})();

//alert("Problems: if there are duplicates they are still added during normal working. how about the queue? it also doesn't work as planned");

//[debug_end]
