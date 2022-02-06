import { Type1DMatrix } from '../types';
/**
 * Encode labels with value between 0 and n_classes-1.
 *
 * @example
 * import { LabelEncoder } from 'machinelearn/preprocessing';
 *
 * const labelEncoder = new LabelEncoder();
 * const labelX = ['amsterdam', 'paris', 'tokyo'];
 * labelEncoder.fit(labelX);
 * const transformX = ['tokyo', 'tokyo', 'paris'];
 * const result = labelEncoder.transform(transformX);
 * // [ 2, 2, 1 ]
 */
export declare class LabelEncoder {
    private classes;
    /**
     * Fit label encoder
     * @param {any[]} X - Input data in array or matrix
     */
    fit(X?: Type1DMatrix<string>): void;
    /**
     * Transform labels to normalized encoding.
     *
     * Given classes of ['amsterdam', 'paris', 'tokyo']
     *
     * It transforms ["tokyo", "tokyo", "paris"]
     *
     * Into [2, 2, 1]
     * @param X - Input data to transform according to the fitted state
     */
    transform(X?: Type1DMatrix<string>): any[];
}
