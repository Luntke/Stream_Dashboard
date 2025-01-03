<?php

//Disable Caching of the document.
//Source: https://stackoverflow.com/questions/49547/how-to-control-web-page-caching-across-all-browsers#answer-2068407
header("Cache-Control: no-store, must-revalidate");//HTTP 1.1.
header("Expires: 0");//Proxies.

?><!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<title>StreamDashboard - jerma.org</title>
	<meta name="description" content="A stream dashboard for the Twitch channel Jerma985."/>
	<!--meta name="robots" content="noindex, nofollow"/-->
	<meta name="author" content="Merlin Luntke, Twitch Lazy_Luc"/>
	<link rel="icon" type="image/png" sizes="112x112" href="https://jerma.org/mustard_files/spreeo_heart.png"/>
	<link rel="apple-touch-icon" type="image/png" sizes="112x112" href="https://jerma.org/mustard_files/spreeo_heart.png"/>
	
	<link href="https://jerma.org/mustard_files/styles_v165.min.css" rel="stylesheet" type="text/css"/>
<style>
.credits_button {
    display: none!important;
}
.restore_content .restore_statistics {
    width: 408px;
    margin: 8px 20px 8px 20px;
}
</style>
</head>
<body>

<!--
	HTML
-->

<div id="loading_screen_node">
	<div>
		<p><!-- "Loading" --></p>
		<div id="loading_screen_bar_node">
			<div id="loading_screen_progress_node"></div>
		</div>
	</div>
</div>


<div id="dashboard_container_node" class="display_none">
	<div id="header_node">
		<div class="main_headline"
			><div class="headline_backlight"></div
			><img src="https://jerma.org/mustard_files/spreeo_heart.png" alt="spreeoLove" class="headline_emote" referrerpolicy="no-referrer"
			><span><span class="tall">S</span>tream<span class="tall">D</span>ashboard</span
		></div>
		
		<div id="header_buttons_container_node">
			<div class="header_button about_button">About</div>
			<div class="header_button restore_button">Restore</div>
			<div class="header_button credits_button">Credits</div>
			<div class="header_button stats_button">Statistics</div>
			<div id="online_status_text"></div>
			<div id="online_status_icon"><div></div></div>
		</div>
	</div>
	<div id="important_infos_container_node">
		<div class="headline_container">
			<div class="resume_scroll_box"></div>
			
			<div class="headline" id="panel_left_headline">Important</div>
			
			<div class="headline_icons">
				<svg id="settings_svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<line id="tooth" x1="8" y1="4" x2="8" y2="3" stroke-width="1.5" stroke-linecap="round"/>
					</defs>
					
					<g stroke="#ffffff">
						<circle cx="8" cy="8" r="3.5" stroke-width="1.5" fill="none"/>
						
						<use href="#tooth" x="0" y="0" transform="rotate(0 8 8)"/>
						<use href="#tooth" x="0" y="0" transform="rotate(32.72727272727273 8 8)"/>
						<use href="#tooth" x="0" y="0" transform="rotate(65.45454545454545 8 8)"/>
						<use href="#tooth" x="0" y="0" transform="rotate(98.18181818181819 8 8)"/>
						<use href="#tooth" x="0" y="0" transform="rotate(130.9090909090909 8 8)"/>
						<use href="#tooth" x="0" y="0" transform="rotate(163.63636363636363 8 8)"/>
						<use href="#tooth" x="0" y="0" transform="rotate(196.36363636363637 8 8)"/>
						<use href="#tooth" x="0" y="0" transform="rotate(229.0909090909091 8 8)"/>
						<use href="#tooth" x="0" y="0" transform="rotate(261.8181818181818 8 8)"/>
						<use href="#tooth" x="0" y="0" transform="rotate(294.54545454545456 8 8)"/>
						<use href="#tooth" x="0" y="0" transform="rotate(327.27272727272725 8 8)"/>
					</g>
				</svg>
			</div>
		</div>
		<div class="scroll_block">
			<div id="important_infos_node" class="data_container"><!--
				Only important informations are added here.
			--></div>
		</div>
	</div>
	<div id="all_infos_container_node">
		<div class="headline_container">
			<div class="resume_scroll_box"></div>
			
			<div class="headline" id="panel_right_headline">Everything</div>
			
			<div class="headline_icons">
				<svg id="hide_svg" viewBox="-2 -2 20 20" xmlns="http://www.w3.org/2000/svg">
					<ellipse cx="8" cy="8" rx="6" ry="4" stroke-width="1.5" stroke="#ffffff" fill="none"/>
					<circle cx="8" cy="8" r="2.5" fill="#ffffff"/>
					<line id="hide_svg_line_1" x1="2.75" y1="14" x2="14.75" y2="2" stroke-width="1.5" stroke-linecap="round" stroke="hsl(0, 40%, 29%)"/>
					<line id="hide_svg_line_2" x1="1.25" y1="14" x2="13.25" y2="2" stroke-width="1.5" stroke-linecap="round" stroke="#ffffff"/>
				</svg>
			</div>
		</div>
		<div class="scroll_block">
			<div id="all_infos_node" class="data_container"><!--
				All Informations are added here.
			--></div>
		</div>
	</div>
</div>


<!--
	Scripts
-->


<script>
let client_time_offset = ((<?php echo microtime(true);?> * 1000) - performance.timing.responseStart);
</script>
<script src="https://jerma.org/mustard_files/scripts_v165.js"></script>


</body>
</html>