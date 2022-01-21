// @ts-ignore: Emscripten starting point ASM
import asm from '../out/asm/libsvm';
// @ts-ignore: Emscripten starting point for WASM
import wasm from '../out/wasm/libsvm';
import { SVMError, WASMError } from './Errors';
import { Arguments, KernelTypes, SVMTypes } from './types/Commands';
import { getCommand } from './Util';

interface ProbabilityResult {
  prediction: number;
  estimates: Array<{
    label: number;
    probability: number;
  }>;
}

export class SVM {
  private predict_one: (a: number, b: [] | Uint8Array, c: number) => number;
  private predict_one_probability: (a: number, b: [] | Uint8Array, c: number, d: number) => number;
  private add_instance: (a: number, b: [] | Uint8Array, c: number, d: number, e: number) => null;
  private create_svm_nodes: (a: number, b: number) => number;
  private train_problem: (a: number, b: string) => number;
  private svm_get_nr_sv: (a: number) => number;
  private svm_get_nr_class: (a: number) => number;
  private svm_get_sv_indices: (a: number, b: number) => void;
  private svm_get_labels: (a: number, b: number) => null;
  private svm_free_model: (a: number) => null;
  private svm_cross_validation: (a: number, b: string, c: number, d: number) => void;
  private svm_get_svr_probability: (a: number) => number;
  private free_problem: (a: number) => null;
  private serialize_model: (a: number) => number;
  private deserialize_model: (a: string) => number;
  private options: Arguments;
  private model: number; // A numeric value that represent the current model
  private deserialized: boolean;
  private problem: number;
  private loaded: boolean; // A flag to ensure the wasm is loaded
  // @ts-ignore: Used to hold the reference to the Emscripten generated libsvm
  private libsvm; // Initially it is using asm. Calling .load() will load wasm

  constructor(options: Arguments) {
    if (SVMTypes.indexOf(options.type) === -1) {
      throw SVMError(`SVM cannot instantiate with an unknown type ${options.type}`);
    }

    if (KernelTypes.indexOf(options.kernel) === -1) {
      throw SVMError(`SVM cannot instantiate with an unknown kernel ${options.kernel}`);
    }

    this.options = options;
    this.model = null;
    this.loaded = false;
  }

  loadASM(): Promise<SVM> {
    return asm
      .load()
      .then(() => {
        if (this.loaded) {
          throw SVMError('Cannot load an already loaded SVM');
        }
        this.libsvm = asm;
        this.initiateAPIs(this.libsvm);
        this.loaded = true;
        return this;
      })
      .catch((err: Error) => {
        throw WASMError(err);
      });
  }

  /**
   * Loads the WASM libsvm asynchronously, this is best for browser usage
   */
  loadWASM(): Promise<SVM> {
    return wasm
      .load()
      .then(() => {
        if (this.loaded) {
          throw SVMError('Cannot load an already loaded SVM');
        }
        this.libsvm = wasm;
        this.initiateAPIs(this.libsvm);
        this.loaded = true;
        return this;
      })
      .catch((err: Error) => {
        throw WASMError(err);
      });
  }

  /**
   * Trains a model
   * @param args
   */
  train(args: { samples: number[][]; labels: number[] }) {
    if (this.deserialized) {
      throw SVMError('Cannot train a deserialized model');
    }
    this.free();
    this.problem = this.createProblem(args);
    const command = this.getCommand({ samples: args.samples });
    this.model = this.train_problem(this.problem, command);
  }

  /**
   * Predict using a single vector of sample
   * @param args
   */
  predictOne(args: { sample: number[] }): number {
    const { sample } = args;

    if (!this.model) {
      throw SVMError('SVM cannot perform predictOne unless you instantiate it');
    }
    return this.predict_one(this.model, new Uint8Array(new Float64Array(sample).buffer), sample.length);
  }

  /**
   * Predict a matrix
   * @param args
   */
  predict(args: { samples: number[][] }): number[] {
    const { samples } = args;

    const arr = [];
    for (let i = 0; i < samples.length; i++) {
      arr.push(this.predictOne({ sample: samples[i] }));
    }
    return arr;
  }

