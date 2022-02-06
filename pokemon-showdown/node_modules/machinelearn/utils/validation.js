"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tf = __importStar(require("@tensorflow/tfjs"));
var _ = __importStar(require("lodash"));
var util_1 = require("util");
var Errors_1 = require("./Errors");
var tensors_1 = require("./tensors");
/**
 * Check below array conditions
 * - multiclass
 *    - e.g. [ [1, 2], [2, 3] ]
 *      Then it sets multiclass value to true
 * - isArray<boolean>
 *   If the given arr is an array then the value is true else false
 * @param arr
 * @returns {any}
 * @ignore
 */
function checkArray(arr) {
    var result = {
        isArray: false,
        multiclass: false,
    };
    // Setting isArray flag
    if (_.isArray(arr)) {
        result = _.set(result, 'isArray', true);
    }
    else {
        result = _.set(result, 'isArray', false);
    }
    // Setting multiclass flag
    var firstElm = _.get(arr, '[0]');
    if (_.isArray(firstElm)) {
        result = _.set(result, 'multiclass', true);
    }
    else {
        result = _.set(result, 'multiclass', false);
    }
    return result;
}
exports.checkArray = checkArray;
/**
 * Validates the input matrix's types with the targetted types.
 * Specified target types must be one of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#Description
 *
 * @example
 * validateMatrixType([['z', 'z']],['string']); // no errors
 * validateMatrixType([['z', 'z']],['test']); // error: Input matrix type of ["string"] does not match with the target types ["test"]
 *
 * @param X - The input matrix
 * @param targetTypes - Target matrix types
 * @ignore
 */
function validateMatrixType(X, targetTypes) {
    var flatX = _.flattenDeep(X);
    var xTypes = _.uniq(flatX.map(function (x) { return typeof x; }));
    var sortedXTypes = _.sortBy(xTypes, function (x) { return x; });
    var sortedTargetTypes = _.sortBy(targetTypes, function (x) { return x; });
    if (!_.isEqual(sortedXTypes, sortedTargetTypes)) {
        throw new Errors_1.ValidationMatrixTypeError("Input matrix type of " + JSON.stringify(sortedXTypes) + " does not match with the target types " + JSON.stringify(sortedTargetTypes));
    }
}
exports.validateMatrixType = validateMatrixType;
/**
 * Check that X and y have the same size across the first axis
 *
 * @example
 * validateTrainInputs([ [1, 2], [3, 4] ], [ 1, 2 ]) // No errors
 * validateTrainInputs([ [[1, 2], [3, 3]], [[1, 2], [3, 3]] ], [ 1, 2 ]) // Error: The matrix is not 1D shaped: [ [[1, 2], [3, 3]], [[1, 2], [3, 3]] ] of [2, 2, 2]
 *
 * @param X
 * @param y
 * @ignore
 */
function validateFitInputs(X, y) {
    if (!Array.isArray(X)) {
        throw new Errors_1.ValidationError('validateFitInputs received a non-array input X');
    }
    if (!Array.isArray(y)) {
        throw new Errors_1.ValidationError('validateFitInputs received a non-array input y');
    }
    // Check X is always a matrix
    var sampleShape = tensors_1.inferShape(X);
    // Check y is always a vector
    var targetShape = tensors_1.inferShape(y);
    if (sampleShape[0] !== targetShape[0]) {
        throw new Errors_1.ValidationClassMismatch("Number of labels=" + targetShape[0] + " does not math number of samples=" + sampleShape[0]);
    }
}
exports.validateFitInputs = validateFitInputs;
/**
 * Validate the matrix is 1D shaped by checking the shape's length is exactly  1
 * @param X
 * @ignore
 */
