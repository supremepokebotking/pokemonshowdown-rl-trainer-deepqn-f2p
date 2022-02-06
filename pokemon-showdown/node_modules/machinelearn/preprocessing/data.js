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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tf = __importStar(require("@tensorflow/tfjs"));
var _ = __importStar(require("lodash"));
var Errors_1 = require("../utils/Errors");
var MathExtra_1 = __importDefault(require("../utils/MathExtra"));
var permutations_1 = require("../utils/permutations");
var tensors_1 = require("../utils/tensors");
var validation_1 = require("../utils/validation");
/**
 * Augment dataset with an additional dummy feature.
 * This is useful for fitting an intercept term with implementations which cannot otherwise fit it directly.
 *
 * @example
 * import { add_dummy_feature } from 'machinelearn/preprocessing';
 * const dummy = add_dummy_feature([[0, 1, 2], [1, 0, 3]]);
 * console.log(dummy); // returns: [ [ 1, 0, 1, 2 ], [ 1, 1, 0, 3 ] ]
 *
 * @param X - A matrix of data
 * @param value - Value to use for the dummy feature.
 */
function add_dummy_feature(X, value) {
    if (X === void 0) { X = null; }
    if (value === void 0) { value = 1.0; }
    if (Array.isArray(X) && X.length === 0) {
        throw new TypeError('X cannot be empty');
    }
    validation_1.validateMatrix2D(X);
    var tensorX = tf.tensor2d(X);
    var _a = __read(tensorX.shape, 1), nSamples = _a[0];
    var ones = tf.ones([nSamples, 1]);
    var sValue = tf.scalar(value);
    var multipledOnes = tf.mul(ones, sValue);
    var hStacked = tf.concat([multipledOnes, tensorX], 1);
    return tensors_1.reshape(Array.from(hStacked.dataSync()), hStacked.shape);
}
exports.add_dummy_feature = add_dummy_feature;
/**
 * Encode categorical integer features using a one-hot aka one-of-K scheme.
 *
 * The input to this transformer should be a matrix of integers, denoting the
 * values taken on by categorical (discrete) features. The output will be a sparse
 * matrix where each column corresponds to one possible value of one feature.
 * It is assumed that input features take on values in the range [0, n_values).
 *
 * This encoding is needed for feeding categorical data to many
 * scikit-learn estimators, notably linear models and SVMs with the standard kernels.
 *
 * Note: a one-hot encoding of y labels should use a LabelBinarizer instead.
 *
 * @example
 * const enc = new OneHotEncoder();
 * const planetList = [
 *  { planet: 'mars', isGasGiant: false, value: 10 },
 *  { planet: 'saturn', isGasGiant: true, value: 20 },
 *  { planet: 'jupiter', isGasGiant: true, value: 30 }
 * ];
 * const encodeInfo = enc.encode(planetList, {
 *  dataKeys: ['value', 'isGasGiant'],
 *  labelKeys: ['planet']
 * });
 * // encodeInfo.data -> [ [ -1, 0, 1, 0, 0 ], [ 0, 1, 0, 1, 0 ], [ 1, 1, 0, 0, 1 ] ]
 * const decodedInfo = enc.decode(encodeInfo.data, encodeInfo.decoders);
 * // gives you back the original value, which is `planetList`
 */
