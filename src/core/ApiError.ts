export enum ErrorType {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL = 500,
}

export class ApiError extends Error {
  constructor(
    public statusCode: ErrorType,
    public message: string,
  ) {
    super(message);
  }
}


export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(ErrorType.BAD_REQUEST, message);
  }
}

export class AuthFailureError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(ErrorType.UNAUTHORIZED, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(ErrorType.FORBIDDEN, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(ErrorType.NOT_FOUND, message);
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal Server Error') {
    super(ErrorType.INTERNAL, message);
  }
}