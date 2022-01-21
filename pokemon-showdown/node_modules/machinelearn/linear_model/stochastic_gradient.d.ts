import { IMlModel, Type1DMatrix, Type2DMatrix } from '../types';
export declare enum TypeLoss {
    L1 = "L1",
    L2 = "L2",
    L1L2 = "L1L2"
}
/**
 * Type for L1L2 regularizer factors
 */
export interface TypeRegFactor {
    l1?: number;
    l2?: number;
}
/**
 * Ordinary base class for SGD classier or regressor
 * @ignore
 */
export declare class BaseSGD implements IMlModel<number> {
    protected learningRate: number;
    protected epochs: number;
    protected loss: any;
    protected regFactor: TypeRegFactor;
    private clone;
    private weights;
    private randomEngine;
    private randomState;
    /**
     * @param preprocess - preprocess methodology can be either minmax or null. Default is minmax.
     * @param learning_rate - Used to limit the amount each coefficient is corrected each time it is updated.
     * @param epochs - Number of iterations.
     * @param clone - To clone the passed in dataset.
     */
    constructor({ learning_rate, epochs, clone, random_state, loss, reg_factor, }?: {
        learning_rate?: number;
        epochs?: number;
        clone?: boolean;
        random_state?: number;
        loss?: string;
        reg_factor?: TypeRegFactor;
    });
    /**
     * Train the base SGD
     * @param X - Matrix of data
     * @param y - Matrix of targets
     */
    fit(X?: Type2DMatrix<number>, y?: Type1DMatrix<number>): void;
    /**
     * Save the model's checkpoint
     */
    toJSON(): {
        /**
         * model learning rate
         */
        learning_rate: number;
        /**
         * model training epochs
         */
        epochs: number;
        /**
         * Model training weights
         */
        weights: number[];
        /**
         * Number used to set a static random state
         */
        random_state: number;
    };
    /**
     * Restore the model from a checkpoint
     * @param learning_rate - Training learning rate
     * @param epochs - Number of model's training epochs
     * @param weights - Model's training state
     * @param random_state - Static random state for the model initialization
     */
    fromJSON({ learning_rate, epochs, weights, random_state, }?: {
        learning_rate: number;
        epochs: number;
        weights: number[];
        random_state: number;
    }): void;
    /**
     * Predictions according to the passed in test set
     * @param X - Matrix of data
     */
    predict(X?: Type2DMatrix<number>): number[];
    /**
     * Initialize weights based on the number of features
     *
     * @example
     * initializeWeights(3);
     * // this.w = [-0.213981293, 0.12938219, 0.34875439]
     *
     * @param nFeatures
     */
    private initializeWeights;
    /**
     * Adding bias to a given array
     *
     * @example
     * addBias([[1, 2], [3, 4]], 1);
     * // [[1, 1, 2], [1, 3, 4]]
     *
     * @param X
     * @param bias
     */
    private addBias;
    /**
     * SGD based on linear model to calculate coefficient
     * @param X - training data
     * @param y - target data
     */
    private sgd;
}
/**
 * Linear classifiers (SVM, logistic regression, a.o.) with SGD training.
 *
 * This estimator implements regularized linear models with
 * stochastic gradient descent (SGD) learning: the gradient of
 * the loss is estimated each sample at a time and the model is
 * updated along the way with a decreasing strength schedule
 * (aka learning rate). SGD allows minibatch (online/out-of-core)
 * learning, see the partial_fit method. For best results using
 * the default learning rate schedule, the data should have zero mean
 * and unit variance.
 *
 * @example
 * import { SGDClassifier } from 'machinelearn/linear_model';
 * const clf = new SGDClassifier();
 * const X = [[0., 0.], [1., 1.]];
 * const y = [0, 1];
 * clf.fit(X ,y);
 * clf.predict([[2., 2.]]); // result: [ 1 ]
 *
 */
export declare class SGDClassifier extends BaseSGD {
    /**
     * Predicted values with Math.round applied
     * @param X - Matrix of data
     */
    predict(X?: Type2DMatrix<number>): number[];
}
/**
 * Linear model fitted by minimizing a regularized empirical loss with SGD
 * SGD stands for Stochastic Gradient Descent: the gradient of the loss
 * is estimated each sample at a time and the model is updated along
 * the way with a decreasing strength schedule (aka learning rate).
 *
 * @example
 * import { SGDRegressor } from 'machinelearn/linear_model';
 * const reg = new SGDRegressor();
 * const X = [[0., 0.], [1., 1.]];
 * const y = [0, 1];
 * reg.fit(X, y);
 * reg.predict([[2., 2.]]); // result: [ 1.281828588248001 ]
 *
 */
export declare class SGDRegressor extends BaseSGD {
    /**
     * Predicted values
     * @param X - Matrix of data
     */
    predict(X?: Type2DMatrix<number>): number[];
}
