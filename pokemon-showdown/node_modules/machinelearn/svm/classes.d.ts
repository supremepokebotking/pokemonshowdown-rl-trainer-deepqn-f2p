import { SVM } from 'libsvm-ts';
import { IMlModel, Type1DMatrix, Type2DMatrix } from '../types';
/**
 * Options used by sub classes
 * Notice type is disabled as they are set statically from children classes.
 */
export interface SVMOptions {
    /**
     * Degree of polynomial, test for polynomial kernel
     */
    degree?: number;
    /**
     * Type of Kernel
     */
    kernel?: string;
    /**
     * Type of SVM
     */
    type?: string;
    /**
     * Gamma parameter of the RBF, Polynomial and Sigmoid kernels. Default value is 1/num_features
     */
    gamma?: number | null;
    /**
     * coef0 parameter for Polynomial and Sigmoid kernels
     */
    coef0?: number;
    /**
     * Cost parameter, for C SVC, Epsilon SVR and NU SVR
     */
    cost?: number;
    /**
     * For NU SVC and NU SVR
     */
    nu?: number;
    /**
     * For epsilon SVR
     */
    epsilon?: number;
    /**
     * Cache size in MB
     */
    cacheSize?: number;
    /**
     * Tolerance
     */
    tolerance?: number;
    /**
     * Use shrinking euristics (faster)
     */
    shrinking?: boolean;
    /**
     * weather to train SVC/SVR model for probability estimates,
     */
    probabilityEstimates?: boolean;
    /**
     * Set weight for each possible class
     */
    weight?: {
        [n: number]: number;
    };
    /**
     * Print info during training if false (aka verbose)
     */
    quiet?: boolean;
}
/**
 * BaseSVM class used by all parent SVM classes that are based on libsvm.
 * You may still use this to use the underlying libsvm-ts more flexibly.
 *
 * Note: This API is not available on the browsers
 */
export declare class BaseSVM implements IMlModel<number> {
    protected svm: SVM;
    protected options: SVMOptions;
    constructor(options?: SVMOptions);
    /**
     * Loads a WASM version of SVM. The method returns the instance of itself as a promise result.
     */
    loadWASM(): Promise<BaseSVM>;
    /**
     * Loads a ASM version of SVM. The method returns the instance of itself as a promise result.
     */
    loadASM(): Promise<BaseSVM>;
    /**
     * Fit the model according to the given training data.
     * @param {number[][]} X
     * @param {number[]} y
     * @returns {Promise<void>}
     */
    fit(X: Type2DMatrix<number>, y: Type1DMatrix<number>): void;
    /**
     * Predict using the linear model
     * @param {number[][]} X
     * @returns {number[]}
     */
    predict(X: Type2DMatrix<number>): number[];
    /**
     * Predict the label of one sample.
     * @param {number[]} X
     * @returns {number}
     */
    predictOne(X: Type1DMatrix<number>): number;
    /**
     * Saves the current SVM as a JSON object
     * @returns {{svm: SVM; options: SVMOptions}}
     */
    toJSON(): {
        svm: SVM;
        options: SVMOptions;
    };
    /**
     * Restores the model from a JSON checkpoint
     * @param {SVM} svm
     * @param {any} options
     */
    fromJSON({ svm, options }: {
        svm?: any;
        options?: any;
    }): void;
}
/**
 * C-Support Vector Classification.
 *
 * The implementation is based on libsvm. The fit time complexity is more than
 * quadratic with the number of samples which makes it hard to scale to dataset
 * with more than a couple of 10000 samples.
 *
 * The multiclass support is handled according to a one-vs-one scheme.
 *
 * For details on the precise mathematical formulation of the provided kernel
 * functions and how gamma, coef0 and degree affect each other, see the corresponding
 * section in the narrative documentation: Kernel functions.
 *
 * Note: This API is not available on the browsers
 *
 * @example
 * import { SVC } from 'machinelearn/svm';
 *
 * const svm = new SVC();
 * svm.loadASM().then((loadedSVM) => {
 *   loadedSVM.fit([[0, 0], [1, 1]], [0, 1]);
 *   loadedSVM.predict([[1, 1]]);   // [1]
 * });
 */
export declare class SVC extends BaseSVM {
    constructor(options?: SVMOptions);
}
/**
 * Linear Support Vector Regression.
 *
 * Similar to SVR with parameter kernel=’linear’, but implemented in terms of
 * liblinear rather than libsvm, so it has more flexibility in the choice of
 * penalties and loss functions and should scale better to large numbers of samples.
 *
 * This class supports both dense and sparse input.
 *
 * Note: This API is not available on the browsers
 *
 * @example
 * import { SVR } from 'machinelearn/svm';
 *
 * const svm = new SVR();
 * svm.loadASM().then((loadedSVM) => {
 *   loadedSVM.fit([[0, 0], [1, 1]], [0, 1]);
 *   loadedSVM.predict([[1, 1]]);   // [0.9000000057898799]
 * });
 */
export declare class SVR extends BaseSVM {
    constructor(options?: SVMOptions);
}
/**
 * Unsupervised Outlier Detection.
 *
 * Estimate the support of a high-dimensional distribution.
 *
 * The implementation is based on libsvm.
 *
 * Note: This API is not available on the browsers
 *
 * @example
 * import { OneClassSVM } from 'machinelearn/svm';
 *
 * const svm = new OneClassSVM();
 * svm.loadASM().then((loadedSVM) => {
 *   loadedSVM.fit([[0, 0], [1, 1]], [0, 1]);
 *   loadedSVM.predict([[1, 1]]);   // [-1]
 * });
 */
export declare class OneClassSVM extends BaseSVM {
    constructor(options?: SVMOptions);
}
/**
 * Nu-Support Vector Classification.
 *
 * Similar to SVC but uses a parameter to control the number of support vectors.
 *
 * The implementation is based on libsvm.
 *
 * Note: This API is not available on the browsers
 *
 * @example
 * import { NuSVC } from 'machinelearn/svm';
 *
 * const svm = new NuSVC();
 * svm.loadASM().then((loadedSVM) => {
 *   loadedSVM.fit([[0, 0], [1, 1]], [0, 1]);
 *   loadedSVM.predict([[1, 1]]);   // [1]
 * });
 */
export declare class NuSVC extends BaseSVM {
    constructor(options?: SVMOptions);
}
/**
 * Nu Support Vector Regression.
 *
 * Similar to NuSVC, for regression, uses a parameter nu to control the number
 * of support vectors. However, unlike NuSVC, where nu replaces C, here nu
 * replaces the parameter epsilon of epsilon-SVR.
 *
 * The implementation is based on libsvm.
 *
 * Note: This API is not available on the browsers
 *
 * @example
 * import { NuSVR } from 'machinelearn/svm';
 *
 * const svm = new NuSVR();
 * svm.loadASM().then((loadedSVM) => {
 *   loadedSVM.fit([[0, 0], [1, 1]], [0, 1]);
 *   loadedSVM.predict([[1, 1]]);   // [0.9000000057898799]
 * });
 */
export declare class NuSVR extends BaseSVM {
    constructor(options?: SVMOptions);
}
