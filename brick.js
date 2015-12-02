/**
 * Minimum Bounding Box
 *
 * @author Justin Stroup 
 * @since 1.1, 01 Dec 2015
*/

var MBR = function(x, y, w, l, h) { // where x and y equals bottom-left coordiante
	this.botLeft.x = x;
	this.botLeft.y = y;
	this.botLeft.z = z;
	this.w = w;
	this.l = l;
	this.h = h;

	// TODO find bottom-left z index

	// calculate top-right coordinate
	this.topRight.x = this.botLeft.x + l;
	this.topRight.y = this.botLeft.y + w;
	this.topRight.z = this.botLeft.z + z;
	
	// this.midPt.x = (v1.x - v2.x) / 2;
	// this.midPt.y = (v1.y - v2.y) / 2;

	// check if a brick is overlapping this.MBR
	this.isWithin = function(brick) { 
		if (this.botleft.x < brick.topRight.x && this.topRight.x > brick.botleft.x
			&& this.topRight.y < brick.botleft.y && this.botleft.y > brick.topRight.y) {
			return true;
		}

		return false;
	};
	
	// approximate area assuming Cartesian plane. not accurate. 
	this.area = function () {
		return v1 * v2;
	};
};

/**
 * Search an array for an element. 
 *
 * @param A is an array
 * @param x is an element
**/
function search(A, x) {
	for (var i=0;i<A.length;i++) {
		if (A[i].isWithin(x)) {
			return A[i];
		}
	}

	return null;
}

/**
 * Create a brick element and insert an element into an array. 
 * If element's x and y coordinates match insert an MBR with 
 * an incremented z index.
 *
 * @param A is an array
 * @param x is an element to be inserted. 
**/
function insert(A, x) {
	temp = search(A,x);
	if (temp == null) {
		A.push(x);
	} else {
		// create identical brick
		var brick = new MBR(temp.botLeft.x, 
			temp.botLeft.y,
			temp.botleft.w,
			temp.botleft.l,
			temp.z)
		// increment z index
		brick.z = temp.topRight.z + 1;
		A.push(brick);
	}
}

/**
 * Remove an element from an array.
 *
 * @param A is an array
 * @param x is an element
**/
function remove(A, x) {
	for (var i=0;i<A.length;i++) {
		if (A[i].botLeft.x == x.bothLeft.x 
			&& A[i].botLeft.y == x.botLeft.y
			&& A[i].botLeft.z == x.bothLeft.z) {
			A.splice(i,1);
		}
	}

	console.error("ERROR! " + x + " not found.");
}