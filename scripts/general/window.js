"use strict";
//
//    Window Object
//
//Handles everything related to the window nodes. These windows can be created,
//closed, dragged and filled with any content.
//
//
//There can be any custom "window type", each of which can exist once and
//opening an existing window type simply gives focus to the existing one. The
//order in which one window is drawn over another is defined by the order they
//were last focused. A window can be moved within its parent, but can't clip out
//of it. When a window is dragged we keep track of the mouse position in the
//viewport and keep the window under the mouse when there is relative movement
//between the mouse and the window parent.
//

let windows = (function(){
	//  Variables  //
	
	//The parent node of all window nodes. It has to be a positioned element or
	//the document body for the window positioning to work correctly. It is the
	//bounding box for all windows, which they can't clip out of. If the
	//dimensions of the window parent changes then the "on_parent_resize"
	//function should be called. If the mouse moves in the viewport or the
	//window parent moves in the viewport, for example by scrolling or other
	//position changes except resizing that prevents dragging at the same time,
	//then call the function "on_relative_drag".
	//
	//If you change this value make sure to adjust the "scroll" and "resize"
	//event handling to fit your needs.
	let window_parent = document.body;
	
	//Keeps track of the window parent width and height to know what changed
	//in the "on_parent_resize" function.
	let parent_dimensions = window_parent.getBoundingClientRect();
	
	//The lowest z-index for windows in their window parent. The highest z-index
	//calculates as the base_zindex plus the different window types.
	let base_zindex = 10;
	
	//Returns the index of the window with the specified window type in the
	//"existing_windows" array. If the type is not used yet it returns the array
	//length instead of the expect -1.
	let get_window_type_index = function(type){
		let index = 0;
		
		for(;index < existing_windows.length;index += 1){
			if(existing_windows[index].type === type){
				break;
			}
		}
		
		return index;
	};
	
	//Each window type can exist once. Trying to create a second one moves the
	//first one to the foreground. The z-index is defined by the order in the
	//array.
	//
	//Each element has a structure like: {
	//    type: [window type]
	//    node: [HTML node]
	//    title_close_function: [null or function]
	//        Handles the window being closed.
	//}
	let existing_windows = [];
	
	
	//  Window Layering System  //
	
	//Moves the specified type of window in front of all other windows if that
	//type exists.
	let move_to_foreground = function(type){
		let index = get_window_type_index(type);
		
		//Last element or not in the array can be ignored.
		if(index >= (existing_windows.length - 1)){
			return;
		}
		
		let moved_window = existing_windows[index];
		
		for(;index < (existing_windows.length - 1);index += 1){
			existing_windows[index] = existing_windows[index + 1];
			existing_windows[index].node.style.zIndex = base_zindex + index;
		}
		
		existing_windows[index] = moved_window;
		existing_windows[index].node.style.zIndex = base_zindex + index;
	};
	
	//Sets the zIndex value of a newly created window to make it draw on top of
	//all others.
	let set_new_window_layering = function(node){
		node.style.zIndex = base_zindex + existing_windows.length;
	};
	
	//Reduces the zIndex values of all windows to the minimum values. This is
	//used to remove the value gap after a window was closed and keep them in
	//an allowed range.
	let fix_window_layering = function(starting_index){
		for(let index = starting_index;index < existing_windows.length;index += 1){
			existing_windows[index].node.style.zIndex = base_zindex + index;
		}
	};
	
	//When a window is clicked on it moves that window to the foreground.
	let move_to_foreground_function = function(){
		let type = this.children[0].children[0].getAttribute("data-window-type");
		let index = get_window_type_index(type);
		
		if(index === existing_windows.length){
			return;
		}
		
		move_to_foreground(type);
	};
	
	
	//  Create Window  //
	
	//
	//Returns either false if the window type already exists or an object
	//describing the new window.
	//
	//"type" has to be a valid window type. The create function is given the
	//window, title and content nodes of the window to fill the window with
	//content. The details argument is optional and can has the following
	//reserved properties:
	//    "relative_position"
	//        If set it should be an object with the "x" and "y" properties set
	//        to the viewport position the window should be relatively
	//        positioned to.
	//    "title_close_function"
	//        If set it should be null or a function that handles the closing of
	//        a window before it is removed from the document. It is given an
	//        object with the properties "type" and "node" for the window type
	//        and window node.
	//
	//The base strucutre of a window node looks like:
	//    <div class="window" style="z-index: [number >= 10];">
	//        <div class="window_title_container">
	//            <div class="window_title" data-window-type="[type]">[window title]</div>
	//            <div class="window_title_close"></div>
	//        </div>
	//        <div class="window_content">[window content]</div>
	//    </div>
	//
	let create_window = function(type, creation_function, details={}){
		//  Check Existing Windows  //
		
		for(let window_object of existing_windows){
			if(window_object.type === type){
				move_to_foreground(window_object.type);
				
				if(details.hasOwnProperty("relative_position")){
					relatively_position_window(window_object, details.relative_position);
				}
				
				return false;
			}
		}
		
		//  Creating Node  //
		
		let window_node = document.createElement("div");
		window_node.classList.add("window");
		window_node.addEventListener("mousedown", move_to_foreground_function);
		
		//Title
		
		let title_container_node = document.createElement("div");
		title_container_node.classList.add("window_title_container");
		
		let title_node = document.createElement("div");
		title_node.classList.add("window_title");
		title_node.setAttribute("data-window-type", type);
		title_node.addEventListener("mousedown", on_drag_start);
		
		let title_close_node = document.createElement("div");
		title_close_node.classList.add("window_title_close");
		let close_cross_node = get_close_cross_node();
		title_close_node.appendChild(close_cross_node);
		
		let title_close_function = null;
		if(typeof details.title_close_function === "function"){
			title_close_function = details.title_close_function;
		}
		
		title_close_node.addEventListener("click", title_close_event_handler);
		
		//Content
		
		let content_node = document.createElement("div");
		content_node.classList.add("window_content");
		
		//Appending
		
		title_container_node.appendChild(title_node);
		title_container_node.appendChild(title_close_node);
		window_node.appendChild(title_container_node);
		window_node.appendChild(content_node);
		
		//  Add Window content  //
		
		creation_function({
			window_node: window_node,
			title_node: title_node,
			content_node: content_node,
			window_type: type,
			
			details: details
		});
		
		//  Finish  //
		
		set_new_window_layering(window_node);
		
		let window_object = {
			type: type,
			node: window_node,
			title_close_function: title_close_function
		};
		
		window_parent.appendChild(window_node);
		
		if(details.hasOwnProperty("relative_position")){
			relatively_position_window(window_object, details.relative_position);
		} else {
			center_window(window_object);
		}
		
		existing_windows.push(window_object);
		
		return {
			window_node: window_node,
			title_node: title_node,
			content_node: content_node,
			window_type: type
		};
	};
	
	let get_close_cross_node = function(){
		let xmlns = "http://www.w3.org/2000/svg";
		
		let svg = document.createElementNS(xmlns, "svg");
		svg.setAttributeNS(null, "viewBox", "0 0 28 28");
		
		let line_1 = document.createElementNS(xmlns, "line");
		line_1.setAttributeNS(null, "x1", "7");
		line_1.setAttributeNS(null, "y1", "7");
		line_1.setAttributeNS(null, "x2", "21");
		line_1.setAttributeNS(null, "y2", "21");
		line_1.setAttributeNS(null, "stroke-width", "1.5");
		line_1.setAttributeNS(null, "stroke-linecap", "round");
		line_1.setAttributeNS(null, "stroke", "rgba(255, 255, 255, 1.0)");
		
		let line_2 = line_1.cloneNode();
		line_1.setAttributeNS(null, "y1", "21");
		line_1.setAttributeNS(null, "y2", "7");
		
		svg.appendChild(line_1);
		svg.appendChild(line_2);
		
		return svg;
	};
	
	//  Close Window  //
	
	//Takes a window type and closes that window if it exists.
	let close_window = function(type){
		//  Find the Window  //
		
		let index = get_window_type_index(type);
		
		if(index === existing_windows.length){
			return;
		}
		
		window_parent.removeChild(existing_windows[index].node);
		existing_windows.splice(index, 1);
		fix_window_layering(index);
	};
	
	//Handles the close event through the title bar and may execute an
	//associated function given at the window creation.
	let title_close_event_handler = function(event){
		let type = this.previousElementSibling.getAttribute("data-window-type");
		let index = get_window_type_index(type);
		
		if(index === existing_windows.length){
			return;
		}
		
		let window_object = existing_windows[index];
		
		if(typeof window_object.title_close_function === "function"){
			window_object.title_close_function({
				type: type,
				node: window_object.node
			});
		}
		
		close_window(type);
	};
	
	
	//  Move Window  //
	
	//Takes the window object, new x and y viewport positions and some bounding
	//data which was calculated in another function already and moves the window
	//to the closest valid position to the requested one.
	let move_window = function(window_object, viewport_x, viewport_y, bounding_data, parent_bounding_data){
		//  Viewport Position To Parent Position  //
		
		let parent_x = viewport_x - parent_bounding_data.left;
		let parent_y = viewport_y - parent_bounding_data.top;
		
		//  Moving Inbounds  //
		
		if((parent_x + bounding_data.width) > parent_bounding_data.width){
			parent_x = parent_bounding_data.width - bounding_data.width;
		}
		if((parent_y + bounding_data.height) > parent_bounding_data.height){
			parent_y = parent_bounding_data.height - bounding_data.height;
		}
		
		window_object.node.style.left = Math.max(0, parent_x) + "px";
		window_object.node.style.top = Math.max(0, parent_y) + "px";
	};
	
	//Centers a window in its parent.
	let center_window = function(window_object){
		let window_node = window_object.node;
		
		let bounding_data = window_node.getBoundingClientRect();
		let parent_bounding_data = window_parent.getBoundingClientRect();
		
		let position_x = (parent_bounding_data.width - bounding_data.width) / 2;
		let position_y = (parent_bounding_data.height - bounding_data.height) / 2;
		
		window_node.style.left = Math.max(0, position_x) + "px";
		window_node.style.top = Math.max(0, position_y) + "px";
	};
	
	//Takes a window object and a viewport position object and moves the window
	//to a place such that the given position is located in the lower center of
	//the window title.
	let relatively_position_window = function(window_object, relative_position){
		let bounding_data = window_object.node.getBoundingClientRect();
		
		let position_x = relative_position.x - (bounding_data.width / 2);
		let position_y = relative_position.y - 32;
		
		move_window(window_object, position_x, position_y, bounding_data, window_parent.getBoundingClientRect());
	};
	
	
	//  Window Events  //
	
	//Data related to dragging a window. The offset values are the offset
	//between the mouse and the window parent when the dragging started. The
	//window object is the currently dragged window and the last drag event is 
	//the event object last handled by dragging functions. It is used to keep 
	//track of the mouse position when moving the dragged window without a mouse
	//event.
	let drag_data = {
		offset_x: undefined,
		offset_y: undefined,
		last_drag_event: null,
		window_object: null
	};
	
	//Handles the starting event of dragging a window.
	let on_drag_start = function(event){
		//Ignore clicks other than left click.
		if(event.button !== 0){
			return;
		}
		
		event.preventDefault();
		
		let type = this.getAttribute("data-window-type");
		let index = get_window_type_index(type);
		
		if(index === existing_windows.length){
			return;
		}
		
		drag_data.window_object = existing_windows[index];
		
		let bounding_data = drag_data.window_object.node.getBoundingClientRect();
		
		//Getting the offset between the mouse and the window parent.
		drag_data.offset_x = event.clientX - bounding_data.left;
		drag_data.offset_y = event.clientY - bounding_data.top;
		
		drag_data.last_drag_event = event;
		
		//Attaching to the body instead of document disables events when the
		//mouse moves outside the viewport.
		document.addEventListener("mousemove", on_relative_drag);
		document.addEventListener("mouseup", on_drag_stop);
		window.addEventListener("scroll", on_window_scroll);
		
		if(typeof returned_object.callback_drag_start === "function"){
			returned_object.callback_drag_start(drag_data.window_object.node);
		}
	};
	
	//Handles all events in which a window is dragged and there is a relative
	//position change between the window parent and the mouse. This can happen
	//through mouse movement, window scrolling or other things that move the
	//window parent in the viewport.
	let on_relative_drag = function(event){
		event.preventDefault();
		
		let bounding_data = drag_data.window_object.node.getBoundingClientRect();
		let parent_bounding_data = window_parent.getBoundingClientRect();
		
		//The new position comes from the mouse viewport position being
		//calculated to the new window node viewport position to the new
		//position in the window parent.
		let new_x = event.clientX - drag_data.offset_x;
		let new_y = event.clientY - drag_data.offset_y;
		
		move_window(drag_data.window_object, new_x, new_y, bounding_data, parent_bounding_data);
		
		drag_data.last_drag_event = event;
	};
	
	//Triggers the movement of the currently dragged window to the last seen
	//mouse position.
	let on_window_scroll = function(event){
		on_relative_drag(drag_data.last_drag_event);
	};
	
	//Handles the stop event of dragging a window.
	let on_drag_stop = function(event){
		event.preventDefault();
		
		document.removeEventListener("mousemove", on_relative_drag);
		document.removeEventListener("mouseup", on_drag_stop);
		window.removeEventListener("scroll", on_window_scroll);
		
		if(typeof returned_object.callback_drag_stop === "function"){
			returned_object.callback_drag_stop(drag_data.window_object.node);
		}
		
		drag_data.offset_x = undefined;
		drag_data.offset_y = undefined;
		drag_data.last_drag_event = null;
		drag_data.window_object = null;
	};
	
	
	//  Adjust Window Positons On Parent Resize  //
	
	//Adjusts window positions to a changed window parent size. Reduced
	//dimensions move windows back inbounds if they clip out of the window
	//parent and adjust a dragged window's position if the resize gives it more
	//room to be closer to the optimal position.
	let on_parent_resize = function(event){
		let old_parent_dimensions = parent_dimensions;
		parent_dimensions = window_parent.getBoundingClientRect();
		
		if(existing_windows.length === 0){
			return;
		}
		
		if(drag_data.last_drag_event !== null){
			let new_x = drag_data.last_drag_event.clientX - drag_data.offset_x;
			let new_y = drag_data.last_drag_event.clientY - drag_data.offset_y;
			
			move_window(drag_data.window_object, new_x, new_y, drag_data.window_object.node.getBoundingClientRect(), parent_bounding_data);
		}
		
		//No need to move windows back inbounds if the window parent got larger.
		if(parent_dimensions.width < old_parent_dimensions.width
		|| parent_dimensions.height < old_parent_dimensions.height){
			let parent_bounding_data = parent_dimensions;
			let bounding_data;
			
			for(let window_object of existing_windows){
				bounding_data = window_object.node.getBoundingClientRect();
				
				if(bounding_data.right > parent_bounding_data.right
				|| bounding_data.bottom > parent_bounding_data.bottom){
					move_window(window_object, bounding_data.left, bounding_data.top, bounding_data, parent_bounding_data);
				}
			}
		}
	};
	
	//The parent resizes with the window.
	window.addEventListener("resize", on_parent_resize);
	
	
	//  Return Object  //
	
	let returned_object = {
		//Call to create a window.
		create: create_window,
		//Call to close a window.
		close: close_window,
		
		//Call when the dimensions of the window parent changed.
		on_parent_resize: on_parent_resize,
		
		//Function being executed when a dragging event starts. It is given the
		//window node of the dragged window.
		callback_drag_start: null,
		//Function being executed when a dragging event stops. It is given the
		//window node of the dragged window.
		callback_drag_stop: null,
		//Call when a window is dragged and the window parent moved in the
		//viewport other than by scrolling of the window.
		on_relative_drag: on_relative_drag
	};
	
	return returned_object;
})();
