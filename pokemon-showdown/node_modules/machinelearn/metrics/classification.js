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
var _ = __importStar(require("lodash"));
var Errors_1 = require("../utils/Errors");
var tensors_1 = require("../utils/tensors");
var validation_1 = require("../utils/validation");
/**
 * util function to calculate a weighted sum
 * @param {any} sampleScore
 * @param {any} normalize
 * @returns {number}
 * @ignore
 */
function _weightedSum(_a) {
    var sampleScore = _a.sampleScore, 
    // sampleWeight = null,
    _b = _a.normalize, 
    // sampleWeight = null,
    normalize = _b === void 0 ? false : _b;
    if (normalize) {
        return _.mean(sampleScore);
    }
    else {
        return _.sum(sampleScore);
    }
}
/**
 * Validator for classification exceptions
 * @param y_true
 * @param y_pred
 * @param labels
 * @param options
 * @ignore
 */
exports.validateInitialInputs = function (y_true, y_pred, labels, options) {
    if (options === void 0) { options = {}; }
    var checkMultiClass = _.get(options, 'multiclass');
    // Multiclass
    if (checkMultiClass) {
        // TODO: Multi label
        if (validation_1.checkArray(y_true).multiclass || validation_1.checkArray(y_pred).multiclass) {
            throw new Errors_1.ValidationError('Multiclass is not supported yet!');
        }
    }
    // Checking nullity or empty
    if (!y_true || _.isEmpty(y_true)) {
        throw new Errors_1.ValidationError('y_true cannot be null or empty');
    }
    if (!y_pred || _.isEmpty(y_pred)) {
        throw new Errors_1.ValidationError('y_pred cannot be null or empty');
    }
    // Checking the size equality
    if (_.size(y_true) !== _.size(y_pred)) {
        throw new Errors_1.ValidationError('y_true and y_pred are not equal in size!');
    }
    // Checking labels equal to both y_true and y_pred classes
    // Labels is optional
    if (labels) {
        var yTrueCls = _.flowRight(function (x) { return _.sortBy(x, function (y) { return y; }); }, function (x) { return _.uniq(x); })(y_true);
        var yPredCls = _.flowRight(function (x) { return _.sortBy(x, function (y) { return y; }); }, function (x) { return _.uniq(x); })(y_pred);
        var sortedLabels = _.sortBy(labels, function (x) { return x; });
        if (!_.isEqual(sortedLabels, yTrueCls) || !_.isEqual(sortedLabels, yPredCls)) {
            throw new Errors_1.ValidationClassMismatch('Labels must match the classes');
        }
    }
};
/**
 * Accuracy classification score.
 *
 * In multilabel classification, this function computes subset accuracy:
 * the set of labels predicted for a sample must exactly match the corresponding set of labels in y_true.
 *
 * @example
 * import { accuracyScore } from 'machinelearn/metrics';
 *
 * const accResult = accuracyScore(
 *  [0, 1, 2, 3],
 *  [0, 2, 1, 3]
 * );
 *
 * // accuracy result: 0.5
 *
 * @param y_true - 1d array-like, or label indicator array / sparse matrix
 * @param y_pred - 1d array-like, or label indicator array / sparse matrix
 * @param normalize
 */
function accuracyScore(y_true, y_pred, _a) {
    if (y_true === void 0) { y_true = null; }
    if (y_pred === void 0) { y_pred = null; }
    var _b = (_a === void 0 ? {
        normalize: true,
    } : _a).normalize, normalize = _b === void 0 ? true : _b;
    exports.validateInitialInputs(y_true, y_pred, null, { multiclass: true });
    var yTrueRange = _.range(0, _.size(y_true));
    var normalised = _.map(yTrueRange, function (index) {
        var yTrue = y_true[index];
        var yPred = y_pred[index];
        return yTrue === yPred ? 1 : 0;
    });
    return _weightedSum({
        normalize: normalize,
        sampleScore: normalised,
    });
}
exports.accuracyScore = accuracyScore;
/**
 * Zero-one classification loss.
 *
 * If normalize is `true`, return the fraction of misclassifications (float),
 * else it returns the number of misclassifications (int). The best performance is 0.
 *
 * @example
 * import { zeroOneLoss } from 'machinelearn/metrics';
 *
 * const loss_zero_one_result = zeroOneLoss(
 *   [1, 2, 3, 4],
 *   [2, 2, 3, 5]
 * );
 * console.log(loss_zero_one_result); // 0.5
 *
 * @param {any} y_true - Ground truth (correct) labels.
 * @param {any} y_pred - Predicted labels, as returned by a classifier.
 * @param {any} normalize
 * @returns {number}
 */
