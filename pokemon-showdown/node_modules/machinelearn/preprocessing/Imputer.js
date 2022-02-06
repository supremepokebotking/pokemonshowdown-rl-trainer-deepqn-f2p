"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var MathExtra_1 = __importDefault(require("../utils/MathExtra"));
var validation_1 = require("../utils/validation");
/**
 * Imputation transformer for completing missing values.
 *
 * @example
 * import { Imputer } from 'preprocessing/Imputer';
 *
 * const testX = [[1, 2], [null, 3], [7, 6]];
 * const imp = new Imputer({ missingValues: null, axis: 0 });
 * imp.fit(testX);
 * const impResult = imp.fit_transform([[null, 2], [6, null], [7, 6]]);
 * // [ [ 4, 2 ], [ 6, 3.6666666666666665 ], [ 7, 6 ] ]
 */
var Imputer = /** @class */ (function () {
    /**
     *
     * @param {any} missingValues - Target missing value to impute
     * @param {any} strategy - Missing value replacement strategy
     * @param {any} axis - Direction to impute
     * @param {any} copy - To clone the input value
     */
    function Imputer(_a) {
        var _this = this;
        var _b = _a.missingValues, missingValues = _b === void 0 ? null : _b, _c = _a.strategy, strategy = _c === void 0 ? 'mean' : _c, _d = _a.axis, axis = _d === void 0 ? 0 : _d, 
        // verbose = 0,
        _e = _a.copy, 
        // verbose = 0,
        copy = _e === void 0 ? false : _e;
        /**
         * Calculate array of numbers as array of mean values
         * Examples:
         * [ [ 1, 2 ], [ null, 3 ], [ 123, 3 ] ]
         * => [ 1.5, 3, 63 ]
         *
         * [ [ 1, 123 ], [ 2, 3, 3 ] ]
         * => [ 62, 2.6666666666666665 ]
         *
         * @param matrix
         * @param {string[]} steps
         */
        this.calcArrayMean = function (matrix, steps) {
            // TODO: Fix any return type
            // TODO: Fix matrix type any
            return _.reduce(steps, function (result, step) {
                switch (step) {
                    case 'flatten':
                        return _.map(result, _.flatten);
                    case 'filter':
                        return _.map(result, 
                        // Expecting any type of matrics array
                        // TODO: implement a correct type
                        function (arr) {
                            return _.filter(arr, function (z) { return z !== _this.missingValues; });
                        });
                    case 'mean':
                        return _.map(result, _.mean);
                    default:
                        return result;
                }
            }, matrix);
        };
        this.missingValues = missingValues;
        this.strategy = strategy;
        this.axis = axis;
        // this.verbose = verbose;
        this.copy = copy;
        this.means = [];
    }
    /**
     * Fit the imputer on X.
     * @param {any[]} X - Input data in array or sparse matrix format
     */
    Imputer.prototype.fit = function (X) {
        if (X === void 0) { X = null; }
        validation_1.validateMatrix2D(X);
        var _X = this.copy ? _.clone(X) : X;
        var rowLen = MathExtra_1.default.size(_X, 0);
        var colLen = MathExtra_1.default.size(_X, 1);
        var rowRange = MathExtra_1.default.range(0, rowLen);
        var colRange = MathExtra_1.default.range(0, colLen);
        if (this.strategy === 'mean') {
            if (this.axis === 0) {
                var colNumbers = _.map(colRange, function (col) { return MathExtra_1.default.subset(_X, rowRange, [col]); });
                this.means = this.calcArrayMean(colNumbers, ['flatten', 'filter', 'mean']);
            }
            else if (this.axis === 1) {
                var rowNumbers = _.map(rowRange, function (row) { return _.get(_X, "[" + row + "]"); });
                this.means = this.calcArrayMean(rowNumbers, ['filter', 'mean']);
            }
        }
        else {
            throw new Error("Unsupported strategy " + this.strategy + " was given");
        }
    };
    /**
     * Fit to data, then transform it.
     * @param {any[]} X - Input data in array or sparse matrix format
     * @returns {any[]}
     */
    Imputer.prototype.fit_transform = function (X) {
        if (X === void 0) { X = null; }
        validation_1.validateMatrix2D(X);
        var _X = _.clone(X);
        if (this.strategy === 'mean' && this.axis === 0) {
            // Mean column direction transform
            for (var row = 0; row < _.size(_X); row++) {
                for (var col = 0; col < _.size(_X[row]); col++) {
                    var value = _X[row][col];
                    _X[row][col] = value === this.missingValues ? this.means[row] : value;
                }
            }
        }
        else if (this.strategy === 'mean' && this.axis === 1) {
            // Mean row direction transform
            for (var row = 0; row < _.size(_X); row++) {
                for (var col = 0; col < _.size(_X[row]); col++) {
                    var value = _X[row][col];
                    _X[row][col] = value === this.missingValues ? this.means[col] : value;
                }
            }
        }
        else {
            throw new Error("Unknown transformation with strategy " + this.strategy + " and axis " + this.axis);
        }
        return _X;
    };
    return Imputer;
}());
exports.Imputer = Imputer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1wdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcHJlcHJvY2Vzc2luZy9JbXB1dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHdDQUE0QjtBQUU1QixpRUFBc0M7QUFDdEMsa0RBQXVEO0FBRXZEOzs7Ozs7Ozs7OztHQVdHO0FBQ0g7SUFRRTs7Ozs7O09BTUc7SUFDSCxpQkFBWSxFQU1YO1FBTkQsaUJBYUM7WUFaQyxxQkFBb0IsRUFBcEIseUNBQW9CLEVBQ3BCLGdCQUFpQixFQUFqQixzQ0FBaUIsRUFDakIsWUFBUSxFQUFSLDZCQUFRO1FBQ1IsZUFBZTtRQUNmLFlBQVk7UUFEWixlQUFlO1FBQ2YsaUNBQVk7UUFrRWQ7Ozs7Ozs7Ozs7O1dBV0c7UUFDSyxrQkFBYSxHQUFHLFVBQUMsTUFBVyxFQUFFLEtBQWU7WUFDbkQsNEJBQTRCO1lBQzVCLDRCQUE0QjtZQUM1QixPQUFBLENBQUMsQ0FBQyxNQUFNLENBQ04sS0FBSyxFQUNMLFVBQUMsTUFBTSxFQUFFLElBQVk7Z0JBQ25CLFFBQVEsSUFBSSxFQUFFO29CQUNaLEtBQUssU0FBUzt3QkFDWixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDbEMsS0FBSyxRQUFRO3dCQUNYLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FDVixNQUFNO3dCQUNOLHNDQUFzQzt3QkFDdEMsaUNBQWlDO3dCQUNqQyxVQUFDLEdBQVU7NEJBQ1QsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsS0FBSyxLQUFJLENBQUMsYUFBYSxFQUF4QixDQUF3QixDQUFDLENBQUM7d0JBQ3hELENBQUMsQ0FDRixDQUFDO29CQUNKLEtBQUssTUFBTTt3QkFDVCxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FB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