  /**
   * Predict the label with probability estimate of many samples.
   * @param args
   */
  predictProbability(args: { samples: number[][] }): ProbabilityResult[] {
    const { samples } = args;

    const arr = [];

    for (let i = 0; i < samples.length; i++) {
      arr.push(this.predictOneProbability({ sample: samples[i] }));
    }
    return arr;
  }

  /**
   * Predict the label with probability estimate.
   * @param args
   */
  predictOneProbability(args: { sample: number[] }): ProbabilityResult {
    const { sample } = args;
    const labels = this.getLabels();
    const nbLabels = labels.length;
    const estimates = this.libsvm._malloc(nbLabels * 8);
    const prediction = this.predict_one_probability(
      this.model,
      new Uint8Array(new Float64Array(sample).buffer),
      sample.length,
      estimates,
    );
    const estimatesArr: number[] = Array.from(this.libsvm.HEAPF64.subarray(estimates / 8, estimates / 8 + nbLabels));
    const result: ProbabilityResult = {
      prediction,
      estimates: labels.map((label, idx) => ({
        label,
        probability: estimatesArr[idx],
      })),
    };
    this.libsvm._free(estimates);
    return result;
  }

  /**
   * Predict a regression value with a confidence interval
   * @param args
   */
  predictOneInterval(args: {
    sample: number[];
    confidence: number;
  }): {
    predicted: number;
    interval: number[];
  } {
    const { sample, confidence } = args;
    const interval = this.getInterval({ confidence });
    const predicted = this.predictOne({ sample });
    return {
      predicted,
      interval: [predicted - interval, predicted + interval],
    };
  }

  /**
   * Predict regression values with confidence intervals
   * @param args
   */
  predictInterval(args: {
    samples: number[][];
    confidence: number;
  }): Array<{
    predicted: number;
    interval: number[];
  }> {
    const { samples, confidence } = args;
    const interval = this.getInterval({ confidence });
    const predicted: number[] = this.predict({ samples });
    return predicted.map((pred) => ({
      predicted: pred,
      interval: [pred - interval, pred + interval],
    }));
  }

  /**
   * Get the array of labels from the model. Useful when creating an SVM instance with SVM.load
   */
  getLabels(): number[] {
    const nLabels = this.svm_get_nr_class(this.model);
    return this.getIntArrayFromModel({ fn: this.svm_get_labels, model: this.model, size: nLabels });
  }

  /**
   * Save the state of the SVM
   */
  toJSON() {
    return {
      model: this.model,
      options: this.options,
      loaded: this.loaded,
      problem: this.problem,
    };
  }

  /**
   * Load a model from a state
   * @param args
   */
  fromJSON(args: { model: number; problem: number; options: Arguments; loaded: boolean }): void {
    const { model, problem, options, loaded } = args;
    this.model = model;
    this.options = options;
    this.loaded = loaded;
    this.problem = problem;
  }

  /**
   * Performs k-fold cross-validation (KF-CV). KF-CV separates the data-set into kFold random equally sized partitions,
   * and uses each as a validation set, with all other partitions used in the training set. Observations left over
   * from if kFold does not divide the number of observations are left out of the cross-validation process. If
   * kFold is one, this is equivalent to a leave-on-out cross-validation
   * @param args
   */
  crossValidation(args: { samples: number[][]; labels: number[]; kFold: number }) {
    const { samples, labels, kFold } = args;

    if (this.deserialized) {
      throw SVMError('Cannot cross validate on an instance created with SVM.load');
    }

    const problem = this.createProblem({ samples, labels });
    const target = this.libsvm._malloc(labels.length * 8);
    this.svm_cross_validation(problem, this.getCommand({ samples }), kFold, target);
    const data = this.libsvm.HEAPF64.subarray(target / 8, target / 8 + labels.length);
    const arr = Array.from(data);
    this.libsvm._free(target);
    this.free_problem(problem);
    return arr;
  }

  /**
   * Get the indices of the support vectors from the training set passed to the train method.
   */
  getSVIndices() {
    const nSV = this.svm_get_nr_sv(this.model);
    return this.getIntArrayFromModel({ fn: this.svm_get_sv_indices, model: this.model, size: nSV });
  }

  /**
   * Uses libsvm's serialization method of the model.
   */
  serializeModel() {
    if (!this.model) {
      throw SVMError('Cannot serialize model. No model was trained');
    }

    const result = this.serialize_model(this.model);
    const str = this.libsvm.Pointer_stringify(result);
    this.libsvm._free(result);
    return str;
  }

