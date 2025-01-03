"use strict";
//
//    About
//
//Handles the the about window.
//

let about = {};

about.header_button = document.querySelector(".header_button.about_button");

about.header_button.onclick = function(event){
	windows.create("about", about.window_create_function, {
		relative_position: {
			x: event.clientX,
			y: event.clientY
		}
	});
};

about.window_create_function = function(details){
	let window_node = details.window_node;
	let title_node = details.title_node;
	let content_node = details.content_node;
	
	window_node.setAttribute("data-window-type", details.window_type);
	
	//  Title  //
	
	title_node.innerText = "About";
	
	//  General  //
	
	let karma = {
		type: "link",
		href: "https://www.twitch.tv/karma_komaeda",
		text: "Karma_Komaeda"
	};
	
	let twitch = {
		type: "link",
		href: "https://www.twitch.tv/",
		text: "Twitch"
	};
	
	let bttv = {
		type: "link",
		href: "https://betterttv.com/",
		text: "BTTV"
	};
	
	let ffz = {
		type: "link",
		href: "https://www.frankerfacez.com/",
		text: "FFZ"
	};
	
	let twemoji = {
		type: "link",
		href: "https://twemoji.twitter.com/",
		text: "Twemoji"
	};
	
	let lazy_luc = {
		type: "link",
		href: "https://www.twitch.tv/lazy_luc",
		text: "Lazy_Luc"
	};
	
	let jermaHeart = {
		type: "image",
		src: "https://static-cdn.jtvnw.net/emoticons/v1/1279975/1.0",
		title: "jermaHeart"
	};
	
	let description = to_formatted_text_node`This page gives you live updates about cheers, community gifts and raids from Jerma985's Twitch stream. You can see stream events from older streams by using the restore feature.
	
	If you want to see the name of an emote hover your mouse above it. Usernames are displayed with the capitalization set by the users themselves, but will always be in the Latin alphabet.
	
	Let me give credit to ${karma} for letting me use their seagull drawing as the logo (click on it for more info), credit to ${twitch}, ${bttv} and ${ffz} for their API, cheermotes and emotes and credit to the Twitter project ${twemoji} for their emoji.
	
	This site is not associated with Jerma985. I, ${lazy_luc}, just made it because Jerma used to lose bit messages pretty frequently and I wanted a backup for them. Anyway, thank you for using this site ${jermaHeart}`;
	
	content_node.appendChild(description);
	content_node.style.textAlign = "justify";
};
