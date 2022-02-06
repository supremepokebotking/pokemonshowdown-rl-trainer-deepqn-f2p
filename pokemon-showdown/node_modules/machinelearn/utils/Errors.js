"use strict";
// NOTE: Below custom errors are hack because Jest has a bug with asserting error types
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The error is used for class initiation failures due to invalid arguments.
 * @ignore
 */
exports.ConstructionError = function (message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
};
/**
 * The error is used for any validation errors. Such as an argument type check failure would raise this error.
 * @ignore
 */
exports.ValidationError = function (message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
};
/**
 * @ignore
 */
exports.Validation1DMatrixError = function (message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
};
/**
 * @ignore
 */
exports.Validation2DMatrixError = function (message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
};
/**
 * The error is used when a matrix does not contain a consistent type for its elements
 * @ignore
 */
exports.ValidationMatrixTypeError = function (message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
};
/**
 * @ignore
 */
exports.ValidationClassMismatch = function (message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
};
/**
 * @ignore
 */
exports.ValidationKeyNotFoundError = function (message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
};
/**
 * @ignore
 */
exports.ValidationInconsistentShape = function (message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi91dGlscy9FcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVGQUF1Rjs7QUFFdkY7OztHQUdHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBRyxVQUFTLE9BQU87SUFDL0MsS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztJQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN6QixDQUFDLENBQUM7QUFFRjs7O0dBR0c7QUFDVSxRQUFBLGVBQWUsR0FBRyxVQUFTLE9BQU87SUFDN0MsS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztJQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN6QixDQUFDLENBQUM7QUFFRjs7R0FFRztBQUNVLFFBQUEsdUJBQXVCLEdBQUcsVUFBUyxPQUFPO0lBQ3JELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2hELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDekIsQ0FBQyxDQUFDO0FBRUY7O0dBRUc7QUFDVSxRQUFBLHVCQUF1QixHQUFHLFVBQVMsT0FBTztJQUNyRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0lBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3pCLENBQUMsQ0FBQztBQUVGOzs7R0FHRztBQUNVLFFBQUEseUJBQXlCLEdBQUcsVUFBUyxPQUFPO0lBQ3ZELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2hELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDekIsQ0FBQyxDQUFDO0FBRUY7O0dBRUc7QUFDVSxRQUFBLHVCQUF1QixHQUFHLFVBQVMsT0FBTztJQUNyRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0lBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3pCLENBQUMsQ0FBQztBQUVGOztHQUVHO0FBQ1UsUUFBQSwwQkFBMEIsR0FBRyxVQUFTLE9BQU87SUFDeEQsS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztJQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN6QixDQUFDLENBQUM7QUFFRjs7R0FFRztBQUNVLFFBQUEsMkJBQTJCLEdBQUcsVUFBUyxPQUFPO0lBQ3pELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2hELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDekIsQ0FBQyxDQUFDIn0=