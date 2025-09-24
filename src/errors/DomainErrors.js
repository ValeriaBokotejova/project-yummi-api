export class NotFoundError extends Error {
  constructor(entity = "Resource") {
    super(`${entity} not found`);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message = "Conflict occurred") {
    super(message);
    this.name = "ConflictError";
  }
}

export class ValidationError extends Error {
  constructor(message = "Validation failed") {
    super(message);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Not authorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class DuplicateError extends Error {
  constructor(message = "Resource already exists") {
    super(message);
    this.name = "DuplicateError";
  }
}
