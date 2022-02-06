"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isLocalPath(source) {
    return (typeof source === 'string') && source.substr(0, 7) === 'file://';
}
exports.isLocalPath = isLocalPath;
//# sourceMappingURL=source_util.js.map