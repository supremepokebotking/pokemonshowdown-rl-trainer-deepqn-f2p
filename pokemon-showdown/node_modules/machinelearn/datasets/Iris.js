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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * References:
 * - https://archive.ics.uci.edu/ml/datasets/iris
 * - https://en.wikipedia.org/wiki/Iris_flower_data_set
 */
var fs = __importStar(require("fs"));
require("isomorphic-fetch");
var path = __importStar(require("path"));
var BaseDataset_1 = require("./BaseDataset");
/**
 * The Iris flower data set or Fisher's Iris data set is a multivariate data set introduced by the British statistician and biologist Ronald Fisher
 * in his 1936 paper The use of multiple measurements in taxonomic problems as an example of linear discriminant analysis.
 *
 * It contains 50 samples with 3 classes of 'Setosa', 'versicolor' and 'virginica'
 *
 * Note: This API is not available on the browsers
 *
 * @example
 * import { Iris } from 'machinelearn/datasets';
 *
 * (async function() {
 *   const irisData = new Iris();
 *   const {
 *     data,         // returns the iris data (X)
 *     targets,      // list of target values (y)
 *     labels,       // list of labels
 *     targetNames,  // list of short target labels
 *     description   // dataset description
 *   } = await irisData.load(); // loads the data internally
 * })();
 *
 */
var Iris = /** @class */ (function (_super) {
    __extends(Iris, _super);
    function Iris() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Load datasets
     */
    Iris.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, targets, labels, targetNames, description;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fsLoad('iris')];
                    case 1:
                        _a = _b.sent(), data = _a.data, targets = _a.targets, labels = _a.labels;
                        targetNames = ['setosa', 'versicolor', 'virginica'];
                        return [4 /*yield*/, fs.readFileSync(path.join(__dirname, './data/iris/iris.names'), 'utf8')];
                    case 2:
                        description = _b.sent();
                        return [2 /*return*/, {
                                data: data,
                                targets: targets,
                                labels: labels,
                                targetNames: targetNames,
                                description: description,
                            }];
                }
            });
        });
    };
    return Iris;
}(BaseDataset_1.BaseDataset));
exports.Iris = Iris;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXJpcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGF0YXNldHMvSXJpcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gscUNBQXlCO0FBQ3pCLDRCQUEwQjtBQUMxQix5Q0FBNkI7QUFDN0IsNkNBQTRDO0FBRTVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBQ0g7SUFBMEIsd0JBQVc7SUFBckM7O0lBeUNBLENBQUM7SUF4Q0M7O09BRUc7SUFDVSxtQkFBSSxHQUFqQjs7Ozs7NEJBdUJvQyxxQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFBOzt3QkFBckQsS0FBNEIsU0FBeUIsRUFBbkQsSUFBSSxVQUFBLEVBQUUsT0FBTyxhQUFBLEVBQUUsTUFBTSxZQUFBO3dCQUV2QixXQUFXLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO3dCQUd0QyxxQkFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHdCQUF3QixDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUE7O3dCQUEzRixXQUFXLEdBQUcsU0FBNkU7d0JBQ2pHLHNCQUFPO2dDQUNMLElBQUksTUFBQTtnQ0FDSixPQUFPLFNBQUE7Z0NBQ1AsTUFBTSxRQUFBO2dDQUNOLFdBQVcsYUFBQTtnQ0FDWCxXQUFXLGFBQUE7NkJBQ1osRUFBQzs7OztLQUNIO0lBQ0gsV0FBQztBQUFELENBQUMsQUF6Q0QsQ0FBMEIseUJBQVcsR0F5Q3BDO0FBekNZLG9CQUFJIn0=