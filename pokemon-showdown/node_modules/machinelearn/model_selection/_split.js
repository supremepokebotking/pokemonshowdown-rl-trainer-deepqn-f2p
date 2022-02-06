"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var Random = __importStar(require("random-js"));
var Errors_1 = require("../utils/Errors");
var tensors_1 = require("../utils/tensors");
var validation_1 = require("../utils/validation");
/**
 * K-Folds cross-validator
 *
 * Provides train/test indices to split data in train/test sets. Split dataset into k consecutive folds (without shuffling by default).
 *
 * Each fold is then used once as a validation while the k - 1 remaining folds form the training set.
 *
 * @example
 * import { KFold } from 'machinelearn/model_selection';
 *
 * const kFold = new KFold({ k: 5 });
 * const X1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
 * console.log(kFold.split(X1, X1));
 *
 * /* [ { trainIndex: [ 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ],
 * *  testIndex: [ 0, 1, 2, 3 ] },
 * * { trainIndex: [ 0, 1, 2, 3, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ],
 * *  testIndex: [ 4, 5, 6, 7 ] },
 * * { trainIndex: [ 0, 1, 2, 3, 4, 5, 6, 7, 12, 13, 14, 15, 16, 17, 18, 19 ],
 * *  testIndex: [ 8, 9, 10, 11 ] },
 * * { trainIndex: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 16, 17, 18, 19 ],
 * *  testIndex: [ 12, 13, 14, 15 ] },
 * * { trainIndex: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
 * *  testIndex: [ 16, 17, 18, 19 ] } ]
 *
 */
var KFold = /** @class */ (function () {
    /**
     *
     * @param {any} k - Number of folds. Must be at least 2.
     * @param {any} shuffle - Whether to shuffle the data before splitting into batches.
     */
    function KFold(_a) {
        var _b = _a.k, k = _b === void 0 ? 2 : _b, _c = _a.shuffle, shuffle = _c === void 0 ? false : _c;
        if (k < 2) {
            throw new Errors_1.ValidationError('Number of folds cannot be less than 2');
        }
        this.k = k;
        this.shuffle = shuffle;
    }
    /**
     *
     * @param X - Training data, where n_samples is the number of samples and n_features is the number of features.
     * @param y - The target variable for supervised learning problems.
     * @returns {any[]}
     */
    KFold.prototype.split = function (X, y) {
        var _this = this;
        if (X === void 0) { X = null; }
        if (y === void 0) { y = null; }
        var xShape = tensors_1.inferShape(X);
        var yShape = tensors_1.inferShape(y);
        if (xShape.length > 0 && yShape.length > 0 && xShape[0] !== yShape[0]) {
            throw new Errors_1.ValidationError('X and y must have an identical size');
        }
        if (this.k > X.length || this.k > y.length) {
            throw new Errors_1.ValidationError("Cannot have number of splits k=" + this.k + " greater than the number of samples: " + _.size(X));
        }
        var binSize = _.floor(_.size(X) / this.k);
        var xRange = _.range(0, _.size(X));
        var splitRange = _.range(0, this.k);
        return _.reduce(splitRange, function (sum, index) {
            // Calculate binSizeRange according to k value. e.g. 0 -> [0,1]. 1 -> [2, 3].
            var binSizeRange = _.range(index * binSize, index * binSize + binSize);
            // X index range used for test set. It can either be shuffled e.g. [ 2, 0, 1 ] or raw value [ 0, 1, 2 ]
            var testXRange = _.flowRight(function (x) { return (_this.shuffle ? _.shuffle(x) : x); }, function () { return _.clone(xRange); })();
            // Getting testIndex according to binSizeRange from testXRange
            var testIndex = _.reduce(binSizeRange, function (xIndeces, i) {
                return _.concat(xIndeces, [testXRange[i]]);
            }, []);
            var trainIndex = _.pullAll(_.clone(xRange), testIndex);
            return _.concat(sum, [{ trainIndex: trainIndex, testIndex: testIndex }]);
        }, []);
    };
    return KFold;
}());
exports.KFold = KFold;
/**
 * Split arrays or matrices into random train and test subsets
 *
 * @example
 * import { train_test_split } from 'machinelearn/model_selection';
 *
 * const X = [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]];
 * const y = [0, 1, 2, 3, 4];
 *
 * train_test_split(X, y, {
 *   test_size: 0.33,
 *   train_size: 0.67,
 *   random_state: 42
 * });
 *
 * /*
 * * { xTest: [ [ 0, 1 ], [ 8, 9 ] ],
 * *  xTrain: [ [ 4, 5 ], [ 6, 7 ], [ 2, 3 ] ],
 * *  yTest: [ 0, 4 ],
 * *  yTrain: [ 2, 3, 1 ] }
 *
 * @param {any} X - input data
 * @param {any} y - target data
 * @param {number} test_size - size of the returning test set
 * @param {number} train_size - size of the returning training set
 * @param {number} random_state - state used to shuffle data
 * @param {boolean} clone - to clone the original data
 * @returns {{xTest: any[]; xTrain: any[]; yTest: any[]; yTrain: any[]}}
 */
