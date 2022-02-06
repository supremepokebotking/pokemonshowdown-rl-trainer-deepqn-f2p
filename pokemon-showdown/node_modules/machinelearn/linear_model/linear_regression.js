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
/**
 * References:
 * - https://machinelearningmastery.com/implement-simple-linear-regression-scratch-python/
 */
var tf = __importStar(require("@tensorflow/tfjs"));
var lodash_1 = require("lodash");
var numeric = __importStar(require("numeric"));
var Errors_1 = require("../utils/Errors");
var MathExtra_1 = __importDefault(require("../utils/MathExtra"));
var tensors_1 = require("../utils/tensors");
var tensors_2 = require("../utils/tensors");
var validation_1 = require("../utils/validation");
/**
 * Type of Linear Regression
 * Univariate = It can handle a 1 dimensional input
 * Multivariate = It can handle a 2 dimensional input
 * @ignore
 */
var TypeLinearReg;
(function (TypeLinearReg) {
    TypeLinearReg["UNIVARIATE"] = "UNIVARIATE";
    TypeLinearReg["MULTIVARIATE"] = "MULTIVARIATE";
})(TypeLinearReg = exports.TypeLinearReg || (exports.TypeLinearReg = {}));
/**
 * Ordinary least squares Linear Regression.
 *
 * It supports both univariate and multivariate linear regressions.
 *
 * @example
 * import { LinearRegression } from './linear_regression';
 * const linearRegression = new LinearRegression();
 * const X = [1, 2, 4, 3, 5];
 * const y = [1, 3, 3, 2, 5];
 * linearRegression.fit(X, y);
 * lr.predict([1, 2]);
 * // [ 1.1999999999999995, 1.9999999999999996 ]
 *
 * const linearRegression2 = new LinearRegression();
 * const X2 = [[1, 1], [1, 2], [2, 2], [2, 3]];
 * const y2 = [1, 1, 2, 2];
 * linearRegression2.fit(X2, y2);
 * lr.predict([[1, 2]]);
 * // [1.0000001788139343]
 */
