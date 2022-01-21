"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var Random = __importStar(require("random-js"));
var validation_1 = require("../utils/validation");
/**
 * Question used by decision tree algorithm to determine whether to split branch or not
 * @ignore
 */
var Question = /** @class */ (function () {
    function Question(features, column, value) {
        if (features === void 0) { features = null; }
        this.features = [];
        this.column = null;
        this.value = null;
        this.features = features;
        this.column = column;
        this.value = value;
    }
    Question.prototype.match = function (example) {
        var val = example[this.column];
        if (typeof val === 'number') {
            return val >= this.value;
        }
        else {
            return val === this.value;
        }
    };
    Question.prototype.toString = function () {
        if (!this.features) {
            throw Error('You must provide feature labels in order to render toString!');
        }
        var condition = typeof this.value === 'number' ? '>=' : '==';
        return "Is " + this.features[this.column] + " " + condition + " " + this.value;
    };
    return Question;
}());
exports.Question = Question;
/**
 * According to the given targets array, count occurrences into an object.
 * @param {any[]} targets - list of class: count
 * @returns {}
 * @ignore
 */
function classCounts(targets) {
    var result = {};
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        var count = result[target]; // the current
        if (typeof count === 'number' && count > 0) {
            result[target] = {
                value: target,
                count: count + 1,
            };
        }
        else {
            result[target] = {
                value: target,
                count: 1,
            };
        }
    }
    return result;
}
exports.classCounts = classCounts;
/**
 * A leaf node that classifies data.
 * @ignore
 */
var Leaf = /** @class */ (function () {
    function Leaf(y) {
        this.prediction = null;
        var counts = classCounts(y);
        var keys = Object.keys(counts); // Retrieving the keys for looping
        // Variable holders
        var maxCount = 0;
        var maxValue = null;
        // Finding the max count key(actual prediction value)
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var count = counts[key].count;
            var value = counts[key].value;
            if (count > maxCount) {
                maxValue = value;
                maxCount = count;
            }
        }
        this.prediction = maxValue;
    }
    return Leaf;
}());
exports.Leaf = Leaf;
/**
 * It holds a reference to the question, and to the two children nodes
 * @ignore
 */
var DecisionNode = /** @class */ (function () {
    function DecisionNode(question, trueBranch, falseBranch) {
        this.question = null;
        this.trueBranch = null;
        this.falseBranch = null;
        this.question = question;
        this.trueBranch = trueBranch;
        this.falseBranch = falseBranch;
    }
    return DecisionNode;
}());
exports.DecisionNode = DecisionNode;
/**
 * A decision tree classifier.
 *
 * @example
 * import { DecisionTreeClassifier } from 'machinelearn/tree';
 * const features = ['color', 'diameter', 'label'];
 * const decision = new DecisionTreeClassifier({ featureLabels: features });
 *
 * const X = [['Green', 3], ['Yellow', 3], ['Red', 1], ['Red', 1], ['Yellow', 3]];
 * const y = ['Apple', 'Apple', 'Grape', 'Grape', 'Lemon'];
 * decision.fit({ X, y });
 * decision.printTree(); // try it out yourself! =)
 *
 * decision.predict({ X: [['Green', 3]] }); // [ 'Apple' ]
 * decision.predict({ X }); // [ [ 'Apple' ], [ 'Apple', 'Lemon' ], [ 'Grape', 'Grape' ], [ 'Grape', 'Grape' ], [ 'Apple', 'Lemon' ] ]
 *
 * @example
 * import { DecisionTreeClassifier } from 'machinelearn/tree';
 * const decision = new DecisionTreeClassifier({ featureLabels: null });
 *
 * const X = [[0, 0], [1, 1]];
 * const Y = [0, 1];
 * decision.fit({ X, y });
 * decision2.predict({ row: [[2, 2]] }); // [ 1 ]
 */
