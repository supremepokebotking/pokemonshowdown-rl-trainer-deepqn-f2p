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
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-core");
function deepMap(input, mapFn) {
    return deepMapInternal(input, mapFn);
}
exports.deepMap = deepMap;
function deepMapInternal(input, mapFn, seen, containedIn) {
    if (seen === void 0) { seen = new Map(); }
    if (containedIn === void 0) { containedIn = new Set(); }
    if (input == null) {
        return null;
    }
    if (containedIn.has(input)) {
        throw new Error('Circular references are not supported.');
    }
    if (seen.has(input)) {
        return seen.get(input);
    }
    var result = mapFn(input);
    if (result.recurse && result.value !== null) {
        throw new Error('A deep map function may not return both a value and recurse=true.');
    }
    if (!result.recurse) {
        seen.set(input, result.value);
        return result.value;
    }
    else if (isIterable(input)) {
        var mappedIterable = Array.isArray(input) ? [] : {};
        containedIn.add(input);
        for (var k in input) {
            var child = input[k];
            var childResult = deepMapInternal(child, mapFn, seen, containedIn);
            mappedIterable[k] = childResult;
        }
        containedIn.delete(input);
        return mappedIterable;
    }
    else {
        throw new Error("Can't recurse into non-iterable type: " + input);
    }
}
function deepZip(inputs, zipFn) {
    if (zipFn === void 0) { zipFn = zipToList; }
    return deepZipInternal(inputs, zipFn);
}
exports.deepZip = deepZip;
function deepZipInternal(inputs, zipFn, containedIn) {
    if (containedIn === void 0) { containedIn = new Set(); }
    var input = inputs[0];
    if (containedIn.has(input)) {
        throw new Error('Circular references are not supported.');
    }
    var result = zipFn(inputs);
    if (result.recurse && result.value !== null) {
        throw new Error('A deep zip function may not return both a value and recurse=true.');
    }
    if (!result.recurse) {
        return result.value;
    }
    else if (isIterable(input)) {
        var mappedIterable = Array.isArray(input) ? [] : {};
        containedIn.add(input);
        var _loop_1 = function (k) {
            var children = inputs.map(function (x) { return x[k]; });
            var childResult = deepZipInternal(children, zipFn, containedIn);
            mappedIterable[k] = childResult;
        };
        for (var k in input) {
            _loop_1(k);
        }
        containedIn.delete(input);
        return mappedIterable;
    }
    else {
        throw new Error("Can't recurse into non-iterable type: " + input);
    }
}
function zipToList(x) {
    if (x === null) {
        return null;
    }
    if (isIterable(x[0])) {
        return { value: null, recurse: true };
    }
    else {
        return { value: x, recurse: false };
    }
}
exports.zipToList = zipToList;
function deepMapAndAwaitAll(input, mapFn) {
    return __awaiter(this, void 0, void 0, function () {
        var seen, _i, _a, key, value, mappedValue, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    seen = new Map();
                    deepMapInternal(input, mapFn, seen);
                    _i = 0, _a = Array.from(seen.keys());
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    key = _a[_i];
                    value = seen.get(key);
                    if (!(value instanceof Promise)) return [3, 3];
                    return [4, value];
                case 2:
                    mappedValue = _b.sent();
                    seen.set(key, mappedValue);
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4:
                    result = deepMapInternal(input, mapFn, seen);
                    return [2, result];
            }
        });
    });
}
exports.deepMapAndAwaitAll = deepMapAndAwaitAll;
function isIterable(obj) {
    return obj != null &&
        (Array.isArray(obj) ||
            (typeof obj === 'object' && !(obj instanceof tf.Tensor)));
}
exports.isIterable = isIterable;
function isNumericArray(obj) {
    if (obj == null) {
        return false;
    }
    if (!Array.isArray(obj)) {
        return false;
    }
    for (var k in obj) {
        if (typeof obj[k] !== 'number') {
            return false;
        }
    }
    return true;
}
exports.isNumericArray = isNumericArray;
//# sourceMappingURL=deep_map.js.map