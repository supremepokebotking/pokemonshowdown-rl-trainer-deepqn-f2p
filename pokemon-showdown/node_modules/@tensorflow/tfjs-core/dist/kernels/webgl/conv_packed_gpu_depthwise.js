"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../../util");
var DepthwiseConvPacked2DProgram = (function () {
    function DepthwiseConvPacked2DProgram(convInfo) {
        this.variableNames = ['x', 'W'];
        this.usesPackedTextures = true;
        this.outputShape = convInfo.outShape;
        var xNumRows = convInfo.inHeight;
        var xNumCols = convInfo.inWidth;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var dilationHeight = convInfo.dilationHeight;
        var dilationWidth = convInfo.dilationWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var texelsAcross = filterWidth;
        var mainLoop = "int xR; int xC; int xCOffset;";
        for (var r = 0; r < filterHeight; r++) {
            for (var c = 0; c < filterWidth; c++) {
                mainLoop += "\n          vec4 xTexelR" + r + "C" + c * 2 + " = vec4(0.);\n          vec4 wR" + r + "C" + c + " = vec4(0.);\n          vec4 xR" + r + "C" + c + " = vec4(0.);";
            }
        }
        for (var r = 0; r < filterHeight; r++) {
            for (var texelC = 0; texelC < texelsAcross; texelC++) {
                var c = texelC * 2;
                mainLoop += "\n          xR = xRCorner + " + r * dilationHeight + ";\n          xC = xCCorner + " + c * dilationWidth + ";\n        ";
                if (strideWidth === 1) {
                    if (c < filterWidth) {
                        if (padLeft % 2 === 1) {
                            mainLoop += "\n                xCOffset = xC + 1;\n                if(xR >= 0 && xR < " + xNumRows + " && xCOffset >= 0 && xCOffset < " + xNumCols + ") {\n                  xTexelR" + r + "C" + c + " = getX(batch, xR, xCOffset, d1);\n                } else {\n                  xTexelR" + r + "C" + c + " = vec4(0.);\n                }\n\n                xCOffset = xC + 1 - 2;\n                if(xR >= 0 && xR < " + xNumRows + " && xCOffset >= 0 && xCOffset < " + xNumCols + ") {\n                  vec4 previous = getX(batch, xR, xCOffset, d1);\n                  xR" + r + "C" + c + " = vec4(previous.zw, xTexelR" + r + "C" + c + ".xy);\n                } else {\n                  xR" + r + "C" + c + " = vec4(0, 0, xTexelR" + r + "C" + c + ".xy);\n                }\n              ";
                        }
                        else {
                            mainLoop += "\n                if(xR >= 0 && xR < " + xNumRows + " && xC >= 0 && xC < " + xNumCols + ") {\n                  xTexelR" + r + "C" + c + " = getX(batch, xR, xC, d1);\n                } else {\n                  xTexelR" + r + "C" + c + " = vec4(0.);\n                }\n\n                xR" + r + "C" + c + " = xTexelR" + r + "C" + c + ";\n              ";
                        }
                        if (c + 1 < filterWidth) {
                            var nextTexelOffset = padLeft % 2 === 0 ?
                                util.nearestLargerEven(dilationWidth) :
                                dilationWidth;
                            if ((dilationWidth % 2 === 0 && padLeft % 2 === 1) ||
                                (dilationWidth % 2 !== 0 && padLeft % 2 !== 1)) {
                                mainLoop += "\n                  xCOffset = xC + " + padLeft % 2 + " + " + nextTexelOffset + ";\n\n                  if(xR >= 0 && xR < " + xNumRows + " &&\n                    xCOffset >= 0 && xCOffset < " + xNumCols + ") {\n                    xTexelR" + r + "C" + (c + 2) + " = getX(batch, xR, xCOffset, d1);\n                  }\n                ";
                                if (dilationWidth > 1) {
                                    mainLoop += "\n                    xCOffset -= 2;\n                    if(xR >= 0 && xR < " + xNumRows + " &&\n                      xCOffset >= 0 && xCOffset < " + xNumCols + ") {\n                      xTexelR" + r + "C" + c + " = getX(batch, xR, xCOffset, d1);\n                    } else {\n                      xTexelR" + r + "C" + c + " = vec4(0.);\n                    }\n                  ";
                                }
                                mainLoop += "\n                  xR" + r + "C" + (c + 1) + " = vec4(\n                    xTexelR" + r + "C" + c + ".zw, xTexelR" + r + "C" + (c + 2) + ".xy);\n                ";
                            }
                            else {
                                mainLoop += "\n                  xCOffset = xC + " + nextTexelOffset + ";\n\n                  if(xR >= 0 && xR < " + xNumRows + " &&\n                    xCOffset >= 0 && xCOffset < " + xNumCols + ") {\n                    xTexelR" + r + "C" + (c + 2) + " = getX(batch, xR, xCOffset, d1);\n                  }\n\n                  xR" + r + "C" + (c + 1) + " = xTexelR" + r + "C" + (c + 2) + ";\n                ";
                            }
                        }
                    }
                }
                else {
                    if (c < filterWidth) {
                        mainLoop += "\n              if(xR >= 0 && xR < " + xNumRows + ") {\n            ";
                        if (padLeft % 2 === 1) {
                            mainLoop += "\n                xCOffset = xC + 1 - " + strideWidth + ";\n                if(xCOffset >= 0 && xCOffset < " + xNumCols + ") {\n                  xTexelR" + r + "C" + c + " = getX(batch, xR, xCOffset, d1);\n                } else {\n                  xTexelR" + r + "C" + c + " = vec4(0.);\n                }\n\n                if(xC + 1 >= 0 && xC + 1 < " + xNumCols + ") {\n                  xTexelR" + r + "C" + (c + 2) + " = getX(batch, xR, xC + 1, d1);\n                } else {\n                  xTexelR" + r + "C" + (c + 2) + " = vec4(0.);\n                }\n\n                xR" + r + "C" + c + " = vec4(\n                  xTexelR" + r + "C" + c + ".zw, xTexelR" + r + "C" + (c + 2) + ".zw);\n              ";
                            if (c + 1 < filterWidth) {
                                mainLoop += "\n                  vec4 final = vec4(0.);\n                  xCOffset = xC + 1 + " + strideWidth + ";\n                  if(xCOffset >= 0 && xCOffset < " + xNumCols + ") {\n                    final = getX(batch, xR, xCOffset, d1);\n                  }\n                  xR" + r + "C" + (c + 1) + " = vec4(xTexelR" + r + "C" + (c + 2) + ".xy, final.xy);\n                ";
                            }
                        }
                        else {
                            mainLoop += "\n                if(xC >= 0 && xC < " + xNumCols + ") {\n                  xTexelR" + r + "C" + c + " = getX(batch, xR, xC, d1);\n                } else {\n                  xTexelR" + r + "C" + c + " = vec4(0.);\n                }\n\n                xCOffset = xC + " + strideWidth + ";\n                if(xCOffset >= 0 && xCOffset < " + xNumCols + ") {\n                  xTexelR" + r + "C" + (c + 2) + " = getX(batch, xR, xCOffset, d1);\n                } else {\n                  xTexelR" + r + "C" + (c + 2) + " = vec4(0.);\n                }\n\n                xR" + r + "C" + c + " = vec4(\n                  xTexelR" + r + "C" + c + ".xy, xTexelR" + r + "C" + (c + 2) + ".xy);\n              ";
                            if (c + 1 < filterWidth) {
                                mainLoop += "\n                  xR" + r + "C" + (c + 1) + " = vec4(\n                    xTexelR" + r + "C" + c + ".zw, xTexelR" + r + "C" + (c + 2) + ".zw);\n                ";
                            }
                        }
                        mainLoop += "}";
                    }
                }
                if (c < filterWidth) {
                    mainLoop += "\n            vec4 wTexelR" + r + "C" + c + " = getW(" + r + ", " + c + ", d1, q);\n            wR" + r + "C" + c + " = vec4(wTexelR" + r + "C" + c + ".xz, wTexelR" + r + "C" + c + ".xz);\n          ";
                    if (c + 1 < filterWidth) {
                        mainLoop += "\n              vec4 wTexelR" + r + "C" + (c + 1) + " = getW(" + r + ", " + (c + 1) + ", d1, q);\n              wR" + r + "C" + (c + 1) + " =\n                vec4(wTexelR" + r + "C" + (c + 1) + ".xz, wTexelR" + r + "C" + (c + 1) + ".xz);";
                    }
                }
            }
        }
        for (var r = 0; r < filterHeight; r++) {
            for (var c = 0; c < filterWidth; c++) {
                mainLoop += "result += xR" + r + "C" + c + " * wR" + r + "C" + c + ";";
            }
        }
        this.userCode = "\n      const ivec2 strides = ivec2(" + strideHeight + ", " + strideWidth + ");\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n      void main() {\n\n        ivec4 coords = getOutputCoords();\n        int batch = coords.x;\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int d2 = coords.w;\n        int d1 = d2;\n        int q = 0;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        vec4 result = vec4(0.);\n\n        " + mainLoop + "\n\n        setOutput(result);\n      }\n    ";
    }
    return DepthwiseConvPacked2DProgram;
}());
exports.DepthwiseConvPacked2DProgram = DepthwiseConvPacked2DProgram;
//# sourceMappingURL=conv_packed_gpu_depthwise.js.map