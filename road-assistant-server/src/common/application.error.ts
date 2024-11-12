import { HttpStatus } from '@nestjs/common';

export class ApplicationError extends Error {
  public type: string;
  public readonly statusCode: HttpStatus;
  public readonly message: string;

  constructor(message: string, statusCode = HttpStatus.BAD_REQUEST) {
    super(message);
    this.type = this.constructor.name;
    this.statusCode = statusCode;
    if (!this.message) {
      this.message = this.type;
    }
  }
}
