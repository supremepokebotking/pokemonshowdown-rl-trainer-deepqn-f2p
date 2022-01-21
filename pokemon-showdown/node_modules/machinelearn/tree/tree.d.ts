import { IMlModel, Type1DMatrix, Type2DMatrix } from '../types';
/**
 * Question used by decision tree algorithm to determine whether to split branch or not
 * @ignore
 */
export declare class Question {
    private features;
    private column;
    private value;
    constructor(features: any, column: any, value: any);
    match(example: any): boolean;
    toString(): string;
}
/**
 * According to the given targets array, count occurrences into an object.
 * @param {any[]} targets - list of class: count
 * @returns {}
 * @ignore
 */
export declare function classCounts(targets: any[]): {};
/**
 * A leaf node that classifies data.
 * @ignore
 */
export declare class Leaf {
    prediction: any;
    constructor(y: any);
}
/**
 * It holds a reference to the question, and to the two children nodes
 * @ignore
 */
export declare class DecisionNode {
    question: any;
    trueBranch: any;
    falseBranch: any;
    constructor(question: any, trueBranch: any, falseBranch: any);
}
export interface Options {
    featureLabels?: null | any[];
    verbose?: boolean;
}
/**
 * A decision tree classifier.
 *
 * @example
 * import { DecisionTreeClassifier } from 'machinelearn/tree';
 * const features = ['color', 'diameter', 'label'];
 * const decision = new DecisionTreeClassifier({ featureLabels: features });
 *
 * const X = [['Green', 3], ['Yellow', 3], ['Red', 1], ['Red', 1], ['Yellow', 3]];
 * const y = ['Apple', 'Apple', 'Grape', 'Grape', 'Lemon'];
 * decision.fit({ X, y });
 * decision.printTree(); // try it out yourself! =)
 *
 * decision.predict({ X: [['Green', 3]] }); // [ 'Apple' ]
 * decision.predict({ X }); // [ [ 'Apple' ], [ 'Apple', 'Lemon' ], [ 'Grape', 'Grape' ], [ 'Grape', 'Grape' ], [ 'Apple', 'Lemon' ] ]
 *
 * @example
 * import { DecisionTreeClassifier } from 'machinelearn/tree';
 * const decision = new DecisionTreeClassifier({ featureLabels: null });
 *
 * const X = [[0, 0], [1, 1]];
 * const Y = [0, 1];
 * decision.fit({ X, y });
 * decision2.predict({ row: [[2, 2]] }); // [ 1 ]
 */
export declare class DecisionTreeClassifier implements IMlModel<string | boolean | number> {
    private featureLabels;
    private tree;
    private verbose;
    private randomState;
    private randomEngine;
    /**
     *
     * @param featureLabels - Literal names for each feature to be used while printing the tree out as a string
     * @param verbose - Logs the progress of the tree construction as console.info
     * @param random_state - A seed value for the random engine
     */
    constructor({ featureLabels, verbose, random_state, }?: {
        featureLabels?: any[];
        verbose?: boolean;
        random_state?: number;
    });
    /**
     * Fit date, which builds a tree
     * @param {any} X - 2D Matrix of training
     * @param {any} y - 1D Vector of target
     * @returns {Leaf | DecisionNode}
     */
    fit(X?: Type2DMatrix<string | number | boolean>, y?: Type1DMatrix<string | number | boolean>): void;
    /**
     * Predict multiple rows
     *
     * @param X - 2D Matrix of testing data
     */
    predict(X?: Type2DMatrix<string | boolean | number>): any[];
    /**
     * Returns the model checkpoint
     * @returns {{featureLabels: string[]; tree: any; verbose: boolean}}
     */
    toJSON(): {
        /**
         * Literal names for each feature to be used while printing the tree out as a string
         */
        featureLabels: string[];
        /**
         * The model's state
         */
        tree: any;
        /**
         * Logs the progress of the tree construction as console.info
         */
        verbose: boolean;
        /**
         * A seed value for the random engine
         */
        random_state: number;
    };
    /**
     * Restores the model from a checkpoint
     * @param {string[]} featureLabels - Literal names for each feature to be used while printing the tree out as a string
     * @param {any} tree - The model's state
     * @param {boolean} verbose - Logs the progress of the tree construction as console.info
     * @param {number} random_state - A seed value for the random engine
     */
    fromJSON({ featureLabels, tree, verbose, random_state, }: {
        featureLabels: string[];
        tree: any;
        verbose: boolean;
        random_state: number;
    }): void;
    /**
     * Recursively print the tree into console
     * @param {string} spacing - Spacing used when printing the tree into the terminal
     */
    printTree(spacing?: string): void;
    /**
     * Partition X and y into true and false branches
     * @param X
     * @param y
     * @param {Question} question
     * @returns {{trueX: Array<any>; trueY: Array<any>; falseX: Array<any>; falseY: Array<any>}}
     */
    private partition;
    /**
     * Calculate the gini impurity of rows
     * Checkout: https://en.wikipedia.org/wiki/Decision_tree_learning#Gini_impurity
     * @param targets
     * @returns {number}
     */
    private gini;
    /**
     * Information Gain.
     *
     * The uncertainty of the starting node, minus the weighted impurity of
     * two child nodes.
     * @param left
     * @param right
     * @param uncertainty
     * @returns {number}
     */
    private infoGain;
    /**
     * Find the best split for the current X and y.
     * @param X
     * @param y
     * @returns {{bestGain: number; bestQuestion: any}}
     */
    private findBestSplit;
    /**
     * Interactively build tree until it reaches the terminal nodes
     * @param {any} X
     * @param {any} y
     * @returns {any}
     */
    private buildTree;
    /**
     * Internal predict method separated out for recursion purpose
     * @param {any} row
     * @param {any} node
     * @returns {any}
     * @private
     */
    private _predict;
    /**
     * Private method for printing tree; required for recursion
     * @param {any} node
     * @param {any} spacing
     */
    private _printTree;
}
