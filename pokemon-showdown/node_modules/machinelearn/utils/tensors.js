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
var Errors_1 = require("./Errors");
var validation_1 = require("./validation");
/**
 * Infers shape of a tensor using TF
 *
 * @example
 * inferShape(1) // exception
 * inferShape(true) // exception
 * inferShape([1, 2]) // [2]
 * inferShape([[1, 2], [3, 4]]) // [2, 2]
 *
 * @param X
 * @ignore
 */
function inferShape(X) {
    try {
        return tf.tensor(X).shape;
    }
    catch (e) {
        throw new Errors_1.ValidationInconsistentShape(e);
    }
}
exports.inferShape = inferShape;
/**
 * Reshapes any size of array into a new shape.
 *
 * The code was borrowed from math.js (https://github.com/josdejong/mathjs/blob/5750a1845442946d236822505c607a522be23474/src/utils/array.js#L258),
 * which enables us to use a specific method from Math.js instead of installing an entire library.
 *
 * TF.js has implemented an efficient way to return raw values from its Tensor implementation that always returns a 1D array,
 * which is not ideal in situations where we need a return value with correct shapes.
 *
 * Please check out https://github.com/tensorflow/tfjs/issues/939 for more information
 *
 * @example
 * reshape([1, 2, 3, 4, 5, 6], [2, 3]); // [[1, 2, 3], [4, 5, 6]]
 * reshape([1, 2, 3, 4, 5, 6], [2, 3, 1]); // [[[1], [2], [3]], [[4], [5], [6]]]
 *
 * @param array - Target array
 * @param sizes - New array shape to resize into
 * @ignore
 */
function reshape(array, sizes) {
    // Initial validations
    if (!Array.isArray(array)) {
        throw new Errors_1.ValidationError('The input array must be an array!');
    }
    if (!Array.isArray(sizes)) {
        throw new Errors_1.ValidationError('The sizes must be an array!');
    }
    var deepFlatArray = _.flattenDeep(array);
    // If the reshaping is to single dimensional
    if (sizes.length === 1 && deepFlatArray.length === sizes[0]) {
        return deepFlatArray;
    }
    else if (sizes.length === 1 && deepFlatArray.length !== sizes[0]) {
        throw new Errors_1.ValidationError("Target array shape [" + deepFlatArray.length + "] cannot be reshaped into " + sizes);
    }
    // testing if there are enough elements for the requested shape
    var tmpArray = deepFlatArray;
    var tmpArray2;
    // for each dimensions starting by the last one and ignoring the first one
    for (var sizeIndex = sizes.length - 1; sizeIndex > 0; sizeIndex--) {
        var size = sizes[sizeIndex];
        tmpArray2 = [];
        // aggregate the elements of the current tmpArray in elements of the requested size
        var length_1 = tmpArray.length / size;
        for (var i = 0; i < length_1; i++) {
            tmpArray2.push(tmpArray.slice(i * size, (i + 1) * size));
        }
        // set it as the new tmpArray for the next loop turn or for return
        tmpArray = tmpArray2;
    }
    return tmpArray;
}
exports.reshape = reshape;
/**
 * Ensures that matrix passed in is two dimensional
 * If passed a one dimensional matrix, transforms it into a two dimensional matrix by turning each element into a row with 1 element
 * If passed a two dimensional matrix, does nothing
 * @param X - target matrix
 * @ignore
 */
exports.ensure2DMatrix = function (X) {
    var shape = inferShape(X);
    if (shape.length === 2) {
        return validation_1.validateMatrix2D(X);
    }
    var matrix1D = validation_1.validateMatrix1D(X);
    return _.map(matrix1D, function (o) { return [o]; });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuc29ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbHMvdGVuc29ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxtREFBdUM7QUFDdkMsd0NBQTRCO0FBRTVCLG1DQUF3RTtBQUN4RSwyQ0FBa0U7QUFFbEU7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxTQUFnQixVQUFVLENBQUMsQ0FBa0I7SUFDM0MsSUFBSTtRQUNGLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7S0FDM0I7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE1BQU0sSUFBSSxvQ0FBMkIsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMxQztBQUNILENBQUM7QUFORCxnQ0FNQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFDSCxTQUFnQixPQUFPLENBQUksS0FBb0IsRUFBRSxLQUFlO0lBQzlELHNCQUFzQjtJQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN6QixNQUFNLElBQUksd0JBQWUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0tBQ2hFO0lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDekIsTUFBTSxJQUFJLHdCQUFlLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUMxRDtJQUVELElBQU0sYUFBYSxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUksS0FBSyxDQUFDLENBQUM7SUFDOUMsNENBQTRDO0lBQzVDLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDM0QsT0FBTyxhQUFhLENBQUM7S0FDdEI7U0FBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2xFLE1BQU0sSUFBSSx3QkFBZSxDQUFDLHlCQUF1QixhQUFhLENBQUMsTUFBTSxrQ0FBNkIsS0FBTyxDQUFDLENBQUM7S0FDNUc7SUFFRCwrREFBK0Q7SUFDL0QsSUFBSSxRQUFRLEdBQUcsYUFBYSxDQUFDO0lBQzdCLElBQUksU0FBUyxDQUFDO0lBQ2QsMEVBQTBFO0lBQzFFLEtBQUssSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRTtRQUNqRSxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFOUIsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUVmLG1GQUFtRjtRQUNuRixJQUFNLFFBQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUN0QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9CLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDMUQ7UUFDRCxrRUFBa0U7UUFDbEUsUUFBUSxHQUFHLFNBQVMsQ0FBQztLQUN0QjtJQUVELE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFyQ0QsMEJBcUNDO0FBRUQ7Ozs7OztHQU1HO0FBQ1UsUUFBQSxjQUFjLEdBQUcsVUFBQyxDQUE4QztJQUMzRSxJQUFNLEtBQUssR0FBYSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUN0QixPQUFPLDZCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVCO0lBQ0QsSUFBTSxRQUFRLEdBQUcsNkJBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUgsQ0FBRyxDQUFDLENBQUM7QUFDckMsQ0FBQyxDQUFDIn0=