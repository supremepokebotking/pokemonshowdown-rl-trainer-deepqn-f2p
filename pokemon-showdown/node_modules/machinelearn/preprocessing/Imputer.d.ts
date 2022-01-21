import { Type2DMatrix } from '../types';
/**
 * Imputation transformer for completing missing values.
 *
 * @example
 * import { Imputer } from 'preprocessing/Imputer';
 *
 * const testX = [[1, 2], [null, 3], [7, 6]];
 * const imp = new Imputer({ missingValues: null, axis: 0 });
 * imp.fit(testX);
 * const impResult = imp.fit_transform([[null, 2], [6, null], [7, 6]]);
 * // [ [ 4, 2 ], [ 6, 3.6666666666666665 ], [ 7, 6 ] ]
 */
export declare class Imputer {
    private missingValues;
    private strategy;
    private axis;
    private copy;
    private means;
    /**
     *
     * @param {any} missingValues - Target missing value to impute
     * @param {any} strategy - Missing value replacement strategy
     * @param {any} axis - Direction to impute
     * @param {any} copy - To clone the input value
     */
    constructor({ missingValues, strategy, axis, copy, }: {
        missingValues?: any;
        strategy?: string;
        axis?: number;
        copy?: boolean;
    });
    /**
     * Fit the imputer on X.
     * @param {any[]} X - Input data in array or sparse matrix format
     */
    fit(X?: Type2DMatrix<any>): void;
    /**
     * Fit to data, then transform it.
     * @param {any[]} X - Input data in array or sparse matrix format
     * @returns {any[]}
     */
    fit_transform(X?: Type2DMatrix<any>): any[];
    /**
     * Calculate array of numbers as array of mean values
     * Examples:
     * [ [ 1, 2 ], [ null, 3 ], [ 123, 3 ] ]
     * => [ 1.5, 3, 63 ]
     *
     * [ [ 1, 123 ], [ 2, 3, 3 ] ]
     * => [ 62, 2.6666666666666665 ]
     *
     * @param matrix
     * @param {string[]} steps
     */
    private calcArrayMean;
}
