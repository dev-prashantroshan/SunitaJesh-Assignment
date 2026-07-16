export class ApiError extends Error {
  statusCode: number;
  code?: string;
  isOperational: boolean;
  exposeStack: boolean;

  constructor(
    statusCode: number,
    message: string,
    code?: string,
    options?: { exposeStack?: boolean }
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.exposeStack = options?.exposeStack ?? true;

    Error.captureStackTrace(this, this.constructor);
  }
}
