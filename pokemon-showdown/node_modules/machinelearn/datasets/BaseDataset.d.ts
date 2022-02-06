import 'isomorphic-fetch';
/**
 * @ignore
 */
export declare class BaseDataset {
    /**
     * fetch load from a multiple
     * @param sources - A list of URLs to fetch the data from
     * @param type - type of data; for example CSV or JSON
     * @param delimiter - specify the data delimiter, which will be used to split the row data
     * @param lastIsTarget - tell the underlying processor that the last index of the dataset is the target data
     * @param trainType - data type to enforce on the training dataset
     * @param targetType - target type to enforce on the target dataset
     * @private
     */
    protected fetchLoad(sources?: any[], { type, delimiter, lastIsTarget, trainType, targetType, }?: {
        type?: string;
        delimiter?: string;
        lastIsTarget?: true;
        trainType?: string;
        targetType?: string;
    }): Promise<{
        data: any;
        targets: any;
        labels: any;
    }>;
    /**
     * Load data from the local data folder
     */
    protected fsLoad(type: string, { delimiter, lastIsTarget, trainType, targetType }?: {
        delimiter?: string;
        lastIsTarget?: true;
        trainType?: string;
        targetType?: string;
    }): Promise<{
        data: any;
        targets: any;
        labels: any;
    }>;
    /**
     * Processes CSV type dataset. Returns a training and testing data pair
     * @param data - a raw string data
     * @param delimiter - delimiter to split on
     * @param lastIsTarget - flag to indicate that the last element is the target data
     * @param trainType - training data type to enforce
     * @param targetType - target data type to enforce
     */
    private processCSV;
}
