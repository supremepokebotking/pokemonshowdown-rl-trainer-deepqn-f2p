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
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var state_1 = require("./backend/state");
var K = require("./backend/tfjs_backend");
var common_1 = require("./common");
var errors_1 = require("./errors");
var initializer_config_1 = require("./keras_format/initializer_config");
var generic_utils_1 = require("./utils/generic_utils");
var math_utils_1 = require("./utils/math_utils");
function checkFanMode(value) {
    generic_utils_1.checkStringTypeUnionValue(initializer_config_1.VALID_FAN_MODE_VALUES, 'FanMode', value);
}
exports.checkFanMode = checkFanMode;
function checkDistribution(value) {
    generic_utils_1.checkStringTypeUnionValue(initializer_config_1.VALID_DISTRIBUTION_VALUES, 'Distribution', value);
}
exports.checkDistribution = checkDistribution;
var Initializer = (function (_super) {
    __extends(Initializer, _super);
    function Initializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Initializer.prototype.fromConfigUsesCustomObjects = function () {
        return false;
    };
    Initializer.prototype.getConfig = function () {
        return {};
    };
    return Initializer;
}(tfjs_core_1.serialization.Serializable));
exports.Initializer = Initializer;
var Zeros = (function (_super) {
    __extends(Zeros, _super);
    function Zeros() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Zeros.prototype.apply = function (shape, dtype) {
        return tfjs_core_1.zeros(shape, dtype);
    };
    Zeros.className = 'Zeros';
    return Zeros;
}(Initializer));
exports.Zeros = Zeros;
tfjs_core_1.serialization.registerClass(Zeros);
var Ones = (function (_super) {
    __extends(Ones, _super);
    function Ones() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ones.prototype.apply = function (shape, dtype) {
        return tfjs_core_1.ones(shape, dtype);
    };
    Ones.className = 'Ones';
    return Ones;
}(Initializer));
exports.Ones = Ones;
tfjs_core_1.serialization.registerClass(Ones);
var Constant = (function (_super) {
    __extends(Constant, _super);
    function Constant(args) {
        var _this = _super.call(this) || this;
        if (typeof args !== 'object') {
            throw new errors_1.ValueError("Expected argument of type ConstantConfig but got " + args);
        }
        if (args.value === undefined) {
            throw new errors_1.ValueError("config must have value set but got " + args);
        }
        _this.value = args.value;
        return _this;
    }
    Constant.prototype.apply = function (shape, dtype) {
        var _this = this;
        return tfjs_core_1.tidy(function () { return tfjs_core_1.mul(tfjs_core_1.scalar(_this.value), tfjs_core_1.ones(shape, dtype)); });
    };
    Constant.prototype.getConfig = function () {
        return {
            value: this.value,
        };
    };
    Constant.className = 'Constant';
    return Constant;
}(Initializer));
exports.Constant = Constant;
tfjs_core_1.serialization.registerClass(Constant);
var RandomUniform = (function (_super) {
    __extends(RandomUniform, _super);
    function RandomUniform(args) {
        var _this = _super.call(this) || this;
        _this.DEFAULT_MINVAL = -0.05;
        _this.DEFAULT_MAXVAL = 0.05;
        _this.minval = args.minval || _this.DEFAULT_MINVAL;
        _this.maxval = args.maxval || _this.DEFAULT_MAXVAL;
        _this.seed = args.seed;
        return _this;
    }
    RandomUniform.prototype.apply = function (shape, dtype) {
        return tfjs_core_1.randomUniform(shape, this.minval, this.maxval, dtype);
    };
    RandomUniform.prototype.getConfig = function () {
        return { minval: this.minval, maxval: this.maxval, seed: this.seed };
    };
    RandomUniform.className = 'RandomUniform';
    return RandomUniform;
}(Initializer));
exports.RandomUniform = RandomUniform;
tfjs_core_1.serialization.registerClass(RandomUniform);
var RandomNormal = (function (_super) {
    __extends(RandomNormal, _super);
    function RandomNormal(args) {
        var _this = _super.call(this) || this;
        _this.DEFAULT_MEAN = 0.;
        _this.DEFAULT_STDDEV = 0.05;
        _this.mean = args.mean || _this.DEFAULT_MEAN;
        _this.stddev = args.stddev || _this.DEFAULT_STDDEV;
        _this.seed = args.seed;
        return _this;
    }
    RandomNormal.prototype.apply = function (shape, dtype) {
        dtype = dtype || 'float32';
        if (dtype !== 'float32' && dtype !== 'int32') {
            throw new errors_1.NotImplementedError("randomNormal does not support dType " + dtype + ".");
        }
        return K.randomNormal(shape, this.mean, this.stddev, dtype, this.seed);
    };
    RandomNormal.prototype.getConfig = function () {
        return { mean: this.mean, stddev: this.stddev, seed: this.seed };
    };
    RandomNormal.className = 'RandomNormal';
    return RandomNormal;
}(Initializer));
exports.RandomNormal = RandomNormal;
tfjs_core_1.serialization.registerClass(RandomNormal);
var TruncatedNormal = (function (_super) {
    __extends(TruncatedNormal, _super);
    function TruncatedNormal(args) {
        var _this = _super.call(this) || this;
        _this.DEFAULT_MEAN = 0.;
        _this.DEFAULT_STDDEV = 0.05;
        _this.mean = args.mean || _this.DEFAULT_MEAN;
        _this.stddev = args.stddev || _this.DEFAULT_STDDEV;
        _this.seed = args.seed;
        return _this;
    }
    TruncatedNormal.prototype.apply = function (shape, dtype) {
        dtype = dtype || 'float32';
        if (dtype !== 'float32' && dtype !== 'int32') {
            throw new errors_1.NotImplementedError("truncatedNormal does not support dType " + dtype + ".");
        }
        return tfjs_core_1.truncatedNormal(shape, this.mean, this.stddev, dtype, this.seed);
    };
    TruncatedNormal.prototype.getConfig = function () {
        return { mean: this.mean, stddev: this.stddev, seed: this.seed };
    };
    TruncatedNormal.className = 'TruncatedNormal';
    return TruncatedNormal;
}(Initializer));
exports.TruncatedNormal = TruncatedNormal;
tfjs_core_1.serialization.registerClass(TruncatedNormal);
var Identity = (function (_super) {
    __extends(Identity, _super);
    function Identity(args) {
        var _this = _super.call(this) || this;
        _this.gain = args.gain != null ? tfjs_core_1.scalar(args.gain) : state_1.getScalar(1.0);
        return _this;
    }
    Identity.prototype.apply = function (shape, dtype) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            if (shape.length !== 2 || shape[0] !== shape[1]) {
                throw new errors_1.ValueError('Identity matrix initializer can only be used for' +
                    ' 2D square matrices.');
            }
            else {
                return tfjs_core_1.mul(_this.gain, tfjs_core_1.eye(shape[0]));
            }
        });
    };
    Identity.prototype.getConfig = function () {
        return { gain: this.gain.get() };
    };
    Identity.className = 'Identity';
    return Identity;
}(Initializer));
exports.Identity = Identity;
tfjs_core_1.serialization.registerClass(Identity);
function computeFans(shape, dataFormat) {
    if (dataFormat === void 0) { dataFormat = 'channelsLast'; }
    var fanIn;
    var fanOut;
    common_1.checkDataFormat(dataFormat);
    if (shape.length === 2) {
        fanIn = shape[0];
        fanOut = shape[1];
    }
    else if ([3, 4, 5].indexOf(shape.length) !== -1) {
        if (dataFormat === 'channelsFirst') {
            var receptiveFieldSize = math_utils_1.arrayProd(shape, 2);
            fanIn = shape[1] * receptiveFieldSize;
            fanOut = shape[0] * receptiveFieldSize;
        }
        else if (dataFormat === 'channelsLast') {
            var receptiveFieldSize = math_utils_1.arrayProd(shape, 0, shape.length - 2);
            fanIn = shape[shape.length - 2] * receptiveFieldSize;
            fanOut = shape[shape.length - 1] * receptiveFieldSize;
        }
    }
    else {
        var shapeProd = math_utils_1.arrayProd(shape);
        fanIn = Math.sqrt(shapeProd);
        fanOut = Math.sqrt(shapeProd);
    }
    return [fanIn, fanOut];
}
var VarianceScaling = (function (_super) {
    __extends(VarianceScaling, _super);
    function VarianceScaling(args) {
        var _this = _super.call(this) || this;
        if (args.scale < 0.0) {
            throw new errors_1.ValueError("scale must be a positive float. Got: " + args.scale);
        }
        _this.scale = args.scale == null ? 1.0 : args.scale;
        _this.mode = args.mode;
        checkFanMode(_this.mode);
        _this.distribution = args.distribution;
        checkDistribution(_this.distribution);
        _this.seed = args.seed;
        return _this;
    }
    VarianceScaling.prototype.apply = function (shape, dtype) {
        var fans = computeFans(shape);
        var fanIn = fans[0];
        var fanOut = fans[1];
        var scale = this.scale;
        if (this.mode === 'fanIn') {
            scale /= Math.max(1, fanIn);
        }
        else if (this.mode === 'fanOut') {
            scale /= Math.max(1, fanOut);
        }
        else {
            scale /= Math.max(1, (fanIn + fanOut) / 2);
        }
        if (this.distribution === 'normal') {
            var stddev = Math.sqrt(scale);
            dtype = dtype || 'float32';
            if (dtype !== 'float32' && dtype !== 'int32') {
                throw new errors_1.NotImplementedError(this.getClassName() + " does not support dType " + dtype + ".");
            }
            return tfjs_core_1.truncatedNormal(shape, 0, stddev, dtype, this.seed);
        }
        else {
            var limit = Math.sqrt(3 * scale);
            return tfjs_core_1.randomUniform(shape, -limit, limit, dtype);
        }
    };
    VarianceScaling.prototype.getConfig = function () {
        return {
            scale: this.scale,
            mode: this.mode,
            distribution: this.distribution,
            seed: this.seed
        };
    };
    VarianceScaling.className = 'VarianceScaling';
    return VarianceScaling;
}(Initializer));
exports.VarianceScaling = VarianceScaling;
tfjs_core_1.serialization.registerClass(VarianceScaling);
var GlorotUniform = (function (_super) {
    __extends(GlorotUniform, _super);
    function GlorotUniform(args) {
        return _super.call(this, {
            scale: 1.0,
            mode: 'fanAvg',
            distribution: 'uniform',
            seed: args == null ? null : args.seed
        }) || this;
    }
    GlorotUniform.prototype.getClassName = function () {
        return VarianceScaling.className;
    };
    GlorotUniform.className = 'GlorotUniform';
    return GlorotUniform;
}(VarianceScaling));
exports.GlorotUniform = GlorotUniform;
tfjs_core_1.serialization.registerClass(GlorotUniform);
var GlorotNormal = (function (_super) {
    __extends(GlorotNormal, _super);
    function GlorotNormal(args) {
        return _super.call(this, {
            scale: 1.0,
            mode: 'fanAvg',
            distribution: 'normal',
            seed: args == null ? null : args.seed
        }) || this;
    }
    GlorotNormal.prototype.getClassName = function () {
        return VarianceScaling.className;
    };
    GlorotNormal.className = 'GlorotNormal';
    return GlorotNormal;
}(VarianceScaling));
exports.GlorotNormal = GlorotNormal;
tfjs_core_1.serialization.registerClass(GlorotNormal);
var HeNormal = (function (_super) {
    __extends(HeNormal, _super);
    function HeNormal(args) {
        return _super.call(this, {
            scale: 2.0,
            mode: 'fanIn',
            distribution: 'normal',
            seed: args == null ? null : args.seed
        }) || this;
    }
    HeNormal.prototype.getClassName = function () {
        return VarianceScaling.className;
    };
    HeNormal.className = 'HeNormal';
    return HeNormal;
}(VarianceScaling));
exports.HeNormal = HeNormal;
tfjs_core_1.serialization.registerClass(HeNormal);
var HeUniform = (function (_super) {
    __extends(HeUniform, _super);
    function HeUniform(args) {
        return _super.call(this, {
            scale: 2.0,
            mode: 'fanIn',
            distribution: 'uniform',
            seed: args == null ? null : args.seed
        }) || this;
    }
    HeUniform.prototype.getClassName = function () {
        return VarianceScaling.className;
    };
    HeUniform.className = 'HeUniform';
    return HeUniform;
}(VarianceScaling));
exports.HeUniform = HeUniform;
tfjs_core_1.serialization.registerClass(HeUniform);
var LeCunNormal = (function (_super) {
    __extends(LeCunNormal, _super);
    function LeCunNormal(args) {
        return _super.call(this, {
            scale: 1.0,
            mode: 'fanIn',
            distribution: 'normal',
            seed: args == null ? null : args.seed
        }) || this;
    }
    LeCunNormal.prototype.getClassName = function () {
        return VarianceScaling.className;
    };
    LeCunNormal.className = 'LeCunNormal';
    return LeCunNormal;
}(VarianceScaling));
exports.LeCunNormal = LeCunNormal;
tfjs_core_1.serialization.registerClass(LeCunNormal);
var LeCunUniform = (function (_super) {
    __extends(LeCunUniform, _super);
    function LeCunUniform(args) {
        return _super.call(this, {
            scale: 1.0,
            mode: 'fanIn',
            distribution: 'uniform',
            seed: args == null ? null : args.seed
        }) || this;
    }
    LeCunUniform.prototype.getClassName = function () {
        return VarianceScaling.className;
    };
    LeCunUniform.className = 'LeCunNormal';
    return LeCunUniform;
}(VarianceScaling));
exports.LeCunUniform = LeCunUniform;
tfjs_core_1.serialization.registerClass(LeCunUniform);
var Orthogonal = (function (_super) {
    __extends(Orthogonal, _super);
    function Orthogonal(args) {
        var _this = _super.call(this) || this;
        _this.DEFAULT_GAIN = 1;
        _this.gain = args.gain == null ? _this.DEFAULT_GAIN : args.gain;
        _this.seed = args.seed;
        if (_this.seed != null) {
            throw new errors_1.NotImplementedError('Random seed is not implemented for Orthogonal Initializer yet.');
        }
        return _this;
    }
    Orthogonal.prototype.apply = function (shape, dtype) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            if (shape.length !== 2) {
                throw new errors_1.NotImplementedError('The Orthogonal Initializer does not support non-2D shapes yet.');
            }
            if (shape[0] * shape[1] > 2000) {
                console.warn("Orthogonal initializer is being called on a matrix with more " +
                    ("than 2000 (" + shape[0] * shape[1] + ") elements: ") +
                    "Slowness may result.");
            }
            var normalizedShape = shape[0] > shape[1] ? [shape[1], shape[0]] : shape;
            var a = K.randomNormal(normalizedShape, 0, 1, 'float32');
            var q = tfjs_core_1.linalg.gramSchmidt(a);
            if (shape[0] > shape[1]) {
                q = q.transpose();
            }
            return tfjs_core_1.mul(state_1.getScalar(_this.gain), q);
        });
    };
    Orthogonal.prototype.getConfig = function () {
        return {
            gain: this.gain,
            seed: this.seed,
        };
    };
    Orthogonal.className = 'Orthogonal';
    return Orthogonal;
}(Initializer));
exports.Orthogonal = Orthogonal;
tfjs_core_1.serialization.registerClass(Orthogonal);
exports.INITIALIZER_IDENTIFIER_REGISTRY_SYMBOL_MAP = {
    'constant': 'Constant',
    'glorotNormal': 'GlorotNormal',
    'glorotUniform': 'GlorotUniform',
    'heNormal': 'HeNormal',
    'heUniform': 'HeUniform',
    'identity': 'Identity',
    'leCunNormal': 'LeCunNormal',
    'leCunUniform': 'LeCunUniform',
    'ones': 'Ones',
    'orthogonal': 'Orthogonal',
    'randomNormal': 'RandomNormal',
    'randomUniform': 'RandomUniform',
    'truncatedNormal': 'TruncatedNormal',
    'varianceScaling': 'VarianceScaling',
    'zeros': 'Zeros'
};
function deserializeInitializer(config, customObjects) {
    if (customObjects === void 0) { customObjects = {}; }
    return generic_utils_1.deserializeKerasObject(config, tfjs_core_1.serialization.SerializationMap.getMap().classNameMap, customObjects, 'initializer');
}
function serializeInitializer(initializer) {
    return generic_utils_1.serializeKerasObject(initializer);
}
exports.serializeInitializer = serializeInitializer;
function getInitializer(identifier) {
    if (typeof identifier === 'string') {
        var className = identifier in exports.INITIALIZER_IDENTIFIER_REGISTRY_SYMBOL_MAP ?
            exports.INITIALIZER_IDENTIFIER_REGISTRY_SYMBOL_MAP[identifier] :
            identifier;
        if (className === 'GlorotNormal') {
            return new GlorotNormal();
        }
        else if (className === 'GlorotUniform') {
            return new GlorotUniform();
        }
        else if (className === 'HeNormal') {
            return new HeNormal();
        }
        else if (className === 'HeUniform') {
            return new HeUniform();
        }
        else if (className === 'LeCunNormal') {
            return new LeCunNormal();
        }
        else if (className === 'LeCunUniform') {
            return new LeCunUniform();
        }
        else {
            var config = { className: className, config: {} };
            return deserializeInitializer(config);
        }
    }
    else if (identifier instanceof Initializer) {
        return identifier;
    }
    else {
        return deserializeInitializer(identifier);
    }
}
exports.getInitializer = getInitializer;
//# sourceMappingURL=initializers.js.map