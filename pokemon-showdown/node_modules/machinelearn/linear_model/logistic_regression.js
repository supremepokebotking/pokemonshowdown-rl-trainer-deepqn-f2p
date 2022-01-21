"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tf = __importStar(require("@tensorflow/tfjs"));
var tensors_1 = require("../utils/tensors");
var validation_1 = require("../utils/validation");
/**
 * Logistic Regression (aka logit, MaxEnt) classifier.
 *
 *
 * Logistic regression is named for the function used at the core of the method, the logistic function.
 * The logistic function, also called the sigmoid function was developed by statisticians to describe properties of
 * population growth in ecology, rising quickly and maxing out at the carrying capacity of the environment.
 * It’s an S-shaped curve that can take any real-valued number and map it into a value between 0 and 1,
 * but never exactly at those limits.
 *
 * 1 / (1 + e^-value)
 *
 * @example
 * import { LogisticRegression } from 'machinelearn/linear_model';
 * import { HeartDisease } from 'machinelearn/datasets';
 *
 * (async function() {
 *   const { data, targets } = await heartDisease.load();
 *   const { xTest, xTrain, yTest } = train_test_split(data, targets);
 *
 *   const lr = new LogisticRegression();
 *   lr.fit(xTrain, yTrain);
 *
 *   lr.predict(yTest);
 * });
 *
 */
var LogisticRegression = /** @class */ (function () {
    /**
     * @param learning_rate - Model learning rate
     * @param num_iterations - Number of iterations to run gradient descent fo
     */
    function LogisticRegression(_a) {
        var _b = _a === void 0 ? {
            learning_rate: 0.001,
            num_iterations: 4000,
        } : _a, _c = _b.learning_rate, learning_rate = _c === void 0 ? 0.001 : _c, _d = _b.num_iterations, num_iterations = _d === void 0 ? 4000 : _d;
        this.learningRate = learning_rate;
        this.numIterations = num_iterations;
    }
    /**
     * Fit the model according to the given training data.
     * @param X - A matrix of samples
     * @param y - A matrix of targets
     */
    LogisticRegression.prototype.fit = function (X, y) {
        if (X === void 0) { X = null; }
        if (y === void 0) { y = null; }
        var xWrapped = tensors_1.ensure2DMatrix(X);
        validation_1.validateFitInputs(xWrapped, y);
        this.initWeights(xWrapped);
        var tensorX = tf.tensor2d(xWrapped);
        var tensorY = tf.tensor1d(y);
        for (var i = 0; i < this.numIterations; ++i) {
            var predictions = tf.sigmoid(tensorX.dot(this.weights));
            var gradient = tf.mul(tensorY.sub(predictions).dot(tensorX), -1);
            this.weights = this.weights.sub(tf.mul(this.learningRate, gradient));
        }
    };
    /**
     * Predict class labels for samples in X.
     * @param X - A matrix of test data
     * @returns An array of predicted classes
     */
    LogisticRegression.prototype.predict = function (X) {
        if (X === void 0) { X = null; }
        validation_1.validateFeaturesConsistency(X, this.weights.arraySync());
        var xWrapped = tensors_1.ensure2DMatrix(X);
        var syncResult = tf.round(tf.sigmoid(tf.tensor2d(xWrapped).dot(this.weights))).arraySync();
        return validation_1.validateMatrix1D(syncResult);
    };
    /**
     * Get the model details in JSON format
     */
    LogisticRegression.prototype.toJSON = function () {
        return {
            weights: this.weights.arraySync(),
            learning_rate: this.learningRate,
        };
    };
    /**
     * Restore the model from a checkpoint
     */
    LogisticRegression.prototype.fromJSON = function (_a) {
        var _b = _a === void 0 ? {
            weights: null,
            learning_rate: 0.001,
        } : _a, 
        /**
         * Model training weights
         */
        _c = _b.weights, 
        /**
         * Model training weights
         */
        weights = _c === void 0 ? null : _c, 
        /**
         * Model learning rate
         */
        _d = _b.learning_rate, 
        /**
         * Model learning rate
         */
        learning_rate = _d === void 0 ? null : _d;
        this.weights = tf.tensor1d(weights);
        this.learningRate = learning_rate;
    };
    LogisticRegression.prototype.initWeights = function (X) {
        var shape = tensors_1.inferShape(X);
        var numFeatures = shape[1];
        var limit = 1 / Math.sqrt(numFeatures);
        this.weights = tf.randomUniform([numFeatures], -limit, limit);
    };
    return LogisticRegression;
}());
exports.LogisticRegression = LogisticRegression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naXN0aWNfcmVncmVzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGluZWFyX21vZGVsL2xvZ2lzdGljX3JlZ3Jlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsbURBQXVDO0FBRXZDLDRDQUE4RDtBQUM5RCxrREFBdUc7QUFFdkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEJHO0FBQ0g7SUFLRTs7O09BR0c7SUFDSCw0QkFDRSxFQVNDO1lBVEQ7OztjQVNDLEVBUkMscUJBQXFCLEVBQXJCLDBDQUFxQixFQUNyQixzQkFBcUIsRUFBckIsMENBQXFCO1FBU3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsYUFBYSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxhQUFhLEdBQUcsY0FBYyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksZ0NBQUcsR0FBVixVQUFXLENBQXFELEVBQUUsQ0FBOEI7UUFBckYsa0JBQUEsRUFBQSxRQUFxRDtRQUFFLGtCQUFBLEVBQUEsUUFBOEI7UUFDOUYsSUFBTSxRQUFRLEdBQUcsd0JBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyw4QkFBaUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQixJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDM0MsSUFBTSxXQUFXLEdBQXVCLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUU5RSxJQUFNLFFBQVEsR0FBdUIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZGLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDdEU7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLG9DQUFPLEdBQWQsVUFBZSxDQUFxRDtRQUFyRCxrQkFBQSxFQUFBLFFBQXFEO1FBQ2xFLHdDQUEyQixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFFekQsSUFBTSxRQUFRLEdBQXlCLHdCQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekQsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDN0YsT0FBTyw2QkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxtQ0FBTSxHQUFiO1FBVUUsT0FBTztZQUNMLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUNqQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVk7U0FDakMsQ0FBQztJQUNKLENBQUM7SUFFRDs7T0FFRztJQUNJLHFDQUFRLEdBQWYsVUFDRSxFQWVDO1lBZkQ7OztjQWVDO1FBZEM7O1dBRUc7UUFDSCxlQUFjO1FBSGQ7O1dBRUc7UUFDSCxtQ0FBYztRQUNkOztXQUVHO1FBQ0gscUJBQW9CO1FBSHBCOztXQUVHO1FBQ0gseUNBQW9CO1FBU3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQztJQUNwQyxDQUFDO0lBRU8sd0NBQVcsR0FBbkIsVUFBb0IsQ0FBOEM7UUFDaEUsSUFBTSxLQUFLLEdBQWEsb0JBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxJQUFNLFdBQVcsR0FBVyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBTSxLQUFLLEdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQTdHRCxJQTZHQztBQTdHWSxnREFBa0IifQ==