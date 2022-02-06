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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tf = __importStar(require("@tensorflow/tfjs"));
var lodash_1 = require("lodash");
var Errors_1 = require("../utils/Errors");
var tensors_1 = require("../utils/tensors");
var validation_1 = require("../utils/validation");
var SQRT_2PI = Math.sqrt(Math.PI * 2);
/**
 * The Naive is an intuitive method that uses probabilistic of each attribute
 * being in each class to make a prediction. It uses Gaussian function to estimate
 * probability of a given class.
 *
 * @example
 * import { GaussianNB } from 'machinelearn/naive_bayes';
 *
 * const nb = new GaussianNB();
 * const X = [[1, 20], [2, 21], [3, 22], [4, 22]];
 * const y = [1, 0, 1, 0];
 * nb.fit({ X, y });
 * nb.predict({ X: [[1, 20]] }); // returns [ 1 ]
 *
 */
var GaussianNB = /** @class */ (function () {
    function GaussianNB() {
    }
    /**
     * @param X - array-like or sparse matrix of shape = [n_samples, n_features]
     * @param y - array-like, shape = [n_samples] or [n_samples, n_outputs]
     */
    GaussianNB.prototype.fit = function (X, y) {
        if (X === void 0) { X = null; }
        if (y === void 0) { y = null; }
        validation_1.validateFitInputs(X, y);
        var _a = this.fitModel(X, y), classCategories = _a.classCategories, mean = _a.mean, variance = _a.variance;
        this.classCategories = classCategories;
        this.mean = mean;
        this.variance = variance;
    };
    /**
     * @param X - array-like, shape = [n_samples, n_features]
     */
    GaussianNB.prototype.predict = function (X) {
        var _this = this;
        if (X === void 0) { X = null; }
        validation_1.validateMatrix2D(X);
        return X.map(function (x) { return _this.singlePredict(x); });
    };
    /**
     * Restore the model from saved states
     * @param modelState
     */
    GaussianNB.prototype.fromJSON = function (_a) {
        var _b = _a.classCategories, classCategories = _b === void 0 ? null : _b, _c = _a.mean, mean = _c === void 0 ? null : _c, _d = _a.variance, variance = _d === void 0 ? null : _d;
        this.classCategories = classCategories;
        this.mean = tf.tensor2d(mean);
        this.variance = tf.tensor2d(variance);
    };
    /**
     * Save the model's states
     */
    GaussianNB.prototype.toJSON = function () {
        return {
            classCategories: this.classCategories,
            mean: tensors_1.reshape(__spread(this.mean.dataSync()), this.mean.shape),
            variance: tensors_1.reshape(__spread(this.variance.dataSync()), this.variance.shape),
        };
    };
    /**
     * Make a single prediction
     *
     * @param  {ReadonlyArray<number>} X- values to predict in Matrix format
     * @returns T
     */
    GaussianNB.prototype.singlePredict = function (X) {
        var matrixX = tf.tensor1d(X, 'float32');
        var numFeatures = matrixX.shape[0];
        // Comparing input and summary shapes
        var summaryLength = this.mean.shape[1];
        if (numFeatures !== summaryLength) {
            throw new Errors_1.ValidationError("Prediction input " + matrixX.shape[0] + " length must be equal or less than summary length " + summaryLength);
        }
        var meanValPow = matrixX
            .sub(this.mean)
            .pow(tf.scalar(2))
            .mul(tf.scalar(-1));
        var exponent = meanValPow.div(this.variance.mul(tf.scalar(2))).exp();
        var innerDiv = tf.scalar(SQRT_2PI).mul(this.variance.sqrt());
        var probabilityArray = tf
            .scalar(1)
            .div(innerDiv)
            .mul(exponent);
        var selectionIndex = probabilityArray
            .prod(1)
            .argMax()
            .dataSync()[0];
        return this.classCategories[selectionIndex];
    };
    /**
     * Summarise the dataset per class using "probability density function"
     *
     * @param  {Type2DMatrix<number>} X
     * @param  {ReadonlyArray<T>} y
     * @returns InterfaceFitModel
     */
    GaussianNB.prototype.fitModel = function (X, y) {
        var classCategories = __spread(new Set(y)).sort();
        // Separates X by classes specified by y argument
        var separatedByCategory = lodash_1.zip(X, y).reduce(function (groups, _a) {
            var _b = __read(_a, 2), row = _b[0], category = _b[1];
            groups[category.toString()] = groups[category.toString()] || [];
            groups[category.toString()].push(row);
            return groups;
        }, {});
        var momentStack = classCategories.map(function (category) {
            var classFeatures = tf.tensor2d(separatedByCategory[category.toString()], null, 'float32');
            return tf.moments(classFeatures, [0]);
        });
        // For every class we have a mean and variance for each feature
        var mean = tf.stack(momentStack.map(function (m) { return m.mean; }));
        var variance = tf.stack(momentStack.map(function (m) { return m.variance; }));
        // TODO check for NaN or 0 variance
        // setTimeout(() => {
        //   if ([...variance.dataSync()].some(i => i === 0)) {
        //     console.error('No variance on one of the features. Errors may result.');
        //   }
        // }, 100);
        return {
            classCategories: classCategories,
            mean: mean,
            variance: variance,
        };
    };
    return GaussianNB;
}());
exports.GaussianNB = GaussianNB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F1c3NpYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL25haXZlX2JheWVzL2dhdXNzaWFuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbURBQXVDO0FBQ3ZDLGlDQUE2QjtBQUU3QiwwQ0FBa0Q7QUFDbEQsNENBQTJDO0FBQzNDLGtEQUEwRTtBQUUxRSxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFFeEM7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSDtJQUFBO0lBc0tBLENBQUM7SUFqS0M7OztPQUdHO0lBQ0ksd0JBQUcsR0FBVixVQUFXLENBQThCLEVBQUUsQ0FBeUI7UUFBekQsa0JBQUEsRUFBQSxRQUE4QjtRQUFFLGtCQUFBLEVBQUEsUUFBeUI7UUFDbEUsOEJBQWlCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQUEsd0JBQXlELEVBQXZELG9DQUFlLEVBQUUsY0FBSSxFQUFFLHNCQUFnQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFFRDs7T0FFRztJQUNJLDRCQUFPLEdBQWQsVUFBZSxDQUE4QjtRQUE3QyxpQkFHQztRQUhjLGtCQUFBLEVBQUEsUUFBOEI7UUFDM0MsNkJBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFRLE9BQUEsS0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRDs7O09BR0c7SUFDSSw2QkFBUSxH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