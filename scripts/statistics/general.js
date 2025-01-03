"use strict";
//
//    Statistics
//
//Handles the general statistics stuff.
//


let statistics = {};

statistics.is_window_opened = false;
statistics.window_content_node = null;

statistics.data = {
	cheer_count: 0,
	total_bits: 0,
	subscriptions: 0,
	giftsubs: 0
};

statistics.header_button = document.querySelector(".header_button.stats_button");
