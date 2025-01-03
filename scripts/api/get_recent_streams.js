"use strict";
//
//    Get Recent Streams
//
//Fetches data on the most recent streams.
//

let get_recent_streams = async function(){
	try {
		let url = "https://jerma.org/twitch_api/get_videos_v1.php";
		let response = await fetch(url, {
			method: "GET",
			mode: "cors",
			credentials: "omit",
			cache: "no-cache",
			redirect: "follow",
			referrerPolicy: "no-referrer"
		});
		
		let response_data = await response.json();
		
		if(response_data.is_error === true){
			throw null;
		}
		
		return response_data.data;
	} catch(error){
		console.error(error);
		console.log("Error loading stream data.");
		
		//On error returns an empty list of streams and extends the initial
		//restore age to include a possible current stream.
		
		if(page_still_loading === true){
			data.earliest_bot_disconnect = data.earliest_bot_disconnect_stream_error;
		}
		
		return ([]);
	}
};

//[debug_start]
/*
let get_recent_streams = function(){
	return new Promise(function(resolve, reject){
		//Only videos by the user.
		//Only VODs.
		//Up to 100 VODS, which is the maximum amount to request, but received
		//amount probably around 30-40, as VODs get deleted after 60 days.
		let url = ("https://api.twitch.tv/helix/videos?" +
			"user_id=" + encodeURIComponent(user_id) + "&" +
			"type=archive" + "&" +
			"first=100"
		);
		
		fetch(url, {
			method: "GET",
			headers: {
				"Client-ID": client_id
			},
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
			resolve(information.data);
		})
		.catch(function(error){
			reject();
		});
	});
};
*/
//[debug_end]
//[debug_start]
/*
get_recent_streams = function(){
	return new Promise(function(resolve, reject){
		window.setTimeout(function(){
			resolve(
		[{"id":"427164958","user_id":"23936415","user_name":"Jerma985","title":"Blue Suit and Naked Other Animal S2-E3","description":"","created_at":"2119-05-19T21:09:05Z","published_at":"2119-05-19T21:09:05Z","url":"https://www.twitch.tv/videos/427164958","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/7649e4bdbaf992d40225_jerma985_34187682672_1205392032/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":8106,"language":"en","type":"archive","duration":"5h10m8s"},{"id":"426713406","user_id":"23936415","user_name":"Jerma985","title":"MS-DOS Grab Bag","description":"","created_at":"2119-05-18T22:38:38Z","published_at":"2119-05-18T22:38:38Z","url":"https://www.twitch.tv/videos/426713406","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/6a0142eb159cac52d35b_jerma985_34173100176_1204480437/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":6938,"language":"en","type":"archive","duration":"7h3m48s"},{"id":"425306152","user_id":"23936415","user_name":"Jerma985","title":"Computers def replace Humans in like 2040","description":"","created_at":"2119-05-15T20:25:51Z","published_at":"2119-05-15T20:25:51Z","url":"https://www.twitch.tv/videos/425306152","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/c0a91aca9cf3a2e53ee8_jerma985_34131323808_1201868710/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":11650,"language":"en","type":"archive","duration":"4h31m12s"},{"id":"424876027","user_id":"23936415","user_name":"Jerma985","title":"A Whole Day Gone (Not gettin this one back)","description":"","created_at":"2119-05-14T20:33:36Z","published_at":"2119-05-14T20:33:36Z","url":"https://www.twitch.tv/videos/424876027","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/3fb5b6a05ddc474b47c2_jerma985_34119456432_1201126800/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":6904,"language":"en","type":"archive","duration":"7h23m32s"},{"id":"423602513","user_id":"23936415","user_name":"Jerma985","title":"MS-DOS Archive Adventure","description":"","created_at":"2119-05-11T21:35:50Z","published_at":"2119-05-11T21:35:50Z","url":"https://www.twitch.tv/videos/423602513","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/474f6b303f53f0122347_jerma985_34080850832_1198712684/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":12494,"language":"en","type":"archive","duration":"7h24m33s"},{"id":"423135530","user_id":"23936415","user_name":"Jerma985","title":"You crack me up little buddy 2","description":"","created_at":"2119-05-10T23:00:10Z","published_at":"2119-05-10T23:00:10Z","url":"https://www.twitch.tv/videos/423135530","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/87ad541206f129b3164a_jerma985_34066199808_1197796660/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":9895,"language":"en","type":"archive","duration":"6h19m8s"},{"id":"422577276","user_id":"23936415","user_name":"Jerma985","title":"Day Dreaming","description":"","created_at":"2119-05-09T18:12:10Z","published_at":"2119-05-09T18:12:10Z","url":"https://www.twitch.tv/videos/422577276","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/4befcaae6a7c649c50be_jerma985_34050140032_1196792445/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":4891,"language":"en","type":"archive","duration":"3h38m44s"},{"id":"422251853","user_id":"23936415","user_name":"Jerma985","title":"Fumbling around in Dreams","description":"","created_at":"2119-05-08T22:58:58Z","published_at":"2119-05-08T22:58:58Z","url":"https://www.twitch.tv/videos/422251853","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/c48ee2046998e74edc7c_jerma985_34040964048_1196218666/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":5272,"language":"en","type":"archive","duration":"7h4m55s"},{"id":"420990132","user_id":"23936415","user_name":"Jerma985","title":"Finishing up Season 1 ","description":"","created_at":"2119-05-05T22:59:23Z","published_at":"2119-05-05T22:59:23Z","url":"https://www.twitch.tv/videos/420990132","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/6c1d2574f15e66d4d035_jerma985_34004796848_1193957043/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":7550,"language":"en","type":"archive","duration":"6h22m9s"},{"id":"420501251","user_id":"23936415","user_name":"Jerma985","title":"Cardboard VR","description":"","created_at":"2119-05-04T23:04:50Z","published_at":"2119-05-04T23:04:50Z","url":"https://www.twitch.tv/videos/420501251","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/671d84d9e65416318ea0_jerma985_33989395536_1192993968/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":7891,"language":"en","type":"archive","duration":"7h55m56s"},{"id":"419086020","user_id":"23936415","user_name":"Jerma985","title":"Sam and my good friend Max S1","description":"","created_at":"2119-05-01T22:58:32Z","published_at":"2119-05-01T22:58:32Z","url":"https://www.twitch.tv/videos/419086020","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/7110efd2b3b9905587c7_jerma985_33946368336_1190303674/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":15049,"language":"en","type":"archive","duration":"8h18m50s"},{"id":"418628759","user_id":"23936415","user_name":"Jerma985","title":"Lardlord","description":"","created_at":"2119-04-30T22:59:51Z","published_at":"2119-04-30T22:59:51Z","url":"https://www.twitch.tv/videos/418628759","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/177dcfd62096422e0f89_jerma985_33932722864_1189450325/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":8237,"language":"en","type":"archive","duration":"6h12m20s"},{"id":"418198542","user_id":"23936415","user_name":"Jerma985","title":"Sleeping Stream","description":"","created_at":"2119-04-29T22:59:44Z","published_at":"2119-04-29T22:59:44Z","url":"https://www.twitch.tv/videos/418198542","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/32bfcff4a26638cdcfb1_jerma985_33919864672_1188646231/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":11596,"language":"en","type":"archive","duration":"6h46m24s"},{"id":"413659333","user_id":"23936415","user_name":"Jerma985","title":"Just chillin with this Dog and Hare","description":"","created_at":"2119-04-20T01:50:50Z","published_at":"2119-04-20T01:50:50Z","url":"https://www.twitch.tv/videos/413659333","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/76b092fa4e3750497a11_jerma985_33773597392_1179500296/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":20760,"language":"en","type":"archive","duration":"7h7m12s"},{"id":"413083399","user_id":"23936415","user_name":"Jerma985","title":"This look likes Borderlands","description":"","created_at":"2119-04-18T23:01:43Z","published_at":"2119-04-18T23:01:43Z","url":"https://www.twitch.tv/videos/413083399","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/c501561269bced8427f4_jerma985_33754724848_1178320421/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":7203,"language":"en","type":"archive","duration":"6h13m27s"},{"id":"412673592","user_id":"23936415","user_name":"Jerma985","title":"Modded BO3 Zombies Hell","description":"","created_at":"2119-04-18T01:18:02Z","published_at":"2119-04-18T01:18:02Z","url":"https://www.twitch.tv/videos/412673592","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/23d8a01b6f9a896e2a51_jerma985_33741626512_1177501403/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":11189,"language":"en","type":"archive","duration":"6h56m58s"},{"id":"412098878","user_id":"23936415","user_name":"Jerma985","title":"VRChat Safari","description":"","created_at":"2119-04-16T21:16:34Z","published_at":"2119-04-16T21:16:34Z","url":"https://www.twitch.tv/videos/412098878","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/fa03564365662827e4ea_jerma985_33723392768_1176361173/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":9268,"language":"en","type":"archive","duration":"5h55m9s"},{"id":"410675466","user_id":"23936415","user_name":"Jerma985","title":"The Tinkerer","description":"","created_at":"2119-04-13T22:39:16Z","published_at":"2119-04-13T22:39:16Z","url":"https://www.twitch.tv/videos/410675466","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/336dcff0ea07679b3415_jerma985_33677089440_1173465702/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":9956,"language":"en","type":"archive","duration":"4h36m30s"},{"id":"410150417","user_id":"23936415","user_name":"Jerma985","title":"Taking things apart in VR","description":"","created_at":"2119-04-12T23:19:03Z","published_at":"2119-04-12T23:19:03Z","url":"https://www.twitch.tv/videos/410150417","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/d3a500e99185abdfb9b9_jerma985_33659530208_1172367726/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":8604,"language":"en","type":"archive","duration":"5h25m48s"},{"id":"409215382","user_id":"23936415","user_name":"Jerma985","title":"Improv Acting Workshop 103 (Deposits are due - $500)","description":"","created_at":"2119-04-10T23:31:23Z","published_at":"2119-04-10T23:31:23Z","url":"https://www.twitch.tv/videos/409215382","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/295331cf0699a62bd151_jerma985_33630611152_1170559497/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":16661,"language":"en","type":"archive","duration":"7h55m11s"},{"id":"407272532","user_id":"23936415","user_name":"Jerma985","title":"Mr Mosquito's Blood Quench","description":"","created_at":"2119-04-06T22:49:06Z","published_at":"2119-04-06T22:49:06Z","url":"https://www.twitch.tv/videos/407272532","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/cb8ee500ce151b2e7505_jerma985_33570899328_1166825878/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":13388,"language":"en","type":"archive","duration":"6h16m16s"},{"id":"406730160","user_id":"23936415","user_name":"Jerma985","title":"Cloudy with a Risk of Rain 2","description":"","created_at":"2119-04-05T23:14:36Z","published_at":"2119-04-05T23:14:36Z","url":"https://www.twitch.tv/videos/406730160","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/02f0e685f542e44dcaa1_jerma985_33553125296_1165714469/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":6704,"language":"en","type":"archive","duration":"7h8m24s"},{"id":"406220153","user_id":"23936415","user_name":"Jerma985","title":"The 5 Horses of the Apocalypse","description":"","created_at":"2119-04-04T22:40:26Z","published_at":"2119-04-04T22:40:26Z","url":"https://www.twitch.tv/videos/406220153","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/babe064e61fbb1b0896c_jerma985_33537809664_1164756879/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":7228,"language":"en","type":"archive","duration":"8h1m54s"},{"id":"405246477","user_id":"23936415","user_name":"Jerma985","title":"Splicing DNA on the Ranch","description":"","created_at":"2119-04-02T22:43:03Z","published_at":"2119-04-02T22:43:03Z","url":"https://www.twitch.tv/videos/405246477","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/764f3838d2bb04ef3eba_jerma985_33509076160_1162960166/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":15116,"language":"en","type":"archive","duration":"7h48m48s"},{"id":"404317171","user_id":"23936415","user_name":"Jerma985","title":"Creating Life ","description":"","created_at":"2119-03-31T22:59:56Z","published_at":"2119-03-31T22:59:56Z","url":"https://www.twitch.tv/videos/404317171","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/dced883dafb296bb3459_jerma985_33480439568_1161169595/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":14183,"language":"en","type":"archive","duration":"8h1m10s"},{"id":"402700999","user_id":"23936415","user_name":"Jerma985","title":"Shadows hopefully finish this game tonight and not get stuck for 4 hours on one boss Twice","description":"","created_at":"2119-03-28T23:00:14Z","published_at":"2119-03-28T23:00:14Z","url":"https://www.twitch.tv/videos/402700999","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/814a76b925e65789deec_jerma985_33427294352_1157845248/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":7068,"language":"en","type":"archive","duration":"7h39m29s"},{"id":"402200514","user_id":"23936415","user_name":"Jerma985","title":"Shinobi Groundhog Day","description":"","created_at":"2119-03-27T22:29:18Z","published_at":"2119-03-27T22:29:18Z","url":"https://www.twitch.tv/videos/402200514","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/adcf569406470e130ea8_jerma985_33412132672_1156897031/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":7840,"language":"en","type":"archive","duration":"8h26m42s"},{"id":"401700091","user_id":"23936415","user_name":"Jerma985","title":"I like to pretend that I'm cold medicine in this game, fighting germs in someones body :)","description":"","created_at":"2119-03-26T22:21:28Z","published_at":"2119-03-26T22:21:28Z","url":"https://www.twitch.tv/videos/401700091","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/a9e9988ca2168b608c67_jerma985_33396566256_1155923790/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":9602,"language":"en","type":"archive","duration":"7h45m0s"},{"id":"400123454","user_id":"23936415","user_name":"Jerma985","title":"Cough Cough, Slash Slash","description":"","created_at":"2119-03-23T20:58:02Z","published_at":"2119-03-23T20:58:02Z","url":"https://www.twitch.tv/videos/400123454","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/58a3a5081259d2dfc340_jerma985_33345619440_1152738480/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":11869,"language":"en","type":"archive","duration":"7h55m2s"},{"id":"399515793","user_id":"23936415","user_name":"Jerma985","title":"Christmas Morning Sekiro","description":"","created_at":"2119-03-22T20:14:51Z","published_at":"2119-03-22T20:14:51Z","url":"https://www.twitch.tv/videos/399515793","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/bfcde9dafd21823e735f_jerma985_33325162688_1151459614/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":17830,"language":"en","type":"archive","duration":"9h8m6s"},{"id":"385091075","user_id":"23936415","user_name":"Jerma985","title":"PS2 Pile","description":"","created_at":"2119-02-23T00:00:06Z","published_at":"2119-02-23T00:00:06Z","url":"https://www.twitch.tv/videos/385091075","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/d137b3e694b815ca2536_jerma985_32872811200_1123177710/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":10157,"language":"en","type":"archive","duration":"8h14m46s"},{"id":"260403336","user_id":"23936415","user_name":"Jerma985","title":"Adult Leap Frog","description":"","created_at":"2018-05-12T02:23:29Z","published_at":"2018-05-12T02:23:29Z","url":"https://www.twitch.tv/videos/260403336","thumbnail_url":"https://static-cdn.jtvnw.net/s3_vods/cd2a99ae5d71ee06d130_jerma985_28663581040_860143979/thumb/thumb0-%{width}x%{height}.jpg","viewable":"public","view_count":5218,"language":"en","type":"archive","duration":"5h18m30s"}]
			);
		}, 0.5 * 1000);
	});
};
*/
//[debug_end]