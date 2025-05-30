export class ApiError extends Error {
  // HTTP status code associated with the error.
  statusCode: number;
  constructor(statusCode: number, message: string) {
    // Call the parent Error class constructor with the error message.
    super(message);
    // Set the statusCode property for this instance.
    this.statusCode = statusCode;
  }
}