var DecisionTreeClassifier = /** @class */ (function () {
    /**
     *
     * @param featureLabels - Literal names for each feature to be used while printing the tree out as a string
     * @param verbose - Logs the progress of the tree construction as console.info
     * @param random_state - A seed value for the random engine
     */
    function DecisionTreeClassifier(_a) {
        var _b = _a === void 0 ? {
            featureLabels: null,
            verbose: false,
            random_state: null,
        } : _a, _c = _b.featureLabels, featureLabels = _c === void 0 ? null : _c, _d = _b.verbose, verbose = _d === void 0 ? false : _d, _e = _b.random_state, random_state = _e === void 0 ? null : _e;
        this.featureLabels = null;
        this.tree = null;
        this.verbose = true;
        this.randomState = null;
        this.randomEngine = null;
        this.featureLabels = featureLabels;
        this.verbose = verbose;
        this.randomState = random_state;
        if (!Number.isInteger(random_state)) {
            this.randomEngine = Random.engines.mt19937().autoSeed();
        }
        else {
            this.randomEngine = Random.engines.mt19937().seed(random_state);
        }
    }
    /**
     * Fit date, which builds a tree
     * @param {any} X - 2D Matrix of training
     * @param {any} y - 1D Vector of target
     * @returns {Leaf | DecisionNode}
     */
    DecisionTreeClassifier.prototype.fit = function (X, y) {
        if (X === void 0) { X = null; }
        if (y === void 0) { y = null; }
        validation_1.validateFitInputs(X, y);
        this.tree = this.buildTree({ X: X, y: y });
    };
    /**
     * Predict multiple rows
     *
     * @param X - 2D Matrix of testing data
     */
    DecisionTreeClassifier.prototype.predict = function (X) {
        if (X === void 0) { X = []; }
        validation_1.validateMatrix2D(X);
        var result = [];
        for (var i = 0; i < X.length; i++) {
            var row = X[i];
            result.push(this._predict({ row: row, node: this.tree }));
        }
        return result;
    };
    /**
     * Returns the model checkpoint
     * @returns {{featureLabels: string[]; tree: any; verbose: boolean}}
     */
    DecisionTreeClassifier.prototype.toJSON = function () {
        return {
            featureLabels: this.featureLabels,
            tree: this.tree,
            verbose: this.verbose,
            random_state: this.randomState,
        };
    };
    /**
     * Restores the model from a checkpoint
     * @param {string[]} featureLabels - Literal names for each feature to be used while printing the tree out as a string
     * @param {any} tree - The model's state
     * @param {boolean} verbose - Logs the progress of the tree construction as console.info
     * @param {number} random_state - A seed value for the random engine
     */
    DecisionTreeClassifier.prototype.fromJSON = function (_a) {
        var _b = _a.featureLabels, featureLabels = _b === void 0 ? null : _b, _c = _a.tree, tree = _c === void 0 ? null : _c, _d = _a.verbose, verbose = _d === void 0 ? false : _d, _e = _a.random_state, random_state = _e === void 0 ? null : _e;
        this.featureLabels = featureLabels;
        this.tree = tree;
        this.verbose = verbose;
        this.randomState = random_state;
    };
    /**
     * Recursively print the tree into console
     * @param {string} spacing - Spacing used when printing the tree into the terminal
     */
    DecisionTreeClassifier.prototype.printTree = function (spacing) {
        if (spacing === void 0) { spacing = ''; }
        if (!this.tree) {
            throw new Error('You cannot print an empty tree');
        }
        this._printTree({ node: this.tree, spacing: spacing });
    };
    /**
     * Partition X and y into true and false branches
     * @param X
     * @param y
     * @param {Question} question
     * @returns {{trueX: Array<any>; trueY: Array<any>; falseX: Array<any>; falseY: Array<any>}}
     */
    DecisionTreeClassifier.prototype.partition = function (X, y, question) {
        var trueX = [];
        var trueY = [];
        var falseX = [];
        var falseY = [];
        for (var i = 0; i < X.length; i++) {
            var row = X[i];
            if (question.match(row)) {
                trueX.push(X[i]);
                trueY.push(y[i]);
            }
            else {
                falseX.push(X[i]);
                falseY.push(y[i]);
            }
        }
        return { trueX: trueX, trueY: trueY, falseX: falseX, falseY: falseY };
    };
    /**
     * Calculate the gini impurity of rows
     * Checkout: https://en.wikipedia.org/wiki/Decision_tree_learning#Gini_impurity
     * @param targets
     * @returns {number}
     */
    DecisionTreeClassifier.prototype.gini = function (targets) {
        var counts = classCounts(targets);
        var impurity = 1;
        var keys = Object.keys(counts);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var count = counts[key].count;
            if (count === null || count === undefined) {
                throw Error('Invalid class count detected!');
            }
            var probOfClass = count / targets.length;
            impurity -= Math.pow(probOfClass, 2);
        }
        return impurity;
    };
    /**
     * Information Gain.
     *
     * The uncertainty of the starting node, minus the weighted impurity of
     * two child nodes.
     * @param left
     * @param right
     * @param uncertainty
     * @returns {number}
     */
    DecisionTreeClassifier.prototype.infoGain = function (left, right, uncertainty) {
        var p = left.length / (left.length + right.length);
        return uncertainty - p * this.gini(left) - (1 - p) * this.gini(right);
    };
    /**
     * Find the best split for the current X and y.
     * @param X
     * @param y
     * @returns {{bestGain: number; bestQuestion: any}}
     */
    DecisionTreeClassifier.prototype.findBestSplit = function (X, y) {
        var uncertainty = this.gini(y);
        var nFeatures = X[0].length;
        var bestGain = 0;
        var bestQuestion = null;
        var featureIndex = [];
        if (Number.isInteger(this.randomState)) {
            // method 1: Randomly selecting features
            while (featureIndex.length <= nFeatures) {
                var index = Random.integer(0, nFeatures)(this.randomEngine);
                featureIndex.push(index);
            }
        }
        else {
            featureIndex = lodash_1.range(0, X[0].length);
        }
        var _loop_1 = function (i) {
            var col = featureIndex[i];
            var uniqFeatureValues = lodash_1.uniqBy(lodash_1.map(X, function (row) { return row[col]; }), function (x) { return x; });
            for (var j = 0; j < uniqFeatureValues.length; j++) {
                var feature = uniqFeatureValues[j];
                // featureLabels is for the model interoperability
                var question = new Question(this_1.featureLabels, col, feature);
                // Try splitting the dataset
                var _a = this_1.partition(X, y, question), trueY = _a.trueY, falseY = _a.falseY;
                // Skip this dataset if it does not divide
                if (trueY.length === 0 || falseY.length === 0) {
                    continue;
                }
                // Calculate information gained from this split
                var gain = this_1.infoGain(trueY, falseY, uncertainty);
                if (this_1.verbose) {
                    console.info("fn: " + col + " fval: " + feature + " gini: " + gain);
                }
                if (gain >= bestGain) {
                    bestGain = gain;
                    bestQuestion = question;
                }
            }
        };
        var this_1 = this;
        for (var i = 0; i < featureIndex.length; i++) {
            _loop_1(i);
        }
        return { bestGain: bestGain, bestQuestion: bestQuestion };
    };
    /**
     * Interactively build tree until it reaches the terminal nodes
     * @param {any} X
     * @param {any} y
     * @returns {any}
     */
    DecisionTreeClassifier.prototype.buildTree = function (_a) {
        var X = _a.X, y = _a.y;
        var _b = this.findBestSplit(X, y), bestGain = _b.bestGain, bestQuestion = _b.bestQuestion;
        if (bestGain === 0) {
            return new Leaf(y);
        }
        // Partition the current passed in X ,y
        var _c = this.partition(X, y, bestQuestion), trueX = _c.trueX, trueY = _c.trueY, falseX = _c.falseX, falseY = _c.falseY;
        // Recursively build the true branch
        var trueBranch = this.buildTree({ X: trueX, y: trueY });
        // Recursively build the false branch
        var falseBranch = this.buildTree({ X: falseX, y: falseY });
        return new DecisionNode(bestQuestion, trueBranch, falseBranch);
    };
    /**
     * Internal predict method separated out for recursion purpose
     * @param {any} row
     * @param {any} node
     * @returns {any}
     * @private
     */
    DecisionTreeClassifier.prototype._predict = function (_a) {
        var row = _a.row, node = _a.node;
        if (node instanceof Leaf) {
            // Just return the highest voted
            return node.prediction;
        }
        if (node.question.match(row)) {
            return this._predict({ row: row, node: node.trueBranch });
        }
        else {
            return this._predict({ row: row, node: node.falseBranch });
        }
    };
    /**
     * Private method for printing tree; required for recursion
     * @param {any} node
     * @param {any} spacing
     */
    DecisionTreeClassifier.prototype._printTree = function (_a) {
        var node = _a.node, _b = _a.spacing, spacing = _b === void 0 ? '' : _b;
        if (node instanceof Leaf) {
            console.info(spacing + '' + node.prediction);
            return;
        }
        // Print the question of the node
        console.info(spacing + node.question.toString());
        // Call this function recursively for true branch
        console.info(spacing, '--> True');
        this._printTree({ node: node.trueBranch, spacing: spacing + ' ' });
        // Call this function recursively for false branch
        console.info(spacing, '--> False');
        this._printTree({ node: node.falseBranch, spacing: spacing + ' ' });
    };
    return DecisionTreeClassifier;
}());
exports.DecisionTreeClassifier = DecisionTreeClassifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdHJlZS90cmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGlDQUE0QztBQUM1QyxnREFBb0M7QUFFcEMsa0RBQTBFO0FBRTFFOzs7R0FHRztBQUNIO0lBS0Usa0JBQVksUUFBZSxFQUFFLE1BQU0sRUFBRSxLQUFLO1FBQTlCLHlCQUFBLEVBQUEsZUFBZTtRQUpuQixhQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2QsV0FBTSxHQUFHLElBQUksQ0FBQztRQUNkLFVBQUssR0FBRyxJQUFJLENBQUM7UUFHbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVNLHdCQUFLLEdBQVosVUFBYSxPQUFPO1FBQ2xCLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakMsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7WUFDM0IsT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztTQUMxQjthQUFNO1lBQ0wsT0FBTyxHQUFHLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFTSwyQkFBUSxHQUFmO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsTUFBTSxLQUFLLENBQUMsOERBQThELENBQUMsQ0FBQztTQUM3RTtRQUNELElBQU0sU0FBUyxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQy9ELE9BQU8sUUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENB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