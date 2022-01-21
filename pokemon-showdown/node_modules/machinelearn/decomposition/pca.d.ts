import { IMlModel, Type2DMatrix } from '../types';
/**
 * Principal component analysis (PCA)
 *
 * Linear dimensionality reduction using Singular Value Decomposition of
 * the data to project it to a lower dimensional space.
 *
 * - It uses the LAPACK implementation of the full SVD
 * - or randomized a randomised truncated SVD by the method of
 * Halko et al. 2009, depending on the shape
 * of the input data and the number of components to extract. (Will be implemented)
 *
 * @example
 * import { PCA } from 'machinelearn/decomposition';
 *
 * const pca = new PCA();
 * const X = [[1, 2], [3, 4], [5, 6]];
 * pca.fit(X);
 * console.log(pca.components); // result: [ [ 0.7071067811865476, 0.7071067811865474 ], [ 0.7071067811865474, -0.7071067811865476 ] ]
 * console.log(pca.explained_variance); // result: [ [ -0.3535533905932736, 0 ], [ 0, 0.5 ], [ 0.35355339059327373, 0 ] ]
 */
export declare class PCA implements IMlModel<number> {
    /**
     * Principal axes in feature space, representing the directions of
     * maximum variance in the data. The components are sorted by explained_variance_.
     */
    components: any;
    /**
     * The amount of variance explained by each of the selected components.
     *
     * Equal to n_components largest eigenvalues of the covariance matrix of X.
     */
    explained_variance: any;
    /**
     * Fit the model with X.
     * At the moment it does not take n_components into consideration
     * so it will only calculate Singular value decomposition
     * @param {any} X
     */
    fit(X: Type2DMatrix<number>): void;
    /**
     * Predict does nothing in PCA
     * @param X - A 2D matrix
     */
    predict(X?: Type2DMatrix<number>): number[][];
    /**
     * Saves the model's states
     */
    toJSON(): {
        components: number[][];
        explained_variance: number[][];
    };
    /**
     * Restores the model from given states
     * @param components - Principal axes in feature space, representing the directions of maximum variance in the data.
     * @param explained_variance - The amount of variance explained by each of the selected components.
     */
    fromJSON({ components, explained_variance, }?: {
        components: Type2DMatrix<number>;
        explained_variance: Type2DMatrix<number>;
    }): void;
}
