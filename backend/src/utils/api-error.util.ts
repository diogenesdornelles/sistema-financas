/**
 * Custom error class for API errors.
 * Extends the built-in Error class to include an HTTP status code.
 */
export class ApiError extends Error {
  // HTTP status code associated with the error.
  statusCode: number;

  /**
   * Creates an instance of ApiError.
   *
   * @param {number} statusCode - The HTTP status code for the error.
   * @param {string} message - A descriptive error message.
   */
  constructor(statusCode: number, message: string) {
    // Call the parent Error class constructor with the error message.
    super(message);
    // Set the statusCode property for this instance.
    this.statusCode = statusCode;
  }
}
