import { Elysia } from 'elysia';
import cron, { Patterns } from '@elysiajs/cron';
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

const usersService = new UsersService();
const authenticationsService = new AuthenticationsService();

const app = new Elysia()
  // docs:
  // https://elysiajs.com/plugins/cron
  .use(
    cron({
      name: 'clean-expired-tokens',
      pattern: Patterns.EVERY_DAY_AT_MIDNIGHT,
      async run() {
        try {
          await authenticationsService.removeExpiredRefreshTokens();
          console.log('Expired tokens successfully cleaned.');
        } catch (error) {
          console.error(`Failed to clean expired tokens: ${error}`);
        }
      },
    })
  )
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
  .use(users(usersService, usersValidator))
  .use(
    authentications(
      authenticationsService,
      usersService,
      tokenManager,
      authenticationsValidator
    )
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