function zeroOneLoss(y_true, y_pred, _a) {
    if (y_true === void 0) { y_true = null; }
    if (y_pred === void 0) { y_pred = null; }
    var 
    /**
     * If False, return the number of misclassifications. Otherwise, return the fraction of misclassifications.
     */
    _b = (_a === void 0 ? {
        normalize: true,
    } : _a).normalize, 
    /**
     * If False, return the number of misclassifications. Otherwise, return the fraction of misclassifications.
     */
    normalize = _b === void 0 ? true : _b;
    if (normalize) {
        return 1 - accuracyScore(y_true, y_pred);
    }
    // TODO: Fix return 0; implement when normalize === false
    return 0;
}
exports.zeroOneLoss = zeroOneLoss;
/**
 * A confusion matrix is a technique for summarizing the performance of a classification algorithm.
 *
 * Classification accuracy alone can be misleading if you have an unequal number of observations in each class or if you have more than two classes in your dataset.
 *
 * Calculating a confusion matrix can give you a better idea of what your classification model is getting right and what types of errors it is making.
 *
 * @example
 * import { confusion_matrix } from 'machinelearn/metrics';
 *
 * const matrix1 = confusion_matrix([1, 2, 3], [1, 2, 3]);
 * console.log(matrix1); // [ [ 1, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ] ]
 *
 * const matrix2 = confusion_matrix(
 *   ['cat', 'ant', 'cat', 'cat', 'ant', 'bird'],
 *   ['ant', 'ant', 'cat', 'cat', 'ant', 'cat']
 * );
 * console.log(matrix2); // [ [ 1, 2, 0 ], [ 2, 0, 0 ], [ 0, 1, 0 ] ]
 *
 * @param y_true - Ground truth (correct) target values.
 * @param y_pred - Estimated targets as returned by a classifier.
 * @param labels
 */
function confusion_matrix(y_true, y_pred, _a) {
    if (y_true === void 0) { y_true = null; }
    if (y_pred === void 0) { y_pred = null; }
    var 
    /**
     * List of labels to index the matrix. This may be used to reorder or
     * select a subset of labels. If none is given, those that appear
     * at least once in y_true or y_pred are used in sorted order.
     */
    _b = (_a === void 0 ? {
        labels: null,
    } : _a).labels, 
    /**
     * List of labels to index the matrix. This may be used to reorder or
     * select a subset of labels. If none is given, those that appear
     * at least once in y_true or y_pred are used in sorted order.
     */
    labels = _b === void 0 ? null : _b;
    exports.validateInitialInputs(y_true, y_pred, labels);
    // TODO: Sorting if set by options
    // TODO: classes should be based on yTrue
    var yTrueCls = _.uniqBy(y_true, function (x) { return x; });
    var yPredCls = _.uniqBy(y_pred, function (x) { return x; });
    // TODO: Issue was raisen to fix the typing: https://github.com/josdejong/mathjs/issues/1150
    var yTrueSize = _.size(yTrueCls);
    // const placeholder: any = math.zeros(_.size(yTrueCls), _.size(yTrueCls));
    var rawZeros = __spread(tf.zeros([yTrueSize, yTrueSize]).dataSync());
    var placeholder = tensors_1.reshape(rawZeros, [yTrueSize, yTrueSize]);
    // Calculating the confusion matrix
    // Looping the index for y_true
    var rowRange = _.range(0, _.size(placeholder));
    _.forEach(rowRange, function (rowIndex) {
        // Looping the index for y_pred
        var colRange = _.range(0, _.size(placeholder[rowIndex]));
        _.forEach(colRange, function (colIndex) {
            // Get current target y true and y pred
            var yTargetTrueVal = yTrueCls[rowIndex];
            var yTargetPredVal = yPredCls[colIndex];
            // Looping the range of y true for pairing
            var yTrueRange = _.range(0, _.size(y_true));
            var score = _.reduce(yTrueRange, function (sum, n) {
                var trueVal = y_true[n];
                var predVal = y_pred[n];
                if (_.isEqual(trueVal, yTargetTrueVal) && _.isEqual(predVal, yTargetPredVal)) {
                    return sum + 1;
                }
                return sum;
            }, 0);
            // Recording the score
            placeholder[rowIndex][colIndex] = score;
        });
    });
    return placeholder;
}
exports.confusion_matrix = confusion_matrix;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3NpZmljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL21ldHJpY3MvY2xhc3NpZmljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtREFBdUM7QUFDdkMsd0NBQTRCO0FBRTVCLDBDQUEyRTtBQUMzRSw0Q0FBMkM7QUFDM0Msa0RBQWlEO0FBRWpEOzs7Ozs7R0FNRztBQUNILFNBQVMsWUFBWSxDQUFDLEVBSXJCO1FBSEMsNEJBQVc7SUFDWCx1QkFBdUI7SUFDdkIsaUJBQWlCO0lBRGpCLHVCQUF1QjtJQUN2QixzQ0FBaUI7SUFFakIsSUFBSSxTQUFTLEVBQUU7UUFDYixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDNUI7U0FBTTtRQUNMLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUMzQjtBQUNILENBQUM7QUFFRDs7Ozs7OztHQU9HO0FBQ1UsUUFBQSxxQkFBcUIsR0FBRyxVQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQVk7SUFBWix3QkFBQSxFQUFBLFlBQVk7SUFDeEUsSUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFFckQsYUFBYTtJQUNiLElBQUksZUFBZSxFQUFFO1FBQ25CLG9CQUFvQjtRQUNwQixJQUFJLHVCQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxJQUFJLHVCQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFO1lBQ2xFLE1BQU0sSUFBSSx3QkFBZSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7U0FDL0Q7S0FDRjtJQUVELDRCQUE0QjtJQUM1QixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDaEMsTUFB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