var OneHotEncoder = /** @class */ (function () {
    function OneHotEncoder() {
        /**
         * Calculating the sample standard deviation (vs population stddev).
         * @param lst
         * @param {number} mean
         * @returns {number}
         */
        this.calculateStd = function (lst, mean) {
            var deviations = _.map(lst, function (n) { return Math.pow(n - mean, 2); });
            return Math.pow(_.sum(deviations) / (lst.length - 1), 0.5);
        };
    }
    /**
     * encode data according to dataKeys and labelKeys
     *
     * @param data - list of records to encode
     * @param options
     */
    OneHotEncoder.prototype.encode = function (data, _a) {
        var _this = this;
        if (data === void 0) { data = null; }
        var _b = _a === void 0 ? {
            dataKeys: null,
            labelKeys: null,
        } : _a, 
        /**
         * Independent variables
         */
        _c = _b.dataKeys, 
        /**
         * Independent variables
         */
        dataKeys = _c === void 0 ? null : _c, 
        /**
         * Depdenent variables
         */
        _d = _b.labelKeys, 
        /**
         * Depdenent variables
         */
        labelKeys = _d === void 0 ? null : _d;
        var decoders = [];
        // shortcut to allow caller to default to "all non-label keys are data keys"
        var _dataKeys = dataKeys ? dataKeys : _.keys(data[0]);
        // validations
        if (_.size(data) < 1) {
            throw Errors_1.ValidationError('data cannot be empty!');
        }
        // data keys
        _.forEach(_dataKeys, function (dataKey) {
            // TODO: it's only checking data[0] -> It should also check all the others
            if (!_.has(data[0], dataKey)) {
                // TODO: Find the correct error to throw
                throw new Errors_1.ValidationKeyNotFoundError("Cannot find " + dataKey + " from data");
            }
        });
        // label keys
        _.forEach(labelKeys, function (labelKey) {
            // TODO: it's only checking data[0] -> It should also check all the others
            if (!_.has(data[0], labelKey)) {
                // TODO Find the correct error to throw
                throw new Errors_1.ValidationKeyNotFoundError("Cannot find " + labelKey + " from labels");
            }
        });
        // maybe a little too clever but also the simplest;
        // serialize every value for a given data key, then zip the results back up into a (possibly nested) array
        var transform = function (keys) {
            return _.zip.apply(_, __spread(_.map(keys, function (key) {
                var standardized = _this.standardizeField(key, data);
                var encoded = _.get(standardized, 'encoded');
                var decode = _.get(standardized, 'decode');
                if (encoded && decode) {
                    // TODO: We need to prefer immutable datastructure
                    decoders.push(decode);
                    return encoded;
                }
                // Otherwise just return values itself
                return standardized;
            })));
        };
        var features = transform(_dataKeys);
        var labels = transform(labelKeys);
        return {
            // zip the label data back into the feature data (to ensure label data is at the end)
            data: _.map(_.zip(features, labels), _.flattenDeep),
            decoders: decoders,
        };
    };
    /**
     * Decode the encoded data back into its original format
     */
    OneHotEncoder.prototype.decode = function (encoded, decoders) {
        var _this = this;
        return _.map(encoded, function (row) { return _this.decodeRow(row, decoders); });
    };
    /**
     * Decode an encoded row back into its original format
     * @param row
     * @param decoders
     * @returns {Object}
     */
    OneHotEncoder.prototype.decodeRow = function (row, decoders) {
        var i = 0;
        var numFieldsDecoded = 0;
        var record = {};
        var getStrVal = function (X, ix, decoder) {
            var data = X.slice(ix, ix + decoder.offset);
            return decoder.lookupTable[_.indexOf(data, 1)];
        };
        var getBoolVal = function (X, ix) { return !!X[ix]; };
        var getNumbVal = function (X, ix, decoder) {
            return decoder.std * X[ix] + decoder.mean;
        };
        while (i < row.length) {
            var decoder = decoders[numFieldsDecoded++];
            if (decoder.type === 'string') {
                record[decoder.key] = getStrVal(row, i, decoder);
            }
            else if (decoder.type === 'number') {
                record[decoder.key] = getNumbVal(row, i, decoder);
            }
            else if (decoder.type === 'boolean') {
                record[decoder.key] = getBoolVal(row, i);
            }
            else {
                record[decoder.key] = row[i];
            }
            // record[decoder.key] = getValue(row, i, decoder);
            i += decoder.offset ? decoder.offset : 1;
        }
        return record;
    };
    /**
     * Standardizing field
     * Example dataset:
     * [ { planet: 'mars', isGasGiant: false, value: 10 },
     * { planet: 'saturn', isGasGiant: true, value: 20 },
     * { planet: 'jupiter', isGasGiant: true, value: 30 } ]
     *
     * @param key: each key/feature such as planet, isGasGiant and value
     * @param data: the entire dataset
     * @returns {any}
     */
    OneHotEncoder.prototype.standardizeField = function (key, data) {
        var type = typeof data[0][key];
        var values = _.map(data, key);
        switch (type) {
            case 'string': {
                var result = this.buildStringOneHot(type, key, values);
                return {
                    decode: result.decode,
                    encoded: result.encoded,
                };
            }
            case 'number': {
                // Apply std to values if type is number
                // standardize: ((n - mean)/std)
                // TODO: add support for scaling to [0, 1]
                var result = this.buildNumberOneHot(type, key, values);
                return {
                    decode: result.decode,
                    encoded: result.encoded,
                };
            }
            case 'boolean': {
                // True == 1
                // False == 0
                var result = this.buildBooleanOneHot(type, key, values);
                return {
                    decode: result.decode,
                    encoded: result.encoded,
                };
            }
            default:
                return values;
        }
    };
    /**
     * One hot encode a number value
     *
     * @param type
     * @param key
     * @param values
     * @returns {{encoded: any[]; decode: {type: any; mean: number; std: number; key: any}}}
     */
    OneHotEncoder.prototype.buildNumberOneHot = function (type, key, values) {
        var mean = _.mean(values);
        var std = this.calculateStd(values, mean);
        return {
            decode: { type: type, mean: mean, std: std, key: key },
            encoded: _.map(values, function (value) { return (value - mean) / std; }),
        };
    };
    /**
     * One hot encode a boolean value
     *
     * Example usage:
     * boolEncoder.encode(true) => 1
     * boolEncoder.encode(false) => 0
     *
     * @param type
     * @param key
     * @param values
     * @returns {{encode}}
     */
    OneHotEncoder.prototype.buildBooleanOneHot = function (type, key, values) {
        return {
            decode: { type: type, key: key },
            encoded: _.map(values, function (value) { return (value ? 1 : 0); }),
        };
    };
    /**
     * One hot encode a string value
     *
     * Example for internal reference (unnecessary details for those just using this module)
     *
     * const encoder = buildOneHot(['RAIN', 'RAIN', 'SUN'])
     * // encoder == { encode: () => ... , lookupTable: ['RAIN', 'SUN'] }
     * encoder.encode('SUN')  // [0, 1]
     * encoder.encode('RAIN') // [1, 0]
     * encoder.encode('SUN')  // [1, 0]
     * // encoder.lookupTable can then be passed into this.decode to translate [0, 1] back into 'SUN'
     *
     * It's not ideal (ideally it would all just be done in-memory and we could return a "decode" closure,
     * but it needs to be serializable to plain old JSON.
     */
    OneHotEncoder.prototype.buildStringOneHot = function (type, key, values) {
        var lookup = {};
        var i = 0;
        var lookupTable = _.map(_.uniq(values), function (value) {
            _.set(lookup, value, i++);
            return value;
        });
        var encoded = _.map(values, function (value) {
            return _.range(0, i).map(function (pos) { return (_.get(lookup, value) === pos ? 1 : 0); });
        });
        return {
            decode: {
                key: key,
                lookupTable: lookupTable,
                offset: encoded[0].length,
                type: type,
            },
            encoded: encoded,
        };
    };
    return OneHotEncoder;
}());
exports.OneHotEncoder = OneHotEncoder;
/**
 * Transforms features by scaling each feature to a given range.
 *
 * This estimator scales and translates each feature individually such that it is in the given range on the training set, i.e. between zero and one.
 *
 * The transformation is given by:
 *
 * ```
 * X_std = (X - X.min(axis=0)) / (X.max(axis=0) - X.min(axis=0))
 * X_scaled = X_std * (max - min) + min
 * ```
 *
 * where min, max = feature_range.
 *
 * This transformation is often used as an alternative to zero mean, unit variance scaling.
 *
 * @example
 * import { MinMaxScaler } from 'machinelearn/preprocessing';
 *
 * const minmaxScaler = new MinMaxScaler({ featureRange: [0, 1] });
 *
 * // Fitting an 1D matrix
 * minmaxScaler.fit([4, 5, 6]);
 * const result = minmaxScaler.transform([4, 5, 6]);
 * // result = [ 0, 0.5, 1 ]
 *
 * // Fitting a 2D matrix
 * const minmaxScaler2 = new MinMaxScaler({ featureRange: [0, 1] });
 * minmaxScaler2.fit([[1, 2, 3], [4, 5, 6]]);
 * const result2 = minmaxScaler2.transform([[1, 2, 3]]);
 * // result2 = [ [ 0, 0.2, 0.4000000000000001 ] ]
 *
 */
