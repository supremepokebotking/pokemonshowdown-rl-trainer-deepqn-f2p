"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * References:
 * - https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.BaggingClassifier.html
 */
var tree_1 = require("../tree");
var MathExtra_1 = __importDefault(require("../utils/MathExtra"));
var tensors_1 = require("../utils/tensors");
var validation_1 = require("../utils/validation");
/**
 * A Bagging classifier is an ensemble meta-estimator that fits
 * base classifiers each on random subsets of the original dataset
 * and then aggregate their individual predictions by voting
 * to form a final prediction
 *
 * @example
 * const classifier = new BaggingClassifier({
 *  baseEstimator: LogisticRegression,
 *  maxSamples: 1.0,
 * });
 * const X = [[1], [2], [3], [4], [5]];
 * const y = [1, 1, 1, 1, 1];
 * classifier.fit(X, y);
 * classifier.predict(X);
 */
var BaggingClassifier = /** @class */ (function () {
    /**
     * @param baseEstimator - The model that will be used as a basis of ensemble.
     * @param numEstimators - The number of estimators that will be used in ensemble.
     * @param maxSamples - The number of samples to draw from X to train each base estimator.
     *  Is used in conjunction with maxSamplesIsFloating.
     *  If @param maxSamplesIsFloating is false, then draw maxSamples samples.
     *  If @param maxSamplesIsFloating is true, then draw max_samples * shape(X)[0] samples.
     * @param maxFeatures - The number of features to draw from X to train each base estimator.
     *  Is used in conjunction with @param maxFeaturesIsFloating
     *  If maxFeaturesIsFloating is false, then draw max_features features.
     *  If maxFeaturesIsFloating is true, then draw max_features * shape(X)[1] features.
     * @param bootstrapSamples - Whether samples are drawn with replacement. If false, sampling without replacement is performed.
     * @param bootstrapFeatures - Whether features are drawn with replacement.
     * @param estimatorOptions - constructor options for BaseEstimator.
     * @param maxSamplesIsFloating - if true, draw maxSamples samples
     * @param maxFeaturesIsFloating - if true, draw maxFeatures samples
     */
    function BaggingClassifier(_a) {
        var _b = _a === void 0 ? {
            baseEstimator: tree_1.DecisionTreeClassifier,
            numEstimators: 10,
            maxSamples: 1.0,
            maxFeatures: 1.0,
            bootstrapSamples: false,
            bootstrapFeatures: false,
            estimatorOptions: {},
            maxSamplesIsFloating: true,
            maxFeaturesIsFloating: true,
        } : _a, _c = _b.baseEstimator, baseEstimator = _c === void 0 ? tree_1.DecisionTreeClassifier : _c, _d = _b.numEstimators, numEstimators = _d === void 0 ? 10 : _d, _e = _b.maxSamples, maxSamples = _e === void 0 ? 1.0 : _e, _f = _b.maxFeatures, maxFeatures = _f === void 0 ? 1.0 : _f, _g = _b.bootstrapSamples, bootstrapSamples = _g === void 0 ? false : _g, _h = _b.bootstrapFeatures, bootstrapFeatures = _h === void 0 ? false : _h, _j = _b.estimatorOptions, estimatorOptions = _j === void 0 ? {} : _j, _k = _b.maxSamplesIsFloating, maxSamplesIsFloating = _k === void 0 ? true : _k, _l = _b.maxFeaturesIsFloating, maxFeaturesIsFloating = _l === void 0 ? true : _l;
        this.estimators = [];
        this.estimatorsFeatures = [];
        this.maxSamplesIsFloating = true;
        this.maxFeaturesIsFloating = true;
        this.baseEstimator = baseEstimator;
        this.numEstimators = numEstimators;
        this.estimatorOptions = estimatorOptions;
        this.maxSamples = maxSamples;
        this.maxFeatures = maxFeatures;
        this.bootstrapSamples = bootstrapSamples;
        this.bootstrapFeatures = bootstrapFeatures;
        this.maxSamplesIsFloating = maxSamplesIsFloating;
        this.maxFeaturesIsFloating = maxFeaturesIsFloating;
    }
    /**
     * Builds an ensemble of base classifier from the training set (X, y).
     * @param {Array} X - array-like or sparse matrix of shape = [n_samples, n_features]
     * @param {Array} y - array-like, shape = [n_samples]
     * @returns void
     */
    BaggingClassifier.prototype.fit = function (X, y) {
        if (X === void 0) { X = null; }
        if (y === void 0) { y = null; }
        var xWrapped = tensors_1.ensure2DMatrix(X);
        validation_1.validateFitInputs(xWrapped, y);
        for (var i = 0; i < this.numEstimators; ++i) {
            var _a = __read(MathExtra_1.default.generateRandomSubsetOfMatrix(X, this.maxSamples, this.maxFeatures, this.bootstrapSamples, this.bootstrapFeatures, this.maxSamplesIsFloating, this.maxFeaturesIsFloating), 3), sampleX = _a[0], rowIndices = _a[1], columnIndices = _a[2];
            var sampleY = rowIndices.map(function (ind) { return y[ind]; });
            var estimator = new this.baseEstimator(this.estimatorOptions);
            this.estimatorsFeatures.push(columnIndices);
            estimator.fit(sampleX, sampleY);
            this.estimators.push(estimator);
        }
    };
    /**
     * Predict class for each row in X.
     *
     * Predictions are formed using the majority voting.
     * @param {Array} X - array-like or sparse matrix of shape = [n_samples, n_features]
     * @returns {Array} - array of shape [n_samples] that contains predicted class for each point X
     */
    BaggingClassifier.prototype.predict = function (X) {
        var _this = this;
        if (X === void 0) { X = null; }
        var _a = __read(tensors_1.inferShape(X), 1), numRows = _a[0];
        var predictions = this.estimators.map(function (estimator, i) {
            return estimator.predict(MathExtra_1.default.subset(X, __spread(Array(numRows).keys()), _this.estimatorsFeatures[i]));
        });
        var result = [];
        for (var i = 0; i < predictions[0].length; ++i) {
            var votes = new Map();
            for (var j = 0; j < predictions.length; ++j) {
                var cnt = votes.get(predictions[j][i]) || 0;
                votes.set(predictions[j][i], cnt + 1);
            }
            var resultingVote = this.getBiggestVote(votes);
            result.push(resultingVote);
        }
        return result;
    };
    /**
     * Get the model details in JSON format
     */
    BaggingClassifier.prototype.toJSON = function () {
        return {
            baseEstimator: this.baseEstimator,
            numEstimators: this.numEstimators,
            maxSamples: this.maxSamples,
            maxFeatures: this.maxFeatures,
            bootstrapSamples: this.bootstrapSamples,
            bootstrapFeatures: this.bootstrapFeatures,
            estimatorOptions: this.estimatorOptions,
            maxSamplesIsFloating: this.maxSamplesIsFloating,
            maxFeaturesIsFloating: this.maxFeaturesIsFloating,
            estimators: this.estimators,
            estimatorsFeatures: this.estimatorsFeatures,
        };
    };
    /**
     * Restore the model from a checkpoint
     * @param checkPoint
     */
    BaggingClassifier.prototype.fromJSON = function (checkPoint) {
        var e_1, _a;
        try {
            for (var _b = __values(Object.entries(checkPoint)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), k = _d[0], v = _d[1];
                this[k] = v;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /**
     * Retrieves the biggest vote from the votes map
     * @param votes
     */
    BaggingClassifier.prototype.getBiggestVote = function (votes) {
        var e_2, _a;
        var maxValue = -1;
        var maxKey;
        try {
            for (var _b = __values(votes.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), k = _d[0], v = _d[1];
                if (v > maxValue) {
                    maxValue = v;
                    maxKey = k;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return maxKey;
    };
    return BaggingClassifier;
}());
exports.BaggingClassifier = BaggingClassifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFnZ2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZW5zZW1ibGUvYmFnZ2luZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7R0FHRztBQUNILGdDQUFpRDtBQUVqRCxpRUFBc0M7QUFDdEMsNENBQThEO0FBQzlELGtEQUF3RDtBQUV4RDs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSDtJQWFFOzs7Ozs7Ozs7Ozs7Ozs7O09BZ0JHO0lBRUgsMkJBQ0UsRUE4QkM7WUE5QkQ7Ozs7Ozs7Ozs7Y0E4QkMsRUE3QkMscUJBQXNDLEVBQXRDLGtFQUFzQyxFQUN0QyxxQkFBa0IsRUFBbEIsdUNBQWtCLEVBQ2xCLGtCQUFnQixFQUFoQixxQ0FBZ0IsRUFDaEIsbUJBQWlCLEVBQWpCLHNDQUFpQixFQUNqQix3QkFBd0IsRUFBeEIsNkNBQXdCLEVBQ3hCLHlCQUF5QixFQUF6Qiw4Q0FBeUIsRUFDekIsd0JBQXFCLEVBQXJCLDBDQUFxQixFQUNyQiw0QkFBMkIsRUFBM0IsZ0RBQTJCLEVBQzNCLDZCQUE0QixFQUE1QixpREFBNEI7UUFqQ3hCLGVBQVUsR0FBVSxFQUFFLENBQUM7UUFDdkIsdUJBQWtCLEdBQWUsRUFBRSxDQUFDO1FBQ3BDLHlCQUFvQixHQUFZLElBQUksQ0FBQztRQUNyQywwQkFBcUIsR0FBWSxJQUFJLENBQUM7UUFxRDVDLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1FBQzNDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQztRQUNqRCxJQUFJLENBQUMscUJBQXFCLEdBQUcscUJBQXFCLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksK0JBQUcsR0FBVixVQUFXLENBQThCLEVBQUUsQ0FBOEI7UUFBOUQsa0JBQUEsRUFBQSxRQUE4QjtRQUFFLGtCQUFBLEVBQUEsUUFBOEI7UUFDdkUsSUFBTSxRQUFRLEdBQUcsd0JBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyw4QkFBaUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDckMsSUFBQSw0TUFRTCxFQVJNLGVBQU8sRUFBRSxrQkFBVSxFQUFFLHFCQVEzQixDQUFDO1lBQ0YsSUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBTixDQUFNLENBQUMsQ0FBQztZQUNoRCxJQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM1QyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNqQztJQUNILENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxtQ0FBTyxHQUFkLFVBQWUsQ0FBOEI7UUFBN0MsaUJBbUJDO1FBbkJjLGtCQUFBLEVBQUEsUUFBOEI7UUFDckMsSUFBQSx1Q0FBeUIsRUFBeEIsZUFBd0IsQ0FBQztRQUNoQyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ25ELE9BQUEsU0FBUyxDQUFDLE9BQU8sQ0FBQyxtQkFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQXpGLENBQXlGLENBQzFGLENBQUM7UUFDRixJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDOUMsSUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDM0MsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUN2QztZQUVELElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUM1QjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7T0FFRztJQUNJLGtDQUFNLEdBQWI7UUFhRSxPQUFPO1lBQ0wsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ2pDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDM0IsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7WUFDdkMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtZQUN6QyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ3ZDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxvQkFBb0I7WUFDL0MscUJBQXFCLEVBQUUsSUFBSSxDQUFDLHFCQUFxQjtZQUNqRCxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDM0Isa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtTQUM1QyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7T0FHRztJQUNJLG9DQUFRLEdBQWYsVUFBZ0IsVUFZZjs7O1lBQ0MsS0FBcUIsSUFBQSxLQUFBLFNBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQSxnQkFBQSw0QkFBRTtnQkFBdEMsSUFBQSx3QkFBTSxFQUFMLFNBQUMsRUFBRSxTQUFDO2dCQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDYjs7Ozs7Ozs7O0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLDBDQUFjLEdBQXRCLFVBQTBCLEtBQXFCOztRQUM3QyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNsQixJQUFJLE1BQU0sQ0FBQzs7WUFDWCxLQUFxQixJQUFBLEtBQUEsU0FBQSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUEsZ0JBQUEsNEJBQUU7Z0JBQTNCLElBQUEsd0JBQU0sRUFBTCxTQUFDLEVBQUUsU0FBQztnQkFDZCxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUU7b0JBQ2hCLFFBQVEsR0FBRyxDQUFDLENBQUM7b0JBQ2IsTUFBTSxHQUFHLENBQUMsQ0FBQztpQkFDWjthQUNGOzs7Ozs7Ozs7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBeE1ELElBd01DO0FBeE1ZLDhDQUFpQiJ9