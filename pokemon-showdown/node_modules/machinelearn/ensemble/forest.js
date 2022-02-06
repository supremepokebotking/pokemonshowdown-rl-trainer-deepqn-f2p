"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var tree_1 = require("../tree");
var validation_1 = require("../utils/validation");
/**
 * Base RandomForest implementation used by both classifier and regressor
 * @ignore
 */
var BaseRandomForest = /** @class */ (function () {
    /**
     *
     * @param {number} nEstimator - Number of trees.
     * @param random_state - Random seed value for DecisionTrees
     */
    function BaseRandomForest(_a) {
        var _b = _a === void 0 ? {
            // Default value on empty constructor
            nEstimator: 10,
            random_state: null,
        } : _a, 
        // Each object param default value
        _c = _b.nEstimator, 
        // Each object param default value
        nEstimator = _c === void 0 ? 10 : _c, _d = _b.random_state, random_state = _d === void 0 ? null : _d;
        this.trees = [];
        this.randomState = null;
        this.nEstimator = nEstimator;
        this.randomState = random_state;
    }
    /**
     * Build a forest of trees from the training set (X, y).
     * @param {Array} X - array-like or sparse matrix of shape = [n_samples, n_features]
     * @param {Array} y - array-like, shape = [n_samples] or [n_samples, n_outputs]
     * @returns void
     */
    BaseRandomForest.prototype.fit = function (X, y) {
        var _this = this;
        if (X === void 0) { X = null; }
        if (y === void 0) { y = null; }
        validation_1.validateFitInputs(X, y);
        this.trees = lodash_1.reduce(lodash_1.range(0, this.nEstimator), function (sum) {
            var tree = new tree_1.DecisionTreeClassifier({
                featureLabels: null,
                random_state: _this.randomState,
            });
            tree.fit(X, y);
            return lodash_1.concat(sum, [tree]);
        }, []);
    };
    /**
     * Returning the current model's checkpoint
     * @returns {{trees: any[]}}
     */
    BaseRandomForest.prototype.toJSON = function () {
        return {
            trees: this.trees,
        };
    };
    /**
     * Restore the model from a checkpoint
     * @param {any[]} trees - Decision trees
     */
    BaseRandomForest.prototype.fromJSON = function (_a) {
        var _b = _a.trees, trees = _b === void 0 ? null : _b;
        if (!trees) {
            throw new Error('You must provide both tree to restore the model');
        }
        this.trees = trees;
    };
    /**
     * Internal predict function used by either RandomForestClassifier or Regressor
     * @param X
     * @private
     */
    BaseRandomForest.prototype.predict = function (X) {
        if (X === void 0) { X = null; }
        validation_1.validateMatrix2D(X);
        return lodash_1.map(this.trees, function (tree) {
            // TODO: Check if it's a matrix or an array
            return tree.predict(X);
        });
    };
    return BaseRandomForest;
}());
exports.BaseRandomForest = BaseRandomForest;
/**
 * Random forest classifier creates a set of decision trees from randomly selected subset of training set.
 * It then aggregates the votes from different decision trees to decide the final class of the test object.
 *
 * @example
 * import { RandomForestClassifier } from 'machinelearn/ensemble';
 *
 * const X = [[0, 0], [1, 1], [2, 1], [1, 5], [3, 2]];
 * const y = [0, 1, 2, 3, 7];
 *
 * const randomForest = new RandomForestClassifier();
 * randomForest.fit(X, y);
 *
 * // Results in a value such as [ '0', '2' ].
 * // Predictions will change as we have not set a seed value.
 */
var RandomForestClassifier = /** @class */ (function (_super) {
    __extends(RandomForestClassifier, _super);
    function RandomForestClassifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Predict class for X.
     *
     * The predicted class of an input sample is a vote by the trees in the forest, weighted by their probability estimates.
     * That is, the predicted class is the one with highest mean probability estimate across the trees.
     * @param {Array} X - array-like or sparse matrix of shape = [n_samples]
     * @returns {string[]}
     */
    RandomForestClassifier.prototype.predict = function (X) {
        if (X === void 0) { X = null; }
        var predictions = _super.prototype.predict.call(this, X);
        return this.votePredictions(predictions);
    };
    /**
     * @hidden
     * Bagging prediction helper method
     * According to the predictions returns by the trees, it will select the
     * class with the maximum number (votes)
     * @param {Array<any>} predictions - List of initial predictions that may look like [ [1, 2], [1, 1] ... ]
     * @returns {string[]}
     */
    RandomForestClassifier.prototype.votePredictions = function (predictions) {
        var counts = lodash_1.countBy(predictions, function (x) { return x; });
        var countsArray = lodash_1.reduce(lodash_1.keys(counts), function (sum, k) {
            var returning = {};
            returning[k] = counts[k];
            return lodash_1.concat(sum, returning);
        }, []);
        var max = lodash_1.maxBy(countsArray, function (x) { return lodash_1.head(lodash_1.values(x)); });
        var key = lodash_1.head(lodash_1.keys(max));
        // Find the actual class values from the predictions
        return lodash_1.find(predictions, function (pred) {
            return lodash_1.isEqual(pred.join(','), key);
        });
    };
    return RandomForestClassifier;
}(BaseRandomForest));
exports.RandomForestClassifier = RandomForestClassifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9lbnNlbWJsZS9mb3Jlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUNBQXVHO0FBQ3ZHLGdDQUFpRDtBQUVqRCxrREFBMEU7QUFFMUU7OztHQUdHO0FBQ0g7SUFLRTs7OztPQUlHO0lBQ0gsMEJBQ0UsRUFZQztZQVpEOzs7O2NBWUM7UUFYQyxrQ0FBa0M7UUFDbEMsa0JBQWU7UUFEZixrQ0FBa0M7UUFDbEMsb0NBQWUsRUFDZixvQkFBbUIsRUFBbkIsd0NBQW1CO1FBYmIsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUVYLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBc0IzQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQztJQUNsQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSw4QkFBRyxHQUFWLFVBQVcsQ0FBOEIsRUFBRSxDQUE4QjtRQUF6RSxpQkFjQztRQWRVLGtCQUFBLEVBQUEsUUFBOEI7UUFBRSxrQkFBQSxFQUFBLFFBQThCO1FBQ3ZFLDhCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLGVBQU0sQ0FDakIsY0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQ3pCLFVBQUMsR0FBRztZQUNGLElBQU0sSUFBSSxHQUFHLElBQUksNkJBQXNCLENBQUM7Z0JBQ3RDLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixZQUFZLEVBQUUsS0FBSSxDQUFDLFdBQVc7YUFDL0IsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDZixPQUFPLGVBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FB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