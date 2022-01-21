import * as tf from '@tensorflow/tfjs';
import { Type1DMatrix, Type2DMatrix, TypeMatrix } from '../types';
/**
 * Check below array conditions
 * - multiclass
 *    - e.g. [ [1, 2], [2, 3] ]
 *      Then it sets multiclass value to true
 * - isArray<boolean>
 *   If the given arr is an array then the value is true else false
 * @param arr
 * @returns {any}
 * @ignore
 */
export declare function checkArray(arr: unknown): {
    readonly isArray: boolean;
    readonly multiclass: boolean;
};
/**
 * Validates the input matrix's types with the targetted types.
 * Specified target types must be one of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#Description
 *
 * @example
 * validateMatrixType([['z', 'z']],['string']); // no errors
 * validateMatrixType([['z', 'z']],['test']); // error: Input matrix type of ["string"] does not match with the target types ["test"]
 *
 * @param X - The input matrix
 * @param targetTypes - Target matrix types
 * @ignore
 */
export declare function validateMatrixType(X: TypeMatrix<any>, targetTypes: string[]): void;
/**
 * Check that X and y have the same size across the first axis
 *
 * @example
 * validateTrainInputs([ [1, 2], [3, 4] ], [ 1, 2 ]) // No errors
 * validateTrainInputs([ [[1, 2], [3, 3]], [[1, 2], [3, 3]] ], [ 1, 2 ]) // Error: The matrix is not 1D shaped: [ [[1, 2], [3, 3]], [[1, 2], [3, 3]] ] of [2, 2, 2]
 *
 * @param X
 * @param y
 * @ignore
 */
export declare function validateFitInputs(X: Type2DMatrix<any> | Type1DMatrix<any>, y: Type1DMatrix<any>): void;
/**
 * Validate the matrix is 1D shaped by checking the shape's length is exactly  1
 * @param X
 * @ignore
 */
export declare function validateMatrix1D(X: unknown): number[];
/**
 * Validate the matrix is 2D shaped by checking the shape's length is exactly 2
 * @param X - An input array
 * @ignore
 */
export declare function validateMatrix2D(X: unknown): number[][];
/**
 * Checks that provided X matrix has the same number of features as model matrix
 * @param X - matrix to check
 * @param reference - reference matrix
 * @throws ValidationError - in case number of features doesn't match
 * @ignore
 */
export declare const validateFeaturesConsistency: <T>(X: T[] | T[][], reference: T[]) => void;
/**
 * Checks that provided X matrix has the same number of features as model matrix
 * @param y_true - matrix to check
 * @param y_pred - matrix to check
 * @throws ValidationError - in case any of the params are empty
 * @throws ValidationError - in case y_true and y_pred are of different shape
 * @ignore
 */
export declare function validateShapesEqual(y_true?: Type1DMatrix<number> | Type2DMatrix<number>, y_pred?: Type1DMatrix<number> | Type2DMatrix<number>): tf.Tensor[];
