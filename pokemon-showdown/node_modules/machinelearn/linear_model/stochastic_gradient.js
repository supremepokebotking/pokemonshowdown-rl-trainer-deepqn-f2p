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
var Random = __importStar(require("random-js"));
var validation_1 = require("../utils/validation");
var TypeLoss;
(function (TypeLoss) {
    TypeLoss["L1"] = "L1";
    TypeLoss["L2"] = "L2";
    TypeLoss["L1L2"] = "L1L2";
})(TypeLoss = exports.TypeLoss || (exports.TypeLoss = {}));
/**
 * Ordinary base class for SGD classier or regressor
 * @ignore
 */
var BaseSGD = /** @class */ (function () {
    /**
     * @param preprocess - preprocess methodology can be either minmax or null. Default is minmax.
     * @param learning_rate - Used to limit the amount each coefficient is corrected each time it is updated.
     * @param epochs - Number of iterations.
     * @param clone - To clone the passed in dataset.
     */
    function BaseSGD(_a) {
        var _b = _a === void 0 ? {
            learning_rate: 0.0001,
            epochs: 10000,
            clone: true,
            random_state: null,
            loss: TypeLoss.L2,
            reg_factor: null,
        } : _a, _c = _b.learning_rate, learning_rate = _c === void 0 ? 0.0001 : _c, _d = _b.epochs, epochs = _d === void 0 ? 10000 : _d, _e = _b.clone, clone = _e === void 0 ? true : _e, _f = _b.random_state, random_state = _f === void 0 ? null : _f, _g = _b.loss, loss = _g === void 0 ? TypeLoss.L2 : _g, _h = _b.reg_factor, reg_factor = _h === void 0 ? null : _h;
        this.clone = true;
        this.weights = null;
        this.learningRate = learning_rate;
        this.epochs = epochs;
        this.clone = clone;
        this.randomState = random_state;
        this.loss = loss;
        this.regFactor = reg_factor;
        // Setting a loss function according to the input option
        if (this.loss === TypeLoss.L1 && this.regFactor) {
            this.loss = tf.regularizers.l1({
                l1: this.regFactor.l1,
            });
        }
        else if (this.loss === TypeLoss.L1L2 && this.regFactor) {
            this.loss = tf.regularizers.l1l2({
                l1: this.regFactor.l1,
                l2: this.regFactor.l2,
            });
        }
        else if (this.loss === TypeLoss.L2 && this.regFactor) {
            this.loss = tf.regularizers.l2({
                l2: this.regFactor.l2,
            });
        }
        else {
            this.loss = tf.regularizers.l2();
        }
        // Random Engine
        if (Number.isInteger(this.randomState)) {
            this.randomEngine = Random.engines.mt19937().seed(this.randomState);
        }
        else {
            this.randomEngine = Random.engines.mt19937().autoSeed();
        }
    }
    /**
     * Train the base SGD
     * @param X - Matrix of data
     * @param y - Matrix of targets
     */
    BaseSGD.prototype.fit = function (X, y) {
        if (X === void 0) { X = null; }
        if (y === void 0) { y = null; }
        validation_1.validateFitInputs(X, y);
        // holds all the preprocessed X values
        // Clone according to the clone flag
        var clonedX = this.clone ? lodash_1.cloneDeep(X) : X;
        var clonedY = this.clone ? lodash_1.cloneDeep(y) : y;
        this.sgd(clonedX, clonedY);
    };
    /**
     * Save the model's checkpoint
     */
    BaseSGD.prototype.toJSON = function () {
        return {
            learning_rate: this.learningRate,
            epochs: this.epochs,
            weights: __spread(this.weights.dataSync()),
            random_state: this.randomState,
        };
    };
    /**
     * Restore the model from a checkpoint
     * @param learning_rate - Training learning rate
     * @param epochs - Number of model's training epochs
     * @param weights - Model's training state
     * @param random_state - Static random state for the model initialization
     */
    BaseSGD.prototype.fromJSON = function (_a) {
        var _b = _a === void 0 ? {
            learning_rate: 0.0001,
            epochs: 10000,
            weights: [],
            random_state: null,
        } : _a, _c = _b.learning_rate, learning_rate = _c === void 0 ? 0.0001 : _c, _d = _b.epochs, epochs = _d === void 0 ? 10000 : _d, _e = _b.weights, weights = _e === void 0 ? [] : _e, _f = _b.random_state, random_state = _f === void 0 ? null : _f;
        this.learningRate = learning_rate;
        this.epochs = epochs;
        this.weights = tf.tensor(weights);
        this.randomState = random_state;
    };
    /**
     * Predictions according to the passed in test set
     * @param X - Matrix of data
     */
    BaseSGD.prototype.predict = function (X) {
        if (X === void 0) { X = null; }
        validation_1.validateMatrix2D(X);
        // Adding bias
        var biasX = this.addBias(X);
        var tensorX = tf.tensor(biasX);
        var yPred = tensorX.dot(this.weights);
        return __spread(yPred.dataSync());
    };
    /**
     * Initialize weights based on the number of features
     *
     * @example
     * initializeWeights(3);
     * // this.w = [-0.213981293, 0.12938219, 0.34875439]
     *
     * @param nFeatures
     */
    BaseSGD.prototype.initializeWeights = function (nFeatures) {
        var _this = this;
        var limit = 1 / Math.sqrt(nFeatures);
        var distribution = Random.real(-limit, limit);
        var getRand = function () { return distribution(_this.randomEngine); };
        this.weights = tf.tensor1d(lodash_1.range(0, nFeatures).map(function () { return getRand(); }));
    };
    /**
     * Adding bias to a given array
     *
     * @example
     * addBias([[1, 2], [3, 4]], 1);
     * // [[1, 1, 2], [1, 3, 4]]
     *
     * @param X
     * @param bias
     */
    BaseSGD.prototype.addBias = function (X, bias) {
        if (bias === void 0) { bias = 1; }
        // TODO: Is there a TF way to achieve it?
        return X.reduce(function (sum, cur) {
            sum.push([bias].concat(cur));
            return sum;
        }, []);
    };
    /**
     * SGD based on linear model to calculate coefficient
     * @param X - training data
     * @param y - target data
     */
    BaseSGD.prototype.sgd = function (X, y) {
        var tensorX = tf.tensor2d(this.addBias(X));
        this.initializeWeights(tensorX.shape[1]);
        var tensorY = tf.tensor1d(y);
        var tensorLR = tf.tensor(this.learningRate);
        for (var e = 0; e < this.epochs; e++) {
            var yPred = tensorX.dot(this.weights);
            var gradW = tensorY
                .sub(yPred)
                .neg()
                .dot(tensorX)
                .add(this.loss.apply(this.weights));
            this.weights = this.weights.sub(tensorLR.mul(gradW));
        }
    };
    return BaseSGD;
}());
exports.BaseSGD = BaseSGD;
/**
 * Linear classifiers (SVM, logistic regression, a.o.) with SGD training.
 *
 * This estimator implements regularized linear models with
 * stochastic gradient descent (SGD) learning: the gradient of
 * the loss is estimated each sample at a time and the model is
 * updated along the way with a decreasing strength schedule
 * (aka learning rate). SGD allows minibatch (online/out-of-core)
 * learning, see the partial_fit method. For best results using
 * the default learning rate schedule, the data should have zero mean
 * and unit variance.
 *
 * @example
 * import { SGDClassifier } from 'machinelearn/linear_model';
 * const clf = new SGDClassifier();
 * const X = [[0., 0.], [1., 1.]];
 * const y = [0, 1];
 * clf.fit(X ,y);
 * clf.predict([[2., 2.]]); // result: [ 1 ]
 *
 */
