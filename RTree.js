/**
 * R-tree
 *
 * @author Justin Stroup 
 * @since 1.0, 23 Nov 2015
*/

var INDEX_QUALITY_SCORE = 1; // 1 = least amount of overlapping, infinity = most amount of overlapping

var results; // store query results
var cur;

var pt(type, count, sys); // data type, number of coordinates, and coordinate system.
var ls = [[],[]]; // LineString
var mls = [[[],[]], [[],[]]]; // MultiLineString
var poly(); // Polygon

var box(pt);

var value(box);

var node(value, index, key);

var RN = {
	"mbr":,
	"keys":
}

var IN = {
	"index":,
	"mbr":,
	"keys"
}

var LN = {
	"index":,
	"metadata":, // mbr
	"object":
}

var N = {
	"index":
	"keys":
	"children":
	"value": // ?
	"type": // is root, internal or leaf?
};

var height; // O(lg n), where n is the number of nodes
var order; // maximum width 
var min; // minimum width

var node = { // isObject
	"value": , // e.g. a linestring or a polygon
	"index": , // unsigned int
	"key": , // # of children (k-1, where k = index) or none hence a leaf node | isArray of ptrs 
};

(function() {
	function RTree(metadata, order) { // class
		if (!(this instanceof RTree)) {
			return new RTree(width);
		}
		
		// handle # of nodes
		var min = 3; // Min order of any node before a merge
		var max = 6; // Max order of any node before a split
		if (!isNaN(order)) {
			min = Math.floor(order / 2.0);
			max = order;
		}
		
		/**
		 * Bulk-load tree with bottom-up approach.
		 * How do you minimize overlapping?
		 *
		 * @pram {number} order. maximum size of nodes
		*/
		void pack(order) {
			var RN = { // root
				"id":, // number
				"mbr":, //  minimum bounding rectangle
				"children": [] // array of ids
			};
			
			var IN = { // internal
				"id":,
				"mbr":,
				"children": []
			};
			
			var LN = { // leaf
				"id":,
				"mbr":, // ?
				"object": {} // json MultiLineString
			};
			
			var node = {
				"id":,
				"mbr":, // minimum bounding rectangle
				"type":, // root, internal, leaf
				"object": // if !leaf  then null otherwise contains some spatial object
			};
			
			metadata = []; // contains each spatial object.
		
			// create each LN
			// var leafNode = new LN[];
			var nodes = new node[];
			for (var i=0;i<sizeof(metadata);i++) {
				nodes[i] = {
					"id": i,
					"mbr": findMBROfMultiLineString(metadata[i]),
					"type": "leaf",
					"object": metadata[i]
				};
			}

			// find each MBR center pt
			for (var i=0;i<sizeof(nodes);i++) {
				centerPts[i] = findCenterPtOfMBR(nodes[i]);
				sort(centerPts[i]);
			}
			
			// Internal Nodes
			while (count(nodes)>4) {
				// first level of INs ect...
				for (var i=sizeof(nodes);i<(i+(i%4));i++) {
					nodes[i] = {
						"id": i,
						"mbr": findMBROfMBRs(nodes[i].mbr),
						"type": "internal",
						"children": nodes[i:4].id
					};
				}
			}
			finally RN
		
			var node = { // isObject
				"value": , // e.g. a linestring or a polygon
				"id": , // unsigned int
				"key": , // # of children (k-1, where k = index) or none hence a leaf node
			};
			
			var node = [ // isArray
				[],
				?,
				?
			];
			
			// for (var i=0;i<
		}
		
		var root = {};
		this.root = root;
		
		function ~RTree() {
			// TODO
		}
		
		function merge() {
			// TODO
		}
		
		function count(node) {
			return sizeof(node.keys);
		}
		
		function isFull(node) {
			if (count(node) == max) {
				return true;
			} else {
				return false;
			}
		}
		
		/**
		 * Top-down Greedy Splitting Algorithm (TGS)
		 * by Yvan J Garcia R., Mario A. Lopez, and
		 * Scott T. Leutenegger
		 *
		 */
		function tgs() {
			// TODO
		}
		
		function split() { // quadratic split
			var obj0;
			var obj1;
			
			// find dead space
			
		}
		
		function swap() {
			// TODO
		}
		
		/**
		 * Inserts a new entry E in an R-tree with root node
		 * RN. 1. Traverse the tree from root RN to the
		 * appropriate leaf. At each level, select the node, L,
		 * whose MBR will require the min area enlargement to
		 * to cover E.mbr. 2. In case of ties, select the node
		 * whose MBR has the min area. 3. 
		*/
		function insert(e, node) {
			var cur = RN; // current node
			var temp = null;
			
			// find node with least amount of children
			while (!exists(e)) {
				for (var i=0;i<count(cur);i++) {
					if (count(next(cur.keys[i])) < temp) {
						temp = next(cur.keys[i]);
					}
				}
			
				if (!isFull(cur)) {
					// insert
				} else {
					split(cur); // split and update
				}
			
				insert(e, cur); // recursive
			}
		}
		
		function isGreaterThan(x, y) {
			return x > y ? x : y; // syntax error?
		}
		
		function next(node) {
		}
		
		function before(node) {
		}
		
		/**
		 * Given is the leaf L from which entry E has been 
		 * deleted. If after the deletion of E, L has fewer
		 * tan m entries, then remove entirely leaf L and
		 * reinsert all its entries. Updates are propagated 
		 * upwards and the MBRs in the path from root to L
		 * are modified.
		*/
		function update(node) { // ?
			var cur = node; // current
			var temp; // set of nodes to be removed
			
			while (!isRoot(cur)) {
				if (sizeof(cur) < m) {
					remove(e, cur);
					insert(x, temp);
				}
				
				// adjust MBR
				
				cur = cur.before; // current equals parent
			}
		}
		
		function remove(e) {
			search(e, mbr);
				
		}
		
		/**
		 * Finds all rectangles that are stored in an R-tree
		 * with root node RN, which are intersected by a 
		 * query rectangle Q. Results are stored in results.
		*/
		function search(e, mbr) {
			if (isNaN(e)) { // use mbr
				// TODO
			} else if (isPoint(e)) { // use nearest neighbour
				// TODO
			} else if (isLineString(e)) {
				// TODO
			} else { // isPolygon?
				// TODO
			}
			
			var cur = node;
			
			if (isOverlap(cur, query)) {
				ans.push(cur);
			}
		}
		
		function isNearestNeighbor(e) {
			// TODO
		}
		
		function query() {
			// TODO
		}
		
		/**
		 * @return number of entries in node
		*/
		function sizeof(node) {
			return node.size;
		}
		
		/**
		 * Nearest-X
		*/
		function nx() { 
		}
		
		/**
		 * Hilbert Sort
		*/
		function hs() {
		}
		
		function empty() {
			// TODO
		}
		
		function isWithin(node, q) { // x = node and q = query
			var A = mbr1[0]; // bottom-left conner
			var B = mbr1[1]; // top-right conner
			var C = mbr2[0]; // bottom-right conner
			var D = mbr3[1]; // top-left conner
			
			if (!isLeaf()) {
				return []; // containing each child node within q
			} else {
				if (A.x <= C.x && A.y <= C.y && B.x >= D.x && B.y >= D.y) {
					return true;
				} else {
					return false;
				}
			}
		}
		
		function isIntersect(node, q) { // q = query
			// if (isLeaf(node)) {
				// results.append(value);
			// } else {
				// TODO
			// }
			
			var A = mbr1[0]; // bottom-left conner
			var B = mbr1[1]; // top-right conner
			var C = mbr2[0]; // bottom-right conner
			var D = mbr3[1]; // top-left conner
			
			if (!isLeaf()) {
				return []; // each child node intersecting q
			} else {
				if ((A.x <= C.x && B.x >= C.x) || (A.x <= D.x && B.x >= D.x)) && // x
					((A.y <= C.y && B.y >= C.y) || (A.y <= D.y && B.y >= D.y)) { // y
					return true;
				} else {
					return false;
				}
			}
		}
		
		function isDisjoint() {
			// TODO
		}
		
		function isCross() {
			// TODO
		}
		
		function isTouch() {
			// TODO
		}
		
		function isOverlap() {
			// TODO
		}
		
		function isEqual() {
			// TODO
		}
		
		function print() {
			// TODO
		}
		
		function findMBROfMultiLineString(mls) {
			var x1; // left
			var x2; // right
			var y1; // bottom
			var y2; // top
			
			var X = []; // sorted x pts
			var Y = []; // sorted y pts
			
			for (var i=0;i<count(mls);i++) { // travers number of linestrings
				for (var j=0;j<count(ls[i]);j++) { // travers number of points
					// left and right
					if (isGreaterThan(ls[i][j][1], x1) {
						x1 = ls[i][j][1];
					} else if (!isGreaterThan(ls[i][j][1], x2) {
						x2 = ls[i][j][1];
					}
					
					// top and bottom
					if (isGreaterThan(ls[i][j][0], y2) {
						y2 = ls[i][j][0];
					} else if (!isGreaterThan(ls[i][j][0], y1) {
						y1 = ls[i][j][0];
					}
				}
			}
			
			return [[x1,y1],[x2,y2]]; // lower left and upper right coordinates
		}
		
		function grahamScan(pts) { // a.k.a. Graham's Sca'm'...bhahahaha
			function ccw(pt1, pt2, pt3) { // counter-clockwise
				return (pt2[0] - pt1[0]) * (pt3[1] - pt1[1]) - (pt2[1] - pt1[1]) * (pt3[0] - pt1[0]);
			}
			
			var count = sizeof(pts);
			swap(pts[0], min(pts.y));
			sort(pts[1:];
		}
	}
	
	function area(node) {
		w = y.x - x.x;
		l = y.y - x.y;
		
		return w * l;
	}
});
	