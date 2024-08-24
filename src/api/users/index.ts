import { Elysia } from 'elysia';
import UsersHandler from './handler';
import routes from './routes';

const users = (usersService: any, validator: any) =>
  new Elysia().use(routes(new UsersHandler(usersService), validator));

export default users;
