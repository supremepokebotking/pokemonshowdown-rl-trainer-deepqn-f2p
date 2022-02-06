import { Type1DMatrix, Type2DMatrix } from '../types';
import { SGDRegressor } from './stochastic_gradient';
/**
 * Linear least squares with l2 regularization.
 *
 * Mizimizes the objective function:
 *
 *
 * ||y - Xw||^2_2 + alpha * ||w||^2_2
 *
 *
 * This model solves a regression model where the loss function is the linear least squares function
 * and regularization is given by the l2-norm. Also known as Ridge Regression or Tikhonov regularization.
 * This estimator has built-in support for multi-variate regression (i.e., when y is a 2d-array of shape [n_samples, n_targets]).
 *
 * @example
 * import { Iris } from 'machinelearn/datasets';
 * import { Ridge } from 'machinelearn/linear_model';
 * (async function() {
 *   const irisData = new Iris();
 *   const {
 *     data,         // returns the iris data (X)
 *     targets,      // list of target values (y)
 *   } = await irisData.load(); // loads the data internally
 *
 *   const reg = new Ridge({ l2: 1 });
 *   reg.fit(data, target);
 *   reg.predict([[5.1,3.5,1.4,0.2]]);
 * })();
 *
 */
export declare class Ridge extends SGDRegressor {
    /**
     * @param l2 - Regularizer factor
     * @param epochs - Number of epochs
     * @param learning_rate - learning rate
     */
    constructor({ l2, epochs, learning_rate, }?: {
        l2: number;
        epochs?: number;
        learning_rate?: number;
    });
}
/**
 * Linear Model trained with L1 prior as regularizer (aka the Lasso)
 *
 * The optimization objective for Lasso is:
 *
 * (1 / (2 * n_samples)) * ||y - Xw||^2_2 + alpha * ||w||_1
 *
 * Technically the Lasso model is optimizing the same objective function as the Elastic Net with l1_ratio value (no L2 penalty).
 *
 * @example
 * import { Iris } from 'machinelearn/datasets';
 * import { Lasso } from 'machinelearn/linear_model';
 * (async function() {
 *   const irisData = new Iris();
 *   const {
 *     data,         // returns the iris data (X)
 *     targets,      // list of target values (y)
 *   } = await irisData.load(); // loads the data internally
 *
 *   const reg = new Lasso({ degree: 2, l1: 1 });
 *   reg.fit(data, target);
 *   reg.predict([[5.1,3.5,1.4,0.2]]);
 * })();
 *
 */
export declare class Lasso extends SGDRegressor {
    private degree;
    /**
     * @param degree - Polynomial feature extraction degree
     * @param l1 - Regularizer factor
     * @param epochs - Number of epochs
     * @param learning_rate - Learning rate
     */
    constructor({ degree, l1, epochs, learning_rate, }?: {
        degree: number;
        l1: number;
        epochs?: number;
        learning_rate?: number;
    });
    /**
     * Fit model with coordinate descent.
     * @param X - A matrix of samples
     * @param y - A vector of targets
     */
    fit(X?: Type2DMatrix<number>, y?: Type1DMatrix<number>): void;
    /**
     * Predict using the linear model
     * @param X - A matrix of test data
     */
    predict(X?: Type2DMatrix<number>): number[];
}
