import ClientError from './client-error';

class AuthenticationError extends ClientError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export default AuthenticationError;
