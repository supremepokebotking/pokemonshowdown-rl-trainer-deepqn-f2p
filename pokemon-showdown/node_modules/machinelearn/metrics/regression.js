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
Object.defineProperty(exports, "__esModule", { value: true });
var tf = __importStar(require("@tensorflow/tfjs"));
var lodash_1 = require("lodash");
var Errors_1 = require("../utils/Errors");
var tensors_1 = require("../utils/tensors");
var validation_1 = require("../utils/validation");
/**
 * Mean absolute error regression loss
 *
 * @example
 * import { mean_absolute_error } from 'machinelearn/metrics';
 * const y_true = [3, -0.5, 2, 7]
 * const y_pred = [2.5, 0.0, 2, 8]
 * mean_absolute_error(y_true, y_pred); // 0.5
 *
 * @param y_true - Ground truth (correct) target values.
 * @param y_pred - Estimated target values.
 * @param sample_weight - Sample weights.
 */
function mean_absolute_error(y_true, y_pred, 
// Options
_a) {
    if (y_true === void 0) { y_true = null; }
    if (y_pred === void 0) { y_pred = null; }
    var _b = (_a === void 0 ? {
        sample_weight: null,
    } : _a).sample_weight, sample_weight = _b === void 0 ? null : _b;
    // Validation 1: empty array check
    var _c = __read(validation_1.validateShapesEqual(y_true, y_pred), 2), yTrueTensor = _c[0], yPredTensor = _c[1];
    if (sample_weight !== null) {
        var weightShape = tensors_1.inferShape(sample_weight);
        if (!lodash_1.isEqual(yTrueTensor.shape, weightShape)) {
            throw new TypeError("The shape of " + JSON.stringify(weightShape) + "\n       does not match with the sample size " + JSON.stringify(yTrueTensor.shape));
        }
    }
    /**
     * Compute the weighted average along the specified axis.
     *
     * @example
     * average(tf.tensor1d([1, 2, 3, 4])).dataSync(); // [2.5]
     *
     * @param X - Array containing data to be averaged. If a is not an array, a conversion is attempted.
     * @param axis - Axis along which to average a. If None, averaging is done over the flattened array.
     * @param w - An array of weights associated with the values in a. Each value in a contributes to the average according to its associated weight. The weights array can either be 1-D (in which case its length must be the size of a along the given axis) or of the same shape as a. If weights=None, then all data in a are assumed to have a weight equal to one.
     * @ignore
     */
    var average = function (X, axis, w) {
        if (axis === void 0) { axis = 0; }
        if (w === void 0) { w = null; }
        if (w !== null) {
            var wgt = tf.tensor1d(w);
            var scl = wgt.sum(axis);
            return tf
                .mul(X, wgt)
                .sum(axis)
                .div(scl);
        }
        else {
            var sample_size = X.size;
            return tf.div(tf.sum(X), tf.scalar(sample_size));
        }
    };
    var output_errors = yTrueTensor.sub(yPredTensor).abs();
    var avg_errors = average(output_errors, 0, sample_weight);
    return average(avg_errors).dataSync()[0];
}
exports.mean_absolute_error = mean_absolute_error;
/**
 * Mean squared error regression loss
 *
 * @example
 * import { mean_squared_error } from 'machinelearn/metrics';
 *
 * const y_true = [3, -0.5, 2, 7];
 * const y_pred = [2.5, 0.0, 2, 8];
 *
 * console.log(mean_squared_error(y_true, y_pred));
 * // result: 0.375
 *
 * const y_true1 = [[0.5, 1], [-1, 1], [7, -6]];
 * const y_pred1 = [[0, 2], [-1, 2], [8, -5]];
 *
 * console.log(mean_squared_error(y_true1, y_pred1));
 * // result: 0.7083333134651184
 *
 * @param y_true - Ground truth (correct) target values.
 * @param y_pred - Estimated target values.
 */
