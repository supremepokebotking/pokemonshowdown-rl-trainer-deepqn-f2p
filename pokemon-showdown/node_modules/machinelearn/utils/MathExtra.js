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
var _ = __importStar(require("lodash"));
var Errors_1 = require("./Errors");
var tensors_1 = require("./tensors");
/**
 * Return the number of elements along a given axis.
 * @param {any} X: Array like input data
 * @param {any} axis
 * @ignore
 */
var size = function (X, axis) {
    if (axis === void 0) { axis = 0; }
    var rows = _.size(X);
    if (rows === 0) {
        throw new Errors_1.ValidationError('Invalid input array of size 0!');
    }
    if (axis === 0) {
        return rows;
    }
    else if (axis === 1) {
        return _.flowRight(_.size, function (a) { return _.get(a, '[0]'); })(X);
    }
    throw new Errors_1.ValidationError("Invalid axis value " + axis + " was given");
};
/**
 * Just a dumb version of subset, which is sufficient enough for now.
 * It can only handle range of rows with a single column.
 *
 * TODO: Improve.
 * @param X
 * @param rowsRange
 * @param colsRange
 * @ignore
 */
var subset = function (X, rowsRange, colsRange, replacement) {
    if (replacement === void 0) { replacement = null; }
    // console.log('checking subset', X, rowsRange, colsRange, replacement);
    if (replacement) {
        var _X_1 = _.cloneDeep(X);
        var _loop_1 = function (i) {
            var rowIndex = rowsRange[i];
            colsRange.forEach(function (col) {
                _X_1[rowIndex][col] = replacement[i];
            });
        };
        for (var i = 0; i < rowsRange.length; i++) {
            _loop_1(i);
        }
        return _X_1;
    }
    else {
        var result = [];
        var _loop_2 = function (i) {
            var rowIndex = rowsRange[i];
            var subSection = [];
            colsRange.forEach(function (col) {
                subSection.push(X[rowIndex][col]);
            });
            // result.push([X[rowIndex][col]]);
            result.push(subSection);
        };
        // TODO: Replace it with a proper matrix subset method. e.g. http://mathjs.org/docs/reference/functions/subset.html
        for (var i = 0; i < rowsRange.length; i++) {
            _loop_2(i);
        }
        return result;
    }
};
/**
 * Get range of values
 * @param start
 * @param stop
 * @ignore
 */
var range = function (start, stop) {
    if (!_.isNumber(start) || !_.isNumber(stop)) {
        throw new Errors_1.ValidationError('start and stop arguments need to be numbers');
    }
    return _.range(start, stop);
};
/**
 * Checking the maxtrix is a matrix of a certain data type (e.g. number)
 * The function also performs isMatrix against the passed in dataset
 * @param matrix
 * @param {string} _type
 * @ignore
 */
var isMatrixOf = function (matrix, _type) {
    if (_type === void 0) { _type = 'number'; }
    if (!isMatrix(matrix)) {
        throw new Errors_1.ValidationError("Cannot perform isMatrixOf " + _type + " unless the data is matrix");
    }
    // Checking each elements inside the matrix is not number
    // Returns an array of result per row
    var vectorChecks = matrix.map(function (arr) {
        return arr.some(function (x) {
            // Checking type of each element
            if (_type === 'number') {
                return !_.isNumber(x);
            }
            else {
                throw Error('Cannot check matrix of an unknown type');
            }
        });
    });
    // All should be false
    return vectorChecks.indexOf(true) === -1;
};
/**
 * Checking the matrix is a data of multiple rows
 * @param matrix
 * @returns {boolean}
 * @ignore
 */
var isMatrix = function (matrix) {
    if (!Array.isArray(matrix)) {
        return false;
    }
    if (_.size(matrix) === 0) {
        return false;
    }
    var isAllArray = matrix.map(function (arr) { return _.isArray(arr); });
    return isAllArray.indexOf(false) === -1;
};
/**
 * Checking the array is a type of X
 * @param arr
 * @param {string} _type
 * @returns {boolean}
 * @ignore
 */
