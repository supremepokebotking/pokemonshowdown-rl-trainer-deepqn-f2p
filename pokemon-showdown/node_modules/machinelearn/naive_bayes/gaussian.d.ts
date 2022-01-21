import { IMlModel, Type1DMatrix, Type2DMatrix } from '../types';
/**
 * The Naive is an intuitive method that uses probabilistic of each attribute
 * being in each class to make a prediction. It uses Gaussian function to estimate
 * probability of a given class.
 *
 * @example
 * import { GaussianNB } from 'machinelearn/naive_bayes';
 *
 * const nb = new GaussianNB();
 * const X = [[1, 20], [2, 21], [3, 22], [4, 22]];
 * const y = [1, 0, 1, 0];
 * nb.fit({ X, y });
 * nb.predict({ X: [[1, 20]] }); // returns [ 1 ]
 *
 */
export declare class GaussianNB<T extends number | string = number> implements IMlModel<T> {
    private classCategories;
    private mean;
    private variance;
    /**
     * @param X - array-like or sparse matrix of shape = [n_samples, n_features]
     * @param y - array-like, shape = [n_samples] or [n_samples, n_outputs]
     */
    fit(X?: Type2DMatrix<number>, y?: Type1DMatrix<T>): void;
    /**
     * @param X - array-like, shape = [n_samples, n_features]
     */
    predict(X?: Type2DMatrix<number>): T[];
    /**
     * Restore the model from saved states
     * @param modelState
     */
    fromJSON({ classCategories, mean, variance, }: {
        /**
         * List of class categories
         */
        classCategories: T[];
        /**
         * Mean of each feature per class
         */
        mean: Type2DMatrix<number>;
        /**
         * Variance of each feature per class
         */
        variance: Type2DMatrix<number>;
    }): void;
    /**
     * Save the model's states
     */
    toJSON(): {
        /**
         * List of class categories
         */
        classCategories: T[];
        /**
         * Mean of each feature per class
         */
        mean: Type2DMatrix<number>;
        /**
         * Variance of each feature per class
         */
        variance: Type2DMatrix<number>;
    };
    /**
     * Make a single prediction
     *
     * @param  {ReadonlyArray<number>} X- values to predict in Matrix format
     * @returns T
     */
    private singlePredict;
    /**
     * Summarise the dataset per class using "probability density function"
     *
     * @param  {Type2DMatrix<number>} X
     * @param  {ReadonlyArray<T>} y
     * @returns InterfaceFitModel
     */
    private fitModel;
}
