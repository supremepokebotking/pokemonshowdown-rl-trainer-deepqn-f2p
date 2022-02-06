"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var utils_1 = require("./utils");
exports.executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'fft': {
            return [tfc.fft(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'ifft': {
            return [tfc.ifft(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'rfft': {
            return [tfc.rfft(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'irfft': {
            return [tfc.irfft(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
exports.CATEGORY = 'spectral';
//# sourceMappingURL=spectral_executor.js.map