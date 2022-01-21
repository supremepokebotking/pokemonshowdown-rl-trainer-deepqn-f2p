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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var libsvm_ts_1 = require("libsvm-ts");
var _ = __importStar(require("lodash"));
var validation_1 = require("../utils/validation");
/**
 * BaseSVM class used by all parent SVM classes that are based on libsvm.
 * You may still use this to use the underlying libsvm-ts more flexibly.
 *
 * Note: This API is not available on the browsers
 */
var BaseSVM = /** @class */ (function () {
    function BaseSVM(options) {
        this.options = {
            cacheSize: _.get(options, 'cacheSize', 100),
            coef0: _.get(options, 'coef0', 0),
            cost: _.get(options, 'cost', 1),
            degree: _.get(options, 'degree', 3),
            epsilon: _.get(options, 'epsilon', 0.1),
            gamma: _.get(options, 'gamma', null),
            kernel: _.get(options, 'kernel', 'RBF'),
            type: _.get(options, 'type', 'C_SVC'),
            nu: _.get(options, 'nu', 0.5),
            probabilityEstimates: _.get(options, 'probabilityEstimates', false),
            quiet: _.get(options, 'quiet', true),
            shrinking: _.get(options, 'shrinking', true),
            tolerance: _.get(options, 'tolerance', 0.001),
            weight: _.get(options, 'weight', undefined),
        };
        this.svm = new libsvm_ts_1.SVM(this.options);
    }
    /**
     * Loads a WASM version of SVM. The method returns the instance of itself as a promise result.
     */
    BaseSVM.prototype.loadWASM = function () {
        var _this = this;
        return this.svm.loadWASM().then(function (wasmSVM) {
            _this.svm = wasmSVM;
            return Promise.resolve(_this);
        });
    };
    /**
     * Loads a ASM version of SVM. The method returns the instance of itself as a promise result.
     */
    BaseSVM.prototype.loadASM = function () {
        var _this = this;
        return this.svm.loadASM().then(function (asmSVM) {
            _this.svm = asmSVM;
            return Promise.resolve(_this);
        });
    };
    /**
     * Fit the model according to the given training data.
     * @param {number[][]} X
     * @param {number[]} y
     * @returns {Promise<void>}
     */
    BaseSVM.prototype.fit = function (X, y) {
        validation_1.validateFitInputs(X, y);
        this.svm.train({
            samples: X,
            labels: y,
        });
    };
    /**
     * Predict using the linear model
     * @param {number[][]} X
     * @returns {number[]}
     */
    BaseSVM.prototype.predict = function (X) {
        validation_1.validateMatrix2D(X);
        return this.svm.predict({ samples: X });
    };
    /**
     * Predict the label of one sample.
     * @param {number[]} X
     * @returns {number}
     */
    BaseSVM.prototype.predictOne = function (X) {
        validation_1.validateMatrix1D(X);
        return this.svm.predictOne({ sample: X });
    };
    /**
     * Saves the current SVM as a JSON object
     * @returns {{svm: SVM; options: SVMOptions}}
     */
    BaseSVM.prototype.toJSON = function () {
        return {
            svm: this.svm,
            options: this.options,
        };
    };
    /**
     * Restores the model from a JSON checkpoint
     * @param {SVM} svm
     * @param {any} options
     */
    BaseSVM.prototype.fromJSON = function (_a) {
        var _b = _a.svm, svm = _b === void 0 ? null : _b, _c = _a.options, options = _c === void 0 ? null : _c;
        if (!svm || !options) {
            throw new Error('You must provide svm, type and options to restore the model');
        }
        this.svm = svm;
        this.options = options;
    };
    return BaseSVM;
}());
exports.BaseSVM = BaseSVM;
/**
 * C-Support Vector Classification.
 *
 * The implementation is based on libsvm. The fit time complexity is more than
 * quadratic with the number of samples which makes it hard to scale to dataset
 * with more than a couple of 10000 samples.
 *
 * The multiclass support is handled according to a one-vs-one scheme.
 *
 * For details on the precise mathematical formulation of the provided kernel
 * functions and how gamma, coef0 and degree affect each other, see the corresponding
 * section in the narrative documentation: Kernel functions.
 *
 * Note: This API is not available on the browsers
 *
 * @example
 * import { SVC } from 'machinelearn/svm';
 *
 * const svm = new SVC();
 * svm.loadASM().then((loadedSVM) => {
 *   loadedSVM.fit([[0, 0], [1, 1]], [0, 1]);
 *   loadedSVM.predict([[1, 1]]);   // [1]
 * });
 */