var MinMaxScaler = /** @class */ (function () {
    /**
     * @param featureRange - scaling range
     */
    function MinMaxScaler(_a) {
        var _b = (_a === void 0 ? {
            featureRange: [0, 1],
        } : _a).featureRange, featureRange = _b === void 0 ? [0, 1] : _b;
        this.featureRange = featureRange;
    }
    /**
     * Compute the minimum and maximum to be used for later scaling.
     * @param {number[]} X - Array or sparse-matrix data input
     */
    MinMaxScaler.prototype.fit = function (X) {
        if (X === void 0) { X = null; }
        if (!Array.isArray(X)) {
            throw new Errors_1.ValidationError('MinMaxScaler received a non-array input for X');
        }
        var rowMax = tf.tensor(X);
        var rowMin = tf.tensor(X);
        var xShape = tensors_1.inferShape(X);
        // If input is a Matrix...
        if (xShape.length === 0 || xShape[0] === 0) {
            throw new Errors_1.ValidationError('Cannot fit with an empty value');
        }
        else if (xShape.length === 2) {
            rowMax = tf.max(rowMax, 0);
            rowMin = tf.min(rowMin, 0);
        }
        this.dataMax = tf.max(rowMax).dataSync()[0];
        this.dataMin = tf.min(rowMin).dataSync()[0];
        this.featureMax = this.featureRange[1];
        this.featureMin = this.featureRange[0];
        this.dataRange = this.dataMax - this.dataMin;
        // We need different data range for multi-dimensional
        this.scale = (this.featureMax - this.featureMin) / this.dataRange;
        this.baseMin = this.featureMin - this.dataMin * this.scale;
    };
    /**
     * Fit to data, then transform it.
     * @param X - Original input vector
     */
    MinMaxScaler.prototype.fit_transform = function (X) {
        this.fit(X);
        return this.transform(X);
    };
    /**
     * Scaling features of X according to feature_range.
     * @param X - Original input vector
     */
    MinMaxScaler.prototype.transform = function (X) {
        var _this = this;
        if (X === void 0) { X = null; }
        // Transforms a single vector
        var transform_single = function (_X) {
            var X1 = _X.map(function (x) { return x * _this.scale; });
            return X1.map(function (x) { return x + _this.baseMin; });
        };
        var shapes = tensors_1.inferShape(X);
        if (shapes.length === 2) {
            return X.map(function (z) { return transform_single(z); });
        }
        else if (shapes.length === 1) {
            return transform_single(X);
        }
        else {
            throw new TypeError("The input shape " + JSON.stringify(shapes) + " cannot be transformed");
        }
    };
    /**
     * Undo the scaling of X according to feature_range.
     * @param {number[]} X - Scaled input vector
     */
    MinMaxScaler.prototype.inverse_transform = function (X) {
        var _this = this;
        if (X === void 0) { X = null; }
        validation_1.validateMatrix1D(X);
        var X1 = X.map(function (x) { return x - _this.baseMin; });
        return X1.map(function (x) { return x / _this.scale; });
    };
    return MinMaxScaler;
}());
exports.MinMaxScaler = MinMaxScaler;
/**
 * Binarizer transform your data using a binary threshold.
 * All values above the threshold are marked 1 and all equal to or below are marked as 0.
 *
 * It can also be used as a pre-processing step for estimators that consider
 * boolean random variables (e.g. modelled using the Bernoulli distribution in
 * a Bayesian setting).
 *
 * @example
 * import { Binarizer } from 'machinelearn/preprocessing';
 *
 * const binX = [[1, -1, 2], [2, 0, 0], [0, 1, -1]];
 * const binarizer = new Binarizer({ threshold: 0 });
 * const result = binarizer.transform(binX);
 * // [ [ 1, 0, 1 ], [ 1, 0, 0 ], [ 0, 1, 0 ] ]
 */
