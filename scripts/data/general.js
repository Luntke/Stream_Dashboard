"use strict";
//
//    Data
//
//Handles incoming data from both chat and the recover channel.
//

//The general data container for methods and values.
let data = {};


//Data that is being displayed and that is not being displayed. The arrays are
//sorted by their "time" property in ascending order. Each element has the
//properties relevant to the type and these general ones:
//    "time" [number]
//    "type" [string]
//
//An element from the arrays can't be removed and its "id" value is its index
//in the array. Types that are displayed:
//    "cheer"
//    "communitygift"
//    "raid"
//Types that are not displayed:
//    "subscription"
//    "giftsub"
data.displayed_data = [];
data.non_displayed_data = [];

data.is_displayed_type = function(type){
	return (["cheer", "communitygift", "raid"].includes(type));
};

//Contains all data object creation functions. These are loaded from the folder
//"./get_data_object".
data.object_creation_functions = {};


//Takes two data objects and returns a boolean indicating if they are based on
//the same data. Data objects can look different if they come from a different
//source, for example data.offline_queue or data.displayed_data.
let data_objects_are_equal = function(a, b){
	//console.log("Are these the same?", a, b);
	if(a.time === b.time
	&& a.type === b.type){
		if(hasOwnProperty(a, "details")){
			a = a.details;
		}
		if(hasOwnProperty(b, "details")){
			b = b.details;
		}
		if(JSON.stringify(a) === JSON.stringify(b)){
			//console.log(true);
			return true;
		}
	}
	//console.log(false);
	return false;
};

let remove_data_object_duplicates = function(array){
	sort_data_object_array(array);
	
	primary: for(let i = 0;i < (array.length - 1);i += 1){
		secondary: for(let k = (i + 1);k < array.length;k += 1){
			let time_difference = (array[k].time - array[i].time);
			
			if(time_difference > 0){
				continue primary;
			}
			
			if(data_objects_are_equal(array[i], array[k])){
				array.splice(k, 1);
				k -= 1;
			}
		}
	}
};
//[debug_start]
/*
let data = [
		{time: 0, type: "a", data: "hehe"},
		{time: 0, type: "a", data: "hihi"},
		{time: 0, type: "a", data: "hehe"},//remove
		{time: 0, type: "a", data: "hihi"},//remove
		{time: 0, type: "a", data: "hehe"},//remove
		
		{time: 1, type: "a", data: "hehe"},
		{time: 1, type: "b", data: "hehe"},
		{time: 1, type: "a", data: "hehe"},//remove
		
		{time: 2, type: "a", data: "hihi"},
		{time: 3, type: "a", data: "hihi"}
];
remove_data_object_duplicates(data);
*/
//[debug_end]

let sort_data_object_array = function(array){
	if(are_data_objects_sorted(array)){
		return;
	}
	
	array.sort(function(a, b){
		return a.time - b.time;
	});
};

let are_data_objects_sorted = function(array){
	if(array.length <= 1){
		return true;
	}
	
	for(let i = 1;i < array.length;i += 1){
		if(array[i - 1].time > array[i].time){
			return false;
		}
	}
	
	return true;
};


//Takes a source array of unique data objects sorted by time in ascending order
//and a target array of data objects with the same order and returns an object
//with these properties:
//    unique_elements: [Array]
//        An array of data objects from the source array which aren't included
//        in the target array.
//    insert_indeces: [Array]
//        An array of numbers where the element at index N in the
//        unique_elements array should be inserted at the index value found at
//        index N of the insert_indeces array if all elements of the
//        unique_elements array are inserted into the target array in the right
//        order starting at source element 0. Inserting the elements in a
//        different order affects the indices other elements have to be inserted
//        into.
//This function can be used to more efficiently add data objects from the
//recovery queue. Instead of comparing up to source length times target length
//elements it compares up to source length plus target length elements.
let get_insertion_data = function(source, target){
	//  Functions  //
	
	//Takes a source index and adds the element to the return value.
	let add_unique_element = function(index){
		//Accounts for the index shift caused by previously inserted elements.
		let previous_insertions = unique_elements.length;
		
		unique_elements.push(source[index]);
		insert_indeces.push(target_i + previous_insertions);
	};
	
	//Returns the index of the first element in the target array which has a
	//time smaller or equal to the first source element's time. If all target
	//elements are smaller than the first source element then the target array
	//length is returned. It searches from largest to smallest time, which I
	//expect to be faster most of the time.
	let get_start_index = function(){
		if(source.length === 0){
			return target.length;
		}
		
		
		let i = (target.length - 1);
		let source_time = source[0].time;
		
		for(;i >= 0;i -= 1){
			if(target[i].time < source_time){
				break;
			}
		}
		
		i += 1;
		
		
		return i;
	};
	
	//Takes a source index and target index and returns a boolean indicating if
	//the source element is included in the target array. The target index is
	//the first target element where the time is equal to that of the source
	//element. If the element is not a duplicate it can be inserted at the
	//target index to keep the array sorted.
	let is_duplicate = function(source_i){
		let source_object = source[source_i];
		let source_time = source_object.time;
		
		for(let i = target_i;i < target.length;i += 1){
			if(source_time < target[i].time){
				break;
			}
			
			if(data_objects_are_equal(source_object, target[i])){
				return true;
			}
		}
		
		return false;
	};
	
	
	//  Execution  //
	
	//This is a mix of merging two sorted arrays and ignoring source elements
	//already included in the target array. There is a special case in which we
	//have to look ahead for duplicates so that multiple source elements can be
	//compared with the same target elements.
	
	let unique_elements = [];
	let insert_indeces = [];
	
	let target_i = get_start_index();
	let source_i = 0;
	
	
	primary: for(;source_i < source.length;source_i += 1){
		for(;;target_i += 1){
			if(target_i >= target.length){
				add_unique_element(source_i);
				break;
			}
			
			let time_difference = (source[source_i].time - target[target_i].time);
			
			if(time_difference < 0){
				add_unique_element(source_i);
				break;
			}
			if(time_difference === 0){
				if(!is_duplicate(source_i)){
					add_unique_element(source_i);
				}
				break;
			}
		}
	}
	
	
	return ({
		unique_elements: unique_elements,
		insert_indeces: insert_indeces
	});
};

/*
let get_insert_index = function(data_object, array){
	let time = data_object.time;
	let i = (array.length - 1);
	
	for(;i >= 0;i -= 1){
		if(array[i].time <= time){
			break;
		}
	}
	
	i += 1;
	
	return i;
};
*/

let get_insert_index = function(data_object, array){
	let time = data_object.time;
	let i = (array.length - 1);
	
	for(;i >= 0;i -= 1){
		if(array[i].time <= time){
			break;
		}
	}
	
	i += 1;
	
	
	for(let k = (i - 1);k >= 0;k -= 1){
		if(array[k].time === time){
			if(data_objects_are_equal(data_object, array[k])){
				return -1;
			}
			continue;
		}
		
		break;
	}
	
	
	return i;
};
