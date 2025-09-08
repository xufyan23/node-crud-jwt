export class ApiError extends Error {
  statusCode: number;
  success: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;

		//capture where the error occurred
    Error.captureStackTrace(this, this.constructor);
  }
}
