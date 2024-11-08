type ErrorMessage = {
  [key: number]: string;
};

const errorMessage: ErrorMessage = {
  400: "Bad Request",
  401: "Not authorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

export class CustomError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const ApiError = (status: number, message: string = errorMessage[status]) => {
  const error = new CustomError(status, message);
  return error;
};

export default ApiError;
