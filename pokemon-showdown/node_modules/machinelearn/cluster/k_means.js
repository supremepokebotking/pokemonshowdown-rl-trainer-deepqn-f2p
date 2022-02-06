"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var Random = __importStar(require("random-js"));
var MathExtra_1 = __importDefault(require("../utils/MathExtra"));
var validation_1 = require("../utils/validation");
/**
 * K-Means clustering
 *
 * @example
 * import { KMeans } from 'machinelearn/cluster';
 *
 * const kmean = new KMeans({ k: 2 });
 * const clusters = kmean.fit([[1, 2], [1, 4], [1, 0], [4, 2], [4, 4], [4, 0]]);
 *
 * const result = kmean.predict([[0, 0], [4, 4]]);
 * // results in: [0, 1]
 */
var KMeans = /** @class */ (function () {
    /**
     *
     * @param distance - Choice of distance method. Defaulting to euclidean
     * @param k - Number of clusters
     * @param maxIteration - Relative tolerance with regards to inertia to declare convergence
     * @param randomState - Random state value for sorting centroids during the getInitialCentroid phase
     */
    function KMeans(_a) {
        var _b = _a === void 0 ? {
            distance: 'euclidean',
            k: 3,
            maxIteration: 300,
            randomState: 0,
        } : _a, _c = _b.distance, distance = _c === void 0 ? 'euclidean' : _c, _d = _b.k, k = _d === void 0 ? 3 : _d, _e = _b.maxIteration, maxIteration = _e === void 0 ? 300 : _e, _f = _b.randomState, randomState = _f === void 0 ? 0 : _f;
        this.k = k;
        // Assigning a distance method
        var distanceType = distance;
        switch (distanceType) {
            case 'euclidean':
                this.distance = MathExtra_1.default.euclideanDistance;
                break;
            case 'manhattan':
                this.distance = MathExtra_1.default.manhattanDistance;
                break;
            default:
                throw new Error("Unknown distance type " + distanceType);
        }
        this.randomState = randomState;
        this.maxIteration = maxIteration;
        this.centroids = [];
    }
    /**
     * Compute k-means clustering.
     * @param {any} X - array-like or sparse matrix of shape = [n_samples, n_features]
     * @returns {{centroids: number[]; clusters: number[]}}
     */
    KMeans.prototype.fit = function (X) {
        var _this = this;
        if (X === void 0) { X = null; }
        validation_1.validateMatrix2D(X);
        this.assignment = new Array(_.size(X));
        this.centroids = this.getInitialCentroids(X, this.k);
        this.clusters = new Array(this.k);
        // Flag to check the convergence
        var movement = true;
        // Looping only within the maxIteration boundary
        for (var iter = 0; iter < this.maxIteration && movement; iter++) {
            // find the distance between the point and cluster; choose the nearest centroid
            _.forEach(X, function (data, i) {
                _this.assignment[i] = _this.getClosestCentroids(data, _this.centroids, _this.distance);
            });
            // Flag set to false; giving opportunity to stop the loop upon the covergence
            movement = false;
            // Updating the location of each centroid
            for (var j = 0; j < this.k; j++) {
                var assigned = [];
                for (var i = 0; i < this.assignment.length; i++) {
                    if (this.assignment[i] === j) {
                        assigned.push(X[i]);
                    }
                }
                if (!assigned.length) {
                    continue;
                }
                // Getting the original data point
                // TODO: Fix any type
                var centroid = this.centroids[j];
                var newCentroid = new Array(centroid.length);
                for (var g = 0; g < centroid.length; g++) {
                    var sum = 0;
                    for (var i = 0; i < assigned.length; i++) {
                        sum += assigned[i][g];
                    }
                    newCentroid[g] = sum / assigned.length;
                    // Does not converge yet
                    if (newCentroid[g] !== centroid[g]) {
                        movement = true;
                    }
                }
                this.centroids[j] = newCentroid;
                this.clusters[j] = assigned;
            }
        }
    };
    /**
     * Predicts the cluster index with the given X
     * @param {any} X - array-like or sparse matrix of shape = [n_samples, n_features]
     * @returns {number[]}
     */
    KMeans.prototype.predict = function (X) {
        var _this = this;
        if (X === void 0) { X = null; }
        validation_1.validateMatrix2D(X);
        return _.map(X, function (data) {
            return _this.getClosestCentroids(data, _this.centroids, _this.distance);
        });
    };
    /**
     * Get the model details in JSON format
     * @returns {{k: number; clusters: number[]; centroids: number[]}}
     */
    KMeans.prototype.toJSON = function () {
        return {
            centroids: this.centroids,
            clusters: this.clusters,
            k: this.k,
        };
    };
    /**
     * Restores the model from checkpoints
     * @param {number} k
     * @param {number[]} clusters
     * @param {number[]} centroids
     */
    KMeans.prototype.fromJSON = function (_a) {
        var _b = _a.k, k = _b === void 0 ? null : _b, _c = _a.clusters, clusters = _c === void 0 ? null : _c, _d = _a.centroids, centroids = _d === void 0 ? null : _d;
        if (!k || !clusters || !centroids) {
            throw new Error('You must provide all the parameters include k, clusters and centroids');
        }
        this.k = k;
        this.clusters = clusters;
        this.centroids = centroids;
    };
    /**
     * Get initial centroids from X of k
     * @param {number[]} X
     * @param {number} k
     * @returns {number[]}
     */
    KMeans.prototype.getInitialCentroids = function (X, k) {
        // Create an initial copy
        var centroids = _.clone(X);
        // Sort the centroid randomly if the randomState is greater than 0
        if (this.randomState > 0) {
            var randomEngine_1 = Random.engines.mt19937();
            randomEngine_1.seed(this.randomState);
            centroids.sort(function () {
                var randomInt = Random.integer(0, 1)(randomEngine_1);
                return Math.round(randomInt) - 0.5;
            });
        }
        return centroids.slice(0, k);
    };
    /**
     * Get closest centroids based on the passed in distance method
     * @param {number[]} data
     * @param {number[]} centroids
     * @param distance
     * @returns {number}
     */
    KMeans.prototype.getClosestCentroids = function (data, centroids, distance) {
        var min = Infinity;
        var index = 0;
        _.forEach(centroids, function (centroid, i) {
            var dist = distance(data, centroid);
            if (dist < min) {
                min = dist;
                index = i;
            }
        });
        return index;
    };
    return KMeans;
}());
exports.KMeans = KMeans;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia19tZWFucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY2x1c3Rlci9rX21lYW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHdDQUE0QjtBQUM1QixnREFBb0M7QUFFcEMsaUVBQXNDO0FBQ3RDLGtEQUF1RDtBQVN2RDs7Ozs7Ozs7Ozs7R0FXRztBQUNIO0lBU0U7Ozs7OztPQU1HO0lBQ0gsZ0JBQ0UsRUFLQztZQUxEOzs7OztjQUtDLEVBTEMsZ0JBQXNCLEVBQXRCLDJDQUFzQixFQUFFLFNBQUssRUFBTCwwQkFBSyxFQUFFLG9CQUFrQixFQUFsQix1Q0FBa0IsRUFBRSxtQkFBZSxFQUFmLG9DQUFlO1FBT3BFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsOEJBQThCO1FBQzlCLElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQztRQUM5QixRQUFRLFlBQVksRUFBRTtZQUNwQixLQUFLLFdBQVc7Z0JBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxtQkFBSSxDQUFDLGlCQUFpQixDQUFDO2dCQUN2QyxNQUFNO1lBQ1IsS0FBSyxXQUFXO2dCQUNkLElBQUksQ0FBQyxRQUFRLEdBQUcsbUJBQUksQ0FBQyxpQkFBaUIsQ0FBQztnQkFDdkMsTUFBTTtZQUNSO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQXlCLFlBQWMsQ0FBQyxDQUFDO1NBQzVEO1FBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxvQkFBRyxHQUFWLFVBQVcsQ0FBOEI7UUFBekMsaUJBb0RDO1FBcERVLGtCQUFBLEVBQUEsUUFBOEI7UUFDdkMsNkJBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxD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