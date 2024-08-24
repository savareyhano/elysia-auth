import { Elysia } from 'elysia';
import AuthenticationHandler from './handler';
import routes from './routes';

const authentications = (
  authenticationsService: any,
  usersService: any,
  tokenManager: any,
  validator: any
) =>
  new Elysia().use(
    routes(
      new AuthenticationHandler(
        authenticationsService,
        usersService,
        tokenManager
      ),
      validator
    )
  );

export default authentications;
