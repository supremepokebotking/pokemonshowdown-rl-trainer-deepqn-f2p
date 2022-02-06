import { Type1DMatrix, Type2DMatrix } from '../types';
/**
 * Augment dataset with an additional dummy feature.
 * This is useful for fitting an intercept term with implementations which cannot otherwise fit it directly.
 *
 * @example
 * import { add_dummy_feature } from 'machinelearn/preprocessing';
 * const dummy = add_dummy_feature([[0, 1, 2], [1, 0, 3]]);
 * console.log(dummy); // returns: [ [ 1, 0, 1, 2 ], [ 1, 1, 0, 3 ] ]
 *
 * @param X - A matrix of data
 * @param value - Value to use for the dummy feature.
 */
export declare function add_dummy_feature(X?: Type2DMatrix<number>, value?: number): number[][];
/**
 * Encode categorical integer features using a one-hot aka one-of-K scheme.
 *
 * The input to this transformer should be a matrix of integers, denoting the
 * values taken on by categorical (discrete) features. The output will be a sparse
 * matrix where each column corresponds to one possible value of one feature.
 * It is assumed that input features take on values in the range [0, n_values).
 *
 * This encoding is needed for feeding categorical data to many
 * scikit-learn estimators, notably linear models and SVMs with the standard kernels.
 *
 * Note: a one-hot encoding of y labels should use a LabelBinarizer instead.
 *
 * @example
 * const enc = new OneHotEncoder();
 * const planetList = [
 *  { planet: 'mars', isGasGiant: false, value: 10 },
 *  { planet: 'saturn', isGasGiant: true, value: 20 },
 *  { planet: 'jupiter', isGasGiant: true, value: 30 }
 * ];
 * const encodeInfo = enc.encode(planetList, {
 *  dataKeys: ['value', 'isGasGiant'],
 *  labelKeys: ['planet']
 * });
 * // encodeInfo.data -> [ [ -1, 0, 1, 0, 0 ], [ 0, 1, 0, 1, 0 ], [ 1, 1, 0, 0, 1 ] ]
 * const decodedInfo = enc.decode(encodeInfo.data, encodeInfo.decoders);
 * // gives you back the original value, which is `planetList`
 */
export declare class OneHotEncoder {
    /**
     * encode data according to dataKeys and labelKeys
     *
     * @param data - list of records to encode
     * @param options
     */
    encode(data?: any, { 
    /**
     * Independent variables
     */
    dataKeys, 
    /**
     * Depdenent variables
     */
    labelKeys, }?: {
        dataKeys: Type1DMatrix<string>;
        labelKeys: Type1DMatrix<string>;
    }): {
        /**
         * Encoded data
         */
        data: any[];
        /**
         * Decoder
         */
        decoders: any[];
    };
    /**
     * Decode the encoded data back into its original format
     */
    decode(encoded: any, decoders: any): any[];
    /**
     * Decode an encoded row back into its original format
     * @param row
     * @param decoders
     * @returns {Object}
     */
    private decodeRow;
    /**
     * Standardizing field
     * Example dataset:
     * [ { planet: 'mars', isGasGiant: false, value: 10 },
     * { planet: 'saturn', isGasGiant: true, value: 20 },
     * { planet: 'jupiter', isGasGiant: true, value: 30 } ]
     *
     * @param key: each key/feature such as planet, isGasGiant and value
     * @param data: the entire dataset
     * @returns {any}
     */
    private standardizeField;
    /**
     * Calculating the sample standard deviation (vs population stddev).
     * @param lst
     * @param {number} mean
     * @returns {number}
     */
    private calculateStd;
    /**
     * One hot encode a number value
     *
     * @param type
     * @param key
     * @param values
     * @returns {{encoded: any[]; decode: {type: any; mean: number; std: number; key: any}}}
     */
    private buildNumberOneHot;
    /**
     * One hot encode a boolean value
     *
     * Example usage:
     * boolEncoder.encode(true) => 1
     * boolEncoder.encode(false) => 0
     *
     * @param type
     * @param key
     * @param values
     * @returns {{encode}}
     */
    private buildBooleanOneHot;
    /**
     * One hot encode a string value
     *
     * Example for internal reference (unnecessary details for those just using this module)
     *
     * const encoder = buildOneHot(['RAIN', 'RAIN', 'SUN'])
     * // encoder == { encode: () => ... , lookupTable: ['RAIN', 'SUN'] }
     * encoder.encode('SUN')  // [0, 1]
     * encoder.encode('RAIN') // [1, 0]
     * encoder.encode('SUN')  // [1, 0]
     * // encoder.lookupTable can then be passed into this.decode to translate [0, 1] back into 'SUN'
     *
     * It's not ideal (ideally it would all just be done in-memory and we could return a "decode" closure,
     * but it needs to be serializable to plain old JSON.
     */
    private buildStringOneHot;
}
/**
 * Transforms features by scaling each feature to a given range.
 *
 * This estimator scales and translates each feature individually such that it is in the given range on the training set, i.e. between zero and one.
 *
 * The transformation is given by:
 *
 * ```
 * X_std = (X - X.min(axis=0)) / (X.max(axis=0) - X.min(axis=0))
 * X_scaled = X_std * (max - min) + min
 * ```
 *
 * where min, max = feature_range.
 *
 * This transformation is often used as an alternative to zero mean, unit variance scaling.
 *
 * @example
 * import { MinMaxScaler } from 'machinelearn/preprocessing';
 *
 * const minmaxScaler = new MinMaxScaler({ featureRange: [0, 1] });
 *
 * // Fitting an 1D matrix
 * minmaxScaler.fit([4, 5, 6]);
 * const result = minmaxScaler.transform([4, 5, 6]);
 * // result = [ 0, 0.5, 1 ]
 *
 * // Fitting a 2D matrix
 * const minmaxScaler2 = new MinMaxScaler({ featureRange: [0, 1] });
 * minmaxScaler2.fit([[1, 2, 3], [4, 5, 6]]);
 * const result2 = minmaxScaler2.transform([[1, 2, 3]]);
 * // result2 = [ [ 0, 0.2, 0.4000000000000001 ] ]
 *
 */
