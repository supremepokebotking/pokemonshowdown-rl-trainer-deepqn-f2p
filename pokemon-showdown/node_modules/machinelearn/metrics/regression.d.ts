import { Type1DMatrix, Type2DMatrix } from '../types';
/**
 * Mean absolute error regression loss
 *
 * @example
 * import { mean_absolute_error } from 'machinelearn/metrics';
 * const y_true = [3, -0.5, 2, 7]
 * const y_pred = [2.5, 0.0, 2, 8]
 * mean_absolute_error(y_true, y_pred); // 0.5
 *
 * @param y_true - Ground truth (correct) target values.
 * @param y_pred - Estimated target values.
 * @param sample_weight - Sample weights.
 */
export declare function mean_absolute_error(y_true?: Type1DMatrix<number> | Type2DMatrix<number>, y_pred?: Type1DMatrix<number> | Type2DMatrix<number>, { sample_weight, }?: {
    sample_weight: Type1DMatrix<number>;
}): number;
/**
 * Mean squared error regression loss
 *
 * @example
 * import { mean_squared_error } from 'machinelearn/metrics';
 *
 * const y_true = [3, -0.5, 2, 7];
 * const y_pred = [2.5, 0.0, 2, 8];
 *
 * console.log(mean_squared_error(y_true, y_pred));
 * // result: 0.375
 *
 * const y_true1 = [[0.5, 1], [-1, 1], [7, -6]];
 * const y_pred1 = [[0, 2], [-1, 2], [8, -5]];
 *
 * console.log(mean_squared_error(y_true1, y_pred1));
 * // result: 0.7083333134651184
 *
 * @param y_true - Ground truth (correct) target values.
 * @param y_pred - Estimated target values.
 */
export declare function mean_squared_error(y_true?: Type1DMatrix<number> | Type2DMatrix<number>, y_pred?: Type1DMatrix<number> | Type2DMatrix<number>, { 
/**
 * Sample weights.
 */
sample_weight, }?: {
    sample_weight: number;
}): number;
/**
 * Mean squared error regression loss
 *
 * @example
 * import { mean_squared_log_error } from 'machinelearn/metrics';
 *
 * const y_true = [3, 0.5, 2, 7];
 * const y_pred = [2.5, 0.0, 2, 8];
 *
 * console.log(mean_squared_error(y_true, y_pred));
 * // result: 0.04902636259794235
 *
 * const y_true1 = [[0.5, 1], [1, 1], [7, 6]];
 * const y_pred1 = [[0, 2], [1, 2], [8, 5]];
 *
 * console.log(mean_squared_error(y_true1, y_pred1));
 * // result: 0.08847352117300034
 *
 * @param y_true - Ground truth (correct) target values(should be positive).
 * @param y_pred - Estimated target values(should be positive).
 */
export declare function mean_squared_log_error(y_true?: Type1DMatrix<number> | Type2DMatrix<number>, y_pred?: Type1DMatrix<number> | Type2DMatrix<number>, { 
/**
 * Sample weights.
 */
sample_weight, }?: {
    sample_weight: number;
}): number;
