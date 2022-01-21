import { Type1DMatrix } from '../types';
/**
 * Validator for classification exceptions
 * @param y_true
 * @param y_pred
 * @param labels
 * @param options
 * @ignore
 */
export declare const validateInitialInputs: (y_true: any, y_pred: any, labels: any, options?: {}) => void;
/**
 * Accuracy classification score.
 *
 * In multilabel classification, this function computes subset accuracy:
 * the set of labels predicted for a sample must exactly match the corresponding set of labels in y_true.
 *
 * @example
 * import { accuracyScore } from 'machinelearn/metrics';
 *
 * const accResult = accuracyScore(
 *  [0, 1, 2, 3],
 *  [0, 2, 1, 3]
 * );
 *
 * // accuracy result: 0.5
 *
 * @param y_true - 1d array-like, or label indicator array / sparse matrix
 * @param y_pred - 1d array-like, or label indicator array / sparse matrix
 * @param normalize
 */
export declare function accuracyScore(y_true?: Type1DMatrix<number | string>, y_pred?: Type1DMatrix<number | string>, { normalize, }?: {
    normalize: boolean;
}): number;
/**
 * Zero-one classification loss.
 *
 * If normalize is `true`, return the fraction of misclassifications (float),
 * else it returns the number of misclassifications (int). The best performance is 0.
 *
 * @example
 * import { zeroOneLoss } from 'machinelearn/metrics';
 *
 * const loss_zero_one_result = zeroOneLoss(
 *   [1, 2, 3, 4],
 *   [2, 2, 3, 5]
 * );
 * console.log(loss_zero_one_result); // 0.5
 *
 * @param {any} y_true - Ground truth (correct) labels.
 * @param {any} y_pred - Predicted labels, as returned by a classifier.
 * @param {any} normalize
 * @returns {number}
 */
export declare function zeroOneLoss(y_true?: any, y_pred?: any, { 
/**
 * If False, return the number of misclassifications. Otherwise, return the fraction of misclassifications.
 */
normalize, }?: {
    normalize: boolean;
}): number;
/**
 * A confusion matrix is a technique for summarizing the performance of a classification algorithm.
 *
 * Classification accuracy alone can be misleading if you have an unequal number of observations in each class or if you have more than two classes in your dataset.
 *
 * Calculating a confusion matrix can give you a better idea of what your classification model is getting right and what types of errors it is making.
 *
 * @example
 * import { confusion_matrix } from 'machinelearn/metrics';
 *
 * const matrix1 = confusion_matrix([1, 2, 3], [1, 2, 3]);
 * console.log(matrix1); // [ [ 1, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ] ]
 *
 * const matrix2 = confusion_matrix(
 *   ['cat', 'ant', 'cat', 'cat', 'ant', 'bird'],
 *   ['ant', 'ant', 'cat', 'cat', 'ant', 'cat']
 * );
 * console.log(matrix2); // [ [ 1, 2, 0 ], [ 2, 0, 0 ], [ 0, 1, 0 ] ]
 *
 * @param y_true - Ground truth (correct) target values.
 * @param y_pred - Estimated targets as returned by a classifier.
 * @param labels
 */
export declare function confusion_matrix(y_true?: Type1DMatrix<string | number>, y_pred?: Type1DMatrix<string | number>, { 
/**
 * List of labels to index the matrix. This may be used to reorder or
 * select a subset of labels. If none is given, those that appear
 * at least once in y_true or y_pred are used in sorted order.
 */
labels, }?: {
    labels?: any[];
}): number[];
