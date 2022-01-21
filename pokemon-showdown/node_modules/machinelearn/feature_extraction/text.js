"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var sw = __importStar(require("stopword"));
var nlp_1 = require("../utils/nlp");
var validation_1 = require("../utils/validation");
var stop_words_1 = require("./stop_words");
/**
 * The CountVectorizer provides a simple way to both tokenize a collection
 * of text documents and build a vocabulary of known words, but also
 * to encode new documents using that vocabulary.
 *
 * @example
 * import { CountVectorizer } from 'machinelearn/feature_extraction';
 *
 * const corpus = ['deep learning ian good fellow learning jason shin shin', 'yoshua bengio'];
 * const vocabCounts = cv.fit_transform(corpus);
 * console.log(vocabCounts); // [ [ 0, 1, 1, 1, 1, 1, 2, 2, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1 ] ]
 * console.log(cv.vocabulary); // { bengio: 0, deep: 1, fellow: 2, good: 3, ian: 4, jason: 5, learning: 6, shin: 7, yoshua: 8 }
 * console.log(cv.getFeatureNames()); // [ 'bengio', 'deep', 'fellow', 'good', 'ian', 'jason', 'learning', 'shin', 'yoshua' ]
 *
 * const newVocabCounts = cv.transform(['ian good fellow jason duuog']);
 * console.log(newVocabCounts); // [ [ 0, 0, 1, 1, 1, 1, 0, 0, 0 ] ]
 */
