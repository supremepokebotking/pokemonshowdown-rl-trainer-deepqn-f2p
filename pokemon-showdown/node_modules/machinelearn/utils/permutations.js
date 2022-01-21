"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Original code from:
 * https://gist.github.com/wassname/a882ac3981c8e18d2556
 * Minor updates has been made to pass TSLint and TSDoc checks
 */
var _ = __importStar(require("lodash"));
/**
 * Generate all combination of arguments from objects
 * @param optObj - An object or arrays with keys describing options  {firstName:['Ben','Jade','Darren'],lastName:['Smith','Miller']}
 * @private
 * @return - An array of objects e.g. [{firstName:'Ben',LastName:'Smith'},{..]
 * @ignore
 */
function _cartesianProductObj(optObj) {
    var keys = _.keys(optObj);
    var opts = _.values(optObj);
    var combs = _cartesianProductOf(opts);
    return _.map(combs, function (comb) {
        return _.zipObject(keys, comb);
    });
}
/**
 * Generate all combination of arguments when given arrays or strings
 * e.g. [['Ben','Jade','Darren'],['Smith','Miller']] to [['Ben','Smith'],[..]]
 * e.g. 'the','cat' to [['t', 'c'],['t', 'a'], ...]
 * @param args
 * @private
 * @ignore
 */
function _cartesianProductOf(args) {
    var _args = args;
    if (arguments.length > 1) {
        _args = _.toArray(arguments);
    }
    // strings to arrays of letters
    _args = _.map(_args, function (opt) { return (typeof opt === 'string' ? _.toArray(opt) : opt); });
    return _.reduce(_args, function (a, b) {
        return _.flatten(_.map(a, function (x) {
            return _.map(b, function (y) {
                return _.concat(x, [y]);
            });
        }));
    }, [[]]);
}
/**
 * Generate the cartesian product of input objects, arrays, or strings
 *
 *
 * product('me','hi')
 * // => [["m","h"],["m","i"],["e","h"],["e","i"]]
 *
 * product([1,2,3],['a','b','c']
 * // => [[1,"a"],[1,"b"],[1,"c"],[2,"a"],[2,"b"],[2,"c"],[3,"a"],[3,"b"],[3,"c"]]
 *
 * product({who:['me','you'],say:['hi','by']})
 * // => [{"who":"me","say":"hi"},{"who":"me","say":"by"},{"who":"you","say":"hi"},{"who":"you","say":"by"}]
 *
 * // It also takes in a single array of args
 * product(['me','hi'])
 * // => [["m","h"],["m","i"],["e","h"],["e","i"]]
 * @ignore
 */
function product(opts) {
    if (arguments.length === 1 && !_.isArray(opts)) {
        return _cartesianProductObj(opts);
    }
    else if (arguments.length === 1) {
        return _cartesianProductOf(opts);
    }
    else {
        return _cartesianProductOf(arguments);
    }
}
/**
 * Generate n combinations with repeat values.
 * @param X - Matrix input
 * @param n - number of repeats
 * @ignore
 */
function combinationsWithReplacement(X, n) {
    var _n = n;
    var _X = X;
    if (typeof _X === 'string') {
        _X = _.toArray(_X);
    }
    // If repeat is 1, simply return the original value
    if (_n === 0) {
        return null;
    }
    if (_n === 1) {
        return X;
    }
    // Falls back to X.length as default value is _n is undefined
    _n = _n ? _n : X.length;
    // make n copies of keys/indices
    var nInds = [];
    for (var j = 0; j < _n; j++) {
        nInds.push(_.keys(_X));
    }
    // get product of the indices, then filter to keep elements in order
    var arrangements = product(nInds).filter(function (pair) { return pair[0] <= pair[1]; });
    return _.map(arrangements, function (indices) { return _.map(indices, function (i) { return _X[i]; }); });
}
exports.combinationsWithReplacement = combinationsWithReplacement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybXV0YXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi91dGlscy9wZXJtdXRhdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7OztHQUdHO0FBQ0gsd0NBQTRCO0FBRTVCOzs7Ozs7R0FNRztBQUNILFNBQVMsb0JBQW9CLENBQUMsTUFBTTtJQUNsQyxJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUIsSUFBTSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxVQUFDLElBQUk7UUFDdkIsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsU0FBUyxtQkFBbUIsQ0FBQyxJQUFJO0lBQy9CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztJQUNqQixJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3hCLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzlCO0lBRUQsK0JBQStCO0lBQy9CLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxVQUFDLEdBQUcsSUFBSyxPQUFBLENBQUMsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBaEQsQ0FBZ0QsQ0FBQyxDQUFDO0lBQ2hGLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FDYixLQUFLLEVBQ0wsVUFBQyxDQUFDLEVBQUUsQ0FBQztRQUNILE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FDZCxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxVQUFDLENBQUM7WUFDVCxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQztnQkFDaEIsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQyxFQUNELENBQUMsRUFBRSxDQUFDLENBQ0wsQ0FBQztBQUNKLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxTQUFTLE9BQU8sQ0FBQyxJQUFJO0lBQ25CLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzlDLE9BQU8sb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbkM7U0FBTSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ2pDLE9BQU8sbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbEM7U0FBTTtRQUNMLE9BQU8sbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDdkM7QUFDSCxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQiwyQkFBMkIsQ0FBQyxDQUFDLEVBQUUsQ0FBVTtJQUN2RCxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDWCxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDWCxJQUFJLE9BQU8sRUFBRSxLQUFLLFFBQVEsRUFBRTtRQUMxQixFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNwQjtJQUVELG1EQUFtRDtJQUNuRCxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7UUFDWixPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO1FBQ1osT0FBTyxDQUFDLENBQUM7S0FDVjtJQUVELDZEQUE2RDtJQUM3RCxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDeEIsZ0NBQWdDO0lBQ2hDLElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3hCO0lBQ0Qsb0VBQW9FO0lBQ3BFLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFsQixDQUFrQixDQUFDLENBQUM7SUFDekUsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxVQUFDLE9BQU8sSUFBSyxPQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBQyxJQUFLLE9BQUEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFMLENBQUssQ0FBQyxFQUE1QixDQUE0QixDQUFDLENBQUM7QUFDeEUsQ0FBQztBQXpCRCxrRUF5QkMifQ==