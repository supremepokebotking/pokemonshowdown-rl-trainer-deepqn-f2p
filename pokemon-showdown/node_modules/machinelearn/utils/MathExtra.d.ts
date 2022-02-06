declare const math: {
    covariance: (X: any, xMean: any, y: any, yMean: any) => number;
    euclideanDistance: (v1: number[], v2: number[]) => number;
    genRandomIndex: (upperBound: number) => number;
    generateRandomSubset: (setSize: number, maxSamples: number, bootstrap: boolean, maxSamplesIsFloat?: boolean) => number[];
    generateRandomSubsetOfMatrix: <T>(X: T[][], maxSamples: number, maxFeatures: number, bootstrapSamples: boolean, bootstrapFeatures: boolean, maxSamplesIsFloating?: boolean, maxFeaturesIsFloating?: boolean) => [T[][], number[], number[]];
    hstack: (X: any, y: any) => any[];
    isArrayOf: (arr: any, _type?: string) => boolean;
    inner: (a: any, b: any) => any;
    isMatrix: (matrix: any) => boolean;
    isMatrixOf: (matrix: any, _type?: string) => boolean;
    manhattanDistance: (v1: number[], v2: number[]) => number;
    range: (start: number, stop: number) => number[];
    subset: (X: any, rowsRange: number[], colsRange: number[], replacement?: any) => any[][];
    size: (X: any, axis?: number) => number;
    subtract: (X: any, y: any) => any;
    variance: (X: any, mean: any) => number;
};
export default math;