function validateMatrix1D(X) {
    if (!util_1.isArray(X)) {
        throw new Errors_1.ValidationError('validateMatrix1D has received a non-array argument');
    }
    var shape = tensors_1.inferShape(X);
    if (shape.length !== 1 || shape[0] === 0) {
        throw new Errors_1.Validation1DMatrixError("The matrix is not 1D shaped: " + JSON.stringify(X) + " of " + JSON.stringify(shape));
    }
    return X;
}
exports.validateMatrix1D = validateMatrix1D;
/**
 * Validate the matrix is 2D shaped by checking the shape's length is exactly 2
 * @param X - An input array
 * @ignore
 */
function validateMatrix2D(X) {
    if (!Array.isArray(X)) {
        throw new Errors_1.ValidationError('validateMatrix2D has received a non-array argument');
    }
    var shape = tensors_1.inferShape(X);
    if (shape.length !== 2) {
        throw new Errors_1.Validation2DMatrixError("The matrix is not 2D shaped: " + JSON.stringify(X) + " of " + JSON.stringify(shape));
    }
    return X;
}
exports.validateMatrix2D = validateMatrix2D;
/**
 * Checks that provided X matrix has the same number of features as model matrix
 * @param X - matrix to check
 * @param reference - reference matrix
 * @throws ValidationError - in case number of features doesn't match
 * @ignore
 */
exports.validateFeaturesConsistency = function (X, reference) {
    var xShape = tensors_1.inferShape(X);
    var referenceShape = tensors_1.inferShape(reference);
    var xNumFeatures = xShape.length === 1 ? 1 : xShape[1];
    var referenceNumFeatures = referenceShape[0];
    if (xNumFeatures !== referenceNumFeatures) {
        throw new Errors_1.ValidationError("Provided X has incorrect number of features. Should have: " + referenceNumFeatures + ", got: " + xNumFeatures);
    }
};
/**
 * Checks that provided X matrix has the same number of features as model matrix
 * @param y_true - matrix to check
 * @param y_pred - matrix to check
 * @throws ValidationError - in case any of the params are empty
 * @throws ValidationError - in case y_true and y_pred are of different shape
 * @ignore
 */
function validateShapesEqual(y_true, y_pred) {
    if (y_true === void 0) { y_true = null; }
    if (y_pred === void 0) { y_pred = null; }
    var yTrueTensor = tf.tensor(y_true);
    var yPredTensor = tf.tensor(y_pred);
    var yTrueShape = yTrueTensor.shape;
    var yPredShape = yPredTensor.shape;
    // Validation 1: empty array check
    if (yTrueShape[0] === 0 || yPredShape[0] === 0) {
        throw new Errors_1.ValidationError("y_true " + JSON.stringify(y_true) + " and y_pred " + JSON.stringify(y_pred) + " cannot be empty");
    }
    // Validation 2: Same shape
    if (!_.isEqual(yTrueShape, yPredShape)) {
        throw new Errors_1.ValidationError("Shapes of y_true " + JSON.stringify(yTrueShape) + " and y_pred " + JSON.stringify(yPredShape) + " should be equal");
    }
    return [yTrueTensor, yPredTensor];
}
exports.validateShapesEqual = validateShapesEqual;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbHMvdmFsaWRhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxtREFBdUM7QUFDdkMsd0NBQTRCO0FBQzVCLDZCQUErQjtBQUUvQixtQ0FNa0I7QUFDbEIscUNBQXVDO0FBRXZDOzs7Ozs7Ozs7O0dBVUc7QUFDSCxTQUFnQixVQUFVLENBQ3hCLEdBQVk7SUFLWixJQUFJLE1BQU0sR0FBRztRQUNYLE9BQU8sRUFBRSxLQUFLO1FBQ2QsVUFBVSxFQUFFLEtBQUs7S0FDbEIsQ0FBQztJQUVGLHVCQUF1QjtJQUN2QixJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbEIsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN6QztTQUFNO1FBQ0wsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUMxQztJQUVELDBCQUEwQjtJQUMxQixJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDdkIsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM1QztTQUFNO1FBQ0wsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM3QztJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUEzQkQsZ0NBMkJDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FB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