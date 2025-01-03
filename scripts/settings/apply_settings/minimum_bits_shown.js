"use strict";
//
//    Minimum Bits Shown
//
//Applies the setting "minimum_bits_shown" to all data objects.
//

settings.apply_minimum_bits_shown = (function(){
	let style_node = document.createElement("style");
	document.head.appendChild(style_node);
	let style_sheet = style_node.sheet;
	
	const css_selector = ".data_container > [data-below-minimum='1']";
	const css_style_show = "display: block;";
	const css_style_hide = "display: none;";
	
	return function(new_value){
		while(style_sheet.cssRules.length > 0){
			style_sheet.deleteRule(style_sheet.cssRules.length - 1);
		}
		
		let css_style;
		
		if(new_value === true){
			css_style = css_style_show;
		} else {
			css_style = css_style_hide;
		}
		
		style_sheet.insertRule(css_selector + "{" + css_style + "}", style_sheet.cssRules.length);
	};
})();
