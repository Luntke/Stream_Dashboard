"use strict";
//
//    Storage
//
//Handles saving and retrieving things from local storage.
//

let storage = {};

//The prefix used to differentiate storage items from different pages to ones
//created here. This is useful as the same local storage object may be used by
//several different pages. When run under the "file" scheme I get data from an
//installed extension, which is strange, as the extension has other storage
//available and local storage shouldn't work in the "file" scheme. Anyway, this
//should make names unique.
storage.key_prefix = "jerma_mustard_";

//Function used to detect if local storage is available.
//Source:
//    https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
let is_storage_available = function(type){
	try {
		var storage = window[type],
		x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	} catch(e){
		return e instanceof DOMException && (
		// everything except Firefox
		e.code === 22 ||
		// Firefox
		e.code === 1014 ||
		// test name field too, because code might not be present
		// everything except Firefox
		e.name === 'QuotaExceededError' ||
		// Firefox
		e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
		// acknowledge QuotaExceededError only if there's something already stored
		storage.length !== 0;
	}
};

storage.is_available = is_storage_available("localStorage");

if(storage.is_available === true){
	storage.localStorage = window.localStorage;
} else {
	storage.localStorage = null;
}

//  Storage Methods  //

storage.set = function(key, value){
	if(storage.localStorage === null){
		return false;
	}
	
	return storage.localStorage.setItem(storage.key_prefix + key, JSON.stringify(value));
};

storage.get = function(key){
	if(storage.localStorage === null){
		return false;
	}
	
	return JSON.parse(storage.localStorage.getItem(storage.key_prefix + key));
};

storage.remove = function(key){
	if(storage.localStorage === null){
		return false;
	}
	
	return storage.localStorage.removeItem(storage.key_prefix + key);
};
