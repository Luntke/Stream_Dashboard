"use strict";
//
//    Restore Window
//
//Handles the restore window.
//

restore.window_create_select_function = function(details){
	let window_node = details.window_node;
	let title_node = details.title_node;
	let content_node = details.content_node;
	
	window_node.setAttribute("data-window-type", details.window_type);
	
	//  Title  //
	
	title_node.innerText = "Restore";
	
	//  General  //
	
	if(past_streams.length === 0){
		let description = document.createElement("div");
		description.innerText = "There are no archived streams.";
		content_node.appendChild(description);
		return;
	} else {
		let description = document.createElement("div");
		description.innerText = "Here you can select a VOD from the past 60 days to see the events from that stream.";
		description.className = "restore_description";
		content_node.appendChild(description);
	}
	
	let restore_selection_container = document.createElement("div");
	restore_selection_container.id = "restore_selection_container";
	content_node.appendChild(restore_selection_container);
	
	for(let i = 0;i < past_streams.length;i += 1){
		restore_selection_container.appendChild(restore.get_vod_element(past_streams[i]));
	}
};

restore.header_button.onclick = function(event){
	windows.create("restore", restore.window_create_select_function, {
		relative_position: {
			x: event.clientX,
			y: event.clientY
		}
	});
};

restore.get_vod_element = function(stream_object){
	//Example stream object: {
	//    duration: 19683000
	//    start_time: 1550448000000
	//    thumbnail_url: "https://static-cdn.jtvnw.net/s3_vods/84fae5847fb7ae0f6ad3_jerma985_32791074928_1118068401/thumb/thumb0-%{width}x%{height}.jpg"
	//    title: "VR Coal Miner"
	//}
	
	let container = document.createElement("div");
	container.className = "restore_vod_element";
	container.setAttribute("data-stream-time", stream_object.start_time);
	container.addEventListener("click", restore.on_vod_click);
	
	let vod_image = document.createElement("div");
	vod_image.className = "vod_image";
	
	//The thumbnail has a lot less JPEG artifacts when fetching an image twice
	//the size we want to display at. Beyond that is pretty much no difference.
	let thumbnail = get_img_node();
	thumbnail.src = stream_object.thumbnail_url.replace("%{width}", "320").replace("%{height}", "180");
	
	let vod_text = document.createElement("div");
	vod_text.className = "vod_text";
	
	let vod_stream_title = document.createElement("div");
	vod_stream_title.className = "vod_stream_title";
	vod_stream_title.innerText = stream_object.title;
	
	let vod_duration = document.createElement("span");
	vod_duration.className = "vod_duration";
	vod_duration.innerText = restore.get_display_duration(stream_object.duration);
	
	let vod_publish_time = document.createElement("span");
	vod_publish_time.className = "vod_publish_time";
	vod_publish_time.innerText = restore.get_days_ago(stream_object.start_time);
	
	
	container.appendChild(vod_image);
		vod_image.appendChild(thumbnail);
	container.appendChild(vod_text);
		vod_text.appendChild(vod_stream_title);
		vod_text.appendChild(vod_duration);
		vod_text.appendChild(vod_publish_time);
	
	return container;
};