var CountVectorizer = /** @class */ (function () {
    function CountVectorizer() {
        this.vocabulary = {};
    }
    /**
     * Learn a vocabulary dictionary of all tokens in the raw documents.
     * @param {string[]} doc - An array of strings
     * @returns {CountVectorizer}
     */
    CountVectorizer.prototype.fit = function (doc) {
        if (doc === void 0) { doc = null; }
        validation_1.validateMatrix1D(doc);
        this.fit_transform(doc);
        return this;
    };
    /**
     * fit transform applies
     * @param {string[]} doc - An array of strings
     * @returns {number[][]}
     */
    CountVectorizer.prototype.fit_transform = function (doc) {
        if (doc === void 0) { doc = null; }
        validation_1.validateMatrix1D(doc);
        var _a = this.buildVocabulary(doc), internalVocabulary = _a.internalVocabulary, pubVocabulary = _a.pubVocabulary;
        this.vocabulary = pubVocabulary;
        this.internalVocabulary = internalVocabulary;
        return this.countVocab(doc);
    };
    /**
     * Transform documents to document-term matrix.
     * Extract token counts out of raw text documents using the vocabulary
     * fitted with fit or the one provided to the constructor.
     * @param {string[]} doc - An array of strings
     * @returns {number[][]}
     */
    CountVectorizer.prototype.transform = function (doc) {
        if (doc === void 0) { doc = null; }
        validation_1.validateMatrix1D(doc);
        return this.countVocab(doc);
    };
    /**
     * Array mapping from feature integer indices to feature name
     * @returns {Object}
     */
    CountVectorizer.prototype.getFeatureNames = function () {
        if (!this.internalVocabulary) {
            throw new Error('You must fit a document first before you can retrieve the feature names!');
        }
        return this.internalVocabulary;
    };
    /**
     * Build a tokenizer/vectorizer
     * @returns {(x: string) => string[]}
     */
    CountVectorizer.prototype.buildAnalyzer = function () {
        var _this = this;
        return function (x) { return _this.preprocess(x, { removeSW: true }); };
    };
    /**
     * Calculates list of vocabularies in the entire document and come up with
     * vocab: index pairs
     * @param doc
     */
    CountVectorizer.prototype.buildVocabulary = function (doc) {
        var analyze = this.buildAnalyzer();
        var processedDoc = _.flowRight(function (d) { return _.uniq(d); }, function (d) { return _.sortBy(d, function (z) { return z; }); }, function (d) { return _.flatten(d); }, function (d) { return _.map(d, function (text) { return analyze(text); }); })(doc);
        var pubVocabulary = _.reduce(processedDoc, function (sum, val, index) {
            return _.set(sum, val, index);
        }, {});
        return {
            internalVocabulary: processedDoc,
            pubVocabulary: pubVocabulary,
        };
    };
    /**
     * @ignore
     * Counting number of vocab occurences in the current token of a sentence
     * ['yoshua', 'bengio', 'deep', 'learning'] = vocabulary
     * ['yohua', 'bengio'] => tokens
     * results in
     * [1, 1, 0, 0]
     * @param doc
     */
    CountVectorizer.prototype.countVocab = function (doc) {
        var e_1, _a, e_2, _b, e_3, _c;
        var analyze = this.buildAnalyzer();
        var docVocabCounts = [];
        try {
            for (var doc_1 = __values(doc), doc_1_1 = doc_1.next(); !doc_1_1.done; doc_1_1 = doc_1.next()) {
                var sentence = doc_1_1.value;
                // For each sentence, get tokens
                var tokens = analyze(sentence);
                var sentenceCounts = [];
                try {
                    // For each vocab, count number of appearance of each vocab in the tokens
                    for (var _d = __values(this.internalVocabulary), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var vocab = _e.value;
                        var vocabCount = 0;
                        try {
                            for (var tokens_1 = __values(tokens), tokens_1_1 = tokens_1.next(); !tokens_1_1.done; tokens_1_1 = tokens_1.next()) {
                                var t = tokens_1_1.value;
                                if (t === vocab) {
                                    vocabCount++;
                                }
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (tokens_1_1 && !tokens_1_1.done && (_c = tokens_1.return)) _c.call(tokens_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        sentenceCounts.push(vocabCount);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                docVocabCounts.push(sentenceCounts);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (doc_1_1 && !doc_1_1.done && (_a = doc_1.return)) _a.call(doc_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return docVocabCounts;
    };
    /**
     * @ignore
     * preprocess a line of text by applying
     * 1) tokenization
     * 2) removing stopwords
     * @param text
     * @param { boolean } removeSW
     * @returns {any}
     */
    CountVectorizer.prototype.preprocess = function (text, _a) {
        var _b = _a.removeSW, removeSW = _b === void 0 ? false : _b;
        var tokenizer = new nlp_1.WordTokenizer();
        var tokens = text.split(' ');
        if (removeSW) {
            tokens = sw.removeStopwords(tokens, stop_words_1.ENGLISH_STOP_WORDS);
        }
        return tokenizer.tokenize(tokens.join(' '));
    };
    return CountVectorizer;
}());
exports.CountVectorizer = CountVectorizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZmVhdHVyZV9leHRyYWN0aW9uL3RleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdDQUE0QjtBQUM1QiwyQ0FBK0I7QUFFL0Isb0NBQTZDO0FBQzdDLGtEQUF1RDtBQUN2RCwyQ0FBa0Q7QUFFbEQ7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSDtJQUFBO1FBQ1MsZUFBVSxHQUFXLEVBQUUsQ0FBQztJQTJJakMsQ0FBQztJQXZJQzs7OztPQUlHO0lBQ0ksNkJBQUcsR0FBVixVQUFXLEdBQWdDO1FBQWhDLG9CQUFBLEVBQUEsVUFBZ0M7UUFDekMsNkJBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksdUNBQWEsR0FBcEIsVUFBcUIsR0FBZ0M7UUFBaEMsb0JBQUEsRUFBQSxVQUFnQztRQUNuRCw2QkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFBLDhCQUFpRSxFQUEvRCwwQ0FBa0IsRUFBRSxnQ0FBMkMsQ0FBQztRQUN4RSxJQUFJLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQztRQUNoQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUM7UUFDN0MsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxtQ0FBUyxHQUFoQixVQUFpQixHQUFnQztRQUFoQyxvQkFBQSxFQUFBLFVBQWdDO1FBQy9DLDZCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0kseUNBQWUsR0FBdEI7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsMEVBQTBFLENBQUMsQ0FBQztTQUM3RjtRQUNELE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ2pDLENBQUM7SUFFRDs7O09BR0c7SUFDSyx1Q0FBYSxHQUFyQjtRQUFBLGlCQUVDO1FBREMsT0FBTyxVQUFDLENBQUMsSUFBSyxPQUFBLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQXRDLENBQXNDLENBQUM7SUFDdkQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyx5Q0FBZSxHQUF2QixVQUNFLEdBQXlCO1FBS3pCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQyxJQUFNLFlBQVksR0FBYSxDQUFDLENBQUMsU0FBUyxDQUN4QyxVQUFDLENBQVcsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQVQsQ0FBUyxFQUMxQixVQUFDLENBQVcsSUFBSyxPQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxFQUFELENBQUMsQ0FBQyxFQUFyQixDQUFxQixFQUN0QyxVQUFDLENBQWEsSUFBSyxPQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQVosQ0FBWSxFQUMvQixVQUFDLENBQVcsSUFBSyxPQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFVBQUMsSUFBSSxJQUFLLE9BQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFiLENBQWEsQ0FBQyxFQUFqQyxDQUFpQyxDQUNuRCxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1AsSUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FDNUIsWUFBWSxFQUNaLFVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLO1lBQ2QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxFQUNELEVBQUUsQ0FDSCxDQUFDO1FBQ0YsT0FBTztZQUNMLGtCQUFrQixFQUFFLFlBQVk7WUFDaEMsYUFBYSxlQUFBO1NBQ2QsQ0FBQztJQUNKLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNLLG9DQUFVLEdBQWxCLFVBQW1CLEdBQXlCOztRQUMxQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckMsSUFBTSxjQUFjLEdBQWUsRUFBRSxDQUFDOztZQUN0QyxLQUF1QixJQUFBLFFBQUEsU0FBQSxHQUFHLENBQUEsd0JBQUEseUNBQUU7Z0JBQXZCLElBQU0sUUFBUSxnQkFBQTtnQkFDakIsZ0NBQWdDO2dCQUNoQyxJQUFNLE1BQU0sR0FBYSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzNDLElBQU0sY0FBYyxHQUFhLEVBQUUsQ0FBQzs7b0JBRXBDLHlFQUF5RTtvQkFDekUsS0FBb0IsSUFBQSxLQUFBLFNBQUEsSUFBSSxDQUFDLGtCQUFrQixDQUFBLGdCQUFBLDRCQUFFO3dCQUF4QyxJQUFNLEtBQUssV0FBQTt3QkFDZCxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7OzRCQUNuQixLQUFnQixJQUFBLFdBQUEsU0FBQSxNQUFNLENBQUEsOEJBQUEsa0RBQUU7Z0NBQW5CLElBQU0sQ0FBQyxtQkFBQTtnQ0FDVixJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUU7b0NBQ2YsVUFBVSxFQUFFLENBQUM7aUNBQ2Q7NkJBQ0Y7Ozs7Ozs7Ozt3QkFDRCxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUNqQzs7Ozs7Ozs7O2dCQUNELGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7YUFDckM7Ozs7Ozs7OztRQUNELE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNLLG9DQUFVLEdBQWxCLFVBQW1CLElBQVksRUFBRSxFQUFvQjtZQUFsQixnQkFBZ0IsRUFBaEIscUNBQWdCO1FBQ2pELElBQU0sU0FBUyxHQUFHLElBQUksbUJBQWEsRUFBRSxDQUFDO1FBQ3RDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBSSxRQUFRLEVBQUU7WUFDWixNQUFNLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsK0JBQWtCLENBQUMsQ0FBQztTQUN6RDtRQUNELE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQTVJRCxJQTRJQztBQTVJWSwwQ0FBZSJ9