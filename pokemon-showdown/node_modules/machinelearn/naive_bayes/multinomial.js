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
var tensors_1 = require("../utils/tensors");
var validation_1 = require("../utils/validation");
/**
 * Multinomial naive bayes machine learning algorithm
 *
 * The Naive is an intuitive method that uses probabilistic of each attribute
 * being in each class to make a prediction. It uses multinomial function to estimate
 * probability of a given class.
 *
 * @example
 * import { MultinomialNB } from 'machinelearn/naive_bayes';
 *
 * const nb = new MultinomialNB();
 * const X = [[1, 20], [2, 21], [3, 22], [4, 22]];
 * const y = [1, 0, 1, 0];
 * nb.fit({ X, y });
 * nb.predict({ X: [[1, 20]] }); // returns [ 1 ]
 *
 */
var MultinomialNB = /** @class */ (function () {
    function MultinomialNB() {
        this.alpha = 1;
    }
    // constructor(private readonly alpha: number = 1) {}
    /**
     * Fit date to build Gaussian Distribution summary
     *
     * @param  {Type2DMatrix<number>} X - training values
     * @param  {ReadonlyArray<T>} y - target values
     * @returns void
     */
    MultinomialNB.prototype.fit = function (X, y) {
        if (X === void 0) { X = null; }
        if (y === void 0) { y = null; }
        validation_1.validateFitInputs(X, y);
        var _a = this.fitModel(X, y), classCategories = _a.classCategories, multinomialDist = _a.multinomialDist, priorProbability = _a.priorProbability;
        this.classCategories = classCategories;
        this.multinomialDist = multinomialDist;
        this.priorProbability = priorProbability;
    };
    /**
     * Predict multiple rows
     *
     * @param  {Type2DMatrix<number>} X - values to predict in Matrix format
     * @returns T
     */
    MultinomialNB.prototype.predict = function (X) {
        var _this = this;
        if (X === void 0) { X = null; }
        validation_1.validateMatrix2D(X);
        if (lodash_1.isEmpty(this.classCategories) || lodash_1.isEmpty(this.multinomialDist) || lodash_1.isEmpty(this.priorProbability)) {
            throw new TypeError('You should fit the model first before running the predict!');
        }
        return X.map(function (x) { return _this.singlePredict(x); });
    };
    /**
     * Returns a model checkpoint
     *
     * @returns InterfaceFitModelAsArray
     */
    MultinomialNB.prototype.toJSON = function () {
        return {
            classCategories: Array.from(this.classCategories),
            priorProbability: Array.from(this.priorProbability.dataSync()),
            multinomialDist: tensors_1.reshape(Array.from(this.multinomialDist.dataSync()), this.multinomialDist.shape),
        };
    };
    /**
     * Restore the model from states
     * @param multinomialDist - Multinomial distribution values over classes
     * @param priorProbability - Learned prior class probabilities
     * @param classCategories - List of unique class categories
     */
    MultinomialNB.prototype.fromJSON = function (_a) {
        var _b = _a === void 0 ? {
            multinomialDist: null,
            priorProbability: null,
            classCategories: null,
        } : _a, _c = _b.multinomialDist, multinomialDist = _c === void 0 ? null : _c, _d = _b.priorProbability, priorProbability = _d === void 0 ? null : _d, _e = _b.classCategories, classCategories = _e === void 0 ? null : _e;
        this.classCategories = classCategories;
        this.priorProbability = tf.tensor1d(priorProbability);
        this.multinomialDist = tf.tensor2d(multinomialDist);
    };
    /**
     * Make a prediction
     *
     * @param  {ReadonlyArray<number>} predictRow
     * @returns T
     */
    MultinomialNB.prototype.singlePredict = function (predictRow) {
        var matrixX = tf.tensor1d(predictRow, 'float32');
        var numFeatures = matrixX.shape[0];
        var summaryLength = this.multinomialDist.shape[1];
        // Comparing input and summary shapes
        if (numFeatures !== summaryLength) {
            throw new Error("Prediction input " + matrixX.shape[0] + " length must be equal or less than summary length " + summaryLength);
        }
        // log is important to use different multinomial formula instead of the factorial formula
        // The multinomial naive Bayes classifier becomes a linear
        // classifier when expressed in log-space
        // const priorProbability = Math.log(1 / classCount);
        var fitProbabilites = this.multinomialDist.clone().mul(matrixX);
        // sum(1) is summing columns
        var allProbabilities = fitProbabilites.sum(1).add(this.priorProbability);
        var selectionIndex = allProbabilities.argMax().dataSync()[0];
        allProbabilities.dispose();
        return this.classCategories[selectionIndex];
    };
    /**
     * Summarise the dataset per class
     *
     * @param  {Type2DMatrix<number>} X - input distribution
     * @param  {ReadonlyArray<T>} y - classes to train
     */
    MultinomialNB.prototype.fitModel = function (X, y) {
        var classCounts = lodash_1.countBy(y);
        var classCategories = Array.from(new Set(y));
        var numFeatures = X[0].length;
        var separatedByCategory = lodash_1.zip(X, y).reduce(function (groups, _a) {
            var _b = __read(_a, 2), row = _b[0], category = _b[1];
            if (!(category.toString() in groups)) {
                groups[category.toString()] = [];
            }
            groups[category.toString()].push(tf.tensor1d(row, 'float32'));
            return groups;
        }, {});
        var frequencySumByClass = tf.stack(classCategories.map(function (category) { return tf.addN(separatedByCategory[category.toString()]); }));
        var productReducedRow = Array.from(frequencySumByClass.sum(1).dataSync());
        // A class's prior may be calculated by assuming equiprobable classes
        // (i.e., priors = (number of samples in the class) / (total number of samples))
        var priorProbability = tf
            .tensor1d(classCategories.map(function (c) { return classCounts[c.toString()] / y.length; }), 'float32')
            .log();
        // log transform to use linear multinomial forumla
        var multinomialDist = frequencySumByClass
            .add(tf.scalar(this.alpha))
            .div(tf
            .tensor2d(productReducedRow, [frequencySumByClass.shape[0], 1], 'float32')
            .add(tf.scalar(numFeatures * this.alpha)))
            .log();
        return {
            classCategories: classCategories,
            multinomialDist: multinomialDist,
            priorProbability: priorProbability,
        };
    };
    return MultinomialNB;
}());
exports.MultinomialNB = MultinomialNB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlub21pYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL25haXZlX2JheWVzL211bHRpbm9taWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtREFBdUM7QUFDdkMsaUNBQStDO0FBRS9DLDRDQUEyQztBQUMzQyxrREFBMEU7QUFFMUU7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSDtJQUFBO1FBYVUsVUFBSyxHQUFXLENBQUMsQ0FBQztJQXlLNUIsQ0FBQztJQXZLQyxxREFBcUQ7SUFFckQ7Ozs7OztPQU1HO0lBQ0ksMkJBQUcsR0FBVixVQUFXLENBQThCLEVBQUUsQ0FBeUI7UUFBekQsa0JBQUEsRUFBQSxRQUE4QjtRQUFFLGtCQUFBLEVBQUEsUUFBeUI7UUFDbEUsOEJBQWlCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQUEsd0JBQTRFLEVBQTFFLG9DQUFlLEVBQUUsb0NBQWUsRUFBRSxzQ0FBd0MsQ0FBQztRQUNuRixJQUFJLENBQUMsZUFBZSxHQUFHLGVBQXNCLENBQUM7UUFDOUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0lBQzNDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLCtCQUFPLEdBQWQsVUFBZSxDQUE4QjtRQUE3QyxpQkFNQztRQU5jLGtCQUFBLEVBQUEsUUFBOEI7UUFDM0MsNkJBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxnQkFBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxnQkFBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxnQkFBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3BHLE1BQU0sSUFBSSxTQUFTLENBQUMsNERBQTRELENBQUMsQ0FBQztTQUNuRjtR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