function train_test_split(X, y, _a) {
    if (X === void 0) { X = null; }
    if (y === void 0) { y = null; }
    var _b = _a === void 0 ? {
        // Default if nothing is given
        test_size: 0.25,
        train_size: 0.75,
        random_state: 0,
        clone: true,
    } : _a, 
    // Arguments and their default values
    _c = _b.test_size, 
    // Arguments and their default values
    test_size = _c === void 0 ? 0.25 : _c, _d = _b.train_size, train_size = _d === void 0 ? 0.75 : _d, _e = _b.random_state, random_state = _e === void 0 ? 0 : _e, _f = _b.clone, clone = _f === void 0 ? true : _f;
    var _X = clone ? _.cloneDeep(X) : X;
    var _y = clone ? _.cloneDeep(y) : y;
    // Checking if either of these params is not array
    if (!_.isArray(_X) || !_.isArray(_y) || _X.length === 0 || _y.length === 0) {
        throw new Errors_1.ValidationError('X and y must be array and cannot be empty');
    }
    validation_1.validateFitInputs(_X, _y);
    // Training dataset size accoding to X
    var trainSizeLength = _.round(train_size * _X.length);
    var testSizeLength = _.round(test_size * _X.length);
    if (_.round(test_size + train_size) !== 1) {
        throw new Errors_1.ValidationError('Sum of test_size and train_size does not equal 1');
    }
    // Initiate Random engine
    var randomEngine = Random.engines.mt19937();
    randomEngine.seed(random_state);
    // split
    var xTrain = [];
    var yTrain = [];
    var xTest = [];
    var yTest = [];
    // Getting X_train and y_train
    while (xTrain.length < trainSizeLength && yTrain.length < trainSizeLength) {
        var index = Random.integer(0, X.length - 1)(randomEngine);
        // X_train
        xTrain.push(_X[index]);
        _X.splice(index, 1);
        // y_train
        yTrain.push(_y[index]);
        _y.splice(index, 1);
    }
    while (xTest.length < testSizeLength) {
        var index = Random.integer(0, _X.length - 1)(randomEngine);
        // X test
        xTest.push(_X[index]);
        _X.splice(index, 1);
        // y train
        yTest.push(_y[index]);
        _y.splice(index, 1);
    }
    // Filter return results
    var clean = function (items) { return _.filter(items, function (item) { return !_.isUndefined(item); }); };
    return {
        xTest: clean(xTest),
        xTrain: clean(xTrain),
        yTest: clean(yTest),
        yTrain: clean(yTrain),
    };
}
exports.train_test_split = train_test_split;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NwbGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9tb2RlbF9zZWxlY3Rpb24vX3NwbGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHdDQUE0QjtBQUM1QixnREFBb0M7QUFFcEMsMENBQWtEO0FBQ2xELDRDQUE4QztBQUM5QyxrREFBd0Q7QUFFeEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5Qkc7QUFDSDtJQUlFOzs7O09BSUc7SUFDSCxlQUFZLEVBQTBCO1lBQXhCLFNBQUssRUFBTCwwQkFBSyxFQUFFLGVBQWUsRUFBZixvQ0FBZTtRQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDVCxNQUFNLElBQUksd0JBQWUsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1NBQ3BFO1FBQ0QsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxxQkFBSyxHQUFaLFVBQWEsQ0FBMkIsRUFBRSxDQUEyQjtRQUFyRSxpQkFvQ0M7UUFwQ1ksa0JBQUEsRUFBQSxRQUEyQjtRQUFFLGtCQUFBLEVBQUEsUUFBMkI7UUFDbkUsSUFBTSxNQUFNLEdBQUcsb0JBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFNLE1BQU0sR0FBRyxvQkFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyRSxNQUFNLElBQUksd0JBQWUsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1NBQ2xFO1FBRUQsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUks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