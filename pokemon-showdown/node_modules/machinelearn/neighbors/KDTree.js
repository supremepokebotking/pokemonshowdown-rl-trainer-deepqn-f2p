"use strict";
/* tslint:disable */
/*
 * Original code from:
 *
 * k-d Tree JavaScript - V 1.01
 *
 * https://github.com/ubilabs/kd-tree-javascript
 *
 * @author Mircea Pricop <pricop@ubilabs.net>, 2012
 * @author Martin Kleppe <kleppe@ubilabs.net>, 2012
 * @author Ubilabs http://ubilabs.net, 2012
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @ignore
 */
var Node = /** @class */ (function () {
    function Node(obj, dimension, parent) {
        this.obj = null;
        this.left = null;
        this.right = null;
        this.parent = null;
        this.dimension = null;
        this.obj = obj;
        this.left = null;
        this.right = null;
        this.parent = parent;
        this.dimension = dimension;
    }
    return Node;
}());
exports.Node = Node;
/**
 * @ignore
 */
var KDTree = /** @class */ (function () {
    function KDTree(points, metric) {
        this.dimensions = null;
        this.root = null;
        this.metric = null;
        // If points is not an array, assume we're loading a pre-built tree
        if (!Array.isArray(points)) {
            this.dimensions = points.dimensions;
            this.root = points;
            restoreParent(this.root);
        }
        else {
            this.dimensions = new Array(points[0].length);
            for (var i = 0; i < this.dimensions.length; i++) {
                this.dimensions[i] = i;
            }
            this.root = buildTree(points, 0, null, this.dimensions);
        }
        this.metric = metric;
    }
    // Convert to a JSON serializable structure; this just requires removing
    // the `parent` property
    KDTree.prototype.toJSON = function () {
        var result = toJSONImpl(this.root);
        // Renamed dimensions to dimension
        result.dimension = this.dimensions;
        return result;
    };
    KDTree.prototype.nearest = function (point, maxNodes, maxDistance) {
        var metric = this.metric;
        var dimensions = this.dimensions;
        var i;
        var bestNodes = new BinaryHeap(function (e) { return -e[1]; });
        function nearestSearch(node) {
            var dimension = dimensions[node.dimension];
            var ownDistance = metric(point, node.obj);
            var linearPoint = {};
            var bestChild, linearDistance, otherChild, i;
            function saveNode(node, distance) {
                bestNodes.push([node, distance]);
                if (bestNodes.size() > maxNodes) {
                    bestNodes.pop();
                }
            }
            for (i = 0; i < dimensions.length; i += 1) {
                if (i === node.dimension) {
                    linearPoint[dimensions[i]] = point[dimensions[i]];
                }
                else {
                    linearPoint[dimensions[i]] = node.obj[dimensions[i]];
                }
            }
            linearDistance = metric(linearPoint, node.obj);
            if (node.right === null && node.left === null) {
                if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
                    saveNode(node, ownDistance);
                }
                return;
            }
            if (node.right === null) {
                bestChild = node.left;
            }
            else if (node.left === null) {
                bestChild = node.right;
            }
            else {
                if (point[dimension] < node.obj[dimension]) {
                    bestChild = node.left;
                }
                else {
                    bestChild = node.right;
                }
            }
            nearestSearch(bestChild);
            if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
                saveNode(node, ownDistance);
            }
            if (bestNodes.size() < maxNodes || Math.abs(linearDistance) < bestNodes.peek()[1]) {
                if (bestChild === node.left) {
                    otherChild = node.right;
                }
                else {
                    otherChild = node.left;
                }
                if (otherChild !== null) {
                    nearestSearch(otherChild);
                }
            }
        }
        if (maxDistance) {
            for (i = 0; i < maxNodes; i += 1) {
                bestNodes.push([null, maxDistance]);
            }
        }
        if (this.root) {
            nearestSearch(this.root);
        }
        var result = [];
        for (i = 0; i < Math.min(maxNodes, bestNodes.content.length); i += 1) {
            if (bestNodes.content[i][0]) {
                result.push([bestNodes.content[i][0].obj, bestNodes.content[i][1]]);
            }
        }
        return result;
    };
    return KDTree;
}());
exports.default = KDTree;
/**
 *
 * @param src
 * @returns {Node}
 * @ignore
 */
