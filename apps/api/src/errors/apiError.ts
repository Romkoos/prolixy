/**
 * Represents a controlled API error that should be exposed to clients.
 */
export class ApiError extends Error {
  public readonly statusCode: number;

  public constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}
