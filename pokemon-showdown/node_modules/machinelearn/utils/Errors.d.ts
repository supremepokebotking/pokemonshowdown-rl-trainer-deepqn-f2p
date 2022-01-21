/**
 * The error is used for class initiation failures due to invalid arguments.
 * @ignore
 */
export declare const ConstructionError: (message: any) => void;
/**
 * The error is used for any validation errors. Such as an argument type check failure would raise this error.
 * @ignore
 */
export declare const ValidationError: (message: any) => void;
/**
 * @ignore
 */
export declare const Validation1DMatrixError: (message: any) => void;
/**
 * @ignore
 */
export declare const Validation2DMatrixError: (message: any) => void;
/**
 * The error is used when a matrix does not contain a consistent type for its elements
 * @ignore
 */
export declare const ValidationMatrixTypeError: (message: any) => void;
/**
 * @ignore
 */
export declare const ValidationClassMismatch: (message: any) => void;
/**
 * @ignore
 */
export declare const ValidationKeyNotFoundError: (message: any) => void;
/**
 * @ignore
 */
export declare const ValidationInconsistentShape: (message: any) => void;