function toJSONImpl(src) {
    var dest = new Node(src.obj, src.dimension, null);
    if (src.left)
        dest.left = toJSONImpl(src.left);
    if (src.right)
        dest.right = toJSONImpl(src.right);
    return dest;
}
/**
 *
 * @param points
 * @param depth
 * @param parent
 * @param dimensions
 * @returns {any}
 * @ignore
 */
function buildTree(points, depth, parent, dimensions) {
    var dim = depth % dimensions.length;
    if (points.length === 0) {
        return null;
    }
    if (points.length === 1) {
        return new Node(points[0], dim, parent);
    }
    points.sort(function (a, b) { return a[dimensions[dim]] - b[dimensions[dim]]; });
    var median = Math.floor(points.length / 2);
    var node = new Node(points[median], dim, parent);
    node.left = buildTree(points.slice(0, median), depth + 1, node, dimensions);
    node.right = buildTree(points.slice(median + 1), depth + 1, node, dimensions);
    return node;
}
/**
 * @param root
 * @ignore
 */
function restoreParent(root) {
    if (root.left) {
        root.left.parent = root;
        restoreParent(root.left);
    }
    if (root.right) {
        root.right.parent = root;
        restoreParent(root.right);
    }
}
// Binary heap implementation from:
// http://eloquentjavascript.net/appendix2.html
/**
 * @ignore
 */
var BinaryHeap = /** @class */ (function () {
    function BinaryHeap(scoreFunction) {
        this.content = [];
        this.content = [];
        this.scoreFunction = scoreFunction;
    }
    BinaryHeap.prototype.push = function (element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to bubble up.
        this.bubbleUp(this.content.length - 1);
    };
    BinaryHeap.prototype.pop = function () {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it sink down.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.sinkDown(0);
        }
        return result;
    };
    BinaryHeap.prototype.peek = function () {
        return this.content[0];
    };
    BinaryHeap.prototype.size = function () {
        return this.content.length;
    };
    BinaryHeap.prototype.bubbleUp = function (n) {
        // Fetch the element that has to be moved.
        var element = this.content[n];
        // When at 0, an element can not go up any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            var parentN = Math.floor((n + 1) / 2) - 1;
            var parent_1 = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent_1)) {
                this.content[parentN] = element;
                this.content[n] = parent_1;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            else {
                // Found a parent that is less, no need to move it further.
                break;
            }
        }
    };
    BinaryHeap.prototype.sinkDown = function (n) {
        // Look up the target element and its score.
        var length = this.content.length;
        var element = this.content[n];
        var elemScore = this.scoreFunction(element);
        while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) * 2;
            var child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N];
                var child1Score = this.scoreFunction(child1);
                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore) {
                    swap = child1N;
                }
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N];
                var child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }
            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            else {
                // Otherwise, we are done.
                break;
            }
        }
    };
    return BinaryHeap;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS0RUcmVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9uZWlnaGJvcnMvS0RUcmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7QUFDcEI7Ozs7Ozs7Ozs7O0dBV0c7O0FBRUg7O0dBRUc7QUFDSDtJQU9FLGNBQVksR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNO1FBTjNCLFFBQUcsR0FBRyxJQUFJLENBQUM7UUFDWCxTQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ1osVUFBSyxHQUFHLElBQUksQ0FBQztRQUNiLFdBQU0sR0FBRyxJQUFJLENBQUM7UUFDZCxjQUFTLEdBQUcsSUFBSSxDQUFDO1FBR3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDLEFBZEQsSUFjQztBQWRZLG9CQUFJO0FBZ0JqQjs7R0FFRztBQUNIO0lBS0UsZ0JBQVksTUFBTSxFQUFFLE1BQU07UUFKbkIsZUFBVSxHQUFHLElBQUksQ0FBQztRQUNsQixTQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ1gsV0FBTSxHQUFHLElBQUksQ0FBQztRQUdwQixtRUFBbUU7UUFDbkUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1lBQ25CLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7YUFBTTtZQUNMLElBQUksQ0FBQyxV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SUFBSSxHQUFHLENBQUMsS0FBSztRQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILFNBQVMsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVU7SUFDbEQsSUFBTSxHQUFHLEdBQUcsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFFdEMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUN2QixPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUN2QixPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDekM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQXZDLENBQXVDLENBQUMsQ0FBQztJQUUvRCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDN0MsSUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuRCxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM1RSxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxN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