var isArrayOf = function (arr, _type) {
    if (_type === void 0) { _type = 'number'; }
    if (_type === 'number') {
        return !arr.some(isNaN);
    }
    else if (_type === 'string') {
        return !arr.some(function (x) { return !_.isString(x); });
    }
    throw new Errors_1.ValidationError("Failed to check the array content of type " + _type);
};
/**
 *
 * @param {number[]} v1
 * @param {number[]} v2
 * @returns {number}
 * @ignore
 */
var euclideanDistance = function (v1, v2) {
    var v1Range = _.range(0, v1.length);
    var initialTotal = 0;
    var total = _.reduce(v1Range, function (sum, i) {
        return sum + Math.pow(v2[i] - v1[i], 2);
    }, initialTotal);
    return Math.sqrt(total);
};
/**
 *
 * @param {number[]} v1
 * @param {number[]} v2
 * @returns {number}
 * @ignore
 */
var manhattanDistance = function (v1, v2) {
    var v1Range = _.range(0, v1.length);
    var initialTotal = 0;
    return _.reduce(v1Range, function (total, i) {
        return total + Math.abs(v2[i] - v1[i]);
    }, initialTotal);
};
/**
 * Subtracts two matrices
 * @param X
 * @param y
 * @ignore
 */
var subtract = function (X, y) {
    var _X = _.clone(X);
    for (var rowIndex = 0; rowIndex < _X.length; rowIndex++) {
        var row = X[rowIndex];
        for (var colIndex = 0; colIndex < row.length; colIndex++) {
            var column = row[colIndex];
            // Supports y.length === 1 or y.length === row.length
            if (y.length === 1) {
                var subs = y[0];
                _X[rowIndex][colIndex] = column - subs;
            }
            else if (y.length === row.length) {
                var subs = y[colIndex];
                _X[rowIndex][colIndex] = column - subs;
            }
            else {
                throw Error("Dimension of y " + y.length + " and row " + row.length + " are not compatible");
            }
        }
    }
    return _X;
};
/**
 * Calculates covariance
 * @param X
 * @param xMean
 * @param y
 * @param yMean
 * @returns {number}
 * @ignore
 */
var covariance = function (X, xMean, y, yMean) {
    if (_.size(X) !== _.size(y)) {
        throw new Errors_1.ValidationError('X and y should match in size');
    }
    var covar = 0.0;
    for (var i = 0; i < _.size(X); i++) {
        covar += (X[i] - xMean) * (y[i] - yMean);
    }
    return covar;
};
/**
 * Calculates the variance
 * needed for linear regression
 * @param X
 * @param mean
 * @returns {number}
 * @ignore
 */
var variance = function (X, mean) {
    if (!Array.isArray(X)) {
        throw new Errors_1.ValidationError('X must be an array');
    }
    var result = 0.0;
    for (var i = 0; i < _.size(X); i++) {
        result += Math.pow(X[i] - mean, 2);
    }
    return result;
};
/**
 * Stack arrays in sequence horizontally (column wise).
 * This is equivalent to concatenation along the second axis, except for 1-D
 * arrays where it concatenates along the first axis. Rebuilds arrays divided by hsplit.
 *
 * @example
 * hstack([[1], [1]], [[ 0, 1, 2 ], [ 1, 0, 3 ]])
 * returns [ [ 1, 0, 1, 2 ], [ 1, 1, 0, 3 ] ]
 * @param X
 * @param y
 * @ignore
 */
var hstack = function (X, y) {
    var stack = [];
    if (isMatrix(X) && isMatrix(y)) {
        for (var i = 0; i < X.length; i++) {
            var xEntity = X[i];
            var yEntity = y[i];
            stack.push(hstack(xEntity, yEntity));
        }
    }
    else if (Array.isArray(X) && Array.isArray(y)) {
        stack = _.concat(X, y);
        stack = _.flatten(stack);
    }
    else {
        throw new Errors_1.ValidationError('Input should be either matrix or Arrays');
    }
    return stack;
};
/**
 * Validating the left input is an array, and the right input is a pure number.
 * @param a
 * @param b
 * @ignore
 */
