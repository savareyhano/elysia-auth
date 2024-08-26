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
    .delete(
      '/authentications/logout',
      ({ cookie: { jwt }, set }: any) =>
        handler.deleteAuthenticationLogoutHandler(jwt, set),
      {
        cookie: validator.deleteAuthenticationLogoutCookieSchema,
      }
    )
    .get(
      '/authentications/refresh',
      ({ accessJwt, refreshJwt, cookie: { jwt }, set }: any) =>
        handler.getAuthenticationRefreshHandler(
          accessJwt,
          refreshJwt,
          jwt,
          set
        ),
      {
        cookie: validator.getAuthenticationRefreshCookieSchema,
      }
    );

export default routes;
