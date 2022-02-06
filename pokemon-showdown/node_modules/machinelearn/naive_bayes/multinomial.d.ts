import { IMlModel, Type1DMatrix, Type2DMatrix } from '../types';
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
export declare class MultinomialNB<T extends number | string = number> implements IMlModel<T> {
    /**
     * List of classes
     * @example
     * Given [1, 0, 1, 0, 2, 2, 2], categories are
     * [0, 1, 2]
     */
    private classCategories;
    /**
     * Multinomial distribution values. It is always two dimensional values.
     */
    private multinomialDist;
    private priorProbability;
    private alpha;
    /**
     * Fit date to build Gaussian Distribution summary
     *
     * @param  {Type2DMatrix<number>} X - training values
     * @param  {ReadonlyArray<T>} y - target values
     * @returns void
     */
    fit(X?: Type2DMatrix<number>, y?: Type1DMatrix<T>): void;
    /**
     * Predict multiple rows
     *
     * @param  {Type2DMatrix<number>} X - values to predict in Matrix format
     * @returns T
     */
    predict(X?: Type2DMatrix<number>): T[];
    /**
     * Returns a model checkpoint
     *
     * @returns InterfaceFitModelAsArray
     */
    toJSON(): {
        /**
         * List of class categories
         */
        classCategories: T[];
        /**
         * Multinomial distribution values over classes
         */
        multinomialDist: Type2DMatrix<number>;
        /**
         * Learned prior class probabilities
         */
        priorProbability: Type1DMatrix<number>;
    };
    /**
     * Restore the model from states
     * @param multinomialDist - Multinomial distribution values over classes
     * @param priorProbability - Learned prior class probabilities
     * @param classCategories - List of unique class categories
     */
    fromJSON({ multinomialDist, priorProbability, classCategories, }?: {
        multinomialDist: Type2DMatrix<number>;
        priorProbability: Type1DMatrix<number>;
        classCategories: Type1DMatrix<T>;
    }): void;
    /**
     * Make a prediction
     *
     * @param  {ReadonlyArray<number>} predictRow
     * @returns T
     */
    private singlePredict;
    /**
     * Summarise the dataset per class
     *
     * @param  {Type2DMatrix<number>} X - input distribution
     * @param  {ReadonlyArray<T>} y - classes to train
     */
    private fitModel;
}
