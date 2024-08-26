import { t } from 'elysia';

interface AuthenticationHandler {
  postAuthenticationLoginPayloadSchema: ReturnType<typeof t.Object>;
  deleteAuthenticationLogoutCookieSchema: ReturnType<typeof t.Object>;
  getAuthenticationRefreshCookieSchema: ReturnType<typeof t.Cookie>;
}

const authenticationsValidator: AuthenticationHandler = {
  postAuthenticationLoginPayloadSchema: t.Object({
    username: t.String({
      minLength: 1,
    }),
    password: t.String({
      minLength: 1,
    }),
  }),
  deleteAuthenticationLogoutCookieSchema: t.Cookie({
    jwt: t.String({
      minLength: 1,
    }),
  }),
  getAuthenticationRefreshCookieSchema: t.Cookie({
    jwt: t.String({
      minLength: 1,
    }),
  }),
};

export default authenticationsValidator;
