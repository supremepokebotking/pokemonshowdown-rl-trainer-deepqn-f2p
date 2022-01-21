import { Type1DMatrix, Type2DMatrix } from '../types';
/**
 * K-Folds cross-validator
 *
 * Provides train/test indices to split data in train/test sets. Split dataset into k consecutive folds (without shuffling by default).
 *
 * Each fold is then used once as a validation while the k - 1 remaining folds form the training set.
 *
 * @example
 * import { KFold } from 'machinelearn/model_selection';
 *
 * const kFold = new KFold({ k: 5 });
 * const X1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
 * console.log(kFold.split(X1, X1));
 *
 * /* [ { trainIndex: [ 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ],
 * *  testIndex: [ 0, 1, 2, 3 ] },
 * * { trainIndex: [ 0, 1, 2, 3, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ],
 * *  testIndex: [ 4, 5, 6, 7 ] },
 * * { trainIndex: [ 0, 1, 2, 3, 4, 5, 6, 7, 12, 13, 14, 15, 16, 17, 18, 19 ],
 * *  testIndex: [ 8, 9, 10, 11 ] },
 * * { trainIndex: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 16, 17, 18, 19 ],
 * *  testIndex: [ 12, 13, 14, 15 ] },
 * * { trainIndex: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
 * *  testIndex: [ 16, 17, 18, 19 ] } ]
 *
 */
export declare class KFold {
    private k;
    private shuffle;
    /**
     *
     * @param {any} k - Number of folds. Must be at least 2.
     * @param {any} shuffle - Whether to shuffle the data before splitting into batches.
     */
    constructor({ k, shuffle }: {
        k?: number;
        shuffle?: boolean;
    });
    /**
     *
     * @param X - Training data, where n_samples is the number of samples and n_features is the number of features.
     * @param y - The target variable for supervised learning problems.
     * @returns {any[]}
     */
    split(X?: Type1DMatrix<any>, y?: Type1DMatrix<any>): any[];
}
/**
 * Split arrays or matrices into random train and test subsets
 *
 * @example
 * import { train_test_split } from 'machinelearn/model_selection';
 *
 * const X = [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]];
 * const y = [0, 1, 2, 3, 4];
 *
 * train_test_split(X, y, {
 *   test_size: 0.33,
 *   train_size: 0.67,
 *   random_state: 42
 * });
 *
 * /*
 * * { xTest: [ [ 0, 1 ], [ 8, 9 ] ],
 * *  xTrain: [ [ 4, 5 ], [ 6, 7 ], [ 2, 3 ] ],
 * *  yTest: [ 0, 4 ],
 * *  yTrain: [ 2, 3, 1 ] }
 *
 * @param {any} X - input data
 * @param {any} y - target data
 * @param {number} test_size - size of the returning test set
 * @param {number} train_size - size of the returning training set
 * @param {number} random_state - state used to shuffle data
 * @param {boolean} clone - to clone the original data
 * @returns {{xTest: any[]; xTrain: any[]; yTest: any[]; yTrain: any[]}}
 */
export declare function train_test_split(X?: Type2DMatrix<any>, y?: Type1DMatrix<any>, { test_size, train_size, random_state, clone, }?: {
    test_size?: number;
    train_size?: number;
    random_state?: number;
    clone?: boolean;
}): {
    xTest: any[];
    xTrain: any[];
    yTest: any[];
    yTrain: any[];
};
