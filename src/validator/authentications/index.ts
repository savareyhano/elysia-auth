import { t } from 'elysia';

interface AuthenticationHandler {
  getAuthenticationRefreshCookieSchema: ReturnType<typeof t.Cookie>;
  postAuthenticationLoginPayloadSchema: ReturnType<typeof t.Object>;
  deleteAuthenticationLogoutCookieSchema: ReturnType<typeof t.Object>;
}

const authenticationsValidator: AuthenticationHandler = {
  getAuthenticationRefreshCookieSchema: t.Cookie({
    jwt: t.String({
      minLength: 1,
    }),
  }),
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
};

export default authenticationsValidator;
