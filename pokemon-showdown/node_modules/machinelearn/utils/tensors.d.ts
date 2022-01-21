import { TypeMatrix } from '../types';
/**
 * Infers shape of a tensor using TF
 *
 * @example
 * inferShape(1) // exception
 * inferShape(true) // exception
 * inferShape([1, 2]) // [2]
 * inferShape([[1, 2], [3, 4]]) // [2, 2]
 *
 * @param X
 * @ignore
 */
export declare function inferShape(X: TypeMatrix<any>): number[];
/**
 * Reshapes any size of array into a new shape.
 *
 * The code was borrowed from math.js (https://github.com/josdejong/mathjs/blob/5750a1845442946d236822505c607a522be23474/src/utils/array.js#L258),
 * which enables us to use a specific method from Math.js instead of installing an entire library.
 *
 * TF.js has implemented an efficient way to return raw values from its Tensor implementation that always returns a 1D array,
 * which is not ideal in situations where we need a return value with correct shapes.
 *
 * Please check out https://github.com/tensorflow/tfjs/issues/939 for more information
 *
 * @example
 * reshape([1, 2, 3, 4, 5, 6], [2, 3]); // [[1, 2, 3], [4, 5, 6]]
 * reshape([1, 2, 3, 4, 5, 6], [2, 3, 1]); // [[[1], [2], [3]], [[4], [5], [6]]]
 *
 * @param array - Target array
 * @param sizes - New array shape to resize into
 * @ignore
 */
export declare function reshape<T>(array: TypeMatrix<T>, sizes: number[]): TypeMatrix<T>;
/**
 * Ensures that matrix passed in is two dimensional
 * If passed a one dimensional matrix, transforms it into a two dimensional matrix by turning each element into a row with 1 element
 * If passed a two dimensional matrix, does nothing
 * @param X - target matrix
 * @ignore
 */
export declare const ensure2DMatrix: (X: number[] | number[][]) => number[][];
