import { Type1DMatrix, Type2DMatrix } from '../types';
/**
 * A Bagging classifier is an ensemble meta-estimator that fits
 * base classifiers each on random subsets of the original dataset
 * and then aggregate their individual predictions by voting
 * to form a final prediction
 *
 * @example
 * const classifier = new BaggingClassifier({
 *  baseEstimator: LogisticRegression,
 *  maxSamples: 1.0,
 * });
 * const X = [[1], [2], [3], [4], [5]];
 * const y = [1, 1, 1, 1, 1];
 * classifier.fit(X, y);
 * classifier.predict(X);
 */
export declare class BaggingClassifier {
    private baseEstimator;
    private numEstimators;
    private estimatorOptions;
    private maxSamples;
    private maxFeatures;
    private bootstrapSamples;
    private bootstrapFeatures;
    private estimators;
    private estimatorsFeatures;
    private maxSamplesIsFloating;
    private maxFeaturesIsFloating;
    /**
     * @param baseEstimator - The model that will be used as a basis of ensemble.
     * @param numEstimators - The number of estimators that will be used in ensemble.
     * @param maxSamples - The number of samples to draw from X to train each base estimator.
     *  Is used in conjunction with maxSamplesIsFloating.
     *  If @param maxSamplesIsFloating is false, then draw maxSamples samples.
     *  If @param maxSamplesIsFloating is true, then draw max_samples * shape(X)[0] samples.
     * @param maxFeatures - The number of features to draw from X to train each base estimator.
     *  Is used in conjunction with @param maxFeaturesIsFloating
     *  If maxFeaturesIsFloating is false, then draw max_features features.
     *  If maxFeaturesIsFloating is true, then draw max_features * shape(X)[1] features.
     * @param bootstrapSamples - Whether samples are drawn with replacement. If false, sampling without replacement is performed.
     * @param bootstrapFeatures - Whether features are drawn with replacement.
     * @param estimatorOptions - constructor options for BaseEstimator.
     * @param maxSamplesIsFloating - if true, draw maxSamples samples
     * @param maxFeaturesIsFloating - if true, draw maxFeatures samples
     */
    constructor({ baseEstimator, numEstimators, maxSamples, maxFeatures, bootstrapSamples, bootstrapFeatures, estimatorOptions, maxSamplesIsFloating, maxFeaturesIsFloating, }?: {
        baseEstimator?: any;
        numEstimators?: number;
        maxSamples?: number;
        maxFeatures?: number;
        bootstrapSamples?: boolean;
        bootstrapFeatures?: boolean;
        estimatorOptions?: any;
        maxSamplesIsFloating?: boolean;
        maxFeaturesIsFloating?: boolean;
    });
    /**
     * Builds an ensemble of base classifier from the training set (X, y).
     * @param {Array} X - array-like or sparse matrix of shape = [n_samples, n_features]
     * @param {Array} y - array-like, shape = [n_samples]
     * @returns void
     */
    fit(X?: Type2DMatrix<number>, y?: Type1DMatrix<number>): void;
    /**
     * Predict class for each row in X.
     *
     * Predictions are formed using the majority voting.
     * @param {Array} X - array-like or sparse matrix of shape = [n_samples, n_features]
     * @returns {Array} - array of shape [n_samples] that contains predicted class for each point X
     */
    predict(X?: Type2DMatrix<number>): number[];
    /**
     * Get the model details in JSON format
     */
    toJSON(): {
        baseEstimator: any;
        numEstimators: number;
        maxSamples: number;
        maxFeatures: number;
        bootstrapSamples: boolean;
        bootstrapFeatures: boolean;
        estimatorOptions: any;
        maxSamplesIsFloating: boolean;
        maxFeaturesIsFloating: boolean;
        estimators: any[];
        estimatorsFeatures: number[][];
    };
    /**
     * Restore the model from a checkpoint
     * @param checkPoint
     */
    fromJSON(checkPoint: {
        baseEstimator: any;
        numEstimators: number;
        maxSamples: number;
        maxFeatures: number;
        bootstrapSamples: boolean;
        bootstrapFeatures: boolean;
        estimatorOptions: any;
        maxSamplesIsFloating: boolean;
        maxFeaturesIsFloating: boolean;
        estimators: any[];
        estimatorsFeatures: number[][];
    }): void;
    /**
     * Retrieves the biggest vote from the votes map
     * @param votes
     */
    private getBiggestVote;
}
