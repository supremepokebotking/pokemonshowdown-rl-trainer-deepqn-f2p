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
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var file_chunk_iterator_1 = require("./file_chunk_iterator");
function urlChunkIterator(url, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var response, blob, nodeFetch, unitArray;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!tfjs_core_1.ENV.get('IS_BROWSER')) return [3, 5];
                    return [4, fetch(url)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3, 3];
                    return [4, response.blob()];
                case 2:
                    blob = _a.sent();
                    return [2, new file_chunk_iterator_1.FileChunkIterator(blob, options)];
                case 3: throw new Error(response.statusText);
                case 4: return [3, 9];
                case 5:
                    nodeFetch = require('node-fetch');
                    if (typeof url !== 'string') {
                        throw new Error('URL must be a string. Request objects are not supported ' +
                            'in the node.js environment yet.');
                    }
                    return [4, nodeFetch(url)];
                case 6:
                    response = _a.sent();
                    if (!response.ok) return [3, 8];
                    return [4, response.buffer()];
                case 7:
                    unitArray = _a.sent();
                    return [2, new file_chunk_iterator_1.FileChunkIterator(unitArray, options)];
                case 8: throw new Error(response.statusText);
                case 9: return [2];
            }
        });
    });
}
exports.urlChunkIterator = urlChunkIterator;
//# sourceMappingURL=url_chunk_iterator.js.map