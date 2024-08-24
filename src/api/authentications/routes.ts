import { Elysia } from 'elysia';

const routes = (handler: any, validator: any) =>
  new Elysia()
    .post(
      '/authentications/login',
      ({ body, accessJwt, refreshJwt, cookie: { jwt }, set }: any) =>
        handler.postAuthenticationLoginHandler(
          body,
          accessJwt,
          refreshJwt,
          jwt,
          set
        ),
      {
        body: validator.postAuthenticationLoginPayloadSchema,
      }
    )
    .get(
      '/authentications/refresh',
      ({ accessJwt, refreshJwt, cookie: { jwt }, set }: any) =>
        handler.getAuthenticationRefreshHandler(accessJwt, refreshJwt, jwt, set),
      {
        cookie: validator.getAuthenticationRefreshCookieSchema,
      }
    );

export default routes;