export declare class MinMaxScaler {
    private featureRange;
    private dataMax;
    private dataMin;
    private featureMax;
    private featureMin;
    private dataRange;
    private scale;
    private baseMin;
    /**
     * @param featureRange - scaling range
     */
    constructor({ featureRange, }?: {
        featureRange?: number[];
    });
    /**
     * Compute the minimum and maximum to be used for later scaling.
     * @param {number[]} X - Array or sparse-matrix data input
     */
    fit(X?: Type1DMatrix<number> | Type2DMatrix<number>): void;
    /**
     * Fit to data, then transform it.
     * @param X - Original input vector
     */
    fit_transform(X: Type1DMatrix<number> | Type2DMatrix<number>): number[] | number[][];
    /**
     * Scaling features of X according to feature_range.
     * @param X - Original input vector
     */
    transform(X?: Type1DMatrix<number> | Type2DMatrix<number>): number[] | number[][];
    /**
     * Undo the scaling of X according to feature_range.
     * @param {number[]} X - Scaled input vector
     */
    inverse_transform(X?: Type1DMatrix<number>): number[];
}
/**
 * Binarizer transform your data using a binary threshold.
 * All values above the threshold are marked 1 and all equal to or below are marked as 0.
 *
 * It can also be used as a pre-processing step for estimators that consider
 * boolean random variables (e.g. modelled using the Bernoulli distribution in
 * a Bayesian setting).
 *
 * @example
 * import { Binarizer } from 'machinelearn/preprocessing';
 *
 * const binX = [[1, -1, 2], [2, 0, 0], [0, 1, -1]];
 * const binarizer = new Binarizer({ threshold: 0 });
 * const result = binarizer.transform(binX);
 * // [ [ 1, 0, 1 ], [ 1, 0, 0 ], [ 0, 1, 0 ] ]
 */
export declare class Binarizer {
    private threshold;
    private copy;
    /**
     *
     * @param {number} threshold - Feature values below or equal to this are replaced by 0, above it by 1.
     * @param {boolean} copy - Flag to clone the input value.
     */
    constructor({ copy, threshold, }?: {
        copy?: boolean;
        threshold?: number;
    });
    /**
     * Currently fit does nothing
     * @param {any[]} X - Does nothing
     */
    fit(X?: Type2DMatrix<number>): void;
    /**
     * Transforms matrix into binarized form
     * X = [[ 1., -1.,  2.],
     *      [ 2.,  0.,  0.],
     *      [ 0.,  1., -1.]]
     * becomes
     * array([[ 1.,  0.,  1.],
     *    [ 1.,  0.,  0.],
     *    [ 0.,  1.,  0.]])
     * @param {any[]} X - The data to binarize.
     */
    transform(X?: Type2DMatrix<number>): any[];
}
/**
 * Generate polynomial and interaction features.
 *
 * Generate a new feature matrix consisting of all polynomial combinations of the features
 * with degree less than or equal to the specified degree. For example, if an input sample
 * is two dimensional and of the form [a, b], the degree-2 polynomial features are [1, a, b, a^2, ab, b^2].
 *
 * @example
 * import { PolynomialFeatures } from 'machinelearn/preprocessing';
 * const poly = new PolynomialFeatures();
 * const X = [[0, 1], [2, 3], [4, 5]];
 * poly.transform(X);
 * // Result:
 * // [ [ 1, 0, 1, 0, 0, 1 ],
 * // [ 1, 2, 3, 4, 6, 9 ],
 * // [ 1, 4, 5, 16, 20, 25 ] ]
 *
 */
export declare class PolynomialFeatures {
    private degree;
    /**
     *
     * @param degree - The degree of the polynomial features. Default = 2.
     */
    constructor({ degree, }?: {
        degree: number;
    });
    /**
     * Transforms the input data
     * @param X - a matrix
     */
    transform(X?: Type2DMatrix<number>): number[][];
    /**
     * Creates a combination of index according to nFeautres and degree
     * @param nFeatures
     * @param degree
     */
    private indexCombination;
}
/**
 * Data normalization is a process of scaling dataset based on Vector Space Model, and by default, it uses L2 normalization.
 * At a higher level, the chief difference between the L1 and the L2 terms is that the L2 term is proportional
 * to the square of the  β values, while the L1 norm is proportional the absolute value of the values in  β .
 *
 * @example
 * import { normalize } from 'machinelearn/preprocessing';
 *
 * const result = normalize([
 *   [1, -1, 2],
 *   [2, 0, 0],
 *   [0, 1, -1],
 * ], { norm: 'l2' });
 * console.log(result);
 * // [ [ 0.4082482904638631, -0.4082482904638631, 0.8164965809277261 ],
 * // [ 1, 0, 0 ],
 * // [ 0, 0.7071067811865475, -0.7071067811865475 ] ]
 *
 * @param X - The data to normalize
 * @param norm - The norm to use to normalize each non zero sample; can be either 'l1' or 'l2'
 * @return number[][]
 */
export declare function normalize(X?: Type2DMatrix<number>, { norm, }?: {
    norm: string;
}): number[][];
