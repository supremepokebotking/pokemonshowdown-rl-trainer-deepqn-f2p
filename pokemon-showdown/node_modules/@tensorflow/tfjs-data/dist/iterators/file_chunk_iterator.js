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
var byte_chunk_iterator_1 = require("./byte_chunk_iterator");
var FileChunkIterator = (function (_super) {
    __extends(FileChunkIterator, _super);
    function FileChunkIterator(file, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.file = file;
        _this.options = options;
        tfjs_core_1.util.assert((file instanceof Uint8Array) ||
            (tfjs_core_1.ENV.get('IS_BROWSER') ?
                (file instanceof File || file instanceof Blob) :
                false), 'FileChunkIterator only supports File, Blob and Uint8Array right now.');
        _this.offset = options.offset || 0;
        _this.chunkSize = options.chunkSize || 1024 * 1024;
        return _this;
    }
    FileChunkIterator.prototype.summary = function () {
        return "FileChunks " + this.file;
    };
    FileChunkIterator.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var chunk, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.offset >= ((this.file instanceof Uint8Array) ?
                            this.file.byteLength :
                            this.file.size)) {
                            return [2, { value: null, done: true }];
                        }
                        chunk = new Promise(function (resolve, reject) {
                            var end = _this.offset + _this.chunkSize;
                            if (_this.file instanceof Uint8Array) {
                                resolve(new Uint8Array(_this.file.slice(_this.offset, end)));
                            }
                            else {
                                var fileReader_1 = new FileReader();
                                fileReader_1.onload = function (event) {
                                    var data = fileReader_1.result;
                                    if (data instanceof ArrayBuffer) {
                                        data = new Uint8Array(data);
                                    }
                                    if (!(data instanceof Uint8Array)) {
                                        return reject(new TypeError('FileReader returned unknown type.'));
                                    }
                                    resolve(data);
                                };
                                fileReader_1.onabort = function (event) {
                                    return reject(new Error('Aborted'));
                                };
                                fileReader_1.onerror = function (event) {
                                    return reject(new Error(event.type));
                                };
                                var slice = _this.file.slice(_this.offset, end);
                                fileReader_1.readAsArrayBuffer(slice);
                            }
                            _this.offset = end;
                        });
                        _a = {};
                        return [4, chunk];
                    case 1: return [2, (_a.value = (_b.sent()), _a.done = false, _a)];
                }
            });
        });
    };
    return FileChunkIterator;
}(byte_chunk_iterator_1.ByteChunkIterator));
exports.FileChunkIterator = FileChunkIterator;
//# sourceMappingURL=file_chunk_iterator.js.map