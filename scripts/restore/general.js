"use strict";
//
//    Restore
//
//Handles the general restore stuff.
//

let restore = {};

//The minimum time that a stream has to have started at to be able to restore
//data from it. It was previously used to filter out streams for which there was
//no data yet. Currently, Twitch deletes VODs after 60 days of their creation
//time, but in a few cases keeps the stream in the API data. Setting this value
//to be 60 days in the past from now we can filter out streams that are falsely
//included.
//
//This value is the current time minus 60 days.
restore.minimum_restore_time = (get_time() - (60 * 24 * 60 * 60 * 1000));

//Minimum time distance in milliseconds between the end of one stream and the
//start of another such that they count as different streams. Used to combine
//VODs from the same stream.
restore.minimum_stream_distance = (6 * 60 * 60 * 1000);

//The uncertainty I give to times given by IRC server relative to the Twitch
//API.
restore.chat_time_fuzziness = (30 * 1000);

//The extra time included before and after a stream with the chat time
//fuzziness. Sometimes someone will donate something before a stream or right
//after a stream ends / disconnects. Additionally, Twitch Disconnect Protection
//may cause a VOD to be shorter than the actual stream, which could exclude some
//events even if they happened on stream. This will include such events if they
//are close to the stream.
restore.vod_time_extra_range = (10 * 60 * 1000);

//The key is the "data-window-type" attribute value of the recovered stream
//window and the value is an array of cheer data objects that have been
//recovered from that stream. Non-displayed data as well as communitygifts and
//raids are not included, because we don't need to keep them. Only cheers are
//affected by changing settings.
restore.restored_data_objects = {};

restore.header_button = document.querySelector(".header_button.restore_button");