var LinearRegression = /** @class */ (function () {
    function LinearRegression() {
        this.weights = [];
        this.type = TypeLinearReg.MULTIVARIATE;
    }
    /**
     * fit linear model
     * @param {any} X - training values
     * @param {any} y - target values
     */
    LinearRegression.prototype.fit = function (X, y) {
        if (X === void 0) { X = null; }
        if (y === void 0) { y = null; }
        if (!Array.isArray(X)) {
            throw new Errors_1.ValidationError('Received a non-array argument for X');
        }
        if (!Array.isArray(X) || !Array.isArray(y)) {
            throw new Errors_1.ValidationError('Received a non-array argument for y');
        }
        var xShape = tensors_2.inferShape(X);
        var yShape = tensors_2.inferShape(y);
        if (xShape.length === 1 && yShape.length === 1 && xShape[0] === yShape[0]) {
            // Univariate linear regression
            this.type = TypeLinearReg.UNIVARIATE;
            this.weights = this.calculateUnivariateCoeff(X, y); // getting b0 and b1
        }
        else if (xShape.length === 2 && yShape.length === 1 && xShape[0] === yShape[0]) {
            this.type = TypeLinearReg.MULTIVARIATE;
            this.weights = this.calculateMultiVariateCoeff(X, y);
        }
        else {
            throw new Errors_1.ValidationError("Sample(" + xShape[0] + ") and target(" + yShape[0] + ") sizes do not match");
        }
    };
    /**
     * Predict using the linear model
     * @param {number} X - Values to predict.
     * @returns {number}
     */
    LinearRegression.prototype.predict = function (X) {
        if (X === void 0) { X = null; }
        if (!Array.isArray(X)) {
            throw new Errors_1.ValidationError('Received a non-array argument for y');
        }
        var xShape = tensors_2.inferShape(X);
        if (xShape.length === 1 && this.type.toString() === TypeLinearReg.UNIVARIATE.toString()) {
            return this.univariatePredict(X);
        }
        else if (xShape.length === 2 && this.type.toString() === TypeLinearReg.MULTIVARIATE.toString()) {
            return this.multivariatePredict(X);
        }
        else {
            throw new Errors_1.ValidationError("The matrix is incorrectly shaped: while X is " + xShape.length + ", type is " + this.type.toString().toLowerCase());
        }
    };
    /**
     * Get the model details in JSON format
     */
    LinearRegression.prototype.toJSON = function () {
        return {
            weights: this.weights,
            type: this.type,
        };
    };
    /**
     * Restore the model from a checkpoint
     */
    LinearRegression.prototype.fromJSON = function (_a) {
        var 
        /**
         * Model's weights
         */
        _b = _a.weights, 
        /**
         * Model's weights
         */
        weights = _b === void 0 ? null : _b, 
        /**
         * Type of linear regression, it can be either UNIVARIATE or MULTIVARIATE
         */
        _c = _a.type, 
        /**
         * Type of linear regression, it can be either UNIVARIATE or MULTIVARIATE
         */
        type = _c === void 0 ? null : _c;
        if (!weights || !type) {
            throw new Error('You must provide both weights and type to restore the linear regression model');
        }
        this.weights = weights;
        this.type = type;
    };
    /**
     * Univariate prediction
     * y = b0 + b1 * X
     *
     * @param X
     */
    LinearRegression.prototype.univariatePredict = function (X) {
        if (X === void 0) { X = null; }
        var preds = [];
        for (var i = 0; i < lodash_1.size(X); i++) {
            preds.push(this.weights[0] + this.weights[1] * X[i]);
        }
        return preds;
    };
    /**
     * Multivariate prediction
     * y = (b0 * X0) + (b1 * X1) + (b2 * X2) + ....
     *
     * @param X
     */
    LinearRegression.prototype.multivariatePredict = function (X) {
        if (X === void 0) { X = null; }
        var preds = [];
        for (var i = 0; i < X.length; i++) {
            var row = X[i];
            var yPred = 0;
            for (var j = 0; j < row.length; j++) {
                yPred += this.weights[j] * row[j];
            }
            preds.push(yPred);
        }
        return preds;
    };
    /**
     * Calculates univariate coefficients for linear regression
     * @param X - X values
     * @param y - y targets
     */
    LinearRegression.prototype.calculateUnivariateCoeff = function (X, y) {
        var xMean = tf.mean(X).dataSync();
        var yMean = tf.mean(y).dataSync();
        var b1 = MathExtra_1.default.covariance(X, xMean, y, yMean) / MathExtra_1.default.variance(X, xMean);
        var b0 = yMean - b1 * xMean;
        return this.weights.concat([b0, b1]);
    };
    /**
     * Calculate multivariate coefficients for linear regression
     * @param X
     * @param y
     */
    LinearRegression.prototype.calculateMultiVariateCoeff = function (X, y) {
        var _a = __read(tf.linalg.qr(tf.tensor2d(X)), 2), q = _a[0], r = _a[1];
        var rawR = tensors_1.reshape(Array.from(r.dataSync()), r.shape);
        var validatedR = validation_1.validateMatrix2D(rawR);
        var weights = tf
            .tensor(numeric.inv(validatedR))
            .dot(q.transpose())
            .dot(tf.tensor(y))
            .dataSync();
        return Array.from(weights);
    };
    return LinearRegression;
}());
exports.LinearRegression = LinearRegression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZWFyX3JlZ3Jlc3Npb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2xpbmVhcl9tb2RlbC9saW5lYXJfcmVncmVzc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztHQUdHO0FBQ0gsbURBQXVDO0FBQ3ZDLGlDQUE4QjtBQUM5QiwrQ0FBbUM7QUFFbkMsMENBQWtEO0FBQ2xELGlFQUFzQztBQUN0Qyw0Q0FBMkM7QUFDM0MsNENBQThDO0FBQzlDLGtEQUF1RDtBQUV2RDs7Ozs7R0FLRztBQUNILElBQVksYUFHWDtBQUhELFdBQVksYUFBYTtJQUN2QiwwQ0FBeUIsQ0FBQTtJQUN6Qiw4Q0FBNkIsQ0FBQTtBQUMvQixDQUFDLEVBSFcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFHeEI7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFDSDtJQUFBO1FBQ1UsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUN2QixTQUFJLEdBQWtCLGFBQWEsQ0FBQyxZQUFZLENBQUM7SUE4SjNELENBQUM7SUE1SkM7Ozs7T0FJRztJQUNJLDhCQUFHLEdBQVYsVUFDRSxDQUFxRCxFQUNyRCxDQUFxRDtRQURyRCxrQkFBQSxFQUFBLFFBQXFEO1FBQ3JELGtCQUFBLEVBQUEsUUFBcUQ7UUFFckQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckIsTUFBTSxJQUFJLHdCQUFlLENBQUMscUNBQXFDLENBQUMsQ0FBQztTQUNsRTtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMxQyxNQUFNLElBQUksd0JBQWUsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1NBQ2xFO1FBRUQsSUFBTSxNQUFNLEdBQUcsb0JBQVUs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