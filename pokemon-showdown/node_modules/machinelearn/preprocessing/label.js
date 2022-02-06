"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var validation_1 = require("../utils/validation");
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
var LabelEncoder = /** @class */ (function () {
    function LabelEncoder() {
    }
    /**
     * Fit label encoder
     * @param {any[]} X - Input data in array or matrix
     */
    LabelEncoder.prototype.fit = function (X) {
        if (X === void 0) { X = null; }
        validation_1.validateMatrix1D(X);
        this.classes = lodash_1.uniq(X);
    };
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
    LabelEncoder.prototype.transform = function (X) {
        var _this = this;
        if (X === void 0) { X = null; }
        validation_1.validateMatrix1D(X);
        return lodash_1.map(X, function (item) {
            return lodash_1.findIndex(_this.classes, function (cur) { return cur === item; });
        });
    };
    return LabelEncoder;
}());
exports.LabelEncoder = LabelEncoder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFiZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3ByZXByb2Nlc3NpbmcvbGFiZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBOEM7QUFFOUMsa0RBQXVEO0FBRXZEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNIO0lBQUE7SUE0QkEsQ0FBQztJQXpCQzs7O09BR0c7SUFDSSwwQkFBRyxHQUFWLFVBQVcsQ0FBOEI7UUFBOUIsa0JBQUEsRUFBQSxRQUE4QjtRQUN2Qyw2QkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLGFBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksZ0NBQVMsR0FBaEIsVUFBaUIsQ0FBOEI7UUFBL0MsaUJBS0M7UUFMZ0Isa0JBQUEsRUFBQSxRQUE4QjtRQUM3Qyw2QkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixPQUFPLFlBQUcsQ0FBQyxDQUFDLEVBQUUsVUFBQyxJQUFJO1lBQ2pCLE9BQU8sa0JBQVMsQ0FBQyxLQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsR0FBRyxJQUFLLE9BQUEsR0FBRyxLQUFLLElBQUksRUFBWixDQUFZLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUE1QkQsSUE0QkM7QUE1Qlksb0NBQVkifQ==