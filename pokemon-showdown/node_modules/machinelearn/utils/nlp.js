"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var Errors_1 = require("./Errors");
/**
 * @ignore
 */
var WordTokenizer = /** @class */ (function () {
    function WordTokenizer() {
    }
    /**
     * Tokenize a given text
     * e.g.
     * given: "deep-learning ian good fellow learning jason shin shin"
     * returns: [ 'deep', 'learning', 'ian', 'good', 'fellow', 'learning', 'jason', 'shin', 'shin' ]
     * @param text
     * @returns {string[]}
     */
    WordTokenizer.prototype.tokenize = function (text) {
        if (!_.isString(text)) {
            throw new Errors_1.ValidationError('Cannot process a non string value');
        }
        var regex = /[^A-Za-zА-Яа-я0-9_]+/g;
        return text.split(regex);
    };
    return WordTokenizer;
}());
exports.WordTokenizer = WordTokenizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmxwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi91dGlscy9ubHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsd0NBQTRCO0FBQzVCLG1DQUEyQztBQUUzQzs7R0FFRztBQUNIO0lBQUE7SUFnQkEsQ0FBQztJQWZDOzs7Ozs7O09BT0c7SUFDSSxnQ0FBUSxHQUFmLFVBQWdCLElBQUk7UUFDbEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDckIsTUFBTSxJQUFJLHdCQUFlLENBQUMsbUNBQW1DLENBQUMsQ0FBQztTQUNoRTtRQUNELElBQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBaEJELElBZ0JDO0FBaEJZLHNDQUFhIn0=