var SVC = /** @class */ (function (_super) {
    __extends(SVC, _super);
    function SVC(options) {
        return _super.call(this, __assign({}, options, { type: 'C_SVC' })) || this;
    }
    return SVC;
}(BaseSVM));
exports.SVC = SVC;
/**
 * Linear Support Vector Regression.
 *
 * Similar to SVR with parameter kernel=’linear’, but implemented in terms of
 * liblinear rather than libsvm, so it has more flexibility in the choice of
 * penalties and loss functions and should scale better to large numbers of samples.
 *
 * This class supports both dense and sparse input.
 *
 * Note: This API is not available on the browsers
 *
 * @example
 * import { SVR } from 'machinelearn/svm';
 *
 * const svm = new SVR();
 * svm.loadASM().then((loadedSVM) => {
 *   loadedSVM.fit([[0, 0], [1, 1]], [0, 1]);
 *   loadedSVM.predict([[1, 1]]);   // [0.9000000057898799]
 * });
 */
var SVR = /** @class */ (function (_super) {
    __extends(SVR, _super);
    function SVR(options) {
        return _super.call(this, __assign({}, options, { type: 'EPSILON_SVR' })) || this;
    }
    return SVR;
}(BaseSVM));
exports.SVR = SVR;
/**
 * Unsupervised Outlier Detection.
 *
 * Estimate the support of a high-dimensional distribution.
 *
 * The implementation is based on libsvm.
 *
 * Note: This API is not available on the browsers
 *
 * @example
 * import { OneClassSVM } from 'machinelearn/svm';
 *
 * const svm = new OneClassSVM();
 * svm.loadASM().then((loadedSVM) => {
 *   loadedSVM.fit([[0, 0], [1, 1]], [0, 1]);
 *   loadedSVM.predict([[1, 1]]);   // [-1]
 * });
 */
var OneClassSVM = /** @class */ (function (_super) {
    __extends(OneClassSVM, _super);
    function OneClassSVM(options) {
        return _super.call(this, __assign({}, options, { type: 'ONE_CLASS' })) || this;
    }
    return OneClassSVM;
}(BaseSVM));
exports.OneClassSVM = OneClassSVM;
/**
 * Nu-Support Vector Classification.
 *
 * Similar to SVC but uses a parameter to control the number of support vectors.
 *
 * The implementation is based on libsvm.
 *
 * Note: This API is not available on the browsers
 *
 * @example
 * import { NuSVC } from 'machinelearn/svm';
 *
 * const svm = new NuSVC();
 * svm.loadASM().then((loadedSVM) => {
 *   loadedSVM.fit([[0, 0], [1, 1]], [0, 1]);
 *   loadedSVM.predict([[1, 1]]);   // [1]
 * });
 */
var NuSVC = /** @class */ (function (_super) {
    __extends(NuSVC, _super);
    function NuSVC(options) {
        return _super.call(this, __assign({}, options, { type: 'NU_SVC' })) || this;
    }
    return NuSVC;
}(BaseSVM));
exports.NuSVC = NuSVC;
/**
 * Nu Support Vector Regression.
 *
 * Similar to NuSVC, for regression, uses a parameter nu to control the number
 * of support vectors. However, unlike NuSVC, where nu replaces C, here nu
 * replaces the parameter epsilon of epsilon-SVR.
 *
 * The implementation is based on libsvm.
 *
 * Note: This API is not available on the browsers
 *
 * @example
 * import { NuSVR } from 'machinelearn/svm';
 *
 * const svm = new NuSVR();
 * svm.loadASM().then((loadedSVM) => {
 *   loadedSVM.fit([[0, 0], [1, 1]], [0, 1]);
 *   loadedSVM.predict([[1, 1]]);   // [0.9000000057898799]
 * });
 */
var NuSVR = /** @class */ (function (_super) {
    __extends(NuSVR, _super);
    function NuSVR(options) {
        return _super.call(this, __assign({}, options, { type: 'NU_SVR' })) || this;
    }
    return NuSVR;
}(BaseSVM));
exports.NuSVR = NuSVR;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3Nlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvc3ZtL2NsYXNzZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQWdDO0FBQ2hDLHdDQUE0QjtBQUU1QixrREFBNEY7QUFtRTVGOzs7OztHQUtHO0FBQ0g7SUFJRSxpQkFBWSxPQUFvQjtRQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsU0FBUyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxHQUFHLENBQUM7WUFDM0MsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDakMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDL0IsTUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDbkMsT0FBTyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUM7WUFDdkMsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUM7WUFDcEMsTUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUM7WUFDdkMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7WUFDckMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUM7WUFDN0Isb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsc0JBQXNC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