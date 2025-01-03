"use strict";
//
//    SVG Animations
//
//Animates the hide and show svg.
//

//If the "everything" tab is shown.
let everything_visible = true;

(function(){
	//  Variables  //
	
	let center = 8;
	let radius = 6;
	let x_offset = 0.75;
	
	let svg_parent = hide_svg.parentElement;
	let svg_transform_class = "hide_svg_transform";
	
	let scroll_parent = all_infos_container_node.children[1];
	let scroll_transform_class = "scroll_transform";
	
	let all_resume_box = document.querySelector("#all_infos_container_node .resume_scroll_box");
	let resume_force_hide_class = "resume_scroll_force_hide";
	
	//  Functions  //
	
	hide_svg.onclick = function(){
		if(everything_visible === false){
			everything_visible = true;
			
			svg_parent.classList.remove(svg_transform_class);
			scroll_parent.classList.remove(scroll_transform_class);
			all_resume_box.classList.remove(resume_force_hide_class);
		} else {
			everything_visible = false;
			
			svg_parent.classList.add(svg_transform_class);
			scroll_parent.classList.add(scroll_transform_class);
			all_resume_box.classList.add(resume_force_hide_class);
		}
	};
})();
