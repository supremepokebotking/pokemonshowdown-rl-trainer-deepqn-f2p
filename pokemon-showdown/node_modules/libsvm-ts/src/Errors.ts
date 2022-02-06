/**
 * The error is used when a matrix does not contain a consistent type for its elements
 * @ignore
 */
export const UtilError = function(message: string | Error) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
};

/**
 * The error is used when a matrix does not contain a consistent type for its elements
 * @ignore
 */
export const SVMError = function(message: string | Error) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
};

export const WASMError = function(message: string | Error) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
};