  /**
   * Free the memory allocated for the model. Since this memory is stored in the memory model of emscripten, it is
   * allocated within an ArrayBuffer and WILL NOT BE GARBARGE COLLECTED, you have to explicitly free it. So
   * not calling this will result in memory leaks. As of today in the browser, there is no way to hook the
   * garbage collection of the SVM object to free it automatically.
   * Free the memory that was created by the compiled libsvm library to.
   * store the model. This model is reused every time the predict method is called.
   */
  public free() {
    if (this.problem) {
      this.free_problem(this.problem);
      this.problem = null;
    }
    if (this.model !== null) {
      this.svm_free_model(this.model);
      this.model = null;
    }
  }

  // @ts-ignore: Emscripten generated object is used as an input
  private initiateAPIs(libsvm) {
    this.predict_one = libsvm.cwrap('libsvm_predict_one', 'number', ['number', 'array', 'number']);
    this.predict_one_probability = libsvm.cwrap('libsvm_predict_one_probability', 'number', [
      'number',
      'array',
      'number',
      'number',
    ]);
    this.add_instance = libsvm.cwrap('add_instance', null, ['number', 'array', 'number', 'number', 'number']);
    this.create_svm_nodes = libsvm.cwrap('create_svm_nodes', 'number', ['number', 'number']);
    this.train_problem = libsvm.cwrap('libsvm_train_problem', 'number', ['number', 'string']);
    this.svm_get_nr_sv = libsvm.cwrap('svm_get_nr_sv', 'number', ['number']);
    this.svm_get_nr_class = libsvm.cwrap('svm_get_nr_class', 'number', ['number']);
    this.svm_get_sv_indices = libsvm.cwrap('svm_get_sv_indices', null, ['number', 'number']);
    this.svm_get_labels = libsvm.cwrap('svm_get_labels', null, ['number', 'number']);
    this.svm_free_model = libsvm.cwrap('svm_free_model', null, ['number']);
    this.svm_cross_validation = libsvm.cwrap('libsvm_cross_validation', null, ['number', 'string', 'number', 'number']);
    this.svm_get_svr_probability = libsvm.cwrap('svm_get_svr_probability', 'number', ['number']);
    this.free_problem = libsvm.cwrap('free_problem', null, ['number']);
    this.serialize_model = libsvm.cwrap('serialize_model', 'number', ['number']);
    this.deserialize_model = libsvm.cwrap('deserialize_model', 'number', ['string']);
  }

  private getCommand(args: { samples: number[][] }) {
    const { samples } = args;
    const options = {};
    Object.assign(options, this.options, {
      gamma: this.options.gamma ? this.options.gamma : 1 / samples[0].length,
    });
    return getCommand(options);
  }

  private createProblem(args: { samples: number[][]; labels: number[] }): number {
    const { samples, labels } = args;
    const nbSamples = samples.length;
    const nbFeatures = labels.length;
    const problem = this.create_svm_nodes(nbSamples, nbFeatures);
    for (let i = 0; i < nbSamples; i++) {
      this.add_instance(problem, new Uint8Array(new Float64Array(samples[i]).buffer), nbFeatures, labels[i], i);
    }
    return problem;
  }

  private getIntArrayFromModel(args: { fn: (a: number, b: number) => void; model: number; size: number }): number[] {
    const { fn, model, size } = args;
    const offset = this.libsvm._malloc(size * 4);
    fn(model, offset);
    const data = this.libsvm.HEAP32.subarray(offset / 4, offset / 4 + size);
    // Casting any received from HEAP32 as number[]
    const arr = Array.from(data) as number[];
    this.libsvm._free(offset);
    return arr;
  }

  private getInterval(args: { confidence: number }) {
    const { confidence } = args;
    const sigma = this.svm_get_svr_probability(this.model);
    if (sigma === 0) {
      throw SVMError('the model is not a regression with probability estimates');
    }

    if (confidence <= 0 || confidence >= 1) {
      throw SVMError('confidence must be greater than 0 and less than 1');
    }

    const p = (1 - confidence) / 2;
    return sigma * Math.sign(p - 0.5) * Math.log2(1 - 2 * Math.abs(p - 0.5));
  }
}
