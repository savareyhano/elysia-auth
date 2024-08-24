import { Elysia } from 'elysia';
import swagger from '@elysiajs/swagger';
import { jwt } from '@elysiajs/jwt';

// tokenize
import tokenManager from './tokenize/token-manager';

// services
import UsersService from './services/postgres/users-service';
import AuthenticationsService
  from './services/postgres/authentications-service';

// validator
import usersValidator from './validator/users';
import authenticationsValidator from './validator/authentications';

// api
import users from './api/users';
import authentications from './api/authentications';

const app = new Elysia()
  .use(swagger())
  .use(
    jwt({
      name: 'accessJwt',
      secret: process.env.ACCESS_JWT_SECRET as string,
      exp: process.env.ACCESS_JWT_EXP,
    })
  )
  .use(
    jwt({
      name: 'refreshJwt',
      secret: process.env.REFRESH_JWT_SECRET as string,
      exp: process.env.REFRESH_JWT_EXP,
    })
  )
  .use(users(new UsersService(), usersValidator))
  .use(
    authentications(
      new AuthenticationsService(),
      new UsersService(),
      tokenManager,
      authenticationsValidator
    )
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
