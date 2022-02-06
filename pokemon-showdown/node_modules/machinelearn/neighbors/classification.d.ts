import { IMlModel, Type1DMatrix, Type2DMatrix } from '../types';
/**
 * Classifier implementing the k-nearest neighbors vote.
 *
 * @example
 * const knn = new KNeighborsClassifier();
 * const X = [[0, 0, 0], [0, 1, 1], [1, 1, 0], [2, 2, 2], [1, 2, 2], [2, 1, 2]];
 * const y = [0, 0, 0, 1, 1, 1];
 * knn.fit(X ,y);
 * console.log(knn.predict([1, 2])); // predicts 1
 */
export declare class KNeighborsClassifier<T extends number | string | boolean> implements IMlModel<T> {
    private type;
    private tree;
    private k;
    private classes;
    private distance;
    /**
     * @param {string} distance - Choice of distance function, should choose between euclidean | manhattan
     * @param {number} k - Number of neighbors to classify
     * @param {string} type - Type of algorithm to use, choose between kdtree(default) | balltree | simple
     */
    constructor({ distance, k, type, }?: {
        distance: string;
        k: number;
        type: string;
    });
    /**
     * Train the classifier with input and output data
     * @param {any} X - Training data.
     * @param {any} y - Target data.
     */
    fit(X: Type2DMatrix<T>, y: Type1DMatrix<T>): void;
    /**
     * Return the model's state as a JSON object
     * @return {object} JSON KNN model.
     */
    toJSON(): {
        classes: any[];
        distance: any;
        k: number;
        tree: any;
        type: string;
    };
    /**
     * Restores the model from a JSON checkpoint
     * @param {any} classes
     * @param {any} distance
     * @param {any} k
     * @param {any} tree
     * @param {any} type
     */
    fromJSON({ classes, distance, k, tree, type }: {
        classes?: any;
        distance?: any;
        k?: any;
        tree?: any;
        type?: any;
    }): void;
    /**
     * Predict single value from a list of data
     * @param {Array} X - Prediction data.
     * @returns number
     */
    predict(X: Type2DMatrix<T> | Type1DMatrix<T>): any;
    /**
     * Runs a single prediction against an array based on kdTree or balltree or
     * simple algo
     * @param array
     * @returns {{}}
     */
    private getSinglePred;
    /**
     * Get the class with the max point
     * @param current
     * @returns {{}}
     * @ignore
     */
    private getTreeBasedPrediction;
}
