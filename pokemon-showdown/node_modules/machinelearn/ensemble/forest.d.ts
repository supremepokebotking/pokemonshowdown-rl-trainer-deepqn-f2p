import { IMlModel, Type1DMatrix, Type2DMatrix } from '../types';
/**
 * Base RandomForest implementation used by both classifier and regressor
 * @ignore
 */
export declare class BaseRandomForest implements IMlModel<number> {
    protected trees: any[];
    protected nEstimator: any;
    protected randomState: any;
    /**
     *
     * @param {number} nEstimator - Number of trees.
     * @param random_state - Random seed value for DecisionTrees
     */
    constructor({ nEstimator, random_state, }?: {
        nEstimator?: number;
        random_state?: number;
    });
    /**
     * Build a forest of trees from the training set (X, y).
     * @param {Array} X - array-like or sparse matrix of shape = [n_samples, n_features]
     * @param {Array} y - array-like, shape = [n_samples] or [n_samples, n_outputs]
     * @returns void
     */
    fit(X?: Type2DMatrix<number>, y?: Type1DMatrix<number>): void;
    /**
     * Returning the current model's checkpoint
     * @returns {{trees: any[]}}
     */
    toJSON(): {
        /**
         * Decision trees
         */
        trees: any[];
    };
    /**
     * Restore the model from a checkpoint
     * @param {any[]} trees - Decision trees
     */
    fromJSON({ trees }: {
        trees: any[];
    }): void;
    /**
     * Internal predict function used by either RandomForestClassifier or Regressor
     * @param X
     * @private
     */
    predict(X?: Type2DMatrix<number>): number[][];
}
/**
 * Random forest classifier creates a set of decision trees from randomly selected subset of training set.
 * It then aggregates the votes from different decision trees to decide the final class of the test object.
 *
 * @example
 * import { RandomForestClassifier } from 'machinelearn/ensemble';
 *
 * const X = [[0, 0], [1, 1], [2, 1], [1, 5], [3, 2]];
 * const y = [0, 1, 2, 3, 7];
 *
 * const randomForest = new RandomForestClassifier();
 * randomForest.fit(X, y);
 *
 * // Results in a value such as [ '0', '2' ].
 * // Predictions will change as we have not set a seed value.
 */
export declare class RandomForestClassifier extends BaseRandomForest {
    /**
     * Predict class for X.
     *
     * The predicted class of an input sample is a vote by the trees in the forest, weighted by their probability estimates.
     * That is, the predicted class is the one with highest mean probability estimate across the trees.
     * @param {Array} X - array-like or sparse matrix of shape = [n_samples]
     * @returns {string[]}
     */
    predict(X?: Type2DMatrix<number>): any[];
    /**
     * @hidden
     * Bagging prediction helper method
     * According to the predictions returns by the trees, it will select the
     * class with the maximum number (votes)
     * @param {Array<any>} predictions - List of initial predictions that may look like [ [1, 2], [1, 1] ... ]
     * @returns {string[]}
     */
    private votePredictions;
}
