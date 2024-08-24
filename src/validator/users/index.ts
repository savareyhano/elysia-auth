import { t } from 'elysia';

interface UsersValidator {
  postUserPayloadSchema: ReturnType<typeof t.Object>;
}

const usersValidator: UsersValidator = {
  postUserPayloadSchema: t.Object({
    username: t.String({
      minLength: 1,
    }),
    password: t.String({
      minLength: 1,
    }),
    fullname: t.String({
      minLength: 1,
    }),
  }),
};

export default usersValidator;