function mean_squared_error(y_true, y_pred, 
// Options
_a) {
    if (y_true === void 0) { y_true = null; }
    if (y_pred === void 0) { y_pred = null; }
    var 
    /**
     * Sample weights.
     */
    _b = (_a === void 0 ? {
        sample_weight: null,
    } : _a).sample_weight, 
    /**
     * Sample weights.
     */
    sample_weight = _b === void 0 ? null : _b;
    var _c = __read(validation_1.validateShapesEqual(y_true, y_pred), 2), yTrueTensor = _c[0], yPredTensor = _c[1];
    return tf.losses.meanSquaredError(yTrueTensor, yPredTensor, sample_weight).dataSync()[0];
}
exports.mean_squared_error = mean_squared_error;
/**
 * Mean squared error regression loss
 *
 * @example
 * import { mean_squared_log_error } from 'machinelearn/metrics';
 *
 * const y_true = [3, 0.5, 2, 7];
 * const y_pred = [2.5, 0.0, 2, 8];
 *
 * console.log(mean_squared_error(y_true, y_pred));
 * // result: 0.04902636259794235
 *
 * const y_true1 = [[0.5, 1], [1, 1], [7, 6]];
 * const y_pred1 = [[0, 2], [1, 2], [8, 5]];
 *
 * console.log(mean_squared_error(y_true1, y_pred1));
 * // result: 0.08847352117300034
 *
 * @param y_true - Ground truth (correct) target values(should be positive).
 * @param y_pred - Estimated target values(should be positive).
 */
function mean_squared_log_error(y_true, y_pred, 
// Options
_a) {
    if (y_true === void 0) { y_true = null; }
    if (y_pred === void 0) { y_pred = null; }
    var 
    /**
     * Sample weights.
     */
    _b = (_a === void 0 ? {
        sample_weight: null,
    } : _a).sample_weight, 
    /**
     * Sample weights.
     */
    sample_weight = _b === void 0 ? null : _b;
    var _c = __read(validation_1.validateShapesEqual(y_true, y_pred), 2), yTrueTensor = _c[0], yPredTensor = _c[1];
    var error = function (y) { return new Errors_1.ValidationError("None of the values of " + JSON.stringify(y) + " can be less than 0"); };
    if (lodash_1.flatten(y_true).filter(function (a) { return a < 0; }).length > 0) {
        throw error(y_true);
    }
    if (lodash_1.flatten(y_pred).filter(function (a) { return a < 0; }).length > 0) {
        throw error(y_pred);
    }
    return tf.losses.meanSquaredError(yTrueTensor.log1p(), yPredTensor.log1p(), sample_weight).dataSync()[0];
}
exports.mean_squared_log_error = mean_squared_log_error;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVncmVzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbWV0cmljcy9yZWdyZXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtREFBdUM7QUFDdkMsaUNBQTBDO0FBRTFDLDBDQUFrRDtBQUNsRCw0Q0FBOEM7QUFDOUMsa0RBQTBEO0FBRTFEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILFNBQWdCLG1CQUFtQixDQUNqQyxNQUEwRCxFQUMxRCxNQUEwRDtBQUMxRCxVQUFVO0FBQ1YsRUFNQztJQVRELHVCQUFBLEVBQUEsYUFBMEQ7SUFDMUQsdUJBQUEsRUFBQSxhQUEwRDtRQUd4RDs7eUJBQW9CLEVBQXBCLHlDQUFvQjtJQU90QixrQ0FBa0M7SUFDNUIsSUFBQSxnRUFBNkUsRUFBNUUsbUJBQVcsRUFBRSxtQkFBK0QsQ0FBQztJQUVwRixJQUFJLGFBQWEsS0FBSyxJQUFJLEVBQUU7UUFDMUIsSUFBTSxXQUFXLEdBQUcsb0JBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsZ0JBQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxFQUFFO1lBQzVDLE1BQU0sSUFBSSxTQUFTLENBQUMsa0JBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLHFEQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUcsQ0FBQyxDQUFDO1NBQzdFO0tBQ0Y7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gsSUFBTSxPQUFPLEdBQUcsVUFBQyxDQUFZLEVBQUUsSUFBZ0IsRUFBRSxDQUFxQztRQUF2RCxxQkFBQSxFQUFBLFFBQWdCO1FBQUUsa0JBQUEsRUFBQSxRQUFxQztRQUNwRixJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDZCxJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FB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