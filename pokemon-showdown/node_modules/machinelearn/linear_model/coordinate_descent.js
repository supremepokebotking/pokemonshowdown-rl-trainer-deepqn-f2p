"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var preprocessing_1 = require("../preprocessing");
var Errors_1 = require("../utils/Errors");
var stochastic_gradient_1 = require("./stochastic_gradient");
/**
 * Linear least squares with l2 regularization.
 *
 * Mizimizes the objective function:
 *
 *
 * ||y - Xw||^2_2 + alpha * ||w||^2_2
 *
 *
 * This model solves a regression model where the loss function is the linear least squares function
 * and regularization is given by the l2-norm. Also known as Ridge Regression or Tikhonov regularization.
 * This estimator has built-in support for multi-variate regression (i.e., when y is a 2d-array of shape [n_samples, n_targets]).
 *
 * @example
 * import { Iris } from 'machinelearn/datasets';
 * import { Ridge } from 'machinelearn/linear_model';
 * (async function() {
 *   const irisData = new Iris();
 *   const {
 *     data,         // returns the iris data (X)
 *     targets,      // list of target values (y)
 *   } = await irisData.load(); // loads the data internally
 *
 *   const reg = new Ridge({ l2: 1 });
 *   reg.fit(data, target);
 *   reg.predict([[5.1,3.5,1.4,0.2]]);
 * })();
 *
 */
var Ridge = /** @class */ (function (_super) {
    __extends(Ridge, _super);
    /**
     * @param l2 - Regularizer factor
     * @param epochs - Number of epochs
     * @param learning_rate - learning rate
     */
    function Ridge(_a) {
        var _b = _a === void 0 ? {
            l2: null,
            epochs: 1000,
            learning_rate: 0.001,
        } : _a, _c = _b.l2, l2 = _c === void 0 ? null : _c, _d = _b.epochs, epochs = _d === void 0 ? 1000 : _d, _e = _b.learning_rate, learning_rate = _e === void 0 ? 0.001 : _e;
        var _this = this;
        if (l2 === null) {
            throw new Errors_1.ConstructionError('Ridge cannot be initiated with null l2');
        }
        _this = _super.call(this, {
            reg_factor: { l2: l2 },
            learning_rate: learning_rate,
            epochs: epochs,
            loss: stochastic_gradient_1.TypeLoss.L2.toString(),
        }) || this;
        return _this;
    }
    return Ridge;
}(stochastic_gradient_1.SGDRegressor));
exports.Ridge = Ridge;
/**
 * Linear Model trained with L1 prior as regularizer (aka the Lasso)
 *
 * The optimization objective for Lasso is:
 *
 * (1 / (2 * n_samples)) * ||y - Xw||^2_2 + alpha * ||w||_1
 *
 * Technically the Lasso model is optimizing the same objective function as the Elastic Net with l1_ratio value (no L2 penalty).
 *
 * @example
 * import { Iris } from 'machinelearn/datasets';
 * import { Lasso } from 'machinelearn/linear_model';
 * (async function() {
 *   const irisData = new Iris();
 *   const {
 *     data,         // returns the iris data (X)
 *     targets,      // list of target values (y)
 *   } = await irisData.load(); // loads the data internally
 *
 *   const reg = new Lasso({ degree: 2, l1: 1 });
 *   reg.fit(data, target);
 *   reg.predict([[5.1,3.5,1.4,0.2]]);
 * })();
 *
 */
