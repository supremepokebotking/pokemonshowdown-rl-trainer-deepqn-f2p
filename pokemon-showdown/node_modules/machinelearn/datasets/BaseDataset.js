"use strict";
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
var fs = __importStar(require("fs"));
require("isomorphic-fetch");
var lodash_1 = require("lodash");
var path = __importStar(require("path"));
var label_1 = require("../preprocessing/label");
/**
 * @ignore
 */
var BaseDataset = /** @class */ (function () {
    function BaseDataset() {
    }
    /**
     * fetch load from a multiple
     * @param sources - A list of URLs to fetch the data from
     * @param type - type of data; for example CSV or JSON
     * @param delimiter - specify the data delimiter, which will be used to split the row data
     * @param lastIsTarget - tell the underlying processor that the last index of the dataset is the target data
     * @param trainType - data type to enforce on the training dataset
     * @param targetType - target type to enforce on the target dataset
     * @private
     */
    BaseDataset.prototype.fetchLoad = function (sources, _a) {
        if (sources === void 0) { sources = []; }
        var _b = _a === void 0 ? {
            // Default object if nothing is provided
            type: 'csv',
            delimiter: ',',
            lastIsTarget: true,
            trainType: 'float',
            targetType: 'float',
        } : _a, 
        // Params
        _c = _b.type, 
        // Params
        type = _c === void 0 ? 'csv' : _c, _d = _b.delimiter, delimiter = _d === void 0 ? ',' : _d, _e = _b.lastIsTarget, lastIsTarget = _e === void 0 ? true : _e, _f = _b.trainType, trainType = _f === void 0 ? 'float' : _f, _g = _b.targetType, targetType = _g === void 0 ? 'float' : _g;
        return __awaiter(this, void 0, void 0, function () {
            var data, i, url, response, status_1, textData;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        data = null;
                        i = 0;
                        _h.label = 1;
                    case 1:
                        if (!(i < sources.length)) return [3 /*break*/, 5];
                        url = sources[i];
                        return [4 /*yield*/, fetch(url)];
                    case 2:
                        response = _h.sent();
                        status_1 = response.ok;
                        return [4 /*yield*/, response.text()];
                    case 3:
                        textData = _h.sent();
                        if (status_1 && textData) {
                            data = textData;
                            // No need to request data anymore
                            return [3 /*break*/, 5];
                        }
                        _h.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5:
                        if (type === 'csv') {
                            return [2 /*return*/, this.processCSV(data, delimiter, lastIsTarget, trainType, targetType)];
                        }
                        return [2 /*return*/, {
                                data: null,
                                targets: null,
                                labels: null,
                            }];
                }
            });
        });
    };
    /**
     * Load data from the local data folder
     */
    BaseDataset.prototype.fsLoad = function (type, _a) {
        var _b = _a === void 0 ? {
            // Default object if nothing is provided
            delimiter: ',',
            lastIsTarget: true,
            trainType: 'float',
            targetType: 'float',
        } : _a, _c = _b.delimiter, delimiter = _c === void 0 ? ',' : _c, _d = _b.lastIsTarget, lastIsTarget = _d === void 0 ? true : _d, _e = _b.trainType, trainType = _e === void 0 ? 'float' : _e, _f = _b.targetType, targetType = _f === void 0 ? 'float' : _f;
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_g) {
                data = fs.readFileSync(path.join(__dirname, "data/" + type + "/train.csv"), 'utf8');
                return [2 /*return*/, this.processCSV(data, delimiter, lastIsTarget, trainType, targetType)];
            });
        });
    };
    /**
     * Processes CSV type dataset. Returns a training and testing data pair
     * @param data - a raw string data
     * @param delimiter - delimiter to split on
     * @param lastIsTarget - flag to indicate that the last element is the target data
     * @param trainType - training data type to enforce
     * @param targetType - target data type to enforce
     */
    BaseDataset.prototype.processCSV = function (data, delimiter, lastIsTarget, trainType, targetType) {
        if (delimiter === void 0) { delimiter = ','; }
        if (lastIsTarget === void 0) { lastIsTarget = true; }
        if (trainType === void 0) { trainType = 'float'; }
        if (targetType === void 0) { targetType = 'float'; }
        // Split the rows by newlines
        var splitRows = data.split(/\r\n|\n|\r/);
        // Trim any excessive spaces
        var trimmedRows = splitRows.map(function (row) { return row.trim(); });
        // Filtering out any empty rows
        var filteredRows = trimmedRows.filter(function (row) { return row; });
        // Organise training and target data
        var result = filteredRows.map(function (row) { return row.split(delimiter); });
        if (lastIsTarget) {
            result = result.reduce(function (sum, curValue) {
                // Building the target values array
                sum[1].push(curValue.pop());
                // Building the train values array
                sum[0].push(curValue);
                return sum;
            }, [[], []]);
        }
        // Encode the classes
        var rawTest = result[1];
        var encoder = new label_1.LabelEncoder();
        // Get the unique labels
        var labelX = lodash_1.uniqBy(rawTest, function (x) { return x; });
        encoder.fit(labelX);
        // Encode the test values
        var targets = encoder.transform(rawTest);
        // Enforcing data type
        // 1. training data
        if (trainType === 'number') {
            result[0] = result[0].map(function (row) { return row.map(lodash_1.parseInt); });
        }
        else if (trainType === 'float') {
            result[0] = result[0].map(function (row) { return row.map(parseFloat); });
        }
        // 2. target data
        if (targetType === 'number') {
            result[1] = result[1].map(lodash_1.parseInt);
        }
        else if (targetType === 'float') {
            result[1] = result[1].map(parseFloat);
        }
        return {
            data: result[0],
            targets: targets,
            labels: result[1],
        };
    };
    return BaseDataset;
}());
exports.BaseDataset = BaseDataset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZURhdGFzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2RhdGFzZXRzL0Jhc2VEYXRhc2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUNBQXlCO0FBQ3pCLDRCQUEwQjtBQUMxQixpQ0FBMEM7QUFDMUMseUNBQTZCO0FBQzdCLGdEQUFzRDtBQUV0RDs7R0FFRztBQUNIO0lBQUE7SUEwSUEsQ0FBQztJQXpJQzs7Ozs7Ozs7O09BU0c7SUFDYSwrQkFBUyxHQUF6QixVQUNFLE9BQVksRUFDWixFQWNDO1FBZkQsd0JBQUEsRUFBQSxZQUFZO1lBQ1o7Ozs7Ozs7Y0FjQztRQWJDLFNBQVM7UUFDVCxZQUFZO1FBRFosU0FBUztRQUNULGlDQUFZLEVBQ1osaUJBQWUsRUFBZixvQ0FBZSxFQUNmLG9CQUFtQixFQUFuQix3Q0FBbUIsRUFDbkIsaUJBQW1CLEVBQW5CLHdDQUFtQixFQUNuQixrQkFBb0IsRUFBcEIseUNBQW9COzs7Ozs7d0JBVWxCLElBQUksR0FBRyxJQUFJLENBQUM7d0JBQ1AsQ0FBQyxHQUFHLENBQUM7Ozs2QkFBRSxDQUFBLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFBO3dCQUMxQixHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUVOLHFCQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBQTs7d0JBQTNCLFFBQVEsR0FBRyxTQUFnQjt3QkFDM0IsV0FBUyxRQUFRLENBQUMsRUFBRSxDQUFDO3dCQUNWLHFCQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQWhDLFFBQVEsR0FBRyxTQUFxQjt3QkFDdEMsSUFBSSxRQUFNLElBQUksUUFBUSxFQUFFOzRCQUN0QixJQUFJLEdBQUcsUUFBUSxDQUFDOzRCQUNoQixrQ0FBa0M7NEJBQ2xDLHdCQUFNO3lCQUNQOzs7d0JBVmlDLENB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