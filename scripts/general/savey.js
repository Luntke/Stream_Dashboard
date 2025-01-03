"use strict";
//
//    Savey
//
//The seagull savey brings warms to this page. It can be found.
//

let savey = {};

savey.img_node = document.querySelector(".headline_emote");

savey.img_node.onclick = function(event){
	windows.create("savey", savey.window_create_function, {
		relative_position: {
			x: 0,
			y: (48 + 32)
		}
	});
};

savey.window_create_function = function(details){
	let window_node = details.window_node;
	let title_node = details.title_node;
	let content_node = details.content_node;
	
	window_node.setAttribute("data-window-type", details.window_type);
	
	//  Title  //
	
	title_node.innerText = "Savey";
	
	//  General  //
	
	let img = get_img_node();
	img.src = "https://jerma.org/mustard_files/spreeo_heart.png";
	img.style.width = "112px";
	img.style.height = "112px";
	
	let karma = {
		type: "link",
		href: "https://www.twitch.tv/karma_komaeda",
		text: "Karma_Komaeda"
	};
	let spreeo = {
		type: "link",
		href: "https://www.twitch.tv/spreeo",
		text: "Spreeo"
	};
	
	let description = to_formatted_text_node`This seagull is called Savey. He was hatched (created) under ${karma}'s care and saved years later by ${spreeo} after being lost in a desert. It is distinguishable by its big heart.`;
	
	content_node.appendChild(description);
	content_node.style.textAlign = "justify";
	
	let table = document.createElement("table");
	content_node.appendChild(table);
	let row = table.insertRow();
	
	let cell_1 = row.insertCell();
	cell_1.appendChild(img);
	
	let cell_2 = row.insertCell();
	cell_2.style.paddingLeft = "20px";
	cell_2.appendChild(description);
};