var isArrayNumPair = function (a, b) { return Array.isArray(a) && _.isNumber(b); };
/**
 * Inner product of two arrays.
 * Ordinary inner product of vectors for 1-D arrays (without complex conjugation),
 * in higher dimensions a sum product over the last axes.
 * @param a
 * @param b
 * @ignore
 */
var inner = function (a, b) {
    /**
     * Internal methods to process the inner product
     * @param a - First vector
     * @param b - Second vector or a number
     */
    // 1. If a and b are both pure numbers
    if (_.isNumber(a) && _.isNumber(b)) {
        return a * b;
    }
    // If a is a vector and b is a pure number
    if (isArrayNumPair(a, b)) {
        return a.map(function (x) { return x * b; });
    }
    // If b is a vector and a is a pure number
    if (isArrayNumPair(b, a)) {
        return b.map(function (x) { return x * a; });
    }
    // If a and b are both vectors with an identical size
    if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
        var result = 0;
        for (var i = 0; i < a.length; i++) {
            result += a[i] * b[i];
        }
        return result;
    }
    else if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) {
        throw new Errors_1.ValidationInconsistentShape("Dimensions (" + a.length + ",) and (" + b.length + ",) are not aligned");
    }
    throw new Errors_1.ValidationError("Cannot process with the invalid inputs " + a + " and " + b);
};
/**
 * Generates a random set of indices of a set of a given size.
 * @param setSize - Size of set we are generating subset for
 * @param maxSamples - Controls the size of the subset.
 *  Is used in conjunction with @param maxSamplesIsFloat
 *  If @param maxSamplesIsFloat is true, the size of the subset is equal to
 *  floor(maxSamples*setSize).
 *  If @param maxSamplesIsFloat is false, the size of the subset is equal to
 *  floor(maxSamples).
 * @param bootstrap - Whether samples are drawn with replacement
 * @returns Returns an array of numbers in [0, setSize) range
 *   with size calculated according to an algorithm described above
 * @ignore
 */
var generateRandomSubset = function (setSize, maxSamples, bootstrap, maxSamplesIsFloat) {
    if (maxSamplesIsFloat === void 0) { maxSamplesIsFloat = true; }
    if (maxSamples < 0) {
        throw new Errors_1.ValidationError("maxSamples can't be negative");
    }
    if (!maxSamplesIsFloat && maxSamples > setSize) {
        throw new Errors_1.ValidationError('maxSamples must be in [0, n_samples]');
    }
    if (maxSamplesIsFloat && maxSamples > 1) {
        throw new Errors_1.ValidationError('maxSamplesIsFloat is true but number bigger than 1 was passed');
    }
    var sampleSize = maxSamplesIsFloat ? Math.floor(setSize * maxSamples) : Math.floor(maxSamples);
    var indices = [];
    if (bootstrap) {
        for (var i = 0; i < sampleSize; ++i) {
            indices.push(genRandomIndex(setSize));
        }
    }
    else {
        // O(n) algorithm for non-bootstrap sampling as described in this paper
        // https://sci-hub.se/10.1080/00207168208803304
        var nums = range(0, setSize);
        for (var i = 0; i < sampleSize; ++i) {
            var index = genRandomIndex(setSize - i);
            indices.push(nums[index]);
            var tmp = nums[index];
            nums[index] = nums[setSize - i - 1];
            nums[setSize - i - 1] = tmp;
        }
    }
    return indices;
};
/**
 * Generates a random subset of a given matrix.
 * @param X - source matrix
 * @param maxSamples - The number of samples to draw from X to train each base estimator.
 *  Is used in conjunction with @param maxSamplesIsFloating.
 *  If @param maxSamplesIsFloating is false, then draw maxSamples samples.
 *  If @param maxSamplesIsFloating is true, then draw max_samples * shape(X)[0] samples.
 * @param maxFeatures - The number of features to draw from X to train each base estimator.
 *  Is used in conjunction with @param maxFeaturesIsFloating
 *  If @param maxFeaturesIsFloating is false, then draw max_features features.
 *  If @param maxFeaturesIsFloating is true, then draw max_features * shape(X)[1] features.
 * @param bootstrapSamples - Whether samples are drawn with replacement. If false, sampling without replacement is performed.
 * @param bootstrapFeatures - Whether features are drawn with replacement.
 * @ignore
 */
