"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var dataset_1 = require("../dataset");
var text_line_dataset_1 = require("./text_line_dataset");
var CODE_QUOTE = '"';
var STATE_OUT = Symbol('out');
var STATE_FIELD = Symbol('field');
var STATE_QUOTE = Symbol('quote');
var STATE_QUOTE_AFTER_QUOTE = Symbol('quoteafterquote');
var STATE_WITHIN_QUOTE_IN_QUOTE = Symbol('quoteinquote');
var CSVDataset = (function (_super) {
    __extends(CSVDataset, _super);
    function CSVDataset(input, csvConfig) {
        var _this = _super.call(this) || this;
        _this.input = input;
        _this.hasHeader = true;
        _this.fullColumnNames = null;
        _this.columnNamesValidated = false;
        _this.columnConfigs = null;
        _this.configuredColumnsOnly = false;
        _this.delimiter = ',';
        _this.base = new text_line_dataset_1.TextLineDataset(input);
        if (!csvConfig) {
            csvConfig = {};
        }
        _this.hasHeader = csvConfig.hasHeader === false ? false : true;
        _this.fullColumnNames = csvConfig.columnNames;
        _this.columnConfigs = csvConfig.columnConfigs;
        _this.configuredColumnsOnly = csvConfig.configuredColumnsOnly;
        _this.delimiter = csvConfig.delimiter ? csvConfig.delimiter : ',';
        return _this;
    }
    CSVDataset.prototype.columnNames = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.columnNamesValidated) return [3, 2];
                        return [4, this.setColumnNames()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2, this.configuredColumnsOnly ? Object.keys(this.columnConfigs) :
                            this.fullColumnNames];
                }
            });
        });
    };
    CSVDataset.prototype.setColumnNames = function () {
        return __awaiter(this, void 0, void 0, function () {
            var columnNamesFromFile, counts, duplicateNames, _i, _a, key, index;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.maybeReadHeaderLine()];
                    case 1:
                        columnNamesFromFile = _b.sent();
                        if (!this.fullColumnNames && !columnNamesFromFile) {
                            throw new Error('Column names must be provided if there is no header line.');
                        }
                        else if (this.fullColumnNames && columnNamesFromFile) {
                            tfjs_core_1.util.assert(columnNamesFromFile.length === this.fullColumnNames.length, 'The length of provided columnNames (' +
                                this.fullColumnNames.length.toString() +
                                ') does not match the length of the header line read from ' +
                                'file (' + columnNamesFromFile.length.toString() + ').');
                        }
                        if (!this.fullColumnNames) {
                            this.fullColumnNames = columnNamesFromFile;
                        }
                        counts = this.fullColumnNames.reduce(function (countAcc, name) {
                            countAcc[name] = (countAcc[name] + 1) || 1;
                            return countAcc;
                        }, {});
                        duplicateNames = Object.keys(counts).filter(function (name) { return (counts[name] > 1); });
                        tfjs_core_1.util.assert(duplicateNames.length === 0, 'Duplicate column names found: ' + duplicateNames.toString());
                        if (this.columnConfigs) {
                            for (_i = 0, _a = Object.keys(this.columnConfigs); _i < _a.length; _i++) {
                                key = _a[_i];
                                index = this.fullColumnNames.indexOf(key);
                                if (index === -1) {
                                    throw new Error('The key "' + key +
                                        '" provided in columnConfigs does not match any of the column ' +
                                        'names (' + this.fullColumnNames.toString() + ').');
                                }
                            }
                        }
                        this.columnNamesValidated = true;
                        return [2];
                }
            });
        });
    };
    CSVDataset.prototype.maybeReadHeaderLine = function () {
        return __awaiter(this, void 0, void 0, function () {
            var iter, firstElement, firstLine;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hasHeader) return [3, 3];
                        return [4, this.base.iterator()];
                    case 1:
                        iter = _a.sent();
                        return [4, iter.next()];
                    case 2:
                        firstElement = _a.sent();
                        if (firstElement.done) {
                            throw new Error('No data was found for CSV parsing.');
                        }
                        firstLine = firstElement.value;
                        return [2, firstLine.split(this.delimiter)];
                    case 3: return [2, null];
                }
            });
        });
    };
    CSVDataset.prototype.iterator = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lines;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.columnNamesValidated) return [3, 2];
                        return [4, this.setColumnNames()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4, this.base.iterator()];
                    case 3:
                        lines = _a.sent();
                        if (this.hasHeader) {
                            lines = lines.skip(1);
                        }
                        return [2, lines.map(function (x) { return _this.makeDataElement(x); })];
                }
            });
        });
    };
    CSVDataset.prototype.makeDataElement = function (line) {
        var values = this.parseRow(line);
        var features = {};
        var labels = {};
        for (var i = 0; i < this.fullColumnNames.length; i++) {
            var key = this.fullColumnNames[i];
            var config = this.columnConfigs ? this.columnConfigs[key] : null;
            if (this.configuredColumnsOnly && !config) {
                continue;
            }
            else {
                var value = values[i];
                var parsedValue = null;
                if (value === '') {
                    if (config && config.default !== undefined) {
                        parsedValue = config.default;
                    }
                    else if (config && (config.required || config.isLabel)) {
                        throw new Error("Required column " + key + " is empty in this line: " + line);
                    }
                    else {
                        parsedValue = undefined;
                    }
                }
                else {
                    var valueAsNum = Number(value);
                    if (isNaN(valueAsNum)) {
                        if (config && config.dtype === 'bool') {
                            parsedValue = this.getBoolean(value);
                        }
                        else {
                            parsedValue = value;
                        }
                    }
                    else if (!config || !config.dtype) {
                        parsedValue = valueAsNum;
                    }
                    else {
                        switch (config.dtype) {
                            case 'float32':
                                parsedValue = valueAsNum;
                                break;
                            case 'int32':
                                parsedValue = Math.floor(valueAsNum);
                                break;
                            case 'bool':
                                parsedValue = this.getBoolean(value);
                                break;
                            default:
                                parsedValue = valueAsNum;
                        }
                    }
                }
                (config && config.isLabel) ? labels[key] = parsedValue :
                    features[key] = parsedValue;
            }
        }
        if (Object.keys(labels).length === 0) {
            return features;
        }
        else {
            return [features, labels];
        }
    };
    CSVDataset.prototype.getBoolean = function (value) {
        if (value === '1' || value.toLowerCase() === 'true') {
            return 1;
        }
        else {
            return 0;
        }
    };
    CSVDataset.prototype.parseRow = function (line) {
        var result = [];
        var readOffset = 0;
        var readLength = line.length;
        var currentState = STATE_FIELD;
        for (var i = 0; i < readLength; i++) {
            switch (currentState) {
                case STATE_OUT:
                    switch (line.charAt(i)) {
                        case CODE_QUOTE:
                            readOffset = i + 1;
                            currentState = STATE_QUOTE;
                            break;
                        case this.delimiter:
                            result.push('');
                            currentState = STATE_OUT;
                            readOffset = i + 1;
                            break;
                        default:
                            currentState = STATE_FIELD;
                            readOffset = i;
                            break;
                    }
                    break;
                case STATE_FIELD:
                    switch (line.charAt(i)) {
                        case this.delimiter:
                            result.push(line.substring(readOffset, i));
                            currentState = STATE_OUT;
                            readOffset = i + 1;
                            break;
                        default:
                    }
                    break;
                case STATE_QUOTE:
                    switch (line.charAt(i)) {
                        case CODE_QUOTE:
                            currentState = STATE_QUOTE_AFTER_QUOTE;
                            break;
                        default:
                    }
                    break;
                case STATE_QUOTE_AFTER_QUOTE:
                    switch (line.charAt(i)) {
                        case this.delimiter:
                            result.push(line.substring(readOffset, i - 1));
                            currentState = STATE_OUT;
                            readOffset = i + 1;
                            break;
                        case CODE_QUOTE:
                            currentState = STATE_QUOTE;
                            break;
                        default:
                            currentState = STATE_WITHIN_QUOTE_IN_QUOTE;
                            break;
                    }
                    break;
                case STATE_WITHIN_QUOTE_IN_QUOTE:
                    switch (line.charAt(i)) {
                        case CODE_QUOTE:
                            currentState = STATE_QUOTE;
                            break;
                        default:
                    }
                    break;
                default:
            }
        }
        if (currentState === STATE_QUOTE_AFTER_QUOTE) {
            result.push(line.substring(readOffset, readLength - 1));
        }
        else {
            result.push(line.substring(readOffset));
        }
        return result;
    };
    return CSVDataset;
}(dataset_1.Dataset));
exports.CSVDataset = CSVDataset;
//# sourceMappingURL=csv_dataset.js.map