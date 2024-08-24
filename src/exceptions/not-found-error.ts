import ClientError from './client-error';

class NotFoundError extends ClientError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
