import { Type1DMatrix, Type2DMatrix } from '../types';
/**
 * Type of Linear Regression
 * Univariate = It can handle a 1 dimensional input
 * Multivariate = It can handle a 2 dimensional input
 * @ignore
 */
export declare enum TypeLinearReg {
    UNIVARIATE = "UNIVARIATE",
    MULTIVARIATE = "MULTIVARIATE"
}
/**
 * Ordinary least squares Linear Regression.
 *
 * It supports both univariate and multivariate linear regressions.
 *
 * @example
 * import { LinearRegression } from './linear_regression';
 * const linearRegression = new LinearRegression();
 * const X = [1, 2, 4, 3, 5];
 * const y = [1, 3, 3, 2, 5];
 * linearRegression.fit(X, y);
 * lr.predict([1, 2]);
 * // [ 1.1999999999999995, 1.9999999999999996 ]
 *
 * const linearRegression2 = new LinearRegression();
 * const X2 = [[1, 1], [1, 2], [2, 2], [2, 3]];
 * const y2 = [1, 1, 2, 2];
 * linearRegression2.fit(X2, y2);
 * lr.predict([[1, 2]]);
 * // [1.0000001788139343]
 */
export declare class LinearRegression {
    private weights;
    private type;
    /**
     * fit linear model
     * @param {any} X - training values
     * @param {any} y - target values
     */
    fit(X?: Type1DMatrix<number> | Type2DMatrix<number>, y?: Type1DMatrix<number> | Type2DMatrix<number>): void;
    /**
     * Predict using the linear model
     * @param {number} X - Values to predict.
     * @returns {number}
     */
    predict(X?: Type1DMatrix<number> | Type2DMatrix<number>): number[];
    /**
     * Get the model details in JSON format
     */
    toJSON(): {
        /**
         * Coefficients
         */
        weights: number[];
        /**
         * Type of the linear regression model
         */
        type: TypeLinearReg;
    };
    /**
     * Restore the model from a checkpoint
     */
    fromJSON({ 
    /**
     * Model's weights
     */
    weights, 
    /**
     * Type of linear regression, it can be either UNIVARIATE or MULTIVARIATE
     */
    type, }: {
        weights: number[];
        type: TypeLinearReg;
    }): void;
    /**
     * Univariate prediction
     * y = b0 + b1 * X
     *
     * @param X
     */
    private univariatePredict;
    /**
     * Multivariate prediction
     * y = (b0 * X0) + (b1 * X1) + (b2 * X2) + ....
     *
     * @param X
     */
    private multivariatePredict;
    /**
     * Calculates univariate coefficients for linear regression
     * @param X - X values
     * @param y - y targets
     */
    private calculateUnivariateCoeff;
    /**
     * Calculate multivariate coefficients for linear regression
     * @param X
     * @param y
     */
    private calculateMultiVariateCoeff;
}