var Binarizer = /** @class */ (function () {
    /**
     *
     * @param {number} threshold - Feature values below or equal to this are replaced by 0, above it by 1.
     * @param {boolean} copy - Flag to clone the input value.
     */
    function Binarizer(_a) {
        var _b = _a === void 0 ? {
            // Default value on empty constructor
            copy: true,
            threshold: 0,
        } : _a, 
        // Each object param default value
        _c = _b.copy, 
        // Each object param default value
        copy = _c === void 0 ? true : _c, _d = _b.threshold, threshold = _d === void 0 ? 0 : _d;
        this.threshold = threshold;
        this.copy = copy;
    }
    /**
     * Currently fit does nothing
     * @param {any[]} X - Does nothing
     */
    Binarizer.prototype.fit = function (X) {
        if (X === void 0) { X = null; }
        if (Array.isArray(X) && X.length === 0) {
            throw new Errors_1.ValidationError('X should be an array and cannot be empty');
        }
        validation_1.validateMatrix2D(X);
        console.info("Currently Bianrizer's fit is designed to do nothing");
    };
    /**
     * Transforms matrix into binarized form
     * X = [[ 1., -1.,  2.],
     *      [ 2.,  0.,  0.],
     *      [ 0.,  1., -1.]]
     * becomes
     * array([[ 1.,  0.,  1.],
     *    [ 1.,  0.,  0.],
     *    [ 0.,  1.,  0.]])
     * @param {any[]} X - The data to binarize.
     */
    Binarizer.prototype.transform = function (X) {
        if (X === void 0) { X = null; }
        var _X = this.copy ? _.clone(X) : X;
        if (Array.isArray(_X) && _X.length === 0) {
            throw new Errors_1.ValidationError('X should be an array and cannot be empty');
        }
        validation_1.validateMatrix2D(_X);
        for (var row = 0; row < _.size(X); row++) {
            var rowValue = _.get(X, "[" + row + "]");
            for (var column = 0; column < _.size(rowValue); column++) {
                var item = _.get(X, "[" + row + "][" + column + "]");
                // Type checking item; It must be a number type
                if (!_.isNumber(item)) {
                    throw new Error("Value " + item + " is not a number");
                }
                // If current item is less than
                _X[row][column] = item <= this.threshold ? 0 : 1;
            }
        }
        return _X;
    };
    return Binarizer;
}());
exports.Binarizer = Binarizer;
/**
 * Generate polynomial and interaction features.
 *
 * Generate a new feature matrix consisting of all polynomial combinations of the features
 * with degree less than or equal to the specified degree. For example, if an input sample
 * is two dimensional and of the form [a, b], the degree-2 polynomial features are [1, a, b, a^2, ab, b^2].
 *
 * @example
 * import { PolynomialFeatures } from 'machinelearn/preprocessing';
 * const poly = new PolynomialFeatures();
 * const X = [[0, 1], [2, 3], [4, 5]];
 * poly.transform(X);
 * // Result:
 * // [ [ 1, 0, 1, 0, 0, 1 ],
 * // [ 1, 2, 3, 4, 6, 9 ],
 * // [ 1, 4, 5, 16, 20, 25 ] ]
 *
 */
