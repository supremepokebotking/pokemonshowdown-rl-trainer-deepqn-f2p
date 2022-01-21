import { IMlModel, Type1DMatrix, Type2DMatrix } from '../types';
export interface KMeansOptions {
    k: number;
    distance?: 'euclidean' | 'manhattan';
    maxIteration?: number;
    randomState?: number;
}
/**
 * K-Means clustering
 *
 * @example
 * import { KMeans } from 'machinelearn/cluster';
 *
 * const kmean = new KMeans({ k: 2 });
 * const clusters = kmean.fit([[1, 2], [1, 4], [1, 0], [4, 2], [4, 4], [4, 0]]);
 *
 * const result = kmean.predict([[0, 0], [4, 4]]);
 * // results in: [0, 1]
 */
export declare class KMeans implements IMlModel<number> {
    private assignment;
    private centroids;
    private clusters;
    private distance;
    private k;
    private randomState;
    private maxIteration;
    /**
     *
     * @param distance - Choice of distance method. Defaulting to euclidean
     * @param k - Number of clusters
     * @param maxIteration - Relative tolerance with regards to inertia to declare convergence
     * @param randomState - Random state value for sorting centroids during the getInitialCentroid phase
     */
    constructor({ distance, k, maxIteration, randomState }?: KMeansOptions);
    /**
     * Compute k-means clustering.
     * @param {any} X - array-like or sparse matrix of shape = [n_samples, n_features]
     * @returns {{centroids: number[]; clusters: number[]}}
     */
    fit(X?: Type2DMatrix<number>): void;
    /**
     * Predicts the cluster index with the given X
     * @param {any} X - array-like or sparse matrix of shape = [n_samples, n_features]
     * @returns {number[]}
     */
    predict(X?: Type2DMatrix<number>): number[];
    /**
     * Get the model details in JSON format
     * @returns {{k: number; clusters: number[]; centroids: number[]}}
     */
    toJSON(): {
        k: number;
        clusters: Type1DMatrix<number>;
        centroids: Type2DMatrix<number>;
    };
    /**
     * Restores the model from checkpoints
     * @param {number} k
     * @param {number[]} clusters
     * @param {number[]} centroids
     */
    fromJSON({ k, clusters, centroids, }: {
        k: number;
        clusters: Type1DMatrix<number>;
        centroids: Type2DMatrix<number>;
    }): void;
    /**
     * Get initial centroids from X of k
     * @param {number[]} X
     * @param {number} k
     * @returns {number[]}
     */
    private getInitialCentroids;
    /**
     * Get closest centroids based on the passed in distance method
     * @param {number[]} data
     * @param {number[]} centroids
     * @param distance
     * @returns {number}
     */
    private getClosestCentroids;
}