var generateRandomSubsetOfMatrix = function (X, maxSamples, maxFeatures, bootstrapSamples, bootstrapFeatures, maxSamplesIsFloating, maxFeaturesIsFloating) {
    if (maxSamples === void 0) { maxSamples = 1.0; }
    if (maxFeatures === void 0) { maxFeatures = 1.0; }
    if (maxSamplesIsFloating === void 0) { maxSamplesIsFloating = true; }
    if (maxFeaturesIsFloating === void 0) { maxFeaturesIsFloating = true; }
    var _a = __read(tensors_1.inferShape(X), 2), numRows = _a[0], numColumns = _a[1];
    var rowIndices = generateRandomSubset(numRows, maxSamples, bootstrapSamples, maxSamplesIsFloating);
    var columnIndices = generateRandomSubset(numColumns, maxFeatures, bootstrapFeatures, maxFeaturesIsFloating);
    var result = [];
    rowIndices.forEach(function (i) {
        var curRow = [];
        columnIndices.forEach(function (j) {
            curRow.push(X[i][j]);
        });
        result.push(curRow);
    });
    return [result, rowIndices, columnIndices];
};
/**
 * Generates a random integer in [0, upperBound) range.
 * @ignore
 */
var genRandomIndex = function (upperBound) { return Math.floor(Math.random() * upperBound); };
var math = {
    covariance: covariance,
    euclideanDistance: euclideanDistance,
    genRandomIndex: genRandomIndex,
    generateRandomSubset: generateRandomSubset,
    generateRandomSubsetOfMatrix: generateRandomSubsetOfMatrix,
    hstack: hstack,
    isArrayOf: isArrayOf,
    inner: inner,
    isMatrix: isMatrix,
    isMatrixOf: isMatrixOf,
    manhattanDistance: manhattanDistance,
    range: range,
    subset: subset,
    size: size,
    subtract: subtract,
    variance: variance,
};
exports.default = math;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF0aEV4dHJhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi91dGlscy9NYXRoRXh0cmEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdDQUE0QjtBQUU1QixtQ0FBd0U7QUFDeEUscUNBQXVDO0FBRXZDOzs7OztHQUtHO0FBQ0gsSUFBTSxJQUFJLEdBQUcsVUFBQyxDQUFDLEVBQUUsSUFBUTtJQUFSLHFCQUFBLEVBQUEsUUFBUTtJQUN2QixJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtRQUNkLE1BQU0sSUFBSSx3QkFBZSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7S0FDN0Q7SUFDRCxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDZCxPQUFPLElBQUksQ0FBQztLQUNiO1NBQU0sSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQ3JCLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQWYsQ0FBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdkQ7SUFDRCxNQUFNLElBQUksd0JBQWUsQ0FBQyx3QkFBc0IsSUFBSSxlQUFZLENBQUMsQ0FBQztBQUNwRSxDQUFDLENBQUM7QUFFRjs7Ozs7Ozs7O0dBU0c7QUFDSCxJQUFNLE1BQU0sR0FBRyxVQUFDLENBQUMsRUFBRSxTQUFtQixFQUFFLFNBQW1CLEVBQUUsV0FBa0I7SUFBbEIsNEJBQUEsRUFBQSxrQkFBa0I7SUFDN0Usd0VBQXdFO0lBQ3hFLElBQUksV0FBVyxFQUFFO1FBQ2YsSUFBTSxJQUFFLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztn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