var PolynomialFeatures = /** @class */ (function () {
    /**
     *
     * @param degree - The degree of the polynomial features. Default = 2.
     */
    function PolynomialFeatures(_a) {
        var _b = (_a === void 0 ? {
            degree: 2,
        } : _a).degree, degree = _b === void 0 ? 2 : _b;
        // Constructor variables validation
        if (!Number.isInteger(degree)) {
            throw new Errors_1.ConstructionError('Degree must be a number');
        }
        this.degree = degree;
    }
    /**
     * Transforms the input data
     * @param X - a matrix
     */
    PolynomialFeatures.prototype.transform = function (X) {
        if (X === void 0) { X = null; }
        if (Array.isArray(X) && X.length === 0) {
            throw new Errors_1.ValidationError('X cannot be empty');
        }
        validation_1.validateMatrix2D(X);
        var matrix = tf.tensor2d(X);
        var _a = __read(matrix.shape, 2), nSamples = _a[0], nFeatures = _a[1];
        var indexCombination = this.indexCombination(nFeatures, this.degree);
        var nOutputFeatures = indexCombination.length;
        // Polynomial feature extraction loop begins
        var tfOnes = tf.ones([nSamples, nOutputFeatures]);
        var result = tensors_1.reshape(Array.from(tfOnes.dataSync()), tfOnes.shape);
        var rowRange = _.range(0, X.length);
        for (var i = 0; i < indexCombination.length; i++) {
            var c = indexCombination[i];
            var colsRange = Array.isArray(c) ? c : [c];
            // Retrieves column values from X using the index of the indexCombination in the loop
            var srcColValues = c !== null ? MathExtra_1.default.subset(X, rowRange, colsRange) : [];
            var xc = null;
            if (srcColValues.length === 0) {
                xc = _.fill(rowRange.slice(), 1);
            }
            else {
                xc = tf
                    .tensor2d(srcColValues)
                    .prod(1)
                    .dataSync();
            }
            result = MathExtra_1.default.subset(result, rowRange, [i], xc);
        }
        return result;
    };
    /**
     * Creates a combination of index according to nFeautres and degree
     * @param nFeatures
     * @param degree
     */
    PolynomialFeatures.prototype.indexCombination = function (nFeatures, degree) {
        var range = _.range(0, degree + 1);
        var combs = range.map(function (i) {
            return permutations_1.combinationsWithReplacement(_.range(nFeatures), i);
        });
        return combs.reduce(function (sum, cur) {
            return sum.concat(cur);
        }, []);
    };
    return PolynomialFeatures;
}());
exports.PolynomialFeatures = PolynomialFeatures;
/**
 * Data normalization is a process of scaling dataset based on Vector Space Model, and by default, it uses L2 normalization.
 * At a higher level, the chief difference between the L1 and the L2 terms is that the L2 term is proportional
 * to the square of the  β values, while the L1 norm is proportional the absolute value of the values in  β .
 *
 * @example
 * import { normalize } from 'machinelearn/preprocessing';
 *
 * const result = normalize([
 *   [1, -1, 2],
 *   [2, 0, 0],
 *   [0, 1, -1],
 * ], { norm: 'l2' });
 * console.log(result);
 * // [ [ 0.4082482904638631, -0.4082482904638631, 0.8164965809277261 ],
 * // [ 1, 0, 0 ],
 * // [ 0, 0.7071067811865475, -0.7071067811865475 ] ]
 *
 * @param X - The data to normalize
 * @param norm - The norm to use to normalize each non zero sample; can be either 'l1' or 'l2'
 * @return number[][]
 */
