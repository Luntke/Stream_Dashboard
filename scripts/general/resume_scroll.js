"use strict";
//
//    Resume Scroll
//
//The two event panels can have content added to it. If they are not scrolled to
//the top then new content will not come into view. The resume scroll box
//reminds the user that the panel is not scrolled up and a click on it will get
//them back to the top.
//

(function(){
	//  Functions  //
	
	//The click event handler for the resume_scroll nodes. A click will scroll
	//the panel back up and hide the clicked node.
	let resume_scroll_on_click = function(){
		this.scroll_block.scrollTop = 0;
		this.scroll_block.was_at_top = true;
		this.classList.add("resume_scroll_hide");
	};
	
	//The scroll event handler for the scroll_block nodes. If the scroll_block
	//was scrolled from or to the top position then show or hide the
	//resume_scroll node.
	let scroll_block_on_scroll = function(event){
		let is_at_top = (this.scrollTop === 0);
		
		if(is_at_top !== this.was_at_top){
			this.was_at_top = is_at_top;
			
			if(is_at_top){
				this.resume_scroll.classList.add("resume_scroll_hide");
			} else {
				this.resume_scroll.classList.remove("resume_scroll_hide");
			}
		}
	};
	
	
	//  Setting Up  //
	
	let resume_scroll_nodes = document.querySelectorAll(".resume_scroll_box");
	
	for(let resume_scroll_node of resume_scroll_nodes){
		let scroll_block = resume_scroll_node.parentElement.parentElement.querySelector(".scroll_block");
		resume_scroll_node.classList.add("resume_scroll_hide");
		
		resume_scroll_node.innerText = "Scroll to Top";
		scroll_block.was_at_top = true;
		
		resume_scroll_node.scroll_block = scroll_block;
		scroll_block.resume_scroll = resume_scroll_node;
		
		resume_scroll_node.onclick = resume_scroll_on_click;
		scroll_block.onscroll = scroll_block_on_scroll;
	}
})();
