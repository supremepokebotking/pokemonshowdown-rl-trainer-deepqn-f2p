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
var numeric = __importStar(require("numeric"));
var validation_1 = require("../utils/validation");
/**
 * Principal component analysis (PCA)
 *
 * Linear dimensionality reduction using Singular Value Decomposition of
 * the data to project it to a lower dimensional space.
 *
 * - It uses the LAPACK implementation of the full SVD
 * - or randomized a randomised truncated SVD by the method of
 * Halko et al. 2009, depending on the shape
 * of the input data and the number of components to extract. (Will be implemented)
 *
 * @example
 * import { PCA } from 'machinelearn/decomposition';
 *
 * const pca = new PCA();
 * const X = [[1, 2], [3, 4], [5, 6]];
 * pca.fit(X);
 * console.log(pca.components); // result: [ [ 0.7071067811865476, 0.7071067811865474 ], [ 0.7071067811865474, -0.7071067811865476 ] ]
 * console.log(pca.explained_variance); // result: [ [ -0.3535533905932736, 0 ], [ 0, 0.5 ], [ 0.35355339059327373, 0 ] ]
 */
var PCA = /** @class */ (function () {
    function PCA() {
    }
    /**
     * Fit the model with X.
     * At the moment it does not take n_components into consideration
     * so it will only calculate Singular value decomposition
     * @param {any} X
     */
    PCA.prototype.fit = function (X) {
        validation_1.validateMatrix2D(X);
        validation_1.validateMatrixType(X, ['number']);
        var nSamples = X.length;
        // Renaming X to A for readability
        var A = tf.tensor2d(X);
        // const transposed = tf.transpose(A, [1, 0]);
        var AT = tf.transpose(A, [1, 0]);
        var M = tf.mean(AT, 1);
        var rawC = tf.sub(A, M);
        var C = validation_1.validateMatrix2D(rawC.arraySync());
        var svd = numeric.svd(C);
        this.components = svd.V;
        this.explained_variance = numeric.div(numeric.pow(svd.U, 1), nSamples - 1);
    };
    /**
     * Predict does nothing in PCA
     * @param X - A 2D matrix
     */
    PCA.prototype.predict = function (X) {
        if (X === void 0) { X = null; }
        console.info('Predict does nothing in PCA\n', X);
        return null;
    };
    /**
     * Saves the model's states
     */
    PCA.prototype.toJSON = function () {
        return {
            components: this.components,
            explained_variance: this.explained_variance,
        };
    };
    /**
     * Restores the model from given states
     * @param components - Principal axes in feature space, representing the directions of maximum variance in the data.
     * @param explained_variance - The amount of variance explained by each of the selected components.
     */
    PCA.prototype.fromJSON = function (_a) {
        var _b = _a === void 0 ? {
            components: null,
            explained_variance: null,
        } : _a, _c = _b.components, components = _c === void 0 ? null : _c, _d = _b.explained_variance, explained_variance = _d === void 0 ? null : _d;
        this.components = components;
        this.explained_variance = explained_variance;
    };
    return PCA;
}());
exports.PCA = PCA;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGNhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9kZWNvbXBvc2l0aW9uL3BjYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxtREFBdUM7QUFDdkMsK0NBQW1DO0FBRW5DLGtEQUEyRTtBQUUzRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CRztBQUNIO0lBQUE7SUFnRkEsQ0FBQztJQWxFQzs7Ozs7T0FLRztJQUNJLGlCQUFHLEdBQVYsVUFBVyxDQUF1QjtRQUNoQyw2QkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQiwrQkFBa0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDMUIsa0NBQWtDO1FBQ2xDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekIsOENBQThDO1FBQzlDLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBTSxDQUFDLEdBQUcsNkJBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDN0MsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0kscUJBQU8sR0FBZCxVQUFlLENBQThCO1FBQTlCLGtCQUFBLEVBQUEsUUFBOEI7UUFDM0MsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7T0FFRztJQUNJLG9CQUFNLEdBQWI7UUFJRSxPQUFPO1lBQ0wsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1lBQzNCLGtCQUFrQixFQUFFLElBQUksQ0FBQyxrQkFBa0I7U0FDNUMsQ0FBQztJQUNKLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksc0JBQVEsR0FBZixVQUNFLEVBU0M7WUFURDs7O2NBU0MsRUFSQyxrQkFBaUIsRUFBakIsc0NBQWlCLEVBQ2pCLDBCQUF5QixFQUF6Qiw4Q0FBeUI7UUFTM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO0lBQy9DLENBQUM7SUFDSCxVQUFDO0FBQUQsQ0FBQyxBQWhGRCxJQWdGQztBQWhGWSxrQkFBRyJ9