function normalize(X, _a) {
    if (X === void 0) { X = null; }
    var _b = (_a === void 0 ? {
        norm: 'l2',
    } : _a).norm, norm = _b === void 0 ? 'l2' : _b;
    if (Array.isArray(X) && X.length === 0) {
        throw new Errors_1.ValidationError('X cannot be empty');
    }
    validation_1.validateMatrix2D(X);
    var normalizedMatrix = [];
    for (var i = 0; i < X.length; i++) {
        var row = X[i];
        // Adding a placeholder array
        normalizedMatrix.push([]);
        // Getting the row's square root
        var proportion = 0; // note: any because math.pow return MathType
        // Normalization proportion value
        if (norm === 'l1') {
            proportion = row.reduce(function (accum, r) { return accum + Math.abs(r); }, 0);
        }
        else if (norm === 'l2') {
            proportion = row.reduce(function (accum, r) { return accum + Math.pow(r, 2); }, 0);
            proportion = Math.sqrt(proportion);
        }
        else {
            throw new Errors_1.ValidationError(norm + " is not a recognised normalization method");
        }
        // Finally applying a cubic root to the total value
        for (var k = 0; k < row.length; k++) {
            var value = row[k] / proportion;
            normalizedMatrix[i].push(value);
        }
    }
    return normalizedMatrix;
}
exports.normalize = normalize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcHJlcHJvY2Vzc2luZy9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbURBQXVDO0FBQ3ZDLHdDQUE0QjtBQUU1QiwwQ0FBaUc7QUFDakcsaUVBQXNDO0FBQ3RDLHNEQUFvRTtBQUNwRSw0Q0FBdUQ7QUFDdkQsa0RBQXlFO0FBb0N6RTs7Ozs7Ozs7Ozs7R0FXRztBQUNILFNBQWdCLGlCQUFpQixDQUFDLENBQThCLEVBQUUsS0FBbUI7SUFBbkQsa0JBQUEsRUFBQSxRQUE4QjtJQUFFLHNCQUFBLEVBQUEsV0FBbUI7SUFDbkYsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3RDLE1BQU0sSUFBSSxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUMxQztJQUNELDZCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFjLENBQUM7SUFDdEMsSUFBQSw2QkFBMEIsRUFBekIsZ0JBQXlCLENBQUM7SUFDakMsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBYyxDQUFDO0lBQ2pELElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFjLENBQUM7SUFDN0MsSUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0MsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN4RCxPQUFPLGlCQUFP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