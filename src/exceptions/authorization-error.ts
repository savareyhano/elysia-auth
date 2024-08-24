import ClientError from './client-error';

class AuthorizationError extends ClientError {
  constructor(message: string) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export default AuthorizationError;
