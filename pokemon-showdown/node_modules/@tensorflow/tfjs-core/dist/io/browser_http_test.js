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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("../index");
var jasmine_util_1 = require("../jasmine_util");
var test_util_1 = require("../test_util");
var browser_http_1 = require("./browser_http");
var modelTopology1 = {
    'class_name': 'Sequential',
    'keras_version': '2.1.4',
    'config': [{
            'class_name': 'Dense',
            'config': {
                'kernel_initializer': {
                    'class_name': 'VarianceScaling',
                    'config': {
                        'distribution': 'uniform',
                        'scale': 1.0,
                        'seed': null,
                        'mode': 'fan_avg'
                    }
                },
                'name': 'dense',
                'kernel_constraint': null,
                'bias_regularizer': null,
                'bias_constraint': null,
                'dtype': 'float32',
                'activation': 'linear',
                'trainable': true,
                'kernel_regularizer': null,
                'bias_initializer': { 'class_name': 'Zeros', 'config': {} },
                'units': 1,
                'batch_input_shape': [null, 3],
                'use_bias': true,
                'activity_regularizer': null
            }
        }],
    'backend': 'tensorflow'
};
var windowFetchSpy;
var fakeResponse = function (body, contentType, path) {
    return ({
        ok: true,
        json: function () {
            return Promise.resolve(JSON.parse(body));
        },
        arrayBuffer: function () {
            var buf = body.buffer ?
                body.buffer :
                body;
            return Promise.resolve(buf);
        },
        headers: { get: function (key) { return contentType; } },
        url: path
    });
};
var setupFakeWeightFiles = function (fileBufferMap, requestInits) {
    windowFetchSpy =
        spyOn(global, 'fetch')
            .and.callFake(function (path, init) {
            if (fileBufferMap[path]) {
                requestInits[path] = init;
                return Promise.resolve(fakeResponse(fileBufferMap[path].data, fileBufferMap[path].contentType, path));
            }
            else {
                return Promise.reject('path not found');
            }
        });
};
jasmine_util_1.describeWithFlags('browserHTTPRequest-load fetch', test_util_1.NODE_ENVS, function () {
    var requestInits;
    var originalFetch;
    beforeEach(function () {
        originalFetch = global.fetch;
        global.fetch = function () { };
        requestInits = {};
    });
    afterAll(function () {
        global.fetch = originalFetch;
    });
    it('1 group, 2 weights, 1 path', function () { return __awaiter(_this, void 0, void 0, function () {
        var weightManifest1, floatData, handler, modelArtifacts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    weightManifest1 = [{
                            paths: ['weightfile0'],
                            weights: [
                                {
                                    name: 'dense/kernel',
                                    shape: [3, 1],
                                    dtype: 'float32',
                                },
                                {
                                    name: 'dense/bias',
                                    shape: [2],
                                    dtype: 'float32',
                                }
                            ]
                        }];
                    floatData = new Float32Array([1, 3, 3, 7, 4]);
                    setupFakeWeightFiles({
                        './model.json': {
                            data: JSON.stringify({
                                modelTopology: modelTopology1,
                                weightsManifest: weightManifest1
                            }),
                            contentType: 'application/json'
                        },
                        './weightfile0': { data: floatData, contentType: 'application/octet-stream' },
                    }, requestInits);
                    handler = tf.io.browserHTTPRequest('./model.json');
                    return [4, handler.load()];
                case 1:
                    modelArtifacts = _a.sent();
                    expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
                    expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
                    expect(new Float32Array(modelArtifacts.weightData)).toEqual(floatData);
                    return [2];
            }
        });
    }); });
    it('throw exception if no fetch polyfill', function () {
        delete global.fetch;
        try {
            tf.io.browserHTTPRequest('./model.json');
        }
        catch (err) {
            expect(err.message)
                .toMatch(/not supported outside the web browser without a fetch polyfill/);
        }
    });
});
jasmine_util_1.describeWithFlags('browserHTTPRequest-save', test_util_1.CHROME_ENVS, function () {
    var weightSpecs1 = [
        {
            name: 'dense/kernel',
            shape: [3, 1],
            dtype: 'float32',
        },
        {
            name: 'dense/bias',
            shape: [1],
            dtype: 'float32',
        }
    ];
    var weightData1 = new ArrayBuffer(16);
    var artifacts1 = {
        modelTopology: modelTopology1,
        weightSpecs: weightSpecs1,
        weightData: weightData1,
    };
    var requestInits = [];
    beforeEach(function () {
        requestInits = [];
        spyOn(window, 'fetch').and.callFake(function (path, init) {
            if (path === 'model-upload-test' || path === 'http://model-upload-test') {
                requestInits.push(init);
                return Promise.resolve(new Response(null, { status: 200 }));
            }
            else {
                return Promise.reject(new Response(null, { status: 404 }));
            }
        });
    });
    it('Save topology and weights, default POST method', function (done) {
        var testStartDate = new Date();
        var handler = tf.io.getSaveHandlers('http://model-upload-test')[0];
        handler.save(artifacts1)
            .then(function (saveResult) {
            expect(saveResult.modelArtifactsInfo.dateSaved.getTime())
                .toBeGreaterThanOrEqual(testStartDate.getTime());
            expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
                .toEqual(JSON.stringify(modelTopology1).length);
            expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
                .toEqual(JSON.stringify(weightSpecs1).length);
            expect(saveResult.modelArtifactsInfo.weightDataBytes)
                .toEqual(weightData1.byteLength);
            expect(requestInits.length).toEqual(1);
            var init = requestInits[0];
            expect(init.method).toEqual('POST');
            var body = init.body;
            var jsonFile = body.get('model.json');
            var jsonFileReader = new FileReader();
            jsonFileReader.onload = function (event) {
                var modelJSON = JSON.parse(event.target.result);
                expect(modelJSON.modelTopology).toEqual(modelTopology1);
                expect(modelJSON.weightsManifest.length).toEqual(1);
                expect(modelJSON.weightsManifest[0].weights).toEqual(weightSpecs1);
                var weightsFile = body.get('model.weights.bin');
                var weightsFileReader = new FileReader();
                weightsFileReader.onload = function (event) {
                    var weightData = event.target.result;
                    expect(new Uint8Array(weightData))
                        .toEqual(new Uint8Array(weightData1));
                    done();
                };
                weightsFileReader.onerror = function (ev) {
                    done.fail(weightsFileReader.error.message);
                };
                weightsFileReader.readAsArrayBuffer(weightsFile);
            };
            jsonFileReader.onerror = function (ev) {
                done.fail(jsonFileReader.error.message);
            };
            jsonFileReader.readAsText(jsonFile);
        })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it('Save topology only, default POST method', function (done) {
        var testStartDate = new Date();
        var handler = tf.io.getSaveHandlers('http://model-upload-test')[0];
        var topologyOnlyArtifacts = { modelTopology: modelTopology1 };
        handler.save(topologyOnlyArtifacts)
            .then(function (saveResult) {
            expect(saveResult.modelArtifactsInfo.dateSaved.getTime())
                .toBeGreaterThanOrEqual(testStartDate.getTime());
            expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
                .toEqual(JSON.stringify(modelTopology1).length);
            expect(saveResult.modelArtifactsInfo.weightSpecsBytes).toEqual(0);
            expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(0);
            expect(requestInits.length).toEqual(1);
            var init = requestInits[0];
            expect(init.method).toEqual('POST');
            var body = init.body;
            var jsonFile = body.get('model.json');
            var jsonFileReader = new FileReader();
            jsonFileReader.onload = function (event) {
                var modelJSON = JSON.parse(event.target.result);
                expect(modelJSON.modelTopology).toEqual(modelTopology1);
                expect(body.get('model.weights.bin')).toEqual(null);
                done();
            };
            jsonFileReader.onerror = function (event) {
                done.fail(jsonFileReader.error.message);
            };
            jsonFileReader.readAsText(jsonFile);
        })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it('Save topology and weights, PUT method, extra headers', function (done) {
        var testStartDate = new Date();
        var handler = tf.io.browserHTTPRequest('model-upload-test', {
            method: 'PUT',
            headers: { 'header_key_1': 'header_value_1', 'header_key_2': 'header_value_2' }
        });
        handler.save(artifacts1)
            .then(function (saveResult) {
            expect(saveResult.modelArtifactsInfo.dateSaved.getTime())
                .toBeGreaterThanOrEqual(testStartDate.getTime());
            expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
                .toEqual(JSON.stringify(modelTopology1).length);
            expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
                .toEqual(JSON.stringify(weightSpecs1).length);
            expect(saveResult.modelArtifactsInfo.weightDataBytes)
                .toEqual(weightData1.byteLength);
            expect(requestInits.length).toEqual(1);
            var init = requestInits[0];
            expect(init.method).toEqual('PUT');
            expect(init.headers).toEqual({
                'header_key_1': 'header_value_1',
                'header_key_2': 'header_value_2'
            });
            var body = init.body;
            var jsonFile = body.get('model.json');
            var jsonFileReader = new FileReader();
            jsonFileReader.onload = function (event) {
                var modelJSON = JSON.parse(event.target.result);
                expect(modelJSON.modelTopology).toEqual(modelTopology1);
                expect(modelJSON.weightsManifest.length).toEqual(1);
                expect(modelJSON.weightsManifest[0].weights).toEqual(weightSpecs1);
                var weightsFile = body.get('model.weights.bin');
                var weightsFileReader = new FileReader();
                weightsFileReader.onload = function (event) {
                    var weightData = event.target.result;
                    expect(new Uint8Array(weightData))
                        .toEqual(new Uint8Array(weightData1));
                    done();
                };
                weightsFileReader.onerror = function (event) {
                    done.fail(weightsFileReader.error.message);
                };
                weightsFileReader.readAsArrayBuffer(weightsFile);
            };
            jsonFileReader.onerror = function (event) {
                done.fail(jsonFileReader.error.message);
            };
            jsonFileReader.readAsText(jsonFile);
        })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it('404 response causes Error', function (done) {
        var handler = tf.io.getSaveHandlers('http://invalid/path')[0];
        handler.save(artifacts1)
            .then(function (saveResult) {
            done.fail('Calling browserHTTPRequest at invalid URL succeeded ' +
                'unexpectedly');
        })
            .catch(function (err) {
            done();
        });
    });
    it('getLoadHandlers with one URL string', function () {
        var handlers = tf.io.getLoadHandlers('http://foo/model.json');
        expect(handlers.length).toEqual(1);
        expect(handlers[0] instanceof browser_http_1.BrowserHTTPRequest).toEqual(true);
    });
    it('getLoadHandlers with two URL strings', function () {
        var handlers = tf.io.getLoadHandlers(['https://foo/graph.pb', 'https://foo/weights_manifest.json']);
        expect(handlers.length).toEqual(1);
        expect(handlers[0] instanceof browser_http_1.BrowserHTTPRequest).toEqual(true);
    });
    it('Existing body leads to Error', function () {
        expect(function () { return tf.io.browserHTTPRequest('model-upload-test', {
            body: 'existing body'
        }); }).toThrowError(/requestInit is expected to have no pre-existing body/);
    });
    it('Empty, null or undefined URL paths lead to Error', function () {
        expect(function () { return tf.io.browserHTTPRequest(null); })
            .toThrowError(/must not be null, undefined or empty/);
        expect(function () { return tf.io.browserHTTPRequest(undefined); })
            .toThrowError(/must not be null, undefined or empty/);
        expect(function () { return tf.io.browserHTTPRequest(''); })
            .toThrowError(/must not be null, undefined or empty/);
    });
    it('router', function () {
        expect(browser_http_1.httpRequestRouter('http://bar/foo') instanceof browser_http_1.BrowserHTTPRequest)
            .toEqual(true);
        expect(browser_http_1.httpRequestRouter('https://localhost:5000/upload') instanceof
            browser_http_1.BrowserHTTPRequest)
            .toEqual(true);
        expect(browser_http_1.httpRequestRouter('localhost://foo')).toBeNull();
        expect(browser_http_1.httpRequestRouter('foo:5000/bar')).toBeNull();
    });
});
jasmine_util_1.describeWithFlags('parseUrl', test_util_1.BROWSER_ENVS, function () {
    it('should parse url with no suffix', function () {
        var url = 'http://google.com/file';
        var _a = browser_http_1.parseUrl(url), prefix = _a[0], suffix = _a[1];
        expect(prefix).toEqual('http://google.com/');
        expect(suffix).toEqual('');
    });
    it('should parse url with suffix', function () {
        var url = 'http://google.com/file?param=1';
        var _a = browser_http_1.parseUrl(url), prefix = _a[0], suffix = _a[1];
        expect(prefix).toEqual('http://google.com/');
        expect(suffix).toEqual('?param=1');
    });
    it('should parse url with multiple serach params', function () {
        var url = 'http://google.com/a?x=1/file?param=1';
        var _a = browser_http_1.parseUrl(url), prefix = _a[0], suffix = _a[1];
        expect(prefix).toEqual('http://google.com/a?x=1/');
        expect(suffix).toEqual('?param=1');
    });
});
jasmine_util_1.describeWithFlags('browserHTTPRequest-load', test_util_1.BROWSER_ENVS, function () {
    describe('JSON model', function () {
        var requestInits;
        beforeEach(function () {
            requestInits = {};
        });
        it('1 group, 2 weights, 1 path', function () { return __awaiter(_this, void 0, void 0, function () {
            var weightManifest1, floatData, handler, modelArtifacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weightManifest1 = [{
                                paths: ['weightfile0'],
                                weights: [
                                    {
                                        name: 'dense/kernel',
                                        shape: [3, 1],
                                        dtype: 'float32',
                                    },
                                    {
                                        name: 'dense/bias',
                                        shape: [2],
                                        dtype: 'float32',
                                    }
                                ]
                            }];
                        floatData = new Float32Array([1, 3, 3, 7, 4]);
                        setupFakeWeightFiles({
                            './model.json': {
                                data: JSON.stringify({
                                    modelTopology: modelTopology1,
                                    weightsManifest: weightManifest1
                                }),
                                contentType: 'application/json'
                            },
                            './weightfile0': { data: floatData, contentType: 'application/octet-stream' },
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest('./model.json');
                        return [4, handler.load()];
                    case 1:
                        modelArtifacts = _a.sent();
                        expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
                        expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
                        expect(new Float32Array(modelArtifacts.weightData)).toEqual(floatData);
                        expect(Object.keys(requestInits).length).toEqual(2);
                        expect(windowFetchSpy.calls.mostRecent().object).toEqual(window);
                        return [2];
                }
            });
        }); });
        it('1 group, 2 weights, 1 path, with requestInit', function () { return __awaiter(_this, void 0, void 0, function () {
            var weightManifest1, floatData, handler, modelArtifacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weightManifest1 = [{
                                paths: ['weightfile0'],
                                weights: [
                                    {
                                        name: 'dense/kernel',
                                        shape: [3, 1],
                                        dtype: 'float32',
                                    },
                                    {
                                        name: 'dense/bias',
                                        shape: [2],
                                        dtype: 'float32',
                                    }
                                ]
                            }];
                        floatData = new Float32Array([1, 3, 3, 7, 4]);
                        setupFakeWeightFiles({
                            './model.json': {
                                data: JSON.stringify({
                                    modelTopology: modelTopology1,
                                    weightsManifest: weightManifest1
                                }),
                                contentType: 'application/json'
                            },
                            './weightfile0': { data: floatData, contentType: 'application/octet-stream' },
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest('./model.json', { headers: { 'header_key_1': 'header_value_1' } });
                        return [4, handler.load()];
                    case 1:
                        modelArtifacts = _a.sent();
                        expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
                        expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
                        expect(new Float32Array(modelArtifacts.weightData)).toEqual(floatData);
                        expect(Object.keys(requestInits).length).toEqual(2);
                        expect(Object.keys(requestInits).length).toEqual(2);
                        expect(requestInits['./model.json'].headers['header_key_1'])
                            .toEqual('header_value_1');
                        expect(requestInits['./weightfile0'].headers['header_key_1'])
                            .toEqual('header_value_1');
                        expect(windowFetchSpy.calls.mostRecent().object).toEqual(window);
                        return [2];
                }
            });
        }); });
        it('1 group, 2 weight, 2 paths', function () { return __awaiter(_this, void 0, void 0, function () {
            var weightManifest1, floatData1, floatData2, handler, modelArtifacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weightManifest1 = [{
                                paths: ['weightfile0', 'weightfile1'],
                                weights: [
                                    {
                                        name: 'dense/kernel',
                                        shape: [3, 1],
                                        dtype: 'float32',
                                    },
                                    {
                                        name: 'dense/bias',
                                        shape: [2],
                                        dtype: 'float32',
                                    }
                                ]
                            }];
                        floatData1 = new Float32Array([1, 3, 3]);
                        floatData2 = new Float32Array([7, 4]);
                        setupFakeWeightFiles({
                            './model.json': {
                                data: JSON.stringify({
                                    modelTopology: modelTopology1,
                                    weightsManifest: weightManifest1
                                }),
                                contentType: 'application/json'
                            },
                            './weightfile0': { data: floatData1, contentType: 'application/octet-stream' },
                            './weightfile1': { data: floatData2, contentType: 'application/octet-stream' }
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest('./model.json');
                        return [4, handler.load()];
                    case 1:
                        modelArtifacts = _a.sent();
                        expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
                        expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
                        expect(new Float32Array(modelArtifacts.weightData))
                            .toEqual(new Float32Array([1, 3, 3, 7, 4]));
                        return [2];
                }
            });
        }); });
        it('2 groups, 2 weight, 2 paths', function () { return __awaiter(_this, void 0, void 0, function () {
            var weightsManifest, floatData1, floatData2, handler, modelArtifacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weightsManifest = [
                            {
                                paths: ['weightfile0'],
                                weights: [{
                                        name: 'dense/kernel',
                                        shape: [3, 1],
                                        dtype: 'float32',
                                    }]
                            },
                            {
                                paths: ['weightfile1'],
                                weights: [{
                                        name: 'dense/bias',
                                        shape: [2],
                                        dtype: 'float32',
                                    }],
                            }
                        ];
                        floatData1 = new Float32Array([1, 3, 3]);
                        floatData2 = new Float32Array([7, 4]);
                        setupFakeWeightFiles({
                            './model.json': {
                                data: JSON.stringify({ modelTopology: modelTopology1, weightsManifest: weightsManifest }),
                                contentType: 'application/json'
                            },
                            './weightfile0': { data: floatData1, contentType: 'application/octet-stream' },
                            './weightfile1': { data: floatData2, contentType: 'application/octet-stream' }
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest('./model.json');
                        return [4, handler.load()];
                    case 1:
                        modelArtifacts = _a.sent();
                        expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
                        expect(modelArtifacts.weightSpecs)
                            .toEqual(weightsManifest[0].weights.concat(weightsManifest[1].weights));
                        expect(new Float32Array(modelArtifacts.weightData))
                            .toEqual(new Float32Array([1, 3, 3, 7, 4]));
                        return [2];
                }
            });
        }); });
        it('2 groups, 2 weight, 2 paths, Int32 and Uint8 Data', function () { return __awaiter(_this, void 0, void 0, function () {
            var weightsManifest, floatData1, floatData2, handler, modelArtifacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weightsManifest = [
                            {
                                paths: ['weightfile0'],
                                weights: [{
                                        name: 'fooWeight',
                                        shape: [3, 1],
                                        dtype: 'int32',
                                    }]
                            },
                            {
                                paths: ['weightfile1'],
                                weights: [{
                                        name: 'barWeight',
                                        shape: [2],
                                        dtype: 'bool',
                                    }],
                            }
                        ];
                        floatData1 = new Int32Array([1, 3, 3]);
                        floatData2 = new Uint8Array([7, 4]);
                        setupFakeWeightFiles({
                            'path1/model.json': {
                                data: JSON.stringify({ modelTopology: modelTopology1, weightsManifest: weightsManifest }),
                                contentType: 'application/json'
                            },
                            'path1/weightfile0': { data: floatData1, contentType: 'application/octet-stream' },
                            'path1/weightfile1': { data: floatData2, contentType: 'application/octet-stream' }
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest('path1/model.json');
                        return [4, handler.load()];
                    case 1:
                        modelArtifacts = _a.sent();
                        expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
                        expect(modelArtifacts.weightSpecs)
                            .toEqual(weightsManifest[0].weights.concat(weightsManifest[1].weights));
                        expect(new Int32Array(modelArtifacts.weightData.slice(0, 12)))
                            .toEqual(new Int32Array([1, 3, 3]));
                        expect(new Uint8Array(modelArtifacts.weightData.slice(12, 14)))
                            .toEqual(new Uint8Array([7, 4]));
                        return [2];
                }
            });
        }); });
        it('topology only', function () { return __awaiter(_this, void 0, void 0, function () {
            var handler, modelArtifacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setupFakeWeightFiles({
                            './model.json': {
                                data: JSON.stringify({ modelTopology: modelTopology1 }),
                                contentType: 'application/json'
                            },
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest('./model.json');
                        return [4, handler.load()];
                    case 1:
                        modelArtifacts = _a.sent();
                        expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
                        expect(modelArtifacts.weightSpecs).toBeUndefined();
                        expect(modelArtifacts.weightData).toBeUndefined();
                        return [2];
                }
            });
        }); });
        it('weights only', function () { return __awaiter(_this, void 0, void 0, function () {
            var weightsManifest, floatData1, floatData2, handler, modelArtifacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weightsManifest = [
                            {
                                paths: ['weightfile0'],
                                weights: [{
                                        name: 'fooWeight',
                                        shape: [3, 1],
                                        dtype: 'int32',
                                    }]
                            },
                            {
                                paths: ['weightfile1'],
                                weights: [{
                                        name: 'barWeight',
                                        shape: [2],
                                        dtype: 'float32',
                                    }],
                            }
                        ];
                        floatData1 = new Int32Array([1, 3, 3]);
                        floatData2 = new Float32Array([-7, -4]);
                        setupFakeWeightFiles({
                            'path1/model.json': {
                                data: JSON.stringify({ weightsManifest: weightsManifest }),
                                contentType: 'application/json'
                            },
                            'path1/weightfile0': { data: floatData1, contentType: 'application/octet-stream' },
                            'path1/weightfile1': { data: floatData2, contentType: 'application/octet-stream' }
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest('path1/model.json');
                        return [4, handler.load()];
                    case 1:
                        modelArtifacts = _a.sent();
                        expect(modelArtifacts.modelTopology).toBeUndefined();
                        expect(modelArtifacts.weightSpecs)
                            .toEqual(weightsManifest[0].weights.concat(weightsManifest[1].weights));
                        expect(new Int32Array(modelArtifacts.weightData.slice(0, 12)))
                            .toEqual(new Int32Array([1, 3, 3]));
                        expect(new Float32Array(modelArtifacts.weightData.slice(12, 20)))
                            .toEqual(new Float32Array([-7, -4]));
                        return [2];
                }
            });
        }); });
        it('Missing modelTopology and weightsManifest leads to error', function (done) { return __awaiter(_this, void 0, void 0, function () {
            var handler;
            return __generator(this, function (_a) {
                setupFakeWeightFiles({
                    'path1/model.json': { data: JSON.stringify({}), contentType: 'application/json' }
                }, requestInits);
                handler = tf.io.browserHTTPRequest('path1/model.json');
                handler.load()
                    .then(function (modelTopology1) {
                    done.fail('Loading from missing modelTopology and weightsManifest ' +
                        'succeeded unexpectedly.');
                })
                    .catch(function (err) {
                    expect(err.message)
                        .toMatch(/contains neither model topology or manifest/);
                    done();
                });
                return [2];
            });
        }); });
        it('with fetch rejection leads to error', function (done) { return __awaiter(_this, void 0, void 0, function () {
            var handler, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setupFakeWeightFiles({
                            'path1/model.json': { data: JSON.stringify({}), contentType: 'text/html' }
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest('path2/model.json');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, handler.load()];
                    case 2:
                        data = _a.sent();
                        expect(data).toBeDefined();
                        done.fail('Loading with fetch rejection succeeded unexpectedly.');
                        return [3, 4];
                    case 3:
                        err_1 = _a.sent();
                        expect(err_1.message).toMatch(/Request for path2\/model.json failed /);
                        done();
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
    });
    describe('Binary model', function () {
        var requestInits;
        var modelData;
        beforeEach(function () {
            requestInits = {};
            modelData = new ArrayBuffer(5);
        });
        it('1 group, 2 weights, 1 path', function (done) {
            var weightManifest1 = [{
                    paths: ['weightfile0'],
                    weights: [
                        {
                            name: 'dense/kernel',
                            shape: [3, 1],
                            dtype: 'float32',
                        },
                        {
                            name: 'dense/bias',
                            shape: [2],
                            dtype: 'float32',
                        }
                    ]
                }];
            var floatData = new Float32Array([1, 3, 3, 7, 4]);
            setupFakeWeightFiles({
                './model.pb': { data: modelData, contentType: 'application/octet-stream' },
                './weights_manifest.json': {
                    data: JSON.stringify(weightManifest1),
                    contentType: 'application/json'
                },
                './weightfile0': { data: floatData, contentType: 'application/octet-stream' },
            }, requestInits);
            var handler = tf.io.browserHTTPRequest(['./model.pb', './weights_manifest.json']);
            handler.load()
                .then(function (modelArtifacts) {
                expect(modelArtifacts.modelTopology).toEqual(modelData);
                expect(modelArtifacts.weightSpecs)
                    .toEqual(weightManifest1[0].weights);
                expect(new Float32Array(modelArtifacts.weightData))
                    .toEqual(floatData);
                expect(Object.keys(requestInits).length).toEqual(3);
                done();
            })
                .catch(function (err) { return done.fail(err.stack); });
        });
        it('1 group, 2 weights, 1 path with suffix', function () { return __awaiter(_this, void 0, void 0, function () {
            var weightManifest1, floatData, handler, modelArtifacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weightManifest1 = [{
                                paths: ['weightfile0'],
                                weights: [
                                    {
                                        name: 'dense/kernel',
                                        shape: [3, 1],
                                        dtype: 'float32',
                                    },
                                    {
                                        name: 'dense/bias',
                                        shape: [2],
                                        dtype: 'float32',
                                    }
                                ]
                            }];
                        floatData = new Float32Array([1, 3, 3, 7, 4]);
                        setupFakeWeightFiles({
                            './model.pb?tfjs-format=file': { data: modelData, contentType: 'application/octet-stream' },
                            './weights_manifest.json?tfjs-format=file': {
                                data: JSON.stringify(weightManifest1),
                                contentType: 'application/json'
                            },
                            './weightfile0?tfjs-format=file': { data: floatData, contentType: 'application/octet-stream' },
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest([
                            './model.pb?tfjs-format=file',
                            './weights_manifest.json?tfjs-format=file'
                        ]);
                        return [4, handler.load()];
                    case 1:
                        modelArtifacts = _a.sent();
                        expect(modelArtifacts.modelTopology).toEqual(modelData);
                        expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
                        expect(new Float32Array(modelArtifacts.weightData)).toEqual(floatData);
                        expect(Object.keys(requestInits).length).toEqual(3);
                        return [2];
                }
            });
        }); });
        it('1 group, 2 weights, 1 path, with requestInit', function () { return __awaiter(_this, void 0, void 0, function () {
            var weightManifest1, floatData, handler, modelArtifacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weightManifest1 = [{
                                paths: ['weightfile0'],
                                weights: [
                                    {
                                        name: 'dense/kernel',
                                        shape: [3, 1],
                                        dtype: 'float32',
                                    },
                                    {
                                        name: 'dense/bias',
                                        shape: [2],
                                        dtype: 'float32',
                                    }
                                ]
                            }];
                        floatData = new Float32Array([1, 3, 3, 7, 4]);
                        setupFakeWeightFiles({
                            './model.pb': { data: modelData, contentType: 'application/octet-stream' },
                            './weights_manifest.json': {
                                data: JSON.stringify(weightManifest1),
                                contentType: 'application/json'
                            },
                            './weightfile0': { data: floatData, contentType: 'application/octet-stream' },
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest(['./model.pb', './weights_manifest.json'], { headers: { 'header_key_1': 'header_value_1' } });
                        return [4, handler.load()];
                    case 1:
                        modelArtifacts = _a.sent();
                        expect(modelArtifacts.modelTopology).toEqual(modelData);
                        expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
                        expect(new Float32Array(modelArtifacts.weightData)).toEqual(floatData);
                        expect(Object.keys(requestInits).length).toEqual(3);
                        expect(requestInits['./model.pb'].headers['header_key_1'])
                            .toEqual('header_value_1');
                        expect(requestInits['./weights_manifest.json'].headers['header_key_1'])
                            .toEqual('header_value_1');
                        expect(requestInits['./weightfile0'].headers['header_key_1'])
                            .toEqual('header_value_1');
                        return [2];
                }
            });
        }); });
        it('1 group, 2 weight, 2 paths', function () { return __awaiter(_this, void 0, void 0, function () {
            var weightManifest1, floatData1, floatData2, handler, modelArtifacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weightManifest1 = [{
                                paths: ['weightfile0', 'weightfile1'],
                                weights: [
                                    {
                                        name: 'dense/kernel',
                                        shape: [3, 1],
                                        dtype: 'float32',
                                    },
                                    {
                                        name: 'dense/bias',
                                        shape: [2],
                                        dtype: 'float32',
                                    }
                                ]
                            }];
                        floatData1 = new Float32Array([1, 3, 3]);
                        floatData2 = new Float32Array([7, 4]);
                        setupFakeWeightFiles({
                            './model.pb': { data: modelData, contentType: 'application/octet-stream' },
                            './weights_manifest.json': {
                                data: JSON.stringify(weightManifest1),
                                contentType: 'application/json'
                            },
                            './weightfile0': { data: floatData1, contentType: 'application/octet-stream' },
                            './weightfile1': { data: floatData2, contentType: 'application/octet-stream' },
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest(['./model.pb', './weights_manifest.json']);
                        return [4, handler.load()];
                    case 1:
                        modelArtifacts = _a.sent();
                        expect(modelArtifacts.modelTopology).toEqual(modelData);
                        expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
                        expect(new Float32Array(modelArtifacts.weightData))
                            .toEqual(new Float32Array([1, 3, 3, 7, 4]));
                        return [2];
                }
            });
        }); });
        it('2 groups, 2 weight, 2 paths', function () { return __awaiter(_this, void 0, void 0, function () {
            var weightsManifest, floatData1, floatData2, handler, modelArtifacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weightsManifest = [
                            {
                                paths: ['weightfile0'],
                                weights: [{
                                        name: 'dense/kernel',
                                        shape: [3, 1],
                                        dtype: 'float32',
                                    }]
                            },
                            {
                                paths: ['weightfile1'],
                                weights: [{
                                        name: 'dense/bias',
                                        shape: [2],
                                        dtype: 'float32',
                                    }],
                            }
                        ];
                        floatData1 = new Float32Array([1, 3, 3]);
                        floatData2 = new Float32Array([7, 4]);
                        setupFakeWeightFiles({
                            './model.pb': { data: modelData, contentType: 'application/octet-stream' },
                            './weights_manifest.json': {
                                data: JSON.stringify(weightsManifest),
                                contentType: 'application/json'
                            },
                            './weightfile0': { data: floatData1, contentType: 'application/octet-stream' },
                            './weightfile1': { data: floatData2, contentType: 'application/octet-stream' },
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest(['./model.pb', './weights_manifest.json']);
                        return [4, handler.load()];
                    case 1:
                        modelArtifacts = _a.sent();
                        expect(modelArtifacts.modelTopology).toEqual(modelData);
                        expect(modelArtifacts.weightSpecs)
                            .toEqual(weightsManifest[0].weights.concat(weightsManifest[1].weights));
                        expect(new Float32Array(modelArtifacts.weightData))
                            .toEqual(new Float32Array([1, 3, 3, 7, 4]));
                        return [2];
                }
            });
        }); });
        it('2 groups, 2 weight, 2 paths, Int32 and Uint8 Data', function () { return __awaiter(_this, void 0, void 0, function () {
            var weightsManifest, floatData1, floatData2, handler, modelArtifacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weightsManifest = [
                            {
                                paths: ['weightfile0'],
                                weights: [{
                                        name: 'fooWeight',
                                        shape: [3, 1],
                                        dtype: 'int32',
                                    }]
                            },
                            {
                                paths: ['weightfile1'],
                                weights: [{
                                        name: 'barWeight',
                                        shape: [2],
                                        dtype: 'bool',
                                    }],
                            }
                        ];
                        floatData1 = new Int32Array([1, 3, 3]);
                        floatData2 = new Uint8Array([7, 4]);
                        setupFakeWeightFiles({
                            'path1/model.pb': { data: modelData, contentType: 'application/octet-stream' },
                            'path2/weights_manifest.json': {
                                data: JSON.stringify(weightsManifest),
                                contentType: 'application/json'
                            },
                            'path2/weightfile0': { data: floatData1, contentType: 'application/octet-stream' },
                            'path2/weightfile1': { data: floatData2, contentType: 'application/octet-stream' },
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest(['path1/model.pb', 'path2/weights_manifest.json']);
                        return [4, handler.load()];
                    case 1:
                        modelArtifacts = _a.sent();
                        expect(modelArtifacts.modelTopology).toEqual(modelData);
                        expect(modelArtifacts.weightSpecs)
                            .toEqual(weightsManifest[0].weights.concat(weightsManifest[1].weights));
                        expect(new Int32Array(modelArtifacts.weightData.slice(0, 12)))
                            .toEqual(new Int32Array([1, 3, 3]));
                        expect(new Uint8Array(modelArtifacts.weightData.slice(12, 14)))
                            .toEqual(new Uint8Array([7, 4]));
                        return [2];
                }
            });
        }); });
        it('2 groups, 2 weight, weight path prefix, Int32 and Uint8 Data', function () { return __awaiter(_this, void 0, void 0, function () {
            var weightsManifest, floatData1, floatData2, handler, modelArtifacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weightsManifest = [
                            {
                                paths: ['weightfile0'],
                                weights: [{
                                        name: 'fooWeight',
                                        shape: [3, 1],
                                        dtype: 'int32',
                                    }]
                            },
                            {
                                paths: ['weightfile1'],
                                weights: [{
                                        name: 'barWeight',
                                        shape: [2],
                                        dtype: 'bool',
                                    }],
                            }
                        ];
                        floatData1 = new Int32Array([1, 3, 3]);
                        floatData2 = new Uint8Array([7, 4]);
                        setupFakeWeightFiles({
                            'path1/model.pb': { data: modelData, contentType: 'application/octet-stream' },
                            'path2/weights_manifest.json': {
                                data: JSON.stringify(weightsManifest),
                                contentType: 'application/json'
                            },
                            'path3/weightfile0': { data: floatData1, contentType: 'application/octet-stream' },
                            'path3/weightfile1': { data: floatData2, contentType: 'application/octet-stream' },
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest(['path1/model.pb', 'path2/weights_manifest.json'], {}, 'path3/');
                        return [4, handler.load()];
                    case 1:
                        modelArtifacts = _a.sent();
                        expect(modelArtifacts.modelTopology).toEqual(modelData);
                        expect(modelArtifacts.weightSpecs)
                            .toEqual(weightsManifest[0].weights.concat(weightsManifest[1].weights));
                        expect(new Int32Array(modelArtifacts.weightData.slice(0, 12)))
                            .toEqual(new Int32Array([1, 3, 3]));
                        expect(new Uint8Array(modelArtifacts.weightData.slice(12, 14)))
                            .toEqual(new Uint8Array([7, 4]));
                        return [2];
                }
            });
        }); });
        it('the url path length is not 2 should leads to error', function () {
            expect(function () { return tf.io.browserHTTPRequest(['path1/model.pb']); }).toThrow();
        });
        it('with fetch rejection leads to error', function (done) { return __awaiter(_this, void 0, void 0, function () {
            var handler, data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setupFakeWeightFiles({
                            'path1/model.pb': { data: JSON.stringify({}), contentType: 'text/html' }
                        }, requestInits);
                        handler = tf.io.browserHTTPRequest(['path1/model.pb', 'path2/weights_manifest.json']);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, handler.load()];
                    case 2:
                        data = _a.sent();
                        expect(data).toBeDefined();
                        done.fail('Loading with fetch rejection ' +
                            'succeeded unexpectedly.');
                        return [3, 4];
                    case 3:
                        err_2 = _a.sent();
                        expect(err_2.message)
                            .toMatch(/Request for path2\/weights_manifest.json failed /);
                        done();
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
    });
    it('Overriding BrowserHTTPRequest fetchFunc', function () { return __awaiter(_this, void 0, void 0, function () {
        function customFetch(input, init) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    fetchInputs.push(input);
                    fetchInits.push(init);
                    if (input === './model.json') {
                        return [2, new Response(JSON.stringify({
                                modelTopology: modelTopology1,
                                weightsManifest: weightManifest1
                            }), { status: 200, headers: { 'content-type': 'application/json' } })];
                    }
                    else if (input === './weightfile0') {
                        return [2, new Response(floatData, {
                                status: 200,
                                headers: { 'content-type': 'application/octet-stream' }
                            })];
                    }
                    else {
                        return [2, new Response(null, { status: 404 })];
                    }
                    return [2];
                });
            });
        }
        var weightManifest1, floatData, fetchInputs, fetchInits, handler, modelArtifacts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    weightManifest1 = [{
                            paths: ['weightfile0'],
                            weights: [
                                {
                                    name: 'dense/kernel',
                                    shape: [3, 1],
                                    dtype: 'float32',
                                },
                                {
                                    name: 'dense/bias',
                                    shape: [2],
                                    dtype: 'float32',
                                }
                            ]
                        }];
                    floatData = new Float32Array([1, 3, 3, 7, 4]);
                    fetchInputs = [];
                    fetchInits = [];
                    handler = tf.io.browserHTTPRequest('./model.json', { credentials: 'include' }, null, customFetch);
                    return [4, handler.load()];
                case 1:
                    modelArtifacts = _a.sent();
                    expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
                    expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
                    expect(new Float32Array(modelArtifacts.weightData)).toEqual(floatData);
                    expect(fetchInputs).toEqual(['./model.json', './weightfile0']);
                    expect(fetchInits.length).toEqual(2);
                    expect(fetchInits[0].credentials).toEqual('include');
                    expect(fetchInits[1].credentials).toEqual('include');
                    return [2];
            }
        });
    }); });
});
//# sourceMappingURL=browser_http_test.js.map