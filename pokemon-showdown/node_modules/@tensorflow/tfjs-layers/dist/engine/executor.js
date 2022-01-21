"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var errors_1 = require("../errors");
var generic_utils_1 = require("../utils/generic_utils");
var input_layer_1 = require("./input_layer");
var topology_1 = require("./topology");
function assertFeedCompatibility(key, val) {
    if (key.dtype == null || key.dtype === val.dtype) {
        return val;
    }
    try {
        return tfjs_core_1.cast(val, key.dtype);
    }
    catch (err) {
        throw new errors_1.ValueError("The dtype of the feed (" + val.dtype + ") can not be cast to the dtype " +
            ("of the key '" + key.name + "' (" + key.dtype + ")."));
    }
}
var FeedDict = (function () {
    function FeedDict(feeds) {
        this.id2Value = {};
        this.id2Mask = {};
        this.name2Id = {};
        if (feeds instanceof FeedDict) {
            for (var id in feeds.id2Value) {
                this.id2Value[id] = feeds.id2Value[id];
                if (id in feeds.id2Mask) {
                    this.id2Mask[id] = feeds.id2Mask[id];
                }
            }
        }
        else {
            if (feeds == null) {
                return;
            }
            for (var _i = 0, feeds_1 = feeds; _i < feeds_1.length; _i++) {
                var feed = feeds_1[_i];
                this.add(feed.key, feed.value);
            }
        }
    }
    FeedDict.prototype.add = function (key, value, mask) {
        if (this.id2Value[key.id] == null) {
            this.id2Value[key.id] = assertFeedCompatibility(key, value);
            this.name2Id[key.name] = key.id;
            if (mask != null) {
                this.id2Mask[key.id] = mask;
            }
        }
        else {
            throw new errors_1.ValueError("Duplicate key: name=" + key.name + ", id=" + key.id);
        }
        return this;
    };
    FeedDict.prototype.addFeed = function (feed) {
        this.add(feed.key, feed.value);
    };
    FeedDict.prototype.hasKey = function (key) {
        return this.id2Value[key.id] != null;
    };
    FeedDict.prototype.names = function () {
        return Object.keys(this.name2Id);
    };
    FeedDict.prototype.getValue = function (key) {
        if (key instanceof topology_1.SymbolicTensor) {
            if (this.id2Value[key.id] == null) {
                throw new errors_1.ValueError("Nonexistent key: " + key.name);
            }
            else {
                return this.id2Value[key.id];
            }
        }
        else {
            var id = this.name2Id[key];
            if (id == null) {
                throw new errors_1.ValueError("Feed dict has no SymbolicTensor name: " + key);
            }
            return this.id2Value[id];
        }
    };
    FeedDict.prototype.getMask = function (key) {
        if (key instanceof topology_1.SymbolicTensor) {
            if (this.id2Value[key.id] == null) {
                throw new errors_1.ValueError("Nonexistent key: " + key.name);
            }
            else {
                return this.id2Mask[key.id];
            }
        }
        else {
            var id = this.name2Id[key];
            if (id == null) {
                throw new errors_1.ValueError("Feed dict has no SymbolicTensor name: " + key);
            }
            return this.id2Mask[id];
        }
    };
    FeedDict.prototype.disposeMasks = function () {
        if (this.id2Mask != null) {
            tfjs_core_1.dispose(this.id2Mask);
        }
    };
    return FeedDict;
}());
exports.FeedDict = FeedDict;
var cachedSorted = {};
var cachedRecipientCounts = {};
function execute(fetches, feedDict, kwargs, probe) {
    var training = kwargs == null ? false : kwargs['training'];
    var arrayFetches = Array.isArray(fetches);
    var fetchArray = arrayFetches ? fetches : [fetches];
    var outputNames = fetchArray.map(function (t) { return t.name; });
    var finalOutputs = [];
    var feedNames = feedDict.names();
    for (var _i = 0, outputNames_1 = outputNames; _i < outputNames_1.length; _i++) {
        var outputName = outputNames_1[_i];
        if (feedNames.indexOf(outputName) !== -1) {
            finalOutputs.push(feedDict.getValue(outputName));
        }
        else {
            finalOutputs.push(null);
        }
    }
    if (probe != null) {
        probe.maxNumTensors = -Infinity;
        probe.minNumTensors = Infinity;
    }
    var fetchAndFeedKey = outputNames.join(',') + '|' + feedDict.names().join(',');
    var sorted;
    var recipientCounts;
    if (cachedSorted[fetchAndFeedKey] == null) {
        var out = getTopologicalSortAndRecipientCounts(fetchArray, feedDict);
        sorted = out.sorted;
        recipientCounts = out.recipientCounts;
        cachedSorted[fetchAndFeedKey] = sorted;
        cachedRecipientCounts[fetchAndFeedKey] = recipientCounts;
    }
    sorted = cachedSorted[fetchAndFeedKey];
    recipientCounts = {};
    if (!training) {
        Object.assign(recipientCounts, cachedRecipientCounts[fetchAndFeedKey]);
    }
    var internalFeedDict = new FeedDict(feedDict);
    for (var i = 0; i < sorted.length; ++i) {
        if (probe != null) {
            var numTensors = tfjs_core_1.memory().numTensors;
            if (numTensors > probe.maxNumTensors) {
                probe.maxNumTensors = numTensors;
            }
            if (numTensors < probe.minNumTensors) {
                probe.minNumTensors = numTensors;
            }
        }
        var symbolic = sorted[i];
        var srcLayer = symbolic.sourceLayer;
        if (srcLayer instanceof input_layer_1.InputLayer) {
            continue;
        }
        var inputValues = [];
        var inputMasks = [];
        var tensorsToDispose = [];
        var maskExists = false;
        for (var _a = 0, _b = symbolic.inputs; _a < _b.length; _a++) {
            var input = _b[_a];
            var value = internalFeedDict.getValue(input);
            var mask = internalFeedDict.getMask(input);
            inputValues.push(value);
            inputMasks.push(mask);
            if (mask != null) {
                maskExists = true;
            }
            if (!training) {
                recipientCounts[input.name]--;
                if (recipientCounts[input.name] === 0 && !feedDict.hasKey(input) &&
                    outputNames.indexOf(input.name) === -1 && !value.isDisposed) {
                    tensorsToDispose.push(value);
                }
            }
        }
        if (maskExists) {
            kwargs = kwargs || {};
            kwargs['mask'] = inputMasks[0];
        }
        var outputTensors = generic_utils_1.toList(srcLayer.apply(inputValues, kwargs));
        var outputMask = null;
        if (srcLayer.supportsMasking) {
            outputMask = srcLayer.computeMask(inputValues, inputMasks);
        }
        var layerOutputs = getNodeOutputs(symbolic);
        var outputSymbolicTensors = Array.isArray(layerOutputs) ? layerOutputs : [layerOutputs];
        for (var i_1 = 0; i_1 < outputSymbolicTensors.length; ++i_1) {
            if (!internalFeedDict.hasKey(outputSymbolicTensors[i_1])) {
                internalFeedDict.add(outputSymbolicTensors[i_1], outputTensors[i_1], Array.isArray(outputMask) ? outputMask[0] : outputMask);
            }
            var index = outputNames.indexOf(outputSymbolicTensors[i_1].name);
            if (index !== -1) {
                finalOutputs[index] = outputTensors[i_1];
            }
        }
        if (!training) {
            tfjs_core_1.dispose(tensorsToDispose);
        }
    }
    internalFeedDict.disposeMasks();
    return arrayFetches ? finalOutputs : finalOutputs[0];
}
exports.execute = execute;
function getTopologicalSortAndRecipientCounts(fetches, feedDict) {
    tfjs_core_1.util.assert(fetches != null && fetches.length > 0, "Exepcted at least one fetch, got none");
    var finalSorted = [];
    var finalRecipientMap = {};
    if (fetches.length === 1) {
        var out = getTopologicalSortAndRecipientCountsForOneFetch(fetches[0], feedDict);
        finalSorted = out.sorted;
        finalRecipientMap = out.recipientMap;
    }
    else {
        var visited = new Set();
        for (var _i = 0, fetches_1 = fetches; _i < fetches_1.length; _i++) {
            var fetch_1 = fetches_1[_i];
            var _a = getTopologicalSortAndRecipientCountsForOneFetch(fetch_1, feedDict), sorted = _a.sorted, recipientMap = _a.recipientMap;
            for (var _b = 0, sorted_1 = sorted; _b < sorted_1.length; _b++) {
                var symbolicTensor = sorted_1[_b];
                if (!visited.has(symbolicTensor.name)) {
                    finalSorted.push(symbolicTensor);
                    visited.add(symbolicTensor.name);
                }
            }
            var _loop_1 = function (name_1) {
                if (finalRecipientMap[name_1] == null) {
                    finalRecipientMap[name_1] = new Set();
                }
                recipientMap[name_1].forEach(function (recipient) { return finalRecipientMap[name_1].add(recipient); });
            };
            for (var name_1 in recipientMap) {
                _loop_1(name_1);
            }
        }
    }
    return {
        sorted: finalSorted,
        recipientCounts: recipientMap2Counts(finalRecipientMap)
    };
}
function recipientMap2Counts(recipientMap) {
    var recipientCounts = {};
    for (var name_2 in recipientMap) {
        recipientCounts[name_2] = recipientMap[name_2].size;
    }
    return recipientCounts;
}
function getTopologicalSortAndRecipientCountsForOneFetch(fetch, feedDict) {
    var visited = new Set();
    var sorted = [];
    var recipientMap = {};
    for (var _i = 0, _a = feedDict.names(); _i < _a.length; _i++) {
        var key = _a[_i];
        visited.add(key);
    }
    var stack = [];
    var marks = [];
    stack.push(fetch);
    while (stack.length > 0) {
        var top_1 = stack[stack.length - 1];
        if (visited.has(top_1.name)) {
            stack.pop();
            continue;
        }
        var topIsMarked = marks[marks.length - 1] === stack.length - 1;
        if (top_1.inputs.length === 0 || topIsMarked) {
            stack.pop();
            sorted.push(top_1);
            visited.add(top_1.name);
            if (topIsMarked) {
                marks.pop();
            }
        }
        else {
            marks.push(stack.length - 1);
            for (var _b = 0, _c = top_1.inputs; _b < _c.length; _b++) {
                var input = _c[_b];
                if (recipientMap[input.name] == null) {
                    recipientMap[input.name] = new Set();
                }
                recipientMap[input.name].add(top_1.name);
                if (visited.has(input.name)) {
                    continue;
                }
                stack.push(input);
            }
        }
    }
    return { sorted: sorted, recipientMap: recipientMap };
}
exports.getTopologicalSortAndRecipientCountsForOneFetch = getTopologicalSortAndRecipientCountsForOneFetch;
function getNodeOutputs(fetch) {
    var layerOutputs;
    if (fetch.sourceLayer.inboundNodes.length === 1) {
        layerOutputs = fetch.sourceLayer.output;
    }
    else {
        var nodeIndex = null;
        for (var i = 0; i < fetch.sourceLayer.inboundNodes.length; ++i) {
            for (var _i = 0, _a = fetch.sourceLayer.inboundNodes[i]
                .outputTensors; _i < _a.length; _i++) {
                var outputTensor = _a[_i];
                if (outputTensor.id === fetch.id) {
                    nodeIndex = i;
                    break;
                }
            }
        }
        layerOutputs = fetch.sourceLayer.getOutputAt(nodeIndex);
    }
    return layerOutputs;
}
//# sourceMappingURL=executor.js.map