import 'isomorphic-fetch';
import { BaseDataset } from './BaseDataset';
/**
 * The Iris flower data set or Fisher's Iris data set is a multivariate data set introduced by the British statistician and biologist Ronald Fisher
 * in his 1936 paper The use of multiple measurements in taxonomic problems as an example of linear discriminant analysis.
 *
 * It contains 50 samples with 3 classes of 'Setosa', 'versicolor' and 'virginica'
 *
 * Note: This API is not available on the browsers
 *
 * @example
 * import { Iris } from 'machinelearn/datasets';
 *
 * (async function() {
 *   const irisData = new Iris();
 *   const {
 *     data,         // returns the iris data (X)
 *     targets,      // list of target values (y)
 *     labels,       // list of labels
 *     targetNames,  // list of short target labels
 *     description   // dataset description
 *   } = await irisData.load(); // loads the data internally
 * })();
 *
 */
export declare class Iris extends BaseDataset {
    /**
     * Load datasets
     */
    load(): Promise<{
        /**
         * Training data
         */
        data: any[][];
        /**
         * Target data
         */
        targets: any[];
        /**
         * Real labels
         */
        labels: string[];
        /**
         * Short labels
         */
        targetNames: string[];
        /**
         * Dataset description
         */
        description: string;
    }>;
}