var SGDClassifier = /** @class */ (function (_super) {
    __extends(SGDClassifier, _super);
    function SGDClassifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Predicted values with Math.round applied
     * @param X - Matrix of data
     */
    SGDClassifier.prototype.predict = function (X) {
        if (X === void 0) { X = null; }
        var results = _super.prototype.predict.call(this, X);
        return results.map(function (x) { return Math.round(x); });
    };
    return SGDClassifier;
}(BaseSGD));
exports.SGDClassifier = SGDClassifier;
/**
 * Linear model fitted by minimizing a regularized empirical loss with SGD
 * SGD stands for Stochastic Gradient Descent: the gradient of the loss
 * is estimated each sample at a time and the model is updated along
 * the way with a decreasing strength schedule (aka learning rate).
 *
 * @example
 * import { SGDRegressor } from 'machinelearn/linear_model';
 * const reg = new SGDRegressor();
 * const X = [[0., 0.], [1., 1.]];
 * const y = [0, 1];
 * reg.fit(X, y);
 * reg.predict([[2., 2.]]); // result: [ 1.281828588248001 ]
 *
 */
var SGDRegressor = /** @class */ (function (_super) {
    __extends(SGDRegressor, _super);
    function SGDRegressor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Predicted values
     * @param X - Matrix of data
     */
    SGDRegressor.prototype.predict = function (X) {
        if (X === void 0) { X = null; }
        return _super.prototype.predict.call(this, X);
    };
    return SGDRegressor;
}(BaseSGD));
exports.SGDRegressor = SGDRegressor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvY2hhc3RpY19ncmFkaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGluZWFyX21vZGVsL3N0b2NoYXN0aWNfZ3JhZGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbURBQXVDO0FBQ3ZDLGlDQUEwQztBQUMxQyxnREFBb0M7QUFFcEMsa0RBQTBFO0FBRTFFLElBQVksUUFJWDtBQUpELFdBQVksUUFBUTtJQUNsQixxQkFBUyxDQUFBO0lBQ1QscUJBQVMsQ0FBQTtJQUNULHlCQUFhLENBQUE7QUFDZixDQUFDLEVBSlcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFJbkI7QUFVRDs7O0dBR0c7QUFDSDtJQVNFOzs7OztPQUtHO0lBQ0gsaUJBQ0UsRUFxQkM7WUFyQkQ7Ozs7Ozs7Y0FxQkMsRUFwQkMscUJBQXNCLEVBQXRCLDJDQUFzQixFQUN0QixjQUFjLEVBQWQsbUNBQWMsRUFDZCxhQUFZLEVBQVosaUNBQVksRUFDWixvQkFBbUIsRUFBbkIsd0NBQW1CLEVBQ25CLFlBQWtCLEVBQWxCLHVDQUFrQixFQUNsQixrQkFBaUIsRUFBakIsc0NBQWlCO1FBakJiLFVBQUssR0FBWSxJQUFJLENBQUM7UUFDdEIsWUFBTyxHQUEwQixJQUFJLENBQUM7UUFpQzVDLElBQUksQ0FBQyxZQUFZLEdBQUcsYUFBYSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO1FBRTVCLHdEQUF3RDtRQUN4RCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssUUFB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