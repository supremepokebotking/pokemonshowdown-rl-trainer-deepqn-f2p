import { Type1DMatrix, Type2DMatrix } from '../types';
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
export declare class LogisticRegression {
    private weights;
    private learningRate;
    private numIterations;
    /**
     * @param learning_rate - Model learning rate
     * @param num_iterations - Number of iterations to run gradient descent fo
     */
    constructor({ learning_rate, num_iterations, }?: {
        learning_rate?: number;
        num_iterations?: number;
    });
    /**
     * Fit the model according to the given training data.
     * @param X - A matrix of samples
     * @param y - A matrix of targets
     */
    fit(X?: Type2DMatrix<number> | Type1DMatrix<number>, y?: Type1DMatrix<number>): void;
    /**
     * Predict class labels for samples in X.
     * @param X - A matrix of test data
     * @returns An array of predicted classes
     */
    predict(X?: Type2DMatrix<number> | Type1DMatrix<number>): number[];
    /**
     * Get the model details in JSON format
     */
    toJSON(): {
        /**
         * Model training weights
         */
        weights: number[];
        /**
         * Model learning rate
         */
        learning_rate: number;
    };
    /**
     * Restore the model from a checkpoint
     */
    fromJSON({ 
    /**
     * Model training weights
     */
    weights, 
    /**
     * Model learning rate
     */
    learning_rate, }?: {
        weights: number[];
        learning_rate: number;
    }): void;
    private initWeights;
}
