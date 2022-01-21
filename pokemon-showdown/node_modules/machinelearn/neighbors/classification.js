"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var MathExtra_1 = __importDefault(require("../utils/MathExtra"));
var tensors_1 = require("../utils/tensors");
var validation_1 = require("../utils/validation");
var KDTree_1 = __importDefault(require("./KDTree"));
var euclideanDistance = MathExtra_1.default.euclideanDistance, manhattanDistance = MathExtra_1.default.manhattanDistance;
var DIST_EUC = 'euclidean';
var DIST_MAN = 'manhattan';
var TYPE_KD = 'kdtree';
/**
 * Classifier implementing the k-nearest neighbors vote.
 *
 * @example
 * const knn = new KNeighborsClassifier();
 * const X = [[0, 0, 0], [0, 1, 1], [1, 1, 0], [2, 2, 2], [1, 2, 2], [2, 1, 2]];
 * const y = [0, 0, 0, 1, 1, 1];
 * knn.fit(X ,y);
 * console.log(knn.predict([1, 2])); // predicts 1
 */
var KNeighborsClassifier = /** @class */ (function () {
    /**
     * @param {string} distance - Choice of distance function, should choose between euclidean | manhattan
     * @param {number} k - Number of neighbors to classify
     * @param {string} type - Type of algorithm to use, choose between kdtree(default) | balltree | simple
     */
    function KNeighborsClassifier(_a) {
        var _b = _a === void 0 ? {
            // Default value on empty constructor
            distance: DIST_EUC,
            k: 0,
            type: TYPE_KD,
        } : _a, 
        // Each object param default value
        _c = _b.distance, 
        // Each object param default value
        distance = _c === void 0 ? DIST_EUC : _c, _d = _b.k, k = _d === void 0 ? 0 : _d, _e = _b.type, type = _e === void 0 ? TYPE_KD : _e;
        this.type = null;
        this.tree = null;
        this.k = null;
        this.classes = null;
        this.distance = null;
        var options = {
            distance: distance,
            k: k,
            type: type,
        };
        // Handling distance
        if (options.distance === DIST_EUC) {
            this.distance = euclideanDistance;
        }
        else if (options.distance === DIST_MAN) {
            this.distance = manhattanDistance;
        }
        else {
            throw new Error("Unrecognised type of distance " + options.distance + " was received");
        }
        this.k = options.k;
        this.type = options.type;
    }
    /**
     * Train the classifier with input and output data
     * @param {any} X - Training data.
     * @param {any} y - Target data.
     */
    KNeighborsClassifier.prototype.fit = function (X, y) {
        validation_1.validateFitInputs(X, y);
        // Getting the classes from y
        var classes = lodash_1.uniqBy(y, function (c) { return c; });
        // Setting k; if it's null, use the class length
        var k = this.k ? this.k : classes.length + 1;
        //  Constructing the points placeholder
        var points = new Array(X.length);
        for (var i = 0; i < points.length; ++i) {
            points[i] = X[i].slice();
        }
        for (var i = 0; i < y.length; ++i) {
            points[i].push(y[i]);
        }
        // Building a tree or algo according to this.type
        if (this.type === TYPE_KD) {
            this.tree = new KDTree_1.default(points, this.distance);
        }
        this.k = k;
        this.classes = classes;
    };
    /**
     * Return the model's state as a JSON object
     * @return {object} JSON KNN model.
     */
    KNeighborsClassifier.prototype.toJSON = function () {
        return {
            classes: this.classes,
            distance: this.distance,
            k: this.k,
            tree: this.tree,
            type: this.type,
        };
    };
    /**
     * Restores the model from a JSON checkpoint
     * @param {any} classes
     * @param {any} distance
     * @param {any} k
     * @param {any} tree
     * @param {any} type
     */
    KNeighborsClassifier.prototype.fromJSON = function (_a) {
        var _b = _a.classes, classes = _b === void 0 ? null : _b, _c = _a.distance, distance = _c === void 0 ? null : _c, _d = _a.k, k = _d === void 0 ? null : _d, _e = _a.tree, tree = _e === void 0 ? null : _e, _f = _a.type, type = _f === void 0 ? null : _f;
        if (!classes || !distance || !k || !tree || !type) {
            throw new Error('You must provide classes, distance, k, tree and type to restore the KNearestNeighbor');
        }
        this.classes = classes;
        this.distance = distance;
        this.k = k;
        this.tree = tree;
        this.type = type;
    };
    /**
     * Predict single value from a list of data
     * @param {Array} X - Prediction data.
     * @returns number
     */
    KNeighborsClassifier.prototype.predict = function (X) {
        var _this = this;
        var shape = tensors_1.inferShape(X);
        if (shape.length === 1) {
            return this.getSinglePred(X);
        }
        else if (shape.length === 2) {
            return lodash_1.map(X, function (currentItem) { return _this.getSinglePred(currentItem); });
        }
        else {
            throw new TypeError('The dataset is neither an array or a matrix');
        }
    };
    /**
     * Runs a single prediction against an array based on kdTree or balltree or
     * simple algo
     * @param array
     * @returns {{}}
     */
    KNeighborsClassifier.prototype.getSinglePred = function (array) {
        if (this.tree) {
            return this.getTreeBasedPrediction(array);
        }
        else {
            // Run the simple KNN algorithm
            return 0;
        }
    };
    /**
     * Get the class with the max point
     * @param current
     * @returns {{}}
     * @ignore
     */
    KNeighborsClassifier.prototype.getTreeBasedPrediction = function (current) {
        var nearestPoints = this.tree.nearest(current, this.k);
        var pointsPerClass = {};
        var predictedClass = -1;
        var maxPoints = -1;
        var lastElement = nearestPoints[0][0].length - 1;
        // Initialising the points placeholder per class
        for (var j = 0; j < this.classes.length; j++) {
            pointsPerClass[this.classes[j]] = 0;
        }
        // Voting the max value
        for (var i = 0; i < nearestPoints.length; ++i) {
            var currentClass = nearestPoints[i][0][lastElement];
            var currentPoints = ++pointsPerClass[currentClass];
            if (currentPoints > maxPoints) {
                predictedClass = currentClass;
                maxPoints = currentPoints;
            }
        }
        return predictedClass;
    };
    return KNeighborsClassifier;
}());
exports.KNeighborsClassifier = KNeighborsClassifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3NpZmljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL25laWdoYm9ycy9jbGFzc2lmaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGlDQUFxQztBQUVyQyxpRUFBc0M7QUFDdEMsNENBQThDO0FBQzlDLGtEQUF3RDtBQUN4RCxvREFBOEI7QUFDdEIsSUFBQSx5REFBaUIsRUFBRSx5REFBaUIsQ0FBVTtBQUN0RCxJQUFNLFFBQVEsR0FBRyxXQUFXLENBQUM7QUFDN0IsSUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDO0FBQzdCLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQztBQUV6Qjs7Ozs7Ozs7O0dBU0c7QUFDSDtJQU9FOzs7O09BSUc7SUFDSCw4QkFDRSxFQWVDO1lBZkQ7Ozs7O2NBZUM7UUFkQyxrQ0FBa0M7UUFDbEMsZ0JBQW1CO1FBRG5CLGtDQUFrQztRQUNsQyx3Q0FBbUIsRUFDbkIsU0FBSyxFQUFMLDBCQUFLLEVBQ0wsWUFBYyxFQUFkLG1DQUFjO1FBaEJWLFNBQUksR0FBRyxJQUFJLENBQUM7UUFDWixTQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ1osTUFBQyxHQUFHLElBQUksQ0FBQztRQUNULFlBQU8sR0FBRyxJQUFJLENBQUM7UUFDZixhQUFRLEdBQUcsSUFBSSxDQUFDO1FBeUJ0QixJQUFNLE9BQU8sR0FBRztZQUNkLFFBQVEsVUFBQTtZQUNSLENBQUMsR0FBQTtZQUNELElBQUksTUFBQTtTQUNMLENBQUM7UUFDRixvQkFBb0I7UUFDcEIsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLGlCQUFpQixDQUFDO1NBQ25DO2FBQU0sSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUN4QyxJQUFJLENBQUMsUUFBUSxHQUFHLGlCQUFpQixDQUFDO1NBQ25DO2FBQU07WUFDTCxNQUFNLElBQUks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