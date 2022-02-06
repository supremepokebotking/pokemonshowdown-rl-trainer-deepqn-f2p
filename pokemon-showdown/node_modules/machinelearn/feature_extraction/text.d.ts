import { Type1DMatrix } from '../types';
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
export declare class CountVectorizer {
    vocabulary: object;
    /** @ignore */
    private internalVocabulary;
    /**
     * Learn a vocabulary dictionary of all tokens in the raw documents.
     * @param {string[]} doc - An array of strings
     * @returns {CountVectorizer}
     */
    fit(doc?: Type1DMatrix<string>): this;
    /**
     * fit transform applies
     * @param {string[]} doc - An array of strings
     * @returns {number[][]}
     */
    fit_transform(doc?: Type1DMatrix<string>): number[][];
    /**
     * Transform documents to document-term matrix.
     * Extract token counts out of raw text documents using the vocabulary
     * fitted with fit or the one provided to the constructor.
     * @param {string[]} doc - An array of strings
     * @returns {number[][]}
     */
    transform(doc?: Type1DMatrix<string>): number[][];
    /**
     * Array mapping from feature integer indices to feature name
     * @returns {Object}
     */
    getFeatureNames(): object;
    /**
     * Build a tokenizer/vectorizer
     * @returns {(x: string) => string[]}
     */
    private buildAnalyzer;
    /**
     * Calculates list of vocabularies in the entire document and come up with
     * vocab: index pairs
     * @param doc
     */
    private buildVocabulary;
    /**
     * @ignore
     * Counting number of vocab occurences in the current token of a sentence
     * ['yoshua', 'bengio', 'deep', 'learning'] = vocabulary
     * ['yohua', 'bengio'] => tokens
     * results in
     * [1, 1, 0, 0]
     * @param doc
     */
    private countVocab;
    /**
     * @ignore
     * preprocess a line of text by applying
     * 1) tokenization
     * 2) removing stopwords
     * @param text
     * @param { boolean } removeSW
     * @returns {any}
     */
    private preprocess;
}
