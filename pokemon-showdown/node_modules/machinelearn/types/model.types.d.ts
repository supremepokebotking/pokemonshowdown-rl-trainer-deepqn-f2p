import { Type1DMatrix, Type2DMatrix } from './matrix.types';
/**
 * Base typing for ModelState. The typing ensures that model state can only have string, number, number[], string[]
 * or ModelState itself for recursive object typing
 */
export interface TypeModelState {
    [key: string]: any;
}
/**
 * Base type definition for all the models
 * @ignore
 */
export declare abstract class IMlModel<T> {
    /**
     * Fit data to build model
     */
    abstract fit(X: Type2DMatrix<T | number>, y?: Type1DMatrix<T>): void;
    /**
     * Predict multiple rows. Each row has a feature data for a prediction
     */
    abstract predict(X: Type2DMatrix<T | number> | Type1DMatrix<T>): T[] | T[][];
    /**
     * Restores model from a checkpoint
     */
    abstract fromJSON(state: TypeModelState): void;
    /**
     * Returns a model checkpoint
     */
    abstract toJSON(): TypeModelState;
}
