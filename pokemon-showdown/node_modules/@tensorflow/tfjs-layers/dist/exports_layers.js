"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var input_layer_1 = require("./engine/input_layer");
var topology_1 = require("./engine/topology");
exports.Layer = topology_1.Layer;
var exports_1 = require("./exports");
exports.input = exports_1.input;
var advanced_activations_1 = require("./layers/advanced_activations");
var convolutional_1 = require("./layers/convolutional");
var convolutional_depthwise_1 = require("./layers/convolutional_depthwise");
var core_1 = require("./layers/core");
var embeddings_1 = require("./layers/embeddings");
var merge_1 = require("./layers/merge");
var normalization_1 = require("./layers/normalization");
var padding_1 = require("./layers/padding");
var pooling_1 = require("./layers/pooling");
var recurrent_1 = require("./layers/recurrent");
exports.RNN = recurrent_1.RNN;
exports.RNNCell = recurrent_1.RNNCell;
var wrappers_1 = require("./layers/wrappers");
function inputLayer(args) {
    return new input_layer_1.InputLayer(args);
}
exports.inputLayer = inputLayer;
function elu(args) {
    return new advanced_activations_1.ELU(args);
}
exports.elu = elu;
function reLU(args) {
    return new advanced_activations_1.ReLU(args);
}
exports.reLU = reLU;
function leakyReLU(args) {
    return new advanced_activations_1.LeakyReLU(args);
}
exports.leakyReLU = leakyReLU;
function prelu(args) {
    return new advanced_activations_1.PReLU(args);
}
exports.prelu = prelu;
function softmax(args) {
    return new advanced_activations_1.Softmax(args);
}
exports.softmax = softmax;
function thresholdedReLU(args) {
    return new advanced_activations_1.ThresholdedReLU(args);
}
exports.thresholdedReLU = thresholdedReLU;
function conv1d(args) {
    return new convolutional_1.Conv1D(args);
}
exports.conv1d = conv1d;
function conv2d(args) {
    return new convolutional_1.Conv2D(args);
}
exports.conv2d = conv2d;
function conv2dTranspose(args) {
    return new convolutional_1.Conv2DTranspose(args);
}
exports.conv2dTranspose = conv2dTranspose;
function separableConv2d(args) {
    return new convolutional_1.SeparableConv2D(args);
}
exports.separableConv2d = separableConv2d;
function cropping2D(args) {
    return new convolutional_1.Cropping2D(args);
}
exports.cropping2D = cropping2D;
function upSampling2d(args) {
    return new convolutional_1.UpSampling2D(args);
}
exports.upSampling2d = upSampling2d;
function depthwiseConv2d(args) {
    return new convolutional_depthwise_1.DepthwiseConv2D(args);
}
exports.depthwiseConv2d = depthwiseConv2d;
function activation(args) {
    return new core_1.Activation(args);
}
exports.activation = activation;
function dense(args) {
    return new core_1.Dense(args);
}
exports.dense = dense;
function dropout(args) {
    return new core_1.Dropout(args);
}
exports.dropout = dropout;
function flatten(args) {
    return new core_1.Flatten(args);
}
exports.flatten = flatten;
function repeatVector(args) {
    return new core_1.RepeatVector(args);
}
exports.repeatVector = repeatVector;
function reshape(args) {
    return new core_1.Reshape(args);
}
exports.reshape = reshape;
function permute(args) {
    return new core_1.Permute(args);
}
exports.permute = permute;
function embedding(args) {
    return new embeddings_1.Embedding(args);
}
exports.embedding = embedding;
function add(args) {
    return new merge_1.Add(args);
}
exports.add = add;
function average(args) {
    return new merge_1.Average(args);
}
exports.average = average;
function concatenate(args) {
    return new merge_1.Concatenate(args);
}
exports.concatenate = concatenate;
function maximum(args) {
    return new merge_1.Maximum(args);
}
exports.maximum = maximum;
function minimum(args) {
    return new merge_1.Minimum(args);
}
exports.minimum = minimum;
function multiply(args) {
    return new merge_1.Multiply(args);
}
exports.multiply = multiply;
function dot(args) {
    return new merge_1.Dot(args);
}
exports.dot = dot;
function batchNormalization(args) {
    return new normalization_1.BatchNormalization(args);
}
exports.batchNormalization = batchNormalization;
function zeroPadding2d(args) {
    return new padding_1.ZeroPadding2D(args);
}
exports.zeroPadding2d = zeroPadding2d;
function averagePooling1d(args) {
    return new pooling_1.AveragePooling1D(args);
}
exports.averagePooling1d = averagePooling1d;
function avgPool1d(args) {
    return averagePooling1d(args);
}
exports.avgPool1d = avgPool1d;
function avgPooling1d(args) {
    return averagePooling1d(args);
}
exports.avgPooling1d = avgPooling1d;
function averagePooling2d(args) {
    return new pooling_1.AveragePooling2D(args);
}
exports.averagePooling2d = averagePooling2d;
function avgPool2d(args) {
    return averagePooling2d(args);
}
exports.avgPool2d = avgPool2d;
function avgPooling2d(args) {
    return averagePooling2d(args);
}
exports.avgPooling2d = avgPooling2d;
function globalAveragePooling1d(args) {
    return new pooling_1.GlobalAveragePooling1D(args);
}
exports.globalAveragePooling1d = globalAveragePooling1d;
function globalAveragePooling2d(args) {
    return new pooling_1.GlobalAveragePooling2D(args);
}
exports.globalAveragePooling2d = globalAveragePooling2d;
function globalMaxPooling1d(args) {
    return new pooling_1.GlobalMaxPooling1D(args);
}
exports.globalMaxPooling1d = globalMaxPooling1d;
function globalMaxPooling2d(args) {
    return new pooling_1.GlobalMaxPooling2D(args);
}
exports.globalMaxPooling2d = globalMaxPooling2d;
function maxPooling1d(args) {
    return new pooling_1.MaxPooling1D(args);
}
exports.maxPooling1d = maxPooling1d;
function maxPooling2d(args) {
    return new pooling_1.MaxPooling2D(args);
}
exports.maxPooling2d = maxPooling2d;
function gru(args) {
    return new recurrent_1.GRU(args);
}
exports.gru = gru;
function gruCell(args) {
    return new recurrent_1.GRUCell(args);
}
exports.gruCell = gruCell;
function lstm(args) {
    return new recurrent_1.LSTM(args);
}
exports.lstm = lstm;
function lstmCell(args) {
    return new recurrent_1.LSTMCell(args);
}
exports.lstmCell = lstmCell;
function simpleRNN(args) {
    return new recurrent_1.SimpleRNN(args);
}
exports.simpleRNN = simpleRNN;
function simpleRNNCell(args) {
    return new recurrent_1.SimpleRNNCell(args);
}
exports.simpleRNNCell = simpleRNNCell;
function rnn(args) {
    return new recurrent_1.RNN(args);
}
exports.rnn = rnn;
function stackedRNNCells(args) {
    return new recurrent_1.StackedRNNCells(args);
}
exports.stackedRNNCells = stackedRNNCells;
function bidirectional(args) {
    return new wrappers_1.Bidirectional(args);
}
exports.bidirectional = bidirectional;
function timeDistributed(args) {
    return new wrappers_1.TimeDistributed(args);
}
exports.timeDistributed = timeDistributed;
exports.globalMaxPool1d = globalMaxPooling1d;
exports.globalMaxPool2d = globalMaxPooling2d;
exports.maxPool1d = maxPooling1d;
exports.maxPool2d = maxPooling2d;
//# sourceMappingURL=exports_layers.js.map