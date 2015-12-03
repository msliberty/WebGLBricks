/**
 * Linked List
 * Operations include: insert, remove, search, at, and each. 
 *
 * @author Justin Stroup 
 * @since 1.0, 29 Nov 2015
*/

/**
 * Initialize Node.
 *
 * @param {number|null} data, insert data into this.data
 * @param {Object} next, store pointer to next object
*/
var node = function (data, next) {
	if (typeof data !== 'undefined') {
		this.data = data;
	} else {
		this.data = null;
	}
		
	if (typeof next !== 'undefined') {
		this.next = next;
	} else {
		this.next = null;
	}
};

var LinkedList = function (data) { // start LinkedList	
	/**
	 * Initialize LinkedList by creating start
	 * and end node, and inserting data into start. 
	 *
	 * @see node
	*/
	if ($.isArray(data)) {
		var temp;
	        
        this.end = new node(data[1]);
		this.start = new node(data[0], this.end);		
      
		for (var i=2;i<data.length;i++) {
			temp = new node(data[i]);
			this.end.next = temp;
			this.end = temp;
		}
	} else {
		this.end = new node();
		this.start = new node(data, this.end);
	}
	
	/**
	 * Return first occurrence of data.
	 *
	 * @param data
	 * @return cur, where cur is the corresponding node
	*/
	this.search = function (data) {
		var cur = this.start;
		
		while (cur !== null) {
			if (cur.data === data) {
				return cur;
			} else { 
				cur = cur.next;
			}
		}
		
		console.error("ERROR! " + data + " not found.");
	};
	
	/**
	 * Remove first occurrence of node with corresponding data.
	 *
	 * @param node
	 * @return void
	*/
	this.remove = function (data) {
		var cur = this.start;
		var prev = cur;
		
		while (cur !== null) {
			if (cur === data) {
				if (cur === this.start) {
					this.start = cur.next;
					return;
				} else if (cur === this.end) {
					this.end = prev;
					this.end.next = null;
					return;
				} else {
					prev.next = cur.next; 
					return;
				}
			}
			
			prev = cur;
			cur = cur.next;
		}
	};
	
	/**
	 * Insert data after the kth node. 
	 *
	 * @param {Object} data, input.
	 * @param {number|Object|null} k, where k is either a numerical index, 
	 * data, a node, or null (in which case k = end).
	 * @return void
	*/
	this.insert = function (data, k) {
		var cur = this.start;
		var temp = new node(data);
		
		if (typeof k === 'undefined') {
			k = this.end;
		}
		
		while (cur !== null) {
			if (cur === k) {
				if (cur === this.end) {
					cur.next = temp;
					this.end = temp;
						
					return;
				} else {
					temp.next = cur.next;
					cur.next = temp;
						
					return;
				}
			}
			
			cur = cur.next;
		}
	};
	
	/**
	 * Traverse list using pseudo index.
	 *
	 * @param {number} i, where i is the desired index
	 * @return {Object} cur, where cur is the corresponding node
	*/
	this.at = function (i) {
		var cur = this.start;
		var error = i;
		
		while (cur !== null) {
			if (i===0) {
				return cur;
			}
			
			--i;
			cur = cur.next;
		}
		
		console.error("ERROR! " + error + " is out of scope.");
	};
	
	this.each = function (f) { // where f is a function 
		var cur = this.start;
		
		while (cur !== null) {
			f(cur);
			
			cur = cur.next;
		}
	};
}; // end LinkedList
  
/**
 * Print each data in list along with pseudo index. 
 *
 * @param {Object} list
*/
function print(list) {
	var i = 0;
	list.each(function (item) {
		console.log(i + ": " + item.data);
		i++;
	});
}