var Lasso = /** @class */ (function (_super) {
    __extends(Lasso, _super);
    /**
     * @param degree - Polynomial feature extraction degree
     * @param l1 - Regularizer factor
     * @param epochs - Number of epochs
     * @param learning_rate - Learning rate
     */
    function Lasso(_a) {
        var _b = _a === void 0 ? {
            degree: null,
            l1: null,
            epochs: 1000,
            learning_rate: 0.001,
        } : _a, _c = _b.degree, degree = _c === void 0 ? null : _c, l1 = _b.l1, _d = _b.epochs, epochs = _d === void 0 ? 1000 : _d, _e = _b.learning_rate, learning_rate = _e === void 0 ? 0.001 : _e;
        var _this = this;
        if (l1 === null) {
            throw new Errors_1.ConstructionError('Lasso cannot be initiated with null l1');
        }
        if (degree === null) {
            throw new Errors_1.ConstructionError('Lasso cannot be initiated with null degree');
        }
        _this = _super.call(this, {
            reg_factor: { l1: l1 },
            learning_rate: learning_rate,
            epochs: epochs,
            loss: stochastic_gradient_1.TypeLoss.L1.toString(),
        }) || this;
        _this.degree = degree;
        return _this;
    }
    /**
     * Fit model with coordinate descent.
     * @param X - A matrix of samples
     * @param y - A vector of targets
     */
    Lasso.prototype.fit = function (X, y) {
        if (X === void 0) { X = null; }
        if (y === void 0) { y = null; }
        var polynomial = new preprocessing_1.PolynomialFeatures({ degree: this.degree });
        var newX = preprocessing_1.normalize(polynomial.transform(X));
        _super.prototype.fit.call(this, newX, y);
    };
    /**
     * Predict using the linear model
     * @param X - A matrix of test data
     */
    Lasso.prototype.predict = function (X) {
        if (X === void 0) { X = null; }
        var polynomial = new preprocessing_1.PolynomialFeatures({ degree: this.degree });
        var newX = preprocessing_1.normalize(polynomial.transform(X));
        return _super.prototype.predict.call(this, newX);
    };
    return Lasso;
}(stochastic_gradient_1.SGDRegressor));
exports.Lasso = Lasso;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29vcmRpbmF0ZV9kZXNjZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9saW5lYXJfbW9kZWwvY29vcmRpbmF0ZV9kZXNjZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUFpRTtBQUVqRSwwQ0FBb0Q7QUFDcEQsNkRBQStEO0FBRS9EOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBQ0g7SUFBMkIseUJBQVk7SUFDckM7Ozs7T0FJRztJQUNILGVBQ0UsRUFZQztZQVpEOzs7O2NBWUMsRUFYQyxVQUFTLEVBQVQsOEJBQVMsRUFDVCxjQUFhLEVBQWIsa0NBQWEsRUFDYixxQkFBcUIsRUFBckIsMENBQXFCO1FBSnpCLGlCQXlCQztRQVZDLElBQUksRUFBRSxLQUFLLElBQUksRUFBRTtZQUNmLE1BQU0sSUFBSSwwQkFBaUIsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1NBQ3ZFO1FBRUQsUUFBQSxrQkFBTTtZQUNKLFVBQVUsRUFBRSxFQUFFLEVBQUUsSUFBQSxFQUFFO1lBQ2xCLGFBQWEsZUFBQTtZQUNiLE1BQU0sUUFBQTtZQUNOLElBQUksRUFBRSw4QkFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7U0FDN0IsQ0FBQyxTQUFDOztJQUNMLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0FBQyxBQWhDRCxDQUEyQixrQ0FBWSxHQWdDdEM7QUFoQ1ksc0JBQUs7QUFrQ2xCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFDSDtJQUEyQix5QkFBWTtJQUdyQzs7Ozs7T0FLRztJQUNILGVBQ0UsRUFlQztZQWZEOzs7OztjQWVDLEVBZEMsY0FBYSxFQUFiLGtDQUFhLEVBQ2IsVUFBRSxFQUNGLGNBQWEsRUFBYixrQ0FBYSxFQUNiLHFCQUFxQixFQUFyQiwwQ0FBcUI7UUFMekIsaUJBK0JDO1FBYkMsSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2YsTUFBTSxJQUFJLDBCQUFpQixDQUFDLHdDQUF3QyxDQUFDLENBQUM7U0FDdkU7UUFDRCxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDbkIsTUFBTSxJQUFJLDBCQUFpQixDQUFDLDRDQUE0QyxDQUFDLENBQUM7U0FDM0U7UUFDRCxRQUFBLGtCQUFNO1lBQ0osVUFBVSxFQUFFLEVBQUUsRUFBRSxJQUFBLEVBQUU7WUFDbEIsYUFBYSxlQUFBO1lBQ2IsTUFBTSxRQUFBO1lBQ04sSUFBSSxFQUFFLDhCQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtTQUM3QixDQUFDLFNBQUM7UUFDSCxLQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7SUFDdkIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxtQkFBRyxHQUFWLFVBQVcsQ0FBOEIsRUFBRSxDQUE4QjtRQUE5RCxrQkFBQSxFQUFBLFFBQThCO1FBQUUsa0JBQUEsRUFBQSxRQUE4QjtRQUN2RSxJQUFNLFVBQVUsR0FBRyxJQUFJLGtDQUFrQixDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLElBQU0sSUFBSSxHQUFHLHlCQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hELGlCQUFNLEdBQUcsWUFBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLHVCQUFPLEdBQWQsVUFBZSxDQUE4QjtRQUE5QixrQkFBQSxFQUFBLFFBQThCO1FBQzNDLElBQU0sVUFBVSxHQUFHLElBQUksa0NBQWtCLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbkUsSUFBTSxJQUFJLEdBQUcseUJBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsT0FBTyxpQkFBTSxPQUFPLFlBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNILFlBQUM7QUFBRCxDQUFDLEFBOURELENBQTJCLGtDQUFZLEdBOER0QztBQTlEWSxzQkFBSyJ9